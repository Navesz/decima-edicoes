# Registro público da edição

O dossiê de `Nórdica — Yggdrasil` publica dez posições numeradas. O registro nasce de `edition.runSize` e `edition.producedPieces` em `app/lib/project-data.json`; não possui uma contagem paralela escrita no componente.

## Estados atuais

- `Não produzida`: não existe objeto numerado, certificado, reserva nem propriedade associada à posição;
- `Produzida`: a peça física foi concluída, inspecionada e entrou formalmente na edição.

O Protótipo 00 nunca ocupa uma das dez posições. Enquanto `commercialStatus` for `prototyping`, a quantidade produzida precisa continuar zero.

O estado público não comunica disponibilidade comercial. Uma peça produzida pode estar no atelier, entregue ou em outra condição; isso exigirá um campo separado quando houver fluxo comercial real. “Reservada” e “disponível” não podem ser inferidas da produção.

## Numeração

Na fase atual, posições são geradas sequencialmente de 01/10 a 10/10. Antes de alterar `producedPieces` para um valor maior que zero, o contrato deverá evoluir para registros explícitos por peça, com pelo menos:

- número;
- código verificável do certificado;
- ano de conclusão;
- estado documental;
- referência pública do registro visual.

A contagem só muda depois da conclusão, inspeção e emissão documental. Encomenda, pagamento inicial ou intenção de compra não produzem número.

## Privacidade

O registro público pode mostrar número, código verificável, ano e estado documental. Por padrão, não publica nome, contato, endereço, valor, entrega nem histórico privado de custódia. Qualquer mudança exige finalidade, base e revisão do fluxo de dados antes da implementação.

## Proteção técnica

O verificador exige exatamente dez posições, frações ordenadas, estados alinhados à contagem canônica e mensagens que separam produção de reserva, venda e propriedade. Também rejeita linguagem de disponibilidade ou proprietário e compara `Peças concluídas` no `ProductModel` estruturado com o mesmo contrato.
