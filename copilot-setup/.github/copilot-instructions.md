# Cortex — AI-assisted development framework

## Vault Obsidian

Este projeto usa o framework Cortex. O contexto do projeto esta documentado em um vault Obsidian.

**Path do vault:** _(PREENCHER: ex. docs/vault/ ou .cortex/)_

> Se o vault estiver DENTRO do projeto (recomendado para Copilot), use path relativo.
> Se estiver FORA, o Copilot pode nao conseguir ler — considere copiar as notas criticas para .github/

## Protocolo de consulta (OBRIGATORIO)

ANTES de escrever qualquer codigo, consulte estas notas do vault:

### Para codar

1. Ler `Dominio/Entidades.md` — campos reais do banco. NAO inventar campos que nao existem aqui.
2. Ler `Arquitetura/Padroes de Codigo.md` — copiar padroes existentes. NAO inventar estrutura.
3. Ler `Decisoes/Anti-patterns.md` — lista do que NUNCA fazer neste projeto.
4. Ler `Arquitetura/Mapa de Modulos.md` — verificar se modulo/logica ja existe antes de criar.
5. Ler `Arquitetura/Estrategia de Testes.md` — como testar neste projeto. Testes sao obrigatorios.

### Para decidir

6. Ler `Decisoes/Definicoes Travadas.md` — decisoes imutaveis. NAO rediscutir.
7. Ler `Decisoes/Questoes em Aberto.md` — se nao foi decidido, PERGUNTAR ao usuario.
8. Ler `Regras de Negocio/Regras Gerais.md` — formulas e logica reais. NAO adivinhar.

### Para integrar

9. Ler `Arquitetura/Contratos API.md` — shape real de request/response.
10. Ler `Dominio/Glossario de Dominio.md` — termos corretos do dominio.

### Duvida recorrente

11. Ler `FAQ Tecnico.md` — verificar se ja foi respondido.

## Regras obrigatorias

- **Clean Architecture** — separacao de camadas. Controller nao acessa banco. Use-case nao conhece HTTP. Ver `Arquitetura/Clean Architecture.md`
- **Testes obrigatorios** — codigo sem teste nao existe. Ver `Arquitetura/Estrategia de Testes.md`
- **Vault = fonte da verdade** — vault > memoria > codigo
- **Nao adivinhar** — se nao esta decidido, perguntar
- **Nao rediscutir** — se esta em Definicoes Travadas, respeitar
- **Nao duplicar** — se ja existe em outro modulo, reutilizar

## Ao completar uma task

Sugerir ao usuario registrar no vault:

- Termo novo → `Dominio/Glossario de Dominio.md`
- Campo/entidade → `Dominio/Entidades.md`
- Padrao descoberto → `Arquitetura/Padroes de Codigo.md`
- Anti-pattern → `Decisoes/Anti-patterns.md`
- Decisao tomada → `Decisoes/Definicoes Travadas.md`
- Duvida pendente → `Decisoes/Questoes em Aberto.md`
- Modulo/endpoint → `Arquitetura/Mapa de Modulos.md` ou `Contratos API.md`
