# Rename `.cortex` → `cortex` + README Rewrite Spec

## Goal

Rename the vault folder from `.cortex/` to `cortex/` across todo o codebase para que o vault seja visível no Obsidian file explorer. Em paralelo, reescrever o README para posicionar Cortex como uma **skill que devs adotam** para trabalhar melhor com AI — não como um framework que se instala.

---

## Parte 1 — Rename `.cortex` → `cortex`

### Root cause

Obsidian esconde automaticamente todas as pastas com prefixo `.` (dot-folders). A pasta `.cortex/` usa esse prefixo, tornando o vault invisível no file explorer do Obsidian. Não há setting nativo do Obsidian para mudar esse comportamento.

### Escopo completo de arquivos

#### Código fonte (`src/`)

| Arquivo | O que muda |
|---------|-----------|
| `src/detect.js` | String literal `'.cortex'` → `'cortex'` (1 ocorrência na função `vaultExists` e relacionadas) |
| `src/vault.js` | Constante ou string `'.cortex'` em todos os builders e funções (`createVault`, `archiveVault`, `migrateVault`, `readFreestyledRoot`) |
| `src/install.js` | Path `.cortex` → `cortex` (ex: `updateGitignore` adiciona `cortex/` em vez de `.cortex/`) |
| `src/cli/i18n.js` | Strings i18n que mencionam `.cortex/` (ex: `init.confirmVault`, `install.vaultCreated`) |
| `src/cli/existing-vault.js` | Qualquer mensagem de display com `.cortex` |
| `src/cli/install-phase.js` | Mensagens do summary de conclusão |

#### Templates (`templates/pt/` e `templates/en/`)

202 ocorrências — todos os arquivos `.md` de template que referenciam `.cortex/` nos caminhos, exemplos de estrutura de pastas e wikilinks. Replace global em todos os arquivos.

#### Regras de AI tools (`.cursor/rules/`)

43 ocorrências nos arquivos `.mdc` do protocolo Cursor — `cortex-protocol.mdc`, `cortex-start.mdc`, `cortex-end.mdc`.

#### Raiz do projeto

| Arquivo | O que muda |
|---------|-----------|
| `CLAUDE.md` | Todas as referências `./.cortex/` → `./cortex/` |
| `README.md` | Todas as referências `.cortex/` → `cortex/` (tratado em Parte 2) |

#### Testes (`test/`)

| Arquivo | O que muda |
|---------|-----------|
| `test/vault-create-smoke.test.js` | `join(dir, '.cortex', ...)` → `join(dir, 'cortex', ...)` |
| `test/vault-read-freestyled.test.js` | `join(root, '.cortex')` → `join(root, 'cortex')` |
| `test/detect.test.js` | `mkdirSync(join(root, '.cortex'))` → `join(root, 'cortex')` + nomes dos testes |
| `test/i18n.test.js` | Strings de teste que contêm `/app/.cortex/` → `/app/cortex/` |

#### Vault local do projeto

A pasta `.cortex/` na raiz do projeto (gitignored) deve ser renomeada para `cortex/` para consistência:
```bash
mv .cortex cortex
```

### O que NÃO muda

- Nome do pacote npm: `@fullchico/cortex-ai` — não relacionado ao folder name
- Nome do projeto: "Cortex" — sem dot, não afetado
- Binário `cortex-ai` — não afetado
- Comandos `cortex start`, `cortex end` — não afetados

### Gitignore behavior

O install atualmente adiciona `.cortex/` ao `.gitignore`. Após o rename, adiciona `cortex/` em vez de `.cortex/`. O vault permanece gitignored — comportamento inalterado.

### Observação para usuários existentes

Usuários com `.cortex/` existente precisarão renomear manualmente: `mv .cortex cortex`. Não há script de migração — o rename é simples e único. Deve ser documentado no CHANGELOG.

---

## Parte 2 — README como skill para dev

### Posicionamento

**Antes:** "AI alucina porque não tem contexto. Cortex estrutura o contexto."
→ Framing de problema/solução técnica. Foco na ferramenta.

**Depois:** Cortex como skill que o dev adota — uma competência para trabalhar melhor com AI, não apenas um pacote que se instala.
→ Framing de transformação pessoal. Foco no dev.

### Princípios de escrita aplicados

1. **Lead com transformação, não com problema** — a abertura fala sobre o que muda no trabalho do dev, não sobre a falha da AI
2. **Concreto antes de abstrato** — fluxo diário (`cortex start`, `cortex end`) aparece cedo, antes de explicar a arquitetura interna
3. **Verbos ativos, frases curtas** — "Você consulta. A IA respeita." em vez de parágrafos expositivos
4. **Jargão técnico só na seção técnica** — "vault", "DDD", "Aggregate" ficam nas seções de detalhe, não no hook
5. **Progressão: skill → como funciona → detalhe** — o leitor entende o valor antes de ver a estrutura

### Nova estrutura do README

```
# Cortex
[tagline como skill]

[parágrafo de abertura: o dev + AI + o que Cortex muda]

## Instalação
[igual ao atual — curto, direto]

## Fluxo diário
[movido para o topo — é o mais importante e concreto]
  cortex start auth → trabalha → cortex end

## Como funciona
[3 bullets: você instala, a IA consulta, o vault aprende]

## 2 modos
[igual ao atual]

## Migração Freestyled → Projeto
[igual]

## Iniciar novo projeto
[igual]

## Superset — CLAUDE.md existente
[igual]

## Contextos
[igual]

## Comandos
[igual]

## O que fica no projeto
[igual — atualizado com cortex/ sem dot]

## Filosofia
[igual]

## Licença + footer
[igual]
```

### Tom e voz

- Segunda pessoa direta: "Você adota Cortex como quem adota TDD"
- Sem evangelismo — declarativo, não persuasivo
- Linguagem de dev: menciona práticas conhecidas (TDD, pair programming) como referência de "skill"
- PT-BR informal mas profissional (sem gírias, sem emojis no corpo)

---

## Critérios de aceitação

- [ ] `npm test` passa com 70 testes após o rename
- [ ] Busca por `.cortex` no codebase retorna 0 resultados (exceto `docs/`, CHANGELOG e histórico git)
- [ ] `cortex/` aparece visível no Obsidian file explorer ao abrir o projeto como vault
- [ ] README abre posicionando Cortex como skill — sem mencionar "framework" ou "vault" no primeiro parágrafo
- [ ] Fluxo diário aparece antes de "2 modos" no README
