# data-disabled-field-consistency

🔧 This rule is automatically fixable by the `--fix` CLI option.

Enforces `data-disabled` attribute on Field component when components have the `disabled` prop.

## Rule Details

This rule ensures consistent styling between component disabled states and their parent Field. When components like Switch or SelectTrigger are disabled, the parent Field should have the `data-disabled` attribute for proper styling.

**Default components checked:** Switch, SelectTrigger, Input, Textarea, Checkbox, RadioGroup

### Examples of **incorrect** code:

```tsx
// ❌ Switch: Field missing data-disabled attribute
<Field>
  <Switch disabled />
</Field>

// ❌ Switch with nested structure
<Field className="my-field">
  <FieldLabel>Enable notifications</FieldLabel>
  <Switch disabled />
</Field>

// ❌ SelectTrigger: Field missing data-disabled attribute
<Field>
  <FieldLabel>Fruit</FieldLabel>
  <SelectTrigger disabled>
    <SelectValue />
  </SelectTrigger>
</Field>
```

### Examples of **correct** code:

```tsx
// ✅ Switch: Field has data-disabled when Switch is disabled
<Field data-disabled>
  <Switch disabled />
</Field>

// ✅ Switch with data-disabled and other attributes
<Field data-disabled className="my-field">
  <FieldLabel>Enable notifications</FieldLabel>
  <Switch disabled />
</Field>

// ✅ SelectTrigger: Field has data-disabled
<Field data-disabled>
  <FieldLabel>Fruit</FieldLabel>
  <SelectTrigger disabled>
    <SelectValue />
  </SelectTrigger>
</Field>

// ✅ Components without disabled don't require data-disabled
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
  <Switch disabled />
</div>
```

## When To Use It

Use this rule when:
- You're using shadcn/ui components with Radix or Base UI
- You want to ensure consistent disabled state styling
- You follow shadcn/ui documentation patterns

## Auto-fix

This rule provides automatic fixes. Running `eslint --fix` will add the `data-disabled` attribute to the Field component.

## Options

This rule accepts an options object with the following properties:

### `ignore`

Type: `string[]`
Default: `[]`

An array of component names to exclude from checking.

**Example:**

```js
// Only check Switch (ignore SelectTrigger)
"shadcn/data-disabled-field-consistency": ["error", {
  "ignore": ["SelectTrigger"]
}]

// Ignore all (effectively disables the rule)
"shadcn/data-disabled-field-consistency": ["error", {
  "ignore": ["Switch", "SelectTrigger"]
}]
```

## Related Rules

- [`data-invalid-field-consistency`](./data-invalid-field-consistency.md) - Similar pattern for invalid state
- [`switch-requires-label`](./switch-requires-label.md) - Ensures switches have accessible labels

## Compatibility

- **Radix/shadcn**: ✅ Yes
- **Base UI**: ✅ Yes

## Further Reading

- [shadcn/ui Switch Documentation](https://ui.shadcn.com/docs/components/switch)
- [shadcn/ui Select Documentation](https://ui.shadcn.com/docs/components/select)
- [Radix UI Switch API Reference](https://www.radix-ui.com/docs/primitives/components/switch#api-reference)
- [Radix UI Select API Reference](https://www.radix-ui.com/docs/primitives/components/select#api-reference)
