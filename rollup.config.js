import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { readFileSync } from 'fs';
import dts from 'rollup-plugin-dts';

// Read package.json
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

const external = [
  ...Object.keys(packageJson.peerDependencies || {}),
  ...Object.keys(packageJson.optionalDependencies || {}),
  ...Object.keys(packageJson.dependencies || {}),
  'react/jsx-runtime',
  'react-native/Libraries/Utilities/Platform',
];

const commonPlugins = [
  resolve({
    preferBuiltins: false,
    browser: true,
  }),
  commonjs(),
  json(),
];

export default [
  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    external,
    plugins: [
      ...commonPlugins,
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        outDir: 'dist',
      }),
    ],
  },
  
  // ES Module build
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
    external,
    plugins: [
      ...commonPlugins,
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        outDir: 'dist',
      }),
    ],
  },
  
  // Type definitions
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.types,
      format: 'esm',
    },
    external,
    plugins: [dts()],
  },
]; 