import type { Metadata } from 'next';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '../../components/footer';
import { ResponsiveImage } from '../../components/responsive-image';
import { SiteHeader } from '../../components/site-header';
import { gallery } from '../../lib/collections';
import { assetPath } from '../../lib/base-path';
import { collection, edition, editionPositions, product, productLabels, projectLabels } from '../../lib/project';
import { absoluteUrl, siteName } from '../../lib/site';
import { brandId, breadcrumbSchema, webPageSchema } from '../../lib/structured-data';
import styles from './edition-register.module.css';

const productUrl = absoluteUrl(`/colecoes/${collection.slug}/`);
const productModelId = `${productUrl}#model`;
const productDescription = `Mesa autoral em madeira maciça e aço, concebida em uma edição limitada de ${edition.runSizeWord} peças numeradas.`;

export const metadata: Metadata = {
  title: `${collection.family} — ${collection.name}`,
  description: `O conceito da edição inaugural da DÉCIMA: uma tiragem prevista de ${edition.runSizeWord} mesas numeradas em madeira maciça e aço.`,
  alternates: { canonical: productUrl },
  openGraph: { type: 'website', locale: 'pt_BR', siteName, url: productUrl, title: `${collection.family} — ${collection.name} · ${siteName}`, description: `${edition.runSize} mesas numeradas. Uma arte que jamais será reimpressa.`, images: [{ url: absoluteUrl('/social/yggdrasil.jpg'), width: 1200, height: 630, alt: `Mesa ${collection.family} — ${collection.name}` }] },
  twitter: { card: 'summary_large_image', title: `${collection.family} — ${collection.name} · ${siteName}`, description: `${edition.runSize} mesas numeradas. Uma arte que jamais será reimpressa.`, images: [absoluteUrl('/social/yggdrasil.jpg')] },
};

const productSchema = {
  '@type': 'ProductModel',
  '@id': productModelId,
  name: `${collection.family} — ${collection.name}`,
  description: productDescription,
  url: productUrl,
  mainEntityOfPage: { '@id': `${productUrl}#page` },
  image: gallery.map((image) => absoluteUrl(image.replace(/^\/decima-edicoes/, ''))),
  category: 'Mesa de centro autoral',
  material: [product.top, 'Aço carbono'],
  brand: { '@id': brandId },
  width: { '@type': 'QuantitativeValue', value: product.diameterCm, unitCode: 'CMT', unitText: 'cm' },
  depth: { '@type': 'QuantitativeValue', value: product.diameterCm, unitCode: 'CMT', unitText: 'cm' },
  height: { '@type': 'QuantitativeValue', value: product.heightCm, unitCode: 'CMT', unitText: 'cm' },
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Espessura do tampo', value: productLabels.topThickness },
    { '@type': 'PropertyValue', name: 'Tiragem prevista', value: edition.runSize },
    { '@type': 'PropertyValue', name: 'Peças concluídas', value: edition.producedPieces },
    { '@type': 'PropertyValue', name: 'Estado comercial', value: `${edition.commercialStatusLabel} · ainda não está à venda` },
  ],
};

const productStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageSchema({ url: productUrl, name: `${collection.family} — ${collection.name}`, description: productDescription, mainEntityId: productModelId }),
    breadcrumbSchema(productUrl, [
      { name: siteName, url: absoluteUrl('/') },
      { name: 'Coleções', url: absoluteUrl('/colecoes/') },
      { name: `${collection.family} — ${collection.name}`, url: productUrl },
    ]),
    productSchema,
  ],
};

export default function YggdrasilPage() {
  return (
    <main className="product-page" id="conteudo">
      <section className="product-hero">
        <ResponsiveImage src={assetPath('/images/hero-yggdrasil.webp')} alt={`Visualização conceitual da mesa ${collection.family} — ${collection.name}`} priority sizes="100vw" />
        <div className="product-wash" /><SiteHeader current="collections" />
        <div className="product-title"><p>{collection.family} · Edição {edition.collectionNumber} · conceito</p><h1>{collection.name}</h1><div><span>{collection.year}</span><span>{edition.producedPieces} produzidas</span><span>{edition.runSize} previstas</span></div></div>
        <a className="product-scroll" href="#historia">Conhecer o conceito <ArrowDown size={15} /></a>
      </section>
      <section className="product-story" id="historia">
        <div><p className="micro-label">A árvore e o tempo</p><h2>Raiz, matéria<br />e permanência.</h2></div>
        <div><p>{collection.name} é a primeira afirmação da DÉCIMA: uma árvore monumental contida dentro de um círculo, aplicada sobre madeira de veio único e protegida por uma superfície acetinada de baixa reflexão.</p><p>A arte é constante; a natureza não. O desenho encontra veios diferentes em cada tampo e produz {edition.runSizeWord} objetos aparentados, nunca idênticos.</p></div>
      </section>
      <section className="product-status" aria-labelledby="product-status-title">
        <div><p className="micro-label">Estado real do projeto</p><h2 id="product-status-title">Antes da peça {edition.firstPiece},<br />existe a peça {edition.prototypeNumber}.</h2><p>{collection.name} ainda não está à venda. A edição numerada só nasce depois que matéria, acabamento e estrutura forem comprovados no mundo real.</p></div>
        <ol>
          <li className="current"><span>Agora</span><strong>Corpos de prova</strong><p>{projectLabels.proofBodiesHeading} sistemas de arte e acabamento comparados em placas de {productLabels.proofPlate}.</p></li>
          <li><span>Depois</span><strong>Protótipo {edition.prototypeNumber}</strong><p>Mesa completa, não numerada, destinada a ensaios, custo real e fotografia.</p></li>
          <li><span>Só então</span><strong>Edição {edition.firstPieceFraction}</strong><p>Abertura comercial com ficha técnica congelada, prazo, garantia e entrega definidos.</p></li>
        </ol>
        <p className="product-status-note">Manifestar interesse nesta apresentação não constitui reserva, encomenda ou pagamento.</p>
      </section>
      <section className={styles.register} id="registro-edicao" aria-labelledby="edition-register-title">
        <div className={styles.heading}><div><p className="micro-label">Registro público da edição</p><h2 id="edition-register-title">Dez posições.<br />Nenhuma ficção.</h2></div><div><strong>{edition.currentStage}</strong><span>objetos concluídos</span><p>O estado vem do contrato do projeto. “Não produzida” significa que não existe objeto numerado, certificado, reserva ou propriedade associada àquela posição.</p></div></div>
        <ol className={styles.grid}>
          {editionPositions.map((position) => <li key={position.number} data-piece={position.number} data-state={position.state}><span>{position.number}</span><strong>Peça {position.fraction}</strong><small>{position.stateLabel}</small></li>)}
        </ol>
        <p className={styles.note}>O futuro registro público poderá exibir número, código verificável, ano e estado documental. Nome, contato, endereço e histórico privado de custódia não serão publicados por padrão.</p>
      </section>
      <section className="product-gallery">
        {gallery.map((src, index) => <figure key={src} className={index === 0 ? 'wide' : ''}><ResponsiveImage src={src} alt={`Visualização conceitual ${collection.name} ${index + 1}`} sizes={index === 0 ? '100vw' : '(max-width: 800px) 100vw, 50vw'} /><figcaption>Visualização conceitual {String(index + 1).padStart(2, '0')} · variação de matéria e luz</figcaption></figure>)}
      </section>
      <section className="product-specs">
        <div><p className="micro-label">Especificação de partida</p><h2>Feita para existir<br />no mundo real.</h2><p>As medidas abaixo orientam o primeiro protótipo e serão congeladas somente depois dos corpos de prova e da validação estrutural.</p></div>
        <dl><div><dt>Diâmetro</dt><dd>{productLabels.diameter}</dd></div><div><dt>Altura</dt><dd>{productLabels.height}</dd></div><div><dt>Tampo</dt><dd>{product.top} · {productLabels.topThickness}</dd></div><div><dt>Base</dt><dd>{product.base}</dd></div><div><dt>Acabamento</dt><dd>{product.finish}</dd></div><div><dt>Tiragem</dt><dd>{edition.runSize} peças numeradas</dd></div></dl>
      </section>
      <section className="product-cta"><p>Acompanhar a edição</p><h2>Veja a peça nascer<br />antes do número.</h2><Link href="/#interesse">Conhecer o fluxo de interesse <ArrowRight /></Link></section>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }} />
    </main>
  );
}
