import { terser } from 'rollup-plugin-terser';
import ts from '@wessberg/rollup-plugin-ts';
import buble from '@rollup/plugin-buble';

const config = (file, plugins) => ({
  input: 'src/index.ts',
  output: {
    name: 'KDBush',
    format: 'umd',
    indent: false,
    file,
  },
  plugins,
});

const out = [
  config('build/kdbush.js', [ts()]),
  config('build/kdbush.min.js', [ts(), terser(), buble()]),
];

export default out;
