# Contrato do projeto

`app/lib/project-data.json` é a fonte canônica dos fatos que precisam permanecer iguais em toda a DÉCIMA.

O contrato reúne:

- identidade da coleção inaugural;
- tamanho, produção e estado comercial da edição;
- número e código interno do protótipo;
- dimensões de partida do produto;
- versões e data dos documentos vivos;
- quatro corpos de prova;
- seis aprovações do Portão 00.
- registro versionado das decisões atuais, com fundamento e estado.

`app/lib/project.ts` transforma os valores brutos em rótulos de apresentação, como `01/10`, `30–40 mm` e números por extenso. Páginas não devem reconstruir esses rótulos nem manter cópias locais dos corpos de prova ou das aprovações.

## Como atualizar

1. altere o fato em `app/lib/project-data.json`;
2. atualize `documents.updatedAt` e `documents.updatedAtIso` quando a mudança representar uma nova revisão pública;
3. execute `npm run lint`, `npm run build` e `npm run verify`;
4. confira no resultado quais páginas foram afetadas antes de publicar.

O verificador lê o mesmo JSON usado pelo site. Ele compara tiragem, quantidade produzida, dimensões, versão do Caderno, corpos de prova e aprovações com o HTML exportado. Também exige que os quatro consumidores centrais continuem importando o contrato.

Os textos de `decisionLog` podem usar os marcadores `{runSize}`, `{lastPieceFraction}`, `{prototypeNumber}`, `{firstPiece}` e `{gateItemsWord}`. Eles são resolvidos por `app/lib/project.ts`; isso evita repetir números dentro do próprio contrato. Marcadores desconhecidos fazem a verificação falhar.

## Regra comercial

O valor `edition.commercialStatus` permanece `prototyping` enquanto o Portão 00 não estiver integralmente aprovado. Uma mudança desse estado precisa vir acompanhada da nova regra de publicação, da ficha técnica congelada e da retirada dos avisos de indisponibilidade; o deploy falha se o estado mudar isoladamente.
