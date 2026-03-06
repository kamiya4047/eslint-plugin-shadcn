# Contributing to eslint-plugin-shadcn

Thanks for considering a contribution! This guide covers development setup, how to add rules, testing, and our workflow.

## Quick Start

```bash
# Clone and install dependencies
git clone https://github.com/kamiya4047/eslint-plugin-shadcn.git
cd eslint-plugin-shadcn
bun install --frozen-lockfile --frozen-lockfile

# Run tests
bun run test

# Build the plugin
bun run build

# Lint your changes
bun run lint
```

## Project Structure

```text
eslint-plugin-shadcn/
├── src/
│   ├── rules/           # Individual rule implementations
│   ├── utils/           # Shared utilities
│   ├── types.ts         # TypeScript type definitions
│   └── index.ts         # Plugin entry point and configs
├── docs/
│   └── rules/           # Rule documentation
└── dist/                # Build output (generated)
```

## Development Workflow

### 1. Before You Start

Check existing issues and PRs to avoid duplicate work. If you're planning something substantial, open an issue first to discuss the approach.

### 2. Create a Branch

```bash
git checkout -b feature/your-rule-name
```

Use descriptive branch names:

- `feature/rule-name` for new rules
- `fix/issue-description` for bug fixes
- `docs/what-changed` for documentation

### 3. Making Changes

The project uses:

- **Bun** as the runtime and package manager
- **TypeScript** for type safety
- **Rollup** for building the distributable
- **ESLint** for linting and formatting

Keep changes focused. A PR that adds one rule is easier to review than one that adds three rules and refactors utilities.

## Adding a New Rule

### Step 1: Create the Rule File

Create `src/rules/your-rule-name.ts`:

```typescript
import type { Rule } from "eslint";
import type { JSXElement } from "estree-jsx";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem", // or "suggestion" or "layout"
    docs: {
      description: "Brief description of what the rule checks",
      recommended: false, // true if it should be in recommended configs
    },
    messages: {
      messageId: "Clear error message for developers",
    },
    fixable: "code", // Include if the rule provides automatic fixes
    schema: [], // Define options if the rule accepts configuration
  },
  create(context) {
    return {
      // AST visitor functions
      JSXElement(node: JSXElement) {
        // Your rule logic here
      },
    };
  },
};

export default rule;
```

**Tips:**

- Use `type: "problem"` for correctness issues (missing props, wrong structure)
- Use `type: "suggestion"` for best practices or style preferences
- Keep error messages clear and actionable - explain what's wrong and how to fix it
- Add auto-fixes when possible, but only if they're safe and unambiguous

### Step 2: Write Tests

Create `src/rules/your-rule-name.test.ts`:

```typescript
import { RuleTester } from "eslint";
import { test } from "bun:test";
import rule from "./your-rule-name";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

test("your-rule-name", () => {
  ruleTester.run("your-rule-name", rule, {
    valid: [
      // Code that should NOT trigger the rule
      { code: `<Component prop="value" />` },
      { code: `<Component>content</Component>` },
    ],
    invalid: [
      // Code that SHOULD trigger the rule
      {
        code: `<Component />`,
        errors: [{ messageId: "messageId" }],
        // Include output if the rule has auto-fix
        output: `<Component prop="value" />`,
      },
    ],
  });
});
```

Write tests for:

- Common valid usage patterns
- Edge cases that should pass
- All invalid patterns the rule catches
- Auto-fix behavior (if applicable)

Run your tests frequently while developing:

```bash
bun mocha src/rules/your-rule-name.test.ts
```

### Step 3: Register the Rule

Add your rule to `src/rules/index.ts`:

```typescript
export { default as yourRuleName } from './your-rule-name';
```

Then register it in `src/index.ts`:

```typescript
import yourRuleName from './rules/your-rule-name';

const plugin: Plugin = {
  // ...
  rules: {
    'your-rule-name': yourRuleName,
    // ... other rules
  },
};
```

Add it to the appropriate config arrays (radix, base, recommended, or all):

```typescript
const radixRecommendedRules = [
  // ... existing rules
  'shadcn/your-rule-name',
];
```

### Step 4: Document the Rule

Create `docs/rules/your-rule-name.md`:

````markdown
# your-rule-name

Brief description of what this rule enforces.

## Rule Details

Explain the problem this rule solves and why it matters.

Examples of **incorrect** code:

```jsx
// Bad example with explanation
<Component wrong="usage" />
```

Examples of **correct** code:

```jsx
// Good example with explanation
<Component correct="usage" />
```

## When Not To Use It

Describe scenarios where developers might want to disable this rule.

## Further Reading

- Link to relevant shadcn/ui docs
- Link to accessibility guidelines if applicable
````

Update the README.md to include your rule in the appropriate table.

## Testing Your Changes

```bash
# Run all tests
bun run test

# Lint your code
bun run lint

# Auto-fix linting issues
bun run lint:fix

# Build the plugin
bun run build
```

Make sure all tests pass and there are no linting errors before submitting a PR.

## Rule Design Guidelines

**Be specific.** Rules should check for concrete problems, not vague "best practices."

**Provide context.** Error messages should explain both what's wrong and why it matters.

**Consider Base UI vs Radix.** Some rules only apply to one framework. Separate rules when needed.

**Test thoroughly.** Include tests for edge cases, nested components, and different prop formats.

**Document trade-offs.** If a rule enforces an opinionated pattern, explain the reasoning in the docs.

## Code Style

Follow the existing patterns in the codebase:

- Use TypeScript for all new code
- Use `import type` for type-only imports
- Keep functions focused and single-purpose
- Add comments for non-obvious logic

The project uses ESLint for formatting. Run `bun run lint:fix` to auto-format your code.

## Commit Messages

Write clear commit messages:

```text
feat: add tooltip-disabled-element-wrapper rule

Enforces wrapping disabled elements in a span when inside
TooltipTrigger to ensure the tooltip works correctly.
```

Format:

- `feat:` for new rules or features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `test:` for test updates
- `refactor:` for code restructuring
- `chore:` for build/tooling changes

## Submitting a Pull Request

1. **Fork the repository** and create a branch from `main`
2. **Make your changes** following the guidelines above
3. **Test thoroughly** - all tests must pass
4. **Update documentation** - README and rule docs
5. **Submit the PR** with a clear description of what changed and why

PR description should include:

- What problem does this solve?
- How did you implement it?
- Any trade-offs or decisions worth mentioning?
- Screenshots or code examples if helpful

We'll review your PR and may suggest changes. That's normal, it helps us maintain code quality and consistency.

## Need Help?

- **Questions about implementation?** Open an issue or draft PR with your approach
- **Unsure if something is a bug?** Open an issue to discuss
- **Want to propose a new rule?** Open an issue first to get feedback on the idea

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
