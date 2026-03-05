import { AST_NODE_TYPES } from '@typescript-eslint/types';

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that Combobox components have the required hierarchical structure: Combobox must contain ComboboxInput/ComboboxChips and ComboboxContent, and ComboboxContent must contain ComboboxList',
      recommended: true,
    },
    messages: {
      missingInput:
        'Combobox must contain ComboboxInput or ComboboxChips component',
      missingContent: 'Combobox must contain ComboboxContent component',
      missingList: 'ComboboxContent must contain ComboboxList component',
      missingItem: 'ComboboxList should contain at least one ComboboxItem',
    },
    schema: [],
  },
  create(context) {
    function isCombobox(node: TSESTree.JSXOpeningElement): boolean {
      const name = node.name;
      if (name.type === AST_NODE_TYPES.JSXIdentifier) {
        return name.name === 'Combobox';
      }
      return false;
    }

    function isComboboxContent(node: TSESTree.JSXOpeningElement): boolean {
      const name = node.name;
      if (name.type === AST_NODE_TYPES.JSXIdentifier) {
        return name.name === 'ComboboxContent';
      }
      return false;
    }

    function findChildren(
      node: TSESTree.JSXElement,
      componentNames: string[],
    ): boolean {
      function traverse(element: TSESTree.Node): boolean {
        if (element.type === AST_NODE_TYPES.JSXElement) {
          const jsxElement = element;
          const openingName = jsxElement.openingElement.name;
          const name
            = openingName.type === AST_NODE_TYPES.JSXIdentifier
              ? openingName.name
              : null;

          if (name && componentNames.includes(name)) {
            return true;
          }

          const children = jsxElement.children;
          if (children) {
            for (const child of children) {
              if (traverse(child)) return true;
            }
          }
        }
        else if (element.type === AST_NODE_TYPES.JSXExpressionContainer) {
          const container = element;
          const expr = container.expression;
          if (expr.type === AST_NODE_TYPES.JSXElement) {
            return traverse(expr);
          }
        }
        return false;
      }

      const children = node.children;
      if (children) {
        for (const child of children) {
          if (traverse(child)) return true;
        }
      }

      return false;
    }

    return {
      JSXElement(node: Rule.Node) {
        const jsxElement = node as unknown as TSESTree.JSXElement;

        if (isCombobox(jsxElement.openingElement)) {
          const hasInput = findChildren(jsxElement, ['ComboboxInput', 'ComboboxChips']);
          const hasContent = findChildren(jsxElement, ['ComboboxContent']);

          if (!hasInput) {
            context.report({
              node: jsxElement.openingElement as unknown as Rule.Node,
              messageId: 'missingInput',
            });
          }

          if (!hasContent) {
            context.report({
              node: jsxElement.openingElement as unknown as Rule.Node,
              messageId: 'missingContent',
            });
          }
        }

        if (isComboboxContent(jsxElement.openingElement)) {
          const hasList = findChildren(jsxElement, ['ComboboxList']);

          if (!hasList) {
            context.report({
              node: jsxElement.openingElement as unknown as Rule.Node,
              messageId: 'missingList',
            });
          }
        }
      },
    };
  },
};

export default rule;
