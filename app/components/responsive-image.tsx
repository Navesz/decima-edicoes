/* eslint-disable @next/next/no-img-element */

const sourceWidths: Record<string, number> = {
  'art-deco.webp': 1122,
  'collection-board.webp': 1536,
  'collection-dark.webp': 1254,
  'hero-yggdrasil.webp': 1254,
  'renaissance-medallion.webp': 1122,
  'sunburst.webp': 1122,
  'yggdrasil-dark.webp': 1230,
  'yggdrasil-ivory.webp': 1536,
  'yggdrasil-light.webp': 1254,
  'yggdrasil-runes.webp': 1254,
  'yggdrasil-satin.webp': 1254,
};

type ResponsiveImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

function variantPath(src: string, width: number) {
  return src.replace(/\.webp$/, `-${width}.webp`);
}

export function ResponsiveImage({ src, alt, sizes, className, priority = false }: ResponsiveImageProps) {
  const fileName = src.split('/').at(-1) ?? '';
  const sourceWidth = sourceWidths[fileName];
  const srcSet = sourceWidth
    ? `${variantPath(src, 480)} 480w, ${variantPath(src, 800)} 800w, ${src} ${sourceWidth}w`
    : undefined;

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={['responsive-image', className].filter(Boolean).join(' ')}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  );
}
