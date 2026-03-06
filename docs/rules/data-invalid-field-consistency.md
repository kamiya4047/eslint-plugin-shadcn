# data-invalid-field-consistency

🔧 This rule is automatically fixable by the `--fix` CLI option.

Enforces `data-invalid` attribute on Field component when components have the `aria-invalid` prop.

## Rule Details

This rule ensures consistent styling between component invalid states and their parent Field. When components like Switch or SelectTrigger have `aria-invalid`, the parent Field should have the `data-invalid` attribute for proper error styling.

**Default components checked:** Switch, SelectTrigger, Input, Textarea, Checkbox, RadioGroup

### Examples of **incorrect** code:

```tsx
// ❌ Switch: Field missing data-invalid attribute
<Field>
  <Switch aria-invalid="true" />
</Field>

// ❌ Switch with nested structure
<Field className="my-field">
  <FieldLabel>Accept terms</FieldLabel>
  <Switch aria-invalid />
  <FieldError>You must accept the terms</FieldError>
</Field>

// ❌ SelectTrigger: Field missing data-invalid attribute
<Field>
  <FieldLabel>Fruit</FieldLabel>
  <SelectTrigger aria-invalid>
    <SelectValue />
  </SelectTrigger>
</Field>

// ❌ Variable/expression: Field missing data-invalid with same expression
<Field>
  <Switch aria-invalid={isInvalid} />
</Field>

<Field>
  <Input aria-invalid={fieldState.invalid} />
</Field>
```

### Examples of **correct** code:

```tsx
// ✅ Switch: Field has data-invalid when Switch has aria-invalid
<Field data-invalid>
  <Switch aria-invalid="true" />
</Field>

// ✅ Switch with data-invalid and other attributes
<Field data-invalid className="my-field">
  <FieldLabel>Accept terms</FieldLabel>
  <Switch aria-invalid />
  <FieldError>You must accept the terms</FieldError>
</Field>

// ✅ SelectTrigger: Field has data-invalid
<Field data-invalid>
  <FieldLabel>Fruit</FieldLabel>
  <SelectTrigger aria-invalid>
    <SelectValue />
  </SelectTrigger>
</Field>

// ✅ Components without aria-invalid don't require data-invalid
<Field>
  <Switch />
</Field>

<Field>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
</Field>

// ✅ Components outside Field (no Field to check)
<div>
  <Switch aria-invalid="true" />
</div>

// ✅ Boolean aria-invalid also works
<Field data-invalid>
  <Switch aria-invalid />
</Field>

// ✅ Variable/expression values are properly synced
<Field data-invalid={isInvalid}>
  <Switch aria-invalid={isInvalid} />
</Field>

<Field data-invalid={fieldState.invalid}>
  <Input aria-invalid={fieldState.invalid} />
</Field>
```

## When To Use It

Use this rule when:

- You're using shadcn/ui components with Radix or Base UI
- You want to ensure consistent invalid state styling
- You're implementing form validation

## Auto-fix

This rule provides automatic fixes. Running `eslint --fix` will add the `data-invalid` attribute to the Field component.

## Options

This rule accepts an options object with the following properties:

### `ignore`

Type: `string[]`
Default: `[]`

An array of component names to exclude from checking.

**Example:**

```js
// Only check Switch (ignore SelectTrigger)
"shadcn/data-invalid-field-consistency": ["error", {
  "ignore": ["SelectTrigger"]
}]

// Ignore all (effectively disables the rule)
"shadcn/data-invalid-field-consistency": ["error", {
  "ignore": ["Switch", "SelectTrigger"]
}]
```

## Related Rules

- [`data-disabled-field-consistency`](./data-disabled-field-consistency.md) - Similar pattern for disabled state
- [`switch-requires-label`](./switch-requires-label.md) - Ensures switches have accessible labels

## Compatibility

- **Radix/shadcn**: ✅ Yes
- **Base UI**: ✅ Yes

## Further Reading

- [shadcn/ui Switch Documentation](https://ui.shadcn.com/docs/components/switch)
- [shadcn/ui Select Documentation](https://ui.shadcn.com/docs/components/select)
- [ARIA Invalid State](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-invalid)
- [Radix UI Switch API Reference](https://www.radix-ui.com/docs/primitives/components/switch#api-reference)
- [Radix UI Select API Reference](https://www.radix-ui.com/docs/primitives/components/select#api-reference)
