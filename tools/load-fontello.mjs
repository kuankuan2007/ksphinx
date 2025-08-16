import fs from 'node:fs';
import compressing from 'compressing';
import os from 'node:os';
import path from 'node:path';

if (process.argv.length <= 2) {
  throw new Error('Please input fontello file path');
}
const zipPath = process.argv[2];
const uncompressDirPath = path.join(os.tmpdir(), 'fontello' + Math.random().toString());
const filePath = path.join(uncompressDirPath, path.basename(zipPath).replace('.zip', ''));

compressing.zip.uncompress(zipPath, uncompressDirPath).then(
  () => {
    console.log('uncompress success');
    const fonts = fs.readdirSync(path.join(filePath, 'font'));
    fonts.forEach((font) => {
      fs.copyFileSync(
        path.join(filePath, 'font', font),
        path.join(process.cwd(), 'src', 'ksphinx', 'themes', 'ksphinx', 'static', 'fontello', font)
      );
      console.log(`Copy ${font} success`);
    });
  },
  (e) => {
    throw e;
  }
);
