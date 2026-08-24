'use client';

import { useEffect } from 'react';

export function ScrollEffects() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cancelled = false;
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
    };

    void start();

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, []);

  return null;
}
