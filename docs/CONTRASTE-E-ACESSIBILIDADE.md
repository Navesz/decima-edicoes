# Contraste e acessibilidade da marca

A identidade usa os limiares de contraste da WCAG 2.2 como piso técnico:

- texto comum: pelo menos 4,5:1;
- texto grande: pelo menos 3:1;
- ícones e objetos gráficos necessários para entender ou operar a interface: pelo menos 3:1.

Fontes oficiais: [Understanding SC 1.4.3 — Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum), [Technique G207 — 3:1 for icons](https://www.w3.org/WAI/WCAG22/Techniques/general/G207) e [WCAG 2.2](https://www.w3.org/TR/wcag/).

## Pares aprovados para texto comum

Os valores são calculados durante o build, sem arredondar antes da comparação:

- carvão sobre papel: 13,75:1;
- carvão sobre papel claro: 15,59:1;
- carvão sobre marfim: 14,92:1;
- bronze-tinta sobre papel: 6,54:1;
- bronze-tinta sobre papel claro: 7,42:1;
- marfim sobre carvão: 14,92:1;
- bronze sobre carvão: 5,81:1.

## Pares restritos

- bronze sobre papel: 2,37:1;
- bronze sobre papel claro: 2,68:1.

Esses dois pares não carregam texto, estado, controle ou ícone necessário. Podem aparecer apenas como detalhe decorativo dispensável. Em fundo claro, informação bronze usa o token `bronzeInk` (`#684318`).

## Implementação

Os pares e limiares vivem em `app/lib/brand-data.json`. `app/lib/brand.ts` calcula os valores exibidos no Guia de Marca. O verificador calcula tudo novamente, de forma independente, e bloqueia o deploy quando um par aprovado cai abaixo do seu limiar, referencia uma cor inexistente ou diverge do valor publicado.

A exceção normativa para texto que faz parte de logotipo não é usada como atalho para a interface. O sistema preserva contraste mesmo quando a marca, isoladamente, poderia estar fora do critério.
