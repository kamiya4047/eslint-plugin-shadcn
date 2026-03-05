import type * as ESTree from 'estree';
import type { Rule } from 'eslint';

/**
 * Creates an import tracker for Button components from shadcn/ui
 * Returns an object with methods to track and check Button imports
 */
export function createButtonImportTracker() {
  let hasUIButton = false;

  return {
    trackImport(node: Rule.Node) {
      if (node.type !== 'ImportDeclaration') {
        return;
      }

      const importNode = node as ESTree.ImportDeclaration;

      if (!importNode.source.value || typeof importNode.source.value !== 'string') {
        return;
      }

      const source = importNode.source.value.toLowerCase();

      const isUIComponentImport
        = source.includes('/components/ui/button')
          || source.includes('/components/ui');

      if (isUIComponentImport) {
        const hasButtonImport = importNode.specifiers.some(
          (spec) =>
            (spec.type === 'ImportSpecifier'
              && spec.imported.type === 'Identifier'
              && spec.imported.name === 'Button')
            || spec.type === 'ImportDefaultSpecifier',
        );

        if (hasButtonImport) {
          hasUIButton = true;
        }
      }
    },

    hasUIButton(): boolean {
      return hasUIButton;
    },
  };
}
