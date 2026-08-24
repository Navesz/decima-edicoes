import type { Metadata } from 'next';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '../../components/footer';
import { ResponsiveImage } from '../../components/responsive-image';
import { SiteHeader } from '../../components/site-header';
import { gallery } from '../../lib/collections';
import { assetPath } from '../../lib/base-path';
import { absoluteUrl } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Nórdica — Yggdrasil',
  description: 'O conceito da edição inaugural da DÉCIMA: uma tiragem prevista de dez mesas numeradas em madeira maciça e aço.',
  alternates: { canonical: absoluteUrl('/colecoes/nordica-yggdrasil/') },
  openGraph: { type: 'website', locale: 'pt_BR', siteName: 'DÉCIMA Edições', url: absoluteUrl('/colecoes/nordica-yggdrasil/'), title: 'Nórdica — Yggdrasil · DÉCIMA Edições', description: 'Dez mesas numeradas. Uma arte que jamais será reimpressa.', images: [{ url: absoluteUrl('/social/yggdrasil.jpg'), width: 1200, height: 630, alt: 'Mesa Nórdica — Yggdrasil' }] },
  twitter: { card: 'summary_large_image', title: 'Nórdica — Yggdrasil · DÉCIMA Edições', description: 'Dez mesas numeradas. Uma arte que jamais será reimpressa.', images: [absoluteUrl('/social/yggdrasil.jpg')] },
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProductModel',
  name: 'Nórdica — Yggdrasil',
  description: 'Mesa autoral em madeira maciça e aço, concebida em uma edição limitada de dez peças numeradas.',
  image: gallery.map((image) => absoluteUrl(image.replace(/^\/decima-edicoes/, ''))),
  material: ['Madeira maciça', 'Aço carbono'],
  brand: { '@type': 'Brand', name: 'DÉCIMA Edições' },
};

export default function YggdrasilPage() {
  return (
    <main className="product-page" id="conteudo">
      <section className="product-hero">
        <ResponsiveImage src={assetPath('/images/hero-yggdrasil.webp')} alt="Visualização conceitual da mesa Nórdica — Yggdrasil" priority sizes="100vw" />
        <div className="product-wash" /><SiteHeader />
        <div className="product-title"><p>Nórdica · Edição 01 · conceito</p><h1>Yggdrasil</h1><div><span>2026</span><span>0 produzidas</span><span>10 previstas</span></div></div>
        <a className="product-scroll" href="#historia">Conhecer o conceito <ArrowDown size={15} /></a>
      </section>
      <section className="product-story" id="historia">
        <div><p className="micro-label">A árvore e o tempo</p><h2>Raiz, matéria<br />e permanência.</h2></div>
        <div><p>Yggdrasil é a primeira afirmação da DÉCIMA: uma árvore monumental contida dentro de um círculo, aplicada sobre madeira de veio único e protegida por uma superfície acetinada de baixa reflexão.</p><p>A arte é constante; a natureza não. O desenho encontra veios diferentes em cada tampo e produz dez objetos aparentados, nunca idênticos.</p></div>
      </section>
      <section className="product-status" aria-labelledby="product-status-title">
        <div><p className="micro-label">Estado real do projeto</p><h2 id="product-status-title">Antes da peça 01,<br />existe a peça 00.</h2><p>Yggdrasil ainda não está à venda. A edição numerada só nasce depois que matéria, acabamento e estrutura forem comprovados no mundo real.</p></div>
        <ol>
          <li className="current"><span>Agora</span><strong>Corpos de prova</strong><p>Quatro sistemas de arte e acabamento comparados em placas de 30 × 30 cm.</p></li>
          <li><span>Depois</span><strong>Protótipo 00</strong><p>Mesa completa, não numerada, destinada a ensaios, custo real e fotografia.</p></li>
          <li><span>Só então</span><strong>Edição 01/10</strong><p>Abertura comercial com ficha técnica congelada, prazo, garantia e entrega definidos.</p></li>
        </ol>
        <p className="product-status-note">Manifestar interesse nesta apresentação não constitui reserva, encomenda ou pagamento.</p>
      </section>
      <section className="product-gallery">
        {gallery.map((src, index) => <figure key={src} className={index === 0 ? 'wide' : ''}><ResponsiveImage src={src} alt={`Visualização conceitual Yggdrasil ${index + 1}`} sizes={index === 0 ? '100vw' : '(max-width: 800px) 100vw, 50vw'} /><figcaption>Visualização conceitual {String(index + 1).padStart(2, '0')} · variação de matéria e luz</figcaption></figure>)}
      </section>
      <section className="product-specs">
        <div><p className="micro-label">Especificação de partida</p><h2>Feita para existir<br />no mundo real.</h2><p>As medidas abaixo orientam o primeiro protótipo e serão congeladas somente depois dos corpos de prova e da validação estrutural.</p></div>
        <dl><div><dt>Diâmetro</dt><dd>80 cm</dd></div><div><dt>Altura</dt><dd>38 cm</dd></div><div><dt>Tampo</dt><dd>Madeira maciça · 30–40 mm</dd></div><div><dt>Base</dt><dd>Metalon reto · aço carbono</dd></div><div><dt>Acabamento</dt><dd>Epóxi encapsulado + PU acetinado</dd></div><div><dt>Tiragem</dt><dd>10 peças numeradas</dd></div></dl>
      </section>
      <section className="product-cta"><p>Acompanhar a edição</p><h2>Veja a peça nascer<br />antes do número.</h2><Link href="/#interesse">Conhecer o fluxo de interesse <ArrowRight /></Link></section>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
    </main>
  );
}
