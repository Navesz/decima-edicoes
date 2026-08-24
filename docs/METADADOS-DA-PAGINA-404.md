# Metadados da página 404

## Regra

Um endereço inexistente não representa a home e não deve publicar sinais contraditórios. O export precisa conter:

- uma única meta robots com `noindex`;
- título “Arquivo não encontrado · DÉCIMA”;
- descrição específica do erro;
- canonical absoluto para `/404.html`;
- `og:url` igual ao canonical;
- título e descrição sociais próprios;
- nenhum endereço de erro no sitemap;
- link visível de retorno à página inicial.

## Por que o layout não declara `index`

Páginas públicas não precisam de uma diretiva positiva global para serem indexáveis. Remover `robots: { index: true, follow: true }` do layout evita que essa declaração seja combinada com o `noindex` que o Next.js injeta automaticamente em `not-found`.

As rotas internas continuam declarando `noindex, nofollow` nos próprios metadados. A remoção da diretiva raiz não altera essa proteção.

## Canonical

O canonical da home não pode ser herdado pelo 404: isso descreve um documento inexistente como se fosse a página principal. O export estático usa o endereço estável `/404.html`. Uma URL desconhecida atendida pelo GitHub Pages continua recebendo status 404; o canonical serve apenas para não falsificar a identidade da home dentro do documento de erro.

## Verificação

`npm run verify` lê o HTML final, não apenas o TypeScript. Assim, a auditoria observa a composição real feita pelo framework e falha diante de:

- zero ou mais de uma diretiva robots;
- qualquer diretiva positiva herdada;
- canonical ou `og:url` da home;
- título, descrição ou cartão social genéricos;
- entrada de erro no sitemap;
- perda da ação “Voltar ao início”.

## Referências oficiais

- [Next.js — convenção `not-found`](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
- [Next.js — API de Metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
