# Cortex

**AI hallucina porque nao tem contexto.** Inventa campos, ignora regras, duplica logica.

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
# 1. Clone
git clone https://github.com/seu-usuario/cortex.git
cd cortex

# 2. Instale (pergunta qual agent voce usa)
chmod +x install.sh && ./install.sh
```

O instalador pergunta qual agent voce usa:

| Agent | O que instala | Vault recomendado |
|-------|-------------|-------------------|
| **Claude Code** | Skill `/cortex` em `~/.claude/skills/` | Qualquer path |
| **Cursor** | `.cursorrules` + `.cursorignore` no projeto | Qualquer path |
| **Copilot** | `.github/copilot-instructions.md` no projeto | Dentro do projeto |
| **Todos** | Tudo acima | Dentro do projeto |

### Setup manual

```bash
# Claude Code
cp -r skill/cortex ~/.claude/skills/cortex

# Cursor
cp cursor-setup/.cursorrules /path/do/projeto/.cursorrules
# Editar .cursorrules → preencher path do vault

# Copilot
mkdir -p /path/do/projeto/.github
cp copilot-setup/.github/copilot-instructions.md /path/do/projeto/.github/
# Copiar vault para dentro do projeto:
cp -r vault-template/ /path/do/projeto/docs/vault/
# Editar copilot-instructions.md → preencher path do vault
```

### Outros agents

Os arquivos sao markdown padrao. Adapte:
- **Windsurf** → copiar protocolo para `.windsurfrules`
- **Cline** → copiar para `.clinerules`
- **Outro** → adicionar como instrucao do agente

## Comandos

| Comando | O que faz |
|---------|-----------|
| `/cortex init` | Cria vault novo. Pergunta nome, stack e modo. |
| `/cortex start` | Abre sessao do dia. Le contexto e resume pendencias. |
| `/cortex end` | Fecha sessao. Salva decisoes e artefatos no vault. |

## Estrutura do vault

```
meu-projeto/
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
/cortex start       → AI le vault, resume contexto
  trabalhar...      → AI consulta vault antes de codar
/cortex end         → salva decisoes e artefatos
```

## Filosofia

1. **Codigo que sobrevive sem AI** — Clean Arch + testes obrigatorios
2. **Contexto estruturado > memoria** — vault e fonte da verdade
3. **Decisoes imutaveis** — o que foi validado nao se rediscute

## Estrutura do repo

```
cortex/
├── README.md                    ← voce esta aqui
├── install.sh                   ← instalador interativo
├── .gitignore
├── skill/
│   └── cortex/
│       └── SKILL.md             ← skill Claude Code (/cortex init, start, end)
├── cursor-setup/
│   ├── .cursorrules             ← protocolo Cortex para Cursor
│   ├── .cursorignore            ← ignora .obsidian/
│   └── SETUP-CURSOR.md         ← guia de setup
├── copilot-setup/
│   ├── .github/
│   │   └── copilot-instructions.md  ← protocolo Cortex para Copilot
│   └── SETUP-COPILOT.md        ← guia de setup
└── vault-template/              ← template do vault (27 notas)
```
