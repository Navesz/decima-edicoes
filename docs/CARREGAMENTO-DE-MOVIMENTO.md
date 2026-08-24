# Carregamento das bibliotecas de movimento

## Decisão

As bibliotecas de movimento fazem parte da linguagem digital da DÉCIMA, mas não devem transformar todo o documento em aplicação cliente.

- Framer Motion: ilha dos cartões de coleção;
- GSAP + ScrollTrigger: revelações e parallax, por importação dinâmica;
- Lenis: rolagem suave, por importação dinâmica depois do carregamento;
- Three.js: laboratório 3D, por proximidade, escolha manual ou condição do dispositivo.

## Framer Motion

`HomePage` é componente de servidor. `MotionArticle` é a fronteira cliente que envolve somente os três cartões interativos.

A ilha usa:

- `LazyMotion` em modo `strict`;
- elementos mínimos de `framer-motion/m`;
- `domAnimation` em `motion-features.ts`, carregado por `import()`;
- `useReducedMotion` para desativar o deslocamento no hover.

O hero não usa mais wrappers do Framer. Eles estavam configurados com `initial={false}` para impedir conteúdo invisível antes da hidratação e não produziam uma entrada que justificasse o pacote completo.

## Medição reproduzível

Build com o mesmo `basePath` do GitHub Pages, sem compressão de transferência:

| Estado | JavaScript inicial da home | Diferença |
| --- | ---: | ---: |
| antes | 715,8 KiB | — |
| ilha mínima | 623,6 KiB | −92,2 KiB (−12,9%) |

Os números somam apenas arquivos ligados por `<script src>` no HTML exportado. Não representam bytes comprimidos, tempo de execução nem uma nota de laboratório externa. O pacote de recursos assíncrono não entra nessa soma inicial.

## Regras

- conteúdo essencial nunca nasce com `opacity: 0`;
- a home não recebe `'use client'`;
- a home não importa Framer diretamente;
- qualquer uso de Framer passa pela ilha mínima;
- recursos DOM ficam em importação assíncrona;
- movimento reduzido remove a transformação de hover;
- o HTML inicial da home não pode exceder 650 KiB de JavaScript;
- GSAP, Lenis e Three.js continuam em fronteiras próprias.

## Referências

- [Motion — reduzir o tamanho do pacote React](https://motion.dev/docs/react-reduce-bundle-size)
- [Motion — acessibilidade e movimento reduzido](https://motion.dev/docs/react-accessibility)
