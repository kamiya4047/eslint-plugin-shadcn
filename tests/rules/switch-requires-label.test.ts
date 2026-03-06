import { RuleTester } from 'eslint';
import { describe } from 'mocha';

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
  ruleTester.run('should allow Switch with proper labels', rule, {
    valid: [
      {
        code: `
            <Field>
              <FieldLabel>Enable notifications</FieldLabel>
              <Switch />
            </Field>
          `,
        filename: 'test.tsx',
      },
      {
        code: `<Switch aria-label="Enable notifications" />`,
        filename: 'test.tsx',
      },
      {
        code: `<Switch aria-labelledby="notification-label" />`,
        filename: 'test.tsx',
      },
      {
        code: `
            <Field>
              <Switch aria-label="Enable notifications" />
            </Field>
          `,
        filename: 'test.tsx',
      },
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

  ruleTester.run('should enforce accessible labels on Switch components', rule, {
    valid: [],
    invalid: [
      {
        code: `<Switch />`,
        filename: 'test.tsx',
        errors: [{ messageId: 'missingLabel' }],
      },
      {
        code: `
            <Field>
              <Switch />
            </Field>
          `,
        filename: 'test.tsx',
        errors: [{ messageId: 'missingLabel' }],
      },
      {
        code: `
            <div>
              <Switch />
            </div>
          `,
        filename: 'test.tsx',
        errors: [{ messageId: 'missingLabel' }],
      },
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
