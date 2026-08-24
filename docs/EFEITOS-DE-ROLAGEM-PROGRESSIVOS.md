# Efeitos de rolagem progressivos

## Base sem JavaScript pesado

Todo elemento `.gsap-reveal` nasce visível e no fluxo normal. A imagem de parallax também possui enquadramento útil sem transformação. GSAP e ScrollTrigger aprimoram essa base; não revelam conteúdo indispensável.

## Momento de carregamento

`ScrollEffects` observa o primeiro `.gsap-reveal`, localizado depois do hero. A transferência começa quando esse elemento entra numa margem de 320 px do viewport, com limiar de 1%.

Ao disparar:

1. o observador é desconectado;
2. GSAP e ScrollTrigger são importados em paralelo;
3. o plugin é registrado;
4. revelações e parallax são criados dentro de um contexto reversível;
5. `<html>` recebe `data-scroll-effects="active"`.

## Condições que preservam a versão estática

- `prefers-reduced-motion: reduce`;
- `prefers-reduced-data: reduce`;
- `navigator.connection.saveData`;
- `effectiveType` `slow-2g` ou `2g`;
- ausência de `IntersectionObserver`;
- ausência de qualquer `.gsap-reveal`.

Nenhum desses caminhos esconde texto ou imagem. Eles apenas evitam a transferência e a transformação.

## Medição do build

| Pacote assíncrono | Tamanho sem compressão | Script inicial |
| --- | ---: | --- |
| GSAP | 69,0 KiB | não |
| ScrollTrigger | 42,4 KiB | não |
| Total | 111,4 KiB | não |

O verificador limita a soma a 120 KiB e localiza os pacotes pelo conteúdo compilado, não pelo nome variável do arquivo.

## Limpeza

Se a página desmontar, o processo marca a importação como cancelada, desconecta o observador, reverte o contexto GSAP e remove `data-scroll-effects`. Uma importação concluída depois do cancelamento não registra plugin nem cria animação.

## Referências

- [GSAP — documentação oficial](https://gsap.com/docs/v3/)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [W3C Media Queries Level 5](https://www.w3.org/TR/mediaqueries-5/)
