import { describe, it } from 'bun:test';

import { RuleTester } from 'eslint';

import rule from '../../src/rules/switch-requires-label';

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

describe('switch-requires-label', () => {
  it('should allow Switch with proper labels', () => {
    ruleTester.run('switch-requires-label', rule, {
      valid: [
        // Correct - Field with FieldLabel sibling
        {
          code: `
            <Field>
              <FieldLabel>Enable notifications</FieldLabel>
              <Switch />
            </Field>
          `,
          filename: 'test.tsx',
        },
        // Correct - Switch with aria-label
        {
          code: `<Switch aria-label="Enable notifications" />`,
          filename: 'test.tsx',
        },
        // Correct - Switch with aria-labelledby
        {
          code: `<Switch aria-labelledby="notification-label" />`,
          filename: 'test.tsx',
        },
        // Correct - Switch in Field with aria-label (doesn't need FieldLabel)
        {
          code: `
            <Field>
              <Switch aria-label="Enable notifications" />
            </Field>
          `,
          filename: 'test.tsx',
        },
        // Correct - FieldLabel can be before or after Switch
        {
          code: `
            <Field>
              <Switch />
              <FieldLabel>Enable notifications</FieldLabel>
            </Field>
          `,
          filename: 'test.tsx',
        },
      ],
      invalid: [],
    });
  });

  it('should enforce accessible labels on Switch components', () => {
    ruleTester.run('switch-requires-label', rule, {
      valid: [],
      invalid: [
        // Missing label - Switch without any label
        {
          code: `<Switch />`,
          filename: 'test.tsx',
          errors: [{ messageId: 'missingLabel' }],
        },
        // Missing label - Switch in Field without FieldLabel
        {
          code: `
            <Field>
              <Switch />
            </Field>
          `,
          filename: 'test.tsx',
          errors: [{ messageId: 'missingLabel' }],
        },
        // Missing label - Switch in div without aria-label
        {
          code: `
            <div>
              <Switch />
            </div>
          `,
          filename: 'test.tsx',
          errors: [{ messageId: 'missingLabel' }],
        },
        // Missing label - Field with other children but no FieldLabel
        {
          code: `
            <Field>
              <div>Some content</div>
              <Switch />
            </Field>
          `,
          filename: 'test.tsx',
          errors: [{ messageId: 'missingLabel' }],
        },
      ],
    });
  });
});
