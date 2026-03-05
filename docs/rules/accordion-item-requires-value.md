# accordion-item-requires-value

Enforces that `AccordionItem` components have a required `value` prop with unique values.

## Rule Details

Each `AccordionItem` must have a unique `value` prop. The Accordion component uses these values to track which items are open or closed. Without values, or with duplicate values, the accordion cannot function correctly.

This rule validates that:
- Every `AccordionItem` has a `value` prop
- All `value` props within an `Accordion` are unique

According to the official documentation: *"The value prop is required on AccordionItem."*

## Examples

### Examples of **incorrect** code:

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// ❌ Missing value prop
<Accordion type="single" collapsible>
  <AccordionItem>
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>

// ❌ Duplicate values
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content 1</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>Content 2</AccordionContent>
  </AccordionItem>
</Accordion>
```

### Examples of **correct** code:

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// ✅ Each item has a unique value
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is it styled?</AccordionTrigger>
    <AccordionContent>
      Yes. It comes with default styles that you can customize.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>Is it animated?</AccordionTrigger>
    <AccordionContent>
      Yes. It's animated by default with smooth transitions.
    </AccordionContent>
  </AccordionItem>
</Accordion>

// ✅ Works with type="multiple"
<Accordion type="multiple">
  <AccordionItem value="features">
    <AccordionTrigger>Features</AccordionTrigger>
    <AccordionContent>Feature list here</AccordionContent>
  </AccordionItem>
  <AccordionItem value="pricing">
    <AccordionTrigger>Pricing</AccordionTrigger>
    <AccordionContent>Pricing details here</AccordionContent>
  </AccordionItem>
</Accordion>
```

## When To Use It

Use this rule when:
- You're using Accordion components from shadcn/ui
- You want to prevent runtime errors from missing or duplicate values
- You want to catch configuration mistakes during development

## Implementation Details

This rule:
- Tracks all `Accordion` components in the file
- Validates that each `AccordionItem` has a `value` prop
- Collects all values within each `Accordion` parent
- Detects duplicate values and reports them
- Only validates literal string values (not dynamic values)

## When Not To Use It

You might disable this rule if:
- You're not using shadcn/ui Accordion components
- You have a custom accordion implementation
- Your values are always dynamically generated (though the rule won't interfere)

## Options

This rule has no configuration options.

## Related Rules

- [`accordion-complete-structure`](./accordion-complete-structure.md) - Validates AccordionItem structure
- [`tabs-value-consistency`](./tabs-value-consistency.md) - Similar pattern for Tabs

## Compatibility

- **Radix/shadcn**: ✅ Yes
- **Base UI**: ✅ Yes

## Further Reading

- [shadcn/ui Accordion Documentation](https://ui.shadcn.com/docs/components/accordion)
- [Radix UI Accordion](https://www.radix-ui.com/primitives/docs/components/accordion)
- [ARIA: accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
