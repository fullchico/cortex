# Cortex — AI Memory Framework

Este projeto usa o Cortex framework. O vault esta em `./<vault>/` — nome detectado via marker `.cortex`.

## Detectar vault (passo obrigatorio antes de tudo)

Ler o arquivo `.cortex` na raiz do projeto:
- Se existe: `vault = JSON.parse(.cortex).vault` (ex: `{"vault":"meu-app"}` → vault = `meu-app`)
- Se nao existe: `vault = cortex` (fallback)
- Se vault nao existe como pasta: sugerir `npx cortex-ai` para inicializar

A partir daqui, todos os caminhos usam `./<vault>/` com o valor detectado.

---

## Protocolo obrigatorio — antes de codar

Detectar idioma: se `./<vault>/Memoria Projeto.md` existe → PT. Se `./<vault>/Project Memory.md` existe → EN.

**Antes de escrever qualquer codigo:**

1. Ler `./<vault>/Dominio/Entidades.md` — campos reais. NAO inventar.
2. Ler `./<vault>/Arquitetura/Padroes de Codigo.md` — copiar padroes. NAO improvisar.
3. Ler `./<vault>/Decisoes/Anti-patterns.md` — o que NUNCA fazer.
4. Ler `./<vault>/Arquitetura/Mapa de Modulos.md` — ja existe? NAO duplicar.
5. Ler `./<vault>/Arquitetura/Estrategia de Testes.md` — testes obrigatorios.

**DDD — antes de criar qualquer classe/tipo:**
- Identificar: Entity (tem ID) / Value Object (imutavel, sem ID) / Aggregate (raiz de consistencia)
- Verificar bounded context: o que estou criando pertence a qual contexto?
- Ler `./<vault>/Arquitetura/Bounded Contexts.md` — nao cruzar fronteiras
- Ler `./<vault>/Dominio/Entidades.md` — modelo existente, nao duplicar

**SOLID — ao escrever codigo:**
- S: esta classe/componente tem uma unica razao para mudar?
- O: posso estender sem modificar codigo existente?
- D: estou dependendo de abstracoes, nao de implementacoes concretas?

**Antes de decidir:**

6. Ler `./<vault>/Decisoes/Definicoes Travadas.md` — NAO rediscutir.
7. Ler `./<vault>/Decisoes/Questoes em Aberto.md` — nao decidido? PERGUNTAR.
8. Ler `./<vault>/Regras de Negocio/Regras Gerais.md` — formulas reais. NAO adivinhar.

**Antes de integrar:**

9. Ler `./<vault>/Arquitetura/Contratos API.md` — shape real.
10. Ler `./<vault>/Dominio/Glossario de Dominio.md` — termos corretos.

---

## cortex start [contexto]

Quando o usuario disser "cortex start" ou "iniciar sessao":

1. Detectar vault (ver passo acima)
2. Detectar idioma pelo arquivo raiz
3. Ler `./<vault>/Memoria Projeto.md` (ou `Project Memory.md`)
4. Se contexto declarado (ex: "cortex start auth"):
   - Ler `./<vault>/Sessoes/contextos/<contexto>.md`
   - Ler `depends:` no header e carregar cada dependencia
   - Listar arquivos em `./<vault>/Sessoes/timeline/` e ler os 3 mais recentes
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

2. Criar/atualizar `./<vault>/Sessoes/timeline/YYYY-MM-DD.md`

3. Se havia contexto ativo:
   - Ler `./<vault>/Sessoes/contextos/<nome>.md`
   - Atualizar com decisoes, padroes, bugs, sessao referenciada

4. Se sem contexto ativo:
   - Sugerir: "Trabalhamos bastante em [tema]. Quer criar um contexto?"

5. Atualizar notas de referencia se houve mudancas:

| Aconteceu | Atualizar |
|-----------|-----------|
| Decisao confirmada | `./<vault>/Decisoes/Definicoes Travadas.md` |
| Questao resolvida | `./<vault>/Decisoes/Questoes em Aberto.md` |
| Questao nova | `./<vault>/Decisoes/Questoes em Aberto.md` |
| Anti-pattern | `./<vault>/Decisoes/Anti-patterns.md` |
| Entidade criada/alterada | `./<vault>/Dominio/Entidades.md` |
| Termo novo | `./<vault>/Dominio/Glossario de Dominio.md` |
| Modulo criado | `./<vault>/Arquitetura/Mapa de Modulos.md` |
| Endpoint criado | `./<vault>/Arquitetura/Contratos API.md` |

6. Sugestoes de melhoria — verificar oportunidades encontradas durante a sessao:

| Oportunidade | Verificar |
|---|---|
| Testes faltando | Codigo sem cobertura ou sem teste associado |
| Clean Code | Funcoes longas, nomes confusos, comentarios desnecessarios |
| Clean Architecture | Dependencias cruzando camadas erradas |
| SOLID | Responsabilidade unica violada, aberta para modificacao, etc. |

Regra: **nao interromper o fluxo** — se encontrou oportunidade, adicionar como `- [ ]` nos Proximos Passos da timeline. Nao sugerir o que ja esta feito.

Se vault tem `./<vault>/Projeto.md` com secao `## Boas Praticas`: priorizar as praticas listadas.

7. Atualizar indice `./<vault>/Sessoes/Sessoes - Memoria Temporal.md`

8. Confirmar:
```
Sessao salva:
- Timeline: ./<vault>/Sessoes/timeline/YYYY-MM-DD.md
- Contexto atualizado: <nome> (se aplicavel)
- Refs atualizadas: [lista]
- Sugestoes: [lista ou "nenhuma"]
```

---

## cortex context <nome>

Quando o usuario disser "cortex context <nome>":

1. Verificar se `./<vault>/Sessoes/contextos/<nome>.md` ja existe
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
