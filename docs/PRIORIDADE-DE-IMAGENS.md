# Prioridade das imagens

## Política

A prioridade de rede pertence somente à imagem que ocupa o primeiro enquadramento visual.

- home: um hero com `loading="eager"` e `fetchpriority="high"`;
- dossiê Yggdrasil: um hero com a mesma prioridade;
- arquivo de Coleções: quatro imagens adiadas;
- Caderno: uma imagem distante adiada;
- Guia de Marca: três imagens adiadas;
- documentos de texto: nenhuma imagem de conteúdo.

As duas imagens prioritárias e as 15 secundárias usam `decoding="async"`. As secundárias usam `loading="lazy"`; a política não promove automaticamente a primeira imagem de uma lista, pois Coleções começa com um hero tipográfico e o Caderno só mostra sua imagem várias seções abaixo.

## Motivo

Marcar muitas imagens como urgentes faz recursos fora da tela competirem com o hero, as fontes e o CSS. Adiar todas também é incorreto: o principal elemento visual da home e do produto precisa começar cedo. O contrato mantém a decisão explícita por rota.

## Proteção contra regressão

O verificador conta imagens, `eager`, `high`, `lazy` e `async` nos oito documentos. `eager` e `high` precisam descrever a mesma imagem. A quantidade restante deve ser exatamente a quantidade de imagens adiadas prevista para a rota.
