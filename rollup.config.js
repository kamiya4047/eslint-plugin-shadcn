import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

export default {
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
      declarationDir: 'dist',
      include: ['src/**/*'],
    }),
  ],
};
