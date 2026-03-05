# select-item-requires-value

Enforces that `SelectItem` components have a required `value` prop.

## Rule Details

Each `SelectItem` must have a `value` prop. The Select component uses this value to identify which option is selected and to populate the form data. Without a value, the Select cannot track selections or submit proper form data.

This is a fundamental requirement for Select components to function correctly.

## Examples

### Examples of **incorrect** code:

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ❌ SelectItem without value
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem>Apple</SelectItem>
    <SelectItem>Banana</SelectItem>
    <SelectItem>Orange</SelectItem>
  </SelectContent>
</Select>

// ❌ Some items have values, some don't
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option-1">Option 1</SelectItem>
    <SelectItem>Option 2</SelectItem>
    <SelectItem value="option-3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

### Examples of **correct** code:

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ✅ All items have values
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="orange">Orange</SelectItem>
  </SelectContent>
</Select>

// ✅ Works in forms
<form>
  <Select name="country">
    <SelectTrigger>
      <SelectValue placeholder="Select your country" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="us">United States</SelectItem>
      <SelectItem value="uk">United Kingdom</SelectItem>
      <SelectItem value="ca">Canada</SelectItem>
    </SelectContent>
  </Select>
</form>

// ✅ Dynamic options
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    {options.map((option) => (
      <SelectItem key={option.id} value={option.id}>
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

## When To Use It

Use this rule when:
- You're using Select components from shadcn/ui
- You want to prevent runtime errors from missing values
- You're building forms that need to submit select data

## Implementation Details

This rule:
- Checks every `SelectItem` component
- Validates that a `value` prop exists
- Reports an error if missing
- Works with both literal and dynamic values

## When Not To Use It

You might disable this rule if:
- You're not using shadcn/ui Select components
- You have a custom select implementation

However, this rule is generally safe to keep enabled.

## Options

This rule has no configuration options.

## Related Rules

- [`accordion-item-requires-value`](./accordion-item-requires-value.md) - Similar requirement for Accordion

## Compatibility

- **Radix/shadcn**: ✅ Yes
- **Base UI**: ✅ Yes

## Further Reading

- [shadcn/ui Select Documentation](https://ui.shadcn.com/docs/components/select)
- [Radix UI Select](https://www.radix-ui.com/primitives/docs/components/select)
- [HTML select element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)
