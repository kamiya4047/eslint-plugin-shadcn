# dialog-requires-title-description

Enforces that Dialog components have `DialogTitle` and `DialogDescription` for accessibility.

## Rule Details

For proper accessibility, every `DialogContent` must contain both a `DialogTitle` and `DialogDescription`. These components provide essential context to screen reader users about the dialog's purpose and content.

According to WCAG 2.1 guidelines, dialogs must have:
- An accessible name (provided by `DialogTitle`)
- An accessible description (provided by `DialogDescription`)

Missing these elements creates a poor experience for users relying on assistive technologies, as they won't know what the dialog is for or what action they're being asked to take.

## Examples

### Examples of **incorrect** code:

```tsx
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ❌ Missing both title and description
<Dialog>
  <DialogTrigger asChild>
    <Button>Delete Account</Button>
  </DialogTrigger>
  <DialogContent>
    <p>This action cannot be undone.</p>
    <Button variant="destructive">Delete</Button>
  </DialogContent>
</Dialog>

// ❌ Missing description
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Settings</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle>Settings</DialogTitle>
    <div>Settings form here...</div>
  </DialogContent>
</Dialog>

// ❌ Missing title
<Dialog>
  <DialogTrigger asChild>
    <Button>Show Info</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogDescription>
      This is some important information.
    </DialogDescription>
  </DialogContent>
</Dialog>
```

### Examples of **correct** code:

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ✅ Complete dialog with title and description
<Dialog>
  <DialogTrigger asChild>
    <Button variant="destructive">Delete Account</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your
        account and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete Account</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// ✅ Form dialog with proper labels
<Dialog>
  <DialogTrigger asChild>
    <Button>Edit Profile</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      {/* Form fields */}
    </div>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## When To Use It

Use this rule when:
- You're building accessible applications
- You need to meet WCAG 2.1 Level A compliance
- You want to ensure screen reader users understand your dialogs

## Implementation Details

This rule:
- Checks every `DialogContent` component
- Recursively searches for `DialogTitle` and `DialogDescription` children
- Reports errors if either is missing
- Checks deeply nested children and JSX expressions

## Accessibility Impact

Proper dialog labeling is crucial for:
- **Screen readers**: Announce the dialog's purpose when opened
- **Keyboard navigation**: Context for users navigating via keyboard
- **Cognitive accessibility**: Clear communication helps all users
- **WCAG Compliance**: Meets Success Criteria 1.3.1, 2.4.6, and 4.1.2

### WCAG Success Criteria

This rule helps meet:
- [WCAG 2.1 Success Criterion 1.3.1: Info and Relationships (Level A)](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html)
- [WCAG 2.1 Success Criterion 2.4.6: Headings and Labels (Level AA)](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html)
- [WCAG 2.1 Success Criterion 4.1.2: Name, Role, Value (Level A)](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)

## When Not To Use It

You might disable this rule if:
- You're using a custom dialog implementation
- You have an alternative accessible labeling strategy
- You're in early prototyping phase (but re-enable before production)

However, it's strongly recommended to keep this rule enabled for accessibility compliance.

## Options

This rule has no configuration options.

## Related Rules

- [`switch-requires-label`](./switch-requires-label.md) - Similar accessibility requirement for Switch
- [`checkbox-requires-label`](./checkbox-requires-label.md) - Similar accessibility requirement for Checkbox

## Compatibility

- **Radix/shadcn**: ✅ Yes
- **Base UI**: ✅ Yes

## Further Reading

- [shadcn/ui Dialog Documentation](https://ui.shadcn.com/docs/components/dialog)
- [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
- [ARIA: dialog role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
