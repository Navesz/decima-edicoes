'use client';

import { useEffect } from 'react';

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
};

export function ScrollEffects() {
  useEffect(() => {
    const connection = (navigator as NavigatorWithConnection).connection;
    const shouldKeepStatic = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      || window.matchMedia?.('(prefers-reduced-data: reduce)').matches
      || connection?.saveData
      || connection?.effectiveType === 'slow-2g'
      || connection?.effectiveType === '2g';

    if (shouldKeepStatic || !('IntersectionObserver' in window)) return;

    const firstReveal = document.querySelector<HTMLElement>('.gsap-reveal');
    if (!firstReveal) return;

    let cancelled = false;
    let started = false;
    let context: { revert: () => void } | undefined;

    const start = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach((element) => {
          gsap.fromTo(element, { y: 56, opacity: 0 }, {
            y: 0,
            opacity: 1,
            duration: 1.05,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>('.parallax-media').forEach((element) => {
          gsap.fromTo(element, { yPercent: -5, scale: 1.08 }, {
            yPercent: 5,
            scale: 1.02,
            ease: 'none',
            scrollTrigger: { trigger: element.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });
      });
      document.documentElement.dataset.scrollEffects = 'active';
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      observer.disconnect();
      void start();
    }, { rootMargin: '320px 0px', threshold: .01 });

    observer.observe(firstReveal);

    return () => {
      cancelled = true;
      observer.disconnect();
      context?.revert();
      delete document.documentElement.dataset.scrollEffects;
    };
  }, []);

  return null;
}
