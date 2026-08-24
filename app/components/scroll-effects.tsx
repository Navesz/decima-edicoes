'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';

export function ScrollEffects() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
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

    return () => context.revert();
  }, []);

  return null;
}
