# Cortex — AI Memory Framework

Este projeto usa o Cortex framework. O vault de contexto está em `./.cortex/`.

## Protocolo obrigatório — antes de codar

Detectar idioma: se `./.cortex/Memoria Projeto.md` existe → PT. Se `./.cortex/Project Memory.md` existe → EN.

**Antes de escrever qualquer código:**

1. Ler `./.cortex/Dominio/Entidades.md` — campos reais. NAO inventar.
2. Ler `./.cortex/Arquitetura/Padroes de Codigo.md` — copiar padroes. NAO improvisar.
3. Ler `./.cortex/Decisoes/Anti-patterns.md` — o que NUNCA fazer.
4. Ler `./.cortex/Arquitetura/Mapa de Modulos.md` — ja existe? NAO duplicar.
5. Ler `./.cortex/Arquitetura/Estrategia de Testes.md` — testes obrigatorios.

**Antes de decidir:**

6. Ler `./.cortex/Decisoes/Definicoes Travadas.md` — NAO rediscutir.
7. Ler `./.cortex/Decisoes/Questoes em Aberto.md` — nao decidido? PERGUNTAR.
8. Ler `./.cortex/Regras de Negocio/Regras Gerais.md` — formulas reais. NAO adivinhar.

**Antes de integrar:**

9. Ler `./.cortex/Arquitetura/Contratos API.md` — shape real.
10. Ler `./.cortex/Dominio/Glossario de Dominio.md` — termos corretos.

Se vault nao existe: sugerir `npx cortex-ai` para inicializar.

---

## cortex start [contexto]

Quando o usuario disser "cortex start" ou "iniciar sessao":

1. Detectar vault em `./.cortex/`
2. Detectar idioma pelo arquivo raiz
3. Ler `./.cortex/Memoria Projeto.md` (ou `Project Memory.md`)
4. Se contexto declarado (ex: "cortex start auth"):
   - Ler `./.cortex/Sessoes/contextos/<contexto>.md`
   - Ler `depends:` no header e carregar cada dependencia
   - Listar arquivos em `./.cortex/Sessoes/timeline/` e ler os 3 mais recentes
5. Se sem contexto: perguntar "no que vai trabalhar hoje?"
6. Resumir:

```
Sessao aberta — <PROJETO> (<DATA>)

Contexto: <nome> [depends: ...]

Decisoes recentes:
- ...

Pendencias:
- [ ] ...

O que vamos fazer?
```

---

## cortex end

Quando o usuario disser "cortex end" ou "fechar sessao":

1. Analisar toda a conversa e extrair:
   - Decisoes tomadas
   - Padroes descobertos
   - Bugs encontrados
   - Proximos passos

2. Criar/atualizar `./.cortex/Sessoes/timeline/YYYY-MM-DD.md`

3. Se havia contexto ativo:
   - Ler `./.cortex/Sessoes/contextos/<nome>.md`
   - Atualizar com decisoes, padroes, bugs, sessao referenciada

4. Se sem contexto ativo:
   - Sugerir: "Trabalhamos bastante em [tema]. Quer criar um contexto?"

5. Atualizar notas de referencia se houve mudancas:

| Aconteceu | Atualizar |
|-----------|-----------|
| Decisao confirmada | `./.cortex/Decisoes/Definicoes Travadas.md` |
| Questao resolvida | `./.cortex/Decisoes/Questoes em Aberto.md` |
| Questao nova | `./.cortex/Decisoes/Questoes em Aberto.md` |
| Anti-pattern | `./.cortex/Decisoes/Anti-patterns.md` |
| Entidade criada/alterada | `./.cortex/Dominio/Entidades.md` |
| Termo novo | `./.cortex/Dominio/Glossario de Dominio.md` |
| Modulo criado | `./.cortex/Arquitetura/Mapa de Modulos.md` |
| Endpoint criado | `./.cortex/Arquitetura/Contratos API.md` |

6. Atualizar indice `./.cortex/Sessoes/Sessoes - Memoria Temporal.md`

7. Confirmar:
```
Sessao salva:
- Timeline: ./.cortex/Sessoes/timeline/YYYY-MM-DD.md
- Contexto atualizado: <nome> (se aplicavel)
- Refs atualizadas: [lista]
```

---

## cortex context <nome>

Quando o usuario disser "cortex context <nome>":

1. Verificar se `./.cortex/Sessoes/contextos/<nome>.md` ja existe
2. Se nao existe: criar com template:

```markdown
# <nome>

depends: []
tags: [contexto]

---

## Decisoes
| Decisao | Definicao | Data |
|---------|-----------|------|

## Padroes
-

## Bugs encontrados
-

## Sessoes
-
```

3. Perguntar: "Esse contexto depende de algum outro? (ex: auth, users)"
4. Preencher `depends:` com a resposta

---

## Regras

- Vault = fonte da verdade (vault > memoria > codigo)
- Ler antes de adicionar — NAO duplicar
- Nao adivinhar — perguntar se nao esta no vault
- Nao rediscutir — respeitar Definicoes Travadas
- Uma nota de timeline por dia — append se ja existe
