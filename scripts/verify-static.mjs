import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

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
  { file: 'index.html', title: 'DÉCIMA Edições — Objetos que não se repetem', canonical: `${origin}/`, scriptBudgetKiB: 750 },
  { file: 'colecoes/index.html', title: 'Coleções · DÉCIMA', canonical: `${origin}/colecoes/`, scriptBudgetKiB: 600 },
  { file: 'colecoes/nordica-yggdrasil/index.html', title: 'Nórdica — Yggdrasil · DÉCIMA', canonical: `${origin}/colecoes/nordica-yggdrasil/`, scriptBudgetKiB: 600 },
  { file: 'caderno/index.html', title: 'Caderno do Atelier · DÉCIMA', canonical: `${origin}/caderno/`, scriptBudgetKiB: 600 },
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
  check(html.includes(`<title>${route.title}`), `${route.file}: título incorreto`);
  check(visibleHtml.includes('class="skip-link"'), `${route.file}: atalho para conteúdo ausente`);
  check(visibleHtml.includes('id="conteudo"'), `${route.file}: destino do atalho ausente`);
  check(h1Count === 1, `${route.file}: esperado um h1, encontrado ${h1Count}`);
  check(!visibleHtml.includes('style="opacity:0'), `${route.file}: conteúdo essencial nasce invisível`);
  check(html.includes('aria-expanded="false"'), `${route.file}: estado acessível do menu ausente`);
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
  check(bytes <= 450 * 1024, `imagem acima de 450 KiB: ${file} (${(bytes / 1024).toFixed(0)} KiB)`);
  return total + bytes;
}, 0);
check(publicImageBytes <= 2.5 * 1024 * 1024, `mídia pública excede 2,5 MiB: ${(publicImageBytes / 1024 / 1024).toFixed(2)} MiB`);
check(statSync(join(output, 'og.jpg')).size <= 200 * 1024, 'og.jpg excede 200 KiB');

const sitemap = read('sitemap.xml');
routes.forEach((route) => check(sitemap.includes(`<loc>${route.canonical}</loc>`), `sitemap.xml: rota ausente ${route.canonical}`));

const robots = read('robots.txt');
check(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'robots.txt: sitemap ausente ou incorreto');

const home = read('index.html');
const product = read('colecoes/nordica-yggdrasil/index.html');
check(home.includes('protótipo 00 em desenvolvimento'), 'início: estágio conceitual não está explícito');
check(home.includes('não cria reserva, cobrança ou direito'), 'início: limite do fluxo de interesse não está explícito');
check(product.includes('Yggdrasil ainda não está à venda'), 'Yggdrasil: indisponibilidade comercial não está explícita');
check(product.includes('ProductModel'), 'Yggdrasil: dados estruturados devem representar um modelo, não produto disponível');

if (failures.length) {
  console.error(`Verificação estática falhou (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Verificação estática aprovada: ${routes.length} rotas, metadados, acessibilidade básica, SEO e orçamentos de JavaScript e mídia.`);
