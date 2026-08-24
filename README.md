# DÉCIMA EDIÇÕES

Site-conceito de uma marca brasileira de mesas autorais em edições de dez peças numeradas.

## Ideia central

Uma coleção não volta ao estoque. A peça 10/10 encerra a arte, que passa para o arquivo. Uma família estética pode retornar no futuro, mas com novo subtítulo, novo desenho e nova história — `Nórdica — Yggdrasil` pode dar lugar a `Nórdica — Skald`, jamais a uma simples reimpressão.

## Logo

O círculo representa o tampo visto de cima. O `X` é simultaneamente a estrutura cruzada da base e o numeral romano de dez; o ponto em bronze marca o centro de cada edição.

- `public/brand/decima-logo-dark.png` — aplicação sobre fundos claros;
- `public/brand/decima-logo-light.png` — aplicação sobre fundos escuros;
- `app/icon.png` — símbolo reduzido para navegador e redes.

O mesmo símbolo de 512 × 512 px alimenta `manifest.webmanifest`, com nome, idioma, cores, escopo e início ajustados automaticamente para o caminho local ou para `/decima-edicoes` no GitHub Pages.

## Experiências do site

- `/` — apresentação da marca, coleção inaugural, manifesto e lista privada;
- `/colecoes` — arquivo de edições e estudos;
- `/colecoes/nordica-yggdrasil` — dossiê da primeira coleção;
- `/caderno` — área aberta do fundador com regras, protótipos, acabamento e simulador 3D.

## Tecnologia

- Next.js com exportação estática e React;
- Framer Motion para entrada e navegação móvel;
- GSAP + ScrollTrigger para revelações e profundidade no scroll;
- Lenis para rolagem suave;
- Three.js + React Three Fiber para o laboratório de acabamento;
- GitHub Actions e GitHub Pages para publicação em `navesz.github.io/decima-edicoes`.

## Fonte única do projeto

Tiragem, produção, dimensões, protótipo, versões, corpos de prova e aprovações vivem em `app/lib/project-data.json`. O site e o verificador consomem esse mesmo contrato para evitar divergência entre vitrine, produto, Caderno e ficha impressa. O procedimento de atualização está em `docs/CONTRATO-DO-PROJETO.md`.

## Rodar localmente

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
```

Auditar o export gerado:

```bash
npm run verify
```

Além de SEO e orçamentos de mídia, a auditoria percorre todos os documentos HTML e valida links internos, fragmentos, imagens, fontes, scripts, folhas de estilo, nomes acessíveis, labels, headings, landmarks, SVGs e relações por ID.

As imagens originais ficam em `assets/source-images`. Para regenerar os WebPs públicos, as variantes responsivas de 480/800 px e os cartões sociais otimizados:

```bash
npm run images:optimize
```

O push na branch `main` publica automaticamente no GitHub Pages.

## Antes do lançamento comercial

1. validar disponibilidade jurídica do nome e registrar marca/domínio;
2. fabricar e ensaiar os quatro corpos de prova descritos no Caderno;
3. escolher espécie e fornecedor do tampo inteiro já nivelado;
4. congelar ficha técnica do sistema seladora + arte + epóxi + acabamento;
5. substituir a demonstração local do formulário por canal real de atendimento;
6. fotografar o primeiro protótipo real e substituir as imagens conceituais.

O site não apresenta as imagens conceituais como fotografias de produto já fabricado.
