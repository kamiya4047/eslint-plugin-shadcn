import { AST_NODE_TYPES } from '@typescript-eslint/types';

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that DialogContent components have required DialogTitle and DialogDescription for accessibility',
      recommended: true,
    },
    messages: {
      missingTitle:
        'DialogContent must contain a DialogTitle component for accessibility',
      missingDescription:
        'DialogContent must contain a DialogDescription component for accessibility',
    },
    schema: [],
  },
  create(context) {
    function isDialogContent(node: TSESTree.JSXOpeningElement): boolean {
      const name = node.name;
      if (name.type === AST_NODE_TYPES.JSXIdentifier) {
        return name.name === 'DialogContent';
      }
      return false;
    }

    function getDialogChildType(
      node: TSESTree.JSXOpeningElement,
    ): 'title' | 'description' | null {
      const name = node.name;
      if (name.type === AST_NODE_TYPES.JSXIdentifier) {
        if (name.name === 'DialogTitle') return 'title';
        if (name.name === 'DialogDescription') return 'description';
      }
      return null;
    }

    function findDialogChildren(
      node: TSESTree.JSXElement,
    ): { hasTitle: boolean; hasDescription: boolean } {
      let hasTitle = false;
      let hasDescription = false;

      function traverse(element: TSESTree.Node) {
        if (element.type === AST_NODE_TYPES.JSXElement) {
          const jsxElement = element;
          const childType = getDialogChildType(jsxElement.openingElement);
          if (childType === 'title') {
            hasTitle = true;
          }
          else if (childType === 'description') {
            hasDescription = true;
          }

          const children = jsxElement.children;
          if (children) {
            for (const child of children) {
              traverse(child);
            }
          }
        }
        else if (element.type === AST_NODE_TYPES.JSXExpressionContainer) {
          const container = element;
          const expr = container.expression;
          if (expr.type === AST_NODE_TYPES.JSXElement) {
            traverse(expr);
          }
        }
      }

      const children = node.children;
      if (children) {
        for (const child of children) {
          traverse(child);
        }
      }

      return { hasTitle, hasDescription };
    }

    return {
      JSXElement(node: Rule.Node) {
        const jsxElement = node as unknown as TSESTree.JSXElement;
        if (!isDialogContent(jsxElement.openingElement)) {
          return;
        }

        const { hasTitle, hasDescription } = findDialogChildren(jsxElement);

        if (!hasTitle) {
          context.report({
            node: jsxElement.openingElement as unknown as Rule.Node,
            messageId: 'missingTitle',
          });
        }

        if (!hasDescription) {
          context.report({
            node: jsxElement.openingElement as unknown as Rule.Node,
            messageId: 'missingDescription',
          });
        }
      },
    };
  },
};

export default rule;
