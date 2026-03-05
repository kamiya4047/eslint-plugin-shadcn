import { AST_NODE_TYPES } from '@typescript-eslint/types';

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce wrapping disabled elements in a span when used inside TooltipTrigger',
      recommended: true,
    },
    messages: {
      wrapDisabledElement:
        'Disabled {{element}} inside TooltipTrigger must be wrapped in a <span> element. Disabled elements do not receive pointer events.',
    },
    schema: [],
    fixable: 'code',
  },
  create(context) {
    function isTooltipTrigger(node: TSESTree.JSXOpeningElement): boolean {
      if (node.name.type === AST_NODE_TYPES.JSXIdentifier) {
        return node.name.name === 'TooltipTrigger';
      }
      return false;
    }

    function hasDisabledProp(node: TSESTree.JSXOpeningElement): boolean {
      return node.attributes.some(
        (attr) =>
          attr.type === AST_NODE_TYPES.JSXAttribute
          && attr.name.type === AST_NODE_TYPES.JSXIdentifier
          && attr.name.name === 'disabled',
      );
    }

    function isWrappedInSpan(node: TSESTree.JSXElement): boolean {
      const parent = node.parent;
      if (
        parent?.type === AST_NODE_TYPES.JSXElement
        && parent.openingElement.name.type === AST_NODE_TYPES.JSXIdentifier
      ) {
        return parent.openingElement.name.name === 'span';
      }
      return false;
    }

    function getElementName(node: TSESTree.JSXOpeningElement): string {
      if (node.name.type === AST_NODE_TYPES.JSXIdentifier) {
        return node.name.name;
      }
      return 'element';
    }

    return {
      JSXElement(node: Rule.Node) {
        const jsxElement = node as unknown as TSESTree.JSXElement;
        if (!isTooltipTrigger(jsxElement.openingElement)) {
          return;
        }

        if (!jsxElement.children || jsxElement.children.length === 0) {
          return;
        }

        for (const child of jsxElement.children) {
          if (child.type !== AST_NODE_TYPES.JSXElement) {
            continue;
          }

          const childElement = child;

          if (hasDisabledProp(childElement.openingElement)) {
            if (!isWrappedInSpan(childElement)) {
              const elementName = getElementName(childElement.openingElement);

              context.report({
                node: childElement.openingElement as unknown as Rule.Node,
                messageId: 'wrapDisabledElement',
                data: {
                  element: elementName,
                },
                fix(fixer) {
                  const sourceCode = context.sourceCode;
                  const elementText = sourceCode.getText(childElement as unknown as Rule.Node);

                  return fixer.replaceText(
                    childElement as unknown as Rule.Node,
                    `<span className="inline-block">${elementText}</span>`,
                  );
                },
              });
            }
          }
        }
      },
    };
  },
};

export default rule;
