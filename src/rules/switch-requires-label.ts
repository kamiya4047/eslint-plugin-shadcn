import { AST_NODE_TYPES } from '@typescript-eslint/types';

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that Switch components have an accessible label',
      recommended: false,
    },
    messages: {
      missingLabel:
        'Switch must have an accessible label via FieldLabel sibling, aria-label, or aria-labelledby',
    },
    schema: [],
  },
  create(context) {
    function isSwitchComponent(node: TSESTree.JSXOpeningElement): boolean {
      const name = node.name;
      if (name.type === AST_NODE_TYPES.JSXIdentifier) {
        return name.name === 'Switch';
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

    function isFieldLabelComponent(node: TSESTree.JSXOpeningElement): boolean {
      const name = node.name;
      if (name.type === AST_NODE_TYPES.JSXIdentifier) {
        return name.name === 'FieldLabel';
      }
      return false;
    }

    function isFieldComponent(node: TSESTree.JSXOpeningElement): boolean {
      const name = node.name;
      if (name.type === AST_NODE_TYPES.JSXIdentifier) {
        return name.name === 'Field';
      }
      return false;
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

    function hasFieldLabelSibling(parentField: TSESTree.JSXElement): boolean {
      if (!parentField.children) {
        return false;
      }

      return parentField.children.some(
        (child) =>
          child.type === AST_NODE_TYPES.JSXElement
          && isFieldLabelComponent(child.openingElement),
      );
    }

    return {
      JSXElement(node: Rule.Node) {
        const jsxElement = node as unknown as TSESTree.JSXElement;
        if (!isSwitchComponent(jsxElement.openingElement)) {
          return;
        }

        if (hasAriaLabel(jsxElement.openingElement)) {
          return;
        }

        const parentField = findParentField(jsxElement);
        if (!parentField) {
          context.report({
            node: jsxElement.openingElement as unknown as Rule.Node,
            messageId: 'missingLabel',
          });
          return;
        }

        if (!hasFieldLabelSibling(parentField)) {
          context.report({
            node: jsxElement.openingElement as unknown as Rule.Node,
            messageId: 'missingLabel',
          });
        }
      },
    };
  },
};

export default rule;
