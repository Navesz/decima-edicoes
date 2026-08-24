'use client';

import { useEffect } from 'react';

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lenis: import('lenis').default | undefined;
    let frame = 0;
    let cancelled = false;
    let timerHandle = 0;

    const start = async () => {
      const { default: Lenis } = await import('lenis');
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.85 });
      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    };

    timerHandle = window.setTimeout(() => void start(), 250);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (timerHandle) window.clearTimeout(timerHandle);
      lenis?.destroy();
    };
  }, []);

  return null;
}
