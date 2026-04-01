# Cortex

[![npm](https://img.shields.io/npm/v/@fullchico/cortex-ai)](https://www.npmjs.com/package/@fullchico/cortex-ai)
[![license](https://img.shields.io/npm/l/@fullchico/cortex-ai)](LICENSE)
[![node](https://img.shields.io/node/v/@fullchico/cortex-ai)](package.json)

**AI alucina porque nao tem contexto.** Inventa campos, ignora regras, duplica logica.

Cortex estrutura o contexto do seu projeto em um vault Obsidian. A IA consulta antes de codar — e produz codigo preciso.

## Instalacao

Na raiz do seu projeto:

```bash
# Via npm (recomendado)
npx @fullchico/cortex-ai

# Global
npm install -g @fullchico/cortex-ai

# Local (dev)
git clone https://github.com/fullchico/cortex.git
cd cortex && npm link
```

O CLI detecta seu AI tool, configura tudo e cria o vault em `./.cortex/`.

```
? Inicializar vault em /seu-projeto/.cortex/ ?  Y

  Detectado no ambiente: Claude Code

? Quais AI tools configurar?
  ◉ Claude Code  →  cria CLAUDE.md com protocolo e comandos cortex
  ◯ Cursor       →  cria .cursor/rules/ com protocol, start e end
  ◯ Copilot      →  cria .github/copilot-instructions.md

? Nome do projeto:        my-app
? Descricao em 1 frase:   Sistema de gestao de tarefas

? Tipo de projeto:
  ❯ Fullstack   —  frontend + backend
    Backend     —  API, servico, CLI, worker
    Frontend    —  interface, SPA, app

? Frontend:  React
? Backend:   Node.js

? Modo do vault:
  ❯ Freestyled  ✦  minimo e organico (recomendado)
    Projeto     ✦  vault completo com DDD + SOLID

? Idioma:  PT

? Boas praticas a adotar?   [Freestyled]
  ◉ Testes unitarios
  ◯ Clean Architecture + Clean Code
  ◉ Principios SOLID

  ✓ Cortex adicionado ao CLAUDE.md existente
  ✓ Vault criado em ./.cortex/
  ✓ Adicionou .cortex/ ao .gitignore

  Abra ./.cortex/ no Obsidian como vault
  Diga "cortex start" para comecar
```

## Requisitos

- Node.js 18+
- Obsidian
- Um de: Claude Code, Cursor ou Copilot

---

## 2 modos

### Freestyled ✦ recomendado

Para devs no dia a dia. Zero configuracao. Vault minimo que cresce organicamente com o uso.

```
.cortex/
├── Projeto.md          ← sobre o projeto + boas praticas escolhidas
└── Sessoes/
    ├── timeline/       ← uma nota por dia de trabalho
    └── contextos/      ← ilhas de conhecimento por area
```

Na inicializacao, escolha as boas praticas a adotar — salvas no `Projeto.md` e respeitadas pela IA durante as sessoes:

- **Testes unitarios** — exemplos especificos por stack (Testing Library, Jest, testify...)
- **Clean Architecture + Clean Code** — camadas por tipo de projeto (front/back/fullstack)
- **Principios SOLID** — checklist ativo durante o desenvolvimento

Contextos surgem com o uso — a IA sugere no final de cada sessao.

### Projeto

Para projetos com estrutura definida, time, spec/PRD, ou que adotam DDD. Vault completo com DDD + SOLID ativos.

```
.cortex/
├── Memoria Projeto.md
├── Dominio/
│   ├── Entidades.md            ← Entity / Value Object / Aggregate
│   ├── Eventos de Dominio.md   ← Domain Events
│   └── Glossario de Dominio.md ← linguagem ubiqua
├── Arquitetura/
│   ├── Clean Architecture.md   ← camadas + DDD building blocks + SOLID
│   ├── Bounded Contexts.md     ← fronteiras de contexto (front e back)
│   ├── Padroes de Codigo.md
│   ├── Mapa de Modulos.md
│   ├── Estrategia de Testes.md
│   ├── Contratos API.md
│   ├── Decisoes de Arquitetura.md
│   └── Integracoes.md
├── Decisoes/
│   ├── Definicoes Travadas.md
│   ├── Questoes em Aberto.md
│   └── Anti-patterns.md
├── Regras de Negocio/
│   └── Regras Gerais.md
└── Sessoes/
    ├── timeline/
    └── contextos/
```

DDD e SOLID sao parte do protocolo ativo — antes de criar qualquer classe, a IA identifica se e Entity, Value Object ou Aggregate, e verifica o bounded context correto.

**Importar spec/PRD:**
```
"Tem spec, PRD ou docs para importar?"
→ Sim → diga "cortex start" e cole o doc. A IA distribui pelo vault.
→ Nao → comeca vazio. A IA debate junto e o vault cresce a cada sessao.
```

---

## Migracao Freestyled → Projeto

Comecou no modo Freestyled e o projeto cresceu? Rode `npx @fullchico/cortex-ai` novamente:

```
  Vault Freestyled detectado em .cortex/

? Migrar para modo Projeto?  Y

? Nome do projeto:      (MeuApp)        ← pre-preenchido do vault
? Descricao:            (Sistema de tarefas)
? Stack:                (React + Node.js)

  ✓ Vault migrado para modo Projeto em .cortex/

  Sessoes e contextos existentes preservados.
  Memoria Projeto.md referencia o [[Projeto]] original.
```

Sessoes, timeline e contextos existentes sao preservados. O `Projeto.md` original vira referencia wikilink na nova `Memoria Projeto.md`.

---

## Iniciar novo projeto

Quer comecar do zero sem perder o historico? Rode `npx @fullchico/cortex-ai` em um vault existente:

```
  Vault Projeto detectado em .cortex/

? O que deseja fazer?
  ❯ Iniciar novo projeto  —  arquiva vault atual e comeca do zero
    Configurar AI tools  —  adicionar ou atualizar CLAUDE.md, cursor rules, copilot
    Sair

  ✓ Vault anterior arquivado em .cortex/Anterior/2026-03-31/

  [fluxo normal de inicializacao...]

  ✦ Tudo pronto!

  Vault criado em  →  ./.cortex/
  Anterior em      →  ./.cortex/Anterior/2026-03-31/
```

O vault anterior e movido para `.cortex/Anterior/YYYY-MM-DD/` — disponivel no Obsidian como referencia historica. Funciona tanto para vaults Freestyled quanto Projeto.

---

## Superset — projetos com CLAUDE.md ou regras existentes

Se o projeto ja tem um `CLAUDE.md` ou `copilot-instructions.md`, o Cortex **nao sobrescreve** — adiciona o protocolo como bloco delimitado ao final:

```markdown
# Instrucoes do time             ← conteudo original preservado

Nao usar var. Sempre TypeScript.

<!-- cortex:start -->             ← bloco cortex adicionado
# Cortex — AI Memory Framework
...
<!-- cortex:end -->
```

Na proxima vez que rodar, detecta o bloco e pula sem modificar.

---

## Fluxo diario

```
cortex start auth     → IA carrega contexto auth + depends + timeline recente
  trabalhar...        → IA consulta vault antes de codar
cortex end            → salva decisoes, atualiza contexto, sugere melhorias
```

---

## Contextos

Contextos sao ilhas de conhecimento por area do projeto (auth, dashboard, payments).

```markdown
# auth

depends: [users, sessions]

## Decisoes
| Decisao | Definicao | Data |
...

## Padroes
...

## Sessoes
- [[timeline/2026-03-31]] — implementei login
```

A IA carrega `auth` + tudo que esta em `depends:` automaticamente.

Criar contexto:
```
cortex context payments
```

---

## Comandos

| Comando | O que faz |
|---------|-----------|
| `cortex start` | Abre sessao. Pergunta no que vai trabalhar. |
| `cortex start auth` | Abre sessao carregando o contexto `auth`. |
| `cortex end` | Fecha sessao. Salva timeline, contexto e sugere melhorias. |
| `cortex context <nome>` | Cria novo contexto. |

---

## O que fica no projeto

```
my-project/
├── CLAUDE.md                       ← Claude Code (commitado)
├── .cursor/rules/                  ← Cursor (commitado)
│   ├── cortex-protocol.mdc
│   ├── cortex-start.mdc
│   └── cortex-end.mdc
├── .github/
│   └── copilot-instructions.md     ← Copilot (commitado)
├── .cortex/                        ← vault (gitignored)
│   ├── .spec.md                    ← blueprint customizavel
│   └── ...
└── .gitignore                      ← .cortex/ ignorado
```

**Commitado:** `CLAUDE.md`, `.cursor/rules/`, `.github/` — todo dev do time tem o mesmo comportamento de IA.

**Gitignored:** `./.cortex/` — memoria pessoal, contexto sensivel.

---

## Filosofia

1. **Vault > memoria > codigo** — sempre consultar o vault antes de implementar
2. **Contexto focado** — carregar so o que e necessario para a task
3. **Ilhas de conhecimento** — cada contexto acumula o que o projeto sabe sobre aquela area
4. **Nada se perde** — cada sessao alimenta o vault

---

## Licenca

MIT
