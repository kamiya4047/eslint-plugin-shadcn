import { AST_NODE_TYPES } from '@typescript-eslint/types';

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';

type NodeWithParent = TSESTree.Node & {
  parent?: NodeWithParent;
  type: AST_NODE_TYPES;
};

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that AccordionItem components have a required value prop with unique values',
      recommended: true,
    },
    messages: {
      missingValue: 'AccordionItem must have a value prop',
      duplicateValue:
        'AccordionItem value "{{value}}" is duplicated. Each item must have a unique value.',
    },
    schema: [],
  },
  create(context) {
    const accordionElements = new Map<TSESTree.JSXElement, Set<string>>();

    function isAccordionComponent(node: TSESTree.JSXOpeningElement): boolean {
      const name = node.name;
      if (name.type === AST_NODE_TYPES.JSXIdentifier) {
        return name.name === 'Accordion';
      }
      return false;
    }

    function isAccordionItem(node: TSESTree.JSXOpeningElement): boolean {
      const name = node.name;
      if (name.type === AST_NODE_TYPES.JSXIdentifier) {
        return name.name === 'AccordionItem';
      }
      return false;
    }

    function getValueProp(node: TSESTree.JSXOpeningElement): {
      value: string | null;
      attr: TSESTree.JSXAttribute | null;
    } {
      const valueAttr = node.attributes.find(
        (attr): attr is TSESTree.JSXAttribute =>
          attr.type === AST_NODE_TYPES.JSXAttribute
          && attr.name.type === AST_NODE_TYPES.JSXIdentifier
          && attr.name.name === 'value',
      );

      if (!valueAttr) {
        return { value: null, attr: null };
      }

      const attrValue = valueAttr.value;
      if (!attrValue) {
        return { value: null, attr: null };
      }

      if (attrValue.type === AST_NODE_TYPES.Literal) {
        const literalValue = attrValue.value;
        return { value: String(literalValue), attr: valueAttr };
      }

      return { value: null, attr: valueAttr };
    }

    function findParentAccordion(node: NodeWithParent): TSESTree.JSXElement | null {
      let parent = node.parent;

      while (parent) {
        if (
          parent.type === AST_NODE_TYPES.JSXElement
          && isAccordionComponent((parent as TSESTree.JSXElement).openingElement)
        ) {
          return parent as TSESTree.JSXElement;
        }
        parent = parent.parent;
      }

      return null;
    }

    return {
      JSXElement(node: Rule.Node) {
        const jsxElement = node as unknown as TSESTree.JSXElement;
        if (isAccordionComponent(jsxElement.openingElement)) {
          accordionElements.set(jsxElement, new Set());
          return;
        }

        if (isAccordionItem(jsxElement.openingElement)) {
          const { value, attr } = getValueProp(jsxElement.openingElement);

          if (!value) {
            context.report({
              node: jsxElement.openingElement as unknown as Rule.Node,
              messageId: 'missingValue',
            });
            return;
          }

          const parentAccordion = findParentAccordion(node as unknown as NodeWithParent);
          if (parentAccordion) {
            const values = accordionElements.get(parentAccordion);
            if (values) {
              if (values.has(value)) {
                if (attr) {
                  context.report({
                    node: attr as unknown as Rule.Node,
                    messageId: 'duplicateValue',
                    data: { value },
                  });
                }
              }
              else {
                values.add(value);
              }
            }
          }
        }
      },
    };
  },
};

export default rule;
