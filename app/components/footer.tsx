import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { BrandLogo } from './brand-logo';

export function Footer() {
  return (
    <footer className="footer">
      <div><BrandLogo /></div>
      <p>Mesas autorais em séries limitadas.<br />Brasil · desde 2026</p>
      <nav aria-label="Rodapé"><Link href="/colecoes">Coleções</Link><Link href="/caderno">Caderno</Link><Link href="/#interesse">Interesse <ArrowUpRight size={12} /></Link></nav>
      <small>© 2026 DÉCIMA EDIÇÕES · Conceito em desenvolvimento</small>
    </footer>
  );
}
