# Impressão dos documentos internos

## Escopo

Três rotas usam a mesma folha A4:

- Ficha do Protótipo 00;
- Briefing de Cotação do Tampo;
- Modelo de Certificado de Edição.

O botão “Imprimir ou salvar em PDF” chama apenas a caixa de impressão do navegador. Nenhum arquivo é enviado, gerado no servidor ou armazenado pelo site.

## Paginação

Uma seção longa pode atravessar páginas. Tentar manter o bloco inteiro indivisível é contraproducente quando ele é maior que a área útil do A4. Por isso:

- blocos podem fluir entre páginas;
- títulos evitam ficar isolados no rodapé;
- cabeçalhos de tabelas são repetidos pelo mecanismo de impressão;
- linhas de tabela, itens de checklist e decisões não são cortados ao meio;
- avisos e assinaturas continuam indivisíveis;
- parágrafos preservam ao menos três linhas no início e no fim de uma página;
- cores institucionais solicitam reprodução exata, sujeita à configuração final do navegador e da impressora.

Cabeçalho do site, rodapé e controles de tela permanecem ocultos na impressão. A folha usa fundo branco, largura integral e margem A4 de 11 mm.

## Proteção contra regressão

O verificador exige A4, modo de impressão, fluxo de seção, títulos vinculados ao conteúdo seguinte, cabeçalho repetível, unidades indivisíveis, controle de órfãs/viúvas e ajuste de cor. As três rotas também precisam exportar um botão local do tipo `button` com o rótulo correto.
