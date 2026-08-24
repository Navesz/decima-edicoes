# Experiência instalada

## Papel do manifesto

`manifest.webmanifest` descreve a DÉCIMA quando um navegador ou sistema oferece instalação. Ele não substitui o site nem exige um service worker: a publicação continua sendo um conjunto estático servido pelo GitHub Pages.

O contrato declara:

- identidade longa e curta;
- idioma `pt-BR` e direção de leitura `ltr`;
- início, identificador e escopo ajustados ao `basePath`;
- apresentação `standalone`;
- cores de abertura e interface;
- ícone comum e ícone mascarável;
- categorias de design e lifestyle;
- dois atalhos prioritários.

## Atalhos

1. **Coleções** abre o arquivo público em `/colecoes/`.
2. **Caderno** abre decisões, protótipos e critérios em `/caderno/`.

Os dois destinos ficam dentro do escopo do manifesto tanto no ambiente local quanto em `/decima-edicoes/`. Nome completo, nome curto e descrição permanecem em português. A existência do campo não garante que o sistema operacional exibirá os atalhos; essa apresentação é decisão do agente do usuário.

## Proteção contra regressão

O build exige exatamente dois atalhos na ordem editorial, confere nomes, descrições e URLs já transformadas pelo `basePath`, e rejeita qualquer destino fora do escopo. O manifesto também precisa manter idioma, direção, cores e os dois tipos de ícone.

## Referência

- [W3C — Web Application Manifest, shortcuts](https://www.w3.org/TR/appmanifest/#shortcuts-member)
