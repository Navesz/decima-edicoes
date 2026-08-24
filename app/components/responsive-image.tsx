/* eslint-disable @next/next/no-img-element */

import imageData from '../lib/image-data.json';

const sourceDimensions = imageData as Record<string, { width: number; height: number }>;

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
  const dimensions = sourceDimensions[fileName];
  const srcSet = dimensions
    ? `${variantPath(src, 480)} 480w, ${variantPath(src, 800)} 800w, ${src} ${dimensions.width}w`
    : undefined;

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      width={dimensions?.width}
      height={dimensions?.height}
      alt={alt}
      className={['responsive-image', className].filter(Boolean).join(' ')}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  );
}
