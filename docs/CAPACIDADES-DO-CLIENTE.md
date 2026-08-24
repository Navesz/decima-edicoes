# Contrato de capacidades do cliente

## Objetivo

`app/lib/client-capabilities.ts` concentra sinais usados para decidir se um aprimoramento opcional deve ser transferido ou animado. Ele não cria perfil, cookie, armazenamento local nem requisição de rede.

## Funções

### `prefersReducedMotion()`

Retorna o resultado de `prefers-reduced-motion: reduce`.

### `shouldAvoidOptionalTransfer()`

Retorna verdadeiro se qualquer sinal estiver ativo:

- `prefers-reduced-data: reduce`;
- `navigator.connection.saveData`;
- `effectiveType` igual a `slow-2g`;
- `effectiveType` igual a `2g`.

### `usesCoarsePointer()`

Retorna verdadeiro para `pointer: coarse` ou `hover: none`. Essa decisão só é necessária para o Lenis, porque a suavização de roda não acrescenta valor ao gesto de toque.

## Consumidores

| Experiência | Movimento reduzido | Transferência opcional | Ponteiro grosseiro |
| --- | ---: | ---: | ---: |
| laboratório Three.js | tratado dentro do canvas | modo manual | não bloqueia |
| GSAP + ScrollTrigger | conteúdo estático | conteúdo estático | animação permitida |
| Framer Motion | cartões estáticos | cartões estáticos | cartões estáticos |
| Lenis | rolagem nativa | rolagem nativa | rolagem nativa |

O laboratório mantém controle próprio de movimento depois de carregado porque o canvas pode ser solicitado manualmente mesmo com outras preferências; nesse caso, rotação automática e loop contínuo continuam desativados.

## Compatibilidade

`mediaMatches()` testa a existência de `window` e usa `matchMedia` quando disponível. A leitura de conexão testa a existência de `navigator`. APIs ausentes equivalem a sinal não detectado, nunca a erro ou bloqueio total.

O contrato deve permanecer síncrono, local e sem efeitos colaterais. Componentes chamam as funções apenas dentro de efeitos no cliente.

## Atualização

1. alterar o sinal uma única vez em `client-capabilities.ts`;
2. revisar os três consumidores;
3. atualizar a matriz deste documento se a política mudar;
4. executar lint, build e `npm run verify`;
5. não usar capacidade do dispositivo como dado de identidade ou telemetria.

## Referências

- [W3C Media Queries Level 5](https://www.w3.org/TR/mediaqueries-5/)
- [WICG Network Information API](https://wicg.github.io/netinfo/)
