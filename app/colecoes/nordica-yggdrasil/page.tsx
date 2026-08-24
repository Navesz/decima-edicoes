import type { Metadata } from 'next';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Footer } from '../../components/footer';
import { SiteHeader } from '../../components/site-header';
import { gallery } from '../../lib/collections';
import { assetPath } from '../../lib/base-path';
import { absoluteUrl } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Nórdica — Yggdrasil',
  description: 'A edição inaugural da DÉCIMA: dez mesas numeradas em madeira maciça e aço.',
  alternates: { canonical: absoluteUrl('/colecoes/nordica-yggdrasil/') },
  openGraph: { type: 'website', locale: 'pt_BR', siteName: 'DÉCIMA Edições', url: absoluteUrl('/colecoes/nordica-yggdrasil/'), title: 'Nórdica — Yggdrasil · DÉCIMA Edições', description: 'Dez mesas numeradas. Uma arte que jamais será reimpressa.', images: [{ url: absoluteUrl('/images/hero-yggdrasil.png'), alt: 'Mesa Nórdica — Yggdrasil' }] },
  twitter: { card: 'summary_large_image', title: 'Nórdica — Yggdrasil · DÉCIMA Edições', description: 'Dez mesas numeradas. Uma arte que jamais será reimpressa.', images: [absoluteUrl('/images/hero-yggdrasil.png')] },
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Nórdica — Yggdrasil',
  description: 'Mesa autoral em madeira maciça e aço, concebida em uma edição limitada de dez peças numeradas.',
  image: gallery.map((image) => absoluteUrl(image.replace(/^\/decima-edicoes/, ''))),
  material: ['Madeira maciça', 'Aço carbono'],
  brand: { '@type': 'Brand', name: 'DÉCIMA Edições' },
  productionDate: '2026',
};

export default function YggdrasilPage() {
  return (
    <main className="product-page" id="conteudo">
      <section className="product-hero">
        <Image src={assetPath('/images/hero-yggdrasil.png')} alt="Mesa Nórdica — Yggdrasil" fill priority sizes="100vw" />
        <div className="product-wash" /><SiteHeader />
        <div className="product-title"><p>Nórdica · Edição 01</p><h1>Yggdrasil</h1><div><span>2026</span><span>10 peças</span><span>Brasil</span></div></div>
        <a className="product-scroll" href="#historia">Conhecer a peça <ArrowDown size={15} /></a>
      </section>
      <section className="product-story" id="historia">
        <div><p className="micro-label">A árvore e o tempo</p><h2>Raiz, matéria<br />e permanência.</h2></div>
        <div><p>Yggdrasil é a primeira afirmação da DÉCIMA: uma árvore monumental contida dentro de um círculo, aplicada sobre madeira de veio único e protegida por uma superfície acetinada de baixa reflexão.</p><p>A arte é constante; a natureza não. O desenho encontra veios diferentes em cada tampo e produz dez objetos aparentados, nunca idênticos.</p></div>
      </section>
      <section className="product-gallery">
        {gallery.map((src, index) => <figure key={src} className={index === 0 ? 'wide' : ''}><Image src={src} alt={`Estudo Yggdrasil ${index + 1}`} fill sizes={index === 0 ? '100vw' : '(max-width: 800px) 100vw, 50vw'} /><figcaption>Estudo {String(index + 1).padStart(2, '0')} · variação de matéria e luz</figcaption></figure>)}
      </section>
      <section className="product-specs">
        <div><p className="micro-label">Especificação de partida</p><h2>Feita para existir<br />no mundo real.</h2><p>As medidas abaixo orientam o primeiro protótipo e serão congeladas somente depois dos corpos de prova e da validação estrutural.</p></div>
        <dl><div><dt>Diâmetro</dt><dd>80 cm</dd></div><div><dt>Altura</dt><dd>38 cm</dd></div><div><dt>Tampo</dt><dd>Madeira maciça · 30–40 mm</dd></div><div><dt>Base</dt><dd>Metalon reto · aço carbono</dd></div><div><dt>Acabamento</dt><dd>Epóxi encapsulado + PU acetinado</dd></div><div><dt>Tiragem</dt><dd>10 peças numeradas</dd></div></dl>
      </section>
      <section className="product-cta"><p>Manifestação de interesse</p><h2>Escolha um número.<br />Não apenas uma mesa.</h2><Link href="/#interesse">Solicitar o dossiê da edição <ArrowRight /></Link></section>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
    </main>
  );
}
