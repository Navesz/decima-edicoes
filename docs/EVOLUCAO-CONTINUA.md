# Evolução contínua

Registro dos ciclos verificáveis de melhoria do projeto DÉCIMA EDIÇÕES.

## Ciclo 01 — acesso, descoberta e carregamento

Data: 24 de agosto de 2026.

### Evidências encontradas

- o conteúdo principal do primeiro quadro era exportado com opacidade zero e dependia de JavaScript para aparecer;
- o menu móvel não anunciava seu estado, não prendia o foco e não respondia à tecla Escape;
- não existia atalho para pular diretamente ao conteúdo;
- o laboratório 3D adicionava um pacote de aproximadamente 886 KiB ao carregamento inicial do Caderno;
- páginas secundárias herdavam imagens e títulos sociais genéricos;
- não existiam sitemap, robots, página 404 própria ou uma verificação automática do HTML exportado.

### Melhorias aplicadas

- conteúdo essencial visível mesmo sem execução de JavaScript;
- menu móvel com diálogo acessível, foco controlado, Escape e bloqueio de rolagem;
- atalho de teclado para o conteúdo em todas as rotas;
- carregamento do laboratório 3D somente perto da área de visualização e respeito à preferência de movimento reduzido;
- títulos, descrições, URLs canônicas e imagens sociais específicos por rota;
- dados estruturados de marca e produto;
- sitemap, robots e experiência 404 alinhada à identidade;
- verificador estático incorporado ao fluxo de publicação.

### Próxima frente candidata

Conteúdo comercial e confiança: transformar a manifestação de interesse demonstrativa em um canal real quando o fundador definir contato, cidade, raio de entrega e política comercial.

## Ciclo 02 — orçamento de JavaScript

Data: 24 de agosto de 2026.

### Linha de base

- início: 857,2 KiB de scripts referenciados no HTML inicial;
- Coleções e Yggdrasil: 733,7 KiB;
- Caderno: 734,9 KiB, além do laboratório 3D já adiado no ciclo anterior.

### Intervenção

- o menu móvel deixou de importar Framer Motion em todas as rotas e passou a usar transição CSS com os mesmos controles de foco;
- Lenis passou a ser carregado depois da primeira renderização;
- GSAP e ScrollTrigger passaram a ser carregados somente no componente de efeitos da página inicial;
- Framer Motion continua aplicado onde agrega valor na apresentação da coleção, sem onerar as páginas editoriais;
- o verificador agora reprova qualquer aumento que ultrapasse 750 KiB na página inicial ou 600 KiB nas demais rotas.

### Resultado medido

- início: 719,9 KiB, redução de 137,3 KiB (16%);
- Coleções e Yggdrasil: 580,7 KiB, redução de 153 KiB (21%);
- Caderno: 582 KiB, redução de 152,9 KiB (21%).

## Ciclo 03 — transparência de estágio

Data: 24 de agosto de 2026.

### Risco encontrado

O site apresentava imagens conceituais com linguagem de peça já produzida e usava chamadas como “edição aberta”, “peça 01/10” e “escolha um número”. O Caderno registrava corretamente que o projeto ainda precisa de corpos de prova e do protótipo 00, mas essa informação não estava clara para o visitante das páginas comerciais.

### Correções

- o primeiro quadro agora identifica a imagem como visualização conceitual e mostra `00/10` peças produzidas;
- o arquivo informa que a edição está em prototipagem e ainda não recebe reservas;
- o dossiê de Yggdrasil ganhou uma linha do tempo: corpos de prova, protótipo 00 e só então edição 01/10;
- galerias e textos alternativos passaram a identificar as imagens como estudos conceituais;
- o formulário se apresenta como demonstração e declara que não transmite dados nem cria reserva ou cobrança;
- os dados estruturados descrevem Yggdrasil como `ProductModel`, coerente com o estágio atual;
- o verificador impede que essas declarações essenciais desapareçam em mudanças futuras.

## Ciclo 04 — mídia eficiente

Data: 24 de agosto de 2026.

### Linha de base

As onze imagens conceituais e o card social somavam aproximadamente 27 MiB em PNG. A imagem principal sozinha ocupava 2,78 MiB e era servida sem transformação pelo GitHub Pages.

### Intervenção

- os PNGs originais foram preservados em `assets/source-images`, fora do pacote público;
- as imagens do site passaram para WebP com qualidade visual alta e metadados dispensáveis removidos;
- o card social passou para JPEG otimizado, formato amplamente aceito por indexadores e redes;
- um comando reproduzível regenera todos os derivados a partir das fontes;
- a validação impede imagens individuais acima de 450 KiB, conjunto público acima de 2,5 MiB e card social acima de 200 KiB.

### Resultado medido

- conjunto público final: 2,20 MiB;
- imagem principal: 388 KiB;
- card social: 137 KiB;
- redução total: 91,8%, preservando resolução e composição das fontes.

## Ciclo 05 — imagens proporcionais ao dispositivo

Data: 24 de agosto de 2026.

### Limite encontrado

Os WebPs reduziram muito o pacote público, mas cada uso ainda entregava o arquivo em resolução máxima. Assim, um celular de 480 px podia receber os mesmos 388 KiB da imagem principal destinada a uma tela grande.

### Intervenção

- cada imagem ganhou derivados de 480 e 800 px, além do original em alta resolução;
- todas as rotas passaram a publicar `srcset` e `sizes`, permitindo ao navegador escolher o arquivo adequado à largura e à densidade da tela;
- somente as imagens principais recebem prioridade; o restante mantém carregamento tardio;
- o gerador e o verificador garantem que as 22 variantes existam e permaneçam dentro do orçamento de 200 KiB cada.

### Resultado medido

- imagem principal em 480 px: 66 KiB, 83% menor que o arquivo de alta resolução;
- imagem principal em 800 px: 177 KiB, 54% menor;
- conjunto reproduzível de derivados: 3,49 MiB, ainda 87,1% abaixo dos PNGs-fonte;
- `lint`, compilação estática e verificação de todas as rotas aprovados.

## Ciclo 06 — interesse sem falsa transmissão

Data: 24 de agosto de 2026.

### Risco encontrado

O formulário informava corretamente que nada seria enviado, porém seu comportamento padrão sem JavaScript ainda poderia recarregar a página e expor nome e e-mail na URL. Os erros dependiam apenas da validação nativa, e o retorno da confirmação não restaurava o foco ao formulário.

### Correções

- os controles chegam inativos no HTML e só são habilitados quando a simulação local está pronta;
- sem JavaScript, uma mensagem explícita substitui qualquer tentativa de transmissão;
- o formulário não possui `action` nem integração externa;
- nome e e-mail têm limites, validação local, `aria-invalid`, mensagens associadas e alertas para tecnologias assistivas;
- o primeiro campo inválido recebe foco; a confirmação também recebe foco; ao voltar, o foco retorna ao nome;
- o verificador trava a ausência de destino de envio, o estado seguro sem JavaScript e as restrições mínimas dos campos.

### Validação

- lint e checagem de tipos aprovados;
- exportação estática aprovada;
- HTML inicial confirmado com `fieldset` inativo, aviso em `noscript` e sem `action` de envio.

## Ciclo 07 — publicação reproduzível e segura

Data: 24 de agosto de 2026.

### Fragilidades encontradas

O workflow instalava versões compatíveis por faixa com `npm install`, em vez de reproduzir exatamente o lockfile com `npm ci`. As ações oficiais de configuração, empacotamento e deploy do GitHub Pages também estavam uma geração atrás e emitiram aviso de runtime Node 20.

### Correções

- instalação do CI alterada para `npm ci`, tornando o pacote de dependências determinístico;
- pares WASM opcionais do resolvedor foram fixados no lockfile para que a instalação seja idêntica em Windows e Linux;
- auditoria passou a interromper a publicação diante de vulnerabilidade alta ou crítica;
- `configure-pages` atualizado para v6, com runtime Node 24;
- `upload-pages-artifact` atualizado para v5, que usa a geração atual do serviço de artefatos;
- `deploy-pages` atualizado para v5, também com runtime Node 24.

### Critério de saída

Uma instalação limpa precisa aprovar auditoria, lint, compilação estática, verificador próprio, upload e deploy sem o aviso de Node 20 observado anteriormente.

### Resultado

- instalação limpa aprovada em Windows e no runner Linux do GitHub;
- zero vulnerabilidades e zero anotações no check final;
- build e deploy concluídos com as Actions em Node 24;
- site publicado respondeu com status 200 após a mudança.

## Ciclo 08 — tipografia sem alfabetos ociosos

Data: 24 de agosto de 2026.

### Desperdício encontrado

Os imports genéricos do Fontsource empacotavam, para cada peso, arquivos WOFF e WOFF2 de subconjuntos latino, latino estendido, cirílico, cirílico estendido, grego e vietnamita. O resultado exportado continha 57 arquivos de fonte e 28 declarações `@font-face`, embora o conteúdo seja em português.

### Intervenção

- a família Cormorant Garamond foi limitada aos pesos latinos 400 e 500 realmente usados;
- Manrope foi limitada aos pesos latinos 400, 500 e 600;
- o carregamento passou pelo sistema local do Next, que gera preload e preserva `font-display: swap`;
- as famílias de sistema continuam como fallback;
- o verificador agora exige cinco WOFF2, orçamento total de 100 KiB e CSS inicial abaixo de 40 KiB.

### Resultado medido

- arquivos de fonte: 57 → 5;
- payload de fontes no build: 672.353 → 88.512 bytes, redução de 86,8%;
- CSS inicial: 43.664 → 34.918 bytes, redução de 20%;
- lint, build, tipos e verificação estática aprovados.
