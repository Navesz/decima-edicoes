# DÉCIMA EDIÇÕES

Site-conceito de uma marca brasileira de mesas autorais em edições de dez peças numeradas.

## Ideia central

Uma coleção não volta ao estoque. A peça 10/10 encerra a arte, que passa para o arquivo. Uma família estética pode retornar no futuro, mas com novo subtítulo, novo desenho e nova história — `Nórdica — Yggdrasil` pode dar lugar a `Nórdica — Skald`, jamais a uma simples reimpressão.

## Logo

O círculo representa o tampo visto de cima. O `X` é simultaneamente a estrutura cruzada da base e o numeral romano de dez; o ponto em bronze marca o centro de cada edição.

- `public/brand/decima-logo-dark.png` — aplicação sobre fundos claros;
- `public/brand/decima-logo-light.png` — aplicação sobre fundos escuros;
- `public/brand/decima-symbol-dark.svg` e `public/brand/decima-symbol-light.svg` — masters vetoriais do símbolo;
- `app/icon.png` — símbolo reduzido para navegador e redes.
- `public/brand/decima-maskable.png` — símbolo com fundo opaco e zona segura para instalação.

Geometria, portabilidade e limites para fabricação dos arquivos estão documentados em `docs/ATIVOS-DA-MARCA.md`.

O mesmo símbolo de 512 × 512 px alimenta `manifest.webmanifest`, com nome, idioma, cores, escopo e início ajustados automaticamente para o caminho local ou para `/decima-edicoes` no GitHub Pages. Quando o sistema oferece instalação e atalhos, Coleções e Caderno podem ser abertos diretamente; o contrato está em `docs/EXPERIENCIA-INSTALADA.md`.

## Experiências do site

- `/` — apresentação da marca, coleção inaugural, manifesto e lista privada;
- `/colecoes` — arquivo de edições e estudos;
- `/colecoes/nordica-yggdrasil` — dossiê da primeira coleção e registro público das posições 01–10;
- `/caderno` — área aberta do fundador com regras, protótipos, acabamento e simulador 3D.
- `/caderno/marca` — guia interno, não indexado, com avaliação do nome, símbolo, aplicações, paleta, tipografia, voz e nomenclatura;
- `/caderno/cotacao-tampo` — briefing interno e imprimível para cotar e receber o tampo inteiro pré-nivelado;
- `/caderno/certificado-modelo` — modelo interno e sem validade do futuro certificado de edição;
- `/caderno/ficha-00` — ficha interna e imprimível do primeiro protótipo.

## Tecnologia

- Next.js com exportação estática e React;
- Framer Motion para interações pontuais nos cartões de coleção;
- GSAP + ScrollTrigger para revelações e profundidade no scroll;
- Lenis para rolagem suave;
- Three.js + React Three Fiber para o laboratório de acabamento;
- GitHub Actions e GitHub Pages para publicação em `navesz.github.io/decima-edicoes`.

Na home, o Framer fica restrito à ilha interativa dos cartões e usa `LazyMotion` com `domAnimation` assíncrono. Os cartões nascem como artigos estáticos; a ilha só é solicitada perto da seção, em dispositivo com hover e sem preferência reduzida. Página e hero permanecem componentes de servidor. Medição e limites estão em `docs/CARREGAMENTO-DE-MOVIMENTO.md`.

Lenis só aprimora a rolagem por roda em desktop com ponteiro preciso, rede adequada e movimento permitido. Em toque, economia de dados, 2G ou preferência reduzida, o navegador mantém a rolagem nativa e nem transfere a biblioteca. A política está em `docs/ROLAGEM-SUAVE-PROGRESSIVA.md`.

GSAP e ScrollTrigger aguardam a primeira seção animável se aproximar do viewport. Em economia de dados, 2G ou movimento reduzido, o conteúdo permanece estático e visível sem baixar os 111,4 KiB dos dois pacotes. A regra está em `docs/EFEITOS-DE-ROLAGEM-PROGRESSIVOS.md`.

O laboratório 3D é um aprimoramento progressivo: a direção acetinada, a meta de 32% e as quatro faixas comparativas já existem no HTML. WebGL só é solicitado perto da seção; economia de dados e conexões muito limitadas exigem confirmação manual, e falhas preservam a leitura. A arquitetura e os critérios estão em `docs/RESILIENCIA-DO-LABORATORIO-3D.md`.

O formulário demonstrativo também nasce completo e inativo no HTML. A lógica de validação só é transferida quando a seção se aproxima; sem JavaScript, nenhum campo é habilitado e nenhum dado pode sair da página. A medição está em `docs/FORMULARIO-DE-INTERESSE-PROGRESSIVO.md`.

## Fonte única do projeto

Tiragem, produção, dimensões, protótipo, versões, corpos de prova e aprovações vivem em `app/lib/project-data.json`. O site e o verificador consomem esse mesmo contrato para evitar divergência entre vitrine, produto, Caderno e ficha impressa. O procedimento de atualização está em `docs/CONTRATO-DO-PROJETO.md`.

Nome, slogan, idioma, paleta e ativos oficiais vivem separadamente em `app/lib/brand-data.json`. Metadados, manifesto, dados estruturados, cabeçalho, rodapé e Guia de Marca consomem o mesmo contrato; o procedimento está em `docs/CONTRATO-DA-MARCA.md`.

Os pares de cor aprovados e restritos também vivem nesse contrato. O Guia publica os índices calculados e o build aplica os limiares WCAG documentados em `docs/CONTRASTE-E-ACESSIBILIDADE.md`.

As decisões locais sobre movimento, economia de dados, rede 2G e ponteiro vivem em `app/lib/client-capabilities.ts`. Laboratório 3D, Lenis e GSAP consomem a mesma política; o contrato está descrito em `docs/CAPACIDADES-DO-CLIENTE.md`.

A modelagem de SEO liga marca, website, páginas, breadcrumbs e o conceito Yggdrasil sem publicar oferta fictícia. As regras estão em `docs/SEO-E-DADOS-ESTRUTURADOS.md`.

O documento `404.html` possui título, descrição, canonical e URLs sociais próprios, com uma única diretiva `noindex`; a home não força `index` globalmente. A regra específica está em `docs/METADADOS-DA-PAGINA-404.md`.

O registro público da tiragem deriva do mesmo contrato, separa produção de disponibilidade e não publica dados pessoais. Estados e procedimento estão em `docs/REGISTRO-PUBLICO-DA-EDICAO.md`.

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

O mesmo comando atualiza `app/lib/image-data.json`. Esse contrato fornece largura e altura intrínsecas às 17 imagens responsivas renderizadas e é conferido contra os arquivos no build. Critérios e procedimento estão em `docs/IMAGENS-E-ESTABILIDADE.md`.

O push na branch `main` publica automaticamente no GitHub Pages.

As cinco Actions oficiais estão fixadas em commits completos e os jobs usam permissões mínimas separadas. Pins e procedimento de atualização estão em `docs/SEGURANCA-DO-DEPLOY.md`.

## Antes do lançamento comercial

1. validar disponibilidade jurídica do nome e registrar marca/domínio;
2. fabricar e ensaiar os quatro corpos de prova descritos no Caderno;
3. escolher espécie e fornecedor do tampo inteiro já nivelado;
4. congelar ficha técnica do sistema seladora + arte + epóxi + acabamento;
5. substituir a demonstração local do formulário por canal real de atendimento;
6. fotografar o primeiro protótipo real e substituir as imagens conceituais.

O site não apresenta as imagens conceituais como fotografias de produto já fabricado.
