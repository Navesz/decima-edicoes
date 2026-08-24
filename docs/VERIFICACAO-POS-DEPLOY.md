# Verificação pós-deploy

## Lacuna fechada

Validar `out/` prova que o artefato está coerente, mas não prova que o GitHub Pages terminou de publicar aquela revisão. O job de deploy agora executa um smoke test contra a própria URL retornada pela Action oficial.

## Identidade do build

O job de build fornece `github.sha` como `NEXT_PUBLIC_BUILD_SHA`. O layout publica esse valor em:

```html
<meta name="build-revision" content="…">
```

Em desenvolvimento e builds locais sem a variável, o valor é `local`. A marca não participa da interface, do SEO editorial nem de dados pessoais; serve apenas para relacionar artefato, commit e produção.

## Smoke test

Depois do deploy, o workflow:

1. tenta por até 60 segundos encontrar o SHA esperado na home, tolerando a propagação do Pages;
2. exige manifesto HTTP válido, tipo `application/manifest+json` e escopo `/decima-edicoes/`;
3. abre a rota profunda de Yggdrasil e confirma seu conteúdo;
4. exige que a variante de hero seja servida como `image/webp`;
5. consulta uma URL inexistente e exige HTTP 404 com `noindex`.

O teste usa `curl`, `grep` e arquivos temporários do runner. Não adiciona Action, token, checkout, dependência npm ou permissão ao job de deploy. Se a versão nova não aparecer no limite ou qualquer contrato público falhar, o workflow fica vermelho.

## Proteção contra regressão

O verificador local exige a meta de revisão nas oito rotas e confere no YAML: variável imutável, ordem depois do deploy, limite de tentativas, manifesto, mídia, rota profunda e 404. As cinco Actions continuam fixadas por SHA e as permissões permanecem separadas por job.
