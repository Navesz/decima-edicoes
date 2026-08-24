'use client';

import { useEffect } from 'react';

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
};

type WindowWithIdleCallback = Window & typeof globalThis & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export function SmoothScroll() {
  useEffect(() => {
    const connection = (navigator as NavigatorWithConnection).connection;
    const shouldKeepNativeScroll = [
      '(prefers-reduced-motion: reduce)',
      '(prefers-reduced-data: reduce)',
      '(pointer: coarse)',
      '(hover: none)',
    ].some((query) => window.matchMedia?.(query).matches)
      || connection?.saveData
      || connection?.effectiveType === 'slow-2g'
      || connection?.effectiveType === '2g';

    if (shouldKeepNativeScroll) return;

    let lenis: import('lenis').default | undefined;
    let frame = 0;
    let cancelled = false;
    let idleHandle = 0;
    let timerHandle = 0;
    const idleWindow = window as WindowWithIdleCallback;

    const start = async () => {
      const { default: Lenis } = await import('lenis');
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.85 });
      document.documentElement.dataset.smoothScroll = 'active';
      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    };

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(() => void start(), { timeout: 1600 });
    } else {
      timerHandle = window.setTimeout(() => void start(), 900);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (idleHandle) idleWindow.cancelIdleCallback?.(idleHandle);
      if (timerHandle) window.clearTimeout(timerHandle);
      lenis?.destroy();
      delete document.documentElement.dataset.smoothScroll;
    };
  }, []);

  return null;
}
