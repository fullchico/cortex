# Cortex — AI Memory Framework

Este projeto usa o Cortex framework. O vault esta em `./<vault>/` — nome detectado via marker `.cortex`.

## Detectar vault (passo obrigatorio antes de tudo)

Ler o arquivo `.cortex` na raiz do projeto:
- Se existe: `vault = JSON.parse(.cortex).vault` (ex: `{"vault":"meu-app"}` → vault = `meu-app`)
- Se nao existe: `vault = cortex` (fallback)
- Se a pasta `<vault>/` nao existe: sugerir `npx cortex-ai` para inicializar

A partir daqui, todos os caminhos usam `./<vault>/` com o valor detectado.

## Protocolo de consulta (OBRIGATORIO)

ANTES de escrever qualquer codigo, leia estas notas do vault:

### Para codar

1. `./<vault>/Dominio/Entidades.md` — campos reais do banco. NAO inventar campos.
2. `./<vault>/Arquitetura/Padroes de Codigo.md` — copiar padroes existentes. NAO inventar estrutura.
3. `./<vault>/Decisoes/Anti-patterns.md` — lista do que NUNCA fazer neste projeto.
4. `./<vault>/Arquitetura/Mapa de Modulos.md` — verificar se modulo/logica ja existe.
5. `./<vault>/Arquitetura/Estrategia de Testes.md` — como testar neste projeto.
6. `./<vault>/Arquitetura/Bounded Contexts.md` — bounded context correto. NAO cruzar fronteiras.
7. `./<vault>/Arquitetura/Clean Architecture.md` — camada correta + DDD building block correto + SOLID.

### Para decidir

8. `./<vault>/Decisoes/Definicoes Travadas.md` — decisoes imutaveis. NAO rediscutir.
9. `./<vault>/Decisoes/Questoes em Aberto.md` — se nao foi decidido, PERGUNTAR.
10. `./<vault>/Regras de Negocio/Regras Gerais.md` — formulas e logica reais. NAO adivinhar.

### Para integrar

11. `./<vault>/Arquitetura/Contratos API.md` — shape real de request/response.
12. `./<vault>/Dominio/Glossario de Dominio.md` — termos corretos do dominio.

## Contextos

O vault usa contextos para organizar o conhecimento por area (ex: auth, dashboard, payments).

Ao iniciar trabalho em uma area:
- Ler `./<vault>/Sessoes/contextos/<area>.md`
- Ler os contextos listados em `depends:` no header

## Sessoes

Ao inicio do trabalho, ler:
- `./<vault>/Memoria Projeto.md`
- Arquivos recentes em `./<vault>/Sessoes/timeline/`
- Contexto relevante em `./<vault>/Sessoes/contextos/`

Ao final, criar/atualizar:
- `./<vault>/Sessoes/timeline/YYYY-MM-DD.md` — uma nota por dia
- `./<vault>/Sessoes/contextos/<area>.md` — se trabalhou em area especifica

## Regras obrigatorias

- **Vault = fonte da verdade** — vault > memoria > codigo
- **NAO adivinhar** — se nao esta no vault, perguntar
- **NAO rediscutir** — se esta em Definicoes Travadas, respeitar
- **NAO duplicar** — se ja existe em outro modulo, reutilizar
- **Testes obrigatorios** — codigo sem teste nao existe

## Ao completar uma task

Sugerir ao usuario registrar no vault:
- Termo novo → `./<vault>/Dominio/Glossario de Dominio.md`
- Campo/entidade → `./<vault>/Dominio/Entidades.md`
- Padrao → `./<vault>/Arquitetura/Padroes de Codigo.md`
- Anti-pattern → `./<vault>/Decisoes/Anti-patterns.md`
- Decisao → `./<vault>/Decisoes/Definicoes Travadas.md`
- Duvida → `./<vault>/Decisoes/Questoes em Aberto.md`
- Modulo/endpoint → `./<vault>/Arquitetura/Mapa de Modulos.md` ou `Contratos API.md`
