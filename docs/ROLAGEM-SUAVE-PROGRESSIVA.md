# Rolagem suave progressiva

## Princípio

A rolagem nativa é a linha de base. Lenis só entra quando pode acrescentar suavidade à roda do mouse sem contrariar preferência, capacidade de entrada ou condição de rede.

## Matriz de decisão

| Sinal detectado | Resultado |
| --- | --- |
| `prefers-reduced-motion: reduce` | rolagem nativa |
| `prefers-reduced-data: reduce` | rolagem nativa |
| `navigator.connection.saveData` | rolagem nativa |
| `effectiveType` `slow-2g` ou `2g` | rolagem nativa |
| `pointer: coarse` | rolagem nativa |
| `hover: none` | rolagem nativa |
| nenhum dos sinais acima | Lenis pode ser carregado no período ocioso |

As APIs de conexão e a preferência de redução de dados não existem em todos os navegadores. A ausência delas não é erro: a decisão continua com os sinais disponíveis.

## Agendamento

Em contexto elegível, `requestIdleCallback` inicia a importação dinâmica, com timeout de 1,6 segundo para evitar espera indefinida. Sem essa API, um temporizador de 900 ms cumpre a mesma separação do trabalho crítico de carregamento.

O pacote da biblioteca não aparece em nenhum `<script src>` inicial. No build medido, o chunk assíncrono do Lenis possui 18,3 KiB sem compressão.

## Ciclo de vida

Quando a instância começa, o elemento `<html>` recebe `data-smooth-scroll="active"`. A desmontagem:

- marca o carregamento assíncrono como cancelado;
- cancela o `requestAnimationFrame`;
- cancela callback ocioso ou temporizador pendente;
- destrói a instância Lenis;
- remove o atributo de estado.

## Garantias

- o site permanece navegável sem Lenis;
- links de fragmento e foco não dependem da biblioteca;
- nenhuma preferência reduzida é simulada ou persistida;
- nenhuma informação de rede é armazenada;
- o verificador confirma separação do chunk e todas as condições de saída.

## Referências

- [Lenis — documentação oficial](https://github.com/darkroomengineering/lenis)
- [W3C Media Queries Level 5 — preferências do usuário](https://www.w3.org/TR/mediaqueries-5/)
- [WICG Network Information API](https://wicg.github.io/netinfo/)
