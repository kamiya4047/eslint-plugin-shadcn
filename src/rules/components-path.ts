import { dirname, join, resolve } from 'node:path';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

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

/**
 * Cache for project configurations
 * Key: project root path
 * Value: cached config data
 *
 * This cache persists across multiple file lints within the same ESLint run,
 * preventing us from reading components.json and scanning the components/ui
 * directory multiple times unnecessarily.
 */
const projectConfigCache = new Map<string, CachedProjectConfig>();

/**
 * Clears the project configuration cache
 * Useful for testing or when components.json changes
 */
export function clearProjectConfigCache(): void {
  projectConfigCache.clear();
}

/**
 * Finds components.json in the project root by walking up from the current file
 */
function findComponentsJson(startPath: string): string | null {
  let currentDir: string = dirname(startPath);
  const maxDepth = 10; // Prevent infinite loops

  for (let i = 0; i < maxDepth; i++) {
    const componentsJsonPath: string = join(currentDir, 'components.json');

    if (existsSync(componentsJsonPath)) {
      return componentsJsonPath;
    }

    const parentDir: string = dirname(currentDir);
    if (parentDir === currentDir) {
      break; // Reached root
    }
    currentDir = parentDir;
  }

  return null;
}

/**
 * Finds the project root (directory containing components.json)
 */
function findProjectRoot(startPath: string): string | null {
  const componentsJsonPath: string | null = findComponentsJson(startPath);
  if (!componentsJsonPath) {
    return null;
  }

  return dirname(componentsJsonPath);
}

/**
 * Reads and parses components.json
 */
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

/**
 * Gets list of available components in the components/ui directory
 */
function getAvailableComponents(
  projectRoot: string,
  uiAlias: string,
): Set<string> {
  const components = new Set<string>();

  try {
    // Convert alias to actual path (e.g., @/components/ui -> src/components/ui)
    // Common patterns: @/ -> src/, ~/ -> ./
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
    // Ignore errors
  }

  return components;
}

/**
 * Gets or creates cached project configuration
 */
function getProjectConfig(filePath: string): CachedProjectConfig | null {
  const projectRoot: string | null = findProjectRoot(filePath);
  if (!projectRoot) {
    return null;
  }

  // Check if we already have this project cached
  const cached: CachedProjectConfig | undefined = projectConfigCache.get(projectRoot);
  if (cached) {
    return cached;
  }

  // Load and cache the configuration

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

/**
 * Packages that contain UI primitives that shadcn/ui wraps
 */
const UI_PRIMITIVE_PACKAGES = [
  '@radix-ui/',
  '@base-ui/',
] as const;

/**
 * Map Radix UI package names to shadcn component names
 * e.g., @radix-ui/react-dialog -> dialog
 */
function mapPackageToComponent(packageName: string): string | null {
  // Handle @radix-ui/react-* pattern
  if (packageName.startsWith('@radix-ui/react-')) {
    return packageName.replace('@radix-ui/react-', '');
  }

  // Handle @base-ui/react-* pattern
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
        'Import "{{ componentName }}" from local components folder "{{ expectedPath }}" instead of directly from "{{ packageName }}"',
    },
    schema: [],
    fixable: 'code',
  },
  create(context) {
    const filename = context.filename;

    const projectConfig = getProjectConfig(filename);
    if (!projectConfig) {
      // No components.json found, skip this file
      return {};
    }

    const { uiPath, availableComponents } = projectConfig;

    /**
     * Check if importing from a UI primitive package
     */
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

        if (!isUIPrimitiveImport(importPath)) {
          return;
        }

        const componentName = mapPackageToComponent(importPath);

        if (componentName && availableComponents.has(componentName)) {
          const expectedPath = `${uiPath}/${componentName}`;

          context.report({
            node: importDecl.source as unknown as Rule.Node,
            messageId: 'useLocalComponent',
            data: {
              componentName,
              expectedPath,
              packageName: importPath,
            },
            fix(fixer) {
              return fixer.replaceText(importDecl.source as unknown as Rule.Node, `"${expectedPath}"`);
            },
          });
        }
      },
    };
  },
};

export default rule;
