import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const brandDir = new URL('../public/brand/', import.meta.url);
await mkdir(brandDir, { recursive: true });
const output = (name) => fileURLToPath(new URL(name, brandDir));

function lockup(color) {
  return Buffer.from(`
    <svg width="1600" height="500" viewBox="0 0 1600 500" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="${color}" stroke-width="4">
        <circle cx="230" cy="250" r="144"/>
        <line x1="151" y1="171" x2="309" y2="329"/>
        <line x1="309" y1="171" x2="151" y2="329"/>
      </g>
      <circle cx="230" cy="250" r="10" fill="#b28a53"/>
      <text x="440" y="270" fill="${color}" font-family="Georgia, serif" font-size="150" font-weight="400" letter-spacing="17">DÉCIMA</text>
      <text x="450" y="360" fill="${color}" opacity="0.7" font-family="Arial, sans-serif" font-size="37" font-weight="500" letter-spacing="28">EDIÇÕES</text>
    </svg>
  `);
}

const icon = Buffer.from(`
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="256" fill="#171411"/>
    <circle cx="256" cy="256" r="190" fill="none" stroke="#eee7da" stroke-width="7"/>
    <line x1="151" y1="151" x2="361" y2="361" stroke="#eee7da" stroke-width="7"/>
    <line x1="361" y1="151" x2="151" y2="361" stroke="#eee7da" stroke-width="7"/>
    <circle cx="256" cy="256" r="14" fill="#b28a53"/>
  </svg>
`);

const maskableIcon = Buffer.from(`
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#171411"/>
    <circle cx="256" cy="256" r="190" fill="none" stroke="#eee7da" stroke-width="7"/>
    <line x1="151" y1="151" x2="361" y2="361" stroke="#eee7da" stroke-width="7"/>
    <line x1="361" y1="151" x2="151" y2="361" stroke="#eee7da" stroke-width="7"/>
    <circle cx="256" cy="256" r="14" fill="#b28a53"/>
  </svg>
`);

await Promise.all([
  sharp(lockup('#171411')).png().toFile(output('decima-logo-dark.png')),
  sharp(lockup('#eee7da')).png().toFile(output('decima-logo-light.png')),
  sharp(icon).png().toFile(fileURLToPath(new URL('../app/icon.png', import.meta.url))),
  sharp(maskableIcon).png().toFile(output('decima-maskable.png')),
]);
