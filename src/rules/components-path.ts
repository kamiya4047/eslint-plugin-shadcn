import { dirname, join, resolve } from 'node:path';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

import { AST_NODE_TYPES } from '@typescript-eslint/types';

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';

interface ComponentsConfig {
  $schema?: string;
  style?: string;
  tailwind?: {
    config?: string;
    css?: string;
    baseColor?: string;
    cssVariables?: boolean;
    prefix?: string;
  };
  rsc?: boolean;
  tsx?: boolean;
  aliases?: {
    utils?: string;
    components?: string;
    ui?: string;
    lib?: string;
    hooks?: string;
  };
}

interface CachedProjectConfig {
  projectRoot: string;
  config: ComponentsConfig | null;
  uiPath: string;
  availableComponents: Set<string>;
}

const projectConfigCache = new Map<string, CachedProjectConfig>();

export function clearProjectConfigCache(): void {
  projectConfigCache.clear();
}

function findComponentsJson(startPath: string): string | null {
  let currentDir: string = dirname(startPath);
  const maxDepth = 10;

  for (let i = 0; i < maxDepth; i++) {
    const componentsJsonPath: string = join(currentDir, 'components.json');

    if (existsSync(componentsJsonPath)) {
      return componentsJsonPath;
    }

    const parentDir: string = dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }

  return null;
}

function findProjectRoot(startPath: string): string | null {
  const componentsJsonPath: string | null = findComponentsJson(startPath);
  if (!componentsJsonPath) {
    return null;
  }

  return dirname(componentsJsonPath);
}

function loadComponentsConfig(
  componentsJsonPath: string,
): ComponentsConfig | null {
  try {
    const content: string = readFileSync(componentsJsonPath, 'utf-8');
    return JSON.parse(content) as ComponentsConfig;
  }
  catch {
    return null;
  }
}

function getAvailableComponents(
  projectRoot: string,
  uiAlias: string,
): Set<string> {
  const components = new Set<string>();

  try {
    const uiPath: string = uiAlias.replace(/^@\//, 'src/').replace(/^~\//, './');
    const fullPath: string = resolve(projectRoot, uiPath);

    if (!existsSync(fullPath)) {
      return components;
    }

    const files: string[] = readdirSync(fullPath);

    for (const file of files) {
      const match: RegExpExecArray | null = /^(.+)\.(tsx?|jsx?)$/.exec(file);
      if (match?.[1]) {
        components.add(match[1]);
      }
    }
  }
  catch {
  }

  return components;
}

function getProjectConfig(filePath: string): CachedProjectConfig | null {
  const projectRoot: string | null = findProjectRoot(filePath);
  if (!projectRoot) {
    return null;
  }

  const cached: CachedProjectConfig | undefined = projectConfigCache.get(projectRoot);
  if (cached) {
    return cached;
  }

  const componentsJsonPath: string = join(projectRoot, 'components.json');
  const config: ComponentsConfig | null = loadComponentsConfig(componentsJsonPath);
  const uiPath: string = config?.aliases?.ui ?? '@/components/ui';
  const availableComponents: Set<string> = getAvailableComponents(projectRoot, uiPath);

  const cachedConfig: CachedProjectConfig = {
    projectRoot,
    config,
    uiPath,
    availableComponents,
  };

  projectConfigCache.set(projectRoot, cachedConfig);
  return cachedConfig;
}

const UI_PRIMITIVE_PACKAGES = [
  '@radix-ui/',
  '@base-ui/',
  'radix-ui',
] as const;

function mapPackageToComponent(packageName: string): string | null {
  if (packageName.startsWith('@radix-ui/react-')) {
    return packageName.replace('@radix-ui/react-', '');
  }

  if (packageName.startsWith('@base-ui/react-')) {
    return packageName.replace('@base-ui/react-', '');
  }

  return null;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Prevent direct imports from UI primitive packages (@radix-ui, @base-ui) when component exists in local components/ui',
      recommended: true,
    },
    messages: {
      useLocalComponent:
        '"{{ componentName }}" should be imported from local components folder "{{ expectedPath }}". If you need to use the primitives directly, use a namespace import or an aliased import.',
      suggestLocalImport:
        'Change to local component import from "{{ expectedPath }}"',
      suggestNamespaceImport:
        'Change to namespace import (import * as {{ namespaceName }} from "{{ packageName }}")',
      suggestAliasedImport:
        'Change to aliased import (import { {{ importedName }} as {{ aliasedName }} } from "{{ packageName }}")',
    },
    schema: [],
    hasSuggestions: true,
  },
  create(context) {
    const filename = context.filename;

    const projectConfig = getProjectConfig(filename);
    if (!projectConfig) {
      return {};
    }

    const { uiPath, availableComponents } = projectConfig;

    function isUIPrimitiveImport(importPath: string): boolean {
      return UI_PRIMITIVE_PACKAGES.some((pkg) => importPath.startsWith(pkg));
    }

    return {
      ImportDeclaration(node: Rule.Node) {
        const importDecl = node as unknown as TSESTree.ImportDeclaration;
        if (!importDecl.source.value || typeof importDecl.source.value !== 'string') {
          return;
        }

        const importPath = importDecl.source.value;
        const sourceCode = context.sourceCode?.getText(importDecl.source as unknown as Rule.Node) || '';
        const quote = sourceCode.startsWith('\'') ? '\'' : '"';

        if (!isUIPrimitiveImport(importPath)) {
          return;
        }

        if (importPath === 'radix-ui') {
          for (const specifier of importDecl.specifiers) {
            if (specifier.type !== AST_NODE_TYPES.ImportSpecifier) {
              continue;
            }

            const importSpecifier = specifier;

            if (importSpecifier.imported.type !== AST_NODE_TYPES.Identifier) {
              continue;
            }

            const importedName = importSpecifier.imported.name;
            const localName = importSpecifier.local.name;

            if (importedName !== localName) {
              continue;
            }

            const componentName = importedName
              .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
              .toLowerCase();

            if (availableComponents.has(componentName)) {
              const expectedPath = `${uiPath}/${componentName}`;
              const aliasedName = `${importedName}Primitive`;

              context.report({
                node: importSpecifier as unknown as Rule.Node,
                messageId: 'useLocalComponent',
                data: {
                  componentName: importedName,
                  expectedPath,
                  packageName: importPath,
                },
                suggest: [
                  {
                    messageId: 'suggestLocalImport',
                    data: {
                      expectedPath,
                    },
                    fix(fixer) {
                      return fixer.replaceText(
                        node,
                        `import { ${importedName} } from ${quote}${expectedPath}${quote};`,
                      );
                    },
                  },
                  {
                    messageId: 'suggestAliasedImport',
                    data: {
                      importedName,
                      aliasedName,
                      packageName: importPath,
                    },
                    fix(fixer) {
                      return fixer.replaceText(
                        node,
                        `import { ${importedName} as ${aliasedName} } from ${quote}${importPath}${quote};`,
                      );
                    },
                  },
                ],
              });
            }
          }
          return;
        }

        const componentName = mapPackageToComponent(importPath);

        if (componentName && availableComponents.has(componentName)) {
          const expectedPath = `${uiPath}/${componentName}`;
          const pascalCaseName = componentName
            .split('-')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');
          const namespaceName = `${pascalCaseName}Primitive`;

          context.report({
            node: importDecl.source as unknown as Rule.Node,
            messageId: 'useLocalComponent',
            data: {
              componentName: pascalCaseName,
              expectedPath,
              packageName: importPath,
            },
            suggest: [
              {
                messageId: 'suggestLocalImport',
                data: {
                  expectedPath,
                },
                fix(fixer) {
                  return fixer.replaceText(importDecl.source as unknown as Rule.Node, `${quote}${expectedPath}${quote}`);
                },
              },
              {
                messageId: 'suggestNamespaceImport',
                data: {
                  namespaceName,
                  packageName: importPath,
                },
                fix(fixer) {
                  return fixer.replaceText(
                    node,
                    `import * as ${namespaceName} from ${quote}${importPath}${quote};`,
                  );
                },
              },
            ],
          });
        }
      },
    };
  },
};

export default rule;
