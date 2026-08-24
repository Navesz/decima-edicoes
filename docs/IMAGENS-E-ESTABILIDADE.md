# Imagens responsivas e estabilidade visual

## Contrato dimensional

`app/lib/image-data.json` é o inventário das imagens editoriais públicas. Cada chave corresponde a um WebP mestre em `public/images` e declara sua largura e altura reais.

`ResponsiveImage` usa esse contrato para publicar quatro informações coordenadas:

- `src` com o mestre;
- `srcset` com variantes de 480 px, 800 px e largura integral;
- `sizes` definido por cada contexto de layout;
- `width` e `height` com a proporção intrínseca do mestre.

Os atributos dimensionais são informação do recurso. O recorte de apresentação continua sob responsabilidade dos contêineres e de `object-fit`, especialmente nos heróis, galerias quadradas e painéis editoriais.

## Atualização

1. colocar ou substituir o PNG original em `assets/source-images`;
2. executar `npm run images:optimize`;
3. revisar o WebP mestre e as variantes de 480/800 px;
4. executar `npm run build` e `npm run verify`;
5. inspecionar qualquer falha de inventário, dimensão ou proporção antes de publicar.

O otimizador escreve novamente `image-data.json` a partir dos metadados das fontes. Não atualizar largura ou altura manualmente sem conferir o arquivo correspondente.

## Regras verificadas

- o conjunto de chaves do contrato deve ser idêntico ao conjunto de WebPs mestres;
- largura e altura declaradas devem coincidir com os metadados lidos por Sharp;
- toda imagem mestre precisa das variantes de 480 e 800 px;
- a variante deve ter a largura indicada no nome;
- a diferença de proporção entre variante e mestre não pode superar 0,002;
- toda `.responsive-image` exportada precisa estar no contrato;
- seus atributos HTML devem coincidir com largura e altura declaradas;
- as rotas públicas precisam manter pelo menos 17 ocorrências verificadas.

## Referências

- [HTML Living Standard — atributos dimensionais de imagens](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-dim-width)
- [web.dev — otimização de Cumulative Layout Shift](https://web.dev/articles/optimize-cls)

O contrato não promete uma pontuação isolada de desempenho. Ele remove uma ambiguidade objetiva do HTML e torna a relação entre arquivo, variantes e marcação verificável.
