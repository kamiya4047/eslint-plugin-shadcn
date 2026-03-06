import { beforeEach, describe, it } from 'bun:test';
import { resolve } from 'node:path';

import { RuleTester } from 'eslint';

import { clearProjectConfigCache, default as rule } from '../../src/rules/components-path';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

const fixtureRoot = resolve(__dirname, '../fixtures/components-path-test');

describe('components-path', () => {
  beforeEach(() => {
    clearProjectConfigCache();
  });
  it('should allow imports from local components/ui', () => {
    ruleTester.run('components-path', rule, {
      valid: [
        {
          code: 'import { Button } from "@/components/ui/button";',
          filename: '/Users/test/project/src/app/page.tsx',
        },
        {
          code: 'import { Dialog } from "@/components/ui/dialog";',
          filename: '/Users/test/project/src/app/page.tsx',
        },
        {
          code: 'import { useState } from "react";',
          filename: '/Users/test/project/src/app/page.tsx',
        },
        {
          code: 'import { clsx } from "clsx";',
          filename: '/Users/test/project/src/app/page.tsx',
        },
        {
          code: 'import * as TooltipPrimitive from "@radix-ui/react-tooltip";',
          filename: '/Users/test/project/src/app/page.tsx',
        },
        {
          code: 'import { format } from "date-fns";',
          filename: '/Users/test/project/src/app/page.tsx',
        },
        {
          code: 'import * as RadixUI from "radix-ui";',
          filename: '/Users/test/project/src/app/page.tsx',
        },
        {
          code: 'import { Dialog as DialogPrimitive } from "radix-ui";',
          filename: '/Users/test/project/src/app/page.tsx',
        },
        {
          code: 'import { Button } from \'@/components/ui/button\';',
          filename: '/Users/test/project/src/app/page.tsx',
        },
      ],
      invalid: [],
    });
  });

  it('should preserve quote style in fixes', () => {
    ruleTester.run('components-path', rule, {
      valid: [],
      invalid: [
        {
          code: 'import { Button } from \'@radix-ui/react-button\';',
          filename: `${fixtureRoot}/src/app/page.tsx`,
          errors: [
            {
              messageId: 'useLocalComponent',
              suggestions: [
                {
                  messageId: 'suggestLocalImport',
                  output: 'import { Button } from \'@/components/ui/button\';',
                },
                {
                  messageId: 'suggestNamespaceImport',
                  output: 'import * as ButtonPrimitive from \'@radix-ui/react-button\';',
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it('should prevent direct imports from UI primitive packages', () => {
    ruleTester.run('components-path', rule, {
      valid: [],
      invalid: [
        {
          code: 'import { Button } from "@radix-ui/react-button";',
          filename: `${fixtureRoot}/src/app/page.tsx`,
          errors: [
            {
              messageId: 'useLocalComponent',
              data: {
                componentName: 'Button',
                expectedPath: '@/components/ui/button',
                packageName: '@radix-ui/react-button',
              },
              suggestions: [
                {
                  messageId: 'suggestLocalImport',
                  data: {
                    expectedPath: '@/components/ui/button',
                  },
                  output: 'import { Button } from "@/components/ui/button";',
                },
                {
                  messageId: 'suggestNamespaceImport',
                  data: {
                    namespaceName: 'ButtonPrimitive',
                    packageName: '@radix-ui/react-button',
                  },
                  output: 'import * as ButtonPrimitive from "@radix-ui/react-button";',
                },
              ],
            },
          ],
        },
        {
          code: 'import { Dialog } from "@radix-ui/react-dialog";',
          filename: `${fixtureRoot}/src/app/page.tsx`,
          errors: [
            {
              messageId: 'useLocalComponent',
              data: {
                componentName: 'Dialog',
                expectedPath: '@/components/ui/dialog',
                packageName: '@radix-ui/react-dialog',
              },
              suggestions: [
                {
                  messageId: 'suggestLocalImport',
                  data: {
                    expectedPath: '@/components/ui/dialog',
                  },
                  output: 'import { Dialog } from "@/components/ui/dialog";',
                },
                {
                  messageId: 'suggestNamespaceImport',
                  data: {
                    namespaceName: 'DialogPrimitive',
                    packageName: '@radix-ui/react-dialog',
                  },
                  output: 'import * as DialogPrimitive from "@radix-ui/react-dialog";',
                },
              ],
            },
          ],
        },
        {
          code: 'import { Button } from "radix-ui";',
          filename: `${fixtureRoot}/src/app/page.tsx`,
          errors: [
            {
              messageId: 'useLocalComponent',
              data: {
                componentName: 'Button',
                expectedPath: '@/components/ui/button',
                packageName: 'radix-ui',
              },
              suggestions: [
                {
                  messageId: 'suggestLocalImport',
                  data: {
                    expectedPath: '@/components/ui/button',
                  },
                  output: 'import { Button } from "@/components/ui/button";',
                },
                {
                  messageId: 'suggestAliasedImport',
                  data: {
                    importedName: 'Button',
                    aliasedName: 'ButtonPrimitive',
                    packageName: 'radix-ui',
                  },
                  output: 'import { Button as ButtonPrimitive } from "radix-ui";',
                },
              ],
            },
          ],
        },
        {
          code: 'import { Dialog } from "radix-ui";',
          filename: `${fixtureRoot}/src/app/page.tsx`,
          errors: [
            {
              messageId: 'useLocalComponent',
              data: {
                componentName: 'Dialog',
                expectedPath: '@/components/ui/dialog',
                packageName: 'radix-ui',
              },
              suggestions: [
                {
                  messageId: 'suggestLocalImport',
                  data: {
                    expectedPath: '@/components/ui/dialog',
                  },
                  output: 'import { Dialog } from "@/components/ui/dialog";',
                },
                {
                  messageId: 'suggestAliasedImport',
                  data: {
                    importedName: 'Dialog',
                    aliasedName: 'DialogPrimitive',
                    packageName: 'radix-ui',
                  },
                  output: 'import { Dialog as DialogPrimitive } from "radix-ui";',
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
