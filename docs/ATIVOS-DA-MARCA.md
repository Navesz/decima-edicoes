# Ativos da marca

Os caminhos oficiais vivem em `app/lib/brand-data.json` e são verificados no build.

## Assinatura completa

- `public/brand/decima-logo-dark.png`: wordmark escuro para fundos claros;
- `public/brand/decima-logo-light.png`: wordmark claro para fundos escuros.

Os PNGs têm fundo transparente e são a referência atual da assinatura completa. Não devem ser esticados, recoloridos parcialmente ou usados sobre arte visualmente ruidosa.

## Símbolo vetorial

- `public/brand/decima-symbol-dark.svg`: carvão e bronze, para fundo claro;
- `public/brand/decima-symbol-light.svg`: marfim e bronze, para fundo escuro;
- `app/icon.png`: aplicação quadrada de 512 × 512 px usada pelo navegador e manifesto.
- `public/brand/decima-maskable.png`: aplicação instalável de 512 × 512 px, com fundo carvão totalmente opaco e símbolo dentro da zona segura de máscara.

Os dois SVGs usam o mesmo `viewBox` 512 × 512, círculo de raio 192, diagonais canônicas e ponto central de raio 15. Não contêm texto, fonte, imagem, script, `use`, link nem recurso externo. Isso torna o símbolo escalável e portátil sem fingir que a assinatura tipográfica completa já foi vetorizada em curvas.

## Produção física

O SVG é um master visual, não um arquivo universal de fabricação. Laser, CNC, gravação, baixo-relevo ou plaqueta exigem que o fornecedor ajuste espessura de traço, fechamento de curvas, escala, tolerância e material. Toda conversão precisa de prova física aprovada antes de entrar na Peça 01.

O ponto bronze é uma cor institucional no arquivo visual; a forma de materializá-lo — pintura, metal, gravação ou ausência de preenchimento — continua sendo decisão de protótipo.

O ícone mascarável é um ativo digital derivado. Seu fundo quadrado pode ser recortado pelo sistema operacional em círculo, squircle ou outra máscara; ele não deve ser enviado como master para gravação física.
