# tabs-value-consistency

Enforces that `TabsTrigger` value props match `TabsContent` value props.

## Rule Details

The Tabs component relies on matching `value` props between `TabsTrigger` and `TabsContent` components to function correctly. When a user clicks a trigger, the Tabs component uses the value to show the corresponding content. Mismatched values result in broken functionality where clicking a tab trigger shows nothing or the wrong content.

This rule validates that:
- Every `TabsTrigger` has a matching `TabsContent` with the same value
- Every `TabsContent` has a matching `TabsTrigger` with the same value

## Examples

### Examples of **incorrect** code:

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ❌ TabsTrigger "settings" has no matching TabsContent
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <h3>Account Settings</h3>
    <p>Manage your account settings here.</p>
  </TabsContent>
  <TabsContent value="password">
    <h3>Password</h3>
    <p>Change your password here.</p>
  </TabsContent>
</Tabs>

// ❌ TabsContent "notifications" has no matching TabsTrigger
<Tabs defaultValue="general">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
  </TabsList>
  <TabsContent value="general">General settings</TabsContent>
  <TabsContent value="security">Security settings</TabsContent>
  <TabsContent value="notifications">Notification settings</TabsContent>
</Tabs>
```

### Examples of **correct** code:

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ✅ All triggers have matching content
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <h3>Account Settings</h3>
    <p>Manage your account settings here.</p>
  </TabsContent>
  <TabsContent value="password">
    <h3>Password</h3>
    <p>Change your password here.</p>
  </TabsContent>
</Tabs>

// ✅ Works with dynamic values
<Tabs defaultValue={tabs[0].value}>
  <TabsList>
    {tabs.map((tab) => (
      <TabsTrigger key={tab.value} value={tab.value}>
        {tab.label}
      </TabsTrigger>
    ))}
  </TabsList>
  {tabs.map((tab) => (
    <TabsContent key={tab.value} value={tab.value}>
      {tab.content}
    </TabsContent>
  ))}
</Tabs>
```

## When To Use It

Use this rule when:
- You're building tabbed interfaces with shadcn/ui
- You want to catch configuration errors at lint time
- You want to prevent runtime errors where tabs don't work

## Implementation Details

This rule:
- Tracks all `Tabs` components in the file
- Collects all `TabsTrigger` and `TabsContent` value props within each `Tabs`
- Validates matches after all elements are processed
- Only checks literal string values (not computed/dynamic values)
- Reports errors at the trigger/content location with the mismatched value

## When Not To Use It

You might disable this rule if:
- You're using dynamic tab generation with computed values
- You have a custom Tabs implementation
- Your tab values are determined at runtime

However, the rule only checks literal string values, so it won't interfere with most dynamic implementations.

## Options

This rule has no configuration options.

## Related Rules

- [`accordion-item-requires-value`](./accordion-item-requires-value.md) - Similar pattern for Accordion values

## Compatibility

- **Radix/shadcn**: ✅ Yes
- **Base UI**: ✅ Yes

## Further Reading

- [shadcn/ui Tabs Documentation](https://ui.shadcn.com/docs/components/tabs)
- [Radix UI Tabs](https://www.radix-ui.com/primitives/docs/components/tabs)
- [ARIA: tab role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role)
