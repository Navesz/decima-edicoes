'use client';

import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const FinishLab = lazy(async () => {
  const finishLabModule = await import('./finish-lab');
  return { default: finishLabModule.FinishLab };
});

function FinishLabFallback() {
  return (
    <div className="finish-lab-fallback" role="status" aria-live="polite">
      <span className="logo-symbol" aria-hidden="true"><i /><i /><b /></span>
      <div>
        <p className="micro-label">Simulador de superfície</p>
        <strong>Preparando o laboratório 3D</strong>
        <p>O modelo será carregado quando esta seção entrar no campo de visão.</p>
      </div>
    </div>
  );
}

export function FinishLabLoader() {
  const container = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = container.current;
    if (!element || !('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShouldLoad(true);
      observer.disconnect();
    }, { rootMargin: '360px 0px' });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={container} className="finish-lab-loader">
      {shouldLoad ? <Suspense fallback={<FinishLabFallback />}><FinishLab /></Suspense> : <FinishLabFallback />}
    </div>
  );
}
