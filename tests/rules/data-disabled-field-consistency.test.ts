import { RuleTester } from 'eslint';
import { describe } from 'mocha';

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
  ruleTester.run('should allow correct data-disabled usage', rule, {
    valid: [
      {
        code: `
            <Field data-disabled>
              <Switch disabled />
            </Field>
          `,
        filename: 'test.tsx',
      },
      {
        code: `
            <Field>
              <Switch />
            </Field>
          `,
        filename: 'test.tsx',
      },
      {
        code: `
            <div>
              <Switch disabled />
            </div>
          `,
        filename: 'test.tsx',
      },
      {
        code: `
            <Field data-disabled className="field">
              <Switch disabled />
            </Field>
          `,
        filename: 'test.tsx',
      },
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
    invalid: [],
  });

  ruleTester.run('should enforce data-disabled on Field when components are disabled', rule, {
    valid: [],
    invalid: [
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
      {
        code: `
            <Field>
              <Switch disabled={isDisabled} />
            </Field>
          `,
        filename: 'test.tsx',
        errors: [{ messageId: 'missingDataDisabled' }],
        output: `
            <Field data-disabled={isDisabled}>
              <Switch disabled={isDisabled} />
            </Field>
          `,
      },
      {
        code: `
            <Field>
              <Input disabled={fieldState.disabled} />
            </Field>
          `,
        filename: 'test.tsx',
        errors: [{ messageId: 'missingDataDisabled' }],
        output: `
            <Field data-disabled={fieldState.disabled}>
              <Input disabled={fieldState.disabled} />
            </Field>
          `,
      },
    ],
  });
});
