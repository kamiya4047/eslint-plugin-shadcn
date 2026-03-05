# data-icon-attribute

🔧 This rule is automatically fixable by the `--fix` CLI option.

Enforces the `data-icon` attribute on icons, spinners, and keyboard keys within components for correct spacing.

## Rule Details

Icons, spinners, and keyboard keys (Kbd) inside certain components should have either `data-icon="inline-start"` or `data-icon="inline-end"` for proper spacing. This rule enforces that pattern and can automatically fix violations.

**Default components checked:** Button, Badge

## Examples

### Examples of **incorrect** code:

```tsx
import { Plus } from "lucide-react";
import { IconGitBranch } from "@tabler/icons-react";
import { Check } from "lucide-react";

// Button
<Button variant="outline" size="sm">
  <IconGitBranch /> New Branch
</Button>

<Button>
  <Plus /> Add Item
</Button>

<Button variant="outline" disabled>
  <Spinner /> Generating
</Button>

// Badge
<Badge>
  <Check /> Verified
</Badge>

<Badge variant="destructive">
  Error <AlertCircle />
</Badge>

// Kbd
<Button>
  <Kbd>Ctrl</Kbd> Save
</Button>

<Button>
  Open <Kbd>⌘K</Kbd>
</Button>
```

### Examples of **correct** code:

```tsx
import { Plus } from "lucide-react";
import { IconGitBranch } from "@tabler/icons-react";
import { Check, AlertCircle } from "lucide-react";

// Button
<Button variant="outline" size="sm">
  <IconGitBranch data-icon="inline-start" /> New Branch
</Button>

<Button>
  <Plus data-icon="inline-start" /> Add Item
</Button>

<Button variant="outline" disabled>
  <Spinner data-icon="inline-start" /> Generating
</Button>

// Badge
<Badge>
  <Check data-icon="inline-start" /> Verified
</Badge>

<Badge variant="destructive">
  Error <AlertCircle data-icon="inline-end" />
</Badge>

// Kbd
<Button>
  <Kbd data-icon="inline-start">Ctrl</Kbd> Save
</Button>

<Button>
  Open <Kbd data-icon="inline-end">⌘K</Kbd>
</Button>
```

## Options

This rule accepts an options object with the following properties:

### `ignore`

Type: `string[]`
Default: `[]`

An array of component names to exclude from checking.

**Example:**

```js
// Only check Button (ignore Badge)
"shadcn/data-icon-attribute": ["error", {
  "ignore": ["Badge"]
}]

// Ignore both Button and Badge (effectively disables the rule)
"shadcn/data-icon-attribute": ["error", {
  "ignore": ["Button", "Badge"]
}]
```

## Implementation Details

This rule:
- Checks Button and Badge components by default
- Allows disabling specific components via `ignore` option
- Only applies to components imported from `@/components/ui`
- Automatically detects icon components by checking their import source
- Supports all major icon libraries (Tabler, Lucide, Heroicons, React Icons, etc.)
- Automatically detects `Spinner` and `Kbd` components
- Auto-fixes by adding the correct `data-icon` attribute
- Intelligently chooses `inline-start` for leading elements, `inline-end` for trailing
- Validates that the attribute value is either "inline-start" or "inline-end"

## Component Detection

The rule detects components that need `data-icon` by checking:

**Icon libraries** (automatically detected by import source):
- @tabler/icons-react - Tabler Icons
- lucide-react - Lucide Icons
- @heroicons/react - Heroicons
- react-icons - React Icons (all icon sets)
- @radix-ui/react-icons - Radix Icons
- feather-icons-react - Feather Icons
- phosphor-react - Phosphor Icons
- Any package with "icon" in its name

**Always checked** (regardless of import source):
- The `Spinner` component
- The `Kbd` component

## Auto-fix Behavior

When auto-fixing, the rule:
1. Analyzes the position of the icon within the component's children
2. Adds `data-icon="inline-start"` if the icon appears before other content
3. Adds `data-icon="inline-end"` if the icon appears after other content

## When Not To Use It

If you're not using shadcn/ui with the recommended Button component structure, you can disable this rule.

## Compatibility

- **Radix/shadcn**: ✅ Yes
- **Base UI**: ❌ No (Radix-specific)

## Further Reading

- [shadcn/ui Button Component](https://ui.shadcn.com/docs/components/button)
- [Button with Icon Examples](https://ui.shadcn.com/docs/components/button#with-icon)
