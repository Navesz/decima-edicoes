import type { Metadata } from 'next';
import { ArrowLeft, CircleAlert } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '../../components/footer';
import { PrintButton } from '../../components/print-button';
import { SiteHeader } from '../../components/site-header';
import { absoluteUrl } from '../../lib/site';
import styles from './worksheet.module.css';

export const metadata: Metadata = {
  title: 'Ficha do Protótipo 00',
  description: 'Ficha interna e imprimível para registrar as evidências do Protótipo 00 da DÉCIMA.',
  alternates: { canonical: absoluteUrl('/caderno/ficha-00/') },
  robots: { index: false, follow: false },
};

const proofBodies = [
  ['A', 'Vinil integral + epóxi'],
  ['B', 'Máscara + pintura + epóxi'],
  ['C', 'Máscara + pintura + PU'],
  ['D', 'Vinil + epóxi + PU acetinado'],
];

const useTests = ['Cor e profundidade sob três luzes', 'Água e limpeza doméstica', 'Caneca morna', 'Unha e micro-risco', 'Toque e gordura da mão', 'Bordas, bolhas e aderência'];
const structureTests = ['Apoio sem balanço em piso real', 'Carga de ensaio definida e registrada', 'Fixação entre base e tampo', 'Ausência de quinas ou rebarbas críticas', 'Deformação perceptível após a carga'];
const gateItems = ['M01 Matéria', 'A02 Arte', 'F03 Acabamento', 'E04 Estrutura', 'C05 Custo', 'V06 Venda'];

function Blank({ wide = false }: { wide?: boolean }) {
  return <span className={`${styles.blank} ${wide ? styles.wide : ''}`} aria-hidden="true" />;
}

export default function PrototypeWorksheetPage() {
  return (
    <main className={styles.page} id="conteudo">
      <SiteHeader tone="dark" />
      <div className={styles.actions}><Link href="/caderno/#portao"><ArrowLeft size={16} /> Voltar ao Portão 00</Link><PrintButton className={styles.print} /></div>
      <article className={styles.sheet}>
        <header className={styles.heading}><div><p>DÉCIMA Edições · documento interno</p><h1>Ficha do<br />Protótipo 00.</h1></div><div><strong>YGG–00</strong><span>Versão 0.1 · 24 ago 2026</span></div></header>

        <section className={styles.block}><h2><span>01</span> Identificação e matéria</h2><div className={styles.fields}><label>Data <Blank /></label><label>Responsável <Blank /></label><label>Fornecedor <Blank /></label><label>Nota fiscal <Blank /></label><label>Espécie declarada <Blank /></label><label>Umidade registrada <Blank /></label><label>Diâmetro real <Blank /></label><label>Espessura real <Blank /></label><label className={styles.full}>Inspeção de plano, empeno e defeitos <Blank wide /></label></div><p className={styles.fixed}>Especificação de partida: tampo inteiro · madeira maciça · redondo · pré-cortado · pré-nivelado · arte somente no plano superior.</p></section>

        <section className={styles.block}><h2><span>02</span> Quatro corpos de prova</h2><table className={styles.table}><thead><tr><th>Placa</th><th>Sistema</th><th>Insumos / lote</th><th>Observação depois da cura</th><th>Decisão</th></tr></thead><tbody>{proofBodies.map(([code, system]) => <tr key={code}><th scope="row">{code}</th><td>{system}</td><td><Blank /></td><td><Blank /></td><td>□ reprovar<br />□ repetir<br />□ aprovar</td></tr>)}</tbody></table></section>

        <section className={styles.block}><h2><span>03</span> Acabamento e uso</h2><div className={styles.checks}>{useTests.map((test) => <div key={test}><strong>{test}</strong><span>□ falhou</span><span>□ revisar</span><span>□ passou</span><Blank /></div>)}</div></section>

        <section className={styles.block}><h2><span>04</span> Estrutura montada</h2><div className={styles.checks}>{structureTests.map((test) => <div key={test}><strong>{test}</strong><span>□ falhou</span><span>□ revisar</span><span>□ passou</span><Blank /></div>)}</div><label className={styles.line}>Carga aplicada, duração e método <Blank wide /></label></section>

        <section className={styles.block}><h2><span>05</span> Custo e repetibilidade</h2><div className={styles.costs}><label>Madeira <Blank /></label><label>Aço / base <Blank /></label><label>Arte / gráfica <Blank /></label><label>Química / acabamento <Blank /></label><label>Terceiros <Blank /></label><label>Embalagem / entrega <Blank /></label><label>Perdas <Blank /></label><label>Horas reais <Blank /></label><label className={styles.total}>Custo real do Protótipo 00 <Blank /></label></div><label className={styles.line}>Gargalo que impediria repetir a peça com o mesmo padrão <Blank wide /></label></section>

        <section className={styles.block}><h2><span>06</span> Fechamento do Portão 00</h2><div className={styles.gate}>{gateItems.map((item) => <div key={item}><strong>{item}</strong><span>□ em aberto</span><span>□ em teste</span><span>□ aprovado</span><label>Data <Blank /></label><label>Rubrica <Blank /></label></div>)}</div><div className={styles.decision}><p>Decisão do ciclo</p><span>□ reprovar o sistema</span><span>□ retrabalhar e repetir evidências</span><span>□ liberar ficha técnica para a peça 01</span></div></section>

        <aside className={styles.warning}><CircleAlert /><p><strong>Esta ficha não libera venda por aparência.</strong>A peça 01 só pode existir quando as seis frentes estiverem aprovadas e as evidências estiverem anexadas ao arquivo da edição.</p></aside>
        <footer className={styles.signatures}><label>Responsável pelo protótipo <Blank wide /></label><label>Revisão final <Blank wide /></label><label>Data <Blank /></label></footer>
      </article>
      <Footer />
    </main>
  );
}
