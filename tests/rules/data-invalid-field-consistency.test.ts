import { describe, test } from 'bun:test';

import { RuleTester } from 'eslint';

import rule from '../../src/rules/data-invalid-field-consistency';

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

describe('data-invalid-field-consistency', () => {
  test('should enforce data-invalid on Field when components have aria-invalid', () => {
    ruleTester.run('data-invalid-field-consistency', rule, {
      valid: [
        // Correct - Field has data-invalid when Switch has aria-invalid
        {
          code: `
            <Field data-invalid>
              <Switch aria-invalid="true" />
            </Field>
          `,
          filename: 'test.tsx',
        },
        // Correct - Switch without aria-invalid, no data-invalid needed
        {
          code: `
            <Field>
              <Switch />
            </Field>
          `,
          filename: 'test.tsx',
        },
        // Correct - Switch outside Field with aria-invalid
        {
          code: `
            <div>
              <Switch aria-invalid="true" />
            </div>
          `,
          filename: 'test.tsx',
        },
        // Correct - Field with data-invalid and other attributes
        {
          code: `
            <Field data-invalid className="field">
              <Switch aria-invalid="true" />
            </Field>
          `,
          filename: 'test.tsx',
        },
        // aria-invalid can be boolean or string
        {
          code: `
            <Field data-invalid>
              <Switch aria-invalid />
            </Field>
          `,
          filename: 'test.tsx',
        },
        // SelectTrigger tests
        {
          code: `
            <Field data-invalid>
              <SelectTrigger aria-invalid>
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
              <SelectTrigger aria-invalid>
                <SelectValue />
              </SelectTrigger>
            </Field>
          `,
          filename: 'test.tsx',
          options: [{ ignore: ['SelectTrigger'] }],
        },
      ],
      invalid: [
        // Missing data-invalid on Field
        {
          code: `
            <Field>
              <Switch aria-invalid="true" />
            </Field>
          `,
          filename: 'test.tsx',
          errors: [{ messageId: 'missingDataInvalid' }],
          output: `
            <Field data-invalid>
              <Switch aria-invalid="true" />
            </Field>
          `,
        },
        // Missing data-invalid on Field with other attributes
        {
          code: `
            <Field className="field">
              <Switch aria-invalid="true" />
            </Field>
          `,
          filename: 'test.tsx',
          errors: [{ messageId: 'missingDataInvalid' }],
          output: `
            <Field data-invalid className="field">
              <Switch aria-invalid="true" />
            </Field>
          `,
        },
        // Nested Field structure
        {
          code: `
            <Field>
              <FieldLabel>Label</FieldLabel>
              <Switch aria-invalid />
            </Field>
          `,
          filename: 'test.tsx',
          errors: [{ messageId: 'missingDataInvalid' }],
          output: `
            <Field data-invalid>
              <FieldLabel>Label</FieldLabel>
              <Switch aria-invalid />
            </Field>
          `,
        },
        // SelectTrigger missing data-invalid
        {
          code: `
            <Field>
              <FieldLabel>Fruit</FieldLabel>
              <SelectTrigger aria-invalid>
                <SelectValue />
              </SelectTrigger>
            </Field>
          `,
          filename: 'test.tsx',
          errors: [{ messageId: 'missingDataInvalid' }],
          output: `
            <Field data-invalid>
              <FieldLabel>Fruit</FieldLabel>
              <SelectTrigger aria-invalid>
                <SelectValue />
              </SelectTrigger>
            </Field>
          `,
        },
        {
          code: `
            <Field className="mb-4">
              <SelectTrigger aria-invalid>
                <SelectValue />
              </SelectTrigger>
            </Field>
          `,
          filename: 'test.tsx',
          errors: [{ messageId: 'missingDataInvalid' }],
          output: `
            <Field data-invalid className="mb-4">
              <SelectTrigger aria-invalid>
                <SelectValue />
              </SelectTrigger>
            </Field>
          `,
        },
      ],
    });
  });
});
