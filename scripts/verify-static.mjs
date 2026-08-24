import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative as pathRelative } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const output = join(root, 'out');
const basePath = '/decima-edicoes';
const exportedBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const origin = `https://navesz.github.io${basePath}`;
const failures = [];
const projectData = JSON.parse(readFileSync(join(root, 'app', 'lib', 'project-data.json'), 'utf8'));
const brandData = JSON.parse(readFileSync(join(root, 'app', 'lib', 'brand-data.json'), 'utf8'));
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

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

const routes = [
  { file: 'index.html', title: `${brandData.name} — ${brandData.slogan}`, canonical: `${origin}/`, social: `${origin}/og.jpg`, scriptBudgetKiB: 750, cssBudgetKiB: 40 },
  { file: 'colecoes/index.html', title: `Coleções · ${brandData.shortName}`, canonical: `${origin}/colecoes/`, social: `${origin}/social/collections.jpg`, scriptBudgetKiB: 600, cssBudgetKiB: 40 },
  { file: `colecoes/${projectData.collection.slug}/index.html`, title: `${projectData.collection.family} — ${projectData.collection.name} · ${brandData.shortName}`, canonical: `${origin}${collectionPath}`, social: `${origin}/social/yggdrasil.jpg`, scriptBudgetKiB: 600, cssBudgetKiB: 40 },
  { file: 'caderno/index.html', title: `Caderno do Atelier · ${brandData.shortName}`, canonical: `${origin}/caderno/`, social: `${origin}/social/caderno.jpg`, scriptBudgetKiB: 600, cssBudgetKiB: 40 },
  { file: 'caderno/cotacao-tampo/index.html', title: `Briefing de Cotação do Tampo · ${brandData.shortName}`, canonical: `${origin}/caderno/cotacao-tampo/`, scriptBudgetKiB: 600, cssBudgetKiB: 46, responsiveImages: false, sitemap: false },
  { file: 'caderno/marca/index.html', title: `Guia de Marca · ${brandData.shortName}`, canonical: `${origin}/caderno/marca/`, scriptBudgetKiB: 600, cssBudgetKiB: 54, responsiveImages: false, sitemap: false },
  { file: 'caderno/ficha-00/index.html', title: `Ficha do Protótipo ${prototypeNumber} · ${brandData.shortName}`, canonical: `${origin}/caderno/ficha-00/`, scriptBudgetKiB: 600, cssBudgetKiB: 48, responsiveImages: false, sitemap: false },
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
  check(html.includes(`<link rel="manifest" href="${exportedBasePath}/manifest.webmanifest"`), `${route.file}: manifesto da marca ausente ou fora do basePath`);
  check(html.includes(`<meta name="theme-color" content="${brandData.palette.ink.hex}"`), `${route.file}: cor de navegador da marca ausente`);
  check(html.includes('<meta name="mobile-web-app-capable" content="yes"'), `${route.file}: modo instalável não declarado`);
  check(html.includes('<meta name="format-detection" content="telephone=no"'), `${route.file}: detecção automática de telefone não foi desativada`);
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
  'manifest.webmanifest',
  'og.jpg',
  brandData.assets.logoDark.replace(/^\//, ''),
  brandData.assets.logoLight.replace(/^\//, ''),
];
requiredFiles.forEach((file) => check(existsSync(join(output, file)), `Arquivo ausente: out/${file}`));

let manifest = {};
try {
  manifest = JSON.parse(read('manifest.webmanifest'));
} catch {
  failures.push('manifest.webmanifest: JSON inválido');
}
const manifestRoot = `${exportedBasePath}/`;
check(manifest.id === manifestRoot && manifest.start_url === manifestRoot && manifest.scope === manifestRoot, 'manifest.webmanifest: id, início ou escopo divergem do basePath');
check(manifest.name === brandData.name && manifest.short_name === brandData.shortName && manifest.lang === brandData.locale, 'manifest.webmanifest: identidade ou idioma incorretos');
check(manifest.display === 'standalone', 'manifest.webmanifest: apresentação instalável deve ser standalone');
check(manifest.background_color === brandData.palette.ink.hex && manifest.theme_color === brandData.palette.ink.hex, 'manifest.webmanifest: cores divergem da identidade');
check(Array.isArray(manifest.icons) && manifest.icons.some((icon) => icon.src === `${exportedBasePath}${brandData.assets.icon}` && icon.sizes === '512x512' && icon.type === 'image/png'), 'manifest.webmanifest: ícone 512×512 ausente ou incorreto');
const iconMetadata = await sharp(join(output, brandData.assets.icon.replace(/^\//, ''))).metadata();
check(iconMetadata.width === 512 && iconMetadata.height === 512 && iconMetadata.format === 'png', 'icon.png: dimensão ou formato diverge do manifesto');

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
check(cssFiles.length <= 3, `esperados no máximo três pacotes CSS, encontrados ${cssFiles.length}`);
check(fontFiles.length === 5 && fontFiles.every((file) => file.endsWith('.woff2')), `esperadas 5 fontes WOFF2, encontrados ${fontFiles.length} arquivos`);
check(fontBytes <= 100 * 1024, `fontes excedem 100 KiB: ${(fontBytes / 1024).toFixed(1)} KiB`);

const sourceCss = readFileSync(join(root, 'app', 'globals.css'), 'utf8');
check(sourceCss.includes('--micro: 10px;') && sourceCss.includes('--micro-quiet: 9px;'), 'tokens mínimos de microtipografia ausentes');
check(sourceCss.includes('--ink-muted: rgba(23, 20, 17, .68);') && sourceCss.includes('--ivory-muted: rgba(238, 231, 218, .68);'), 'tokens de contraste informativo ausentes');
for (const [token, color] of Object.entries(brandData.palette)) {
  const cssToken = token.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  check(sourceCss.toLowerCase().includes(`--${cssToken}: ${color.hex.toLowerCase()};`), `identidade: token CSS --${cssToken} diverge do contrato da marca`);
}
check(!/font-size:\s*[78]px/.test(sourceCss), 'texto de 7 ou 8 px voltou à interface');
check((sourceCss.match(/min-height:\s*(24|44)px/g) ?? []).length >= 10, 'alvos mínimos de interação não estão protegidos');
check(sourceCss.includes('.image-caption {') && sourceCss.includes('background: rgba(23,20,17,.72);'), 'legenda conceitual perdeu seu fundo de contraste');
check(sourceCss.includes(':focus-visible { outline: 2px solid var(--bronze);'), 'indicador global de foco visível ausente');
check(sourceCss.includes('@media (prefers-reduced-motion: reduce)'), 'preferência por movimento reduzido deixou de ser respeitada');

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
const topQuote = withoutRscMarkers(read('caderno/cotacao-tampo/index.html'));
const brandGuide = withoutRscMarkers(read('caderno/marca/index.html'));
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
check(/href="(?:\/decima-edicoes)?\/caderno\/cotacao-tampo\/?"/.test(notebook), 'Caderno: acesso ao briefing de cotação do tampo ausente');
check(/href="(?:\/decima-edicoes)?\/caderno\/marca\/?"/.test(notebook), 'Caderno: acesso ao Guia de Marca ausente');
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
check(topQuote.includes('<meta name="robots" content="noindex, nofollow"'), 'Cotação do tampo: bloqueio de indexação ausente');
check(!sitemap.includes(`${origin}/caderno/cotacao-tampo/`), 'Cotação do tampo: rota interna não deve entrar no sitemap público');
check(topQuote.includes(`Diâmetro final</th><td>${projectData.product.diameterCm} cm`) && topQuote.includes(`Espessura final</th><td>${projectData.product.topThicknessMm.minimum}–${projectData.product.topThicknessMm.maximum} mm`), 'Cotação do tampo: dimensões divergem do contrato do projeto');
check(topQuote.includes('uma peça contínua de madeira maciça, de uma única espécie') && topQuote.includes('Sem emenda como padrão'), 'Cotação do tampo: pedido principal não protege a peça contínua');
check(topQuote.includes('Alternativa B — cotar separadamente') && topQuote.includes('não é equivalente automática'), 'Cotação do tampo: alternativa colada não está corretamente separada');
check(topQuote.includes('mais de um ponto, com método informado') && topQuote.includes('sem estimativa verbal'), 'Cotação do tampo: evidência de umidade insuficiente');
check((topQuote.match(/Cotação [123]/g) ?? []).length === 3, 'Cotação do tampo: comparação de três fornecedores incompleta');
check(topQuote.includes('Imprimir ou salvar em PDF') && topQuote.includes('Decisão M01'), 'Cotação do tampo: ação imprimível ou decisão de matéria ausente');
check(brandGuide.includes('<meta name="robots" content="noindex, nofollow"'), 'Guia de Marca: bloqueio de indexação ausente');
check(!sitemap.includes(`${origin}/caderno/marca/`), 'Guia de Marca: rota interna não deve entrar no sitemap público');
check(brandGuide.includes('Sim. DÉCIMA Edições é uma direção forte.') && brandGuide.includes('não declara disponibilidade legal'), 'Guia de Marca: veredito ou limite jurídico ausente');
check(brandGuide.includes('Círculo') && brandGuide.includes('numeral romano de dez') && brandGuide.includes('Ponto'), 'Guia de Marca: significado do símbolo incompleto');
check(brandGuide.includes('/brand/decima-logo-dark.png') && brandGuide.includes('/brand/decima-logo-light.png') && brandGuide.includes('/icon.png'), 'Guia de Marca: assinaturas oficiais incompletas');
check(Object.values(brandData.palette).every((color) => brandGuide.includes(color.hex)), 'Guia de Marca: paleta oficial incompleta ou divergente');
check(brandGuide.includes('Cormorant Garamond') && brandGuide.includes('MANROPE'), 'Guia de Marca: sistema tipográfico incompleto');
check(brandGuide.includes('Nórdica — Yggdrasil') && brandGuide.includes('Peça 01/10') && brandGuide.includes('Protótipo 00'), 'Guia de Marca: sistema de nomenclatura incompleto');
check(brandGuide.includes('pesquisar sinais semelhantes') && brandGuide.includes('registro no INPI'), 'Guia de Marca: portão de validação legal incompleto');
const brandGuideCss = readFileSync(join(root, 'app', 'caderno', 'marca', 'brand-guide.module.css'), 'utf8');
check(brandGuideCss.includes('@media (max-width: 1000px)') && brandGuideCss.includes('@media (max-width: 700px)'), 'Guia de Marca: adaptação responsiva ausente');
for (const [token, color] of Object.entries(brandData.palette)) {
  check(brandGuideCss.toLowerCase().includes(`.${token.toLowerCase()} { --swatch: ${color.hex.toLowerCase()}; }`), `Guia de Marca: amostra ${token} diverge do contrato`);
}

function structuredNodes(relativePath) {
  const html = read(relativePath);
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const nodes = [];
  for (const [index, block] of blocks.entries()) {
    try {
      const value = JSON.parse(block[1]);
      check(value['@context'] === 'https://schema.org', `${relativePath}: JSON-LD ${index + 1} sem contexto Schema.org`);
      nodes.push(...(Array.isArray(value['@graph']) ? value['@graph'] : [value]));
    } catch {
      failures.push(`${relativePath}: JSON-LD ${index + 1} inválido`);
    }
  }
  check(blocks.length >= 1, `${relativePath}: nenhum JSON-LD encontrado`);
  return nodes;
}

function nodesOfType(nodes, type) {
  return nodes.filter((node) => node['@type'] === type || (Array.isArray(node['@type']) && node['@type'].includes(type)));
}

function structuredKeys(value, keys = new Set()) {
  if (!value || typeof value !== 'object') return keys;
  for (const [key, child] of Object.entries(value)) {
    keys.add(key);
    if (Array.isArray(child)) child.forEach((item) => structuredKeys(item, keys));
    else structuredKeys(child, keys);
  }
  return keys;
}

function checkBreadcrumb(nodes, expectedLength, expectedCurrentUrl, relativePath) {
  const breadcrumbs = nodesOfType(nodes, 'BreadcrumbList');
  check(breadcrumbs.length === 1, `${relativePath}: esperado um BreadcrumbList`);
  if (breadcrumbs.length !== 1) return;
  const items = breadcrumbs[0].itemListElement ?? [];
  check(items.length === expectedLength, `${relativePath}: breadcrumb deveria ter ${expectedLength} itens`);
  check(items.every((item, index) => item['@type'] === 'ListItem' && item.position === index + 1 && item.name && item.item), `${relativePath}: breadcrumb sem posições, nomes ou URLs válidos`);
  check(items.at(-1)?.item === expectedCurrentUrl, `${relativePath}: breadcrumb não termina na página atual`);
}

const brandStructuredId = `${origin}/#brand`;
const websiteStructuredId = `${origin}/#website`;
let checkedStructuredNodes = 0;
for (const file of listFiles(output).filter((candidate) => candidate.endsWith('.html'))) {
  const relativePath = pathRelative(output, file).replaceAll('\\', '/');
  const nodes = structuredNodes(relativePath);
  checkedStructuredNodes += nodes.length;
  const brands = nodesOfType(nodes, 'Brand');
  const websites = nodesOfType(nodes, 'WebSite');
  check(brands.length === 1 && brands[0]['@id'] === brandStructuredId && brands[0].name === brandData.name && brands[0].slogan === brandData.slogan && brands[0].logo === `${origin}${brandData.assets.logoDark}`, `${relativePath}: nó Brand ausente, desconectado ou divergente do contrato`);
  check(websites.length === 1 && websites[0]['@id'] === websiteStructuredId && websites[0].name === brandData.name && websites[0].inLanguage === brandData.locale && websites[0].about?.['@id'] === brandStructuredId, `${relativePath}: nó WebSite ausente ou desconectado`);
  const ids = nodes.map((node) => node['@id']).filter(Boolean);
  check(ids.length === new Set(ids).size, `${relativePath}: @id duplicado no JSON-LD`);
  if (projectData.edition.commercialStatus === 'prototyping') {
    const keys = structuredKeys(nodes);
    for (const forbidden of ['offers', 'price', 'priceCurrency', 'availability', 'aggregateRating', 'review', 'sku', 'gtin']) {
      check(!keys.has(forbidden), `${relativePath}: dado comercial prematuro no JSON-LD (${forbidden})`);
    }
    check(nodesOfType(nodes, 'Offer').length === 0, `${relativePath}: Offer não pode existir durante a prototipagem`);
  }
}

const collectionsStructuredNodes = structuredNodes('colecoes/index.html');
const collectionPages = nodesOfType(collectionsStructuredNodes, 'CollectionPage');
check(collectionPages.length === 1 && collectionPages[0].isPartOf?.['@id'] === websiteStructuredId, 'Coleções: CollectionPage ausente ou fora do WebSite');
checkBreadcrumb(collectionsStructuredNodes, 2, `${origin}/colecoes/`, 'colecoes/index.html');

const productStructuredNodes = structuredNodes(`colecoes/${projectData.collection.slug}/index.html`);
const productModels = nodesOfType(productStructuredNodes, 'ProductModel');
const productStructuredUrl = `${origin}${collectionPath}`;
check(productModels.length === 1, `${projectData.collection.name}: esperado um ProductModel`);
if (productModels.length === 1) {
  const model = productModels[0];
  check(model['@id'] === `${productStructuredUrl}#model` && model.url === productStructuredUrl, `${projectData.collection.name}: identidade do ProductModel incorreta`);
  check(model.brand?.['@id'] === brandStructuredId, `${projectData.collection.name}: ProductModel não referencia a marca`);
  check(model.mainEntityOfPage?.['@id'] === `${productStructuredUrl}#page`, `${projectData.collection.name}: ProductModel não referencia sua WebPage`);
  check(model.width?.value === projectData.product.diameterCm && model.depth?.value === projectData.product.diameterCm && model.height?.value === projectData.product.heightCm, `${projectData.collection.name}: medidas estruturadas divergem do contrato`);
  check([model.width, model.depth, model.height].every((measure) => measure?.['@type'] === 'QuantitativeValue' && measure.unitCode === 'CMT' && measure.unitText === 'cm'), `${projectData.collection.name}: unidades estruturadas inválidas`);
  check(Array.isArray(model.image) && model.image.length === 4 && model.image.every((url) => url.startsWith(`${origin}/images/`)), `${projectData.collection.name}: imagens estruturadas ausentes ou externas`);
  check(model.additionalProperty?.some((property) => property.name === 'Estado comercial' && property.value.includes('ainda não está à venda')), `${projectData.collection.name}: estado comercial transparente ausente do ProductModel`);
}
const productPages = nodesOfType(productStructuredNodes, 'WebPage');
check(productPages.length === 1 && productPages[0].mainEntity?.['@id'] === `${productStructuredUrl}#model`, `${projectData.collection.name}: WebPage não aponta para o ProductModel`);
checkBreadcrumb(productStructuredNodes, 3, productStructuredUrl, `colecoes/${projectData.collection.slug}/index.html`);

const notebookStructuredNodes = structuredNodes('caderno/index.html');
const notebookPages = nodesOfType(notebookStructuredNodes, 'WebPage');
check(notebookPages.length === 1 && notebookPages[0].version === projectData.documents.notebookVersion && notebookPages[0].dateModified === projectData.documents.updatedAtIso, 'Caderno: versão ou data ausente do WebPage estruturado');
checkBreadcrumb(notebookStructuredNodes, 2, `${origin}/caderno/`, 'caderno/index.html');

check(projectData.edition.runSize >= 2, 'Contrato do projeto: a tiragem precisa comportar início e encerramento');
check(projectData.edition.producedPieces >= 0 && projectData.edition.producedPieces <= projectData.edition.runSize, 'Contrato do projeto: quantidade produzida inválida');
check(projectData.edition.commercialStatus === 'prototyping', 'Contrato do projeto: estado comercial mudou sem uma regra de publicação correspondente');
check(new Set(projectData.proofBodies.map((item) => item.code)).size === projectData.proofBodies.length, 'Contrato do projeto: códigos de corpos de prova repetidos');
check(new Set(projectData.prototypeGate.map((item) => item.code)).size === projectData.prototypeGate.length, 'Contrato do projeto: códigos do Portão repetidos');
check(/^\d+\.\d+$/.test(projectData.documents.notebookVersion), 'Contrato do projeto: versão do Caderno não segue o formato numérico');
check(new Set(decisionLog.map((item) => item.code)).size === decisionLog.length, 'Contrato do projeto: códigos do registro de decisões repetidos');
check(decisionLog.every((item) => ['Confirmada', 'Em teste', 'Aguardando 00', 'Em vigor'].includes(item.state)), 'Contrato do projeto: estado desconhecido no registro de decisões');
check(decisionLog.every((item) => !/[{}]/.test(item.decision) && !/[{}]/.test(item.record)), 'Contrato do projeto: marcador não resolvido no registro de decisões');
for (const relativePath of ['app/components/home-page.tsx', 'app/colecoes/nordica-yggdrasil/page.tsx', 'app/caderno/page.tsx', 'app/caderno/ficha-00/page.tsx', 'app/caderno/cotacao-tampo/page.tsx']) {
  const source = readFileSync(join(root, relativePath), 'utf8');
  check(source.includes("lib/project'"), `${relativePath}: consumidor deixou de usar a fonte única do projeto`);
}
for (const relativePath of ['app/layout.tsx', 'app/manifest.ts', 'app/lib/site.ts', 'app/lib/structured-data.ts', 'app/components/brand-logo.tsx', 'app/components/site-header.tsx', 'app/components/footer.tsx', 'app/caderno/marca/page.tsx']) {
  const source = readFileSync(join(root, relativePath), 'utf8');
  check(/brand'/.test(source), `${relativePath}: consumidor deixou de usar o contrato da marca`);
}
check(brandData.name.includes(brandData.shortName) && brandData.editionLabel && brandData.slogan && brandData.locale === 'pt-BR', 'Contrato da marca: identidade verbal incompleta');
check(new Set(Object.values(brandData.palette).map((color) => color.hex.toLowerCase())).size === Object.keys(brandData.palette).length, 'Contrato da marca: cores repetidas');
check(Object.values(brandData.palette).every((color) => /^#[0-9A-F]{6}$/.test(color.hex) && color.name && color.use), 'Contrato da marca: cor, nome ou uso inválido');
check(Object.values(brandData.assets).every((asset) => asset.startsWith('/') && existsSync(join(root, asset === '/icon.png' ? 'app/icon.png' : `public${asset}`))), 'Contrato da marca: ativo oficial ausente');

const exportedHtmlFiles = listFiles(output).filter((file) => file.endsWith('.html'));
const documentCache = new Map();
const internalOrigin = new URL(origin).origin;
let checkedInternalReferences = 0;
let checkedSemanticElements = 0;

function attributeValue(tag, name) {
  return tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1];
}

function readableText(fragment) {
  return fragment
    .replace(/<svg\b[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|amp|quot|apos|#x?[0-9a-f]+);/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasAccessibleName(openingTag, content) {
  if (attributeValue(openingTag, 'aria-label')?.trim()) return true;
  if (attributeValue(openingTag, 'aria-labelledby')?.trim()) return true;
  if (readableText(content)) return true;
  if ([...content.matchAll(/\salt="([^"]+)"/gi)].some((match) => match[1].trim())) return true;
  return /<svg\b[^>]*(?:aria-label="[^"]+"|role="img")[^>]*>/i.test(content);
}

function exportedRelativePath(url) {
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    failures.push(`URL interna inválida: ${url.pathname}`);
    return null;
  }
  if (pathname === basePath || pathname === `${basePath}/`) return 'index.html';
  let relativeUrl;
  if (pathname.startsWith(`${basePath}/`)) {
    relativeUrl = pathname.slice(basePath.length + 1);
  } else if (!exportedBasePath && pathname.startsWith('/')) {
    relativeUrl = pathname.slice(1);
  } else {
    return null;
  }
  if (!relativeUrl || relativeUrl.endsWith('/')) return `${relativeUrl}index.html`;
  if (existsSync(join(output, ...relativeUrl.split('/')))) return relativeUrl;
  return `${relativeUrl}/index.html`;
}

function visibleDocument(relativePath) {
  if (!documentCache.has(relativePath)) {
    const html = readFileSync(join(output, relativePath), 'utf8');
    const visible = withoutRscMarkers(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ''));
    const ids = [...visible.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    documentCache.set(relativePath, { visible, ids, idSet: new Set(ids) });
  }
  return documentCache.get(relativePath);
}

function checkInternalReference(rawValue, sourceRelativePath) {
  const value = rawValue.replaceAll('&amp;', '&');
  if (/^(?:mailto:|tel:|data:|blob:)/i.test(value)) return;
  if (/^javascript:/i.test(value)) {
    failures.push(`${sourceRelativePath}: referência javascript: não permitida`);
    return;
  }
  const sourceRoute = sourceRelativePath === 'index.html'
    ? '/'
    : `/${sourceRelativePath.replace(/index\.html$/, '').replaceAll('\\', '/')}`;
  let url;
  try {
    url = new URL(value, `${internalOrigin}${exportedBasePath}${sourceRoute}`);
  } catch {
    failures.push(`${sourceRelativePath}: referência inválida ${rawValue}`);
    return;
  }
  if (url.origin !== internalOrigin) return;
  const targetRelativePath = exportedRelativePath(url);
  if (!targetRelativePath) {
    failures.push(`${sourceRelativePath}: referência saiu do basePath ${rawValue}`);
    return;
  }
  checkedInternalReferences += 1;
  const targetPath = join(output, ...targetRelativePath.split('/'));
  check(existsSync(targetPath), `${sourceRelativePath}: destino interno ausente ${rawValue} → out/${targetRelativePath}`);
  if (!existsSync(targetPath) || !url.hash || !targetRelativePath.endsWith('.html')) return;
  const fragment = decodeURIComponent(url.hash.slice(1));
  if (fragment) check(visibleDocument(targetRelativePath).idSet.has(fragment), `${sourceRelativePath}: fragmento ausente ${rawValue}`);
}

for (const file of exportedHtmlFiles) {
  const sourceRelativePath = pathRelative(output, file).replaceAll('\\', '/');
  const document = visibleDocument(sourceRelativePath);
  check(document.ids.length === document.idSet.size, `${sourceRelativePath}: IDs duplicados no conteúdo visível`);
  for (const match of document.visible.matchAll(/\s(?:href|src|poster)="([^"]+)"/g)) {
    checkInternalReference(match[1], sourceRelativePath);
  }
  for (const match of document.visible.matchAll(/\ssrcset="([^"]+)"/gi)) {
    for (const candidate of match[1].split(',')) checkInternalReference(candidate.trim().split(/\s+/)[0], sourceRelativePath);
  }
  for (const relation of ['aria-controls', 'aria-describedby', 'aria-labelledby', 'for']) {
    for (const match of document.visible.matchAll(new RegExp(`\\s${relation}="([^"]+)"`, 'g'))) {
      for (const id of match[1].trim().split(/\s+/)) check(document.idSet.has(id), `${sourceRelativePath}: ${relation} aponta para ID ausente #${id}`);
    }
  }

  const mainCount = (document.visible.match(/<main\b/gi) ?? []).length;
  check(mainCount === 1, `${sourceRelativePath}: esperado um landmark main, encontrado ${mainCount}`);
  const headings = [...document.visible.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)];
  check(headings.filter((heading) => heading[1] === '1').length === 1, `${sourceRelativePath}: esperado exatamente um h1 no documento completo`);
  let previousHeadingLevel = 0;
  for (const heading of headings) {
    const level = Number(heading[1]);
    check(Boolean(readableText(heading[2])), `${sourceRelativePath}: heading h${level} sem texto acessível`);
    if (previousHeadingLevel) check(level <= previousHeadingLevel + 1, `${sourceRelativePath}: salto de heading h${previousHeadingLevel} → h${level}`);
    previousHeadingLevel = level;
    checkedSemanticElements += 1;
  }
  for (const match of document.visible.matchAll(/<img\b[^>]*>/gi)) {
    const alt = attributeValue(match[0], 'alt');
    check(alt !== undefined, `${sourceRelativePath}: imagem sem atributo alt`);
    if (alt === '') check(/(?:aria-hidden="true"|role="presentation")/i.test(match[0]), `${sourceRelativePath}: imagem com alt vazio sem semântica decorativa`);
    checkedSemanticElements += 1;
  }
  for (const match of document.visible.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const openingTag = `<button${match[1]}>`;
    check(hasAccessibleName(openingTag, match[2]), `${sourceRelativePath}: botão sem nome acessível`);
    check(Boolean(attributeValue(openingTag, 'type')), `${sourceRelativePath}: botão sem type explícito`);
    checkedSemanticElements += 1;
  }
  for (const match of document.visible.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const openingTag = `<a${match[1]}>`;
    check(Boolean(attributeValue(openingTag, 'href')), `${sourceRelativePath}: link sem href`);
    check(hasAccessibleName(openingTag, match[2]), `${sourceRelativePath}: link sem nome acessível`);
    if (attributeValue(openingTag, 'target') === '_blank') check(/\srel="[^"]*noopener/i.test(openingTag), `${sourceRelativePath}: target="_blank" sem rel="noopener"`);
    checkedSemanticElements += 1;
  }
  for (const match of document.visible.matchAll(/<nav\b[^>]*>/gi)) {
    check(Boolean(attributeValue(match[0], 'aria-label') || attributeValue(match[0], 'aria-labelledby')), `${sourceRelativePath}: navegação sem nome acessível`);
    checkedSemanticElements += 1;
  }
  for (const match of document.visible.matchAll(/<svg\b[^>]*>/gi)) {
    check(/(?:aria-hidden="true"|role="img")/i.test(match[0]), `${sourceRelativePath}: SVG sem estado decorativo ou papel de imagem`);
    if (/role="img"/i.test(match[0])) check(Boolean(attributeValue(match[0], 'aria-label') || attributeValue(match[0], 'aria-labelledby')), `${sourceRelativePath}: SVG informativo sem nome acessível`);
    checkedSemanticElements += 1;
  }
  for (const match of document.visible.matchAll(/<(?:input|select|textarea)\b[^>]*>/gi)) {
    const type = attributeValue(match[0], 'type');
    if (type === 'hidden') continue;
    const id = attributeValue(match[0], 'id');
    const preceding = document.visible.slice(0, match.index);
    const wrapped = preceding.lastIndexOf('<label') > preceding.lastIndexOf('</label>');
    const explicit = id ? new RegExp(`<label\\b[^>]*for="${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'i').test(document.visible) : false;
    const ariaNamed = Boolean(attributeValue(match[0], 'aria-label') || attributeValue(match[0], 'aria-labelledby'));
    check(wrapped || explicit || ariaNamed, `${sourceRelativePath}: controle de formulário sem label (${attributeValue(match[0], 'name') ?? id ?? match[0]})`);
    checkedSemanticElements += 1;
  }
  check(!/\stabindex="[1-9][0-9]*"/i.test(document.visible), `${sourceRelativePath}: tabindex positivo altera a ordem natural de foco`);
}

check(exportedHtmlFiles.length >= routes.length + 3, `rastreador: quantidade inesperada de documentos HTML (${exportedHtmlFiles.length})`);
check(checkedInternalReferences >= 290, `rastreador: poucas referências internas verificadas (${checkedInternalReferences})`);
check(checkedSemanticElements >= 330, `acessibilidade: poucos elementos semânticos verificados (${checkedSemanticElements})`);
check(checkedStructuredNodes >= 27, `SEO: poucos nós estruturados verificados (${checkedStructuredNodes})`);

if (failures.length) {
  console.error(`Verificação estática falhou (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Verificação estática aprovada: ${routes.length} rotas, ${exportedHtmlFiles.length} documentos, ${checkedInternalReferences} referências internas, ${checkedSemanticElements} elementos semânticos e ${checkedStructuredNodes} nós JSON-LD; metadados sociais, acessibilidade, SEO, mídia responsiva e orçamentos de JavaScript, CSS, fontes e imagens.`);
