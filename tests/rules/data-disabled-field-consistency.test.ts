import { describe, test } from 'bun:test';

import { RuleTester } from 'eslint';

import rule from '../../src/rules/data-disabled-field-consistency';

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

describe('data-disabled-field-consistency', () => {
  test('should enforce data-disabled on Field when components are disabled', () => {
    ruleTester.run('data-disabled-field-consistency', rule, {
      valid: [
        // Correct - Field has data-disabled when Switch is disabled
        {
          code: `
            <Field data-disabled>
              <Switch disabled />
            </Field>
          `,
          filename: 'test.tsx',
        },
        // Correct - Switch not disabled, no data-disabled needed
        {
          code: `
            <Field>
              <Switch />
            </Field>
          `,
          filename: 'test.tsx',
        },
        // Correct - Switch outside Field with disabled
        {
          code: `
            <div>
              <Switch disabled />
            </div>
          `,
          filename: 'test.tsx',
        },
        // Correct - Field with data-disabled and other attributes
        {
          code: `
            <Field data-disabled className="field">
              <Switch disabled />
            </Field>
          `,
          filename: 'test.tsx',
        },
        // SelectTrigger tests
        {
          code: `
            <Field data-disabled>
              <SelectTrigger disabled>
                <SelectValue />
              </SelectTrigger>
            </Field>
          `,
          filename: 'test.tsx',
        },
        {
          code: `
            <Field>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </Field>
          `,
          filename: 'test.tsx',
        },
        // Test ignore option
        {
          code: `
            <Field>
              <SelectTrigger disabled>
                <SelectValue />
              </SelectTrigger>
            </Field>
          `,
          filename: 'test.tsx',
          options: [{ ignore: ['SelectTrigger'] }],
        },
      ],
      invalid: [
        // Missing data-disabled on Field
        {
          code: `
            <Field>
              <Switch disabled />
            </Field>
          `,
          filename: 'test.tsx',
          errors: [{ messageId: 'missingDataDisabled' }],
          output: `
            <Field data-disabled>
              <Switch disabled />
            </Field>
          `,
        },
        // Missing data-disabled on Field with other attributes
        {
          code: `
            <Field className="field">
              <Switch disabled />
            </Field>
          `,
          filename: 'test.tsx',
          errors: [{ messageId: 'missingDataDisabled' }],
          output: `
            <Field data-disabled className="field">
              <Switch disabled />
            </Field>
          `,
        },
        // Nested Field structure
        {
          code: `
            <Field>
              <FieldLabel>Label</FieldLabel>
              <Switch disabled />
            </Field>
          `,
          filename: 'test.tsx',
          errors: [{ messageId: 'missingDataDisabled' }],
          output: `
            <Field data-disabled>
              <FieldLabel>Label</FieldLabel>
              <Switch disabled />
            </Field>
          `,
        },
        // SelectTrigger missing data-disabled
        {
          code: `
            <Field>
              <FieldLabel>Fruit</FieldLabel>
              <SelectTrigger disabled>
                <SelectValue />
              </SelectTrigger>
            </Field>
          `,
          filename: 'test.tsx',
          errors: [{ messageId: 'missingDataDisabled' }],
          output: `
            <Field data-disabled>
              <FieldLabel>Fruit</FieldLabel>
              <SelectTrigger disabled>
                <SelectValue />
              </SelectTrigger>
            </Field>
          `,
        },
        {
          code: `
            <Field className="mb-4">
              <SelectTrigger disabled>
                <SelectValue />
              </SelectTrigger>
            </Field>
          `,
          filename: 'test.tsx',
          errors: [{ messageId: 'missingDataDisabled' }],
          output: `
            <Field data-disabled className="mb-4">
              <SelectTrigger disabled>
                <SelectValue />
              </SelectTrigger>
            </Field>
          `,
        },
      ],
    });
  });
});
