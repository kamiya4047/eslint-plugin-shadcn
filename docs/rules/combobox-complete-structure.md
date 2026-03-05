# combobox-complete-structure

Enforces that Combobox components have the required hierarchical structure.

## Rule Details

The Combobox component requires a specific DOM hierarchy to function correctly. Missing required child components will result in a broken combobox that doesn't display options or allow user interaction.

Required structure:
- `Combobox` must contain `ComboboxInput` (or `ComboboxChips` for multi-select)
- `Combobox` must contain `ComboboxContent`
- `ComboboxContent` must contain `ComboboxList`

Optional but recommended:
- `ComboboxEmpty` for "no results" state
- `ComboboxGroup` with `ComboboxLabel` for grouped options

## Examples

### Examples of **incorrect** code:

```tsx
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem } from "@/components/ui/combobox";

// ❌ Missing ComboboxInput
<Combobox items={items}>
  <ComboboxContent>
    <ComboboxList>
      <ComboboxItem value="1">Item 1</ComboboxItem>
    </ComboboxList>
  </ComboboxContent>
</Combobox>

// ❌ Missing ComboboxContent
<Combobox items={items}>
  <ComboboxInput placeholder="Search..." />
  <ComboboxList>
    <ComboboxItem value="1">Item 1</ComboboxItem>
  </ComboboxList>
</Combobox>

// ❌ Missing ComboboxList
<Combobox items={items}>
  <ComboboxInput placeholder="Search..." />
  <ComboboxContent>
    <ComboboxItem value="1">Item 1</ComboboxItem>
  </ComboboxContent>
</Combobox>
```

### Examples of **correct** code:

```tsx
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";

// ✅ Proper structure with all required components
<Combobox items={items}>
  <ComboboxInput placeholder="Search fruits..." />
  <ComboboxContent>
    <ComboboxEmpty>No results found.</ComboboxEmpty>
    <ComboboxList>
      <ComboboxItem value="apple">Apple</ComboboxItem>
      <ComboboxItem value="banana">Banana</ComboboxItem>
      <ComboboxItem value="orange">Orange</ComboboxItem>
    </ComboboxList>
  </ComboboxContent>
</Combobox>

// ✅ Multi-select variant with ComboboxChips
<Combobox items={items} multiple>
  <ComboboxChips>
    <ComboboxValue>
      <ComboboxChip />
      <ComboboxChipsInput placeholder="Select items..." />
    </ComboboxValue>
  </ComboboxChips>
  <ComboboxContent>
    <ComboboxEmpty>No items found.</ComboboxEmpty>
    <ComboboxList>
      <ComboboxItem value="1">Item 1</ComboboxItem>
      <ComboboxItem value="2">Item 2</ComboboxItem>
    </ComboboxList>
  </ComboboxContent>
</Combobox>

// ✅ With grouped options
<Combobox items={items}>
  <ComboboxInput placeholder="Search..." />
  <ComboboxContent>
    <ComboboxEmpty>No results found.</ComboboxEmpty>
    <ComboboxList>
      <ComboboxGroup>
        <ComboboxLabel>Fruits</ComboboxLabel>
        <ComboboxCollection>
          <ComboboxItem value="apple">Apple</ComboboxItem>
          <ComboboxItem value="banana">Banana</ComboboxItem>
        </ComboboxCollection>
      </ComboboxGroup>
      <ComboboxGroup>
        <ComboboxLabel>Vegetables</ComboboxLabel>
        <ComboboxCollection>
          <ComboboxItem value="carrot">Carrot</ComboboxItem>
          <ComboboxItem value="broccoli">Broccoli</ComboboxItem>
        </ComboboxCollection>
      </ComboboxGroup>
    </ComboboxList>
  </ComboboxContent>
</Combobox>
```

## When To Use It

Use this rule when:
- You're building combobox/autocomplete components
- You want to catch structural errors during development
- You want to ensure proper component hierarchy

## Implementation Details

This rule:
- Checks `Combobox` for required `ComboboxInput` or `ComboboxChips`
- Checks `Combobox` for required `ComboboxContent`
- Checks `ComboboxContent` for required `ComboboxList`
- Recursively searches through children and JSX expressions
- Reports specific errors for each missing component

## When Not To Use It

You might disable this rule if:
- You're not using shadcn/ui Combobox components
- You have a custom combobox implementation
- You're incrementally building the component structure

## Options

This rule has no configuration options.

## Related Rules

- [`select-item-requires-value`](./select-item-requires-value.md) - Similar requirement for Select
- [`accordion-complete-structure`](./accordion-complete-structure.md) - Similar structural requirement

## Compatibility

- **Radix/shadcn**: ✅ Yes
- **Base UI**: ✅ Yes

## Further Reading

- [shadcn/ui Combobox Documentation](https://ui.shadcn.com/docs/components/combobox)
- [Radix UI Combobox (via Popover)](https://www.radix-ui.com/primitives/docs/components/popover)
- [ARIA: combobox role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/combobox_role)
