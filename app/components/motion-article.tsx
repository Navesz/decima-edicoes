'use client';

import { LazyMotion, useReducedMotion } from 'framer-motion';
import * as m from 'framer-motion/m';
import type { ReactNode } from 'react';

const loadMotionFeatures = () => import('./motion-features').then((module) => module.default);

export function MotionArticle({ children, className }: { children: ReactNode; className: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <m.article
        className={className}
        data-motion-mode="active"
        whileHover={reduceMotion ? undefined : { y: -8 }}
        transition={{ duration: .35 }}
      >
        {children}
      </m.article>
    </LazyMotion>
  );
}
