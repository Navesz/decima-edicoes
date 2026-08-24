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
const imageData = JSON.parse(readFileSync(join(root, 'app', 'lib', 'image-data.json'), 'utf8'));
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

function relativeLuminance(hex) {
  const channels = hex.match(/[0-9a-f]{2}/gi)?.map((channel) => Number.parseInt(channel, 16) / 255) ?? [];
  const linear = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(foreground, background) {
  const luminances = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (luminances[0] + 0.05) / (luminances[1] + 0.05);
}

function formattedContrastRatio(value) {
  return `${value.toFixed(2).replace('.', ',')}:1`;
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
  { file: 'index.html', title: `${brandData.name} — ${brandData.slogan}`, canonical: `${origin}/`, social: `${origin}/og.jpg`, scriptBudgetKiB: 580, cssBudgetKiB: 40, currentPath: '/', currentCount: 1 },
  { file: 'colecoes/index.html', title: `Coleções · ${brandData.shortName}`, canonical: `${origin}/colecoes/`, social: `${origin}/social/collections.jpg`, scriptBudgetKiB: 600, cssBudgetKiB: 40, currentPath: '/colecoes/', currentCount: 2 },
  { file: `colecoes/${projectData.collection.slug}/index.html`, title: `${projectData.collection.family} — ${projectData.collection.name} · ${brandData.shortName}`, canonical: `${origin}${collectionPath}`, social: `${origin}/social/yggdrasil.jpg`, scriptBudgetKiB: 600, cssBudgetKiB: 40, currentPath: '/colecoes/', currentCount: 2 },
  { file: 'caderno/index.html', title: `Caderno do Atelier · ${brandData.shortName}`, canonical: `${origin}/caderno/`, social: `${origin}/social/caderno.jpg`, scriptBudgetKiB: 600, cssBudgetKiB: 40, currentPath: '/caderno/', currentCount: 2 },
  { file: 'caderno/certificado-modelo/index.html', title: `Modelo de Certificado de Edição · ${brandData.shortName}`, canonical: `${origin}/caderno/certificado-modelo/`, scriptBudgetKiB: 600, cssBudgetKiB: 46, responsiveImages: false, sitemap: false, currentPath: '/caderno/', currentCount: 2 },
  { file: 'caderno/cotacao-tampo/index.html', title: `Briefing de Cotação do Tampo · ${brandData.shortName}`, canonical: `${origin}/caderno/cotacao-tampo/`, scriptBudgetKiB: 600, cssBudgetKiB: 46, responsiveImages: false, sitemap: false, currentPath: '/caderno/', currentCount: 2 },
  { file: 'caderno/marca/index.html', title: `Guia de Marca · ${brandData.shortName}`, canonical: `${origin}/caderno/marca/`, scriptBudgetKiB: 600, cssBudgetKiB: 54, responsiveImages: false, sitemap: false, currentPath: '/caderno/', currentCount: 2 },
  { file: 'caderno/ficha-00/index.html', title: `Ficha do Protótipo ${prototypeNumber} · ${brandData.shortName}`, canonical: `${origin}/caderno/ficha-00/`, scriptBudgetKiB: 600, cssBudgetKiB: 48, responsiveImages: false, sitemap: false, currentPath: '/caderno/', currentCount: 2 },
];

function initialScriptSources(html) {
  return [...new Set([...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((match) => match[1]))];
}

function initialScriptBytes(html) {
  return initialScriptSources(html).reduce((total, src) => {
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
  check(html.includes(`<link rel="apple-touch-icon" href="${exportedBasePath}${brandData.assets.icon}"`), `${route.file}: ícone Apple ausente ou fora do basePath`);
  check(html.includes(`<meta name="theme-color" content="${brandData.palette.ink.hex}"`), `${route.file}: cor de navegador da marca ausente`);
  check(html.includes('<meta name="mobile-web-app-capable" content="yes"'), `${route.file}: modo instalável não declarado`);
  check(html.includes('<meta name="format-detection" content="telephone=no"'), `${route.file}: detecção automática de telefone não foi desativada`);
  check(visibleHtml.includes('class="skip-link"'), `${route.file}: atalho para conteúdo ausente`);
  check(visibleHtml.includes('id="conteudo"'), `${route.file}: destino do atalho ausente`);
  check(h1Count === 1, `${route.file}: esperado um h1, encontrado ${h1Count}`);
  check(!visibleHtml.includes('style="opacity:0'), `${route.file}: conteúdo essencial nasce invisível`);
  check(html.includes('aria-expanded="false"'), `${route.file}: estado acessível do menu ausente`);
  const currentLinks = [...visibleHtml.matchAll(/<a\b[^>]*aria-current="page"[^>]*>/gi)].map((match) => match[0]);
  const expectedCurrentHref = `${exportedBasePath}${route.currentPath}`;
  check(currentLinks.length === route.currentCount, `${route.file}: esperados ${route.currentCount} indicadores de página atual, encontrados ${currentLinks.length}`);
  check(currentLinks.every((tag) => tag.includes(`href="${expectedCurrentHref}"`)), `${route.file}: indicador de página atual aponta para área incorreta`);
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
  ...Object.values(brandData.assets).map((asset) => asset.replace(/^\//, '')),
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
check(manifest.dir === 'ltr', 'manifest.webmanifest: direção de leitura pt-BR ausente');
check(manifest.display === 'standalone', 'manifest.webmanifest: apresentação instalável deve ser standalone');
check(manifest.background_color === brandData.palette.ink.hex && manifest.theme_color === brandData.palette.ink.hex, 'manifest.webmanifest: cores divergem da identidade');
const expectedShortcuts = [
  { name: 'Ver coleções DÉCIMA', shortName: 'Coleções', url: `${exportedBasePath}/colecoes/` },
  { name: 'Abrir o Caderno do Atelier', shortName: 'Caderno', url: `${exportedBasePath}/caderno/` },
];
check(Array.isArray(manifest.shortcuts) && manifest.shortcuts.length === expectedShortcuts.length, `manifest.webmanifest: esperados ${expectedShortcuts.length} atalhos instalados`);
for (const shortcut of expectedShortcuts) {
  const published = manifest.shortcuts?.find((item) => item.name === shortcut.name);
  check(published?.short_name === shortcut.shortName && published?.url === shortcut.url && typeof published?.description === 'string' && published.description.length >= 20, `manifest.webmanifest: atalho ${shortcut.shortName} ausente ou incompleto`);
  check(published?.url?.startsWith(manifest.scope), `manifest.webmanifest: atalho ${shortcut.shortName} saiu do escopo`);
}
check(Array.isArray(manifest.icons) && manifest.icons.some((icon) => icon.src === `${exportedBasePath}${brandData.assets.icon}` && icon.sizes === '512x512' && icon.type === 'image/png'), 'manifest.webmanifest: ícone 512×512 ausente ou incorreto');
check(manifest.icons.some((icon) => icon.src === `${exportedBasePath}${brandData.assets.maskableIcon}` && icon.sizes === '512x512' && icon.type === 'image/png' && icon.purpose === 'maskable'), 'manifest.webmanifest: ícone mascarável ausente ou incorreto');
const iconMetadata = await sharp(join(output, brandData.assets.icon.replace(/^\//, ''))).metadata();
check(iconMetadata.width === 512 && iconMetadata.height === 512 && iconMetadata.format === 'png', 'icon.png: dimensão ou formato diverge do manifesto');
const maskablePath = join(output, brandData.assets.maskableIcon.replace(/^\//, ''));
const maskableMetadata = await sharp(maskablePath).metadata();
const maskableStats = await sharp(maskablePath).stats();
check(maskableMetadata.width === 512 && maskableMetadata.height === 512 && maskableMetadata.format === 'png' && maskableStats.isOpaque, 'ícone mascarável: dimensão, formato ou fundo opaco inválido');
const logoGeneratorSource = readFileSync(join(root, 'scripts', 'generate-logo.mjs'), 'utf8');
check(logoGeneratorSource.includes('const maskableIcon') && logoGeneratorSource.includes('<rect width="512" height="512" fill="#171411"/>') && logoGeneratorSource.includes("output('decima-maskable.png')"), 'ícone mascarável: fonte reproduzível ausente');

const publicImages = readdirSync(join(output, 'images')).filter((file) => /\.(webp|avif|jpe?g|png)$/i.test(file));
const publicImageBytes = publicImages.reduce((total, file) => {
  const bytes = statSync(join(output, 'images', file)).size;
  const budgetKiB = /-(480|800)\.webp$/i.test(file) ? 200 : 450;
  check(bytes <= budgetKiB * 1024, `imagem acima de ${budgetKiB} KiB: ${file} (${(bytes / 1024).toFixed(0)} KiB)`);
  return total + bytes;
}, 0);
const sourceImages = publicImages.filter((file) => /\.webp$/i.test(file) && !/-\d+\.webp$/i.test(file));
check(JSON.stringify(Object.keys(imageData).sort()) === JSON.stringify(sourceImages.sort()), 'contrato de imagens: inventário diverge dos WebPs mestres publicados');
for (const file of sourceImages) {
  const stem = file.replace(/\.webp$/i, '');
  const sourceMetadata = await sharp(join(output, 'images', file)).metadata();
  check(imageData[file]?.width === sourceMetadata.width && imageData[file]?.height === sourceMetadata.height, `contrato de imagens: dimensões divergentes em ${file}`);
  for (const width of [480, 800]) {
    const variant = `${stem}-${width}.webp`;
    check(publicImages.includes(variant), `variante ausente: ${variant}`);
    if (!publicImages.includes(variant)) continue;
    const variantMetadata = await sharp(join(output, 'images', variant)).metadata();
    const sourceRatio = sourceMetadata.width / sourceMetadata.height;
    const variantRatio = variantMetadata.width / variantMetadata.height;
    check(variantMetadata.width === width, `variante ${variant}: largura deveria ser ${width}px`);
    check(Math.abs(sourceRatio - variantRatio) <= 0.002, `variante ${variant}: proporção diverge do mestre`);
  }
}
check(publicImageBytes <= 4 * 1024 * 1024, `mídia pública excede 4 MiB: ${(publicImageBytes / 1024 / 1024).toFixed(2)} MiB`);
check(statSync(join(output, 'og.jpg')).size <= 200 * 1024, 'og.jpg excede 200 KiB');

const responsiveImageSource = readFileSync(join(root, 'app', 'components', 'responsive-image.tsx'), 'utf8');
const imageOptimizerSource = readFileSync(join(root, 'scripts', 'optimize-images.mjs'), 'utf8');
check(responsiveImageSource.includes("import imageData from '../lib/image-data.json'") && responsiveImageSource.includes('width={dimensions?.width}') && responsiveImageSource.includes('height={dimensions?.height}'), 'imagens responsivas: componente deixou de publicar dimensões do contrato');
check(imageOptimizerSource.includes("'image-data.json'") && imageOptimizerSource.includes('JSON.stringify(imageData, null, 2)'), 'imagens responsivas: otimizador deixou de atualizar o contrato dimensional');

const homePageSource = readFileSync(join(root, 'app', 'components', 'home-page.tsx'), 'utf8');
const motionArticleLoaderSource = readFileSync(join(root, 'app', 'components', 'motion-article-loader.tsx'), 'utf8');
const motionArticleSource = readFileSync(join(root, 'app', 'components', 'motion-article.tsx'), 'utf8');
const motionFeaturesSource = readFileSync(join(root, 'app', 'components', 'motion-features.ts'), 'utf8');
const clientCapabilitiesSource = readFileSync(join(root, 'app', 'lib', 'client-capabilities.ts'), 'utf8');
check(!homePageSource.startsWith("'use client'") && !homePageSource.includes("from 'framer-motion'") && homePageSource.includes('<MotionArticleLoader'), 'home: página inteira voltou a depender do Framer no cliente');
check(motionArticleLoaderSource.includes("import('./motion-article')") && motionArticleLoaderSource.includes('IntersectionObserver') && motionArticleLoaderSource.includes("rootMargin: '320px 0px'") && motionArticleLoaderSource.includes('threshold: .01'), 'home: fachada dos cartões perdeu importação dinâmica ou gatilho por proximidade');
check(motionArticleLoaderSource.includes('prefersReducedMotion()') && motionArticleLoaderSource.includes('shouldAvoidOptionalTransfer()') && motionArticleLoaderSource.includes('usesCoarsePointer()') && motionArticleLoaderSource.includes('data-motion-mode="static"'), 'home: fachada dos cartões não preserva modo estático por capacidade');
check(motionArticleSource.includes('LazyMotion') && motionArticleSource.includes("from 'framer-motion/m'") && motionArticleSource.includes("import('./motion-features')") && motionArticleSource.includes('useReducedMotion') && motionArticleSource.includes('strict'), 'home: ilha de movimento perdeu carregamento mínimo, preferência reduzida ou modo estrito');
check(motionArticleSource.includes('data-motion-mode="active"') && motionFeaturesSource.includes('domAnimation as default'), 'home: modo ativo ou pacote assíncrono de recursos do Framer ausente');
check(clientCapabilitiesSource.includes('(prefers-reduced-motion: reduce)') && clientCapabilitiesSource.includes('(prefers-reduced-data: reduce)') && clientCapabilitiesSource.includes('(pointer: coarse)') && clientCapabilitiesSource.includes('(hover: none)'), 'capacidades do cliente: preferências ou modos de entrada ausentes');
check(clientCapabilitiesSource.includes('connection?.saveData === true') && clientCapabilitiesSource.includes("'slow-2g'") && clientCapabilitiesSource.includes("'2g'"), 'capacidades do cliente: economia de dados ou conexão limitada ausente');
check(clientCapabilitiesSource.includes("typeof window !== 'undefined'") && clientCapabilitiesSource.includes("typeof navigator === 'undefined'"), 'capacidades do cliente: acesso ao navegador não está protegido');
const smoothScrollSource = readFileSync(join(root, 'app', 'components', 'smooth-scroll.tsx'), 'utf8');
check(smoothScrollSource.includes("import('lenis')") && smoothScrollSource.includes('requestIdleCallback') && smoothScrollSource.includes('timeout: 1600') && smoothScrollSource.includes('setTimeout(() => void start(), 900)'), 'rolagem suave: importação dinâmica ou agendamento ocioso ausente');
check(smoothScrollSource.includes('prefersReducedMotion()') && smoothScrollSource.includes('shouldAvoidOptionalTransfer()') && smoothScrollSource.includes('usesCoarsePointer()'), 'rolagem suave: contrato compartilhado de capacidades não controla a versão nativa');
check(smoothScrollSource.includes("dataset.smoothScroll = 'active'") && smoothScrollSource.includes('delete document.documentElement.dataset.smoothScroll'), 'rolagem suave: estado observável ou limpeza ausente');
const scrollEffectsSource = readFileSync(join(root, 'app', 'components', 'scroll-effects.tsx'), 'utf8');
check(scrollEffectsSource.includes("import('gsap')") && scrollEffectsSource.includes("import('gsap/ScrollTrigger')") && scrollEffectsSource.includes('IntersectionObserver'), 'efeitos de rolagem: importações dinâmicas ou gatilho por proximidade ausente');
check(scrollEffectsSource.includes('prefersReducedMotion()') && scrollEffectsSource.includes('shouldAvoidOptionalTransfer()'), 'efeitos de rolagem: contrato compartilhado de capacidades não preserva conteúdo estático');
check(scrollEffectsSource.includes("rootMargin: '320px 0px'") && scrollEffectsSource.includes('threshold: .01') && scrollEffectsSource.includes("dataset.scrollEffects = 'active'") && scrollEffectsSource.includes('delete document.documentElement.dataset.scrollEffects'), 'efeitos de rolagem: margem de aproximação, estado ou limpeza ausente');
const interestFormLoaderSource = readFileSync(join(root, 'app', 'components', 'interest-form-loader.tsx'), 'utf8');
const interestFormSource = readFileSync(join(root, 'app', 'components', 'interest-form.tsx'), 'utf8');
check(homePageSource.includes('<InterestFormLoader') && !homePageSource.includes("from './interest-form'"), 'interesse: home voltou a importar diretamente o formulário ativo');
check(interestFormLoaderSource.includes("import('./interest-form')") && interestFormLoaderSource.includes('IntersectionObserver'), 'interesse: carregamento deixou de ser assíncrono ou orientado por proximidade');
check(interestFormLoaderSource.includes("rootMargin: '360px 0px'") && interestFormLoaderSource.includes('threshold: .01') && interestFormLoaderSource.includes('data-interest-mode="static"'), 'interesse: margem, limiar ou fachada estática ausente');
check(interestFormLoaderSource.includes("!('IntersectionObserver' in window)") && interestFormLoaderSource.includes('queueMicrotask(() => setEnhance(true))'), 'interesse: navegador sem observador não recebe a alternativa funcional');
check(interestFormSource.includes('data-interest-mode="active"') && interestFormSource.includes('defaultInterest'), 'interesse: formulário ativo perdeu estado observável ou seleção recebida do servidor');
const siteHeaderSource = readFileSync(join(root, 'app', 'components', 'site-header.tsx'), 'utf8');
check(siteHeaderSource.includes("type CurrentSection = 'home' | 'collections' | 'notebook'") && siteHeaderSource.includes("aria-current={current === 'home' ? 'page' : undefined}"), 'navegação: contrato de área atual ou indicação da home ausente');
check((siteHeaderSource.match(/aria-current=/g) ?? []).length === 3 && siteHeaderSource.includes("section === current ? 'page' : undefined"), 'navegação: desktop e menu móvel não compartilham o estado atual');

const staticDirectory = join(output, '_next', 'static');
const cssDirectory = join(staticDirectory, 'chunks');
const mediaDirectory = join(staticDirectory, 'media');
const cssFiles = readdirSync(cssDirectory).filter((file) => file.endsWith('.css'));
const fontFiles = readdirSync(mediaDirectory).filter((file) => /\.woff2?$/i.test(file));
const fontBytes = fontFiles.reduce((total, file) => total + statSync(join(mediaDirectory, file)).size, 0);
check(cssFiles.length <= 5, `esperados no máximo cinco pacotes CSS, encontrados ${cssFiles.length}`);
check(fontFiles.length === 5 && fontFiles.every((file) => file.endsWith('.woff2')), `esperadas 5 fontes WOFF2, encontrados ${fontFiles.length} arquivos`);
check(fontBytes <= 100 * 1024, `fontes excedem 100 KiB: ${(fontBytes / 1024).toFixed(1)} KiB`);

const javascriptFiles = readdirSync(cssDirectory).filter((file) => file.endsWith('.js'));
const allInitialScripts = new Set(routes.flatMap((route) => initialScriptSources(read(route.file)).map((source) => source.split('/').at(-1))));
const finishLabChunks = javascriptFiles.filter((file) => {
  const source = readFileSync(join(cssDirectory, file), 'utf8');
  return source.includes('Fosco absoluto') && source.includes('Brilho percebido');
});
const notebookInitialScripts = new Set(initialScriptSources(read('caderno/index.html')).map((source) => source.split('/').at(-1)));
check(finishLabChunks.length >= 1, 'laboratório 3D: pacote assíncrono não foi identificado no build');
check(finishLabChunks.every((file) => !notebookInitialScripts.has(file)), 'laboratório 3D: pacote pesado voltou ao carregamento inicial do Caderno');
const lenisChunks = javascriptFiles.filter((file) => {
  const source = readFileSync(join(cssDirectory, file), 'utf8');
  return source.includes('lenisVersion') && source.includes('virtualScroll') && source.includes('actualScroll');
});
check(lenisChunks.length === 1, `rolagem suave: esperado um pacote Lenis, encontrados ${lenisChunks.length}`);
check(lenisChunks.every((file) => !allInitialScripts.has(file)), 'rolagem suave: biblioteca Lenis voltou aos scripts iniciais');
const gsapCoreChunks = javascriptFiles.filter((file) => {
  const source = readFileSync(join(cssDirectory, file), 'utf8');
  return source.includes('globalTimeline') && source.includes('registerPlugin');
});
const scrollTriggerChunks = javascriptFiles.filter((file) => {
  const source = readFileSync(join(cssDirectory, file), 'utf8');
  return source.includes('normalizeScroll') && source.includes('refreshInit');
});
const gsapDeferredBytes = [...gsapCoreChunks, ...scrollTriggerChunks].reduce((total, file) => total + statSync(join(cssDirectory, file)).size, 0);
check(gsapCoreChunks.length === 1 && scrollTriggerChunks.length === 1, `efeitos de rolagem: esperados GSAP e ScrollTrigger separados, encontrados ${gsapCoreChunks.length}/${scrollTriggerChunks.length}`);
check([...gsapCoreChunks, ...scrollTriggerChunks].every((file) => !allInitialScripts.has(file)), 'efeitos de rolagem: GSAP ou ScrollTrigger voltou aos scripts iniciais');
check(gsapDeferredBytes <= 120 * 1024, `efeitos de rolagem: pacotes assíncronos excedem 120 KiB (${(gsapDeferredBytes / 1024).toFixed(1)} KiB)`);
const framerDeferredChunks = javascriptFiles.filter((file) => readFileSync(join(cssDirectory, file), 'utf8').includes('whileHover'));
const framerDeferredBytes = framerDeferredChunks.reduce((total, file) => total + statSync(join(cssDirectory, file)).size, 0);
check(framerDeferredChunks.length >= 3 && framerDeferredChunks.every((file) => !allInitialScripts.has(file)), 'home: ilha ou recursos do Framer voltaram aos scripts iniciais');
check(framerDeferredBytes <= 90 * 1024, `home: pacotes assíncronos do Framer excedem 90 KiB (${(framerDeferredBytes / 1024).toFixed(1)} KiB)`);
const interestFormChunks = javascriptFiles.filter((file) => {
  const source = readFileSync(join(cssDirectory, file), 'utf8');
  return source.includes('Fluxo de interesse concluído.') && source.includes('Voltar ao formulário');
});
const interestFormDeferredBytes = interestFormChunks.reduce((total, file) => total + statSync(join(cssDirectory, file)).size, 0);
check(interestFormChunks.length === 1 && interestFormChunks.every((file) => !allInitialScripts.has(file)), 'interesse: formulário ativo voltou aos scripts iniciais');
check(interestFormDeferredBytes <= 10 * 1024, `interesse: pacote assíncrono excede 10 KiB (${(interestFormDeferredBytes / 1024).toFixed(1)} KiB)`);

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
const finishLabLoaderSource = readFileSync(join(root, 'app', 'components', 'finish-lab-loader.tsx'), 'utf8');
const finishLabSource = readFileSync(join(root, 'app', 'components', 'finish-lab.tsx'), 'utf8');
const finishLabLoaderCss = readFileSync(join(root, 'app', 'components', 'finish-lab-loader.module.css'), 'utf8');
check(finishLabLoaderSource.includes("import('./finish-lab')") && finishLabLoaderSource.includes('IntersectionObserver'), 'laboratório 3D: carregamento progressivo deixou de ser assíncrono ou orientado por visibilidade');
check(finishLabLoaderSource.includes('supportsWebGL') && finishLabLoaderSource.includes("getContext('webgl2')") && finishLabLoaderSource.includes("getContext('webgl')"), 'laboratório 3D: detecção de WebGL ausente');
check(finishLabLoaderSource.includes('shouldAvoidOptionalTransfer()'), 'laboratório 3D: contrato compartilhado de economia de dados ausente');
check(finishLabLoaderSource.includes('FinishLabErrorBoundary') && finishLabLoaderSource.includes('<noscript>') && finishLabLoaderSource.includes('type="button"'), 'laboratório 3D: recuperação de erro, alternativa sem JavaScript ou controle manual ausente');
check(finishLabLoaderSource.includes("mode === 'loading' ? 'status' : undefined") && finishLabLoaderSource.includes("mode === 'loading' ? 'polite' : undefined"), 'laboratório 3D: anúncio de estado não está limitado ao carregamento');
check(finishLabSource.includes('(prefers-reduced-motion: reduce)') && finishLabSource.includes("frameloop={reduceMotion ? 'demand' : 'always'}") && finishLabSource.includes('autoRotate={!reduceMotion}'), 'laboratório 3D: preferência por movimento reduzido deixou de controlar renderização e rotação');
check(finishLabLoaderCss.includes('min-height: 44px;') && finishLabLoaderCss.includes('.noScript'), 'laboratório 3D: controle manual ou alternativa sem JavaScript perdeu estilo essencial');
const editionRegisterCss = readFileSync(join(root, 'app', 'colecoes', projectData.collection.slug, 'edition-register.module.css'), 'utf8');
check(editionRegisterCss.includes('.grid { display: grid; grid-template-columns: repeat(5,1fr);') && editionRegisterCss.includes('.grid { grid-template-columns: repeat(2,1fr);') && editionRegisterCss.includes('@media (max-width: 800px)'), 'registro público da edição perdeu grade desktop ou adaptação móvel');

const workflowSource = readFileSync(join(root, '.github', 'workflows', 'deploy-pages.yml'), 'utf8');
const pinnedActions = {
  'actions/checkout': ['d23441a48e516b6c34aea4fa41551a30e30af803', 'v6'],
  'actions/setup-node': ['249970729cb0ef3589644e2896645e5dc5ba9c38', 'v6'],
  'actions/configure-pages': ['45bfe0192ca1faeb007ade9deae92b16b8254a0d', 'v6'],
  'actions/upload-pages-artifact': ['fc324d3547104276b827a68afc52ff2a11cc49c9', 'v5'],
  'actions/deploy-pages': ['cd2ce8fcbc39b97be8ca5fce6e763baed58fa128', 'v5'],
};
const workflowUses = [...workflowSource.matchAll(/^\s*uses:\s+([^@\s]+)@([^\s#]+)(?:\s+#\s*(\S+))?/gm)];
check(workflowUses.length === Object.keys(pinnedActions).length, `workflow: esperadas ${Object.keys(pinnedActions).length} Actions, encontradas ${workflowUses.length}`);
for (const [action, [sha, version]] of Object.entries(pinnedActions)) {
  const use = workflowUses.find((match) => match[1] === action);
  check(use?.[2] === sha && /^[0-9a-f]{40}$/.test(use[2]) && use?.[3] === version, `workflow: ${action} não está fixada em ${sha} com comentário ${version}`);
}
check(workflowUses.every((use) => use[1].startsWith('actions/') && /^[0-9a-f]{40}$/.test(use[2])), 'workflow: Action externa ou referência móvel encontrada');
const jobsIndex = workflowSource.indexOf('\njobs:');
const buildIndex = workflowSource.indexOf('\n  build:', jobsIndex);
const deployIndex = workflowSource.indexOf('\n  deploy:', buildIndex);
const workflowHeader = workflowSource.slice(0, jobsIndex);
const buildJob = workflowSource.slice(buildIndex, deployIndex);
const deployJob = workflowSource.slice(deployIndex);
check(!/^permissions:/m.test(workflowHeader), 'workflow: permissões globais ampliam privilégios de todos os jobs');
check(/permissions:\s*\n\s+contents: read\s*\n\s+pages: read/.test(buildJob) && !/id-token:\s*write/.test(buildJob) && !/pages:\s*write/.test(buildJob), 'workflow: build precisa apenas de contents:read e pages:read');
check(/permissions:\s*\n\s+pages: write\s*\n\s+id-token: write/.test(deployJob) && !/contents:\s*write/.test(deployJob), 'workflow: deploy precisa limitar escrita a Pages e OIDC');
check(/needs:\s*build/.test(deployJob) && /environment:\s*\n\s+name:\s*github-pages/.test(deployJob), 'workflow: deploy precisa depender do build e usar o ambiente github-pages');

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
check(!sitemap.includes(`${origin}/404`) && !sitemap.includes(`${origin}/_not-found`), 'sitemap.xml: página de erro não pode ser indexável');

const robots = read('robots.txt');
check(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'robots.txt: sitemap ausente ou incorreto');

const home = withoutRscMarkers(read('index.html'));
const product = withoutRscMarkers(read(`colecoes/${projectData.collection.slug}/index.html`));
const notebook = withoutRscMarkers(read('caderno/index.html'));
const certificateModel = withoutRscMarkers(read('caderno/certificado-modelo/index.html'));
const topQuote = withoutRscMarkers(read('caderno/cotacao-tampo/index.html'));
const brandGuide = withoutRscMarkers(read('caderno/marca/index.html'));
const worksheet = withoutRscMarkers(read('caderno/ficha-00/index.html'));
const notFound = withoutRscMarkers(read('404.html'));
const visibleProduct = product.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
const visibleNotebook = notebook.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
const visibleCertificateModel = certificateModel.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
const visibleWorksheet = worksheet.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
const interestFormTag = home.match(/<form\b[^>]*data-local-demo[^>]*>/i)?.[0] ?? '';
const notFoundRobots = [...notFound.matchAll(/<meta name="robots" content="([^"]+)"/g)].map((match) => match[1]);
const rootLayoutSource = readFileSync(join(root, 'app', 'layout.tsx'), 'utf8');
check(!rootLayoutSource.includes('robots: { index: true'), 'layout: diretiva index explícita pode contradizer páginas de erro');
check(notFoundRobots.length === 1 && notFoundRobots[0] === 'noindex', `404: esperada uma única diretiva noindex, encontradas ${notFoundRobots.join(' | ') || 'nenhuma'}`);
check(notFound.includes(`<title>Arquivo não encontrado · ${brandData.shortName}</title>`) && notFound.includes('Este endereço não corresponde a uma edição ou página ativa'), '404: título ou descrição própria ausente');
check(notFound.includes(`<link rel="canonical" href="${origin}/404.html"`) && notFound.includes(`<meta property="og:url" content="${origin}/404.html"`), '404: canonical ou URL social herdou endereço incorreto');
check(notFound.includes(`<meta property="og:title" content="Arquivo não encontrado · ${brandData.name}"`) && notFound.includes('<meta name="twitter:card" content="summary"'), '404: metadados de compartilhamento próprios ausentes');
check(notFound.includes('Esta edição') && notFound.includes('Voltar ao início'), '404: experiência de recuperação incompleta');
check((home.match(/data-motion-mode="static"/g) ?? []).length === 3 && !home.includes('data-motion-mode="active"'), 'home: cartões não nascem como três artigos estáticos antes do Framer');
check(home.includes(`protótipo ${prototypeNumber} em desenvolvimento`), 'início: estágio conceitual não está explícito');
check(home.includes(`Estágio atual: ${numberWords[projectData.edition.producedPieces]} de ${numberWords[projectData.edition.runSize]} peças produzidas`), 'início: estágio editorial diverge do contrato do projeto');
check(home.includes(`Protocolo ${lastPieceFraction}`), 'início: protocolo editorial diverge da tiragem declarada');
check(home.includes('não cria reserva, cobrança ou direito'), 'início: limite do fluxo de interesse não está explícito');
check(interestFormTag.length > 0, 'início: formulário demonstrativo não está identificado');
check(!/\saction=/i.test(interestFormTag), 'início: demonstração não deve apontar para um destino de envio');
check(home.includes('<fieldset disabled="">'), 'início: campos devem permanecer inativos sem JavaScript');
check(home.includes('A simulação local requer JavaScript. Nenhum campo foi habilitado e nenhum dado será enviado.'), 'início: aviso sem JavaScript ausente');
check(home.includes('minLength="2"') && home.includes('type="email"'), 'início: restrições de validação do formulário ausentes');
check((home.match(/data-interest-mode="static"/g) ?? []).length === 1 && !home.includes('data-interest-mode="active"'), 'início: formulário não nasce em modo estático único');
check(product.includes(`${projectData.collection.name} ainda não está à venda`), `${projectData.collection.name}: indisponibilidade comercial não está explícita`);
check(product.includes('ProductModel'), `${projectData.collection.name}: dados estruturados devem representar um modelo, não produto disponível`);
check(product.includes(`${projectData.edition.producedPieces} produzidas`) && product.includes(`${projectData.edition.runSize} previstas`), `${projectData.collection.name}: contagem editorial diverge do contrato do projeto`);
check(product.includes(`${projectData.product.diameterCm} cm`) && product.includes(`${projectData.product.heightCm} cm`) && product.includes(`${projectData.product.topThicknessMm.minimum}–${projectData.product.topThicknessMm.maximum} mm`), `${projectData.collection.name}: dimensões de partida divergem do contrato do projeto`);
const editionRegister = visibleProduct.match(/<section[^>]+id="registro-edicao"[\s\S]*?<\/section>/)?.[0] ?? '';
check(editionRegister.includes('id="registro-edicao"') && editionRegister.includes(`${pad2(projectData.edition.producedPieces)}/${projectData.edition.runSize}`), `${projectData.collection.name}: registro público ou resumo da edição ausente`);
check((editionRegister.match(/data-piece=/g) ?? []).length === projectData.edition.runSize, `${projectData.collection.name}: registro não possui ${projectData.edition.runSize} posições`);
check((editionRegister.match(/data-state="produced"/g) ?? []).length === projectData.edition.producedPieces && (editionRegister.match(/data-state="not-produced"/g) ?? []).length === projectData.edition.runSize - projectData.edition.producedPieces, `${projectData.collection.name}: estados do registro divergem da produção real`);
for (let piece = 1; piece <= projectData.edition.runSize; piece += 1) {
  const number = pad2(piece);
  check(editionRegister.includes(`data-piece="${number}"`) && editionRegister.includes(`Peça ${number}/${projectData.edition.runSize}`), `${projectData.collection.name}: posição ${number} ausente do registro`);
}
check(editionRegister.includes('não existe objeto numerado, certificado, reserva ou propriedade') && editionRegister.includes('Nome, contato, endereço e histórico privado de custódia não serão publicados'), `${projectData.collection.name}: limites de estado ou privacidade ausentes do registro`);
check(!/Reservada|Disponível|Proprietári[oa]:/i.test(editionRegister), `${projectData.collection.name}: registro público inventa disponibilidade, reserva ou proprietário`);
check(notebook.includes(`Versão ${projectData.documents.notebookVersion}`), 'Caderno: versão do documento vivo não foi atualizada');
check(visibleNotebook.includes('data-finish-mode="idle"') && visibleNotebook.includes('Acetinado como direção.') && visibleNotebook.includes('A meta conceitual é 32%'), 'Caderno: laboratório não nasce com direção de acabamento útil');
check(visibleNotebook.includes('quatro amostras logo abaixo') && visibleNotebook.includes('<button') && visibleNotebook.includes('type="button"') && visibleNotebook.includes('Carregar simulador 3D'), 'Caderno: comparação estática ou carregamento manual do laboratório ausente');
check(visibleNotebook.includes('<noscript>') && visibleNotebook.includes('JavaScript está desativado.') && visibleNotebook.includes('fosco, acetinado, semibrilho e espelhado'), 'Caderno: alternativa sem JavaScript do laboratório ausente');
check(notebook.includes(`Só existe peça ${firstPiece} depois de ${gateItemsWord} aprovações documentadas`), `Caderno: regra do Portão ${prototypeNumber} ausente`);
check(notebook.includes('tampo inteiro, maciço, redondo, pré-cortado e pré-nivelado'), 'Caderno: especificação de partida da madeira ausente');
check((notebook.match(/data-gate=/g) ?? []).length === projectData.prototypeGate.length, `Caderno: esperado estado para as ${gateItemsWord} aprovações do Portão ${prototypeNumber}`);
check(notebook.includes('<table class="gate-table">') && notebook.includes(`<caption>${gateItemsHeading} aprovações obrigatórias`), `Caderno: matriz do Portão ${prototypeNumber} não está semanticamente estruturada`);
check(/href="(?:\/decima-edicoes)?\/caderno\/ficha-00\/?"/.test(notebook), 'Caderno: acesso à ficha do Protótipo 00 ausente');
check(/href="(?:\/decima-edicoes)?\/caderno\/certificado-modelo\/?"/.test(notebook), 'Caderno: acesso ao modelo de certificado ausente');
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
check(worksheetCss.includes('.block { break-inside: auto;') && worksheetCss.includes('.block h2 { break-after: avoid-page;'), 'documentos imprimíveis: seções não possuem paginação progressiva');
check(worksheetCss.includes('.table thead { display: table-header-group; }') && worksheetCss.includes('.table tr, .checks > div, .gate > div, .decision, .fixed, .line { break-inside: avoid; }'), 'documentos imprimíveis: cabeçalhos repetidos ou unidades indivisíveis ausentes');
check(worksheetCss.includes('orphans: 3; widows: 3;') && worksheetCss.includes('print-color-adjust: exact;') && worksheetCss.includes('-webkit-print-color-adjust: exact;'), 'documentos imprimíveis: controle tipográfico ou de cor ausente');
for (const documentHtml of [visibleCertificateModel, topQuote, visibleWorksheet]) {
  check(documentHtml.includes('Imprimir ou salvar em PDF') && documentHtml.includes('<button') && documentHtml.includes('type="button"'), 'documentos imprimíveis: ação local de impressão ausente');
}
check(topQuote.includes('<meta name="robots" content="noindex, nofollow"'), 'Cotação do tampo: bloqueio de indexação ausente');
check(!sitemap.includes(`${origin}/caderno/cotacao-tampo/`), 'Cotação do tampo: rota interna não deve entrar no sitemap público');
check(topQuote.includes(`Diâmetro final</th><td>${projectData.product.diameterCm} cm`) && topQuote.includes(`Espessura final</th><td>${projectData.product.topThicknessMm.minimum}–${projectData.product.topThicknessMm.maximum} mm`), 'Cotação do tampo: dimensões divergem do contrato do projeto');
check(topQuote.includes('uma peça contínua de madeira maciça, de uma única espécie') && topQuote.includes('Sem emenda como padrão'), 'Cotação do tampo: pedido principal não protege a peça contínua');
check(topQuote.includes('Alternativa B — cotar separadamente') && topQuote.includes('não é equivalente automática'), 'Cotação do tampo: alternativa colada não está corretamente separada');
check(topQuote.includes('mais de um ponto, com método informado') && topQuote.includes('sem estimativa verbal'), 'Cotação do tampo: evidência de umidade insuficiente');
check((topQuote.match(/Cotação [123]/g) ?? []).length === 3, 'Cotação do tampo: comparação de três fornecedores incompleta');
check(topQuote.includes('Imprimir ou salvar em PDF') && topQuote.includes('Decisão M01'), 'Cotação do tampo: ação imprimível ou decisão de matéria ausente');
check(certificateModel.includes('<meta name="robots" content="noindex, nofollow"'), 'Certificado modelo: bloqueio de indexação ausente');
check(!sitemap.includes(`${origin}/caderno/certificado-modelo/`), 'Certificado modelo: rota interna não deve entrar no sitemap público');
check(certificateModel.includes('MODELO · NÃO NUMERAR · NÃO ASSINAR') && certificateModel.includes('Nenhuma peça foi produzida'), 'Certificado modelo: bloqueio contra emissão prematura ausente');
check(certificateModel.includes(`Tiragem máxima <span>${projectData.edition.runSize} peças`) && certificateModel.includes(`Peça __/${projectData.edition.runSize}`) && certificateModel.includes(`peça ${lastPieceFraction}`), 'Certificado modelo: protocolo de tiragem diverge do contrato');
check(!certificateModel.includes(`Peça ${firstPiece}/${projectData.edition.runSize}`), 'Certificado modelo: não pode pré-atribuir a primeira numeração');
check(certificateModel.includes(`${projectData.product.diameterCm} cm de diâmetro`) && certificateModel.includes(`${projectData.product.heightCm} cm de altura`) && certificateModel.includes(`tampo de ${projectData.product.topThicknessMm.minimum}–${projectData.product.topThicknessMm.maximum} mm`), 'Certificado modelo: referência dimensional diverge do contrato');
check(certificateModel.includes('QR code sozinho não prova autenticidade') && certificateModel.includes('não transfere direito autoral') && certificateModel.includes('não deve publicar dados pessoais'), 'Certificado modelo: limites de autenticidade, autoria ou privacidade incompletos');
check(visibleCertificateModel.includes('Imprimir ou salvar em PDF') && (visibleCertificateModel.match(/□ entrega/g) ?? []).length === 4, 'Certificado modelo: impressão ou histórico de custódia incompleto');
check(brandGuide.includes('<meta name="robots" content="noindex, nofollow"'), 'Guia de Marca: bloqueio de indexação ausente');
check(!sitemap.includes(`${origin}/caderno/marca/`), 'Guia de Marca: rota interna não deve entrar no sitemap público');
check(brandGuide.includes('Sim. DÉCIMA Edições é uma direção forte.') && brandGuide.includes('não declara disponibilidade legal'), 'Guia de Marca: veredito ou limite jurídico ausente');
check(brandGuide.includes('Círculo') && brandGuide.includes('numeral romano de dez') && brandGuide.includes('Ponto'), 'Guia de Marca: significado do símbolo incompleto');
check(Object.values(brandData.assets).every((asset) => brandGuide.includes(asset)), 'Guia de Marca: ativos oficiais incompletos');
check(brandGuide.includes('Masters e ícone instalável') && brandGuide.includes('laser, CNC, gravação ou plaqueta') && brandGuide.includes('fundo carvão opaco e zona segura') && (brandGuide.match(/\sdownload=""/g) ?? []).length >= 5, 'Guia de Marca: downloads, ícone instalável ou limite de produção incompletos');
check(Object.values(brandData.palette).every((color) => brandGuide.includes(color.hex)), 'Guia de Marca: paleta oficial incompleta ou divergente');
check(brandGuide.includes('Cormorant Garamond') && brandGuide.includes('MANROPE'), 'Guia de Marca: sistema tipográfico incompleto');
check(brandGuide.includes('Nórdica — Yggdrasil') && brandGuide.includes('Peça 01/10') && brandGuide.includes('Protótipo 00'), 'Guia de Marca: sistema de nomenclatura incompleto');
check(brandGuide.includes('pesquisar sinais semelhantes') && brandGuide.includes('registro no INPI'), 'Guia de Marca: portão de validação legal incompleto');
check(brandGuide.includes('https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum'), 'Guia de Marca: referência oficial de contraste ausente');
for (const pair of [...brandData.contrast.approvedTextPairs, ...brandData.contrast.restrictedPairs]) {
  const foreground = brandData.palette[pair.foreground]?.hex;
  const background = brandData.palette[pair.background]?.hex;
  if (!foreground || !background) continue;
  const ratio = contrastRatio(foreground, background);
  check(brandGuide.includes(pair.label) && brandGuide.includes(formattedContrastRatio(ratio)), `Guia de Marca: contraste ${pair.label} ausente ou incorreto`);
}
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
  check(model.additionalProperty?.some((property) => property.name === 'Peças concluídas' && property.value === projectData.edition.producedPieces), `${projectData.collection.name}: produção real ausente do ProductModel`);
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
check(Number.isInteger(projectData.edition.producedPieces), 'Contrato do projeto: quantidade produzida precisa ser inteira');
check(projectData.edition.commercialStatus === 'prototyping', 'Contrato do projeto: estado comercial mudou sem uma regra de publicação correspondente');
if (projectData.edition.commercialStatus === 'prototyping') check(projectData.edition.producedPieces === 0, 'Contrato do projeto: prototipagem não pode conter peça numerada concluída');
check(new Set(projectData.proofBodies.map((item) => item.code)).size === projectData.proofBodies.length, 'Contrato do projeto: códigos de corpos de prova repetidos');
check(new Set(projectData.prototypeGate.map((item) => item.code)).size === projectData.prototypeGate.length, 'Contrato do projeto: códigos do Portão repetidos');
check(/^\d+\.\d+$/.test(projectData.documents.notebookVersion), 'Contrato do projeto: versão do Caderno não segue o formato numérico');
check(new Set(decisionLog.map((item) => item.code)).size === decisionLog.length, 'Contrato do projeto: códigos do registro de decisões repetidos');
check(decisionLog.every((item) => ['Confirmada', 'Em teste', 'Aguardando 00', 'Em vigor'].includes(item.state)), 'Contrato do projeto: estado desconhecido no registro de decisões');
check(decisionLog.every((item) => !/[{}]/.test(item.decision) && !/[{}]/.test(item.record)), 'Contrato do projeto: marcador não resolvido no registro de decisões');
for (const relativePath of ['app/components/home-page.tsx', 'app/colecoes/nordica-yggdrasil/page.tsx', 'app/caderno/page.tsx', 'app/caderno/ficha-00/page.tsx', 'app/caderno/cotacao-tampo/page.tsx', 'app/caderno/certificado-modelo/page.tsx']) {
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
for (const [variant, asset] of [['escuro', brandData.assets.symbolDark], ['claro', brandData.assets.symbolLight]]) {
  const svg = readFileSync(join(root, `public${asset}`), 'utf8');
  check(svg.includes('viewBox="0 0 512 512"') && svg.includes('<circle cx="256" cy="256" r="192"') && svg.includes('M150 150 362 362M362 150 150 362') && svg.includes('<circle cx="256" cy="256" r="15"'), `Símbolo ${variant}: geometria canônica incompleta`);
  check(svg.includes('<title id="title">') && svg.includes('aria-labelledby="title"'), `Símbolo ${variant}: nome acessível ausente`);
  check(!/<(?:script|text|image|use|foreignObject)\b/i.test(svg) && !/\b(?:href|src)=/i.test(svg), `Símbolo ${variant}: dependência de fonte, script ou recurso externo`);
  check(Buffer.byteLength(svg) <= 2 * 1024, `Símbolo ${variant}: SVG excede 2 KiB`);
}
check(readFileSync(join(root, `public${brandData.assets.symbolDark}`), 'utf8').includes(`stroke="${brandData.palette.ink.hex}"`) && readFileSync(join(root, `public${brandData.assets.symbolLight}`), 'utf8').includes(`stroke="${brandData.palette.ivory.hex}"`) && [brandData.assets.symbolDark, brandData.assets.symbolLight].every((asset) => readFileSync(join(root, `public${asset}`), 'utf8').includes(`fill="${brandData.palette.bronze.hex}"`)), 'Símbolos vetoriais: cores divergem do contrato');
const paletteKeys = new Set(Object.keys(brandData.palette));
const allContrastPairs = [...brandData.contrast.approvedTextPairs, ...brandData.contrast.approvedNonTextPairs, ...brandData.contrast.restrictedPairs];
check(allContrastPairs.every((pair) => paletteKeys.has(pair.foreground) && paletteKeys.has(pair.background) && pair.label), 'Contrato da marca: par de contraste referencia cor ausente');
for (const pair of brandData.contrast.approvedTextPairs) {
  const foreground = brandData.palette[pair.foreground]?.hex;
  const background = brandData.palette[pair.background]?.hex;
  if (!foreground || !background) continue;
  const ratio = contrastRatio(foreground, background);
  check(ratio >= brandData.contrast.minimumTextRatio, `Contraste: ${pair.label} tem ${ratio.toFixed(3)}:1, abaixo de ${brandData.contrast.minimumTextRatio}:1`);
}
for (const pair of brandData.contrast.approvedNonTextPairs) {
  const foreground = brandData.palette[pair.foreground]?.hex;
  const background = brandData.palette[pair.background]?.hex;
  if (!foreground || !background) continue;
  const ratio = contrastRatio(foreground, background);
  check(ratio >= brandData.contrast.minimumNonTextRatio, `Contraste não textual: ${pair.label} tem ${ratio.toFixed(3)}:1, abaixo de ${brandData.contrast.minimumNonTextRatio}:1`);
}
for (const pair of brandData.contrast.restrictedPairs) {
  const foreground = brandData.palette[pair.foreground]?.hex;
  const background = brandData.palette[pair.background]?.hex;
  if (!foreground || !background) continue;
  const ratio = contrastRatio(foreground, background);
  check(ratio < brandData.contrast.minimumTextRatio, `Contraste: ${pair.label} já atingiu texto comum e deve sair da lista restrita`);
}

const exportedHtmlFiles = listFiles(output).filter((file) => file.endsWith('.html'));
const documentCache = new Map();
const internalOrigin = new URL(origin).origin;
let checkedInternalReferences = 0;
let checkedSemanticElements = 0;
let checkedResponsiveImages = 0;

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
    if (attributeValue(match[0], 'class')?.split(/\s+/).includes('responsive-image')) {
      const src = attributeValue(match[0], 'src') ?? '';
      const imageFile = src.replace(`${exportedBasePath}/images/`, '').split('/').at(-1);
      const dimensions = imageData[imageFile];
      check(Boolean(dimensions), `${sourceRelativePath}: imagem responsiva fora do contrato (${src})`);
      if (dimensions) {
        check(Number(attributeValue(match[0], 'width')) === dimensions.width && Number(attributeValue(match[0], 'height')) === dimensions.height, `${sourceRelativePath}: dimensões HTML divergem do arquivo ${imageFile}`);
      }
      checkedResponsiveImages += 1;
    }
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
check(checkedInternalReferences >= 324, `rastreador: poucas referências internas verificadas (${checkedInternalReferences})`);
check(checkedSemanticElements >= 374, `acessibilidade: poucos elementos semânticos verificados (${checkedSemanticElements})`);
check(checkedResponsiveImages >= 17, `desempenho: poucas imagens responsivas com dimensões verificadas (${checkedResponsiveImages})`);
check(checkedStructuredNodes >= 29, `SEO: poucos nós estruturados verificados (${checkedStructuredNodes})`);

if (failures.length) {
  console.error(`Verificação estática falhou (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Verificação estática aprovada: ${routes.length} rotas, ${exportedHtmlFiles.length} documentos, ${checkedInternalReferences} referências internas, ${checkedSemanticElements} elementos semânticos, ${checkedResponsiveImages} imagens responsivas e ${checkedStructuredNodes} nós JSON-LD; metadados sociais, acessibilidade, SEO e orçamentos de JavaScript, CSS, fontes e imagens.`);
