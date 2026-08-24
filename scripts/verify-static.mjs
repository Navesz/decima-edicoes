import { existsSync, readFileSync, statSync } from 'node:fs';
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
  { file: 'index.html', title: 'DÉCIMA Edições — Objetos que não se repetem', canonical: `${origin}/` },
  { file: 'colecoes/index.html', title: 'Coleções · DÉCIMA', canonical: `${origin}/colecoes/` },
  { file: 'colecoes/nordica-yggdrasil/index.html', title: 'Nórdica — Yggdrasil · DÉCIMA', canonical: `${origin}/colecoes/nordica-yggdrasil/` },
  { file: 'caderno/index.html', title: 'Caderno do Atelier · DÉCIMA', canonical: `${origin}/caderno/` },
];

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
}

const requiredFiles = [
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'og.png',
  'brand/decima-logo-dark.png',
  'brand/decima-logo-light.png',
];
requiredFiles.forEach((file) => check(existsSync(join(output, file)), `Arquivo ausente: out/${file}`));

const sitemap = read('sitemap.xml');
routes.forEach((route) => check(sitemap.includes(`<loc>${route.canonical}</loc>`), `sitemap.xml: rota ausente ${route.canonical}`));

const robots = read('robots.txt');
check(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'robots.txt: sitemap ausente ou incorreto');

const notebook = read('caderno/index.html');
const initialScripts = [...notebook.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((match) => match[1]);
for (const src of initialScripts) {
  const relative = src.replace(`${basePath}/`, '');
  const path = join(output, relative);
  if (existsSync(path)) check(statSync(path).size < 600 * 1024, `caderno: JavaScript inicial excessivo em ${relative}`);
}

if (failures.length) {
  console.error(`Verificação estática falhou (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Verificação estática aprovada: ${routes.length} rotas, metadados, acessibilidade básica, SEO e orçamento inicial de JavaScript.`);
