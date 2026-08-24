'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { collections } from '../lib/collections';
import { assetPath } from '../lib/base-path';
import { Footer } from './footer';
import { InterestForm } from './interest-form';
import { ScrollEffects } from './scroll-effects';
import { SiteHeader } from './site-header';

export function HomePage() {
  const reduceMotion = useReducedMotion();

  return (
    <main id="conteudo">
      <section className="hero-shell">
        <Image className="hero-image" src={assetPath('/images/hero-yggdrasil.png')} alt="Visualização conceitual da mesa baixa redonda Yggdrasil em madeira e aço" fill priority sizes="100vw" />
        <div className="hero-wash" />
        <SiteHeader />

        <motion.div className="hero-content" initial={false} animate="visible" variants={{
          hidden: {},
          visible: { transition: { staggerChildren: .14, delayChildren: .25 } },
        }}>
          <motion.p className="eyebrow" variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: .7 } } }}>
            <span /> Coleção inaugural · 2026
          </motion.p>
          <motion.h1 variants={{ hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0, transition: { duration: 1.15, ease: [0.22, 1, 0.36, 1] } } }}>
            Objetos que<br />não se repetem.
          </motion.h1>
          <motion.div className="hero-bottom" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: .9 } } }}>
            <p className="hero-copy">Mesas autorais em madeira e aço.<br />Dez peças previstas. Uma edição. Nenhuma reimpressão.</p>
            <Link className="discover" href="/colecoes/nordica-yggdrasil">
              <span>Descobrir<br />Nórdica — Yggdrasil</span>
              <b aria-hidden="true"><ArrowDown size={16} /></b>
            </Link>
          </motion.div>
        </motion.div>

        <aside className="edition-rail" aria-label="Estágio atual: zero de dez peças produzidas"><span>ESTÁGIO</span><strong>00</strong><i>/10</i></aside>
        <p className="image-caption">Visualização conceitual · protótipo 00 em desenvolvimento</p>
      </section>

      <section className="manifesto-section" id="manifesto">
        <div className="section-index gsap-reveal"><span>01</span><p>Manifesto<br />de edição</p></div>
        <div className="manifesto-copy gsap-reveal">
          <p className="micro-label">A escassez como compromisso</p>
          <h2>Não fabricamos um catálogo infinito. Criamos uma obra, numeramos dez vezes e encerramos o desenho.</h2>
          <div className="manifesto-columns">
            <p>Cada veio da madeira altera a arte. Cada peça recebe número próprio, plaqueta e certificado. A décima não inicia uma reposição: ela fecha um capítulo.</p>
            <p>Quando uma linguagem retorna, volta transformada — outro nome, outra composição, outra história. O primeiro Yggdrasil jamais será repetido.</p>
          </div>
          <Link className="text-link" href="/caderno">Ler o protocolo de edição <ArrowRight size={15} /></Link>
        </div>
      </section>

      <section className="object-study">
        <div className="object-image-frame">
          <Image className="parallax-media" src={assetPath('/images/yggdrasil-dark.png')} alt="Visualização conceitual do tampo Yggdrasil em madeira escura" fill sizes="(max-width: 800px) 100vw, 55vw" />
          <span>O tampo é a obra.</span>
        </div>
        <div className="object-copy gsap-reveal">
          <p className="micro-label">Construção honesta</p>
          <h2>Uma madeira.<br />Um plano.<br />Uma assinatura.</h2>
          <p>A lateral não recebe estampa, metal ou imitação. Ela revela uma única peça de madeira maciça. A arte existe somente sobre o tampo; a base baixa em metalon reto desaparece para deixar o objeto falar.</p>
          <dl>
            <div><dt>Matéria</dt><dd>Madeira maciça pré-nivelada</dd></div>
            <div><dt>Estrutura</dt><dd>Aço carbono · perfil reto</dd></div>
            <div><dt>Superfície</dt><dd>Arte encapsulada · acetinado profundo</dd></div>
          </dl>
        </div>
      </section>

      <section className="collections-section" id="colecao">
        <div className="collections-heading gsap-reveal">
          <div><p className="micro-label">Edições e estudos</p><h2>O arquivo<br />DÉCIMA.</h2></div>
          <p>Uma coleção disponível. Duas linguagens em estudo. Todas construídas sob a mesma disciplina material.</p>
        </div>
        <div className="collection-list">
          {collections.map((collection, index) => (
            <motion.article className="collection-card gsap-reveal" key={collection.slug} whileHover={reduceMotion ? undefined : { y: -8 }} transition={{ duration: .35 }}>
              <Link href={index === 0 ? `/colecoes/${collection.slug}` : '/colecoes'} aria-label={`${collection.family} — ${collection.name}`}>
                <div className="collection-media"><Image src={collection.image} alt={`Visualização conceitual ${collection.family} — ${collection.name}`} fill sizes="(max-width: 800px) 100vw, 33vw" /></div>
                <div className="collection-meta"><span>{collection.number}</span><div><small>{collection.family}</small><h3>{collection.name}</h3></div><ArrowUpRight size={18} strokeWidth={1.25} /></div>
                <p>{collection.status}</p>
              </Link>
            </motion.article>
          ))}
        </div>
        <Link className="outline-button" href="/colecoes">Ver arquivo completo <ArrowRight size={16} /></Link>
      </section>

      <section className="edition-protocol">
        <Image className="protocol-image" src={assetPath('/images/yggdrasil-ivory.png')} alt="Visualização conceitual Yggdrasil em acabamento marfim" fill sizes="100vw" />
        <div className="protocol-wash" />
        <div className="protocol-copy gsap-reveal">
          <p className="micro-label">Protocolo 10/10</p>
          <h2>O valor não está no que produzimos. Está também no que recusamos repetir.</h2>
          <div className="protocol-numbers"><div><strong>10</strong><span>peças numeradas</span></div><div><strong>01</strong><span>arte por edição</span></div><div><strong>00</strong><span>reimpressões</span></div></div>
        </div>
      </section>

      <section className="studio-teaser">
        <div className="studio-intro gsap-reveal"><p className="micro-label">Área aberta do fundador</p><h2>O Caderno<br />do Atelier.</h2></div>
        <div className="studio-panel gsap-reveal">
          <div className="studio-panel-image"><Image src={assetPath('/images/collection-board.png')} alt="Prancha conceitual das coleções DÉCIMA" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
          <div><p>Um espaço para enxergar o negócio por dentro: acabamento brilhante, fosco e acetinado; construção possível com metalon brasileiro; testes de adesivo, epóxi e PU; regras da marca e decisões ainda em aberto.</p><Link href="/caderno">Entrar no Caderno <ArrowUpRight size={16} /></Link></div>
        </div>
      </section>

      <section className="interest-section" id="interesse">
        <div className="interest-copy gsap-reveal"><p className="micro-label">Prévia do acesso privado</p><h2>Dez lugares.<br />Nenhum estoque.</h2><p>A edição ainda está em prototipagem. Este fluxo demonstra como será a manifestação de interesse; ele não cria reserva, cobrança ou direito sobre uma numeração.</p></div>
        <InterestForm />
      </section>

      <Footer />
      <ScrollEffects />
    </main>
  );
}
