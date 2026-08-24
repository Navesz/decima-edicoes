'use client';

import { lazy, type ReactNode, Suspense, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, shouldAvoidOptionalTransfer, usesCoarsePointer } from '../lib/client-capabilities';

const MotionArticle = lazy(async () => {
  const motionModule = await import('./motion-article');
  return { default: motionModule.MotionArticle };
});

export function MotionArticleLoader({ children, className }: { children: ReactNode; className: string }) {
  const article = useRef<HTMLElement>(null);
  const [enhance, setEnhance] = useState(false);
  const staticArticle = <article ref={article} className={className} data-motion-mode="static">{children}</article>;

  useEffect(() => {
    if (prefersReducedMotion() || shouldAvoidOptionalTransfer() || usesCoarsePointer() || !('IntersectionObserver' in window)) return;

    const element = article.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setEnhance(true);
    }, { rootMargin: '320px 0px', threshold: .01 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return enhance
    ? <Suspense fallback={staticArticle}><MotionArticle className={className}>{children}</MotionArticle></Suspense>
    : staticArticle;
}
