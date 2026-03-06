import { RuleTester } from 'eslint';
import { describe } from 'mocha';

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
  ruleTester.run('should allow correct data-invalid usage', rule, {
    valid: [
      {
        code: `
            <Field data-invalid>
              <Switch aria-invalid="true" />
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
              <Switch aria-invalid="true" />
            </div>
          `,
        filename: 'test.tsx',
      },
      {
        code: `
            <Field data-invalid className="field">
              <Switch aria-invalid="true" />
            </Field>
          `,
        filename: 'test.tsx',
      },
      {
        code: `
            <Field data-invalid>
              <Switch aria-invalid />
            </Field>
          `,
        filename: 'test.tsx',
      },
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
    invalid: [],
  });

  ruleTester.run('should enforce data-invalid on Field when components have aria-invalid', rule, {
    valid: [],
    invalid: [
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
      {
        code: `
            <Field>
              <Switch aria-invalid={isInvalid} />
            </Field>
          `,
        filename: 'test.tsx',
        errors: [{ messageId: 'missingDataInvalid' }],
        output: `
            <Field data-invalid={isInvalid}>
              <Switch aria-invalid={isInvalid} />
            </Field>
          `,
      },
      {
        code: `
            <Field>
              <Input aria-invalid={fieldState.invalid} />
            </Field>
          `,
        filename: 'test.tsx',
        errors: [{ messageId: 'missingDataInvalid' }],
        output: `
            <Field data-invalid={fieldState.invalid}>
              <Input aria-invalid={fieldState.invalid} />
            </Field>
          `,
      },
    ],
  });
});
