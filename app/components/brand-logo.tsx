import { brand } from '../lib/brand';

type BrandLogoProps = { compact?: boolean };

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <span className={`brand-lockup ${compact ? 'brand-lockup-compact' : ''}`} aria-hidden="true">
      <span className="logo-symbol"><i /><i /><b /></span>
      <span className="logo-wordmark"><strong>{brand.shortName}</strong><small>{brand.editionLabel}</small></span>
    </span>
  );
}
