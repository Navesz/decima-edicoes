'use client';

import { Printer } from 'lucide-react';

export function PrintButton({ className }: { className?: string }) {
  return (
    <button className={className} type="button" onClick={() => window.print()}>
      Imprimir ou salvar em PDF <Printer size={17} />
    </button>
  );
}
