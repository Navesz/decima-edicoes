# Rolagem horizontal acessível

## Problema

Tabelas e matrizes largas precisam continuar legíveis no celular. `overflow-x: auto` permite gesto de toque, mas uma região genérica sem foco e sem nome pode ser difícil de identificar ou operar por teclado.

## Contrato

Existem 13 regiões horizontais intencionais:

- 2 no Caderno: Portão 00 e registro de decisões;
- 1 no Guia de Marca: contraste da paleta;
- 4 na Ficha 00: corpos de prova, acabamento, estrutura e Portão;
- 4 no briefing do tampo: geometria, evidências, cotações e recebimento;
- 2 no modelo de certificado: protocolo e custódia.

Cada região usa `role="region"`, `tabindex="0"` e um `aria-label` específico que informa o conteúdo e a possibilidade de rolagem horizontal. O foco global visível já existente mostra quando as setas do teclado podem operar aquela área.

Nos documentos A4, o overflow saiu da seção inteira e passou a envolver apenas o conteúdo largo. Campos e texto comuns não criam paradas extras. Na impressão, a região volta a `overflow: visible`, preservando a paginação do papel.

## Arquitetura

`HorizontalScrollRegion` é um componente de servidor mínimo. Ele padroniza semântica e foco sem hidratação ou JavaScript. Caderno e Guia mantêm suas regiões explícitas, agora também com papel semântico.

## Proteção contra regressão

O verificador remove scripts do HTML, conta as regiões por documento e exige papel, foco, nome e instrução. O CSS precisa limitar overflow à classe dedicada e liberar o conteúdo na impressão. O componente compartilhado não pode virar uma ilha cliente.
