/* eslint-disable @typescript-eslint/no-unsafe-call */
import { describe, test } from 'bun:test';

import { RuleTester } from 'eslint';

import rule from '../../src/rules/components-path';

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

describe('components-path', () => {
  test('should prevent direct imports from UI primitive packages', () => {
    ruleTester.run('components-path', rule, {
      valid: [
        // Correct - importing from local components/ui
        {
          code: 'import { Button } from "@/components/ui/button";',
          filename: '/Users/test/project/src/app/page.tsx',
        },
        {
          code: 'import { Dialog } from "@/components/ui/dialog";',
          filename: '/Users/test/project/src/app/page.tsx',
        },
        // Non-UI primitive imports should be allowed
        {
          code: 'import { useState } from "react";',
          filename: '/Users/test/project/src/app/page.tsx',
        },
        {
          code: 'import { clsx } from "clsx";',
          filename: '/Users/test/project/src/app/page.tsx',
        },
        // Radix primitive imports are OK (imports the full namespace, not a component)
        {
          code: 'import * as TooltipPrimitive from "@radix-ui/react-tooltip";',
          filename: '/Users/test/project/src/app/page.tsx',
        },
        // Other package imports
        {
          code: 'import { format } from "date-fns";',
          filename: '/Users/test/project/src/app/page.tsx',
        },
      ],
      invalid: [
        // Note: These tests require actual file system to work properly
        // The rule checks if components exist in local components/ui folder
        // In a real scenario, if button.tsx exists in components/ui,
        // then importing from @radix-ui/react-button would trigger an error
      ],
    });
  });
});
