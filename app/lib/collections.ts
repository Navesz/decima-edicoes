import { assetPath } from './base-path';

export type Collection = {
  slug: string;
  number: string;
  family: string;
  name: string;
  year: string;
  image: string;
  status: string;
  description: string;
  palette: string[];
};

export const collections: Collection[] = [
  {
    slug: 'nordica-yggdrasil',
    number: '01',
    family: 'Nórdica',
    name: 'Yggdrasil',
    year: '2026',
    image: assetPath('/images/hero-yggdrasil.png'),
    status: 'Edição inaugural · 10 peças',
    description: 'Uma árvore, dez objetos irrepetíveis. Carvão, madeira natural e o calor contido do bronze.',
    palette: ['#171411', '#9a6e3f', '#c8a875'],
  },
  {
    slug: 'renaissance-medallion',
    number: '02',
    family: 'Renaissance',
    name: 'Medallion',
    year: 'Estudo',
    image: assetPath('/images/renaissance-medallion.png'),
    status: 'Em desenvolvimento',
    description: 'Ornamento e simetria conduzidos por uma paleta contida de nogueira, marfim e ouro velho.',
    palette: ['#241b16', '#d7c5a0', '#89643a'],
  },
  {
    slug: 'atelier-meridian',
    number: '03',
    family: 'Atelier',
    name: 'Meridian',
    year: 'Estudo',
    image: assetPath('/images/sunburst.png'),
    status: 'Arquivo de conceito',
    description: 'Ritmo radial e geometrias precisas em madeira escura, marfim mineral e linhas de bronze.',
    palette: ['#191512', '#e4d3af', '#a77b40'],
  },
];

export const buildRules = [
  ['01', 'Uma madeira', 'Tampo maciço, de uma única espécie e já nivelado. Painéis emendados ficam fora da primeira edição.'],
  ['02', 'Arte no plano', 'Toda a linguagem gráfica vive apenas no topo. A lateral permanece madeira real, limpa e visível.'],
  ['03', 'Aço honesto', 'Base baixa em metalon reto disponível no Brasil. Nada de perfis cônicos ou formas que exijam ferramental especial.'],
  ['04', 'Paleta contida', 'Duas ou três cores por coleção: carvão, marfim, bronze envelhecido e o próprio tom da madeira.'],
  ['05', 'Edição encerrada', 'A décima peça encerra a arte. Um retorno da família nasce com outro subtítulo e outro desenho.'],
] as const;

export const gallery = [
  assetPath('/images/hero-yggdrasil.png'),
  assetPath('/images/yggdrasil-dark.png'),
  assetPath('/images/yggdrasil-ivory.png'),
  assetPath('/images/yggdrasil-satin.png'),
];
