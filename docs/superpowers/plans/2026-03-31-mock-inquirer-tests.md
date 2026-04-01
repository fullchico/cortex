# Mock Inquirer — Interactive Flow Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `node:test` tests for all interactive CLI prompt functions using `mock.module('@inquirer/prompts', ...)` — zero production code changes.

**Architecture:** Each new test file sets up `mock.module()` at the top level with closure variables (`nextSelect`, `inputQueue`, etc.) before dynamically importing the module under test. Tests assign values to those variables to control what each prompt returns. For `runExistingVaultFlow`, additional mocks cover `../src/detect.js`, `../src/vault.js`, and `../src/cli/ai-tools.js`.

**Tech Stack:** Node.js 22, `node:test` (native runner), `node:assert/strict`, `@inquirer/prompts` (mocked), no new dependencies.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `test/mode-and-practices.test.js` | **Create** | Tests for `promptMode`, `promptFreestyledPractices`, `promptHasSpecImport` |
| `test/project-basics.test.js` | **Create** | Tests for `promptProjectBasics` (with/without prefill, trimming) |
| `test/project-stack.test.js` | **Create** | Tests for `promptProjectType`, `promptStack` (all 4 branches incl. custom input) |
| `test/existing-vault-flow.test.js` | **Create** | Tests for `runExistingVaultFlow` (5 branches: no-vault, exit, tools, migrate, reinit) |

---

## Task 1: `test/mode-and-practices.test.js`

**Files:**
- Create: `test/mode-and-practices.test.js`
- Source: `src/cli/mode-and-practices.js`

- [ ] **Step 1: Create the test file**

```js
import { describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'

// Mocks declarados antes de qualquer import dinâmico
let nextSelect = null
let nextCheckbox = []
let nextConfirm = false

mock.module('@inquirer/prompts', {
  namedExports: {
    select: async () => nextSelect,
    checkbox: async () => nextCheckbox,
    confirm: async () => nextConfirm,
    input: async () => '',
  },
})

const { promptMode, promptFreestyledPractices, promptHasSpecImport } =
  await import('../src/cli/mode-and-practices.js')

describe('promptMode', () => {
  it('pt retorna Freestyled quando select resolve Freestyled', async () => {
    nextSelect = 'Freestyled'
    assert.equal(await promptMode('pt', false), 'Freestyled')
  })

  it('pt retorna Projeto quando select resolve Projeto', async () => {
    nextSelect = 'Projeto'
    assert.equal(await promptMode('pt', false), 'Projeto')
  })

  it('en retorna Freestyled', async () => {
    nextSelect = 'Freestyled'
    assert.equal(await promptMode('en', false), 'Freestyled')
  })
})

describe('promptFreestyledPractices', () => {
  it('retorna array vazio quando nada selecionado', async () => {
    nextCheckbox = []
    const result = await promptFreestyledPractices('pt', 'backend')
    assert.deepEqual(result, [])
  })

  it('retorna práticas selecionadas', async () => {
    nextCheckbox = ['tests', 'solid']
    const result = await promptFreestyledPractices('pt', 'backend')
    assert.deepEqual(result, ['tests', 'solid'])
  })

  it('aceita todas as práticas', async () => {
    nextCheckbox = ['tests', 'clean', 'solid']
    const result = await promptFreestyledPractices('en', 'frontend')
    assert.deepEqual(result, ['tests', 'clean', 'solid'])
  })
})

describe('promptHasSpecImport', () => {
  it('retorna false quando confirm resolve false', async () => {
    nextConfirm = false
    assert.equal(await promptHasSpecImport('pt'), false)
  })

  it('retorna true quando confirm resolve true', async () => {
    nextConfirm = true
    assert.equal(await promptHasSpecImport('pt'), true)
  })
})
```

- [ ] **Step 2: Rodar e verificar que passa**

```bash
cd /Users/diogobarbosa/Desktop/EUREKA/PROJETOS/cortex
node --test test/mode-and-practices.test.js
```

Esperado: todos os `it` marcados como `▶ pass`.

- [ ] **Step 3: Commit**

```bash
git add test/mode-and-practices.test.js
git commit -m "test: add mock-inquirer tests for mode-and-practices"
```

---

## Task 2: `test/project-basics.test.js`

**Files:**
- Create: `test/project-basics.test.js`
- Source: `src/cli/project-basics.js`

- [ ] **Step 1: Create the test file**

```js
import { describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'

let inputQueue = []

mock.module('@inquirer/prompts', {
  namedExports: {
    input: async () => inputQueue.shift(),
    select: async () => null,
    confirm: async () => false,
    checkbox: async () => [],
  },
})

const { promptProjectBasics } = await import('../src/cli/project-basics.js')

describe('promptProjectBasics', () => {
  it('sem prefill retorna name e description', async () => {
    inputQueue = ['MeuProjeto', 'Framework de AI']
    const result = await promptProjectBasics({}, 'pt')
    assert.deepEqual(result, { name: 'MeuProjeto', description: 'Framework de AI' })
  })

  it('faz trim de espaços', async () => {
    inputQueue = ['  Cortex  ', '  Contexto persistente  ']
    const result = await promptProjectBasics({}, 'pt')
    assert.deepEqual(result, { name: 'Cortex', description: 'Contexto persistente' })
  })

  it('en funciona igual', async () => {
    inputQueue = ['MyProject', 'A great tool']
    const result = await promptProjectBasics({}, 'en')
    assert.deepEqual(result, { name: 'MyProject', description: 'A great tool' })
  })
})
```

- [ ] **Step 2: Rodar e verificar que passa**

```bash
node --test test/project-basics.test.js
```

Esperado: 3 testes passando.

- [ ] **Step 3: Commit**

```bash
git add test/project-basics.test.js
git commit -m "test: add mock-inquirer tests for project-basics"
```

---

## Task 3: `test/project-stack.test.js`

**Files:**
- Create: `test/project-stack.test.js`
- Source: `src/cli/project-stack.js`

Nota: `promptStack` chama `select` múltiplas vezes para `fullstack` (uma para front, uma para back). Para o caso `'other'`, chama `select` + `input`. A fila drena na ordem das chamadas.

- [ ] **Step 1: Create the test file**

```js
import { describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'

let selectQueue = []
let inputQueue = []

mock.module('@inquirer/prompts', {
  namedExports: {
    select: async () => selectQueue.shift(),
    input: async () => inputQueue.shift(),
    confirm: async () => false,
    checkbox: async () => [],
  },
})

const { promptProjectType, promptStack } = await import('../src/cli/project-stack.js')

describe('promptProjectType', () => {
  it('retorna o valor selecionado', async () => {
    selectQueue = ['backend']
    assert.equal(await promptProjectType('pt'), 'backend')
  })

  it('en funciona igual', async () => {
    selectQueue = ['frontend']
    assert.equal(await promptProjectType('en'), 'frontend')
  })
})

describe('promptStack — backend', () => {
  it('backend Node.js', async () => {
    selectQueue = ['Node.js']
    assert.equal(await promptStack('pt', 'backend'), 'Node.js')
  })

  it('backend Java', async () => {
    selectQueue = ['Java']
    assert.equal(await promptStack('pt', 'backend'), 'Java')
  })

  it('backend other → custom input', async () => {
    selectQueue = ['other']
    inputQueue = ['Bun']
    assert.equal(await promptStack('pt', 'backend'), 'Bun')
  })
})

describe('promptStack — frontend', () => {
  it('frontend React', async () => {
    selectQueue = ['React']
    assert.equal(await promptStack('pt', 'frontend'), 'React')
  })

  it('frontend other → custom input', async () => {
    selectQueue = ['other']
    inputQueue = ['Svelte']
    assert.equal(await promptStack('pt', 'frontend'), 'Svelte')
  })
})

describe('promptStack — fullstack', () => {
  it('combina front + back com espaço " + "', async () => {
    selectQueue = ['React', 'Node.js']
    assert.equal(await promptStack('pt', 'fullstack'), 'React + Node.js')
  })

  it('front other + back Go', async () => {
    selectQueue = ['other', 'Go']
    inputQueue = ['Svelte']
    assert.equal(await promptStack('pt', 'fullstack'), 'Svelte + Go')
  })
})
```

- [ ] **Step 2: Rodar e verificar que passa**

```bash
node --test test/project-stack.test.js
```

Esperado: 9 testes passando.

- [ ] **Step 3: Commit**

```bash
git add test/project-stack.test.js
git commit -m "test: add mock-inquirer tests for project-stack"
```

---

## Task 4: `test/existing-vault-flow.test.js`

**Files:**
- Create: `test/existing-vault-flow.test.js`
- Source: `src/cli/existing-vault.js`

Este arquivo precisa de 4 mocks:
1. `@inquirer/prompts` — controla o `select` do menu
2. `../src/detect.js` — controla `vaultExists`, `detectVaultMode`, `detectVaultLang`, `detectAiTools`
3. `../src/cli/ai-tools.js` — isola `promptAiTools` e `installSelectedAiTools` do FS
4. `../src/vault.js` — isola `readFreestyledRoot` (migrate branch)

Os caminhos relativos são resolvidos a partir de `test/`, e batem com os caminhos que `src/cli/existing-vault.js` resolve a partir de `src/cli/`.

- [ ] **Step 1: Create the test file**

```js
import { describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'

// Variáveis de controle — cada it() define antes de chamar
let nextSelect = null
let vaultExistsMock = false
let detectVaultModeMock = 'Freestyled'
let detectVaultLangMock = 'pt'

// 1. Mock @inquirer/prompts
mock.module('@inquirer/prompts', {
  namedExports: {
    select: async () => nextSelect,
    checkbox: async () => [],
    confirm: async () => true,
    input: async () => '',
  },
})

// 2. Mock ../src/detect.js (relativo a test/, resolve para src/detect.js)
mock.module('../src/detect.js', {
  namedExports: {
    vaultExists: () => vaultExistsMock,
    detectVaultMode: () => detectVaultModeMock,
    detectVaultLang: () => detectVaultLangMock,
    detectAiTools: () => [],
  },
})

// 3. Mock ../src/cli/ai-tools.js (relativo a test/, resolve para src/cli/ai-tools.js)
mock.module('../src/cli/ai-tools.js', {
  namedExports: {
    promptAiTools: async () => [],
    installSelectedAiTools: () => {},
    logDetectedTools: () => {},
    getAiToolCheckboxChoices: () => [],
  },
})

// 4. Mock ../src/vault.js — apenas readFreestyledRoot é usado aqui
mock.module('../src/vault.js', {
  namedExports: {
    readFreestyledRoot: () => ({ name: 'Antigo', description: 'Desc antiga' }),
    createVault: () => {},
    archiveVault: () => {},
    migrateVault: () => {},
  },
})

// Import dinâmico DEPOIS de todos os mocks
const { runExistingVaultFlow } = await import('../src/cli/existing-vault.js')

describe('runExistingVaultFlow', () => {
  it('sem vault → continue sem flags', async () => {
    vaultExistsMock = false
    const result = await runExistingVaultFlow('pt')
    assert.deepEqual(result, { kind: 'continue', isMigrate: false, isReinit: false, prefill: {} })
  })

  it('vault existe + select exit → kind exit code 0', async () => {
    vaultExistsMock = true
    detectVaultModeMock = 'Freestyled'
    nextSelect = 'exit'
    const result = await runExistingVaultFlow('pt')
    assert.equal(result.kind, 'exit')
    assert.equal(result.code, 0)
  })

  it('vault existe + select tools → kind exit', async () => {
    vaultExistsMock = true
    detectVaultModeMock = 'Freestyled'
    nextSelect = 'tools'
    const result = await runExistingVaultFlow('pt')
    assert.equal(result.kind, 'exit')
  })

  it('vault Freestyled + select migrate → isMigrate true com prefill', async () => {
    vaultExistsMock = true
    detectVaultModeMock = 'Freestyled'
    detectVaultLangMock = 'pt'
    nextSelect = 'migrate'
    const result = await runExistingVaultFlow('pt')
    assert.equal(result.kind, 'continue')
    assert.equal(result.isMigrate, true)
    assert.equal(result.isReinit, false)
    assert.deepEqual(result.prefill, { name: 'Antigo', description: 'Desc antiga' })
  })

  it('vault existe + select new → isReinit true', async () => {
    vaultExistsMock = true
    detectVaultModeMock = 'Projeto'
    nextSelect = 'new'
    const result = await runExistingVaultFlow('pt')
    assert.equal(result.kind, 'continue')
    assert.equal(result.isReinit, true)
    assert.equal(result.isMigrate, false)
  })

  it('en funciona para exit', async () => {
    vaultExistsMock = true
    detectVaultModeMock = 'Freestyled'
    nextSelect = 'exit'
    const result = await runExistingVaultFlow('en')
    assert.equal(result.kind, 'exit')
  })
})
```

- [ ] **Step 2: Rodar e verificar que passa**

```bash
node --test test/existing-vault-flow.test.js
```

Esperado: 6 testes passando.

- [ ] **Step 3: Rodar a suite completa**

```bash
npm test
```

Esperado: todos os testes existentes + novos passando, zero falhas.

- [ ] **Step 4: Commit final**

```bash
git add test/existing-vault-flow.test.js
git commit -m "test: add mock-inquirer tests for existing-vault-flow"
```
