import brandData from './brand-data.json';

export const brand = brandData;

export const brandTitle = `${brand.name} — ${brand.slogan}`;
export const brandSignature = `${brand.shortName} ${brand.editionLabel}`;

function relativeLuminance(hex: string) {
  const channels = hex.match(/[0-9a-f]{2}/gi)?.map((channel) => Number.parseInt(channel, 16) / 255) ?? [];
  const linear = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

export function contrastRatio(foreground: string, background: string) {
  const luminances = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (luminances[0] + 0.05) / (luminances[1] + 0.05);
}

export function formatContrastRatio(value: number) {
  return `${value.toFixed(2).replace('.', ',')}:1`;
}
