import { test } from 'bun:test';

import { RuleTester } from 'eslint';

import rule from '../../src/rules/button-no-link-render';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

test('button-no-link-render', () => {
  ruleTester.run('button-no-link-render', rule, {
    valid: [
      {
        code: `
          import { buttonVariants } from "@/components/ui/button";
          <a href="#" className={buttonVariants({ variant: "secondary", size: "sm" })}>
            Login
          </a>
        `,
      },
      {
        code: `
          import { buttonVariants } from "@/components/ui/button";
          import Link from "next/link";
          <Link href="/login" className={buttonVariants({ variant: "secondary" })}>
            Login
          </Link>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          <Button onClick={handleClick}>
            Click me
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          <Button type="submit">
            Submit
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          <Button nativeButton={true}>
            Click me
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          <Button nativeButton={false} render={<div />}>
            Complex children
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          <Button nativeButton={false}>
            Click me
          </Button>
        `,
      },
    ],
    invalid: [
      {
        code: `
          import { Button } from "@/components/ui/button";
          <Button render={<a href="/login" />}>
            Login
          </Button>
        `,
        errors: [
          {
            messageId: 'noLinkRender',
          },
        ],
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          <Button render={<a href="#" />}>
            Login
          </Button>
        `,
        errors: [
          {
            messageId: 'noLinkRender',
          },
        ],
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          import Link from "next/link";
          <Button render={<Link href="/login" />}>
            Login
          </Button>
        `,
        errors: [
          {
            messageId: 'noLinkRender',
          },
        ],
      },
    ],
  });
});
