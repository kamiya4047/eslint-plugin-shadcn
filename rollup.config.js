import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true,
    },
    external: [
      '@typescript-eslint/types',
      'eslint',
      'node:path',
      'node:fs',
    ],
    plugins: [
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist/temp',
        include: ['src/**/*'],
      }),
    ],
  },
  {
    input: 'dist/temp/index.d.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    external: [
      '@typescript-eslint/types',
      'eslint',
    ],
    plugins: [dts()],
  },
];
