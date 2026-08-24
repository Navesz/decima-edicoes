import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { brandSignature } from '../lib/brand';
import { collection } from '../lib/project';
import { BrandLogo } from './brand-logo';

export function Footer() {
  return (
    <footer className="footer">
      <div><BrandLogo /></div>
      <p>Mesas autorais em séries limitadas.<br />Brasil · desde {collection.year}</p>
      <nav aria-label="Rodapé"><Link href="/colecoes">Coleções</Link><Link href="/caderno">Caderno</Link><Link href="/#interesse">Interesse <ArrowUpRight size={12} /></Link></nav>
      <small>© {collection.year} {brandSignature} · Conceito em desenvolvimento</small>
    </footer>
  );
}
