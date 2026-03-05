# tooltip-disabled-element-wrapper

🔧 This rule is automatically fixable by the `--fix` CLI option.

Enforces wrapping disabled elements in a `<span>` when used inside `TooltipTrigger`.

## Rule Details

Disabled elements do not receive pointer events in browsers, which prevents tooltips from working correctly. This is a common gotcha when trying to show tooltips on disabled buttons or inputs.

The solution is to wrap the disabled element in a `<span>` element. The span receives the pointer events and triggers the tooltip, while the disabled element inside remains non-interactive.

This pattern is documented in the [official shadcn/ui Tooltip documentation](https://ui.shadcn.com/docs/components/tooltip).

## Examples

### Examples of **incorrect** code:

```tsx
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// ❌ Tooltip won't work - disabled button doesn't receive pointer events
<Tooltip>
  <TooltipTrigger>
    <Button disabled>Save</Button>
  </TooltipTrigger>
  <TooltipContent>Save changes to database</TooltipContent>
</Tooltip>

// ❌ Same issue with other disabled elements
<Tooltip>
  <TooltipTrigger>
    <Input disabled placeholder="Email" />
  </TooltipTrigger>
  <TooltipContent>Email field is currently disabled</TooltipContent>
</Tooltip>
```

### Examples of **correct** code:

```tsx
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// ✅ Tooltip works - span receives pointer events
<Tooltip>
  <TooltipTrigger>
    <span className="inline-block">
      <Button disabled>Save</Button>
    </span>
  </TooltipTrigger>
  <TooltipContent>Save changes to database</TooltipContent>
</Tooltip>

// ✅ Enabled buttons don't need wrapper
<Tooltip>
  <TooltipTrigger>
    <Button>Save</Button>
  </TooltipTrigger>
  <TooltipContent>Save changes to database</TooltipContent>
</Tooltip>

// ✅ Works with any disabled element
<Tooltip>
  <TooltipTrigger>
    <span className="inline-block">
      <Input disabled placeholder="Email" />
    </span>
  </TooltipTrigger>
  <TooltipContent>Email field is currently disabled</TooltipContent>
</Tooltip>
```

## When To Use It

Use this rule when:
- You're using tooltips with potentially disabled elements
- You want to catch this common accessibility pattern error during development
- You want consistent tooltip behavior across enabled and disabled states

## Auto-fix

This rule provides automatic fixes. Running `eslint --fix` will:
1. Detect disabled elements inside `TooltipTrigger`
2. Wrap them in `<span className="inline-block">`
3. Preserve all existing props and children

The `inline-block` display is important to prevent the span from expanding to full width.

## Implementation Details

This rule:
- Only checks elements inside `TooltipTrigger` components
- Detects any element with a `disabled` prop
- Checks if the element is already wrapped in a `<span>`
- Reports an error if unwrapped
- Auto-fixes by adding the wrapper span

## Options

This rule has no configuration options.

## When Not To Use It

You might disable this rule if:
- You're not using shadcn/ui Tooltip components
- You have a custom tooltip implementation that handles disabled elements differently
- You're intentionally hiding tooltips on disabled elements

However, it's recommended to keep this rule enabled to ensure consistent tooltip behavior.

## Compatibility

- **Radix/shadcn**: ✅ Yes (recommended)
- **Base UI**: ✅ Yes

## Further Reading

- [shadcn/ui Tooltip Documentation](https://ui.shadcn.com/docs/components/tooltip)
- [MDN: Pointer Events](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events)
- [Radix UI Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip)
- [Accessible Tooltips](https://inclusive-components.design/tooltips-toggletips/)
