import { AST_NODE_TYPES } from '@typescript-eslint/types';

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';

const DEFAULT_COMPONENTS = ['Switch', 'SelectTrigger', 'Input', 'Textarea', 'Checkbox', 'RadioGroup'];

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce data-disabled attribute on Field when components have disabled prop',
      recommended: true,
    },
    messages: {
      missingDataDisabled:
        'Field component must have data-disabled attribute when {{component}} is disabled',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignore: {
            type: 'array',
            items: { type: 'string' },
            description: 'Component names to ignore (default: Switch, SelectTrigger, Input, Textarea, Checkbox, RadioGroup)',
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

    function isTrackedComponent(node: TSESTree.JSXOpeningElement): string | null {
      if (node.name.type === AST_NODE_TYPES.JSXIdentifier) {
        const name = node.name.name;
        if (componentsToCheck.includes(name)) {
          return name;
        }
      }
      return null;
    }

    function hasDisabledProp(node: TSESTree.JSXOpeningElement): boolean {
      return node.attributes.some(
        (attr) =>
          attr.type === AST_NODE_TYPES.JSXAttribute
          && attr.name.type === AST_NODE_TYPES.JSXIdentifier
          && attr.name.name === 'disabled',
      );
    }

    function isFieldComponent(node: TSESTree.JSXOpeningElement): boolean {
      if (node.name.type === AST_NODE_TYPES.JSXIdentifier) {
        return node.name.name === 'Field';
      }
      return false;
    }

    function hasDataDisabledAttribute(node: TSESTree.JSXOpeningElement): boolean {
      return node.attributes.some(
        (attr) =>
          attr.type === AST_NODE_TYPES.JSXAttribute
          && attr.name.type === AST_NODE_TYPES.JSXIdentifier
          && attr.name.name === 'data-disabled',
      );
    }

    function findParentField(node: TSESTree.Node): TSESTree.JSXElement | null {
      let parent = node.parent;

      while (parent) {
        if (
          parent.type === AST_NODE_TYPES.JSXElement
          && isFieldComponent(parent.openingElement)
        ) {
          return parent;
        }
        parent = parent.parent;
      }

      return null;
    }

    return {
      JSXElement(node: Rule.Node) {
        const jsxElement = node as unknown as TSESTree.JSXElement;
        const componentName = isTrackedComponent(jsxElement.openingElement);
        if (!componentName) {
          return;
        }

        if (!hasDisabledProp(jsxElement.openingElement)) {
          return;
        }

        const parentField = findParentField(jsxElement);
        if (!parentField) {
          return;
        }

        if (!hasDataDisabledAttribute(parentField.openingElement)) {
          context.report({
            node: parentField.openingElement as unknown as Rule.Node,
            messageId: 'missingDataDisabled',
            data: {
              component: componentName,
            },
            fix(fixer) {
              const openingElement = parentField.openingElement;
              const name = openingElement.name;

              if (openingElement.attributes.length === 0) {
                return fixer.insertTextAfter(name as unknown as Rule.Node, ' data-disabled');
              }
              else {
                return fixer.insertTextBefore(
                  openingElement.attributes[0] as unknown as Rule.Node,
                  'data-disabled ',
                );
              }
            },
          });
        }
      },
    };
  },
};

export default rule;
