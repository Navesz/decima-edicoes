import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const output = join(root, 'out');
const basePath = '/decima-edicoes';
const origin = `https://navesz.github.io${basePath}`;
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function read(relativePath) {
  const path = join(output, relativePath);
  check(existsSync(path), `Arquivo ausente: out/${relativePath}`);
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

const routes = [
  { file: 'index.html', title: 'DÉCIMA Edições — Objetos que não se repetem', canonical: `${origin}/`, social: `${origin}/og.jpg`, scriptBudgetKiB: 750 },
  { file: 'colecoes/index.html', title: 'Coleções · DÉCIMA', canonical: `${origin}/colecoes/`, social: `${origin}/social/collections.jpg`, scriptBudgetKiB: 600 },
  { file: 'colecoes/nordica-yggdrasil/index.html', title: 'Nórdica — Yggdrasil · DÉCIMA', canonical: `${origin}/colecoes/nordica-yggdrasil/`, social: `${origin}/social/yggdrasil.jpg`, scriptBudgetKiB: 600 },
  { file: 'caderno/index.html', title: 'Caderno do Atelier · DÉCIMA', canonical: `${origin}/caderno/`, social: `${origin}/social/caderno.jpg`, scriptBudgetKiB: 600 },
];

function initialScriptBytes(html) {
  const sources = [...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((match) => match[1]);
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
  check(html.includes(`<meta property="og:image" content="${route.social}"`), `${route.file}: cartão Open Graph incorreto`);
  check(html.includes(`<meta name="twitter:image" content="${route.social}"`), `${route.file}: cartão Twitter incorreto`);
  check(html.includes(`<title>${route.title}`), `${route.file}: título incorreto`);
  check(visibleHtml.includes('class="skip-link"'), `${route.file}: atalho para conteúdo ausente`);
  check(visibleHtml.includes('id="conteudo"'), `${route.file}: destino do atalho ausente`);
  check(h1Count === 1, `${route.file}: esperado um h1, encontrado ${h1Count}`);
  check(!visibleHtml.includes('style="opacity:0'), `${route.file}: conteúdo essencial nasce invisível`);
  check(html.includes('aria-expanded="false"'), `${route.file}: estado acessível do menu ausente`);
  check(/\ssrcset="[^"]+-480\.webp 480w,[^"]+-800\.webp 800w/i.test(visibleHtml), `${route.file}: variantes responsivas de imagem ausentes`);
  check(/\ssizes="[^"]+"/i.test(visibleHtml), `${route.file}: instrução de tamanho responsivo ausente`);
  const fontPreloadCount = (html.match(/<link[^>]+rel="preload"[^>]+as="font"/gi) ?? []).length;
  check(fontPreloadCount === 5, `${route.file}: esperado preload das 5 fontes usadas, encontrado ${fontPreloadCount}`);
  const initialKiB = initialScriptBytes(html) / 1024;
  check(initialKiB <= route.scriptBudgetKiB, `${route.file}: JavaScript inicial ${initialKiB.toFixed(1)} KiB excede ${route.scriptBudgetKiB} KiB`);
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
const cssBytes = cssFiles.reduce((total, file) => total + statSync(join(cssDirectory, file)).size, 0);
const fontFiles = readdirSync(mediaDirectory).filter((file) => /\.woff2?$/i.test(file));
const fontBytes = fontFiles.reduce((total, file) => total + statSync(join(mediaDirectory, file)).size, 0);
check(cssFiles.length === 1, `esperado um CSS inicial, encontrados ${cssFiles.length}`);
check(cssBytes <= 40 * 1024, `CSS inicial excede 40 KiB: ${(cssBytes / 1024).toFixed(1)} KiB`);
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
routes.forEach((route) => check(sitemap.includes(`<loc>${route.canonical}</loc>`), `sitemap.xml: rota ausente ${route.canonical}`));

const robots = read('robots.txt');
check(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'robots.txt: sitemap ausente ou incorreto');

const home = read('index.html');
const product = read('colecoes/nordica-yggdrasil/index.html');
const interestFormTag = home.match(/<form\b[^>]*data-local-demo[^>]*>/i)?.[0] ?? '';
check(home.includes('protótipo 00 em desenvolvimento'), 'início: estágio conceitual não está explícito');
check(home.includes('não cria reserva, cobrança ou direito'), 'início: limite do fluxo de interesse não está explícito');
check(interestFormTag.length > 0, 'início: formulário demonstrativo não está identificado');
check(!/\saction=/i.test(interestFormTag), 'início: demonstração não deve apontar para um destino de envio');
check(home.includes('<fieldset disabled="">'), 'início: campos devem permanecer inativos sem JavaScript');
check(home.includes('A simulação local requer JavaScript. Nenhum campo foi habilitado e nenhum dado será enviado.'), 'início: aviso sem JavaScript ausente');
check(home.includes('minLength="2"') && home.includes('type="email"'), 'início: restrições de validação do formulário ausentes');
check(product.includes('Yggdrasil ainda não está à venda'), 'Yggdrasil: indisponibilidade comercial não está explícita');
check(product.includes('ProductModel'), 'Yggdrasil: dados estruturados devem representar um modelo, não produto disponível');

if (failures.length) {
  console.error(`Verificação estática falhou (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Verificação estática aprovada: ${routes.length} rotas, metadados sociais, acessibilidade básica, SEO, mídia responsiva e orçamentos de JavaScript, CSS, fontes e imagens.`);
