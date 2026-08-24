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

## Ciclo 09 — compartilhamento com direção de arte

Data: 24 de agosto de 2026.

### Inconsistência encontrada

A página inicial tinha um card social próprio em 1200 × 630, mas Coleções, Yggdrasil e Caderno apontavam diretamente para WebPs de proporções diferentes. Em compartilhamentos, isso podia produzir recortes imprevisíveis, suporte desigual e ausência da assinatura visual da marca.

### Intervenção

- três cartões JPEG em 1200 × 630 foram derivados das fontes originais;
- cada composição recebeu escurecimento controlado, logo claro e linha de bronze;
- Coleções, Yggdrasil e Caderno passaram a usar URLs próprias tanto em Open Graph quanto em Twitter Cards;
- o gerador de mídia passou a reproduzir também esses cartões;
- o verificador exige URL correta por rota, formato JPEG, dimensão exata e máximo de 180 KiB por arquivo.

### Resultado medido

- Coleções: 92 KiB;
- Yggdrasil: 140 KiB;
- Caderno: 94 KiB;
- os três cartões foram inspecionados em resolução original;
- lint, build, metadados e orçamentos aprovados.

## Ciclo 10 — luxo que continua legível

Data: 24 de agosto de 2026.

### Problema encontrado

A linguagem editorial recorria a muitos textos de 7–8 px, opacidades de 35–55% e bronze claro sobre fundos claros. A composição parecia delicada, mas avisos como “visualização conceitual”, o estado do protótipo, notas do laboratório e ações secundárias podiam perder legibilidade — sobretudo no celular ou sob luz forte.

### Intervenção

- microtexto informativo padronizado em 10 px e texto auxiliar em 9 px;
- textos suaves passaram a usar tokens de 68%: contraste calculado de 5,05:1 ou mais nos fundos principais;
- um bronze escuro `#684318` passou a representar números e estados sobre papel claro, mantendo pelo menos 4,95:1 nos fundos em que é usado;
- legendas sobre fotografia receberam fundo escuro localizado, sem escurecer mais a imagem inteira;
- links editoriais e navegação passaram a ter alvo mínimo de 24 px; chamadas principais mantêm 44 px ou mais;
- placeholder, notas do formulário, rodapé, especificações e estados do produto receberam contraste explícito;
- o verificador impede o retorno de texto informativo em 7–8 px e protege os tokens e alvos adotados.

### Limites preservados

O subtítulo de 6 px dentro do logotipo permanece como detalhe gráfico, não como conteúdo necessário. Texturas e ícones decorativos continuam podendo usar transparência sem afetar compreensão.

## Ciclo 11 — o Portão do Protótipo 00

Data: 24 de agosto de 2026.

### Lacuna encontrada no briefing

O Caderno descrevia regras, quatro corpos de prova, processo e protocolo de escassez, mas não possuía um critério objetivo que impedisse a passagem prematura do conceito para a venda. O briefing original é claro sobre a restrição de oficina — comprar o tampo inteiro já nivelado — e sobre a necessidade de testar o sistema completo antes da mesa.

### Intervenção

- o Caderno avançou para a versão 0.2;
- uma sexta seção criou o Portão 00, com tabela semântica e navegação própria;
- seis frentes passaram a exigir aprovação documentada: matéria, arte, acabamento, estrutura, custo e venda;
- a matéria parte explicitamente de tampo inteiro, maciço, redondo, pré-cortado e pré-nivelado;
- cada frente registra aprovação necessária, evidência mínima e estado atual;
- “em teste” deixou de poder ser confundido com “aprovado”;
- a próxima decisão passou a ser cotar o tampo real e iniciar as quatro placas, em vez de avançar a comunicação comercial.

### Proteção contra regressão

O verificador exige a versão 0.2, a regra das seis aprovações, a especificação do tampo, seis estados e a estrutura semântica da tabela.

## Ciclo 12 — ficha operacional do Protótipo 00

Data: 24 de agosto de 2026.

### Objetivo

Transformar as seis aprovações do Caderno em um registro que possa acompanhar o trabalho na oficina, sem criar banco de dados, conta ou falsa automação.

### Entrega

- nova rota interna `/caderno/ficha-00/`, ligada diretamente ao Portão 00;
- identificação do tampo, fornecedor, nota, espécie, umidade e dimensões reais;
- tabela para os quatro corpos de prova A–D;
- ensaios de acabamento, uso e estrutura;
- custos, horas, perdas, embalagem e gargalo de repetibilidade;
- fechamento individual das seis frentes e decisão final do ciclo;
- ação local para imprimir ou salvar em PDF;
- folha de estilo própria para A4, isolada do CSS das páginas públicas.

### Privacidade e descoberta

A ficha não possui formulário de envio nem persistência. Ela recebe `noindex, nofollow` e permanece fora do sitemap público, embora continue visível por enquanto como solicitado pelo fundador.

### Validação

- cinco rotas estáticas compiladas;
- CSS público continua abaixo de 40 KiB; somente a ficha carrega seu pacote adicional, ficando abaixo de 48 KiB no total;
- verificador exige a rota, bloqueio de indexação, A4, quatro corpos de prova e seis aprovações imprimíveis.

## Ciclo 13 — contrato único do projeto

Data: 24 de agosto de 2026.

### Risco encontrado

Tiragem, quantidade produzida, dimensões, versões, quatro corpos de prova e seis aprovações estavam repetidos em componentes diferentes. Uma alteração futura poderia atualizar a vitrine e deixar o produto, o Caderno, a ficha ou os metadados com outra versão da verdade.

### Intervenção

- `app/lib/project-data.json` passou a concentrar os fatos editoriais, técnicos e operacionais da edição inaugural;
- `app/lib/project.ts` passou a gerar rótulos como `00/10`, `01/10`, `30–40 mm` e números por extenso;
- início, arquivo, produto, Caderno, ficha, formulário demonstrativo, rodapé, metadados, dados estruturados e sitemap passaram a consumir o contrato;
- corpos de prova e Portão 00 deixaram de ter definições duplicadas entre Caderno e ficha;
- `docs/CONTRATO-DO-PROJETO.md` documenta a atualização segura e a regra de estado comercial.

### Proteção contra regressão

O verificador lê o mesmo JSON que alimenta o site e compara o HTML exportado com tiragem, produção, dimensões, versão, testes e aprovações. Ele rejeita contagens inválidas, códigos repetidos, consumidores desconectados da fonte única e mudança isolada do estado `prototyping`.

## Ciclo 14 — registro versionado de decisões

Data: 24 de agosto de 2026.

### Lacuna encontrada

As decisões principais estavam explicadas em seções diferentes, mas faltava uma visão curta que separasse regra confirmada, direção em teste e evidência ainda pendente. Sem isso, uma preferência visual poderia ser lida como especificação fechada.

### Intervenção

- o Caderno avançou para a versão 0.3;
- a navegação recebeu a seção `07 Registro`;
- sete decisões passaram a registrar código, frente, texto atual, registro necessário e estado;
- acabamento continua explicitamente `Em teste`;
- estrutura continua `Aguardando 00`;
- a proibição de abrir a peça 01 antes do Portão 00 aparece como regra `Em vigor`;
- números dentro das decisões usam marcadores resolvidos pelo contrato, evitando duplicação de `10/10`, peça 01 e Protótipo 00.

### Proteção contra regressão

O verificador exige navegação e destino da seção, revisão e data, sete linhas alinhadas ao contrato, códigos únicos, estados conhecidos e ausência de marcadores não resolvidos. O CSS público permaneceu em 37,7 KiB, abaixo do teto de 40 KiB.

## Ciclo 15 — rastreador de integridade interna

Data: 24 de agosto de 2026.

### Risco encontrado

O verificador conhecia as cinco rotas principais e alguns arquivos obrigatórios, mas não percorria toda referência emitida pelo Next.js. Um link, fragmento, `srcset`, fonte ou relação ARIA poderia quebrar sem impedir a publicação.

### Intervenção

- todos os oito documentos HTML exportados passaram a ser descobertos recursivamente;
- `href`, `src`, `poster` e cada candidato de `srcset` são resolvidos até o arquivo real em `out`;
- fragmentos são comparados com os IDs do documento de destino;
- IDs duplicados passaram a falhar;
- `aria-controls`, `aria-describedby`, `aria-labelledby` e `for` passaram a exigir um ID existente;
- URLs `javascript:` foram proibidas;
- o modo local aceita a raiz `/`, enquanto o modo de publicação exige que as referências permaneçam sob `/decima-edicoes`;
- a auditoria passou a confirmar 171 referências internas em cada build.

### Validação

O rastreador passou tanto no export local quanto em um segundo build com as mesmas variáveis de ambiente do GitHub Pages. A diferença de base path é tratada explicitamente, sem relaxar o deploy real.

## Ciclo 16 — identidade instalável da marca

Data: 24 de agosto de 2026.

### Lacuna encontrada

O site possuía favicon e logotipo, mas não declarava manifesto, cor do navegador, identidade de instalação ou escopo. Em dispositivos que oferecem “adicionar à tela inicial”, a experiência ficava dependente de inferências do navegador.

### Intervenção

- nova rota estática `/manifest.webmanifest`;
- nome completo `DÉCIMA Edições`, nome curto `DÉCIMA` e idioma `pt-BR`;
- fundo e tema em `#171411`, o carvão principal da marca;
- início, ID e escopo adaptáveis à raiz local ou a `/decima-edicoes/`;
- reutilização do símbolo existente de 512 × 512 px, sem criar logo paralelo;
- modo `standalone`, título para Apple e cor de interface declarada pelo metadata de viewport;
- detecção automática de números como telefone desativada, evitando links falsos em numeração editorial.

### Proteção contra regressão

Cada rota precisa apontar para o manifesto no base path correto e declarar tema, capacidade e detecção. O verificador lê o JSON, compara identidade, idioma, início, escopo, cores e ícone, e inspeciona o PNG real com Sharp. A auditoria agora cobre 179 referências internas.

Durante a primeira publicação, essa proteção revelou que `NEXT_PUBLIC_BASE_PATH` e `NEXT_PUBLIC_SITE_URL` existiam apenas na etapa de build. O job passou a compartilhar as duas variáveis também com lint, verificação e upload, garantindo que o artefato e sua auditoria usem a mesma configuração de hospedagem.

## Ciclo 17 — auditoria semântica do HTML

Data: 24 de agosto de 2026.

### Auditoria inicial

Os oito documentos já possuíam `alt` em todas as imagens, nomes nos links e botões, labels nos controles e nenhum `tabindex` positivo. A auditoria não encontrou um caso que justificasse alteração visual; o ganho deste ciclo foi transformar essa qualidade existente em contrato de publicação.

### Proteções adicionadas

- exatamente um landmark `main` e um `h1` por documento;
- headings com texto e sem salto de nível;
- imagens obrigadas a declarar `alt`, com regra explícita para decoração;
- links e botões obrigados a ter nome acessível;
- todos os botões precisam declarar `type`;
- navegações precisam de `aria-label` ou `aria-labelledby`;
- SVGs precisam ser decorativos ou imagens nomeadas;
- inputs, selects e textareas precisam de label envolvente, `for` ou nome ARIA;
- `target="_blank"` exige `rel="noopener"`;
- `tabindex` positivo é proibido;
- foco visível e preferência de movimento reduzido permanecem protegidos no CSS.

### Correção de cobertura

A nova auditoria também percebeu que o rastreador do ciclo 15 tratava `srcset` com caixa sensível, enquanto o export do React escreve `srcSet`. A leitura passou a ser insensível a caixa e cada candidato responsivo agora é verificado. O total subiu para 230 referências internas e 245 elementos semânticos auditados.

## Ciclo 18 — grafo de dados estruturados

Data: 24 de agosto de 2026.

### Revisão da modelagem

As definições oficiais do Schema.org confirmaram `ProductModel` para uma especificação de modelo ainda sem oferta, propriedades específicas de medida e `BreadcrumbList` ordenado por posição. O antigo JSON-LD era válido como JSON, mas a marca aparecia isolada e o modelo usava propriedades genéricas para todas as dimensões.

### Intervenção

- grafo global com `Brand` e `WebSite` ligados por IDs estáveis;
- `CollectionPage` para o arquivo de coleções;
- `WebPage` versionada para o Caderno;
- `WebPage`, `BreadcrumbList` e `ProductModel` ligados no dossiê Yggdrasil;
- largura e profundidade de 80 cm e altura de 38 cm em `QuantitativeValue` com unidade `CMT`;
- marca ligada ao modelo por `@id`;
- estado “ainda não está à venda” incluído como característica explícita;
- ausência deliberada de `Offer`, preço, estoque, SKU, GTIN e avaliações.

### Proteção contra regressão

O verificador parseia cada bloco JSON-LD, exige contexto Schema.org, IDs únicos, marca e website em todos os documentos, breadcrumbs ordenados, relações entre página e modelo, medidas alinhadas ao contrato e quatro imagens internas. Enquanto o estado for `prototyping`, propriedades comerciais fazem o deploy falhar. Ao todo, 23 nós estruturados são auditados.

## Ciclo 19 — guia interno de marca

Data: 24 de agosto de 2026.

### Questão retomada

O projeto já possuía assinatura visual, símbolo e uma justificativa curta no repositório, mas ainda não respondia de forma organizada à pergunta central do fundador: “DÉCIMA Edições é mesmo um bom nome e como a logo deve ser usada?”. Sem regras visíveis, o sistema poderia perder o acento, variar de cor ou prometer mais do que o protótipo provou.

### Direção consolidada

- o nome foi mantido como direção forte porque liga a tiragem de dez ao vocabulário de coleção e arquivo;
- o guia também registra os riscos: associação com mercado editorial e disponibilidade jurídica ainda não verificada;
- o símbolo passou a ter leitura formal documentada: tampo/ciclo, numeral romano dez/base cruzada e centro singular;
- assinaturas positiva e negativa, respiro, tamanhos mínimos e usos proibidos foram reunidos em uma rota própria;
- a paleta distingue o bronze material do bronze-tinta acessível em texto pequeno;
- Cormorant Garamond e Manrope receberam funções editoriais e técnicas distintas;
- voz, sistema `Família — Título`, peça `01/10`, Protótipo `00` e regra de aposentadoria do desenho ficaram explícitos;
- busca, estratégia de registro no INPI, ecossistema digital e teste de leitura viraram portões anteriores ao lançamento.

### Escopo e proteção

`/caderno/marca/` permanece visível a quem tem o endereço e acessível pelo Caderno, mas declara `noindex, nofollow` e não entra no sitemap público. O verificador protege metadados, conteúdo mínimo, ativos oficiais, paleta, tipografia, nomenclatura, alerta jurídico e responsividade. O guia avalia posicionamento; não afirma que o nome esteja juridicamente disponível.

## Ciclo 20 — contrato único de identidade

Data: 24 de agosto de 2026.

### Divergência potencial

O Guia de Marca tornou nome, slogan, paleta e assinaturas explícitos, mas essas informações ainda estavam repetidas em metadados, manifesto, JSON-LD e componentes. Uma alteração futura poderia atualizar a página visível e deixar navegador, instalação ou mecanismos de busca com uma identidade antiga.

### Intervenção

- `app/lib/brand-data.json` passou a guardar nome, nome curto, descritor, slogan, idioma, seis cores com função e três ativos oficiais;
- título global, Open Graph, Twitter, Apple Web App e cor do navegador passaram a consumir o contrato;
- manifesto usa a mesma identidade, idioma, carvão e ícone;
- `Brand` e `WebSite` estruturados usam nome, slogan, idioma e logo canônicos;
- cabeçalho, menu móvel, rodapé e assinatura renderizada deixaram de repetir strings institucionais;
- o Guia gera paleta, nomes e downloads pelo contrato e agora distingue papel principal de papel claro;
- o procedimento de alteração foi registrado em `docs/CONTRATO-DA-MARCA.md`.

### Proteção contra regressão

O verificador lê o JSON diretamente, rejeita cores inválidas ou repetidas, ativos ausentes e consumidores desconectados. Também compara os seis tokens com o CSS, identidade e cor do manifesto, ícone real, conteúdo do Guia e nós estruturados exportados. O contrato evita deriva técnica; busca de marca e validação pública continuam como portões separados.

## Ciclo 21 — briefing de cotação do tampo

Data: 24 de agosto de 2026.

### Restrição transformada em ferramenta

O projeto dizia que o tampo inteiro, de uma única espécie e comprado já nivelado era a prioridade, mas essa decisão ainda não estava convertida em um pedido comparável para fornecedores. Isso deixava margem para receber propostas com construções diferentes sob a mesma descrição de “tampo de madeira”.

### Intervenção

- nova rota interna e imprimível `/caderno/cotacao-tampo/`, ligada diretamente à regra de construção e ao Portão M01;
- Prioridade A definida como peça contínua de madeira maciça, uma única espécie, sem emenda como padrão;
- diâmetro de 80 cm e espessura de 30–40 mm vêm do contrato do projeto;
- pedido exige faces planas e paralelas, lateral limpa, medidas reais, método de verificação, tolerância declarada e defeitos informados;
- umidade passou a pedir leituras em vários pontos, data, ambiente e equipamento, sem inventar um limite antes do Protótipo 00;
- fotos, medições e inspeção de plano formam o pacote de evidência anterior à compra;
- painel colado de uma única espécie aparece somente como Alternativa B, cotada separadamente e sem equivalência automática;
- três cotações podem ser comparadas sem esconder construção, frete, prazo ou falta de prova;
- o recebimento ganhou roteiro de medição, aclimatação, registro de transporte e decisão M01.

### Proteção contra regressão

A rota declara `noindex, nofollow`, não entra no sitemap e reutiliza a folha A4 já validada da ficha do protótipo. O verificador exige o acesso pelo Caderno, dimensões vindas do contrato, prioridade sem emenda, separação da alternativa colada, evidência de umidade, três cotações, impressão e decisão M01.

## Ciclo 22 — contrato matemático de contraste

Data: 24 de agosto de 2026.

### Risco encontrado

O Guia distinguia bronze luminoso de bronze-tinta, mas a proteção era apenas textual. Uma mudança futura de hex poderia tornar uma combinação ilegível sem quebrar o build, e “premium” poderia passar a significar texto pequeno com baixo contraste.

### Referência e decisão

A documentação oficial da WCAG 2.2 mantém 4,5:1 para texto comum e 3:1 para texto grande; ícones necessários também pedem 3:1. A marca adota 4,5:1 para todos os pares de texto declarados, sem usar a exceção normativa de logotipo como atalho para a interface.

### Intervenção

- o contrato da marca passou a declarar limiares, sete pares de texto aprovados, um par não textual aprovado e dois pares restritos;
- a luminância relativa e a razão de contraste são calculadas a partir dos hexadecimais reais;
- o Guia ganhou tabela com amostra, índice e estado de cada combinação;
- carvão, marfim, papéis e bronze-tinta passam de 6,54:1 nos usos declarados;
- bronze sobre carvão atinge 5,81:1 e pode carregar texto;
- bronze luminoso sobre papel fica em 2,36:1 ou 2,68:1 e foi limitado a decoração dispensável;
- fontes e procedimento foram registrados em `docs/CONTRASTE-E-ACESSIBILIDADE.md`.

### Proteção contra regressão

O verificador recalcula os índices de forma independente, sem arredondar antes do limiar. O deploy falha se um par aponta para cor ausente, se um par aprovado cai abaixo de 4,5:1 ou 3:1, se um valor publicado diverge do cálculo ou se a referência oficial some do Guia.

## Ciclo 23 — masters vetoriais do símbolo

Data: 24 de agosto de 2026.

### Lacuna encontrada

A assinatura completa e o ícone existiam em PNG, suficientes para o site, mas o símbolo ainda não possuía um master vetorial portátil. Ampliar o bitmap para aplicações físicas ou editoriais poderia introduzir perda de definição, enquanto transformar a palavra DÉCIMA em texto SVG criaria dependência de fonte e falsa sensação de arquivo final.

### Intervenção

- criadas versões SVG escura e clara do símbolo, transparentes e com `viewBox` 512 × 512;
- a geometria preserva círculo, diagonais e ponto central do ícone aprovado;
- as cores vêm do contrato: carvão ou marfim com centro bronze;
- nenhum SVG contém texto, fonte, imagem, script, link, `use` ou recurso externo;
- os dois masters entraram no contrato de ativos da marca;
- o Guia oferece download direto das versões clara e escura;
- a orientação deixa explícito que o master visual precisa ser convertido e provado pelo fabricante antes de laser, CNC, gravação ou plaqueta;
- o inventário e os limites foram registrados em `docs/ATIVOS-DA-MARCA.md`.

### Proteção contra regressão

O verificador exige os arquivos exportados, limita cada SVG a 2 KiB, confere nome acessível, `viewBox`, círculo, diagonais, centro, cores canônicas e ausência de dependências perigosas. O Guia precisa ligar todos os ativos, oferecer pelo menos quatro downloads e manter o alerta de produção física.

## Ciclo 24 — modelo rastreável de certificado

Data: 24 de agosto de 2026.

### Promessa ainda sem documento

O Caderno descrevia certificado, arquivo de matéria e plaqueta, mas ainda não definia como esses registros se cruzariam. Criar um certificado bonito sem rastreabilidade poderia transformar a edição limitada em narrativa; criar um número agora fingiria que uma peça inexistente já foi autenticada.

### Intervenção

- nova rota interna e imprimível `/caderno/certificado-modelo/`;
- marca visível `MODELO · NÃO NUMERAR · NÃO ASSINAR` e declaração de que nenhuma peça foi produzida;
- campos de coleção, tiragem, futuro número, código, conclusão e fabricação;
- matéria, fornecedor, medidas reais, umidade, arte, acabamento, lotes, base e massa;
- dimensões de referência vêm do contrato do projeto e continuam sujeitas à medição real;
- protocolo declara máximo de dez peças e aposentadoria da matriz depois de 10/10;
- vínculo físico cruza certificado, plaqueta, fotos do veio, lateral, face inferior e arquivo de produção;
- QR code foi tratado como ponte, não como prova autônoma de autenticidade;
- histórico privado contempla entrega, transferência, inspeção e restauro;
- declaração separa autenticidade do objeto, direito autoral, garantia e tratamento de dados pessoais;
- emissão válida só pode ocorrer depois de conclusão e inspeção, nunca no início de uma encomenda.

### Proteção contra regressão

A rota declara `noindex, nofollow`, fica fora do sitemap e reutiliza a folha A4 validada. O verificador proíbe pré-atribuição da peça 01/10, exige o alerta sem validade, tiragem e dimensões canônicas, encerramento 10/10, quatro linhas de histórico, impressão e limites de autenticidade, autoria e privacidade.

## Ciclo 25 — cadeia de publicação imutável

Data: 24 de agosto de 2026.

### Risco encontrado

As Actions do workflow estavam nas gerações atuais, mas eram chamadas por tags maiores como `@v6`. Uma tag pode mudar de destino; o próprio GitHub afirma que apenas o SHA completo torna a referência imutável. Além disso, permissões `pages: write` e `id-token: write` estavam no nível global e chegavam ao build sem necessidade.

### Intervenção

- as cinco tags oficiais foram resolvidas com `git ls-remote` e confirmadas pela API do GitHub como commits dos repositórios `actions/*`;
- checkout, setup-node, configure-pages, upload-pages-artifact e deploy-pages foram fixados em SHAs completos;
- a versão humana permanece ao lado de cada pin como comentário;
- permissões globais foram removidas;
- o build ficou limitado a `contents: read` e `pages: read`;
- apenas o deploy recebe `pages: write` e `id-token: write`;
- dependência do build e ambiente protegido `github-pages` permaneceram explícitos;
- fontes oficiais, pins e atualização segura foram registrados em `docs/SEGURANCA-DO-DEPLOY.md`.

### Proteção contra regressão

O verificador exige exatamente cinco Actions oficiais, SHAs de 40 caracteres e comentários de versão correspondentes. Também rejeita Action externa, referência móvel, permissão global, escrita no build, escrita de conteúdo no deploy ou perda da dependência e do ambiente `github-pages`.

## Ciclo 26 — registro público da tiragem

Data: 24 de agosto de 2026.

### Escassez ainda agregada

O dossiê dizia “0 produzidas / 10 previstas”, mas não mostrava as dez posições que sustentam a promessa editorial. Para o cliente, a limitação ainda dependia de uma frase; para o projeto, não havia proteção contra confundir produção, disponibilidade, reserva e propriedade.

### Intervenção

- o contrato passou a derivar posições ordenadas de 01/10 a 10/10;
- o dossiê Yggdrasil ganhou um registro público escuro com resumo 00/10 e dez células semânticas;
- todas as posições atuais aparecem como `Não produzida` porque o estado canônico continua zero;
- a explicação deixa claro que não existe objeto, certificado, reserva ou propriedade naquela posição;
- a futura publicação poderá mostrar número, código, ano e estado documental, mas não nomes, contatos, endereços ou custódia privada por padrão;
- `ProductModel` ganhou a propriedade `Peças concluídas`, também derivada do contrato;
- produção não foi transformada em preço, oferta, disponibilidade ou estoque;
- os estilos do registro ficaram em um módulo exclusivo do dossiê, evitando cerca de 2 KiB inúteis nas outras páginas;
- regras de evolução para registros explícitos foram documentadas em `docs/REGISTRO-PUBLICO-DA-EDICAO.md`.

### Proteção contra regressão

O verificador recorta apenas o registro visível, exige dez posições e frações, compara quantidades `produced`/`not-produced` com `producedPieces`, rejeita linguagem de reserva, disponibilidade ou proprietário e confirma limites de estado e privacidade. A contagem estruturada precisa coincidir e, durante a prototipagem, nenhuma peça numerada pode surgir. O módulo preserva cinco colunas no desktop e duas no celular sem aumentar o pacote global.

## Ciclo 27 — laboratório 3D progressivo e resiliente

Data: 24 de agosto de 2026.

### Dependência visual frágil

O laboratório de brilho e fosco aguardava o campo de visão para carregar, mas o estado anterior dizia apenas “preparando”. Sem WebGL, numa transferência interrompida ou com JavaScript desativado, a decisão de acabamento desaparecia justamente no trecho que deveria explicá-la. O carregamento também não reconhecia economia de dados nem conexão muito limitada.

### Intervenção

- o HTML inicial agora declara a direção acetinada, a meta conceitual de 32% e aponta para as quatro amostras estáticas;
- um botão permite solicitar o 3D manualmente antes da interseção ou quando a transferência automática é evitada;
- `saveData`, `prefers-reduced-data` e conexões `slow-2g`/`2g` mantêm o modo manual, sempre por detecção progressiva;
- a disponibilidade de WebGL 2 ou WebGL 1 é conferida antes da importação do simulador;
- ausência de WebGL gera alternativa textual específica, sem esconder a comparação;
- uma barreira de erro cobre falha da importação ou da renderização da cena;
- o estado de carregamento é o único anunciado como atualização viva; os estados estáveis permanecem leitura comum;
- o aviso em `noscript` conduz às quatro faixas quando JavaScript está desativado;
- movimento reduzido continua desligando rotação automática e mudando o canvas para renderização sob demanda;
- o pequeno estilo do controle e do aviso ficou num módulo exclusivo, preservando o pacote global e o dossiê público.

### Proteção contra regressão

O verificador exige os três sinais de rede, detecção WebGL, barreira de erro, `noscript`, botão de 44 px e preferência de movimento. No export, confirma o conteúdo útil do estado inicial. No build, localiza o pacote do laboratório pelas mensagens do próprio controle e prova que ele não aparece entre os scripts iniciais do Caderno. O Caderno permanece abaixo do orçamento de 40 KiB de CSS inicial.

## Ciclo 28 — dimensões intrínsecas das imagens

Data: 24 de agosto de 2026.

### Metadado incompleto

O componente responsivo conhecia a largura dos 11 WebPs mestres para montar `srcset`, mas não publicava `width` e `height`. Vários contêineres já reservavam espaço com CSS, porém essa proteção era indireta e cada imagem deixava de levar sua própria proporção no HTML.

### Intervenção

- criado `app/lib/image-data.json` com largura e altura reais das 11 imagens-mestre;
- `ResponsiveImage` passou a derivar `srcset`, `width` e `height` do mesmo registro;
- as 17 ocorrências publicadas agora carregam dimensões intrínsecas sem abandonar `sizes`, carregamento tardio ou prioridade da imagem principal;
- `scripts/optimize-images.mjs` atualiza o contrato sempre que regenera os WebPs;
- a estilização existente com `object-fit` continua definindo o recorte visual, enquanto os atributos preservam a razão natural como informação do recurso;
- o procedimento foi registrado em `docs/IMAGENS-E-ESTABILIDADE.md`.

### Proteção contra regressão

O verificador compara o inventário do contrato com os WebPs mestres publicados, lê cada dimensão com Sharp e confere as variantes de 480 e 800 px. A proporção das variantes pode diferir do mestre em no máximo 0,002 por arredondamento. Em todos os HTMLs exportados, cada elemento `.responsive-image` precisa ter `width` e `height` iguais ao seu arquivo registrado; pelo menos 17 ocorrências devem permanecer cobertas.

## Ciclo 29 — metadados coerentes no erro 404

Data: 24 de agosto de 2026.

### Contradição encontrada

O Next.js adicionava `noindex` automaticamente ao documento 404, mas o layout raiz também publicava `index, follow`. O mesmo arquivo herdava título, descrição, canonical e `og:url` da home. O resultado era um erro corretamente desenhado, porém com duas instruções de indexação contraditórias e identidade de URL falsa no cabeçalho.

### Intervenção

- removida a diretiva `index, follow` global, desnecessária para páginas públicas indexáveis por padrão;
- mantido o `noindex` automático e único do `not-found`;
- definido título “Arquivo não encontrado · DÉCIMA”;
- criada descrição própria para o endereço inexistente;
- canonical e `og:url` agora apontam para `/404.html`, nunca para a home;
- Open Graph e Twitter receberam título e descrição coerentes com o erro;
- a página continua fora do sitemap e mantém o caminho de recuperação para o início;
- os critérios foram registrados em `docs/METADADOS-DA-PAGINA-404.md`.

### Proteção contra regressão

O verificador rejeita uma diretiva `index` explícita no layout raiz, exige exatamente uma meta robots com `noindex` no 404, confere título, descrição, canonical, `og:url`, cartão social e ação de retorno. O sitemap falha se incluir `/404` ou `/_not-found`.
