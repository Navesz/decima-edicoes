import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '../components/footer';
import { ResponsiveImage } from '../components/responsive-image';
import { SiteHeader } from '../components/site-header';
import { collections } from '../lib/collections';
import { assetPath } from '../lib/base-path';
import { collection } from '../lib/project';
import { absoluteUrl, siteName } from '../lib/site';
import { breadcrumbSchema, webPageSchema } from '../lib/structured-data';

const collectionsUrl = absoluteUrl('/colecoes/');
const collectionsDescription = 'Edições numeradas e estudos do arquivo DÉCIMA.';

export const metadata: Metadata = {
  title: 'Coleções',
  description: collectionsDescription,
  alternates: { canonical: collectionsUrl },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName,
    url: collectionsUrl,
    title: `Coleções · ${siteName}`,
    description: collectionsDescription,
    images: [{ url: absoluteUrl('/social/collections.jpg'), width: 1200, height: 630, alt: 'Arquivo visual das coleções DÉCIMA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Coleções · ${siteName}`,
    description: collectionsDescription,
    images: [absoluteUrl('/social/collections.jpg')],
  },
};

const collectionsStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageSchema({ type: 'CollectionPage', url: collectionsUrl, name: 'Coleções', description: collectionsDescription }),
    breadcrumbSchema(collectionsUrl, [
      { name: siteName, url: absoluteUrl('/') },
      { name: 'Coleções', url: collectionsUrl },
    ]),
  ],
};

export default function CollectionsPage() {
  return (
    <main className="light-page" id="conteudo">
      <SiteHeader tone="dark" current="collections" />
      <header className="archive-hero">
        <p className="micro-label">Arquivo DÉCIMA · {collection.year}—</p>
        <h1>Coleções que<br />sabem terminar.</h1>
        <p>A edição inaugural está em prototipagem e ainda não recebe reservas. Os demais objetos permanecem como estudos até que matéria, processo e narrativa estejam resolvidos.</p>
      </header>
      <section className="archive-grid">
        {collections.map((collection, index) => (
          <article className="archive-card" key={collection.slug}>
            <Link href={index === 0 ? `/colecoes/${collection.slug}` : '/caderno'}>
              <div className="archive-image"><ResponsiveImage src={collection.image} alt={`Visualização conceitual ${collection.family} — ${collection.name}`} sizes="(max-width: 800px) 100vw, 50vw" /></div>
              <div className="archive-title"><span>{collection.number}</span><div><small>{collection.family} · {collection.year}</small><h2>{collection.name}</h2></div><ArrowUpRight strokeWidth={1.2} /></div>
              <p>{collection.description}</p>
              <div className="palette" aria-label="Paleta da coleção">{collection.palette.map((color) => <i key={color} style={{ background: color }} />)}</div>
            </Link>
          </article>
        ))}
      </section>
      <section className="archive-board"><ResponsiveImage src={assetPath('/images/collection-dark.webp')} alt="Mapa visual de dez estudos conceituais iniciais" sizes="100vw" /><p><span>Arquivo de origem</span> Dez conceitos que definiram o primeiro vocabulário da marca.</p></section>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionsStructuredData) }} />
    </main>
  );
}
