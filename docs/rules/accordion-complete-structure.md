# accordion-complete-structure

Enforces that AccordionItem components have the required AccordionTrigger and AccordionContent children.

## Rule Details

Each `AccordionItem` must contain both an `AccordionTrigger` (the clickable header) and `AccordionContent` (the expandable content panel). Without both components, the accordion cannot function correctly - users won't be able to interact with it or see the content.

This is the fundamental structure required by the Accordion component to work properly.

## Examples

### Examples of **incorrect** code:

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// ❌ Missing AccordionContent
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>What is this?</AccordionTrigger>
  </AccordionItem>
</Accordion>

// ❌ Missing AccordionTrigger
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionContent>
      This is some content that cannot be accessed.
    </AccordionContent>
  </AccordionItem>
</Accordion>

// ❌ Empty AccordionItem
<Accordion type="single" collapsible>
  <AccordionItem value="item-1" />
</Accordion>
```

### Examples of **correct** code:

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// ✅ Complete accordion with all required components
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
      Yes. It comes with default styles that matches the other
      components' aesthetic.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>Is it animated?</AccordionTrigger>
    <AccordionContent>
      Yes. It's animated by default, but you can disable it if you prefer.
    </AccordionContent>
  </AccordionItem>
</Accordion>

// ✅ Works with type="multiple"
<Accordion type="multiple" className="w-full">
  <AccordionItem value="features">
    <AccordionTrigger>Features</AccordionTrigger>
    <AccordionContent>
      <ul className="list-disc pl-6">
        <li>Fully accessible</li>
        <li>Keyboard navigation</li>
        <li>Customizable styling</li>
      </ul>
    </AccordionContent>
  </AccordionItem>
</Accordion>

// ✅ Nested components within AccordionContent
<Accordion type="single" collapsible>
  <AccordionItem value="pricing">
    <AccordionTrigger>What are the pricing options?</AccordionTrigger>
    <AccordionContent>
      <div className="space-y-4">
        <p>We offer flexible pricing plans:</p>
        <ul className="list-disc pl-6">
          <li>Free tier for personal use</li>
          <li>Pro tier at $9/month</li>
          <li>Enterprise tier with custom pricing</li>
        </ul>
      </div>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

## When To Use It

Use this rule when:
- You're using Accordion components from shadcn/ui
- You want to catch structural errors during development
- You want to ensure all accordions are properly constructed

## Implementation Details

This rule:
- Checks every `AccordionItem` component
- Recursively searches for `AccordionTrigger` child
- Recursively searches for `AccordionContent` child
- Searches through nested JSX and expressions
- Reports specific errors for each missing component

## When Not To Use It

You might disable this rule if:
- You're not using shadcn/ui Accordion components
- You have a custom accordion implementation
- You're incrementally building the component structure

## Options

This rule has no configuration options.

## Related Rules

- [`accordion-item-requires-value`](./accordion-item-requires-value.md) - Validates AccordionItem has unique values
- [`combobox-complete-structure`](./combobox-complete-structure.md) - Similar structural validation

## Compatibility

- **Radix/shadcn**: ✅ Yes
- **Base UI**: ✅ Yes

## Further Reading

- [shadcn/ui Accordion Documentation](https://ui.shadcn.com/docs/components/accordion)
- [Radix UI Accordion](https://www.radix-ui.com/primitives/docs/components/accordion)
- [ARIA: accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
