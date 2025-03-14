import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import commonJS from '@rollup/plugin-commonjs';
import {visualizer} from 'rollup-plugin-visualizer';
import size from 'rollup-plugin-size';
import packageJson from './package.json' assert {type: 'json'};
import isCi from 'is-ci';

export default {
  external: ['react', 'react-dom', 'mobx', 'mobx-react-lite', 'lodash'],
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
    },
  ],
  plugins: [
    typescript(),
    commonJS(),
    terser(),
    size(),
    !isCi && visualizer({
      filename: `./build-stats.html`,
      gzipSize: true,
    }),
  ],
};
