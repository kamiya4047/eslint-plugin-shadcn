# components-path

💡 This rule provides editor suggestions for fixing issues.

Prevents importing shadcn/ui components from primitive packages when they exist locally.

## Rule Details

IDEs somethimes auto-import from primitive packages (like `@radix-ui/react-dialog`) instead of your local components. This rule catches that.

Detects imports from:
- `@radix-ui/*` - scoped packages
- `radix-ui` - unified package
- `@base-ui/*`

When a primitive import is detected, the rule checks if that component exists in your `components/ui` directory. If it does, you get two suggestions:

1. Import from your local component
2. Use an explicit primitive import if you actually need the primitive

## Examples

### Examples of **incorrect** code:

```tsx
// Named imports from primitive packages when local component exists
import { Dialog } from "@radix-ui/react-dialog";
import { Button } from "@radix-ui/react-button";
import { Dialog, Button } from "radix-ui";

function MyComponent() {
  return (
    <Dialog>
      <Button>Open</Button>
    </Dialog>
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

// Namespace imports from scoped packages are OK (explicit intent)
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as RadixUI from "radix-ui";

// Aliased imports from unified package are OK (explicit intent + tree-shaking)
import { Dialog as DialogPrimitive } from "radix-ui";

// Importing from primitives is OK if component doesn't exist locally
import { Tooltip } from "@radix-ui/react-tooltip";
import { Tooltip } from "radix-ui";

// Other packages are not affected
import { useState } from "react";
import { clsx } from "clsx";
```

## When To Use It

Use this if you have shadcn/ui components and want to prevent IDE from auto-importing the wrong one.

## How It Works

1. Reads `components.json` for your component path
2. Scans and caches available components once per run
3. Detects named imports from primitive packages
4. Maps package names to component names (PascalCase → kebab-case)
5. Reports an error if the component exists locally
6. Suggests local import or explicit primitive import

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

## Editor Suggestions

When an issue is detected, you get two suggestions:

1. **Use local component**
   ```tsx
   // Before
   import { Button } from "@radix-ui/react-button";

   // After
   import { Button } from "@/components/ui/button";
   ```

2. **Use explicit primitive import**

   Scoped packages (`@radix-ui/*`):
   ```tsx
   import * as ButtonPrimitive from "@radix-ui/react-button";
   ```

   Unified package (`radix-ui`):
   ```tsx
   import { Button as ButtonPrimitive } from "radix-ui";
   ```

The rule doesn't flag namespace or aliased imports since those show you intentionally want the primitive.

## Options

This rule has no configuration options.

## Implementation Details

- Only reports non-aliased named imports
- Skips namespace and aliased imports
- Only reports when the component exists locally
- Does nothing if `components.json` is missing
- Works with custom component paths
- Preserves quote style in fixes

## When Not To Use It

Disable this if you are intentionally importing directly from primitive packages but still got flagged.

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
