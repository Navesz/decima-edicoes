import type { Metadata } from 'next';
import { ArrowUpRight, CircleAlert, FlaskConical, Hammer, Layers3, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { FinishLabLoader } from '../components/finish-lab-loader';
import { Footer } from '../components/footer';
import { ResponsiveImage } from '../components/responsive-image';
import { SiteHeader } from '../components/site-header';
import { buildRules } from '../lib/collections';
import { assetPath } from '../lib/base-path';
import { absoluteUrl } from '../lib/site';

export const metadata: Metadata = {
  title: 'Caderno do Atelier',
  description: 'O caderno aberto de conceito, materiais, acabamentos e prototipagem da DÉCIMA.',
  alternates: { canonical: absoluteUrl('/caderno/') },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'DÉCIMA Edições',
    url: absoluteUrl('/caderno/'),
    title: 'Caderno do Atelier · DÉCIMA Edições',
    description: 'Conceito, materiais, acabamentos e prototipagem da DÉCIMA.',
    images: [{ url: absoluteUrl('/social/caderno.jpg'), width: 1200, height: 630, alt: 'Prancha de estudos do Caderno do Atelier' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caderno do Atelier · DÉCIMA Edições',
    description: 'Conceito, materiais, acabamentos e prototipagem da DÉCIMA.',
    images: [absoluteUrl('/social/caderno.jpg')],
  },
};

const tests = [
  { code: 'A', title: 'Vinil integral + epóxi', detail: 'Caminho rápido para validar arte e encapsulamento. Alto risco de parecer impresso se a matéria não permanecer visível.' },
  { code: 'B', title: 'Máscara + pintura + epóxi', detail: 'Mais artesanal e nobre. Usa o adesivo como ferramenta, não como superfície final.' },
  { code: 'C', title: 'Máscara + pintura + PU', detail: 'Toque mais natural e pouca espessura. Forte candidato para coleções claras e minimalistas.' },
  { code: 'D', title: 'Vinil + epóxi + PU acetinado', detail: 'Ponto de partida da edição inaugural: profundidade sob controle e reflexo difuso.' },
];

const prototypeGate = [
  { code: 'M01', area: 'Matéria', approval: 'Escolher espécie e fornecedor de um tampo inteiro, maciço, redondo, pré-cortado e pré-nivelado.', evidence: 'Nota fiscal, espécie declarada, espessura, umidade registrada e inspeção de empeno.', state: 'Em aberto' },
  { code: 'A02', area: 'Arte', approval: 'Escolher um dos quatro sistemas sem permitir que a superfície pareça apenas envelopada.', evidence: 'Quatro placas comparadas depois da cura, com registro de cor, bolha, borda e aderência.', state: 'Em teste' },
  { code: 'F03', area: 'Acabamento', approval: 'Congelar um sistema completo e compatível de selagem, encapsulamento e proteção acetinada.', evidence: 'Amostra aprovada sob três luzes e após água, caneca morna, limpeza e toque.', state: 'Em teste' },
  { code: 'E04', area: 'Estrutura', approval: 'Validar a base baixa em metalon reto, sem balanço, quina crítica ou deformação perceptível.', evidence: 'Protótipo 00 montado, carregado, medido e inspecionado sobre piso real.', state: 'Aguardando 00' },
  { code: 'C05', area: 'Custo', approval: 'Conhecer custo, perda e horas reais antes de definir preço ou prazo.', evidence: 'Ficha de custos do protótipo, três cotações críticas e sequência repetível de produção.', state: 'Aguardando 00' },
  { code: 'V06', area: 'Venda', approval: 'Definir ficha técnica, garantia, embalagem, entrega e canal de interesse com privacidade.', evidence: 'Documentos publicados e fluxo real testado do contato ao pós-entrega.', state: 'Não iniciado' },
];

export default function StudioNotebookPage() {
  return (
    <main className="notebook-page" id="conteudo">
      <SiteHeader tone="dark" />
      <header className="notebook-hero">
        <div><p className="micro-label">Documento vivo · fundador</p><h1>Caderno<br />do Atelier.</h1></div>
        <div><p>Esta é a parte do projeto que normalmente fica escondida: o raciocínio por trás do produto, as restrições reais da oficina e o que ainda precisa ser provado antes de vender.</p><span>Versão 0.2 · 24 ago 2026</span></div>
      </header>

      <nav className="notebook-nav" aria-label="Índice do caderno"><a href="#regras">01 Regras</a><a href="#acabamento">02 Acabamento</a><a href="#testes">03 Protótipos</a><a href="#processo">04 Processo</a><a href="#edicao">05 Edição</a><a href="#portao">06 Portão 00</a></nav>

      <section className="notebook-section" id="regras">
        <div className="notebook-section-title"><span>01</span><div><p className="micro-label">Restrições que viram linguagem</p><h2>Regras de<br />construção.</h2></div></div>
        <div className="rules-list">
          {buildRules.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
        <aside className="decision-callout"><CircleAlert /><p><strong>Decisão de partida</strong>O tampo inteiro e pré-nivelado é a especificação padrão. Emendar madeira só entra no futuro, depois que houver ferramental e processo capazes de garantir nivelamento perfeito.</p></aside>
      </section>

      <section className="finish-section" id="acabamento">
        <div className="notebook-section-title"><span>02</span><div><p className="micro-label">Brilho, fosco e acetinado</p><h2>A luz também<br />é material.</h2></div></div>
        <div className="finish-intro"><p>O epóxi curado tende a parecer “vidro molhado”. A aparência das referências pede outra coisa: profundidade sem espelho, luz difusa e um pequeno reflexo que revela a superfície quando a pessoa se move.</p><p>O objetivo inicial é encapsular a arte com epóxi e controlar o reflexo com a camada final compatível, possivelmente PU 2K acetinado. A especificação definitiva depende dos testes do sistema completo.</p></div>
        <FinishLabLoader />
        <div className="finish-scale">
          <article><i style={{ '--shine': '.02' } as React.CSSProperties} /><span>0–15%</span><h3>Fosco</h3><p>Sóbrio, mas pode apagar a profundidade e marcar gordura dependendo do sistema.</p></article>
          <article className="recommended"><i style={{ '--shine': '.24' } as React.CSSProperties} /><span>25–40%</span><h3>Acetinado</h3><p>Reflexo difuso, toque visual nobre e melhor tolerância a micro-riscos.</p><b>Direção escolhida</b></article>
          <article><i style={{ '--shine': '.55' } as React.CSSProperties} /><span>50–70%</span><h3>Semibrilho</h3><p>Mais profundidade, mas começa a competir com a arte e mostrar marcas de uso.</p></article>
          <article><i style={{ '--shine': '.9' } as React.CSSProperties} /><span>80–100%</span><h3>Espelhado</h3><p>Impactante na foto; vulnerável a reflexos, poeira e aparência de artesanato em resina.</p></article>
        </div>
      </section>

      <section className="notebook-section prototypes" id="testes">
        <div className="notebook-section-title"><span>03</span><div><p className="micro-label">Matriz de protótipos</p><h2>Quatro placas<br />antes da mesa.</h2></div></div>
        <div className="prototype-grid">{tests.map((test) => <article key={test.code}><strong>{test.code}</strong><FlaskConical /><h3>{test.title}</h3><p>{test.detail}</p><span>Placa 30 × 30 cm</span></article>)}</div>
        <div className="test-checklist"><h3>O que cada corpo de prova precisa responder</h3><ul><li>A tinta ou o vinil muda de cor sob o epóxi?</li><li>Aparecem bolhas, retração ou descolamento nas bordas?</li><li>A superfície suporta água, caneca morna e limpeza doméstica?</li><li>O acabamento marca unha, pano ou gordura da mão?</li><li>Depois de alguns dias, a aparência ainda comunica luxo?</li></ul></div>
      </section>

      <section className="process-section" id="processo">
        <div className="process-image"><ResponsiveImage src={assetPath('/images/yggdrasil-runes.webp')} alt="Mesa Yggdrasil em estudo de acabamento" sizes="(max-width: 900px) 100vw, 46vw" /></div>
        <div className="process-copy"><div className="notebook-section-title"><span>04</span><div><p className="micro-label">Fluxo proposto</p><h2>Da madeira<br />ao certificado.</h2></div></div><ol><li><span>01</span><div><strong>Receber e estabilizar</strong><p>Selecionar tampo inteiro, plano e com umidade adequada ao ambiente de produção.</p></div></li><li><span>02</span><div><strong>Preparar e selar</strong><p>Lixar, limpar e aplicar o sistema de selagem compatível definido nos testes.</p></div></li><li><span>03</span><div><strong>Aplicar a linguagem</strong><p>Posicionar arte apenas no plano superior, preservando integralmente a lateral.</p></div></li><li><span>04</span><div><strong>Encapsular e finalizar</strong><p>Epóxi, cura conforme ficha técnica, nivelamento e acabamento final acetinado validado.</p></div></li><li><span>05</span><div><strong>Montar e numerar</strong><p>Base em aço, inspeção, plaqueta 01/10–10/10 e certificado da edição.</p></div></li></ol></div>
      </section>

      <section className="notebook-section edition-rules" id="edicao">
        <div className="notebook-section-title"><span>05</span><div><p className="micro-label">Protocolo de escassez</p><h2>Uma promessa<br />verificável.</h2></div></div>
        <div className="edition-diagram"><div><span>NASCE</span><strong>01</strong><p>Arte aprovada e primeiro objeto certificado.</p></div><ArrowUpRight /><div><span>EXISTE</span><strong>02—09</strong><p>Produção sob encomenda, numeração pública.</p></div><ArrowUpRight /><div><span>ENCERRA</span><strong>10</strong><p>Arquivo fechado. A matriz visual é aposentada.</p></div></div>
        <div className="notebook-cards"><article><ShieldCheck /><h3>Certificado</h3><p>Nome da coleção, número da peça, ano, espécie da madeira, acabamento e assinatura do atelier.</p></article><article><Layers3 /><h3>Arquivo de matéria</h3><p>Fotos do veio antes da arte, registro do processo e especificação dos insumos usados.</p></article><article><Hammer /><h3>Plaqueta discreta</h3><p>Aplicada sob o tampo, jamais na lateral protagonista: Collection · Piece · Year.</p></article></div>
      </section>

      <section className="notebook-section gate-section" id="portao">
        <div className="notebook-section-title"><span>06</span><div><p className="micro-label">Critério de passagem</p><h2>O portão do<br />Protótipo 00.</h2></div></div>
        <div className="gate-intro"><p>Uma imagem bonita não autoriza uma venda. Só existe peça 01 depois de seis aprovações documentadas, cada uma apoiada por evidência do mundo real.</p><p>“Em teste” registra trabalho em curso; não significa aprovação. Uma frente só muda para aprovada quando a evidência indicada entra no arquivo da edição.</p></div>
        <div className="gate-table-wrap" tabIndex={0} aria-label="Tabela do Portão 00; role horizontalmente para ver todas as colunas">
          <table className="gate-table">
            <caption>Seis aprovações obrigatórias antes da abertura comercial de Yggdrasil</caption>
            <thead><tr><th scope="col">Código</th><th scope="col">Frente</th><th scope="col">Aprovação necessária</th><th scope="col">Evidência mínima</th><th scope="col">Estado</th></tr></thead>
            <tbody>{prototypeGate.map((item) => <tr key={item.code}><td>{item.code}</td><th scope="row">{item.area}</th><td>{item.approval}</td><td>{item.evidence}</td><td><span data-state={item.state}>{item.state}</span></td></tr>)}</tbody>
          </table>
        </div>
        <aside className="gate-rule"><ShieldCheck /><p><strong>Regra de lançamento</strong>Se uma aprovação voltar para teste, a abertura comercial volta com ela. Escassez não substitui segurança, repetibilidade ou clareza.</p></aside>
      </section>

      <section className="notebook-warning"><CircleAlert /><div><p className="micro-label">Segurança de oficina</p><h2>Acabamento premium exige processo profissional.</h2><p>Epóxi, solventes e sistemas PU 2K podem exigir ventilação, proteção respiratória e equipamentos específicos. A execução deve seguir as fichas de segurança e técnicas dos fabricantes; este caderno orienta o conceito, não substitui treinamento nem especificação profissional.</p></div></section>

      <section className="notebook-next"><p>Próxima decisão do projeto</p><h2>Cotar o tampo inteiro pré-nivelado, registrar a espécie real e iniciar as quatro placas do portão 00.</h2><Link href="/colecoes/nordica-yggdrasil">Rever Yggdrasil <ArrowUpRight /></Link></section>
      <Footer />
    </main>
  );
}
