# checkbox-requires-label

Enforces that Checkbox components have an accessible label via Field/FieldLabel, Label, or aria-label.

## Rule Details

Every Checkbox must have an accessible label so screen reader users know what they're checking. Without a label, users cannot understand the purpose of the checkbox, violating WCAG accessibility guidelines.

This rule ensures checkboxes are labeled through one of these methods:
1. Wrapped in `Field` with a `FieldLabel` sibling that has matching `htmlFor` and `id`
2. Paired with a `Label` component that has matching `htmlFor` and `id`
3. Has an `aria-label` or `aria-labelledby` attribute

## Examples

### Examples of **incorrect** code:

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";

// ❌ No label at all
<Checkbox id="terms" />

// ❌ Field without FieldLabel
<Field>
  <Checkbox id="terms" />
</Field>

// ❌ Label without matching htmlFor
<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <label>Accept terms</label>
</div>

// ❌ FieldLabel without matching htmlFor
<Field>
  <Checkbox id="terms" />
  <FieldLabel htmlFor="conditions">Accept conditions</FieldLabel>
</Field>
```

### Examples of **correct** code:

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

// ✅ Using Field + FieldLabel with matching htmlFor
<Field>
  <div className="flex items-center gap-2">
    <Checkbox id="terms" />
    <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
  </div>
</Field>

// ✅ Using Label with matching htmlFor
<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>

// ✅ Using aria-label
<Checkbox aria-label="Accept terms and conditions" />

// ✅ Using aria-labelledby
<div>
  <p id="terms-label">Accept terms and conditions</p>
  <Checkbox aria-labelledby="terms-label" />
</div>

// ✅ Complete form example
<form>
  <Field>
    <div className="flex items-center gap-2">
      <Checkbox id="marketing" name="marketing" />
      <FieldLabel htmlFor="marketing">
        I want to receive marketing emails
      </FieldLabel>
    </div>
  </Field>
  <Field>
    <div className="flex items-center gap-2">
      <Checkbox id="privacy" name="privacy" required />
      <FieldLabel htmlFor="privacy">
        I agree to the privacy policy *
      </FieldLabel>
    </div>
  </Field>
</form>
```

## When To Use It

Use this rule when:
- You're building forms with checkboxes
- You need to meet WCAG 2.1 compliance
- You want to catch accessibility issues during development

## Implementation Details

This rule:
- Checks every `Checkbox` component
- Validates presence of `aria-label` or `aria-labelledby`
- Searches for parent `Field` component
- Looks for `FieldLabel` or `Label` siblings with matching `htmlFor`
- Reports error if no accessible label is found

## Accessibility Impact

Proper checkbox labeling is essential for:
- **Screen readers**: Announce what the checkbox controls
- **Keyboard navigation**: Context when tabbing through forms
- **Motor impairments**: Larger click target when labels are clickable
- **Cognitive accessibility**: Clear labels help all users

### WCAG Success Criteria

This rule helps meet:
- [WCAG 2.1 Success Criterion 1.3.1: Info and Relationships (Level A)](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html)
- [WCAG 2.1 Success Criterion 3.3.2: Labels or Instructions (Level A)](https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html)
- [WCAG 2.1 Success Criterion 4.1.2: Name, Role, Value (Level A)](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)

## When Not To Use It

You might disable this rule if:
- You're in early prototyping phase (but re-enable before production)
- You have a custom labeling solution not recognized by this rule
- Your design system has different accessibility requirements

However, it's strongly recommended to keep this rule enabled for accessibility compliance.

## Options

This rule has no configuration options.

## Related Rules

- [`radio-group-item-requires-label`](./radio-group-item-requires-label.md) - Similar requirement for radio buttons
- [`switch-requires-label`](./switch-requires-label.md) - Similar requirement for switches

## Compatibility

- **Radix/shadcn**: ✅ Yes
- **Base UI**: ✅ Yes

## Further Reading

- [shadcn/ui Checkbox Documentation](https://ui.shadcn.com/docs/components/checkbox)
- [Radix UI Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox)
- [WebAIM: Creating Accessible Forms](https://webaim.org/techniques/forms/)
- [ARIA: checkbox role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/checkbox_role)
