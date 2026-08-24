# Contrato da marca

Nome, assinatura, slogan, idioma, paleta e caminhos dos ativos oficiais vivem em `app/lib/brand-data.json`. Esse arquivo é a referência canônica para interfaces, metadados, manifesto, dados estruturados e Guia de Marca.

## Consumidores ligados

- `app/lib/brand.ts` expõe o contrato tipado ao projeto;
- `app/layout.tsx` monta título, assinatura social, título de instalação e cor do navegador;
- `app/manifest.ts` usa nome, nome curto, idioma, cor e ícone;
- `app/lib/site.ts` e `app/lib/structured-data.ts` ligam website e marca;
- cabeçalho, rodapé e assinatura visual usam o mesmo nome, descritor e slogan;
- `/caderno/marca/` gera paleta, textos institucionais e downloads pelos mesmos dados;
- `scripts/verify-static.mjs` compara o contrato com CSS, manifesto, HTML, ativos e JSON-LD.

## Como alterar

1. editar `app/lib/brand-data.json` sem remover acento, idioma ou caminhos absolutos a partir da raiz do site;
2. se uma cor mudar, atualizar o token correspondente em `app/globals.css` e a amostra visual de mesmo nome no módulo do Guia;
3. se um ativo mudar, substituir o arquivo e manter dimensões, transparência e contraste adequados;
4. executar `npm run lint`, `npm run build` e `npm run verify` com as variáveis do GitHub Pages;
5. revisar visualmente todas as aplicações antes de considerar a mudança uma nova versão da identidade.

O contrato garante coerência técnica. Ele não substitui busca de anterioridade, registro de marca nem validação de leitura com público real.
