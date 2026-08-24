# Navegação e estado atual

## Decisão

O cabeçalho recebe a área atual diretamente de cada página. A informação não é inferida no navegador e não depende de URL, efeito ou hidratação adicional.

O contrato possui três valores:

- `home`: marca a assinatura que volta ao início;
- `collections`: marca Coleções tanto no arquivo quanto no dossiê Yggdrasil;
- `notebook`: marca Caderno em sua capa e nos quatro documentos internos.

## Semântica

O destino correspondente recebe `aria-current="page"`. A home possui uma indicação no link da marca. Nas demais áreas, a mesma indicação existe no menu desktop e no menu móvel; apenas uma dessas navegações é exposta por vez conforme o layout e o estado do diálogo.

“Manifesto” é uma âncora da home, não uma página independente, e por isso não recebe `aria-current="page"`. A página 404 também não inventa uma seção atual.

## Proteção contra regressão

O verificador confere cada documento exportado. A home precisa ter um indicador apontando ao início; as duas rotas de Coleções precisam ter dois indicadores apontando ao arquivo; as cinco rotas do Caderno precisam ter dois indicadores apontando à sua capa. Qualquer contagem ou destino divergente falha o build.

No fonte, o contrato tipado e as três aplicações de `aria-current` — marca, navegação principal e navegação móvel — também são obrigatórios.
