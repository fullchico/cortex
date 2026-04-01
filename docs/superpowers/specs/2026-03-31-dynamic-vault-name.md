# Dynamic Vault Name Implementation Spec

## Goal

Permitir que o vault seja nomeado com o nome do projeto escolhido no CLI. Se o usuário nomear o projeto "Banana", o vault é criado em `banana/` em vez de sempre usar `cortex/`.

---

## Mecanismo: arquivo marcador `.cortex`

Um arquivo JSON na raiz do projeto aponta para o vault:

```json
{ "vault": "banana" }
```

| Propriedade | Valor |
|-------------|-------|
| Caminho | `<project-root>/.cortex` (arquivo, não pasta) |
| Formato | JSON: `{ "vault": "<nome-slugificado>" }` |
| Versionado | **Sim** — commitado junto com CLAUDE.md e cursor rules |
| Gitignored | **Não** — é o ponteiro, não o vault |

O vault em si (`banana/`) continua gitignored via `updateGitignore`.

---

## Slugificação do nome

Regra aplicada ao `NAME` do projeto para gerar o nome da pasta:

```
lowercase → espaços/underscores → hífen → remover caracteres não-alfanuméricos/hífen
```

Exemplos:

| NAME digitado | Vault gerado |
|--------------|-------------|
| `Banana` | `banana` |
| `My App` | `my-app` |
| `cortex` | `cortex` |
| `My_Project 2` | `my-project-2` |
| `Café App` | `caf-app` |

Função em `src/vault.js`:
```js
function slugifyVaultName(name) {
  return name
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
```

---

## Mudanças por arquivo

### `src/detect.js`

**Novo export: `readVaultName(opts)`**

```js
export function readVaultName(opts) {
  const markerPath = join(resolveCwd(opts), '.cortex')
  const ex = resolveExists(opts)
  if (!ex(markerPath)) return 'cortex'                        // fallback legado
  try {
    const { readFileSync } = await import('fs')               // já importado no topo
    return JSON.parse(readFileSync(markerPath, 'utf8')).vault ?? 'cortex'
  } catch {
    return 'cortex'
  }
}
```

**`vaultExists(opts)`** — usa `readVaultName`:
```js
export function vaultExists(opts) {
  const ex = resolveExists(opts)
  const name = readVaultName(opts)
  return ex(join(resolveCwd(opts), name))
}
```

**`detectVaultMode(opts)`** — troca `'.cortex'` por `readVaultName(opts)`:
```js
export function detectVaultMode(opts) {
  const ex = resolveExists(opts)
  const vaultPath = join(resolveCwd(opts), readVaultName(opts))
  if (!ex(vaultPath)) return null
  if (ex(join(vaultPath, 'Decisoes')) || ex(join(vaultPath, 'Decisions'))) return 'Projeto'
  return 'Freestyled'
}
```

**`detectVaultLang(opts)`** — idem:
```js
export function detectVaultLang(opts) {
  const ex = resolveExists(opts)
  const vaultPath = join(resolveCwd(opts), readVaultName(opts))
  if (ex(join(vaultPath, 'Project.md')) || ex(join(vaultPath, 'Project Memory.md'))) return 'en'
  return 'pt'
}
```

**Nota:** Adicionar `readFileSync` ao import existente em `detect.js`: `import { existsSync, readFileSync } from 'fs'`.

---

### `src/vault.js`

**Adicionar `slugifyVaultName` (privado):**
```js
function slugifyVaultName(name) {
  return name
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'cortex'  // fallback se resultado vazio
}
```

**`createVault(vars)`** — calcular `vaultPath` dinamicamente e criar marcador:
```js
export function createVault(vars) {
  const vaultName = slugifyVaultName(vars.NAME)
  const vaultPath = join(process.cwd(), vaultName)
  // Criar marcador antes de qualquer coisa
  writeFileSync(join(process.cwd(), '.cortex'), JSON.stringify({ vault: vaultName }))
  // ... resto igual, usando vaultPath
}
```

**`archiveVault(date, lang)`** — ler marcador para encontrar o vault:
```js
export function archiveVault(date, lang = 'pt') {
  const markerPath = join(process.cwd(), '.cortex')
  const vaultName = existsSync(markerPath)
    ? (JSON.parse(readFileSync(markerPath, 'utf8')).vault ?? 'cortex')
    : 'cortex'
  const vaultPath = join(process.cwd(), vaultName)
  // ... resto igual
}
```

**`migrateVault(vars)`** — idem, calcular vaultPath via slugify:
```js
export function migrateVault(vars) {
  const vaultName = slugifyVaultName(vars.NAME)
  const vaultPath = join(process.cwd(), vaultName)
  writeFileSync(join(process.cwd(), '.cortex'), JSON.stringify({ vault: vaultName }))
  // ... resto igual
}
```

**`readFreestyledRoot(lang, opts)`** — usar marcador:
```js
export function readFreestyledRoot(lang, opts) {
  const cwd = opts?.cwd ?? process.cwd()
  const markerPath = join(cwd, '.cortex')
  const vaultName = existsSync(markerPath)
    ? (JSON.parse(readFileSync(markerPath, 'utf8')).vault ?? 'cortex')
    : 'cortex'
  const vaultPath = join(cwd, vaultName)
  // ... resto igual
}
```

---

### `src/install.js`

**`updateGitignore`** — recebe o vault name e gitignora pelo nome correto:

Hoje: sempre adiciona `cortex/`
Depois: recebe `vaultName` como parâmetro e adiciona `${vaultName}/`

```js
export function updateGitignore(lang, vaultName = 'cortex') {
  // substituir entry estática por dinâmica
  const entry = `${vaultName}/`
  // ... resto igual
}
```

Ajustar chamada em `src/cli/install-phase.js`:
```js
updateGitignore(lang, slugifyVaultName(vars.NAME))
```

Exportar `slugifyVaultName` de `src/vault.js` para uso em `install-phase.js`.

---

### `src/cli/i18n.js` _(stretch goal)_

As mensagens de conclusão que mencionam o path do vault (ex: `install.created`, `install.vaultCreated`) idealmente mostram o nome real (`banana/` em vez de `cortex/`). Isso requer adicionar `{{vaultName}}` como variável de template nessas strings e passá-la em `install-phase.js`.

Escopo mínimo aceitável: mensagens mostram o nome genérico sem o path — não bloqueia a funcionalidade principal.

---

### Testes

**`test/detect.test.js`** — adicionar testes para `readVaultName`:
```js
it('readVaultName retorna cortex sem marcador (fallback)', () => {
  // sem .cortex na pasta
  assert.equal(readVaultName({ cwd: root }), 'cortex')
})

it('readVaultName le nome do marcador .cortex', () => {
  writeFileSync(join(root, '.cortex'), JSON.stringify({ vault: 'banana' }))
  assert.equal(readVaultName({ cwd: root }), 'banana')
})

it('vaultExists true com vault nomeado pelo marcador', () => {
  writeFileSync(join(root, '.cortex'), JSON.stringify({ vault: 'banana' }))
  mkdirSync(join(root, 'banana'))
  assert.ok(vaultExists({ cwd: root }))
})
```

**`test/vault-create-smoke.test.js`** — verificar que `createVault` cria marcador e pasta com nome slugificado:
```js
it('cria marcador .cortex e pasta com nome do projeto', () => {
  createVault({ ...baseVars, NAME: 'Banana App', MODE: 'Freestyled', LANG: 'pt' })
  const marker = JSON.parse(readFileSync(join(dir, '.cortex'), 'utf8'))
  assert.equal(marker.vault, 'banana-app')
  assert.ok(existsSync(join(dir, 'banana-app', 'Projeto.md')))
})
```

---

## Compatibilidade com projetos existentes

Projetos que já têm `cortex/` sem marcador `.cortex`:
- `readVaultName()` retorna `'cortex'` (fallback)
- `vaultExists()` encontra `cortex/` normalmente
- **Zero breaking change**

---

## Critérios de aceitação

- [ ] `npm test` passa com todos os testes (incluindo novos)
- [ ] `createVault({ NAME: 'Banana' })` cria `banana/` + `.cortex` com `{"vault":"banana"}`
- [ ] `vaultExists()` em projeto com `banana/` + `.cortex` retorna `true`
- [ ] `vaultExists()` em projeto com `cortex/` sem `.cortex` retorna `true` (fallback)
- [ ] `updateGitignore` adiciona `banana/` ao `.gitignore` (não `cortex/`)
- [ ] Busca por string `'cortex'` hardcoded em `src/detect.js` e `src/vault.js` retorna 0 (exceto fallbacks e slugify default)
