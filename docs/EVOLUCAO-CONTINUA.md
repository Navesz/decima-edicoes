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
