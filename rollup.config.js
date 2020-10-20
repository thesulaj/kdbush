import {terser} from 'rollup-plugin-terser';
import ts from '@wessberg/rollup-plugin-ts';
import buble from '@rollup/plugin-buble';

const config = (file, plugins) => ({
    input: 'src/index.ts',
    output: {
        name: 'KDBush',
        format: 'umd',
        indent: false,
        file
    },
    plugins
});

export default [
    config('kdbush.ts', [ts()]),
    config('kdbush.min.js', [ts(), terser(), buble()])
];
