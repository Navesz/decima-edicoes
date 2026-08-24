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
