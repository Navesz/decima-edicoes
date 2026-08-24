type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
};

function mediaMatches(query: string) {
  return typeof window !== 'undefined' && (window.matchMedia?.(query).matches ?? false);
}

export function prefersReducedMotion() {
  return mediaMatches('(prefers-reduced-motion: reduce)');
}

export function shouldAvoidOptionalTransfer() {
  const connection = typeof navigator === 'undefined'
    ? undefined
    : (navigator as NavigatorWithConnection).connection;

  return mediaMatches('(prefers-reduced-data: reduce)')
    || connection?.saveData === true
    || connection?.effectiveType === 'slow-2g'
    || connection?.effectiveType === '2g';
}

export function usesCoarsePointer() {
  return mediaMatches('(pointer: coarse)') || mediaMatches('(hover: none)');
}
