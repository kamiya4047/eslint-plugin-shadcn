import { AST_NODE_TYPES } from '@typescript-eslint/types';

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that SelectItem components have a required value prop',
      recommended: true,
    },
    messages: {
      missingValue: 'SelectItem must have a value prop',
    },
    schema: [],
  },
  create(context) {
    function isSelectItem(node: TSESTree.JSXOpeningElement): boolean {
      const name = node.name;
      if (name.type === AST_NODE_TYPES.JSXIdentifier) {
        return name.name === 'SelectItem';
      }
      return false;
    }

    function hasValueProp(node: TSESTree.JSXOpeningElement): boolean {
      return node.attributes.some(
        (attr) =>
          attr.type === AST_NODE_TYPES.JSXAttribute
          && attr.name.type === AST_NODE_TYPES.JSXIdentifier
          && attr.name.name === 'value',
      );
    }

    return {
      JSXOpeningElement(node: Rule.Node) {
        const jsxElement = node as unknown as TSESTree.JSXOpeningElement;
        if (isSelectItem(jsxElement) && !hasValueProp(jsxElement)) {
          context.report({
            node: jsxElement as unknown as Rule.Node,
            messageId: 'missingValue',
          });
        }
      },
    };
  },
};

export default rule;
