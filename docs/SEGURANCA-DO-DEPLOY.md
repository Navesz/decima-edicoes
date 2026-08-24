# Segurança do deploy

O workflow de GitHub Pages fixa cada Action oficial em um SHA completo de 40 caracteres. Tags como `v6` continuam no comentário para leitura humana, mas não controlam o código executado.

O GitHub documenta que o SHA completo é a única referência imutável para uma Action e permite exigir essa política no repositório. Fontes: [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use), [Managing GitHub Actions settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository) e [custom workflows for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Pins atuais

- `actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803` — `v6`;
- `actions/setup-node@249970729cb0ef3589644e2896645e5dc5ba9c38` — `v6`;
- `actions/configure-pages@45bfe0192ca1faeb007ade9deae92b16b8254a0d` — `v6`;
- `actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9` — `v5`;
- `actions/deploy-pages@cd2ce8fcbc39b97be8ca5fce6e763baed58fa128` — `v5`.

Esses SHAs foram resolvidos das tags oficiais e confirmados pela API do GitHub como objetos do tipo `commit` nos repositórios da organização `actions`.

## Privilégio mínimo

O job `build` recebe apenas:

- `contents: read`, para checkout do repositório;
- `pages: read`, para leitura da configuração existente pelo `configure-pages`.

O job `deploy`, isolado e dependente do build, recebe:

- `pages: write`, para criar a implantação;
- `id-token: write`, para a validação OIDC exigida pelo GitHub Pages.

Não há permissão de escrita global. O deploy usa o ambiente `github-pages`, como recomendado pela documentação oficial.

## Como atualizar

1. ler o changelog e a release oficial da Action;
2. resolver a tag pretendida com `git ls-remote`;
3. confirmar pela API que o objeto da tag aponta para um `commit` no repositório oficial;
4. trocar o SHA e o comentário de versão juntos;
5. atualizar o mapa `pinnedActions` em `scripts/verify-static.mjs`;
6. executar lint, build, verificação e auditoria;
7. acompanhar o workflow até o deploy e confirmar a página publicada.

O verificador rejeita referência móvel, Action fora da organização oficial, comentário divergente, permissão global, escrita no build ou deploy sem dependência e ambiente corretos.
