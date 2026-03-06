import { AST_NODE_TYPES } from '@typescript-eslint/types';

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';

export function getAttributeValue(
  node: TSESTree.JSXOpeningElement,
  attributeName: string,
  context: Rule.RuleContext,
): string | null {
  const attr = node.attributes.find(
    (attr) =>
      attr.type === AST_NODE_TYPES.JSXAttribute
      && attr.name.type === AST_NODE_TYPES.JSXIdentifier
      && attr.name.name === attributeName,
  );

  if (attr?.type !== AST_NODE_TYPES.JSXAttribute) {
    return null;
  }

  if (!attr.value) {
    return '';
  }

  if (attr.value.type === AST_NODE_TYPES.Literal && (attr.value.value === 'true' || attr.value.value === true)) {
    return '';
  }

  const sourceCode = context.sourceCode;
  return sourceCode.getText(attr.value as unknown as Rule.Node);
}
