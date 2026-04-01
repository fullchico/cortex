# Dynamic Vault Name Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer o vault usar o nome do projeto como nome da pasta (ex: projeto "Banana" → `banana/`), com um arquivo marcador `.cortex` na raiz apontando para o vault.

**Architecture:** `slugifyVaultName(name)` gera o nome da pasta a partir do nome do projeto. `createVault` escreve `.cortex` (JSON com `{"vault":"banana"}`) antes de criar o vault. `readVaultName(opts)` em `detect.js` lê esse marcador; todas as funções de detecção passam a usá-lo. Fallback para `'cortex'` quando não existe marcador (compatibilidade com projetos existentes).

**Tech Stack:** Node.js 22, `node:test`, `node:assert/strict`, ESM (`"type": "module"`).

---

## File Map

| Arquivo | Ação | O que muda |
|---------|------|-----------|
| `src/vault.js` | Modify | Adiciona `slugifyVaultName` (export), escreve `.cortex` em `createVault`/`migrateVault`, usa nome dinâmico em `archiveVault`/`readFreestyledRoot` |
| `src/detect.js` | Modify | Adiciona import `readFileSync`, adiciona export `readVaultName`, atualiza `vaultExists`/`detectVaultMode`/`detectVaultLang` |
| `src/install.js` | Modify | `updateGitignore(lang, vaultName)` — aceita nome dinâmico |
| `src/cli/install-phase.js` | Modify | Passa `slugifyVaultName(vars.NAME)` para `updateGitignore` |
| `test/detect.test.js` | Modify | Adiciona testes para `readVaultName` (fallback + marker) e `vaultExists` com marker |
| `test/vault-create-smoke.test.js` | Modify | Adiciona testes para `slugifyVaultName` e criação de marcador `.cortex` |

---

## Task 1: `slugifyVaultName` em `vault.js`

**Files:**
- Modify: `src/vault.js` (após linha 8, antes de `// --- Estruturas de diretórios ---`)
- Modify: `test/vault-create-smoke.test.js`

- [ ] **Step 1: Adicionar import de `slugifyVaultName` no topo do test file**

Ler `test/vault-create-smoke.test.js`. Adicionar ao import existente:

```js
import { createVault, slugifyVaultName } from '../src/vault.js'
```

- [ ] **Step 2: Escrever testes para `slugifyVaultName`**

Adicionar no final de `test/vault-create-smoke.test.js`, depois dos describes existentes:

```js
describe('slugifyVaultName', () => {
  it('lowercase', () => {
    assert.equal(slugifyVaultName('Banana'), 'banana')
  })

  it('espacos viram hifen', () => {
    assert.equal(slugifyVaultName('My App'), 'my-app')
  })

  it('underscores viram hifen', () => {
    assert.equal(slugifyVaultName('my_project'), 'my-project')
  })

  it('caracteres especiais removidos', () => {
    assert.equal(slugifyVaultName('My App!'), 'my-app')
  })

  it('hifens duplos colapsados', () => {
    assert.equal(slugifyVaultName('My  App'), 'my-app')
  })

  it('nome vazio retorna cortex', () => {
    assert.equal(slugifyVaultName(''), 'cortex')
  })

  it('cortex preservado', () => {
    assert.equal(slugifyVaultName('cortex'), 'cortex')
  })
})
```

- [ ] **Step 3: Rodar e confirmar que falha**

```bash
cd /Users/diogobarbosa/Desktop/EUREKA/PROJETOS/cortex
node --experimental-test-module-mocks --test test/vault-create-smoke.test.js
```

Esperado: falha com `slugifyVaultName is not a function` ou similar.

- [ ] **Step 4: Implementar `slugifyVaultName` em `src/vault.js`**

Inserir logo após a linha 8 (`const TEMPLATES = ...`), antes de `// --- Estruturas de diretórios ---`:

```js
// --- Helpers públicos ---

export function slugifyVaultName(name) {
  return name
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'cortex'
}
```

- [ ] **Step 5: Rodar e confirmar que passa**

```bash
node --experimental-test-module-mocks --test test/vault-create-smoke.test.js
```

Esperado: todos os testes do arquivo passando (incluindo os 7 novos).

- [ ] **Step 6: Commit**

```bash
git add src/vault.js test/vault-create-smoke.test.js
git commit -m "feat: add slugifyVaultName for dynamic vault folder naming"
```

---

## Task 2: `readVaultName` em `detect.js`

**Files:**
- Modify: `src/detect.js`
- Modify: `test/detect.test.js`

- [ ] **Step 1: Escrever testes para `readVaultName`**

Ler `test/detect.test.js`. Adicionar ao import existente `readVaultName`:

```js
import { detectAiTools, vaultExists, detectVaultMode, detectVaultLang, readVaultName } from '../src/detect.js'
```

Adicionar no final do arquivo (após os describes existentes):

```js
describe('readVaultName', () => {
  let root
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'cortex-detect-'))
  })
  afterEach(() => rmSync(root, { recursive: true, force: true }))

  it('retorna cortex como fallback quando nao ha marcador', () => {
    assert.equal(readVaultName({ cwd: root }), 'cortex')
  })

  it('le nome do arquivo marcador .cortex', () => {
    writeFileSync(join(root, '.cortex'), JSON.stringify({ vault: 'banana' }))
    assert.equal(readVaultName({ cwd: root }), 'banana')
  })

  it('fallback cortex se JSON invalido', () => {
    writeFileSync(join(root, '.cortex'), 'not-json')
    assert.equal(readVaultName({ cwd: root }), 'cortex')
  })

  it('fallback cortex se vault ausente no JSON', () => {
    writeFileSync(join(root, '.cortex'), JSON.stringify({}))
    assert.equal(readVaultName({ cwd: root }), 'cortex')
  })
})
```

Adicionar imports necessários no topo de `test/detect.test.js` (se não existirem):

```js
import { writeFileSync } from 'fs'
```

- [ ] **Step 2: Rodar e confirmar que falha**

```bash
node --experimental-test-module-mocks --test test/detect.test.js
```

Esperado: falha com `readVaultName is not a function`.

- [ ] **Step 3: Adicionar `readFileSync` ao import de `src/detect.js`**

A linha 1 atual é:
```js
import { existsSync } from 'fs'
```

Substituir por:
```js
import { existsSync, readFileSync } from 'fs'
```

- [ ] **Step 4: Implementar `readVaultName` em `src/detect.js`**

Inserir após a função `resolveExists` (por volta da linha 27), antes de `export function detectAiTools`:

```js
/** Lê o nome do vault a partir do marcador `.cortex` na raiz do projeto.
 *  Retorna `'cortex'` como fallback (compatibilidade com projetos existentes).
 *  @param {DetectOptions} [opts]
 */
export function readVaultName(opts) {
  const markerPath = join(resolveCwd(opts), '.cortex')
  const ex = resolveExists(opts)
  if (!ex(markerPath)) return 'cortex'
  try {
    const raw = readFileSync(markerPath, 'utf8')
    return JSON.parse(raw).vault ?? 'cortex'
  } catch {
    return 'cortex'
  }
}
```

- [ ] **Step 5: Rodar e confirmar que passa**

```bash
node --experimental-test-module-mocks --test test/detect.test.js
```

Esperado: todos os testes passando incluindo os 4 novos de `readVaultName`.

- [ ] **Step 6: Commit**

```bash
git add src/detect.js test/detect.test.js
git commit -m "feat: add readVaultName to read vault location from .cortex marker"
```

---

## Task 3: Atualizar `vaultExists`, `detectVaultMode`, `detectVaultLang` em `detect.js`

**Files:**
- Modify: `src/detect.js`
- Modify: `test/detect.test.js`

Os testes existentes criam `cortex/` diretamente — como `readVaultName` faz fallback para `'cortex'` quando não há marcador, eles continuam passando sem alteração. Novos testes cobrem o comportamento com marcador.

- [ ] **Step 1: Adicionar testes de `vaultExists` com marcador**

Adicionar dentro do describe `readVaultName` existente (ou criar novo describe `vaultExists com marcador`):

```js
describe('vaultExists com marcador', () => {
  let root
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'cortex-detect-'))
  })
  afterEach(() => rmSync(root, { recursive: true, force: true }))

  it('encontra vault nomeado pelo marcador', () => {
    writeFileSync(join(root, '.cortex'), JSON.stringify({ vault: 'banana' }))
    mkdirSync(join(root, 'banana'))
    assert.ok(vaultExists({ cwd: root }))
  })

  it('nao encontra vault quando pasta nao existe mas marcador sim', () => {
    writeFileSync(join(root, '.cortex'), JSON.stringify({ vault: 'banana' }))
    assert.ok(!vaultExists({ cwd: root }))
  })
})
```

- [ ] **Step 2: Rodar e confirmar que falha**

```bash
node --experimental-test-module-mocks --test test/detect.test.js
```

Esperado: os 2 novos testes falham pois `vaultExists` ainda usa `'cortex'` hardcoded.

- [ ] **Step 3: Atualizar `vaultExists` em `src/detect.js`**

Substituir:
```js
export function vaultExists(opts) {
  const ex = resolveExists(opts)
  return ex(join(resolveCwd(opts), 'cortex'))
}
```

Por:
```js
export function vaultExists(opts) {
  const ex = resolveExists(opts)
  return ex(join(resolveCwd(opts), readVaultName(opts)))
}
```

- [ ] **Step 4: Atualizar `detectVaultMode` em `src/detect.js`**

Substituir:
```js
export function detectVaultMode(opts) {
  const ex = resolveExists(opts)
  const vaultPath = join(resolveCwd(opts), 'cortex')
```

Por:
```js
export function detectVaultMode(opts) {
  const ex = resolveExists(opts)
  const vaultPath = join(resolveCwd(opts), readVaultName(opts))
```

- [ ] **Step 5: Atualizar `detectVaultLang` em `src/detect.js`**

Substituir:
```js
export function detectVaultLang(opts) {
  const ex = resolveExists(opts)
  const vaultPath = join(resolveCwd(opts), 'cortex')
```

Por:
```js
export function detectVaultLang(opts) {
  const ex = resolveExists(opts)
  const vaultPath = join(resolveCwd(opts), readVaultName(opts))
```

- [ ] **Step 6: Rodar e confirmar que todos passam**

```bash
node --experimental-test-module-mocks --test test/detect.test.js
```

Esperado: todos os testes passando (incluindo os existentes — fallback garante compatibilidade).

- [ ] **Step 7: Rodar suite completa**

```bash
npm test
```

Esperado: 70+ testes passando, zero falhas.

- [ ] **Step 8: Commit**

```bash
git add src/detect.js test/detect.test.js
git commit -m "feat: update vault detection functions to use dynamic vault name from marker"
```

---

## Task 4: Atualizar `vault.js` — criar marcador e usar nome dinâmico

**Files:**
- Modify: `src/vault.js`
- Modify: `test/vault-create-smoke.test.js`

- [ ] **Step 1: Adicionar testes de criação de marcador em `vault-create-smoke.test.js`**

Adicionar ao describe `createVault (smoke)` existente:

```js
it('cria marcador .cortex com nome slugificado', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cortex-smoke-'))
  const prev = process.cwd()
  try {
    process.chdir(dir)
    createVault({ ...baseVars, NAME: 'Banana App', MODE: 'Freestyled', LANG: 'pt' })
    const marker = JSON.parse(readFileSync(join(dir, '.cortex'), 'utf8'))
    assert.equal(marker.vault, 'banana-app')
    assert.ok(existsSync(join(dir, 'banana-app', 'Projeto.md')))
  } finally {
    process.chdir(prev)
    rmSync(dir, { recursive: true, force: true })
  }
})

it('cria marcador .cortex com nome do baseVars (Smoke → smoke)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cortex-smoke-'))
  const prev = process.cwd()
  try {
    process.chdir(dir)
    createVault({ ...baseVars, MODE: 'Freestyled', LANG: 'pt' })
    const marker = JSON.parse(readFileSync(join(dir, '.cortex'), 'utf8'))
    assert.equal(marker.vault, 'smoke')
    assert.ok(existsSync(join(dir, 'smoke', 'Projeto.md')))
  } finally {
    process.chdir(prev)
    rmSync(dir, { recursive: true, force: true })
  }
})
```

Adicionar `readFileSync` ao import no topo de `test/vault-create-smoke.test.js`:

```js
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'fs'
```

- [ ] **Step 2: Rodar e confirmar que falha**

```bash
node --experimental-test-module-mocks --test test/vault-create-smoke.test.js
```

Esperado: os 2 novos testes falham (vault ainda cria em `cortex/`, não em `banana-app/`).

- [ ] **Step 3: Atualizar `createVault` em `src/vault.js`**

Substituir:
```js
export function createVault(vars) {
  const { LANG, MODE } = vars
  const vaultPath = join(process.cwd(), 'cortex')
```

Por:
```js
export function createVault(vars) {
  const { LANG, MODE } = vars
  const vaultName = slugifyVaultName(vars.NAME)
  writeFileSync(join(process.cwd(), '.cortex'), JSON.stringify({ vault: vaultName }))
  const vaultPath = join(process.cwd(), vaultName)
```

- [ ] **Step 4: Atualizar `migrateVault` em `src/vault.js`**

Substituir:
```js
export function migrateVault(vars) {
  const { LANG } = vars
  const vaultPath = join(process.cwd(), 'cortex')
```

Por:
```js
export function migrateVault(vars) {
  const { LANG } = vars
  const vaultName = slugifyVaultName(vars.NAME)
  writeFileSync(join(process.cwd(), '.cortex'), JSON.stringify({ vault: vaultName }))
  const vaultPath = join(process.cwd(), vaultName)
```

- [ ] **Step 5: Atualizar `archiveVault` em `src/vault.js`**

Substituir:
```js
export function archiveVault(date, lang = 'pt') {
  const vaultPath = join(process.cwd(), 'cortex')
```

Por:
```js
export function archiveVault(date, lang = 'pt') {
  const markerPath = join(process.cwd(), '.cortex')
  const vaultName = existsSync(markerPath)
    ? (JSON.parse(readFileSync(markerPath, 'utf8')).vault ?? 'cortex')
    : 'cortex'
  const vaultPath = join(process.cwd(), vaultName)
```

- [ ] **Step 6: Atualizar `readFreestyledRoot` em `src/vault.js`**

Substituir:
```js
export function readFreestyledRoot(lang, opts) {
  const vaultPath = join(opts?.cwd ?? process.cwd(), 'cortex')
```

Por:
```js
export function readFreestyledRoot(lang, opts) {
  const cwd = opts?.cwd ?? process.cwd()
  const markerPath = join(cwd, '.cortex')
  const vaultName = existsSync(markerPath)
    ? (JSON.parse(readFileSync(markerPath, 'utf8')).vault ?? 'cortex')
    : 'cortex'
  const vaultPath = join(cwd, vaultName)
```

- [ ] **Step 7: Atualizar `test/vault-read-freestyled.test.js`**

Ler o arquivo. Os testes criam `cortex/` diretamente e chamam `readFreestyledRoot`. Com a mudança, `readFreestyledRoot` vai procurar pelo marcador `.cortex` e usar o nome dele. Sem marcador, fallback para `'cortex'` — os testes existentes passam sem alteração.

Verificar rodando:

```bash
node --experimental-test-module-mocks --test test/vault-read-freestyled.test.js
```

Esperado: todos os testes passando (fallback garante compatibilidade).

- [ ] **Step 8: Rodar suite completa**

```bash
npm test
```

Esperado: todos os testes passando.

- [ ] **Step 9: Commit**

```bash
git add src/vault.js test/vault-create-smoke.test.js
git commit -m "feat: createVault writes .cortex marker and uses slugified project name as vault folder"
```

---

## Task 5: Atualizar `updateGitignore` e `install-phase.js`

**Files:**
- Modify: `src/install.js` (linha 75–89)
- Modify: `src/cli/install-phase.js` (linha 35)

Não há testes unitários para `updateGitignore` (usa FS real). A verificação é feita via `npm test` (suite completa) e inspeção manual do comportamento.

- [ ] **Step 1: Atualizar `updateGitignore` em `src/install.js`**

Substituir:
```js
export function updateGitignore(lang = 'pt') {
  const gitignorePath = join(process.cwd(), '.gitignore')
  const entry = 'cortex/'
```

Por:
```js
export function updateGitignore(lang = 'pt', vaultName = 'cortex') {
  const gitignorePath = join(process.cwd(), '.gitignore')
  const entry = `${vaultName}/`
```

- [ ] **Step 2: Adicionar import de `slugifyVaultName` em `src/cli/install-phase.js`**

A linha 2 atual é:
```js
import { createVault, migrateVault, archiveVault } from '../vault.js'
```

Substituir por:
```js
import { createVault, migrateVault, archiveVault, slugifyVaultName } from '../vault.js'
```

- [ ] **Step 3: Atualizar chamada de `updateGitignore` em `src/cli/install-phase.js`**

Substituir:
```js
  updateGitignore(lang)
```

Por:
```js
  updateGitignore(lang, slugifyVaultName(vars.NAME))
```

- [ ] **Step 4: Rodar suite completa**

```bash
npm test
```

Esperado: todos os testes passando.

- [ ] **Step 5: Commit**

```bash
git add src/install.js src/cli/install-phase.js
git commit -m "feat: updateGitignore uses dynamic vault name from project"
```

---

## Verificação final

- [ ] **Confirmar zero ocorrências de `'cortex'` hardcoded como vault path** (exceto fallbacks e default de `slugifyVaultName`):

```bash
grep -n "'cortex'" src/detect.js src/vault.js src/install.js src/cli/install-phase.js
```

Esperado: apenas as linhas de fallback (`?? 'cortex'`, `|| 'cortex'`, `= 'cortex'`).

- [ ] **Rodar suite completa final**

```bash
npm test
```

Esperado: 77+ testes passando (70 existentes + 7 slugify + 4 readVaultName + 2 vaultExists-marker + 2 createVault-marker), zero falhas.
