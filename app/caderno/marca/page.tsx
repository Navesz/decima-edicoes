import type { Metadata } from 'next';
import { ArrowDownToLine, ArrowLeft, CircleAlert } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Footer } from '../../components/footer';
import { SiteHeader } from '../../components/site-header';
import { assetPath } from '../../lib/base-path';
import { brand } from '../../lib/brand';
import { absoluteUrl } from '../../lib/site';
import styles from './brand-guide.module.css';

const guideUrl = absoluteUrl('/caderno/marca/');

export const metadata: Metadata = {
  title: 'Guia de Marca',
  description: `Fundamentos do nome, símbolo, identidade visual, voz e sistema editorial da ${brand.name}.`,
  alternates: { canonical: guideUrl },
  robots: { index: false, follow: false },
};

const palette = [
  { ...brand.palette.ink, className: styles.ink },
  { ...brand.palette.ivory, className: styles.ivory },
  { ...brand.palette.paper, className: styles.paper },
  { ...brand.palette.paperLight, className: styles.paperLight },
  { ...brand.palette.bronze, className: styles.bronze },
  { ...brand.palette.bronzeInk, className: styles.bronzeInk },
];

export default function BrandGuidePage() {
  return (
    <main className={styles.page} id="conteudo">
      <SiteHeader tone="dark" />

      <header className={styles.hero}>
        <div className={styles.heroIntro}>
          <p className="micro-label">Caderno do Atelier · Guia 01</p>
          <h1>A marca antes<br />da matéria.</h1>
        </div>
        <div className={styles.heroNote}>
          <p>Uma regra de uso para que nome, símbolo, linguagem e promessa de edição limitada contem a mesma história — do site à plaqueta sob o tampo.</p>
          <span>Direção conceitual · uso interno</span>
        </div>
      </header>

      <nav className={styles.index} aria-label="Índice do guia de marca">
        <a href="#nome">01 Nome</a>
        <a href="#simbolo">02 Símbolo</a>
        <a href="#assinaturas">03 Assinaturas</a>
        <a href="#cores">04 Cores</a>
        <a href="#tipografia">05 Tipografia</a>
        <a href="#voz">06 Voz</a>
        <a href="#nomenclatura">07 Sistema</a>
        <a href="#validacao">08 Validação</a>
      </nav>

      <section className={`${styles.section} ${styles.nameSection}`} id="nome">
        <div className={styles.sectionHeading}>
          <span>01</span>
          <div><p className="micro-label">Veredito de posicionamento</p><h2>Sim. {brand.name} é uma direção forte.</h2></div>
        </div>
        <div className={styles.verdictGrid}>
          <article><strong>Dez está no nome</strong><p>“Décima” torna a tiragem de dez peças parte da identidade, sem precisar explicá-la em toda frase.</p></article>
          <article><strong>Soa editorial</strong><p>“Edições” transforma cada mesa em capítulo de um acervo e sustenta coleção, numeração e encerramento.</p></article>
          <article><strong>Tem presença</strong><p>É curto, memorável em português e combina uma palavra clássica com um sistema contemporâneo de mobiliário colecionável.</p></article>
        </div>
        <aside className={styles.caution}>
          <CircleAlert aria-hidden="true" />
          <div><strong>O conceito é bom; a disponibilidade ainda precisa ser provada.</strong><p>O nome pode lembrar uma editora e sua exclusividade jurídica não foi verificada. Antes de venda, investimento em embalagem ou domínio definitivo, é necessário pesquisar sinais semelhantes, classes aplicáveis e possibilidade de registro no INPI. Este guia avalia posicionamento; não declara disponibilidade legal.</p></div>
        </aside>
        <div className={styles.nameRules}>
          <div><span>Institucional</span><strong>{brand.name}</strong><p>Forma preferida em texto corrido e documentos.</p></div>
          <div><span>Assinatura</span><strong>{brand.shortName}<br /><small>{brand.editionLabel}</small></strong><p>Forma visual fixa, sempre com acento e respiro.</p></div>
          <div className={styles.wrong}><span>Evitar</span><strong>DECIMA / Decima</strong><p>Sem acento, perde pronúncia, identidade e consistência.</p></div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.symbolSection}`} id="simbolo">
        <div className={styles.sectionHeading}>
          <span>02</span>
          <div><p className="micro-label">Três ideias, um gesto</p><h2>Um tampo. Um dez. Um centro.</h2></div>
        </div>
        <div className={styles.symbolStage}>
          <Image src={assetPath(brand.assets.icon)} width="512" height="512" unoptimized alt={`Símbolo da ${brand.shortName}: círculo marfim, linhas cruzadas e ponto central em bronze`} />
        </div>
        <dl className={styles.symbolMeaning}>
          <div><dt>Círculo</dt><dd>O tampo visto de cima e o ciclo fechado de uma edição.</dd></div>
          <div><dt>X</dt><dd>O numeral romano de dez e a estrutura cruzada da base.</dd></div>
          <div><dt>Ponto</dt><dd>O centro da composição e a singularidade de cada peça numerada.</dd></div>
        </dl>
      </section>

      <section className={`${styles.section} ${styles.signatureSection}`} id="assinaturas">
        <div className={styles.sectionHeading}>
          <span>03</span>
          <div><p className="micro-label">Aplicações oficiais</p><h2>Duas assinaturas. Nenhuma improvisação.</h2></div>
        </div>
        <div className={styles.logoGrid}>
          <figure className={styles.lightLogo}>
            <Image src={assetPath(brand.assets.logoDark)} width="1600" height="500" unoptimized alt={`Assinatura escura da ${brand.name} para fundos claros`} />
            <figcaption><div><strong>Positiva</strong><span>Fundos claros e neutros</span></div><a href={assetPath(brand.assets.logoDark)} download>Baixar PNG <ArrowDownToLine aria-hidden="true" /></a></figcaption>
          </figure>
          <figure className={styles.darkLogo}>
            <Image src={assetPath(brand.assets.logoLight)} width="1600" height="500" unoptimized alt={`Assinatura clara da ${brand.name} para fundos escuros`} />
            <figcaption><div><strong>Negativa</strong><span>Carvão e imagens muito escuras</span></div><a href={assetPath(brand.assets.logoLight)} download>Baixar PNG <ArrowDownToLine aria-hidden="true" /></a></figcaption>
          </figure>
        </div>
        <div className={styles.usageRules}>
          <article><span>Respiro</span><div className={styles.clearSpace}><i>¼D</i><b aria-hidden="true">×</b></div><p>Reserve ao redor da assinatura pelo menos um quarto do diâmetro do símbolo.</p></article>
          <article><span>Tamanho mínimo</span><strong className={styles.minimum}>160 px <small>assinatura</small><br />32 px <small>símbolo</small></strong><p>Abaixo disso, use apenas o símbolo e preserve o ponto central.</p></article>
          <article className={styles.never}><span>Nunca</span><ul><li>esticar, inclinar ou contornar;</li><li>trocar apenas uma cor;</li><li>aplicar sombra ou brilho;</li><li>sobrepor a uma arte ruidosa.</li></ul></article>
        </div>
      </section>

      <section className={`${styles.section} ${styles.colorSection}`} id="cores">
        <div className={styles.sectionHeading}>
          <span>04</span>
          <div><p className="micro-label">Paleta material</p><h2>Carvão, papel e um ponto de bronze.</h2></div>
        </div>
        <div className={styles.palette}>
          {palette.map((color) => (
            <article key={color.hex} className={color.className}>
              <div aria-hidden="true" />
              <span>{color.name}</span><strong>{color.hex}</strong><p>{color.use}</p>
            </article>
          ))}
        </div>
        <p className={styles.colorRule}>O bronze é acento, não preenchimento dominante. Sobre fundo claro, texto pequeno usa <strong>{brand.palette.bronzeInk.hex}</strong>; o bronze mais luminoso fica reservado a detalhes maiores, ícones e matéria.</p>
      </section>

      <section className={`${styles.section} ${styles.typeSection}`} id="tipografia">
        <div className={styles.sectionHeading}>
          <span>05</span>
          <div><p className="micro-label">Sistema tipográfico</p><h2>Editorial no gesto. Preciso na informação.</h2></div>
        </div>
        <div className={styles.typeGrid}>
          <article className={styles.serifSample}><span>Cormorant Garamond · 400/500</span><strong>{brand.slogan.split(' ').slice(0, 2).join(' ')}<br />{brand.slogan.split(' ').slice(2).join(' ')}.</strong><p>Títulos, nomes de coleção, números protagonistas e frases de manifesto.</p></article>
          <article className={styles.sansSample}><span>MANROPE · 400/500/600</span><strong>PEÇA 01/10 · PROTÓTIPO 00<br />80 × 80 × 38 CM</strong><p>Navegação, ficha técnica, legenda, estado de produção e instruções.</p></article>
        </div>
      </section>

      <section className={`${styles.section} ${styles.voiceSection}`} id="voz">
        <div className={styles.sectionHeading}>
          <span>06</span>
          <div><p className="micro-label">Voz da marca</p><h2>Menos promessa. Mais matéria e prova.</h2></div>
        </div>
        <div className={styles.voiceGrid}>
          <article><span>Falar assim</span><blockquote>“Dez peças previstas. A edição nasce somente depois que o Protótipo 00 atravessar o portão técnico.”</blockquote><p>Concreto, editorial e transparente sobre o estágio real.</p></article>
          <article className={styles.wrongVoice}><span>Não assim</span><blockquote>“A mesa de luxo mais exclusiva que você já viu. Garanta a sua agora.”</blockquote><p>Superlativo sem prova, urgência artificial e venda antes da validação.</p></article>
        </div>
        <ul className={styles.voiceTraits}><li><strong>Precisa</strong><span>números e estados reais</span></li><li><strong>Contida</strong><span>sem excesso de adjetivos</span></li><li><strong>Material</strong><span>madeira, aço, luz e processo</span></li><li><strong>Editorial</strong><span>edição, arquivo e autoria</span></li></ul>
      </section>

      <section className={`${styles.section} ${styles.namingSection}`} id="nomenclatura">
        <div className={styles.sectionHeading}>
          <span>07</span>
          <div><p className="micro-label">Arquitetura das edições</p><h2>A família continua. A arte não se repete.</h2></div>
        </div>
        <div className={styles.namingFormula}>
          <div><span>Família estética</span><strong>Nórdica</strong></div><b aria-hidden="true">—</b><div><span>Título da edição</span><strong>Yggdrasil</strong></div>
        </div>
        <div className={styles.namingExamples}>
          <article><span>Nome completo</span><strong>Nórdica — Yggdrasil</strong></article>
          <article><span>Objeto</span><strong>Peça 01/10</strong></article>
          <article><span>Desenvolvimento</span><strong>Protótipo 00</strong></article>
          <article><span>Próximo capítulo</span><strong>Nórdica — novo título</strong></article>
        </div>
        <p className={styles.archiveRule}>Depois da peça 10/10, o desenho Yggdrasil entra no arquivo. A família Nórdica pode voltar, mas somente com novo título, nova composição e novo registro — jamais como reimpressão disfarçada.</p>
      </section>

      <section className={`${styles.section} ${styles.validationSection}`} id="validacao">
        <div className={styles.sectionHeading}>
          <span>08</span>
          <div><p className="micro-label">Antes de tornar definitivo</p><h2>Uma marca forte também precisa estar livre para existir.</h2></div>
        </div>
        <ol className={styles.checklist}>
          <li><span>01</span><div><strong>Busca fonética e visual</strong><p>Pesquisar “DÉCIMA”, variações sem acento, assinaturas semelhantes e conflitos em mobiliário, varejo, design e áreas relacionadas.</p></div></li>
          <li><span>02</span><div><strong>Estratégia de registro</strong><p>Definir classes e apresentação nominativa ou mista com apoio profissional antes do depósito no INPI.</p></div></li>
          <li><span>03</span><div><strong>Ecossistema digital</strong><p>Verificar domínio próprio e nomes coerentes nas redes; GitHub Pages continua sendo a hospedagem técnica, não o endereço final da marca.</p></div></li>
          <li><span>04</span><div><strong>Teste de leitura</strong><p>Confirmar com pessoas reais se “Edições” comunica série colecionável, sem fazer a marca parecer exclusivamente uma editora.</p></div></li>
        </ol>
        <aside className={styles.finalVerdict}><strong>Decisão recomendada agora</strong><p>Manter <em>{brand.name}</em> como direção oficial do conceito e usar este sistema de forma consistente. Tratar registro, domínio e validação de leitura como portão obrigatório antes do lançamento comercial.</p></aside>
      </section>

      <section className={styles.backToNotebook}>
        <p>Documento interno · não indexado</p>
        <h2>A identidade está definida como direção. A existência comercial depende do mesmo rigor exigido do protótipo.</h2>
        <Link href="/caderno"><ArrowLeft aria-hidden="true" /> Voltar ao Caderno do Atelier</Link>
      </section>

      <Footer />
    </main>
  );
}
