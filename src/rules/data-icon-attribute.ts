import { AST_NODE_TYPES } from '@typescript-eslint/types';

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';

const DEFAULT_COMPONENTS = ['Button', 'Badge'];

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce data-icon attribute on icons, spinners, and keyboard keys within components for correct spacing',
      recommended: true,
    },
    messages: {
      missingDataIcon:
        'Icon, Spinner, or Kbd within {{component}} must have data-icon="inline-start" or data-icon="inline-end" attribute for correct spacing',
      invalidDataIconValue:
        'data-icon attribute must be either "inline-start" or "inline-end"',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignore: {
            type: 'array',
            items: { type: 'string' },
            description: 'Component names to ignore (default: Button, Badge)',
          },
        },
        additionalProperties: false,
      },
    ],
    fixable: 'code',
  },
  create(context) {
    const options = (context.options[0] as Record<string, unknown> | undefined) ?? {};
    const ignore = new Set((options.ignore as string[] | undefined) ?? []);
    const componentsToCheck = DEFAULT_COMPONENTS.filter((c) => !ignore.has(c));

    const iconComponents = new Set<string>();
    const uiComponents = new Set<string>();

    function isIconComponent(name: string): boolean {
      return name === 'Spinner' || name === 'Kbd' || iconComponents.has(name);
    }

    function isTrackedComponent(node: TSESTree.JSXOpeningElement): string | null {
      if (node.name.type === AST_NODE_TYPES.JSXIdentifier) {
        const name = node.name.name;
        if (componentsToCheck.includes(name) && uiComponents.has(name)) {
          return name;
        }
      }
      return null;
    }

    function hasDataIconAttribute(node: TSESTree.JSXOpeningElement): {
      hasAttribute: boolean;
      isValid: boolean;
      attribute?: TSESTree.JSXAttribute;
    } {
      const dataIconAttr = node.attributes.find(
        (attr) =>
          attr.type === AST_NODE_TYPES.JSXAttribute
          && attr.name.type === AST_NODE_TYPES.JSXIdentifier
          && attr.name.name === 'data-icon',
      ) as TSESTree.JSXAttribute | undefined;

      if (!dataIconAttr) {
        return { hasAttribute: false, isValid: false };
      }

      if (!dataIconAttr.value) {
        return { hasAttribute: true, isValid: false, attribute: dataIconAttr };
      }

      if (dataIconAttr.value.type === AST_NODE_TYPES.Literal) {
        const value = dataIconAttr.value.value;
        const isValid = value === 'inline-start' || value === 'inline-end';
        return { hasAttribute: true, isValid, attribute: dataIconAttr };
      }

      return { hasAttribute: true, isValid: false, attribute: dataIconAttr };
    }

    function getIconPosition(iconNode: TSESTree.JSXElement, allChildren: TSESTree.Node[]): 'start' | 'end' {
      const iconIndex = allChildren.indexOf(iconNode);

      // Count meaningful content before and after the icon
      let hasContentBefore = false;

      for (let i = 0; i < allChildren.length; i++) {
        const child = allChildren[i];
        if (!child) continue;

        const hasMeaningfulContent
          = child.type === AST_NODE_TYPES.JSXElement
            || child.type === AST_NODE_TYPES.JSXFragment
            || (child.type === AST_NODE_TYPES.JSXExpressionContainer
              && child.expression.type !== AST_NODE_TYPES.JSXEmptyExpression)
            || (child.type === AST_NODE_TYPES.JSXText && child.value.trim().length > 0);

        if (!hasMeaningfulContent) {
          continue;
        }

        if (i < iconIndex) {
          hasContentBefore = true;
          break;
        }
      }

      return hasContentBefore ? 'end' : 'start';
    }

    return {
      ImportDeclaration(node: Rule.Node) {
        const importDecl = node as unknown as TSESTree.ImportDeclaration;
        if (!importDecl.source.value || typeof importDecl.source.value !== 'string') {
          return;
        }

        const source = importDecl.source.value.toLowerCase();

        const isUIComponentImport
          = source.includes('/components/ui/button')
            || source.includes('/components/ui/badge')
            || source.includes('/components/ui');

        if (isUIComponentImport) {
          importDecl.specifiers.forEach((spec) => {
            if (spec.type === AST_NODE_TYPES.ImportSpecifier && spec.imported.type === AST_NODE_TYPES.Identifier) {
              const name = spec.imported.name;
              if (componentsToCheck.includes(name)) {
                uiComponents.add(name);
              }
            }
            if (spec.type === AST_NODE_TYPES.ImportDefaultSpecifier) {
              const name = spec.local.name;
              if (componentsToCheck.includes(name)) {
                uiComponents.add(name);
              }
            }
          });
        }

        const isIconPackage
          = source.includes('icon')
            || source.includes('lucide')
            || source.includes('tabler')
            || source.includes('hero')
            || source.includes('feather')
            || source.includes('phosphor')
            || source.includes('radix-icons');

        if (isIconPackage) {
          importDecl.specifiers.forEach((spec) => {
            if (spec.type === AST_NODE_TYPES.ImportSpecifier && spec.imported.type === AST_NODE_TYPES.Identifier) {
              iconComponents.add(spec.imported.name);
            }
            if (spec.type === AST_NODE_TYPES.ImportDefaultSpecifier) {
              iconComponents.add(spec.local.name);
            }
          });
        }
      },

      JSXElement(node: Rule.Node) {
        const jsxElement = node as unknown as TSESTree.JSXElement;
        const componentName = isTrackedComponent(jsxElement.openingElement);
        if (!componentName) {
          return;
        }

        if (!jsxElement.children || jsxElement.children.length === 0) {
          return;
        }

        const children = jsxElement.children.filter(
          (child) =>
            child.type === AST_NODE_TYPES.JSXElement
            || child.type === AST_NODE_TYPES.JSXFragment
            || (child.type === AST_NODE_TYPES.JSXExpressionContainer
              && child.expression.type !== AST_NODE_TYPES.JSXEmptyExpression),
        );

        for (const child of children) {
          if (child.type !== AST_NODE_TYPES.JSXElement) {
            continue;
          }

          const childElement = child;
          if (childElement.openingElement.name.type !== AST_NODE_TYPES.JSXIdentifier) {
            continue;
          }

          const iconName = childElement.openingElement.name.name;
          if (!isIconComponent(iconName)) {
            continue;
          }

          const { hasAttribute, isValid, attribute } = hasDataIconAttribute(
            childElement.openingElement,
          );

          if (!hasAttribute) {
            const position = getIconPosition(childElement, jsxElement.children);
            const suggestedValue = `inline-${position}`;

            context.report({
              node: childElement.openingElement as unknown as Rule.Node,
              messageId: 'missingDataIcon',
              data: {
                component: componentName,
              },
              fix(fixer) {
                const name = childElement.openingElement.name;
                const attributes = childElement.openingElement.attributes;

                if (attributes.length === 0) {
                  return fixer.insertTextAfter(name as unknown as Rule.Node, ` data-icon="${suggestedValue}"`);
                }
                else {
                  return fixer.insertTextBefore(attributes[0] as unknown as Rule.Node, `data-icon="${suggestedValue}" `);
                }
              },
            });
          }
          else if (!isValid && attribute) {
            context.report({
              node: attribute as unknown as Rule.Node,
              messageId: 'invalidDataIconValue',
            });
          }
        }
      },
    };
  },
};

export default rule;
