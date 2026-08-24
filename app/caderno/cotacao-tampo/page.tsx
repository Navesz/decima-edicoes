import type { Metadata } from 'next';
import { ArrowLeft, CircleAlert } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '../../components/footer';
import { PrintButton } from '../../components/print-button';
import { SiteHeader } from '../../components/site-header';
import { brand } from '../../lib/brand';
import { documents, productLabels } from '../../lib/project';
import { absoluteUrl } from '../../lib/site';
import styles from '../ficha-00/worksheet.module.css';

export const metadata: Metadata = {
  title: 'Briefing de Cotação do Tampo',
  description: `Documento interno para cotar e receber o tampo inteiro e pré-nivelado do Protótipo 00 da ${brand.name}.`,
  alternates: { canonical: absoluteUrl('/caderno/cotacao-tampo/') },
  robots: { index: false, follow: false },
};

const evidenceBeforePurchase = [
  'Foto nítida da face superior inteira',
  'Foto nítida da face inferior inteira',
  'Fotos da lateral e dos defeitos existentes',
  'Medição real de diâmetro e espessura',
  'Verificação de plano com régua reta e método declarado',
  'Leituras de umidade em mais de um ponto, com método informado',
];

const deliveryChecks = [
  'Conferir diâmetro em direções diferentes',
  'Conferir espessura em pontos distribuídos',
  'Apoiar e verificar balanço sem forçar a peça',
  'Repetir verificação de plano nas duas faces',
  'Registrar umidade, ambiente, data e equipamento',
  'Fotografar faces, lateral, veio e qualquer defeito',
  'Conferir espécie declarada, nota e origem informada',
  'Registrar dano de transporte antes de aceitar a entrega',
];

function Blank({ wide = false }: { wide?: boolean }) {
  return <span className={`${styles.blank} ${wide ? styles.wide : ''}`} aria-hidden="true" />;
}

export default function TopQuoteBriefPage() {
  return (
    <main className={styles.page} id="conteudo">
      <SiteHeader tone="dark" current="notebook" />
      <div className={styles.actions}>
        <Link href="/caderno/#regras"><ArrowLeft size={16} /> Voltar às regras de construção</Link>
        <PrintButton className={styles.print} />
      </div>

      <article className={styles.sheet}>
        <header className={styles.heading}>
          <div><p>{brand.name} · documento interno</p><h1>Briefing do<br />tampo.</h1></div>
          <div><strong>M01 · COTAÇÃO</strong><span>Revisão 0.1 · {documents.updatedAt}</span></div>
        </header>

        <section className={styles.block}>
          <h2><span>01</span> Pedido principal</h2>
          <div className={styles.fields}>
            <label>Fornecedor <Blank /></label><label>Contato <Blank /></label>
            <label>Cidade / UF <Blank /></label><label>Data da cotação <Blank /></label>
            <label>Nome comum da madeira <Blank /></label><label>Espécie declarada <Blank /></label>
            <label>Origem informada <Blank /></label><label>Nota fiscal / documento <Blank /></label>
          </div>
          <p className={styles.fixed}><strong>Prioridade A:</strong> tampo redondo em uma peça contínua de madeira maciça, de uma única espécie, já cortado, com as duas faces planas e paralelas. Sem emenda como padrão. A lateral permanece madeira real e limpa; a arte ocupará somente o plano superior.</p>
        </section>

        <section className={styles.block}>
          <h2><span>02</span> Geometria e condição de fornecimento</h2>
          <table className={styles.table}>
            <caption>Requisitos de partida; o fornecedor deve declarar medidas reais e tolerâncias</caption>
            <thead><tr><th scope="col">Frente</th><th scope="col">Pedido DÉCIMA</th><th scope="col">Fornecedor declara</th><th scope="col">Evidência / observação</th></tr></thead>
            <tbody>
              <tr><th scope="row">Construção</th><td>Uma peça contínua · madeira maciça · uma única espécie</td><td><Blank /></td><td><Blank /></td></tr>
              <tr><th scope="row">Diâmetro final</th><td>{productLabels.diameter}; informar tolerância e medida real</td><td><Blank /></td><td><Blank /></td></tr>
              <tr><th scope="row">Espessura final</th><td>{productLabels.topThickness}; informar variação medida</td><td><Blank /></td><td><Blank /></td></tr>
              <tr><th scope="row">Faces</th><td>Planas, paralelas e pré-niveladas; declarar processo usado</td><td><Blank /></td><td><Blank /></td></tr>
              <tr><th scope="row">Lateral</th><td>Contínua, limpa, sem estampa e apta a acabamento aparente</td><td><Blank /></td><td><Blank /></td></tr>
              <tr><th scope="row">Umidade</th><td>Informar leituras, pontos, data, ambiente e equipamento; sem estimativa verbal</td><td><Blank /></td><td><Blank /></td></tr>
              <tr><th scope="row">Defeitos</th><td>Declarar trincas, nós, galerias, alburno, reparos e sinais de movimento</td><td><Blank /></td><td><Blank /></td></tr>
            </tbody>
          </table>
          <p className={styles.fixed}>“Nivelado” precisa vir acompanhado do método de verificação e da tolerância que o fornecedor consegue cumprir. Este briefing não inventa um limite antes de medir o que o processo local e o Protótipo 00 realmente exigem.</p>
        </section>

        <section className={styles.block}>
          <h2><span>03</span> Evidência antes da compra</h2>
          <div className={styles.checks}>{evidenceBeforePurchase.map((item) => <div key={item}><strong>{item}</strong><span>□ pedido</span><span>□ recebido</span><span>□ revisar</span><Blank /></div>)}</div>
          <label className={styles.line}>Link ou pasta das imagens e medições <Blank wide /></label>
        </section>

        <section className={styles.block}>
          <h2><span>04</span> Alternativa B — cotar separadamente</h2>
          <p className={styles.fixed}><strong>Somente se a Prioridade A for indisponível ou inviável:</strong> o fornecedor pode apresentar painel colado de uma única espécie como alternativa identificada. Deve declarar número e orientação das lâminas, tipo de adesivo, processo de prensagem, espessura final e garantia de plano. Essa alternativa não é equivalente automática ao tampo em peça contínua e não pode ser misturada na mesma linha de preço.</p>
          <div className={styles.fields}>
            <label>Número de lâminas / peças <Blank /></label><label>Larguras aproximadas <Blank /></label>
            <label>Adesivo declarado <Blank /></label><label>Processo de prensagem <Blank /></label>
            <label>Plano e tolerância garantidos <Blank /></label><label>Diferença de preço e prazo <Blank /></label>
            <label className={styles.full}>Razão para considerar a alternativa <Blank wide /></label>
          </div>
        </section>

        <section className={styles.block}>
          <h2><span>05</span> Comparação de três cotações</h2>
          <table className={styles.table}>
            <caption>Comparação mínima para o Portão M01; preços não devem esconder construção diferente</caption>
            <thead><tr><th scope="col">Fornecedor</th><th scope="col">Construção / espécie</th><th scope="col">Medidas reais</th><th scope="col">Preço + frete</th><th scope="col">Prazo</th><th scope="col">Evidência</th></tr></thead>
            <tbody>
              {[1, 2, 3].map((number) => <tr key={number}><th scope="row">Cotação {number}</th><td><Blank /></td><td><Blank /></td><td><Blank /></td><td><Blank /></td><td>□ completa<br />□ falta prova</td></tr>)}
            </tbody>
          </table>
          <div className={styles.costs}>
            <label>Cotação escolhida <Blank /></label><label>Preço do tampo <Blank /></label><label>Frete <Blank /></label><label>Prazo total <Blank /></label>
            <label className={styles.total}>Custo recebido e conferido <Blank /></label>
          </div>
        </section>

        <section className={styles.block}>
          <h2><span>06</span> Recebimento e aceite</h2>
          <div className={styles.checks}>{deliveryChecks.map((item) => <div key={item}><strong>{item}</strong><span>□ falhou</span><span>□ revisar</span><span>□ passou</span><Blank /></div>)}</div>
          <label className={styles.line}>Tempo e condição de aclimatação antes dos corpos de prova ou usinagem <Blank wide /></label>
          <div className={styles.decision}><p>Decisão M01</p><span>□ rejeitar no recebimento</span><span>□ aceitar com ressalva documentada</span><span>□ aprovar para o Protótipo 00</span></div>
        </section>

        <aside className={styles.warning}>
          <CircleAlert aria-hidden="true" />
          <p><strong>Madeira real continua se movendo.</strong>Plano, umidade e integridade precisam ser medidos no recebimento e reavaliados depois da aclimatação. A compra não libera arte, epóxi ou acabamento até a compatibilidade ser provada nos corpos de prova.</p>
        </aside>

        <footer className={styles.signatures}>
          <label>Responsável pela cotação <Blank wide /></label><label>Aceite técnico <Blank wide /></label><label>Data <Blank /></label>
        </footer>
      </article>
      <Footer />
    </main>
  );
}
