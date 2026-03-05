# Contributing

## Setup

1. Clone the repository
2. Install dependencies: `bun install`
3. Run tests: `bun test`

## Adding a Rule

1. Create a rule file in `src/rules/` (e.g., `my-rule.ts`)
2. Implement it following ESLint's structure:
   ```typescript
   import type { Rule } from "eslint";

   const rule: Rule.RuleModule = {
     meta: {
       type: "suggestion" | "problem" | "layout",
       docs: {
         description: "Rule description",
         recommended: false,
       },
       messages: {
         messageId: "Error message",
       },
       schema: [], // options schema
     },
     create(context) {
       return {
         // AST visitors
       };
     },
   };

   export default rule;
   ```

3. Add tests in `src/rules/my-rule.test.ts`:
   ```typescript
   import { RuleTester } from "eslint";
   import { test } from "bun:test";
   import rule from "./my-rule";

   const ruleTester = new RuleTester({
     languageOptions: {
       ecmaVersion: "latest",
       sourceType: "module",
     },
   });

   test("my-rule", () => {
     ruleTester.run("my-rule", rule, {
       valid: [
         // valid test cases
       ],
       invalid: [
         // invalid test cases
       ],
     });
   });
   ```

4. Export the rule in `src/rules/index.ts`
5. Add the rule to `src/index.ts`
6. Update the README with rule documentation

## Running Tests

```bash
bun test
```

## Code Style

Follow the existing code style. Use TypeScript for all new code.

## Submitting a Pull Request

1. Fork the repository
2. Create a new branch for your feature
3. Write tests for your changes
4. Ensure all tests pass
5. Submit a pull request
