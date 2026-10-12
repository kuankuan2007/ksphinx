import { build } from 'rolldown';
import fs from 'fs';
import path from 'node:path';
import { babel } from '@rollup/plugin-babel';

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), './package.json'), 'utf-8')
);

const banner = `/*!
 * @name k-sphinx
 * @package ksphinx (on pypi)
 * @license MulanPSL-2.0
 * @copyright (c) ${new Date().getFullYear()} kuankuan2007
 * @author KUANKUAN <2163826131@qq.com>
 * @source https://github.com/kuankuan2007/ksphinx
 * @build ${new Date().toISOString()}
 * @version ${packageJson.version}
 */`;

const INPUT_BASE = 'src-script/ksphinx/themes/ksphinx/static';
const OUTPUT_BASE = 'src/ksphinx/themes/ksphinx/static';
const targets = {
  [path.resolve(INPUT_BASE, 'index.ts')]: path.resolve(OUTPUT_BASE, 'ksphinx.js'),
  [path.resolve(INPUT_BASE, 'buildInfo.ts')]: path.resolve(OUTPUT_BASE, 'buildInfo.js'),
  [path.resolve(INPUT_BASE, 'notFound.ts')]: path.resolve(OUTPUT_BASE, 'notFound.js'),
};

(async () => {
  for (const [input, output] of Object.entries(targets)) {
    await build({
      input,
      plugins: [
        babel({
          babelHelpers: 'bundled',
          extensions: ['.ts', '.js', '.mjs', '.cjs'],
          babelrc: false,
          configFile: false,
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { ie: '11' },
                useBuiltIns: false,
                modules: false,
              },
            ],
            ['@babel/preset-typescript', { onlyRemoveTypeImports: true }],
          ],
        }),
      ],
      output: {
        file: output,
        format: 'iife',
        name: 'KSphinx',
        minify: true,
        banner,
      },
    });
    console.log(`Built ${output}`);
  }
})();
