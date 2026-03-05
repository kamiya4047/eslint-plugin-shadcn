import { AST_NODE_TYPES } from '@typescript-eslint/types';

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that RadioGroupItem components have an accessible label via Label, FieldLabel, or aria-label',
      recommended: true,
    },
    messages: {
      missingLabel:
        'RadioGroupItem must have an accessible label via Label/FieldLabel with htmlFor, or aria-label attribute',
    },
    schema: [],
  },
  create(context) {
    function isRadioGroupItem(node: TSESTree.JSXOpeningElement): boolean {
      const name = node.name;
      if (name.type === AST_NODE_TYPES.JSXIdentifier) {
        return name.name === 'RadioGroupItem';
      }
      return false;
    }

    function hasAriaLabel(node: TSESTree.JSXOpeningElement): boolean {
      return node.attributes.some(
        (attr) =>
          attr.type === AST_NODE_TYPES.JSXAttribute
          && attr.name.type === AST_NODE_TYPES.JSXIdentifier
          && (attr.name.name === 'aria-label' || attr.name.name === 'aria-labelledby'),
      );
    }

    function getIdAttribute(node: TSESTree.JSXOpeningElement): string | null {
      const idAttr = node.attributes.find(
        (attr) =>
          attr.type === AST_NODE_TYPES.JSXAttribute
          && attr.name.type === AST_NODE_TYPES.JSXIdentifier
          && attr.name.name === 'id',
      );

      if (idAttr?.type === AST_NODE_TYPES.JSXAttribute && idAttr.value) {
        if (idAttr.value.type === AST_NODE_TYPES.Literal) {
          return String(idAttr.value.value);
        }
      }

      return null;
    }

    function findParentContainer(node: TSESTree.Node): TSESTree.JSXElement | null {
      let parent = node.parent;

      while (parent) {
        if (
          parent.type === AST_NODE_TYPES.JSXElement
          && parent.openingElement.name.type === AST_NODE_TYPES.JSXIdentifier
          && (parent.openingElement.name.name === 'RadioGroup'
            || parent.openingElement.name.name === 'Field')
        ) {
          return parent;
        }
        parent = parent.parent;
      }

      return null;
    }

    function hasLabelSibling(container: TSESTree.JSXElement, radioId: string | null): boolean {
      if (!container.children || !radioId) {
        return false;
      }

      function checkForLabel(node: TSESTree.Node): boolean {
        if (node.type === AST_NODE_TYPES.JSXElement) {
          const nodeName
            = node.openingElement.name.type === AST_NODE_TYPES.JSXIdentifier
              ? node.openingElement.name.name
              : null;

          if (nodeName === 'Label' || nodeName === 'FieldLabel') {
            const htmlForAttr = node.openingElement.attributes.find(
              (attr) =>
                attr.type === AST_NODE_TYPES.JSXAttribute
                && attr.name.type === AST_NODE_TYPES.JSXIdentifier
                && attr.name.name === 'htmlFor',
            );

            if (htmlForAttr?.type === AST_NODE_TYPES.JSXAttribute && htmlForAttr.value?.type === AST_NODE_TYPES.Literal) {
              return String(htmlForAttr.value.value) === radioId;
            }
          }

          if (node.children) {
            for (const child of node.children) {
              if (checkForLabel(child)) return true;
            }
          }
        }
        return false;
      }

      for (const child of container.children) {
        if (checkForLabel(child)) return true;
      }

      return false;
    }

    return {
      JSXElement(node: Rule.Node) {
        const jsxElement = node as unknown as TSESTree.JSXElement;
        if (!isRadioGroupItem(jsxElement.openingElement)) {
          return;
        }

        if (hasAriaLabel(jsxElement.openingElement)) {
          return;
        }

        const radioId = getIdAttribute(jsxElement.openingElement);

        const parentContainer = findParentContainer(jsxElement);
        if (parentContainer) {
          if (hasLabelSibling(parentContainer, radioId)) {
            return;
          }
        }

        context.report({
          node: jsxElement.openingElement as unknown as Rule.Node,
          messageId: 'missingLabel',
        });
      },
    };
  },
};

export default rule;
