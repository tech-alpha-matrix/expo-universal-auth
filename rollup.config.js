const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const json = require('@rollup/plugin-json');
const { readFileSync } = require('fs');

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
  commonjs({
    include: 'node_modules/**',
  }),
  json(),
];

module.exports = [
  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      interop: 'auto',
    },
    external,
    plugins: [
      ...commonPlugins,
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist',
        outDir: 'dist',
        sourceMap: true,
        inlineSources: false,
        module: 'ESNext',
        target: 'ES2020',
        moduleResolution: 'node',
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
        declarationMap: false,
        outDir: 'dist',
        sourceMap: true,
        inlineSources: false,
        module: 'ESNext',
        target: 'ES2020',
        moduleResolution: 'node',
      }),
    ],
  },
]; 