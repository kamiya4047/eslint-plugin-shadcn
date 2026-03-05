# button-no-link-render

Prevents using the `Button` component with `render` prop for links.

## Rule Details

The Base UI Button component always applies `role="button"`, which overrides the semantic link role on `<a>` elements. This creates accessibility issues.

Instead of `<Button render={<a />} />`, use the `buttonVariants` helper function with a plain `<a>` tag or Next.js `<Link>` component.

## Examples

### Examples of **incorrect** code:

```tsx
// Using render prop with <a>
<Button render={<a href="/login" />}>
  Login
</Button>

// Using render prop with Link
<Button render={<Link href="/dashboard" />}>
  Dashboard
</Button>
```

### Examples of **correct** code:

```tsx
import { buttonVariants } from "@/components/ui/button";

// Plain anchor tag
<a href="/login" className={buttonVariants({ variant: "secondary", size: "sm" })}>
  Login
</a>

// Next.js Link
import Link from "next/link";

<Link href="/dashboard" className={buttonVariants({ variant: "secondary" })}>
  Dashboard
</Link>

// nativeButton={false} is fine when not used for links
<Button nativeButton={false} render={<div />}>
  Complex children
</Button>
```

## Options

This rule has no options.

## Implementation Details

This rule detects:
- ✅ `Button` components with `render={<a />}` prop
- ✅ `Button` components with `render={<Link />}` prop

Note: `nativeButton={false}` alone is **not** flagged, as it can be used legitimately with other elements like `<div />` for complex children.

## Why This Matters

1. **Accessibility**: Screen readers rely on proper semantic HTML. A button that wraps a link creates confusion.

2. **Semantics**: Links and buttons serve different purposes:
   - Links navigate to pages/sections
   - Buttons trigger actions

3. **Keyboard Navigation**: Links and buttons have different keyboard behaviors that users expect.

## When Not To Use It

This rule is specific to Base UI. If you're using Radix/shadcn, use the `radix-*` config which excludes this rule.

## Compatibility

- **Radix/shadcn**: ❌ No (Base UI-specific)
- **Base UI**: ✅ Yes

## Further Reading

- [Base UI Button Documentation](https://base-ui.netlify.app/components/button)
- [MDN: ARIA button role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role)
- [When to use links vs buttons](https://www.a11y-101.com/design/button-vs-link)
