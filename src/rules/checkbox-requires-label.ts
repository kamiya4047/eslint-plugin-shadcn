import { AST_NODE_TYPES } from '@typescript-eslint/types';

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that Checkbox components have an accessible label via Field/FieldLabel, Label, or aria-label',
      recommended: true,
    },
    messages: {
      missingLabel:
        'Checkbox must have an accessible label via Field > FieldLabel, Label with htmlFor, or aria-label attribute',
    },
    schema: [],
  },
  create(context) {
    function isCheckboxComponent(node: TSESTree.JSXOpeningElement): boolean {
      const name = node.name;
      if (name.type === AST_NODE_TYPES.JSXIdentifier) {
        return (name).name === 'Checkbox';
      }
      return false;
    }

    function hasAriaLabel(node: TSESTree.JSXOpeningElement): boolean {
      return node.attributes.some(
        (attr) =>
          attr.type === AST_NODE_TYPES.JSXAttribute
          && attr.name.type === AST_NODE_TYPES.JSXIdentifier
          && ((attr.name).name === 'aria-label' || (attr.name).name === 'aria-labelledby'),
      );
    }

    function getIdAttribute(node: TSESTree.JSXOpeningElement): string | null {
      const idAttr = node.attributes.find(
        (attr) =>
          attr.type === AST_NODE_TYPES.JSXAttribute
          && attr.name.type === AST_NODE_TYPES.JSXIdentifier
          && (attr.name).name === 'id',
      );

      if (idAttr?.type === AST_NODE_TYPES.JSXAttribute) {
        const idValue = idAttr.value;
        if (idValue?.type === AST_NODE_TYPES.Literal) {
          return String(idValue.value);
        }
      }

      return null;
    }

    function isFieldOrLabel(node: TSESTree.JSXOpeningElement): 'field' | 'label' | null {
      const name = node.name;
      if (name.type === AST_NODE_TYPES.JSXIdentifier) {
        const nodeName = (name).name;
        if (nodeName === 'Field') return 'field';
        if (nodeName === 'FieldLabel' || nodeName === 'Label') return 'label';
      }
      return null;
    }

    function findParentField(node: TSESTree.Node): TSESTree.JSXElement | null {
      let parent = (node as { parent?: TSESTree.Node }).parent;

      while (parent) {
        if (
          parent.type === AST_NODE_TYPES.JSXElement
        ) {
          const jsxParent = parent;
          const parentName = jsxParent.openingElement.name;
          if (parentName.type === AST_NODE_TYPES.JSXIdentifier
            && (parentName).name === 'Field'
          ) {
            return jsxParent;
          }
        }
        parent = (parent as { parent?: TSESTree.Node }).parent;
      }

      return null;
    }

    function hasFieldLabelSibling(parentField: TSESTree.JSXElement, checkboxId: string | null): boolean {
      const children = parentField.children;
      if (!children || !checkboxId) {
        return false;
      }

      function checkForLabel(node: TSESTree.Node): boolean {
        if (node.type === AST_NODE_TYPES.JSXElement) {
          const jsxNode = node;
          const labelType = isFieldOrLabel(jsxNode.openingElement);
          if (labelType === 'label') {
            const htmlForAttr = jsxNode.openingElement.attributes.find(
              (attr) =>
                attr.type === AST_NODE_TYPES.JSXAttribute
                && attr.name.type === AST_NODE_TYPES.JSXIdentifier
                && (attr.name).name === 'htmlFor',
            );

            if (htmlForAttr?.type === AST_NODE_TYPES.JSXAttribute) {
              const attrValue = htmlForAttr.value;
              if (attrValue?.type === AST_NODE_TYPES.Literal) {
                return String(attrValue.value) === checkboxId;
              }
            }
          }

          const nodeChildren = jsxNode.children;
          if (nodeChildren) {
            for (const child of nodeChildren) {
              if (checkForLabel(child)) return true;
            }
          }
        }
        return false;
      }

      for (const child of children) {
        if (checkForLabel(child)) return true;
      }

      return false;
    }

    return {
      JSXElement(node: Rule.Node) {
        const jsxElement = node as unknown as TSESTree.JSXElement;
        if (!isCheckboxComponent(jsxElement.openingElement)) {
          return;
        }

        if (hasAriaLabel(jsxElement.openingElement)) {
          return;
        }

        const checkboxId = getIdAttribute(jsxElement.openingElement);

        const parentField = findParentField(jsxElement);
        if (parentField) {
          if (hasFieldLabelSibling(parentField, checkboxId)) {
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
