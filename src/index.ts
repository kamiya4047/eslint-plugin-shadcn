import accordionCompleteStructure from './rules/accordion-complete-structure';
import accordionItemRequiresValue from './rules/accordion-item-requires-value';
import buttonNoLinkRender from './rules/button-no-link-render';
import checkboxRequiresLabel from './rules/checkbox-requires-label';
import comboboxCompleteStructure from './rules/combobox-complete-structure';
import componentsPath from './rules/components-path';
import dataDisabledFieldConsistency from './rules/data-disabled-field-consistency';
import dataIconAttribute from './rules/data-icon-attribute';
import dataInvalidFieldConsistency from './rules/data-invalid-field-consistency';
import dialogRequiresTitleDescription from './rules/dialog-requires-title-description';
import pkg from '../package.json';
import radioGroupItemRequiresLabel from './rules/radio-group-item-requires-label';
import selectItemRequiresValue from './rules/select-item-requires-value';
import switchRequiresLabel from './rules/switch-requires-label';
import tabsValueConsistency from './rules/tabs-value-consistency';
import tooltipDisabledElementWrapper from './rules/tooltip-disabled-element-wrapper';

import type { ESLint, Linter } from 'eslint';

interface Plugin extends ESLint.Plugin {
  configs: Record<
    'radix-recommended'
    | 'radix-recommended-warn'
    | 'radix-all'
    | 'radix-all-warn'
    | 'base-recommended'
    | 'base-recommended-warn'
    | 'base-all'
    | 'base-all-warn',
    Linter.Config
  >;
}

const plugin: Plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: {
    'data-icon-attribute': dataIconAttribute,
    'button-no-link-render': buttonNoLinkRender,
    'components-path': componentsPath,
    'data-disabled-field-consistency': dataDisabledFieldConsistency,
    'data-invalid-field-consistency': dataInvalidFieldConsistency,
    'switch-requires-label': switchRequiresLabel,
    'tooltip-disabled-element-wrapper': tooltipDisabledElementWrapper,
    'tabs-value-consistency': tabsValueConsistency,
    'accordion-item-requires-value': accordionItemRequiresValue,
    'select-item-requires-value': selectItemRequiresValue,
    'dialog-requires-title-description': dialogRequiresTitleDescription,
    'checkbox-requires-label': checkboxRequiresLabel,
    'radio-group-item-requires-label': radioGroupItemRequiresLabel,
    'combobox-complete-structure': comboboxCompleteStructure,
    'accordion-complete-structure': accordionCompleteStructure,
  },
  configs: {} as Record<
    'radix-recommended'
    | 'radix-recommended-warn'
    | 'radix-all'
    | 'radix-all-warn'
    | 'base-recommended'
    | 'base-recommended-warn'
    | 'base-all'
    | 'base-all-warn',
    Linter.Config
  >,
};

// Radix/shadcn configurations
const radixRecommendedRules = [
  'shadcn/data-icon-attribute',
  'shadcn/components-path',
  'shadcn/data-disabled-field-consistency',
  'shadcn/data-invalid-field-consistency',
  'shadcn/tooltip-disabled-element-wrapper',
  'shadcn/tabs-value-consistency',
  'shadcn/accordion-item-requires-value',
  'shadcn/select-item-requires-value',
];

const radixAllRules = [
  'shadcn/data-icon-attribute',
  'shadcn/components-path',
  'shadcn/data-disabled-field-consistency',
  'shadcn/data-invalid-field-consistency',
  'shadcn/tooltip-disabled-element-wrapper',
  'shadcn/tabs-value-consistency',
  'shadcn/accordion-item-requires-value',
  'shadcn/select-item-requires-value',
  'shadcn/dialog-requires-title-description',
  'shadcn/checkbox-requires-label',
  'shadcn/radio-group-item-requires-label',
  'shadcn/combobox-complete-structure',
  'shadcn/accordion-complete-structure',
  'shadcn/switch-requires-label',
];

// Base UI configurations
const baseRecommendedRules = [
  'shadcn/button-no-link-render',
  'shadcn/components-path',
  'shadcn/data-disabled-field-consistency',
  'shadcn/data-invalid-field-consistency',
  'shadcn/tooltip-disabled-element-wrapper',
  'shadcn/tabs-value-consistency',
  'shadcn/accordion-item-requires-value',
  'shadcn/select-item-requires-value',
];

const baseAllRules = [
  'shadcn/button-no-link-render',
  'shadcn/components-path',
  'shadcn/data-disabled-field-consistency',
  'shadcn/data-invalid-field-consistency',
  'shadcn/tooltip-disabled-element-wrapper',
  'shadcn/tabs-value-consistency',
  'shadcn/accordion-item-requires-value',
  'shadcn/select-item-requires-value',
  'shadcn/dialog-requires-title-description',
  'shadcn/checkbox-requires-label',
  'shadcn/radio-group-item-requires-label',
  'shadcn/combobox-complete-structure',
  'shadcn/accordion-complete-structure',
  'shadcn/switch-requires-label',
];

const toRules = (names: string[], severity: 'error' | 'warn') => Object.fromEntries(
  names.map((key) => [key, severity]),
);

Object.assign(plugin.configs, {
  // Radix configs
  'radix-recommended': {
    plugins: { shadcn: plugin },
    rules: toRules(radixRecommendedRules, 'error'),
  },
  'radix-recommended-warn': {
    plugins: { shadcn: plugin },
    rules: toRules(radixRecommendedRules, 'warn'),
  },
  'radix-all': {
    plugins: { shadcn: plugin },
    rules: toRules(radixAllRules, 'error'),
  },
  'radix-all-warn': {
    plugins: { shadcn: plugin },
    rules: toRules(radixAllRules, 'warn'),
  },

  // Base UI configs
  'base-recommended': {
    plugins: { shadcn: plugin },
    rules: toRules(baseRecommendedRules, 'error'),
  },
  'base-recommended-warn': {
    plugins: { shadcn: plugin },
    rules: toRules(baseRecommendedRules, 'warn'),
  },
  'base-all': {
    plugins: { shadcn: plugin },
    rules: toRules(baseAllRules, 'error'),
  },
  'base-all-warn': {
    plugins: { shadcn: plugin },
    rules: toRules(baseAllRules, 'warn'),
  },
});

export default plugin;
