# Health Check

#framework #manutencao

> [!abstract] Como saber se o vault esta saudavel
> Vault desatualizado e pior que vault vazio — o AI confia em informacao errada.
> Revise semanalmente ou a cada sprint.

Voltar: [[Memoria Projeto]]

---

## Checklist semanal

| # | Verificacao | Como checar | Se falhar |
|---|------------|-------------|-----------|
| 1 | **Entidades.md atualizado?** | Comparar com schema real (Prisma, TypeORM, SQL) | Atualizar campos/relacoes |
| 2 | **Definicoes Travadas refletem decisoes recentes?** | Reler ultimas sessoes — alguma decisao nova nao foi travada? | Adicionar regras faltantes |
| 3 | **Anti-patterns atualizados?** | Houve bug causado por padrao ruim? | Documentar o anti-pattern |
| 4 | **Padroes de Codigo preenchidos?** | Os exemplos sao de codigo real ou placeholder? | Colar exemplo real |
| 5 | **Mapa de Modulos completo?** | Novo modulo foi criado e nao esta no mapa? | Adicionar |
| 6 | **Contratos API atualizados?** | Novo endpoint ou mudanca de shape? | Atualizar |
| 7 | **Testes passando?** | `npm test` / `pytest` / equivalente | Corrigir antes de continuar |
| 8 | **Sessao do dia existe?** | Trabalhou hoje e nao tem nota? | Criar via /iniciar-sessao |

---

## Sinais de vault stale

| Sinal | Gravidade | Significado |
|-------|-----------|------------|
| Entidades.md nao atualizado ha 1+ semana com migrations recentes | **CRITICO** | AI vai usar campos errados |
| Padroes de Codigo ainda tem placeholders | **ALTO** | AI nao tem referencia — vai inventar |
| Nenhuma sessao registrada ha 1+ semana | **MEDIO** | Contexto temporal perdido |
| Definicoes Travadas sem data recente | **MEDIO** | Decisoes novas nao documentadas |
| FAQ Tecnico vazio | **BAIXO** | Normal no inicio — preencher conforme surgem duvidas |
| Personas/Changelog vazios | **INFO** | OK se projeto e solo ou pre-release |

---

## Quando atualizar cada nota

| Nota | Trigger de atualizacao |
|------|----------------------|
| **Entidades** | Toda migration / mudanca de schema |
| **Padroes de Codigo** | Quando o padrao mudar ou novo exemplo surgir |
| **Mapa de Modulos** | Novo modulo criado |
| **Contratos API** | Novo endpoint ou mudanca de request/response |
| **Definicoes Travadas** | Decisao validada pelo stakeholder |
| **Anti-patterns** | Bug causado por padrao ruim |
| **FAQ Tecnico** | Mesma pergunta surge 2+ vezes |
| **Glossario** | Termo novo no dominio |
| **Regras Gerais** | Formula ou logica nova validada |
| **Sessoes** | Todo dia de trabalho |

---

## Links

- [[Memoria Projeto]]
- [[Entidades]]
- [[Padroes de Codigo]]
- [[Estrategia de Testes]]
