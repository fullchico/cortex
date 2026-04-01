# Cortex — AI Memory Framework

Este projeto usa o Cortex framework. O vault de contexto esta em `./cortex/`.

## Protocolo de consulta (OBRIGATORIO)

ANTES de escrever qualquer codigo, leia estas notas do vault:

### Para codar

1. `./cortex/Dominio/Entidades.md` — campos reais do banco. NAO inventar campos.
2. `./cortex/Arquitetura/Padroes de Codigo.md` — copiar padroes existentes. NAO inventar estrutura.
3. `./cortex/Decisoes/Anti-patterns.md` — lista do que NUNCA fazer neste projeto.
4. `./cortex/Arquitetura/Mapa de Modulos.md` — verificar se modulo/logica ja existe.
5. `./cortex/Arquitetura/Estrategia de Testes.md` — como testar neste projeto.
6. `./cortex/Arquitetura/Bounded Contexts.md` — bounded context correto. NAO cruzar fronteiras.
7. `./cortex/Arquitetura/Clean Architecture.md` — camada correta + DDD building block correto + SOLID.

### Para decidir

8. `./cortex/Decisoes/Definicoes Travadas.md` — decisoes imutaveis. NAO rediscutir.
9. `./cortex/Decisoes/Questoes em Aberto.md` — se nao foi decidido, PERGUNTAR.
10. `./cortex/Regras de Negocio/Regras Gerais.md` — formulas e logica reais. NAO adivinhar.

### Para integrar

11. `./cortex/Arquitetura/Contratos API.md` — shape real de request/response.
12. `./cortex/Dominio/Glossario de Dominio.md` — termos corretos do dominio.

## Contextos

O vault usa contextos para organizar o conhecimento por area (ex: auth, dashboard, payments).

Ao iniciar trabalho em uma area:
- Ler `./cortex/Sessoes/contextos/<area>.md`
- Ler os contextos listados em `depends:` no header

## Sessoes

Ao inicio do trabalho, ler:
- `./cortex/Memoria Projeto.md`
- Arquivos recentes em `./cortex/Sessoes/timeline/`
- Contexto relevante em `./cortex/Sessoes/contextos/`

Ao final, criar/atualizar:
- `./cortex/Sessoes/timeline/YYYY-MM-DD.md` — uma nota por dia
- `./cortex/Sessoes/contextos/<area>.md` — se trabalhou em area especifica

## Regras obrigatorias

- **Vault = fonte da verdade** — vault > memoria > codigo
- **NAO adivinhar** — se nao esta no vault, perguntar
- **NAO rediscutir** — se esta em Definicoes Travadas, respeitar
- **NAO duplicar** — se ja existe em outro modulo, reutilizar
- **Testes obrigatorios** — codigo sem teste nao existe

## Ao completar uma task

Sugerir ao usuario registrar no vault:
- Termo novo → `./cortex/Dominio/Glossario de Dominio.md`
- Campo/entidade → `./cortex/Dominio/Entidades.md`
- Padrao → `./cortex/Arquitetura/Padroes de Codigo.md`
- Anti-pattern → `./cortex/Decisoes/Anti-patterns.md`
- Decisao → `./cortex/Decisoes/Definicoes Travadas.md`
- Duvida → `./cortex/Decisoes/Questoes em Aberto.md`
- Modulo/endpoint → `./cortex/Arquitetura/Mapa de Modulos.md` ou `Contratos API.md`
