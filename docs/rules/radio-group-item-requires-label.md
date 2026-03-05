# radio-group-item-requires-label

Enforces that RadioGroupItem components have an accessible label via Label, FieldLabel, or aria-label.

## Rule Details

Every RadioGroupItem must have an accessible label so screen reader users know what each option represents. Without labels, users cannot understand the choices available, violating WCAG accessibility guidelines.

This rule ensures radio buttons are labeled through one of these methods:
1. Paired with a `Label` or `FieldLabel` component that has matching `htmlFor` and `id`
2. Has an `aria-label` or `aria-labelledby` attribute

## Examples

### Examples of **incorrect** code:

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// ❌ RadioGroupItem without label
<RadioGroup defaultValue="option-1">
  <RadioGroupItem value="option-1" id="option-1" />
  <RadioGroupItem value="option-2" id="option-2" />
</RadioGroup>

// ❌ Label without matching htmlFor
<RadioGroup defaultValue="comfortable">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="comfortable" id="comfortable" />
    <label>Comfortable</label>
  </div>
</RadioGroup>

// ❌ Some items have labels, some don't
<RadioGroup defaultValue="default">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="default" id="default" />
    <Label htmlFor="default">Default</Label>
  </div>
  <RadioGroupItem value="comfortable" id="comfortable" />
</RadioGroup>
```

### Examples of **correct** code:

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Field, FieldLabel } from "@/components/ui/field";

// ✅ Using Label with htmlFor
<RadioGroup defaultValue="option-1">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option-1" id="option-1" />
    <Label htmlFor="option-1">Option 1</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option-2" id="option-2" />
    <Label htmlFor="option-2">Option 2</Label>
  </div>
</RadioGroup>

// ✅ Using aria-label
<RadioGroup defaultValue="comfortable">
  <RadioGroupItem value="comfortable" aria-label="Comfortable spacing" />
  <RadioGroupItem value="compact" aria-label="Compact spacing" />
</RadioGroup>

// ✅ Using FieldLabel in Field
<Field>
  <RadioGroup defaultValue="all">
    <div className="flex items-center gap-2">
      <RadioGroupItem value="all" id="all" />
      <FieldLabel htmlFor="all">Everyone</FieldLabel>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="mentions" id="mentions" />
      <FieldLabel htmlFor="mentions">People I follow</FieldLabel>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="none" id="none" />
      <FieldLabel htmlFor="none">No one</FieldLabel>
    </div>
  </RadioGroup>
</Field>

// ✅ Complete form example
<form>
  <Field>
    <legend className="text-sm font-medium">Notification preferences</legend>
    <RadioGroup defaultValue="all" name="notifications">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="all" id="notify-all" />
        <Label htmlFor="notify-all">
          All notifications
          <span className="text-sm text-muted-foreground block">
            Receive all notifications
          </span>
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="mentions" id="notify-mentions" />
        <Label htmlFor="notify-mentions">
          Mentions only
          <span className="text-sm text-muted-foreground block">
            Only when someone mentions you
          </span>
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="none" id="notify-none" />
        <Label htmlFor="notify-none">
          None
          <span className="text-sm text-muted-foreground block">
            Disable all notifications
          </span>
        </Label>
      </div>
    </RadioGroup>
  </Field>
</form>
```

## When To Use It

Use this rule when:
- You're building forms with radio buttons
- You need to meet WCAG 2.1 compliance
- You want to catch accessibility issues during development

## Implementation Details

This rule:
- Checks every `RadioGroupItem` component
- Validates presence of `aria-label` or `aria-labelledby`
- Searches for parent `RadioGroup` or `Field` component
- Looks for `Label` or `FieldLabel` siblings with matching `htmlFor`
- Reports error if no accessible label is found

## Accessibility Impact

Proper radio button labeling is essential for:
- **Screen readers**: Announce what each option represents
- **Keyboard navigation**: Context when using arrow keys to navigate options
- **Motor impairments**: Larger click target when labels are clickable
- **Cognitive accessibility**: Clear labels help all users understand choices

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

- [`checkbox-requires-label`](./checkbox-requires-label.md) - Similar requirement for checkboxes
- [`switch-requires-label`](./switch-requires-label.md) - Similar requirement for switches

## Compatibility

- **Radix/shadcn**: ✅ Yes
- **Base UI**: ✅ Yes

## Further Reading

- [shadcn/ui Radio Group Documentation](https://ui.shadcn.com/docs/components/radio-group)
- [Radix UI Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group)
- [WebAIM: Creating Accessible Forms](https://webaim.org/techniques/forms/)
- [ARIA: radio role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/radio_role)
