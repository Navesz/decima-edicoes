import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { BrandLogo } from './components/brand-logo';

export default function NotFound() {
  return (
    <main className="not-found" id="conteudo">
      <div className="not-found-brand"><BrandLogo /></div>
      <div>
        <p className="micro-label">Arquivo não encontrado · 404</p>
        <h1>Esta edição<br />não existe.</h1>
        <p>O endereço pode ter mudado ou a página já ter sido encerrada. O arquivo principal continua disponível.</p>
        <Link href="/"><ArrowLeft size={16} /> Voltar ao início</Link>
      </div>
      <span>10/10</span>
    </main>
  );
}
