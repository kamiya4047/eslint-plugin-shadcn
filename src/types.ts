import type { ESLint, Rule } from 'eslint';

export interface PluginMeta {
  name: string;
  version: string;
}

export interface ShadcnPluginConfig {
  plugins: {
    shadcn: ESLint.Plugin;
  };
  rules: Record<string, string | [string, unknown]>;
}

export type RuleModule = Rule.RuleModule;
