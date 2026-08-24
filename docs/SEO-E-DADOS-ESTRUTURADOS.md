# SEO e dados estruturados

## Modelo atual

O JSON-LD da DÉCIMA descreve apenas entidades que já existem:

- `Brand` para a identidade DÉCIMA Edições;
- `WebSite` para o conjunto de páginas publicado no GitHub Pages;
- `CollectionPage` para o arquivo de coleções;
- `WebPage` para o Caderno e o dossiê Yggdrasil;
- `ProductModel` para a especificação conceitual de Yggdrasil;
- `BreadcrumbList` para a hierarquia das três páginas públicas internas.

Marca, website, páginas e modelo são conectados por `@id`. Os mesmos IDs podem aparecer em scripts diferentes e são reunidos pelo processador JSON-LD.

## Por que ProductModel

Yggdrasil ainda é uma especificação em prototipagem, não uma unidade fabricada e oferecida. A definição oficial de `ProductModel` contempla a descrição técnica de um modelo pelo fabricante, enquanto `Product` representa um produto ou serviço oferecido. Por isso o grafo não declara `Offer`, preço, moeda, disponibilidade, SKU, GTIN, avaliação ou review.

As medidas usam `QuantitativeValue`: largura e profundidade representam o diâmetro de partida; altura representa a altura total. A espessura do tampo, a tiragem prevista e o estado comercial permanecem em `additionalProperty` porque são características específicas do conceito.

## Regra de mudança comercial

Enquanto `edition.commercialStatus` for `prototyping`, o verificador rejeita propriedades comerciais e o tipo `Offer`. A modelagem só deve mudar depois de:

1. Portão 00 integralmente aprovado;
2. peça real fabricada e documentada;
3. preço, prazo, entrega e garantia definidos;
4. canal de compra ou encomenda realmente disponível.

## Referências oficiais

- [WebSite](https://schema.org/WebSite)
- [ProductModel](https://schema.org/ProductModel)
- [Product](https://schema.org/Product)
- [BreadcrumbList](https://schema.org/BreadcrumbList)
- [brand](https://schema.org/brand)
