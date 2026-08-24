import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Footer } from '../components/footer';
import { SiteHeader } from '../components/site-header';
import { collections } from '../lib/collections';
import { assetPath } from '../lib/base-path';
import { absoluteUrl } from '../lib/site';

export const metadata: Metadata = {
  title: 'Coleções',
  description: 'Edições numeradas e estudos do arquivo DÉCIMA.',
  alternates: { canonical: absoluteUrl('/colecoes/') },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'DÉCIMA Edições',
    url: absoluteUrl('/colecoes/'),
    title: 'Coleções · DÉCIMA Edições',
    description: 'Edições numeradas e estudos do arquivo DÉCIMA.',
    images: [{ url: absoluteUrl('/images/collection-dark.webp'), alt: 'Arquivo visual das coleções DÉCIMA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coleções · DÉCIMA Edições',
    description: 'Edições numeradas e estudos do arquivo DÉCIMA.',
    images: [absoluteUrl('/images/collection-dark.webp')],
  },
};

export default function CollectionsPage() {
  return (
    <main className="light-page" id="conteudo">
      <SiteHeader tone="dark" />
      <header className="archive-hero">
        <p className="micro-label">Arquivo DÉCIMA · 2026—</p>
        <h1>Coleções que<br />sabem terminar.</h1>
        <p>A edição inaugural está em prototipagem e ainda não recebe reservas. Os demais objetos permanecem como estudos até que matéria, processo e narrativa estejam resolvidos.</p>
      </header>
      <section className="archive-grid">
        {collections.map((collection, index) => (
          <article className="archive-card" key={collection.slug}>
            <Link href={index === 0 ? `/colecoes/${collection.slug}` : '/caderno'}>
              <div className="archive-image"><Image src={collection.image} alt={`Visualização conceitual ${collection.family} — ${collection.name}`} fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
              <div className="archive-title"><span>{collection.number}</span><div><small>{collection.family} · {collection.year}</small><h2>{collection.name}</h2></div><ArrowUpRight strokeWidth={1.2} /></div>
              <p>{collection.description}</p>
              <div className="palette" aria-label="Paleta da coleção">{collection.palette.map((color) => <i key={color} style={{ background: color }} />)}</div>
            </Link>
          </article>
        ))}
      </section>
      <section className="archive-board"><Image src={assetPath('/images/collection-dark.webp')} alt="Mapa visual de dez estudos conceituais iniciais" fill sizes="100vw" /><p><span>Arquivo de origem</span> Dez conceitos que definiram o primeiro vocabulário da marca.</p></section>
      <Footer />
    </main>
  );
}
