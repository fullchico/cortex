# Cortex

**AI Alucina porque nao tem contexto.** Inventa campos, ignora regras, duplica logica.

Cortex e um framework que estrutura o contexto do seu projeto em um vault Obsidian. O AI consulta antes de codar — e produz codigo preciso.

## Como funciona

Um vault Obsidian com notas interligadas: entidades, regras, decisoes, padroes, testes. O AI le antes de codar. Voce e o AI trabalham juntos — cada conversa alimenta o vault, cada decisao fica registrada, nada se perde.

## 3 modos

| Modo | Quando | O que acontece |
|------|--------|---------------|
| **Construir** | Ideia nova, sem codigo | AI debate junto. Cada conversa alimenta o vault. |
| **Decidir** | Tem spec/PRD/docs | AI importa pro vault. Cada decisao fica travada. |
| **Explorar** | Projeto existente sem docs | Cada task e documentada. Nada se perde. |

## Instalacao

```bash
git clone https://github.com/fullchico/cortex.git
cd cortex
```

Escolha seu agent e siga o guia:

| Agent | Guia | O que copiar |
|-------|------|-------------|
| **Claude Code** | [Setup Claude Code](#claude-code) | `skill/cortex/` → `~/.claude/skills/` |
| **Cursor** | [Setup Cursor](#cursor) | `rules/*.mdc` → `.cursor/rules/` |
| **Copilot** | [Setup Copilot](#github-copilot) | `copilot-instructions.md` → `.github/` |

---

### Claude Code

```bash
# Copiar skill
cp -r skill/cortex ~/.claude/skills/cortex

# Copiar template para ~/.cortex/
mkdir -p ~/.cortex
cp -r vault-template ~/.cortex/vault-template

# No Claude Code:
/cortex init
# → cria ~/.cortex/vaults/<nome-projeto>/ com toda estrutura
# → abra no Obsidian como vault
```

Detalhes: o skill `/cortex` tem 3 comandos:

| Comando | O que faz |
|---------|-----------|
| `/cortex init` | Cria vault. Pergunta nome, stack e modo (Construir/Decidir/Explorar). |
| `/cortex start` | Abre sessao do dia. Le vault e resume contexto. |
| `/cortex end` | Fecha sessao. Salva decisoes e artefatos no vault. |

---

### Cursor

```bash
# Copiar rules para o projeto (ou global)
mkdir -p /path/do/projeto/.cursor/rules
cp cursor-setup/rules/*.mdc /path/do/projeto/.cursor/rules/

# Copiar template para ~/.cortex/
mkdir -p ~/.cortex
cp -r vault-template ~/.cortex/vault-template

# No Cursor, digitar no chat:
# "cortex init"
# → cria ~/.cortex/vaults/<nome-projeto>/ com toda estrutura
# → abra no Obsidian como vault
```

4 rules instalados:
- `cortex-protocol.mdc` — **sempre ativo**, consulta vault antes de codar
- `cortex-init.mdc` — "cortex init" → cria vault a partir do template
- `cortex-start.mdc` — "cortex start" → abre sessao
- `cortex-end.mdc` — "cortex end" → fecha sessao

> O repo `cortex` e um instalador — copia rules + template e descarta.

Ver `cursor-setup/SETUP-CURSOR.md` para detalhes.

---

### GitHub Copilot

```bash
# Copiar instrucoes para o projeto
mkdir -p /path/do/projeto/.github
cp copilot-setup/.github/copilot-instructions.md /path/do/projeto/.github/

# Copiar template para ~/.cortex/
mkdir -p ~/.cortex
cp -r vault-template ~/.cortex/vault-template

# Editar copilot-instructions.md → preencher path: ~/.cortex/vaults/<nome>/
```

> Copilot le melhor arquivos dentro do workspace. Se preferir, copie o vault para dentro do projeto.
> Senao, use path absoluto para `~/.cortex/vaults/<nome>/`.

Ver `copilot-setup/SETUP-COPILOT.md` para detalhes.

---

### Outros agents

Os arquivos sao markdown padrao. Adapte para seu agent:
- **Windsurf** → copiar protocolo para `.windsurfrules`
- **Cline** → copiar para `.clinerules`
- **Outro** → adicionar como instrucao do agente

---

## Estrutura global (apos instalacao)

```
~/.cortex/
├── vault-template/              ← template base (copiado na instalacao)
└── vaults/
    ├── meu-app/                 ← criado por "cortex init"
    ├── outro-projeto/           ← criado por "cortex init"
    └── ...
```

## Estrutura de cada vault

```
~/.cortex/vaults/meu-projeto/
├── Memoria Projeto.md                ← AI le primeiro
├── MANIFESTO.md                      ← filosofia
├── Getting Started.md                ← 3 modos de uso
├── Health Check.md                   ← vault saudavel?
├── FAQ Tecnico.md                    ← perguntas recorrentes
├── Changelog.md                      ← marcos de release
│
├── Decisoes/
│   ├── Definicoes Travadas.md        ← imutaveis
│   ├── Questoes em Aberto.md         ← falta decidir
│   └── Anti-patterns.md             ← NUNCA fazer
│
├── Dominio/
│   ├── Glossario de Dominio.md       ← termos
│   └── Entidades.md                 ← campos reais do banco
│
├── Arquitetura/
│   ├── Clean Architecture.md        ← camadas, DIP, SOLID
│   ├── Estrategia de Testes.md      ← piramide, convencoes
│   ├── Padroes de Codigo.md         ← exemplos reais
│   ├── Mapa de Modulos.md           ← quem faz o que
│   ├── Decisoes de Arquitetura.md   ← ADRs
│   ├── Contratos API.md            ← back→front
│   └── Integracoes.md              ← servicos externos
│
├── Pipeline/                         ← fluxo principal
├── Regras de Negocio/                ← formulas, logica
├── Sessoes/                          ← 1 nota por dia
├── Fontes de Dados/                  ← origens
├── Personas/                         ← usuarios
├── Referencias/                      ← docs, links, artigos
└── Templates/                        ← modelo de sessao
```

## Protocolo do AI

Antes de codar, o AI consulta:

```
1. Entidades        → campos existem?
2. Padroes          → como faz aqui?
3. Anti-patterns    → o que nao fazer?
4. Mapa de Modulos  → ja existe?
5. Testes           → como testar?
6. Def. Travadas    → ja decidido?
7. Regras           → qual a formula?
```

## Fluxo diario

```
# Claude Code
/cortex start       → AI le vault, resume contexto
  trabalhar...      → AI consulta vault antes de codar
/cortex end         → salva decisoes e artefatos

# Cursor / Copilot
"Leia o vault e resuma o contexto"
  trabalhar...      → AI consulta vault via .cursorrules / copilot-instructions
"Salva a sessao de hoje no vault"
```

## Filosofia

1. **Codigo que sobrevive sem AI** — Clean Arch + testes obrigatorios
2. **Contexto estruturado > memoria** — vault e fonte da verdade
3. **Decisoes imutaveis** — o que foi validado nao se rediscute

## Estrutura do repo

```
cortex/
├── README.md                         ← voce esta aqui
├── .gitignore
├── skill/
│   └── cortex/
│       └── SKILL.md                  ← skill Claude Code (/cortex)
├── cursor-setup/
│   ├── rules/
│   │   ├── cortex-protocol.mdc      ← sempre ativo (consulta vault)
│   │   ├── cortex-init.mdc          ← "cortex init"
│   │   ├── cortex-start.mdc         ← "cortex start"
│   │   └── cortex-end.mdc           ← "cortex end"
│   ├── .cursorrules                  ← alternativa simples (sem rules)
│   ├── .cursorignore
│   └── SETUP-CURSOR.md              ← guia
├── copilot-setup/
│   ├── .github/
│   │   └── copilot-instructions.md  ← protocolo para Copilot
│   └── SETUP-COPILOT.md             ← guia
└── vault-template/                   ← template do vault (27 notas)
```

## Licenca

MIT
