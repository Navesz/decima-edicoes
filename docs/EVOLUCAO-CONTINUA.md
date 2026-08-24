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
