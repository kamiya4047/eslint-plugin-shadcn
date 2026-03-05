import { AST_NODE_TYPES } from '@typescript-eslint/types';

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that TabsTrigger value props match TabsContent value props',
      recommended: true,
    },
    messages: {
      noMatchingContent:
        'TabsTrigger with value "{{value}}" has no matching TabsContent',
      noMatchingTrigger:
        'TabsContent with value "{{value}}" has no matching TabsTrigger',
    },
    schema: [],
  },
  create(context) {
    const tabsElements = new Map<
      TSESTree.JSXElement,
      {
        triggers: Set<string>;
        contents: Set<string>;
      }
    >();

    function isTabsComponent(node: TSESTree.JSXOpeningElement): boolean {
      const name = node.name;
      if (name.type === AST_NODE_TYPES.JSXIdentifier) {
        return name.name === 'Tabs';
      }
      return false;
    }

    function getTabsChildType(
      node: TSESTree.JSXOpeningElement,
    ): 'trigger' | 'content' | null {
      const name = node.name;
      if (name.type === AST_NODE_TYPES.JSXIdentifier) {
        if (name.name === 'TabsTrigger') return 'trigger';
        if (name.name === 'TabsContent') return 'content';
      }
      return null;
    }

    function getValueProp(node: TSESTree.JSXOpeningElement): string | null {
      const valueAttr = node.attributes.find(
        (attr): attr is TSESTree.JSXAttribute =>
          attr.type === AST_NODE_TYPES.JSXAttribute
          && attr.name.type === AST_NODE_TYPES.JSXIdentifier
          && attr.name.name === 'value',
      );

      if (!valueAttr?.value) {
        return null;
      }

      if (valueAttr.value.type === AST_NODE_TYPES.Literal) {
        return String(valueAttr.value.value);
      }

      return null;
    }

    function findParentTabs(node: TSESTree.Node): TSESTree.JSXElement | null {
      let parent = node.parent;

      while (parent) {
        if (
          parent.type === AST_NODE_TYPES.JSXElement
          && isTabsComponent(parent.openingElement)
        ) {
          return parent;
        }
        parent = parent.parent;
      }

      return null;
    }

    return {
      JSXElement(node: Rule.Node) {
        const jsxElement = node as unknown as TSESTree.JSXElement;
        if (isTabsComponent(jsxElement.openingElement)) {
          tabsElements.set(jsxElement, {
            triggers: new Set(),
            contents: new Set(),
          });
          return;
        }

        const childType = getTabsChildType(jsxElement.openingElement);
        if (childType) {
          const value = getValueProp(jsxElement.openingElement);
          if (!value) {
            return;
          }

          const parentTabs = findParentTabs(jsxElement);
          if (!parentTabs) {
            return;
          }

          const tracking = tabsElements.get(parentTabs);
          if (tracking) {
            if (childType === 'trigger') {
              tracking.triggers.add(value);
            }
            else {
              tracking.contents.add(value);
            }
          }
        }
      },

      'Program:exit'() {
        for (const [tabsElement, { triggers, contents }] of tabsElements) {
          for (const triggerValue of triggers) {
            if (!contents.has(triggerValue)) {
              const findTrigger = (node: TSESTree.Node): TSESTree.JSXElement | null => {
                if (
                  node.type === AST_NODE_TYPES.JSXElement
                  && node.openingElement.name.type === AST_NODE_TYPES.JSXIdentifier
                  && node.openingElement.name.name === 'TabsTrigger'
                ) {
                  const value = getValueProp(node.openingElement);
                  if (value === triggerValue) {
                    return node;
                  }
                }

                if (node.type === AST_NODE_TYPES.JSXElement && node.children) {
                  for (const child of node.children) {
                    const result = findTrigger(child);
                    if (result) return result;
                  }
                }

                return null;
              };

              const triggerNode = findTrigger(tabsElement);
              if (triggerNode) {
                context.report({
                  node: triggerNode.openingElement as unknown as Rule.Node,
                  messageId: 'noMatchingContent',
                  data: { value: triggerValue },
                });
              }
            }
          }

          for (const contentValue of contents) {
            if (!triggers.has(contentValue)) {
              const findContent = (node: TSESTree.Node): TSESTree.JSXElement | null => {
                if (
                  node.type === AST_NODE_TYPES.JSXElement
                  && node.openingElement.name.type === AST_NODE_TYPES.JSXIdentifier
                  && node.openingElement.name.name === 'TabsContent'
                ) {
                  const value = getValueProp(node.openingElement);
                  if (value === contentValue) {
                    return node;
                  }
                }

                if (node.type === AST_NODE_TYPES.JSXElement && node.children) {
                  for (const child of node.children) {
                    const result = findContent(child);
                    if (result) return result;
                  }
                }

                return null;
              };

              const contentNode = findContent(tabsElement);
              if (contentNode) {
                context.report({
                  node: contentNode.openingElement as unknown as Rule.Node,
                  messageId: 'noMatchingTrigger',
                  data: { value: contentValue },
                });
              }
            }
          }
        }
      },
    };
  },
};

export default rule;
