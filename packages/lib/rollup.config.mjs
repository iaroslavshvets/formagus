import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import packageJson from './package.json' assert {type: 'json'};

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      plugins: [terser()]
    },
    {
      file: packageJson.module,
      format: 'es',
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  plugins: [typescript()]
};