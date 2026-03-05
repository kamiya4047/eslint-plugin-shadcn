import { AST_NODE_TYPES } from '@typescript-eslint/types';

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that AccordionItem components have the required AccordionTrigger and AccordionContent children',
      recommended: true,
    },
    messages: {
      missingTrigger: 'AccordionItem must contain AccordionTrigger component',
      missingContent: 'AccordionItem must contain AccordionContent component',
    },
    schema: [],
  },
  create(context) {
    function isAccordionItem(node: TSESTree.JSXOpeningElement): boolean {
      const name = node.name;
      if (name.type === AST_NODE_TYPES.JSXIdentifier) {
        return name.name === 'AccordionItem';
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
        if (!isAccordionItem(jsxElement.openingElement)) {
          return;
        }

        const hasTrigger = findChildren(jsxElement, ['AccordionTrigger']);
        const hasContent = findChildren(jsxElement, ['AccordionContent']);

        if (!hasTrigger) {
          context.report({
            node: jsxElement.openingElement as unknown as Rule.Node,
            messageId: 'missingTrigger',
          });
        }

        if (!hasContent) {
          context.report({
            node: jsxElement.openingElement as unknown as Rule.Node,
            messageId: 'missingContent',
          });
        }
      },
    };
  },
};

export default rule;
