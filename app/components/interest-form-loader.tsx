'use client';

import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const InterestForm = lazy(async () => {
  const interestFormModule = await import('./interest-form');
  return { default: interestFormModule.InterestForm };
});

function StaticInterestForm({ defaultInterest }: { defaultInterest: string }) {
  return (
    <form className="interest-form" aria-describedby="interest-note" noValidate data-local-demo data-interest-mode="static">
      <fieldset disabled>
        <label>
          <span>Nome</span>
          <input name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="Como podemos chamar você?" />
        </label>
        <label>
          <span>E-mail</span>
          <input type="email" name="email" autoComplete="email" required maxLength={160} inputMode="email" spellCheck={false} placeholder="voce@email.com" />
        </label>
        <label>
          <span>Interesse</span>
          <select name="interest" defaultValue={defaultInterest}>
            <option>{defaultInterest}</option>
            <option>Próximas coleções</option>
            <option>Parceria com arquitetos</option>
          </select>
        </label>
        <button type="submit">Simular entrada na lista <span aria-hidden="true">→</span></button>
      </fieldset>
      <small id="interest-note">Demonstração do fluxo. Nenhum dado é transmitido, armazenado ou usado como reserva.</small>
      <noscript><small className="form-noscript">A simulação local requer JavaScript. Nenhum campo foi habilitado e nenhum dado será enviado.</small></noscript>
    </form>
  );
}

export function InterestFormLoader({ defaultInterest }: { defaultInterest: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [enhance, setEnhance] = useState(false);
  const fallback = <StaticInterestForm defaultInterest={defaultInterest} />;

  useEffect(() => {
    const element = container.current;
    if (!element || !('IntersectionObserver' in window)) {
      queueMicrotask(() => setEnhance(true));
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setEnhance(true);
    }, { rootMargin: '360px 0px', threshold: .01 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={container} className="interest-form">
      {enhance
        ? <Suspense fallback={fallback}><InterestForm defaultInterest={defaultInterest} /></Suspense>
        : fallback}
    </div>
  );
}
