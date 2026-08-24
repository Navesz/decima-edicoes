import type { Metadata } from 'next';
import { ArrowLeft, CircleAlert } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '../../components/footer';
import { PrintButton } from '../../components/print-button';
import { SiteHeader } from '../../components/site-header';
import { documents, edition, projectLabels, proofBodies, prototypeGate } from '../../lib/project';
import { absoluteUrl } from '../../lib/site';
import styles from './worksheet.module.css';

export const metadata: Metadata = {
  title: `Ficha do Protótipo ${edition.prototypeNumber}`,
  description: `Ficha interna e imprimível para registrar as evidências do Protótipo ${edition.prototypeNumber} da DÉCIMA.`,
  alternates: { canonical: absoluteUrl('/caderno/ficha-00/') },
  robots: { index: false, follow: false },
};

const useTests = ['Cor e profundidade sob três luzes', 'Água e limpeza doméstica', 'Caneca morna', 'Unha e micro-risco', 'Toque e gordura da mão', 'Bordas, bolhas e aderência'];
const structureTests = ['Apoio sem balanço em piso real', 'Carga de ensaio definida e registrada', 'Fixação entre base e tampo', 'Ausência de quinas ou rebarbas críticas', 'Deformação perceptível após a carga'];

function Blank({ wide = false }: { wide?: boolean }) {
  return <span className={`${styles.blank} ${wide ? styles.wide : ''}`} aria-hidden="true" />;
}

export default function PrototypeWorksheetPage() {
  return (
    <main className={styles.page} id="conteudo">
      <SiteHeader tone="dark" current="notebook" />
      <div className={styles.actions}><Link href="/caderno/#portao"><ArrowLeft size={16} /> Voltar ao Portão {edition.prototypeNumber}</Link><PrintButton className={styles.print} /></div>
      <article className={styles.sheet}>
        <header className={styles.heading}><div><p>DÉCIMA Edições · documento interno</p><h1>Ficha do<br />Protótipo {edition.prototypeNumber}.</h1></div><div><strong>{edition.prototypeCode}</strong><span>Versão {documents.worksheetVersion} · {documents.updatedAt}</span></div></header>

        <section className={styles.block}><h2><span>01</span> Identificação e matéria</h2><div className={styles.fields}><label>Data <Blank /></label><label>Responsável <Blank /></label><label>Fornecedor <Blank /></label><label>Nota fiscal <Blank /></label><label>Espécie declarada <Blank /></label><label>Umidade registrada <Blank /></label><label>Diâmetro real <Blank /></label><label>Espessura real <Blank /></label><label className={styles.full}>Inspeção de plano, empeno e defeitos <Blank wide /></label></div><p className={styles.fixed}>Especificação de partida: tampo inteiro · madeira maciça · redondo · pré-cortado · pré-nivelado · arte somente no plano superior.</p></section>

        <section className={styles.block}><h2><span>02</span> {projectLabels.proofBodiesHeading} corpos de prova</h2><table className={styles.table}><thead><tr><th>Placa</th><th>Sistema</th><th>Insumos / lote</th><th>Observação depois da cura</th><th>Decisão</th></tr></thead><tbody>{proofBodies.map((proof) => <tr key={proof.code}><th scope="row">{proof.code}</th><td>{proof.title}</td><td><Blank /></td><td><Blank /></td><td>□ reprovar<br />□ repetir<br />□ aprovar</td></tr>)}</tbody></table></section>

        <section className={styles.block}><h2><span>03</span> Acabamento e uso</h2><div className={styles.checks}>{useTests.map((test) => <div key={test}><strong>{test}</strong><span>□ falhou</span><span>□ revisar</span><span>□ passou</span><Blank /></div>)}</div></section>

        <section className={styles.block}><h2><span>04</span> Estrutura montada</h2><div className={styles.checks}>{structureTests.map((test) => <div key={test}><strong>{test}</strong><span>□ falhou</span><span>□ revisar</span><span>□ passou</span><Blank /></div>)}</div><label className={styles.line}>Carga aplicada, duração e método <Blank wide /></label></section>

        <section className={styles.block}><h2><span>05</span> Custo e repetibilidade</h2><div className={styles.costs}><label>Madeira <Blank /></label><label>Aço / base <Blank /></label><label>Arte / gráfica <Blank /></label><label>Química / acabamento <Blank /></label><label>Terceiros <Blank /></label><label>Embalagem / entrega <Blank /></label><label>Perdas <Blank /></label><label>Horas reais <Blank /></label><label className={styles.total}>Custo real do Protótipo {edition.prototypeNumber} <Blank /></label></div><label className={styles.line}>Gargalo que impediria repetir a peça com o mesmo padrão <Blank wide /></label></section>

        <section className={styles.block}><h2><span>06</span> Fechamento do Portão {edition.prototypeNumber}</h2><div className={styles.gate}>{prototypeGate.map((item) => <div key={item.code}><strong>{item.code} {item.area}</strong><span>□ em aberto</span><span>□ em teste</span><span>□ aprovado</span><label>Data <Blank /></label><label>Rubrica <Blank /></label></div>)}</div><div className={styles.decision}><p>Decisão do ciclo</p><span>□ reprovar o sistema</span><span>□ retrabalhar e repetir evidências</span><span>□ liberar ficha técnica para a peça {edition.firstPiece}</span></div></section>

        <aside className={styles.warning}><CircleAlert /><p><strong>Esta ficha não libera venda por aparência.</strong>A peça {edition.firstPiece} só pode existir quando as {projectLabels.gateItemsWord} frentes estiverem aprovadas e as evidências estiverem anexadas ao arquivo da edição.</p></aside>
        <footer className={styles.signatures}><label>Responsável pelo protótipo <Blank wide /></label><label>Revisão final <Blank wide /></label><label>Data <Blank /></label></footer>
      </article>
      <Footer />
    </main>
  );
}
