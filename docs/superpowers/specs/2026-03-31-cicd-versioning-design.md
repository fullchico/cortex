# CI/CD + Versioning — cortex-ai

**Data:** 2026-03-31  
**Status:** aprovado

---

## Objetivo

Configurar pipeline de CI/CD com versionamento semântico automático para o pacote `cortex-ai` no npm, usando GitHub Actions + `semantic-release`.

---

## Arquitetura

Dois workflows GitHub Actions independentes:

### `ci.yml` — Integração Contínua

- **Trigger:** push e pull_request para `main`
- **Steps:** checkout → Node 20 → `npm ci` → `npm test`
- **Propósito:** barrar merges com testes quebrados

### `release.yml` — Release Automático

- **Trigger:** push para `main` (apenas commits, não tags)
- **Steps:** checkout (fetch-depth: 0) → Node 20 → `npm ci` → `npx semantic-release`
- **Propósito:** analisar commits, bumpar versão, publicar no npm, criar GitHub Release

**Secrets necessários:**
- `NPM_TOKEN` — token de publicação npm (já existe, adicionar em Settings → Secrets)
- `GITHUB_TOKEN` — disponível automaticamente no Actions

---

## Versionamento Semântico

Controlado pelo `semantic-release` com base nos prefixos de commit:

| Prefixo | Impacto |
|---------|---------|
| `fix:` | patch (0.1.0 → 0.1.1) |
| `feat:` | minor (0.1.0 → 0.2.0) |
| `feat!:` / `BREAKING CHANGE:` | major (0.1.0 → 1.0.0) |
| `chore:`, `docs:`, `test:`, `refactor:` | sem release |

---

## Plugins `semantic-release` (`.releaserc.json`)

Executados em ordem:

1. `@semantic-release/commit-analyzer` — determina tipo de versão
2. `@semantic-release/release-notes-generator` — gera notas da release
3. `@semantic-release/changelog` — atualiza `CHANGELOG.md`
4. `@semantic-release/npm` — publica no npm com `NPM_TOKEN`
5. `@semantic-release/git` — commita `package.json` + `CHANGELOG.md` de volta ao `main`
6. `@semantic-release/github` — cria GitHub Release com notas

---

## Commitlint + Husky

Garante que commits locais seguem o padrão antes de chegar ao CI.

- **`commitlint.config.js`** — extends `@commitlint/config-conventional`
- **Husky hook `commit-msg`** — roda `commitlint` em cada commit local
- **Instalação:** `husky` configurado via `prepare` script no `package.json`

---

## Arquivos a criar

```
.github/
  workflows/
    ci.yml
    release.yml
.releaserc.json
commitlint.config.js
```

Modificações em `package.json`:
- Adicionar `devDependencies`: `semantic-release`, todos `@semantic-release/*`, `@commitlint/cli`, `@commitlint/config-conventional`, `husky`
- Adicionar script `"prepare": "husky"`

---

## Fluxo completo

```
dev faz commit local
  → husky roda commitlint
  → rejeita se não seguir conventional commits

dev faz push / abre PR
  → ci.yml roda testes
  → bloqueia merge se falhar

PR mergeado em main
  → release.yml roda
  → semantic-release analisa commits
  → se há feat/fix: bumpa versão, gera CHANGELOG, publica npm, cria GitHub Release
  → se só chore/docs: nada acontece
```

---

## Fora do escopo

- Ambientes de staging/preview
- Canary releases / dist-tags adicionais
- Monorepo setup
