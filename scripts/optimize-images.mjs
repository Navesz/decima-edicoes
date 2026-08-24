import { mkdir, readdir, stat } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const sourceDirectory = join(root, 'assets', 'source-images');
const outputDirectory = join(root, 'public', 'images');
const responsiveWidths = [480, 800];

await mkdir(outputDirectory, { recursive: true });

const sourceFiles = (await readdir(sourceDirectory))
  .filter((file) => extname(file).toLowerCase() === '.png' && file !== 'og.png')
  .sort();

let sourceBytes = 0;
let outputBytes = 0;

for (const file of sourceFiles) {
  const source = join(sourceDirectory, file);
  const target = join(outputDirectory, `${basename(file, '.png')}.webp`);
  const quality = file === 'hero-yggdrasil.png' ? 85 : 82;

  const sourceImage = sharp(source).rotate();
  const metadata = await sourceImage.metadata();
  const renderedFiles = [];

  await sourceImage
    .clone()
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(target);
  renderedFiles.push(target);

  for (const width of responsiveWidths) {
    if (!metadata.width || metadata.width <= width) continue;
    const responsiveTarget = join(outputDirectory, `${basename(file, '.png')}-${width}.webp`);
    await sourceImage
      .clone()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6, smartSubsample: true })
      .toFile(responsiveTarget);
    renderedFiles.push(responsiveTarget);
  }

  const [sourceInfo, ...outputInfo] = await Promise.all([stat(source), ...renderedFiles.map((renderedFile) => stat(renderedFile))]);
  sourceBytes += sourceInfo.size;
  outputBytes += outputInfo.reduce((total, info) => total + info.size, 0);
  console.log(`${file} -> ${renderedFiles.map((renderedFile, index) => `${basename(renderedFile)} ${(outputInfo[index].size / 1024).toFixed(0)} KiB`).join(' · ')}`);
}

const socialSource = join(sourceDirectory, 'og.png');
const socialTarget = join(root, 'public', 'og.jpg');
await sharp(socialSource)
  .rotate()
  .flatten({ background: '#171411' })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(socialTarget);

const [socialSourceInfo, socialOutputInfo] = await Promise.all([stat(socialSource), stat(socialTarget)]);
sourceBytes += socialSourceInfo.size;
outputBytes += socialOutputInfo.size;

const reduction = 100 - (outputBytes / sourceBytes * 100);
console.log(`og.png -> og.jpg · ${(socialOutputInfo.size / 1024).toFixed(0)} KiB`);
console.log(`Total público, incluindo variantes responsivas: ${(outputBytes / 1024 / 1024).toFixed(2)} MiB · ${(reduction >= 0 ? 'redução' : 'variação')} de ${Math.abs(reduction).toFixed(1)}% sobre os PNGs-fonte.`);
