# Cortex

**AI alucina porque nao tem contexto.** Inventa campos, ignora regras, duplica logica.

Cortex estrutura o contexto do seu projeto em um vault Obsidian. A IA consulta antes de codar — e produz codigo preciso.

## Instalacao

Na raiz do seu projeto:

```bash
# Via npm (quando publicado)
npx cortex-ai

# Via GitHub (sem precisar publicar no npm)
npx github:fullchico/cortex

# Instalar globalmente via GitHub
npm install -g github:fullchico/cortex
cortex-ai

# Local (clonar e linkar)
git clone https://github.com/fullchico/cortex.git
cd cortex && npm link
cortex-ai
```

O CLI detecta seu AI tool, configura tudo e cria o vault em `./cortex/`.

```
? Qual AI tool voce usa?          Claude Code / Cursor / Copilot / Todos
? Nome do projeto:                my-app
? Descricao (1 frase):            Sistema de gestao de tarefas
? Stack:                          Node.js + React + PostgreSQL
? Modo:                           Projeto / Livre
? Idioma:                         PT / EN
? Tem spec ou PRD para importar?  S/N

  ✓ Criou CLAUDE.md
  ✓ Criou .cursor/rules/cortex-*.mdc
  ✓ Criou .github/copilot-instructions.md
  ✓ Vault criado em ./cortex/
  ✓ Adicionou cortex/ ao .gitignore

  Abra ./cortex/ no Obsidian como vault
  Diga "cortex start" para comecar
```

## Requisitos

- Node.js 18+
- Obsidian
- Um de: Claude Code, Cursor ou Copilot

---

## 2 modos

### Projeto — vault completo

Para qualquer projeto que precisa de estrutura. Vault com decisoes, arquitetura, entidades, regras de negocio.

Durante o init:
```
"Tem spec, PRD ou docs para importar?"
→ Sim → diga "cortex start" e cole o doc. A IA distribui pelo vault.
→ Nao → comeca vazio. A IA debate junto e o vault cresce a cada sessao.
```

### Livre — vault minimo

Para devs no dia a dia. Zero configuracao. So timeline e contextos.

```
cortex/
├── Projeto.md
└── Sessoes/
    ├── timeline/
    └── contextos/
```

Contextos surgem organicamente — a IA sugere no final de cada sessao.

---

## Fluxo diario

```
cortex start auth     → IA carrega contexto auth + dependencias + timeline recente
  trabalhar...        → IA consulta vault antes de codar
cortex end            → salva decisoes, atualiza contexto, sugere novo contexto se necessario
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
| `cortex end` | Fecha sessao. Salva timeline e contexto. |
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
├── cortex/                         ← vault (gitignored)
│   ├── .spec.md                    ← blueprint customizavel
│   ├── Memoria Projeto.md
│   └── Sessoes/
│       ├── timeline/
│       └── contextos/
└── .gitignore                      ← cortex/ ignorado
```

**Commitado:** `CLAUDE.md`, `.cursor/rules/`, `.github/` — todo dev do time tem o mesmo comportamento de IA.

**Gitignored:** `./cortex/` — memoria pessoal, contexto sensivel.

---

## Customizar o vault

O blueprint do vault esta em `./cortex/.spec.md`. Edite para:

- Adicionar notas especificas do projeto
- Remover notas que nao usa
- Mudar labels das secoes

---

## Filosofia

1. **Vault > memoria > codigo** — sempre consultar o vault antes de implementar
2. **Contexto focado** — carregar so o que e necessario para a task
3. **Ilhas de conhecimento** — cada contexto acumula o que o projeto sabe sobre aquela area
4. **Nada se perde** — cada sessao alimenta o vault

---

## Licenca

MIT
