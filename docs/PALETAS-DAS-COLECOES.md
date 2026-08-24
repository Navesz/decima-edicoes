# Paletas das coleções

## Contrato

Cada coleção possui três cores com nome editorial e valor hexadecimal:

| Coleção | Cor 1 | Cor 2 | Cor 3 |
| --- | --- | --- | --- |
| Nórdica — Yggdrasil | Carvão `#171411` | Madeira âmbar `#9a6e3f` | Bronze claro `#c8a875` |
| Renaissance — Medallion | Nogueira profunda `#241b16` | Marfim antigo `#d7c5a0` | Ouro velho `#89643a` |
| Atelier — Meridian | Madeira escura `#191512` | Marfim mineral `#e4d3af` | Bronze linear `#a77b40` |

Os nomes descrevem direção visual, não especificação de tinta, espécie de madeira ou lote de acabamento. A ficha técnica real só poderá congelar cor depois dos corpos de prova.

## Representação acessível

No arquivo de Coleções, cada trio visual é exposto como uma única imagem semântica com nome completo: coleção, nome editorial de cada cor e hexadecimal. Os nove elementos gráficos internos recebem `aria-hidden="true"`; assim, tecnologia assistiva não encontra swatches vazios nem repete informação.

Os dados vivem junto da coleção em `app/lib/collections.ts`. Renderização visual e descrição acessível consomem os mesmos objetos `{ name, hex }`.

## Proteção contra regressão

O verificador exige três paletas, nove swatches, papel de imagem, nome acessível completo, elementos decorativos ocultos, nomes com conteúdo e hexadecimais de seis dígitos. Qualquer diferença entre dado e HTML falha o build.
