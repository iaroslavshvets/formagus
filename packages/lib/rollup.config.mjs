import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonJS from '@rollup/plugin-commonjs';
import {visualizer} from 'rollup-plugin-visualizer';
import size from 'rollup-plugin-size';
import packageJson from './package.json' assert {type: 'json'};

export default {
  external: ['react', 'react-dom', 'mobx', 'mobx-react', 'lodash', 'hoist-non-react-statics'],
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'es',
      sourcemap: true,
    }
  ],
  plugins: [
    typescript(),
    resolve(),
    commonJS(),
    size(),
    terser(),
    visualizer({
      filename: `./build-stats.html`,
      gzipSize: true,
    })
  ]
};