import type { ReactNode } from 'react';

export function HorizontalScrollRegion({ children, className, label }: { children: ReactNode; className: string; label: string }) {
  return <div className={className} role="region" tabIndex={0} aria-label={label}>{children}</div>;
}
