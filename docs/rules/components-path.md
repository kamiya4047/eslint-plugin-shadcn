# components-path

🔧 This rule is automatically fixable by the `--fix` CLI option.

Prevents importing shadcn/ui components directly from primitive packages when they exist in your local `components/ui` folder.

## Rule Details

When using shadcn/ui, IDE auto-import often suggests importing from primitive packages (e.g., `@radix-ui/react-dialog`) instead of your customized components. This rule enforces using local component imports.

The rule monitors imports from:
- `@radix-ui/*`
- `@base-ui/*`

When it detects an import from these packages, it checks if the component exists in your local `components/ui` directory. If found, it reports an error and suggests the correct local import path.

## Examples

### Examples of **incorrect** code:

```tsx
// Importing directly from primitive packages
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as ButtonPrimitive from "@radix-ui/react-button";
import { Select } from "@base-ui/react/select";

function MyComponent() {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger>Open</DialogPrimitive.Trigger>
    </DialogPrimitive.Root>
  );
}
```

### Examples of **correct** code:

```tsx
// Importing from local components/ui
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

function MyComponent() {
  return (
    <Dialog>
      <Button>Open</Button>
    </Dialog>
  );
}

// Importing from primitives is OK if component doesn't exist locally
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
// If tooltip.tsx does NOT exist in components/ui

// Other packages are not affected
import { useState } from "react";
import { clsx } from "clsx";
```

## When To Use It

Use this rule when:
- You're using shadcn/ui components in your project
- You want to ensure developers use local customized components
- You want to prevent accidental imports via IDE auto-import

## How It Works

1. Reads `components.json` to determine your local component path (e.g., `@/components/ui`)
2. Scans `components/ui` directory and caches available components (once per ESLint run)
3. Detects imports from primitive packages
4. Maps package names like `@radix-ui/react-dialog` to `dialog`
5. Checks if the component exists locally
6. Reports error if local component exists, suggests correct import
7. Auto-fixes by replacing primitive import with local import

### Performance

The rule uses intelligent caching:
- Reads `components.json` once per project
- Scans `components/ui` directory once per ESLint run
- Reuses cached data for all files
- No performance impact even with hundreds of files

## components.json Configuration

The rule reads your `components.json` to determine the correct import path:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "aliases": {
    "ui": "@/components/ui"
  }
}
```

### Custom Path

If you use a custom path:

```json
{
  "aliases": {
    "ui": "@/app/ui"
  }
}
```

The rule will suggest:

```tsx
import { Button } from "@/app/ui/button";
```

## Auto-fix

This rule provides automatic fixes. Running `eslint --fix` will replace primitive imports with local component imports.

## Options

This rule has no configuration options.

## Implementation Details

- ✅ Only reports errors when the component exists locally
- ✅ Silently skips if `components.json` is not found
- ✅ Supports all major UI primitive libraries
- ✅ Works with custom component paths
- ✅ Preserves other imports (React, utilities, etc.)

## When Not To Use It

You can disable this rule if:
- You're not using shadcn/ui components
- You prefer to import directly from UI primitive packages
- You're intentionally using both local and primitive imports for different purposes

## Related Rules

- [`data-icon-attribute`](./data-icon-attribute.md) - Enforce `data-icon` on icons in components
- [`button-no-link-render`](./button-no-link-render.md) - Prevent Button render prop for links

## Compatibility

- **Radix/shadcn**: ✅ Yes
- **Base UI**: ✅ Yes

## Further Reading

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [components.json Schema](https://ui.shadcn.com/docs/components-json)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Base UI Components](https://base-ui.com/)
