# FAQ Tecnico

#faq #referencia

> [!abstract] Perguntas frequentes sobre o projeto
> Respostas a duvidas que surgem repetidamente durante o desenvolvimento.
> O AI consulta aqui antes de perguntar de novo.

> [!tip] Como usar
> Se uma pergunta surgiu 2+ vezes em sessoes diferentes, adicione aqui com a resposta definitiva.
> Formato: pergunta direta → resposta curta → link para nota detalhada.

Voltar: [[Memoria Projeto]]

---

## Regras de negocio

**P: _(ex: Qual campo define o mes da comissao?)_**
R: _(ex: Campo `dataEncerramento` da OS. Ver [[Regras Gerais]])_

**P: _(ex: NBS com OS=0 entra no calculo?)_**
R: _(ex: NAO — nem comissao nem premiacao. Ver [[Definicoes Travadas]])_

---

## Banco / Schema

**P: _(ex: Decimais vem como number ou string?)_**
R: _(ex: String — Prisma retorna Decimal como string. Parsear no front. Ver [[Entidades]])_

**P: _(ex: ID e UUID ou auto-increment?)_**
R: _(ex: UUID para entidades de dominio, auto-increment para X. Ver [[Entidades]])_

---

## Codigo / Padroes

**P: _(ex: Onde colocar logica de calculo?)_**
R: _(ex: Em use-case dentro de application/, nunca no controller. Ver [[Padroes de Codigo]])_

**P: _(ex: Como resolver nome de empresa para loja?)_**
R: _(ex: Via EmpresaRef.aliases com match exato ===. Ver [[Definicoes Travadas]])_

---

## Endpoints / API

**P: _(ex: Qual endpoint retorna dados paginados?)_**
R: _(ex: Todos os GET de lista. Padrao: page, limit, total, totalPages. Ver [[Contratos API]])_

**P: _(ex: Como enviar arquivo pro backend?)_**
R: _(ex: multipart/form-data — NAO setar Content-Type manualmente. Ver [[Contratos API]])_

---

## Processo

**P: _(ex: Posso commitar direto na main?)_**
R: _(ex: NAO — sempre branch + PR. Ver [[Anti-patterns]])_

**P: _(ex: Em qual ordem rodar o pipeline de importacao?)_**
R: _(ex: Ver [[Pipeline - Visao Geral]] para a ordem exata)_

---

## Como adicionar pergunta

1. A pergunta surgiu 2+ vezes? Adicione aqui
2. Formato: **P:** pergunta direta / **R:** resposta curta + link
3. Categorize na secao certa (negocio, banco, codigo, API, processo)
4. Nao duplique — se a resposta completa ja esta em outra nota, so linke

---

## Links

- [[Memoria Projeto]]
- [[Definicoes Travadas]]
- [[Regras Gerais]]
- [[Padroes de Codigo]]
- [[Anti-patterns]]
- [[Contratos API]]
- [[Entidades]]
