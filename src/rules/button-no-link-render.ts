import { AST_NODE_TYPES } from '@typescript-eslint/types';

import { createButtonImportTracker } from '../utils/button-import-tracker';

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow using Button with render prop for links. Use `buttonVariants` with `<a>` or `<Link>` instead',
      recommended: true,
    },
    messages: {
      noLinkRender:
        'Do not use Button with render prop for links. The Base UI Button component always applies `role="button"`, which overrides the semantic link role. Use `buttonVariants` with a plain `<a>` or `<Link>` tag instead.',
    },
    schema: [],
  },
  create(context) {
    const buttonTracker = createButtonImportTracker();

    function isButtonComponent(node: TSESTree.JSXElement): boolean {
      const name = node.openingElement.name;
      if (name.type === AST_NODE_TYPES.JSXIdentifier) {
        return name.name === 'Button';
      }
      return false;
    }

    function hasRenderProp(node: TSESTree.JSXElement): TSESTree.JSXAttribute | null {
      const renderAttr = node.openingElement.attributes.find(
        (attr): attr is TSESTree.JSXAttribute =>
          attr.type === AST_NODE_TYPES.JSXAttribute
          && attr.name.type === AST_NODE_TYPES.JSXIdentifier
          && attr.name.name === 'render',
      );

      return renderAttr ?? null;
    }

    function isLinkRenderProp(renderAttr: TSESTree.JSXAttribute): boolean {
      const attrValue = renderAttr.value;
      if (!attrValue) {
        return false;
      }

      if (attrValue.type === AST_NODE_TYPES.JSXExpressionContainer) {
        const expr = attrValue.expression;

        if (expr.type === AST_NODE_TYPES.JSXElement) {
          const exprName = expr.openingElement.name;
          if (exprName.type === AST_NODE_TYPES.JSXIdentifier) {
            const name = exprName.name;
            return name === 'a' || name === 'Link';
          }
        }
      }

      return false;
    }

    return {
      ImportDeclaration(node) {
        buttonTracker.trackImport(node);
      },

      JSXElement(node: Rule.Node) {
        const jsxElement = node as unknown as TSESTree.JSXElement;
        if (!isButtonComponent(jsxElement)) {
          return;
        }

        if (!buttonTracker.hasUIButton()) {
          return;
        }

        const renderAttr = hasRenderProp(jsxElement);
        if (renderAttr && isLinkRenderProp(renderAttr)) {
          context.report({
            node: renderAttr as unknown as Rule.Node,
            messageId: 'noLinkRender',
          });
        }
      },
    };
  },
};

export default rule;
