import * as sass from 'sass';
import postcss from 'postcss';
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import fs from 'fs';

const targets = [
  {
    src: './src-scss/ksphinx/themes/ksphinx/static/ksphinx.scss',
    dest: './src/ksphinx/themes/ksphinx/static/ksphinx.css',
  },
];

const postcssObj = postcss([
  postcssPresetEnv(),
  autoprefixer({
    overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8'],
    grid: true,
  }),
  cssnano(),
]);

(async function () {
  for (const target of targets) {
    console.log(`Building :${target.src}`)
    const res = await sass.compileAsync(target.src);
    const css = await postcssObj.process(res.css, {
      from: void 0,
      to: target.dest,
      map: false,
    });
    await fs.promises.writeFile(target.dest, css.css);
    console.log(`Build Successfully: ${target.src} => ${target.dest}`)
  }
})();
