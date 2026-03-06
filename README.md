# eslint-plugin-shadcn

![Build](https://github.com/kamiya4047/eslint-plugin-shadcn/actions/workflows/build.yml/badge.svg)
![GitHub License](https://img.shields.io/github/license/kamiya4047/eslint-plugin-shadcn)
![NPM Version](https://img.shields.io/npm/v/eslint-plugin-shadcn)

ESLint plugin for shadcn/ui components.

## Installation

```bash
bun add -D eslint-plugin-shadcn
```

## Usage

The plugin includes separate configs for **Radix UI** (shadcn/ui) and **Base UI** projects.

### For Radix/shadcn Projects

```typescript
// eslint.config.ts
import shadcn from "eslint-plugin-shadcn";

export default [
  shadcn.configs["radix-recommended"],
  // your other configs...
];
```

### For Base UI Projects

```typescript
// eslint.config.ts
import shadcn from "eslint-plugin-shadcn";

export default [
  shadcn.configs["base-recommended"],
  // your other configs...
];
```

### Configurations

**Radix/shadcn:**

- `radix-recommended` - Essential rules as errors
- `radix-recommended-warn` - Essential rules as warnings
- `radix-all` - All Radix rules as errors
- `radix-all-warn` - All Radix rules as warnings

**Base UI:**

- `base-recommended` - Essential rules as errors
- `base-recommended-warn` - Essential rules as warnings
- `base-all` - All Base UI rules as errors
- `base-all-warn` - All Base UI rules as warnings

## Rules

### Core Rules

| Rule | Description | Fixable |
|------|-------------|---------|
| [data-icon-attribute](./docs/rules/data-icon-attribute.md) | Enforce `data-icon` attribute on icons/spinners/kbd in Button/Badge | 🔧 |
| [data-invalid-field-consistency](./docs/rules/data-invalid-field-consistency.md) | Enforce `data-invalid` on Field when components have `aria-invalid` (Switch, SelectTrigger, Input, Textarea, Checkbox, RadioGroup) | 🔧 |
| [data-disabled-field-consistency](./docs/rules/data-disabled-field-consistency.md) | Enforce `data-disabled` on Field when components are disabled (Switch, SelectTrigger, Input, Textarea, Checkbox, RadioGroup) | 🔧 |
| [components-path](./docs/rules/components-path.md) | Enforce consistent component import paths from @/components/ui | 💡 |

### Base UI Specific

| Rule | Description | Fixable |
|------|-------------|---------|
| [button-no-link-render](./docs/rules/button-no-link-render.md) | Prevent Button render prop for links (use buttonVariants instead) | |

### Component Structure & Values

| Rule | Description | Fixable |
|------|-------------|---------|
| [tooltip-disabled-element-wrapper](./docs/rules/tooltip-disabled-element-wrapper.md) | Enforce wrapping disabled elements in span inside TooltipTrigger | 🔧 |
| [tabs-value-consistency](./docs/rules/tabs-value-consistency.md) | Enforce TabsTrigger value props match TabsContent values | |
| [accordion-item-requires-value](./docs/rules/accordion-item-requires-value.md) | Enforce AccordionItem has unique value prop | |
| [select-item-requires-value](./docs/rules/select-item-requires-value.md) | Enforce SelectItem has value prop | |
| [accordion-complete-structure](./docs/rules/accordion-complete-structure.md) | Enforce AccordionItem contains AccordionTrigger and AccordionContent | |
| [combobox-complete-structure](./docs/rules/combobox-complete-structure.md) | Enforce Combobox has required hierarchical structure | |

### Accessibility

| Rule | Description | Fixable |
|------|-------------|---------|
| [switch-requires-label](./docs/rules/switch-requires-label.md) | Ensure Switch has accessible label (FieldLabel, aria-label, or aria-labelledby) | |
| [checkbox-requires-label](./docs/rules/checkbox-requires-label.md) | Ensure Checkbox has accessible label (Field > FieldLabel, Label, or aria-label) | |
| [radio-group-item-requires-label](./docs/rules/radio-group-item-requires-label.md) | Ensure RadioGroupItem has accessible label (Label or aria-label) | |
| [dialog-requires-title-description](./docs/rules/dialog-requires-title-description.md) | Enforce Dialog has DialogTitle and DialogDescription | |

For detailed information about each rule, click on the rule name to view its documentation.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and contribution guidelines.

## License

MIT
