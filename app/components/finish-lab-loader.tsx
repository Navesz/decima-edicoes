'use client';

import { Component, lazy, type ReactNode, Suspense, useEffect, useRef, useState } from 'react';
import { shouldAvoidOptionalTransfer } from '../lib/client-capabilities';
import styles from './finish-lab-loader.module.css';

const FinishLab = lazy(async () => {
  const finishLabModule = await import('./finish-lab');
  return { default: finishLabModule.FinishLab };
});

type FallbackMode = 'idle' | 'loading' | 'unavailable' | 'error';

const fallbackCopy: Record<FallbackMode, { title: string; description: string }> = {
  idle: {
    title: 'Acetinado como direção.',
    description: 'A meta conceitual é 32% de brilho percebido. A comparação essencial continua nas quatro amostras logo abaixo.',
  },
  loading: {
    title: 'Carregando o laboratório 3D.',
    description: 'O simulador usa um pacote separado. Enquanto ele abre, a decisão e a comparação textual permanecem disponíveis.',
  },
  unavailable: {
    title: 'Comparação preservada sem WebGL.',
    description: 'Este dispositivo não abriu a cena 3D. A direção continua sendo acetinada, com meta conceitual de 32%, e as quatro faixas abaixo permanecem válidas.',
  },
  error: {
    title: 'O laboratório 3D não pôde abrir.',
    description: 'A falha não esconde a decisão: acabamento acetinado, meta conceitual de 32% e validação obrigatória em corpos de prova.',
  },
};

function FinishLabFallback({ mode, manualOnly = false, onManualLoad }: { mode: FallbackMode; manualOnly?: boolean; onManualLoad?: () => void }) {
  const copy = fallbackCopy[mode];

  return (
    <div
      className="finish-lab-fallback"
      data-finish-mode={mode}
      role={mode === 'loading' ? 'status' : undefined}
      aria-live={mode === 'loading' ? 'polite' : undefined}
    >
      <span className="logo-symbol" aria-hidden="true"><i /><i /><b /></span>
      <div>
        <p className="micro-label">Simulador de superfície · alternativa textual ativa</p>
        <strong>{copy.title}</strong>
        <p className={styles.description}>{copy.description}</p>
        {manualOnly && <p className={styles.description}>A economia de dados foi detectada; o modelo só será transferido se você pedir.</p>}
        {mode === 'idle' && onManualLoad && <button className={styles.loadButton} type="button" onClick={onManualLoad}>Carregar simulador 3D</button>}
      </div>
    </div>
  );
}

class FinishLabErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <FinishLabFallback mode="error" /> : this.props.children;
  }
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function FinishLabLoader() {
  const container = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [manualOnly, setManualOnly] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    const schedule = (update: () => void) => queueMicrotask(() => {
      if (active) update();
    });

    if (!supportsWebGL()) {
      schedule(() => setUnavailable(true));
      return () => { active = false; };
    }

    if (shouldAvoidOptionalTransfer()) {
      schedule(() => setManualOnly(true));
      return () => { active = false; };
    }

    const element = container.current;
    if (!element || !('IntersectionObserver' in window)) {
      schedule(() => setShouldLoad(true));
      return () => { active = false; };
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShouldLoad(true);
      observer.disconnect();
    }, { rootMargin: '360px 0px' });

    observer.observe(element);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, []);

  const loadOnRequest = () => {
    setManualOnly(false);
    setShouldLoad(true);
  };

  return (
    <div ref={container} className="finish-lab-loader">
      {unavailable
        ? <FinishLabFallback mode="unavailable" />
        : shouldLoad
          ? <FinishLabErrorBoundary><Suspense fallback={<FinishLabFallback mode="loading" />}><FinishLab /></Suspense></FinishLabErrorBoundary>
          : <FinishLabFallback mode="idle" manualOnly={manualOnly} onManualLoad={loadOnRequest} />}
      <noscript><p className={styles.noScript}>JavaScript está desativado. A comparação de acabamento continua nas quatro faixas estáticas logo abaixo: fosco, acetinado, semibrilho e espelhado.</p></noscript>
    </div>
  );
}
