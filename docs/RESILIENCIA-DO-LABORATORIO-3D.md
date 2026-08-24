# Resiliência do laboratório 3D

## Papel do simulador

O canvas ajuda a perceber a passagem entre reflexão difusa e especular. Ele não define o sistema químico, não substitui corpos de prova e não pode ser a única fonte da decisão. A informação essencial é:

- direção visual: acetinado profundo;
- meta conceitual: 32% de brilho percebido;
- comparação: fosco, acetinado, semibrilho e espelhado;
- validação real: placas feitas com os materiais e as condições do fornecedor.

Essa informação já existe no HTML estático e continua disponível antes, durante e depois da tentativa de carregar o modelo.

## Matriz de comportamento

| Condição | Transferência do 3D | Experiência preservada |
| --- | --- | --- |
| WebGL disponível e conexão comum | automática perto da seção | fallback textual até a cena abrir |
| `saveData` ativo | somente após confirmação | direção, meta, quatro faixas e botão |
| `prefers-reduced-data: reduce` | somente após confirmação | direção, meta, quatro faixas e botão |
| conexão `slow-2g` ou `2g` | somente após confirmação | direção, meta, quatro faixas e botão |
| WebGL indisponível | nenhuma | mensagem específica e quatro faixas |
| importação ou renderização falha | tentativa encerrada | mensagem de falha, direção e validação real |
| JavaScript desativado | nenhuma | aviso em `noscript` e quatro faixas no documento |
| movimento reduzido | automática se a rede permitir | sem rotação automática e renderização sob demanda |

As APIs de conexão e a consulta de economia de dados não existem em todos os navegadores. Por isso elas apenas restringem carregamento quando presentes; sua ausência nunca impede o conteúdo estático nem o fluxo normal por visibilidade.

## Estados do fallback

- `idle`: conteúdo inicial útil e ação manual;
- `loading`: atualização anunciada com `role="status"` e `aria-live="polite"`;
- `unavailable`: WebGL não foi obtido;
- `error`: importação ou renderização falhou.

Estados estáveis não usam região viva. Isso evita que tecnologia assistiva anuncie uma decisão editorial normal como se fosse uma mudança urgente.

## Orçamento e separação

`finish-lab.tsx` continua atrás de `React.lazy`. O import só é renderizado depois da interseção ou da escolha manual. O verificador procura as frases exclusivas do controle no JavaScript gerado e rejeita o build caso esse pacote apareça entre os scripts iniciais do Caderno.

Os estilos do botão, da cópia alternativa e do `noscript` vivem em `finish-lab-loader.module.css`. O Caderno permanece abaixo do orçamento de 40 KiB de CSS inicial; outras rotas não recebem esse módulo.

## Referências técnicas

- [Media Queries Level 5 — preferência por redução de dados](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-data)
- [Network Information API — `saveData` e `effectiveType`](https://wicg.github.io/netinfo/)
- [WebGL Specification](https://registry.khronos.org/webgl/specs/latest/1.0/)

Essas capacidades são usadas com detecção de recurso. A comparação textual é a linha de base compatível.
