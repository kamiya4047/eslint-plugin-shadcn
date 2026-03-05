# switch-requires-label

Enforces that Switch components have an accessible label for screen readers.

## Rule Details

This rule ensures that every Switch component has an accessible label. A Switch must have one of the following:

1. A `FieldLabel` sibling within a parent `Field` component
2. An `aria-label` attribute
3. An `aria-labelledby` attribute

### Examples of **incorrect** code:

```tsx
// ❌ Switch without any label
<Switch />

// ❌ Switch in Field without FieldLabel
<Field>
  <Switch />
</Field>

// ❌ Switch in div without aria-label
<div>
  <Switch />
</div>

// ❌ Field with other children but no FieldLabel
<Field>
  <div>Some content</div>
  <Switch />
</Field>
```

### Examples of **correct** code:

```tsx
// ✅ Switch with FieldLabel sibling in Field
<Field>
  <FieldLabel>Enable notifications</FieldLabel>
  <Switch />
</Field>

// ✅ FieldLabel can come after Switch
<Field>
  <Switch />
  <FieldLabel>Enable notifications</FieldLabel>
</Field>

// ✅ Switch with aria-label
<Switch aria-label="Enable notifications" />

// ✅ Switch with aria-labelledby
<Switch aria-labelledby="notification-label" />

// ✅ Switch in Field with aria-label (doesn't need FieldLabel)
<Field>
  <Switch aria-label="Enable notifications" />
</Field>

// ✅ Complete example with description
<Field>
  <FieldLabel>Enable notifications</FieldLabel>
  <FieldDescription>
    Receive email notifications for updates
  </FieldDescription>
  <Switch />
</Field>
```

## When To Use It

Use this rule when:
- You want to catch accessibility issues during development
- You're building applications that need to meet WCAG guidelines
- You want to enforce accessible patterns

## Auto-fix

This rule does not provide automatic fixes because it requires developer input to provide meaningful label text.

## Options

This rule has no configuration options.

## Accessibility

Proper labeling is important for:
- **Screen readers**: Users need to know what the switch controls
- **Keyboard navigation**: Labels provide context when tabbing through forms
- **Motor impairments**: Larger click targets when labels are clickable
- **Cognitive accessibility**: Clear labels help all users understand the control

### WCAG Success Criteria

This rule helps meet:
- [WCAG 2.1 Success Criterion 1.3.1: Info and Relationships (Level A)](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html)
- [WCAG 2.1 Success Criterion 3.3.2: Labels or Instructions (Level A)](https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html)
- [WCAG 2.1 Success Criterion 4.1.2: Name, Role, Value (Level A)](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)

## When Not To Use It

You might disable this rule if:
- You're in a prototyping phase and want to add labels later
- You have a custom labeling solution not recognized by this rule
- Your design system has different accessibility requirements

However, it's recommended to keep this rule enabled to catch accessibility issues early.

## Related Rules

- [`switch-disabled-field-consistency`](./switch-disabled-field-consistency.md) - Ensures disabled state consistency
- [`switch-invalid-field-consistency`](./switch-invalid-field-consistency.md) - Ensures invalid state consistency

## Further Reading

- [shadcn/ui Switch Documentation](https://ui.shadcn.com/docs/components/switch)
- [ARIA Label Attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label)
- [ARIA Labelledby Attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby)
- [WebAIM: Creating Accessible Forms](https://webaim.org/techniques/forms/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
