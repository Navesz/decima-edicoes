import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const output = join(root, 'out');
const basePath = '/decima-edicoes';
const origin = `https://navesz.github.io${basePath}`;
const failures = [];
const projectData = JSON.parse(readFileSync(join(root, 'app', 'lib', 'project-data.json'), 'utf8'));
const numberWords = ['zero', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'];
const pad2 = (value) => String(value).padStart(2, '0');
const collectionPath = `/colecoes/${projectData.collection.slug}/`;
const prototypeNumber = pad2(projectData.prototype.number);
const firstPiece = pad2(1);
const lastPieceFraction = `${pad2(projectData.edition.runSize)}/${projectData.edition.runSize}`;
const proofBodiesWord = numberWords[projectData.proofBodies.length] ?? String(projectData.proofBodies.length);
const gateItemsWord = numberWords[projectData.prototypeGate.length] ?? String(projectData.prototypeGate.length);
const proofBodiesHeading = `${proofBodiesWord.charAt(0).toUpperCase()}${proofBodiesWord.slice(1)}`;
const gateItemsHeading = `${gateItemsWord.charAt(0).toUpperCase()}${gateItemsWord.slice(1)}`;
const decisionTokens = {
  runSize: projectData.edition.runSize,
  lastPieceFraction,
  prototypeNumber,
  firstPiece,
  gateItemsWord,
};
const resolveDecisionText = (value) => value.replace(/\{(\w+)\}/g, (token, key) => key in decisionTokens ? String(decisionTokens[key]) : token);
const decisionLog = projectData.decisionLog.map((item) => ({ ...item, decision: resolveDecisionText(item.decision), record: resolveDecisionText(item.record) }));

function check(condition, message) {
  if (!condition) failures.push(message);
}

function read(relativePath) {
  const path = join(output, relativePath);
  check(existsSync(path), `Arquivo ausente: out/${relativePath}`);
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function withoutRscMarkers(html) {
  return html.replace(/<!--[^]*?-->/g, '');
}

const routes = [
  { file: 'index.html', title: 'DÉCIMA Edições — Objetos que não se repetem', canonical: `${origin}/`, social: `${origin}/og.jpg`, scriptBudgetKiB: 750, cssBudgetKiB: 40 },
  { file: 'colecoes/index.html', title: 'Coleções · DÉCIMA', canonical: `${origin}/colecoes/`, social: `${origin}/social/collections.jpg`, scriptBudgetKiB: 600, cssBudgetKiB: 40 },
  { file: `colecoes/${projectData.collection.slug}/index.html`, title: `${projectData.collection.family} — ${projectData.collection.name} · DÉCIMA`, canonical: `${origin}${collectionPath}`, social: `${origin}/social/yggdrasil.jpg`, scriptBudgetKiB: 600, cssBudgetKiB: 40 },
  { file: 'caderno/index.html', title: 'Caderno do Atelier · DÉCIMA', canonical: `${origin}/caderno/`, social: `${origin}/social/caderno.jpg`, scriptBudgetKiB: 600, cssBudgetKiB: 40 },
  { file: 'caderno/ficha-00/index.html', title: `Ficha do Protótipo ${prototypeNumber} · DÉCIMA`, canonical: `${origin}/caderno/ficha-00/`, scriptBudgetKiB: 600, cssBudgetKiB: 48, responsiveImages: false, sitemap: false },
];

function initialScriptBytes(html) {
  const sources = [...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((match) => match[1]);
  return [...new Set(sources)].reduce((total, src) => {
    const relative = src.replace(`${basePath}/`, '');
    const path = join(output, relative);
    return total + (existsSync(path) ? statSync(path).size : 0);
  }, 0);
}

function initialCssBytes(html) {
  const sources = [...html.matchAll(/<link[^>]+rel="stylesheet" href="([^"]+\.css)"/g)].map((match) => match[1]);
  return [...new Set(sources)].reduce((total, src) => {
    const relative = src.replace(`${basePath}/`, '');
    const path = join(output, relative);
    return total + (existsSync(path) ? statSync(path).size : 0);
  }, 0);
}

for (const route of routes) {
  const html = read(route.file);
  const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const h1Count = (visibleHtml.match(/<h1\b/gi) ?? []).length;

  check(html.includes('<html lang="pt-BR">'), `${route.file}: idioma pt-BR ausente`);
  check(html.includes('<meta name="description"'), `${route.file}: descrição ausente`);
  check(html.includes(`<link rel="canonical" href="${route.canonical}"`), `${route.file}: canonical incorreta`);
  if (route.social) {
    check(html.includes(`<meta property="og:image" content="${route.social}"`), `${route.file}: cartão Open Graph incorreto`);
    check(html.includes(`<meta name="twitter:image" content="${route.social}"`), `${route.file}: cartão Twitter incorreto`);
  }
  check(html.includes(`<title>${route.title}`), `${route.file}: título incorreto`);
  check(visibleHtml.includes('class="skip-link"'), `${route.file}: atalho para conteúdo ausente`);
  check(visibleHtml.includes('id="conteudo"'), `${route.file}: destino do atalho ausente`);
  check(h1Count === 1, `${route.file}: esperado um h1, encontrado ${h1Count}`);
  check(!visibleHtml.includes('style="opacity:0'), `${route.file}: conteúdo essencial nasce invisível`);
  check(html.includes('aria-expanded="false"'), `${route.file}: estado acessível do menu ausente`);
  if (route.responsiveImages !== false) {
    check(/\ssrcset="[^"]+-480\.webp 480w,[^"]+-800\.webp 800w/i.test(visibleHtml), `${route.file}: variantes responsivas de imagem ausentes`);
    check(/\ssizes="[^"]+"/i.test(visibleHtml), `${route.file}: instrução de tamanho responsivo ausente`);
  }
  const fontPreloadCount = (html.match(/<link[^>]+rel="preload"[^>]+as="font"/gi) ?? []).length;
  check(fontPreloadCount === 5, `${route.file}: esperado preload das 5 fontes usadas, encontrado ${fontPreloadCount}`);
  const initialKiB = initialScriptBytes(html) / 1024;
  check(initialKiB <= route.scriptBudgetKiB, `${route.file}: JavaScript inicial ${initialKiB.toFixed(1)} KiB excede ${route.scriptBudgetKiB} KiB`);
  const initialCssKiB = initialCssBytes(html) / 1024;
  check(initialCssKiB <= route.cssBudgetKiB, `${route.file}: CSS inicial ${initialCssKiB.toFixed(1)} KiB excede ${route.cssBudgetKiB} KiB`);
}

const requiredFiles = [
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'og.jpg',
  'brand/decima-logo-dark.png',
  'brand/decima-logo-light.png',
];
requiredFiles.forEach((file) => check(existsSync(join(output, file)), `Arquivo ausente: out/${file}`));

const publicImages = readdirSync(join(output, 'images')).filter((file) => /\.(webp|avif|jpe?g|png)$/i.test(file));
const publicImageBytes = publicImages.reduce((total, file) => {
  const bytes = statSync(join(output, 'images', file)).size;
  const budgetKiB = /-(480|800)\.webp$/i.test(file) ? 200 : 450;
  check(bytes <= budgetKiB * 1024, `imagem acima de ${budgetKiB} KiB: ${file} (${(bytes / 1024).toFixed(0)} KiB)`);
  return total + bytes;
}, 0);
const sourceImages = publicImages.filter((file) => /\.webp$/i.test(file) && !/-\d+\.webp$/i.test(file));
sourceImages.forEach((file) => {
  const stem = file.replace(/\.webp$/i, '');
  [480, 800].forEach((width) => check(publicImages.includes(`${stem}-${width}.webp`), `variante ausente: ${stem}-${width}.webp`));
});
check(publicImageBytes <= 4 * 1024 * 1024, `mídia pública excede 4 MiB: ${(publicImageBytes / 1024 / 1024).toFixed(2)} MiB`);
check(statSync(join(output, 'og.jpg')).size <= 200 * 1024, 'og.jpg excede 200 KiB');

const staticDirectory = join(output, '_next', 'static');
const cssDirectory = join(staticDirectory, 'chunks');
const mediaDirectory = join(staticDirectory, 'media');
const cssFiles = readdirSync(cssDirectory).filter((file) => file.endsWith('.css'));
const fontFiles = readdirSync(mediaDirectory).filter((file) => /\.woff2?$/i.test(file));
const fontBytes = fontFiles.reduce((total, file) => total + statSync(join(mediaDirectory, file)).size, 0);
check(cssFiles.length <= 2, `esperados no máximo dois pacotes CSS, encontrados ${cssFiles.length}`);
check(fontFiles.length === 5 && fontFiles.every((file) => file.endsWith('.woff2')), `esperadas 5 fontes WOFF2, encontrados ${fontFiles.length} arquivos`);
check(fontBytes <= 100 * 1024, `fontes excedem 100 KiB: ${(fontBytes / 1024).toFixed(1)} KiB`);

const sourceCss = readFileSync(join(root, 'app', 'globals.css'), 'utf8');
check(sourceCss.includes('--micro: 10px;') && sourceCss.includes('--micro-quiet: 9px;'), 'tokens mínimos de microtipografia ausentes');
check(sourceCss.includes('--ink-muted: rgba(23, 20, 17, .68);') && sourceCss.includes('--ivory-muted: rgba(238, 231, 218, .68);'), 'tokens de contraste informativo ausentes');
check(sourceCss.includes('--bronze-ink: #684318;'), 'variante acessível do bronze ausente');
check(!/font-size:\s*[78]px/.test(sourceCss), 'texto de 7 ou 8 px voltou à interface');
check((sourceCss.match(/min-height:\s*(24|44)px/g) ?? []).length >= 10, 'alvos mínimos de interação não estão protegidos');
check(sourceCss.includes('.image-caption {') && sourceCss.includes('background: rgba(23,20,17,.72);'), 'legenda conceitual perdeu seu fundo de contraste');

const socialCards = ['collections.jpg', 'yggdrasil.jpg', 'caderno.jpg'];
for (const file of socialCards) {
  const path = join(output, 'social', file);
  check(existsSync(path), `cartão social ausente: social/${file}`);
  if (!existsSync(path)) continue;
  const bytes = statSync(path).size;
  const metadata = await sharp(path).metadata();
  check(metadata.width === 1200 && metadata.height === 630, `cartão social com dimensão incorreta: ${file}`);
  check(metadata.format === 'jpeg', `cartão social deve ser JPEG: ${file}`);
  check(bytes <= 180 * 1024, `cartão social excede 180 KiB: ${file} (${(bytes / 1024).toFixed(0)} KiB)`);
}

const sitemap = read('sitemap.xml');
routes.filter((route) => route.sitemap !== false).forEach((route) => check(sitemap.includes(`<loc>${route.canonical}</loc>`), `sitemap.xml: rota ausente ${route.canonical}`));

const robots = read('robots.txt');
check(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'robots.txt: sitemap ausente ou incorreto');

const home = withoutRscMarkers(read('index.html'));
const product = withoutRscMarkers(read(`colecoes/${projectData.collection.slug}/index.html`));
const notebook = withoutRscMarkers(read('caderno/index.html'));
const worksheet = withoutRscMarkers(read('caderno/ficha-00/index.html'));
const visibleWorksheet = worksheet.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
const interestFormTag = home.match(/<form\b[^>]*data-local-demo[^>]*>/i)?.[0] ?? '';
check(home.includes(`protótipo ${prototypeNumber} em desenvolvimento`), 'início: estágio conceitual não está explícito');
check(home.includes(`Estágio atual: ${numberWords[projectData.edition.producedPieces]} de ${numberWords[projectData.edition.runSize]} peças produzidas`), 'início: estágio editorial diverge do contrato do projeto');
check(home.includes(`Protocolo ${lastPieceFraction}`), 'início: protocolo editorial diverge da tiragem declarada');
check(home.includes('não cria reserva, cobrança ou direito'), 'início: limite do fluxo de interesse não está explícito');
check(interestFormTag.length > 0, 'início: formulário demonstrativo não está identificado');
check(!/\saction=/i.test(interestFormTag), 'início: demonstração não deve apontar para um destino de envio');
check(home.includes('<fieldset disabled="">'), 'início: campos devem permanecer inativos sem JavaScript');
check(home.includes('A simulação local requer JavaScript. Nenhum campo foi habilitado e nenhum dado será enviado.'), 'início: aviso sem JavaScript ausente');
check(home.includes('minLength="2"') && home.includes('type="email"'), 'início: restrições de validação do formulário ausentes');
check(product.includes(`${projectData.collection.name} ainda não está à venda`), `${projectData.collection.name}: indisponibilidade comercial não está explícita`);
check(product.includes('ProductModel'), `${projectData.collection.name}: dados estruturados devem representar um modelo, não produto disponível`);
check(product.includes(`${projectData.edition.producedPieces} produzidas`) && product.includes(`${projectData.edition.runSize} previstas`), `${projectData.collection.name}: contagem editorial diverge do contrato do projeto`);
check(product.includes(`${projectData.product.diameterCm} cm`) && product.includes(`${projectData.product.heightCm} cm`) && product.includes(`${projectData.product.topThicknessMm.minimum}–${projectData.product.topThicknessMm.maximum} mm`), `${projectData.collection.name}: dimensões de partida divergem do contrato do projeto`);
check(notebook.includes(`Versão ${projectData.documents.notebookVersion}`), 'Caderno: versão do documento vivo não foi atualizada');
check(notebook.includes(`Só existe peça ${firstPiece} depois de ${gateItemsWord} aprovações documentadas`), `Caderno: regra do Portão ${prototypeNumber} ausente`);
check(notebook.includes('tampo inteiro, maciço, redondo, pré-cortado e pré-nivelado'), 'Caderno: especificação de partida da madeira ausente');
check((notebook.match(/data-gate=/g) ?? []).length === projectData.prototypeGate.length, `Caderno: esperado estado para as ${gateItemsWord} aprovações do Portão ${prototypeNumber}`);
check(notebook.includes('<table class="gate-table">') && notebook.includes(`<caption>${gateItemsHeading} aprovações obrigatórias`), `Caderno: matriz do Portão ${prototypeNumber} não está semanticamente estruturada`);
check(/href="(?:\/decima-edicoes)?\/caderno\/ficha-00\/?"/.test(notebook), 'Caderno: acesso à ficha do Protótipo 00 ausente');
check(notebook.includes('href="#registro"') && notebook.includes('id="registro"'), 'Caderno: navegação para o registro de decisões ausente');
check(notebook.includes(`<caption>Base da revisão ${projectData.documents.notebookVersion}`) && notebook.includes(`<time dateTime="${projectData.documents.updatedAtIso}"`), 'Caderno: revisão do registro de decisões ausente ou divergente');
check((notebook.match(/data-decision=/g) ?? []).length === decisionLog.length, 'Caderno: quantidade de decisões diverge do contrato do projeto');
for (const item of decisionLog) {
  check(notebook.includes(`data-decision="${item.code}"`) && notebook.includes(item.decision) && notebook.includes(item.record), `Caderno: decisão ${item.code} ausente ou divergente`);
}
check(worksheet.includes('<meta name="robots" content="noindex, nofollow"'), 'Ficha 00: bloqueio de indexação ausente');
check(!sitemap.includes(`${origin}/caderno/ficha-00/`), 'Ficha 00: rota interna não deve entrar no sitemap público');
check(worksheet.includes('Imprimir ou salvar em PDF') && worksheet.includes('Ficha do'), 'Ficha 00: ação de impressão ou título ausente');
check(worksheet.includes(`${proofBodiesHeading} corpos de prova`) && worksheet.includes(`Fechamento do Portão ${prototypeNumber}`), `Ficha ${prototypeNumber}: blocos operacionais incompletos`);
check((visibleWorksheet.match(/□ aprovado/g) ?? []).length === projectData.prototypeGate.length, `Ficha ${prototypeNumber}: aprovações imprimíveis incompletas`);
const worksheetCss = readFileSync(join(root, 'app', 'caderno', 'ficha-00', 'worksheet.module.css'), 'utf8');
check(worksheetCss.includes('@page { size: A4;') && worksheetCss.includes('@media print'), 'Ficha 00: configuração de impressão A4 ausente');

check(projectData.edition.runSize >= 2, 'Contrato do projeto: a tiragem precisa comportar início e encerramento');
check(projectData.edition.producedPieces >= 0 && projectData.edition.producedPieces <= projectData.edition.runSize, 'Contrato do projeto: quantidade produzida inválida');
check(projectData.edition.commercialStatus === 'prototyping', 'Contrato do projeto: estado comercial mudou sem uma regra de publicação correspondente');
check(new Set(projectData.proofBodies.map((item) => item.code)).size === projectData.proofBodies.length, 'Contrato do projeto: códigos de corpos de prova repetidos');
check(new Set(projectData.prototypeGate.map((item) => item.code)).size === projectData.prototypeGate.length, 'Contrato do projeto: códigos do Portão repetidos');
check(/^\d+\.\d+$/.test(projectData.documents.notebookVersion), 'Contrato do projeto: versão do Caderno não segue o formato numérico');
check(new Set(decisionLog.map((item) => item.code)).size === decisionLog.length, 'Contrato do projeto: códigos do registro de decisões repetidos');
check(decisionLog.every((item) => ['Confirmada', 'Em teste', 'Aguardando 00', 'Em vigor'].includes(item.state)), 'Contrato do projeto: estado desconhecido no registro de decisões');
check(decisionLog.every((item) => !/[{}]/.test(item.decision) && !/[{}]/.test(item.record)), 'Contrato do projeto: marcador não resolvido no registro de decisões');
for (const relativePath of ['app/components/home-page.tsx', 'app/colecoes/nordica-yggdrasil/page.tsx', 'app/caderno/page.tsx', 'app/caderno/ficha-00/page.tsx']) {
  const source = readFileSync(join(root, relativePath), 'utf8');
  check(source.includes("lib/project'"), `${relativePath}: consumidor deixou de usar a fonte única do projeto`);
}

if (failures.length) {
  console.error(`Verificação estática falhou (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Verificação estática aprovada: ${routes.length} rotas, metadados sociais, acessibilidade básica, SEO, mídia responsiva e orçamentos de JavaScript, CSS, fontes e imagens.`);
