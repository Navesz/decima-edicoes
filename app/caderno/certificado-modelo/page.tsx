import type { Metadata } from 'next';
import { ArrowLeft, CircleAlert } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '../../components/footer';
import { PrintButton } from '../../components/print-button';
import { SiteHeader } from '../../components/site-header';
import { brand } from '../../lib/brand';
import { collection, documents, edition, product, productLabels } from '../../lib/project';
import { absoluteUrl } from '../../lib/site';
import styles from '../ficha-00/worksheet.module.css';

export const metadata: Metadata = {
  title: 'Modelo de Certificado de Edição',
  description: `Modelo interno e sem validade do futuro certificado de edição da ${brand.name}.`,
  alternates: { canonical: absoluteUrl('/caderno/certificado-modelo/') },
  robots: { index: false, follow: false },
};

function Blank({ wide = false }: { wide?: boolean }) {
  return <span className={`${styles.blank} ${wide ? styles.wide : ''}`} aria-hidden="true" />;
}

export default function CertificateModelPage() {
  return (
    <main className={styles.page} id="conteudo">
      <SiteHeader tone="dark" current="notebook" />
      <div className={styles.actions}>
        <Link href="/caderno/#edicao"><ArrowLeft size={16} /> Voltar ao protocolo de edição</Link>
        <PrintButton className={styles.print} />
      </div>

      <article className={styles.sheet}>
        <header className={styles.heading}>
          <div><p>{brand.name} · documento interno</p><h1>Modelo de<br />certificado.</h1></div>
          <div><strong>SEM VALIDADE</strong><span>Modelo 0.1 · {documents.updatedAt}</span></div>
        </header>

        <aside className={styles.warning}>
          <CircleAlert aria-hidden="true" />
          <p><strong>MODELO · NÃO NUMERAR · NÃO ASSINAR</strong>Nenhuma peça foi produzida. Este documento define os campos e a promessa futura; não autentica objeto, não cria reserva e não pode ser entregue como certificado.</p>
        </aside>

        <section className={styles.block}>
          <h2><span>01</span> Identidade da edição</h2>
          <div className={styles.fields}>
            <label>Marca <span>{brand.name}</span></label><label>Coleção <span>{collection.family} — {collection.name}</span></label>
            <label>Ano da coleção <span>{collection.year}</span></label><label>Tiragem máxima <span>{edition.runSize} peças</span></label>
            <label>Número da futura peça <Blank /></label><label>Código único do certificado <Blank /></label>
            <label>Data de conclusão <Blank /></label><label>Local de fabricação <Blank /></label>
          </div>
          <p className={styles.fixed}>Formato editorial futuro: <strong>{collection.family} — {collection.name} · Peça __/{edition.runSize}</strong>. O número só é atribuído depois da inspeção final; nunca no início da encomenda.</p>
        </section>

        <section className={styles.block}>
          <h2><span>02</span> Matéria e objeto</h2>
          <div className={styles.fields}>
            <label>Espécie declarada da madeira <Blank /></label><label>Fornecedor / origem registrada <Blank /></label>
            <label>Diâmetro real <Blank /></label><label>Altura real <Blank /></label>
            <label>Espessura real do tampo <Blank /></label><label>Umidade no recebimento <Blank /></label>
            <label>Sistema de arte aprovado <Blank /></label><label>Sistema de acabamento / lotes <Blank /></label>
            <label>Base / lote de fabricação <Blank /></label><label>Massa final <Blank /></label>
          </div>
          <p className={styles.fixed}>Referência de projeto, a confirmar na peça real: {productLabels.diameter} de diâmetro · {productLabels.height} de altura · tampo de {productLabels.topThickness} · {product.top} · {product.base}. A lateral permanece madeira real e sem estampa.</p>
        </section>

        <section className={styles.block}>
          <h2><span>03</span> Protocolo de edição</h2>
          <table className={styles.table}>
            <caption>Promessas que precisam ser verdadeiras antes da assinatura</caption>
            <thead><tr><th scope="col">Regra</th><th scope="col">Declaração futura</th><th scope="col">Evidência anexada</th></tr></thead>
            <tbody>
              <tr><th scope="row">Tiragem</th><td>Máximo de {edition.runSize} peças numeradas para esta matriz visual.</td><td><Blank /></td></tr>
              <tr><th scope="row">Estado</th><td>A peça foi concluída, inspecionada e aprovada antes de receber número.</td><td><Blank /></td></tr>
              <tr><th scope="row">Matéria</th><td>Espécie, medidas, acabamento e lotes correspondem ao registro técnico.</td><td><Blank /></td></tr>
              <tr><th scope="row">Encerramento</th><td>Depois da peça {edition.lastPieceFraction}, a matriz {collection.name} é aposentada e não volta como reimpressão.</td><td><Blank /></td></tr>
            </tbody>
          </table>
        </section>

        <section className={styles.block}>
          <h2><span>04</span> Registro visual e vínculo físico</h2>
          <div className={styles.fields}>
            <label>Foto integral da face superior <Blank /></label><label>Foto da face inferior e plaqueta <Blank /></label>
            <label>Foto do veio antes da arte <Blank /></label><label>Foto lateral contínua <Blank /></label>
            <label>ID da pasta de evidências <Blank /></label><label>Hash / impressão do registro digital <Blank /></label>
            <label className={styles.full}>Marca de identificação física sob o tampo <Blank wide /></label>
          </div>
          <p className={styles.fixed}>A futura verificação precisa cruzar número, certificado, plaqueta discreta, fotografia do veio e arquivo de produção. QR code sozinho não prova autenticidade e não substitui registro material.</p>
        </section>

        <section className={styles.block}>
          <h2><span>05</span> Histórico de custódia e intervenção</h2>
          <table className={styles.table}>
            <caption>Registro privado; dados pessoais não devem entrar no arquivo público sem base e finalidade definidas</caption>
            <thead><tr><th scope="col">Data</th><th scope="col">Evento</th><th scope="col">Responsável</th><th scope="col">Evidência / observação</th></tr></thead>
            <tbody>{[1, 2, 3, 4].map((row) => <tr key={row}><td><Blank /></td><td>□ entrega<br />□ transferência<br />□ inspeção<br />□ restauro</td><td><Blank /></td><td><Blank /></td></tr>)}</tbody>
          </table>
        </section>

        <section className={styles.block}>
          <h2><span>06</span> Declaração e limites</h2>
          <p className={styles.fixed}>Quando emitido de forma válida, o certificado acompanhará o objeto descrito e o protocolo da edição. Variações naturais de veio e cor não mudam a matriz visual; intervenções futuras precisam entrar no histórico. O certificado não transfere direito autoral sobre a arte, não substitui termos de garantia e uso e não deve publicar dados pessoais do proprietário.</p>
          <div className={styles.fields}>
            <label>Versão dos termos comerciais revisada <Blank /></label><label>Ficha de cuidado anexada <Blank /></label>
            <label>Garantia aplicável revisada <Blank /></label><label>Canal de verificação ativo <Blank /></label>
          </div>
        </section>

        <footer className={styles.signatures}>
          <label>Responsável pela inspeção <Blank wide /></label><label>Assinatura do atelier <Blank wide /></label><label>Data <Blank /></label>
        </footer>
      </article>
      <Footer />
    </main>
  );
}
