# Formulário de interesse progressivo

## Decisão

O fluxo de interesse é uma demonstração local no fim da página inicial. Sua interface precisa estar presente no HTML, mas a lógica de validação e confirmação não precisa entrar no primeiro carregamento.

`InterestFormLoader` publica uma fachada completa e inativa. Quando a seção chega a 360 px do viewport, o navegador solicita `InterestForm` em um pacote separado e habilita a simulação. Em navegadores sem `IntersectionObserver`, a versão ativa é solicitada logo após a hidratação para preservar a função.

## Experiência base

- nome, e-mail, seletor e chamada aparecem no HTML inicial;
- o `fieldset` nasce desabilitado, portanto a página sem JavaScript nunca aceita dados;
- o formulário não possui `action` e não aponta para serviço externo;
- o aviso declara que nenhum dado é transmitido, armazenado ou usado como reserva;
- `noscript` explica por que os campos permanecem inativos;
- atributos de nome, e-mail, preenchimento automático e limites continuam publicados;
- a transição ocorre antes de o usuário alcançar a seção, sem exigir um clique extra.

## Medição reproduzível

Build estático com o `basePath` do GitHub Pages, somando os arquivos ligados por `<script src>` no HTML:

| Estado | JavaScript inicial da home | Diferença |
| --- | ---: | ---: |
| antes | 580,0 KiB | — |
| formulário por proximidade | 572,9 KiB | −7,1 KiB |

O pacote ativo identificado pela confirmação do fluxo mede 3,4 KiB e não aparece entre os scripts iniciais. Os números são bytes sem compressão de transferência e não representam tempo de execução.

## Proteção contra regressão

O verificador exige importação dinâmica, observador, margem de 360 px, limiar de 1%, alternativa para navegador sem observador e estados `static`/`active`. O HTML deve conter exatamente uma fachada estática, `fieldset` desabilitado, restrições de campo e aviso sem JavaScript. O pacote ativo não pode ser inicial nem exceder 10 KiB; a home inteira passa a ter orçamento de 580 KiB.
