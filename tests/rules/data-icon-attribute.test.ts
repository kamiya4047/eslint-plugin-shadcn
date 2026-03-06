import { RuleTester } from 'eslint';
import { describe } from 'mocha';

import rule from '../../src/rules/data-icon-attribute';

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

describe('data-icon-attribute', () => {
  ruleTester.run('should allow icons with data-icon attribute', rule, {
    valid: [
      {
        code: `
          import { Button } from "@/components/ui/button";
          import { IconGitBranch } from "@tabler/icons-react";
          <Button variant="outline" size="sm">
            <IconGitBranch data-icon="inline-start" /> New Branch
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          import { IconArrowRight } from "@tabler/icons-react";
          <Button>
            Submit <IconArrowRight data-icon="inline-end" />
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          import { Plus } from "lucide-react";
          <Button>
            <Plus data-icon="inline-start" /> Add Item
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          import { PlusIcon } from "@heroicons/react/24/outline";
          <Button>
            <PlusIcon data-icon="inline-start" /> Create
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          <Button>
            No icons here
          </Button>
        `,
      },
      {
        code: `
          import { IconGitBranch } from "@tabler/icons-react";
          <div>
            <IconGitBranch /> Not in a Button
          </div>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          <Button variant="outline" disabled>
            <Spinner data-icon="inline-start" />
            Generating
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          <Button variant="secondary" disabled>
            Downloading
            <Spinner data-icon="inline-end" />
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          import { Kbd } from "@/components/ui/kbd";
          <Button>
            <Kbd data-icon="inline-start">Ctrl</Kbd> Save
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          import { Kbd } from "@/components/ui/kbd";
          <Button>
            Open <Kbd data-icon="inline-end">⌘K</Kbd>
          </Button>
        `,
      },
      {
        code: `
          import { Badge } from "@/components/ui/badge";
          import { Kbd } from "@/components/ui/kbd";
          <Badge>
            <Kbd data-icon="inline-start">Esc</Kbd> Close
          </Badge>
        `,
      },
      {
        code: `
          import { Button } from "some-other-library";
          import { Plus } from "lucide-react";
          <Button>
            <Plus /> This should not trigger (different Button)
          </Button>
        `,
      },
      {
        code: `
          import { Badge } from "@/components/ui/badge";
          import { Check } from "lucide-react";
          <Badge>
            <Check data-icon="inline-start" /> Verified
          </Badge>
        `,
      },
      {
        code: `
          import { Badge } from "@/components/ui/badge";
          <Badge>
            <Spinner data-icon="inline-start" /> Processing
          </Badge>
        `,
      },
      {
        code: `
          import { Badge } from "@/components/ui/badge";
          <Badge>
            No icons here
          </Badge>
        `,
      },
      {
        code: `
          import { Badge } from "some-other-library";
          import { Check } from "lucide-react";
          <Badge>
            <Check /> This should not trigger (different Badge)
          </Badge>
        `,
      },
      {
        code: `
          import { Badge } from "@/components/ui/badge";
          import { Check } from "lucide-react";
          <Badge>
            <Check /> Should not trigger (Badge ignored)
          </Badge>
        `,
        options: [{ ignore: ['Badge'] }],
      },
    ],
    invalid: [],
  });

  ruleTester.run('should enforce data-icon attribute on icons in Button and Badge', rule, {
    valid: [],
    invalid: [
      {
        code: `
          import { Button } from "@/components/ui/button";
          import { IconGitBranch } from "@tabler/icons-react";
          <Button variant="outline" size="sm">
            <IconGitBranch /> New Branch
          </Button>
        `,
        errors: [
          {
            messageId: 'missingDataIcon',
          },
        ],
        output: `
          import { Button } from "@/components/ui/button";
          import { IconGitBranch } from "@tabler/icons-react";
          <Button variant="outline" size="sm">
            <IconGitBranch data-icon="inline-start" /> New Branch
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          import { IconArrowRight } from "@tabler/icons-react";
          <Button>
            Submit <IconArrowRight />
          </Button>
        `,
        errors: [
          {
            messageId: 'missingDataIcon',
          },
        ],
        output: `
          import { Button } from "@/components/ui/button";
          import { IconArrowRight } from "@tabler/icons-react";
          <Button>
            Submit <IconArrowRight data-icon="inline-end" />
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          import { IconPlus } from "@tabler/icons-react";
          <Button>
            <IconPlus className="h-4 w-4" /> Add
          </Button>
        `,
        errors: [
          {
            messageId: 'missingDataIcon',
          },
        ],
        output: `
          import { Button } from "@/components/ui/button";
          import { IconPlus } from "@tabler/icons-react";
          <Button>
            <IconPlus data-icon="inline-start" className="h-4 w-4" /> Add
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          import { GitBranch } from "lucide-react";
          <Button>
            <GitBranch /> Branch
          </Button>
        `,
        errors: [
          {
            messageId: 'missingDataIcon',
          },
        ],
        output: `
          import { Button } from "@/components/ui/button";
          import { GitBranch } from "lucide-react";
          <Button>
            <GitBranch data-icon="inline-start" /> Branch
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          import { TablerPlus } from "@tabler/icons-react";
          <Button>
            <TablerPlus /> Add
          </Button>
        `,
        errors: [
          {
            messageId: 'missingDataIcon',
          },
        ],
        output: `
          import { Button } from "@/components/ui/button";
          import { TablerPlus } from "@tabler/icons-react";
          <Button>
            <TablerPlus data-icon="inline-start" /> Add
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          import { PlusIcon } from "react-icons/fa";
          <Button>
            <PlusIcon /> Create
          </Button>
        `,
        errors: [
          {
            messageId: 'missingDataIcon',
          },
        ],
        output: `
          import { Button } from "@/components/ui/button";
          import { PlusIcon } from "react-icons/fa";
          <Button>
            <PlusIcon data-icon="inline-start" /> Create
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          import { IconGitBranch } from "@tabler/icons-react";
          <Button>
            <IconGitBranch data-icon="invalid" /> Branch
          </Button>
        `,
        errors: [
          {
            messageId: 'invalidDataIconValue',
          },
        ],
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          <Button variant="outline" disabled>
            <Spinner />
            Generating
          </Button>
        `,
        errors: [
          {
            messageId: 'missingDataIcon',
          },
        ],
        output: `
          import { Button } from "@/components/ui/button";
          <Button variant="outline" disabled>
            <Spinner data-icon="inline-start" />
            Generating
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          <Button variant="secondary" disabled>
            Downloading
            <Spinner />
          </Button>
        `,
        errors: [
          {
            messageId: 'missingDataIcon',
          },
        ],
        output: `
          import { Button } from "@/components/ui/button";
          <Button variant="secondary" disabled>
            Downloading
            <Spinner data-icon="inline-end" />
          </Button>
        `,
      },
      {
        code: `
          import { Badge } from "@/components/ui/badge";
          import { Check } from "lucide-react";
          <Badge>
            <Check /> Verified
          </Badge>
        `,
        errors: [
          {
            messageId: 'missingDataIcon',
          },
        ],
        output: `
          import { Badge } from "@/components/ui/badge";
          import { Check } from "lucide-react";
          <Badge>
            <Check data-icon="inline-start" /> Verified
          </Badge>
        `,
      },
      {
        code: `
          import { Badge } from "@/components/ui/badge";
          import { AlertCircle } from "lucide-react";
          <Badge variant="destructive">
            Error <AlertCircle />
          </Badge>
        `,
        errors: [
          {
            messageId: 'missingDataIcon',
          },
        ],
        output: `
          import { Badge } from "@/components/ui/badge";
          import { AlertCircle } from "lucide-react";
          <Badge variant="destructive">
            Error <AlertCircle data-icon="inline-end" />
          </Badge>
        `,
      },
      {
        code: `
          import { Badge } from "@/components/ui/badge";
          <Badge>
            <Spinner /> Processing
          </Badge>
        `,
        errors: [
          {
            messageId: 'missingDataIcon',
          },
        ],
        output: `
          import { Badge } from "@/components/ui/badge";
          <Badge>
            <Spinner data-icon="inline-start" /> Processing
          </Badge>
        `,
      },
      {
        code: `
          import { Badge } from "@/components/ui/badge";
          import { Check } from "lucide-react";
          <Badge>
            <Check data-icon="invalid-value" /> Verified
          </Badge>
        `,
        errors: [
          {
            messageId: 'invalidDataIconValue',
          },
        ],
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          import { Kbd } from "@/components/ui/kbd";
          <Button>
            <Kbd>Ctrl</Kbd> Save
          </Button>
        `,
        errors: [
          {
            messageId: 'missingDataIcon',
          },
        ],
        output: `
          import { Button } from "@/components/ui/button";
          import { Kbd } from "@/components/ui/kbd";
          <Button>
            <Kbd data-icon="inline-start">Ctrl</Kbd> Save
          </Button>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          import { Kbd } from "@/components/ui/kbd";
          <Button>
            Open <Kbd>⌘K</Kbd>
          </Button>
        `,
        errors: [
          {
            messageId: 'missingDataIcon',
          },
        ],
        output: `
          import { Button } from "@/components/ui/button";
          import { Kbd } from "@/components/ui/kbd";
          <Button>
            Open <Kbd data-icon="inline-end">⌘K</Kbd>
          </Button>
        `,
      },
      {
        code: `
          import { Badge } from "@/components/ui/badge";
          import { Kbd } from "@/components/ui/kbd";
          <Badge>
            <Kbd>Esc</Kbd> Close
          </Badge>
        `,
        errors: [
          {
            messageId: 'missingDataIcon',
          },
        ],
        output: `
          import { Badge } from "@/components/ui/badge";
          import { Kbd } from "@/components/ui/kbd";
          <Badge>
            <Kbd data-icon="inline-start">Esc</Kbd> Close
          </Badge>
        `,
      },
      {
        code: `
          import { Button } from "@/components/ui/button";
          import { Kbd } from "@/components/ui/kbd";
          <Button>
            <Kbd data-icon="wrong">Ctrl</Kbd> Save
          </Button>
        `,
        errors: [
          {
            messageId: 'invalidDataIconValue',
          },
        ],
      },
    ],
  });
});
