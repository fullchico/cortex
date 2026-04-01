# CLI Subcommands Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `status`, `context`, and `update` subcommands to the `cortex-ai` CLI, a global error boundary, `--help`/`--version` flags, and 2 new `archiveVault` tests.

**Architecture:** `bin/cortex.js` gets a router that checks `process.argv[2]` before any prompt — unknown arg dispatches to `src/cli/cmd-*.js`, no arg falls through to the existing init flow. Each subcommand is a self-contained module that imports existing functions from `src/detect.js`, `src/vault.js`, and `src/install.js`. A new `readSpec` export in `src/vault.js` parses `.spec.md` to recover `vars` for `cmd-update`.

**Tech Stack:** Node.js 22 ESM, `node:test`, `@inquirer/prompts` (input only, in cmd-context), existing `src/detect.js` + `src/vault.js` + `src/install.js` utilities.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `test/vault-create-smoke.test.js` | Modify | +2 archiveVault tests |
| `src/vault.js` | Modify | +`readSpec` export |
| `bin/cortex.js` | Modify | Router + error boundary + --help + --version |
| `src/cli/cmd-status.js` | Create | `status` subcommand |
| `src/cli/cmd-context.js` | Create | `context <name>` subcommand |
| `src/cli/cmd-update.js` | Create | `update` subcommand |

---

## Task 1: archiveVault tests

**Files:**
- Modify: `test/vault-create-smoke.test.js`

- [ ] **Step 1.1: Write the two failing tests**

Open `test/vault-create-smoke.test.js` and append after the last existing `it(...)` block (before the final closing `}` of `describe`):

```js
import { archiveVault } from '../src/vault.js'
```

Add this import at the top alongside the existing `createVault, slugifyVaultName` import:

```js
import { createVault, slugifyVaultName, archiveVault } from '../src/vault.js'
```

Then append two new `it()` blocks at the end of the `describe('createVault (smoke)', ...)` block:

```js
  it('archiveVault move arquivos para Anterior/<date>/', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cortex-archive-'))
    const prev = process.cwd()
    try {
      process.chdir(dir)
      createVault({ ...baseVars, MODE: 'Freestyled', LANG: 'pt' })
      const vaultName = slugifyVaultName(baseVars.NAME)
      const vaultPath = join(dir, vaultName)

      archiveVault('2026-01-01')

      // Arquivos movidos para Anterior/2026-01-01/
      const archiveDir = join(vaultPath, 'Anterior', '2026-01-01')
      assert.ok(existsSync(archiveDir), 'diretório de archive deve existir')
      assert.ok(existsSync(join(archiveDir, 'Projeto.md')), 'Projeto.md deve estar no archive')

      // Raiz do vault vazia (exceto Anterior/ e arquivos dot)
      const remaining = readdirSync(vaultPath).filter(f => !f.startsWith('.') && f !== 'Anterior')
      assert.equal(remaining.length, 0, 'raiz do vault deve estar vazia apos archive')
    } finally {
      process.chdir(prev)
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('archiveVault colisao de data cria pasta com timestamp', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cortex-archive-collision-'))
    const prev = process.cwd()
    try {
      process.chdir(dir)
      createVault({ ...baseVars, MODE: 'Freestyled', LANG: 'pt' })
      const vaultName = slugifyVaultName(baseVars.NAME)
      const vaultPath = join(dir, vaultName)

      // Primeiro archive
      archiveVault('2026-01-01')

      // Recriar conteúdo para segundo archive
      createVault({ ...baseVars, MODE: 'Freestyled', LANG: 'pt' })

      // Segundo archive com mesma data → deve criar pasta com timestamp
      archiveVault('2026-01-01')

      const anteriorDir = join(vaultPath, 'Anterior')
      const entries = readdirSync(anteriorDir)
      assert.equal(entries.length, 2, 'deve haver 2 entradas em Anterior/')
      // Uma é '2026-01-01', a outra começa com '2026-01-01-'
      assert.ok(entries.includes('2026-01-01'), 'primeira entrada deve ser 2026-01-01')
      assert.ok(entries.some(e => e.startsWith('2026-01-01-')), 'segunda entrada deve ter sufixo timestamp')
    } finally {
      process.chdir(prev)
      rmSync(dir, { recursive: true, force: true })
    }
  })
```

Also add `readdirSync` to the existing `import` at the top of the test file:

```js
import { mkdtempSync, rmSync, existsSync, readFileSync, readdirSync } from 'fs'
```

- [ ] **Step 1.2: Run tests to verify they fail**

```bash
cd /Users/diogobarbosa/Desktop/EUREKA/PROJETOS/cortex
node --test test/vault-create-smoke.test.js 2>&1 | tail -20
```

Expected: 2 new tests FAIL (archiveVault not imported yet / test not found yet — actually they might pass since archiveVault already exists). If they pass immediately, skip to step 1.4.

- [ ] **Step 1.3: Run full test suite to confirm nothing broke**

```bash
node --test 2>&1 | tail -10
```

Expected: 87 pass, 0 fail (85 existing + 2 new).

- [ ] **Step 1.4: Commit**

```bash
git add test/vault-create-smoke.test.js
git commit -m "test: add archiveVault smoke tests (basic + collision)"
```

---

## Task 2: `readSpec` export in `src/vault.js`

**Files:**
- Modify: `src/vault.js` (after `readFreestyledRoot` function, around line 660)

The `.spec.md` template stores config in a fenced code block:
```
## Configuração

\`\`\`
name: My App
description: Desc
stack: Node.js
date: 2026-01-01
mode: Freestyled
lang: pt
\`\`\`
```

`readSpec` must extract that block and return `{ NAME, DESCRIPTION, STACK, DATE, MODE, LANG }`.

- [ ] **Step 2.1: Write the failing test**

Create `test/read-spec.test.js`:

```js
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { createVault, readSpec, slugifyVaultName } from '../src/vault.js'

describe('readSpec', () => {
  it('retorna vars do .spec.md gerado por createVault', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cortex-readspec-'))
    const prev = process.cwd()
    try {
      process.chdir(dir)
      createVault({
        NAME: 'My App',
        DESCRIPTION: 'Test description',
        STACK: 'Node.js',
        PRACTICES: [],
        PROJECT_TYPE: 'backend',
        DATE: '2026-01-01',
        MODE: 'Freestyled',
        LANG: 'pt',
      })
      const vaultName = slugifyVaultName('My App')
      const vaultPath = join(dir, vaultName)
      const vars = readSpec(vaultPath)
      assert.equal(vars.NAME, 'My App')
      assert.equal(vars.DESCRIPTION, 'Test description')
      assert.equal(vars.STACK, 'Node.js')
      assert.equal(vars.DATE, '2026-01-01')
      assert.equal(vars.MODE, 'Freestyled')
      assert.equal(vars.LANG, 'pt')
    } finally {
      process.chdir(prev)
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('retorna objeto vazio se .spec.md nao existe', () => {
    const vars = readSpec('/tmp/nao-existe-cortex-vault')
    assert.deepEqual(vars, {})
  })
})
```

- [ ] **Step 2.2: Run test to verify it fails**

```bash
node --test test/read-spec.test.js 2>&1 | tail -10
```

Expected: FAIL — `readSpec is not a function` (not exported yet).

- [ ] **Step 2.3: Add `readSpec` to `src/vault.js`**

Add this function after `readFreestyledRoot` (around line 661, before `// --- Main ---`):

```js
/**
 * Lê o arquivo .spec.md do vault e retorna o objeto vars.
 * Retorna {} se o arquivo não existe ou não tem bloco de configuração.
 * @param {string} vaultPath
 * @returns {{ NAME?: string, DESCRIPTION?: string, STACK?: string, DATE?: string, MODE?: string, LANG?: string }}
 */
export function readSpec(vaultPath) {
  const specPath = join(vaultPath, '.spec.md')
  if (!existsSync(specPath)) return {}
  const content = readFileSync(specPath, 'utf8')
  const match = content.match(/```\n([\s\S]*?)```/)
  if (!match) return {}
  const vars = {}
  for (const line of match[1].split('\n')) {
    const sep = line.indexOf(':')
    if (sep === -1) continue
    const key = line.slice(0, sep).trim().toUpperCase()
    const value = line.slice(sep + 1).trim()
    if (key && value) vars[key] = value
  }
  return vars
}
```

- [ ] **Step 2.4: Run test to verify it passes**

```bash
node --test test/read-spec.test.js 2>&1 | tail -10
```

Expected: 2 pass, 0 fail.

- [ ] **Step 2.5: Run full suite**

```bash
node --test 2>&1 | tail -10
```

Expected: 89 pass, 0 fail.

- [ ] **Step 2.6: Commit**

```bash
git add src/vault.js test/read-spec.test.js
git commit -m "feat: add readSpec to parse .spec.md vars"
```

---

## Task 3: Router + error boundary + `--help` + `--version` in `bin/cortex.js`

**Files:**
- Modify: `bin/cortex.js`

The current `bin/cortex.js` runs top-level `await` statements immediately. The router must intercept `process.argv[2]` before `promptLanguage()`. The error boundary wraps everything.

- [ ] **Step 3.1: Rewrite `bin/cortex.js`**

Replace the full content of `bin/cortex.js` with:

```js
#!/usr/bin/env node

import { createRequire } from 'module'
import { confirm } from '@inquirer/prompts'
import { vaultExists, detectAiTools } from '../src/detect.js'
import { printBanner } from '../src/cli/banner.js'
import { promptLanguage } from '../src/cli/prompt-language.js'
import { runExistingVaultFlow } from '../src/cli/existing-vault.js'
import { promptAiTools } from '../src/cli/ai-tools.js'
import { promptProjectBasics } from '../src/cli/project-basics.js'
import { promptProjectType, promptStack } from '../src/cli/project-stack.js'
import {
  promptMode,
  promptFreestyledPractices,
  promptHasSpecImport,
} from '../src/cli/mode-and-practices.js'
import { runVaultInstall, printCompletionSummary } from '../src/cli/install-phase.js'
import { slugifyVaultName } from '../src/vault.js'
import { t } from '../src/cli/i18n.js'

const require = createRequire(import.meta.url)

try {
  const cmd = process.argv[2]

  // --version
  if (cmd === '--version' || cmd === '-v') {
    const { version } = require('../package.json')
    console.log(version)
    process.exit(0)
  }

  // --help
  if (cmd === '--help' || cmd === '-h') {
    console.log(`
  cortex-ai — AI memory framework

  Usage:
    npx @fullchico/cortex-ai           Initialize vault (interactive)
    npx @fullchico/cortex-ai status    Current vault state
    npx @fullchico/cortex-ai context   Create context: context <name>
    npx @fullchico/cortex-ai update    Update AI tools and vault
    npx @fullchico/cortex-ai --help    This message
    npx @fullchico/cortex-ai --version Installed version
`)
    process.exit(0)
  }

  // Subcommands
  if (cmd === 'status') {
    const { runStatus } = await import('../src/cli/cmd-status.js')
    await runStatus()
    process.exit(0)
  }

  if (cmd === 'context') {
    const { runContext } = await import('../src/cli/cmd-context.js')
    await runContext(process.argv[3])
    process.exit(0)
  }

  if (cmd === 'update') {
    const { runUpdate } = await import('../src/cli/cmd-update.js')
    await runUpdate()
    process.exit(0)
  }

  // Unknown subcommand
  if (cmd && !cmd.startsWith('-')) {
    console.error(`\n  ✗ Unknown command: ${cmd}`)
    console.error('  Run with --help for available commands\n')
    process.exit(1)
  }

  // Init flow (no args)
  const lang = await promptLanguage()
  printBanner(lang)

  const existing = await runExistingVaultFlow(lang)
  if (existing.kind === 'exit') {
    process.exit(existing.code ?? 0)
  }

  const { isMigrate, isReinit, prefill } = existing

  if (!isReinit && !isMigrate && !vaultExists()) {
    const ok = await confirm({
      message: t(lang, 'init.confirmVault', { path: process.cwd() }),
      default: true,
    })
    if (!ok) {
      console.log()
      console.log(t(lang, 'init.cancelled'))
      console.log(t(lang, 'init.runFromProjectDir'))
      console.log()
      process.exit(0)
    }
    console.log()
  }

  const detected = detectAiTools()
  const aiTools = await promptAiTools(lang, detected, 'init')

  if (aiTools.length === 0) {
    console.log()
    console.log(t(lang, 'init.noToolsSelected'))
    console.log(t(lang, 'init.noToolsHint'))
  }

  console.log()

  const { name, description } = await promptProjectBasics(prefill, lang)
  const projectType = await promptProjectType(lang)
  const stack = await promptStack(lang, projectType)

  console.log()

  const mode = await promptMode(lang, isMigrate)

  let practices = []
  if (mode === 'Freestyled') {
    practices = await promptFreestyledPractices(lang, projectType)
  }

  let hasSpec = false
  if (mode === 'Projeto') {
    hasSpec = await promptHasSpecImport(lang)
  }

  const vars = {
    NAME: name,
    DESCRIPTION: description,
    STACK: stack.trim(),
    MODE: mode,
    LANG: lang,
    PRACTICES: practices,
    PROJECT_TYPE: projectType,
    DATE: new Date().toISOString().split('T')[0],
  }

  runVaultInstall({ vars, aiTools, isMigrate, isReinit, lang })

  printCompletionSummary({
    isMigrate,
    isReinit,
    hasSpec,
    aiTools,
    lang,
    archiveDate: vars.DATE,
    vaultName: slugifyVaultName(vars.NAME),
  })
} catch (err) {
  console.error('\n  ✗ Unexpected error:', err.message)
  console.error('  Report at: https://github.com/fullchico/cortex/issues\n')
  process.exit(1)
}
```

- [ ] **Step 3.2: Smoke test the router manually**

```bash
cd /Users/diogobarbosa/Desktop/EUREKA/PROJETOS/cortex
node bin/cortex.js --version
node bin/cortex.js --help
node bin/cortex.js unknowncmd 2>&1
```

Expected:
- `--version` → prints package version (e.g. `1.1.0`)
- `--help` → prints usage table
- `unknowncmd` → `✗ Unknown command: unknowncmd` + exit 1

- [ ] **Step 3.3: Run full test suite (init flow tests still pass)**

```bash
node --test 2>&1 | tail -10
```

Expected: 89 pass, 0 fail (tests don't hit bin/cortex.js directly).

- [ ] **Step 3.4: Commit**

```bash
git add bin/cortex.js
git commit -m "feat: add subcommand router, error boundary, --help, --version to bin/cortex.js"
```

---

## Task 4: `src/cli/cmd-status.js`

**Files:**
- Create: `src/cli/cmd-status.js`

Uses: `readVaultName`, `vaultExists`, `detectVaultMode`, `detectVaultLang`, `detectAiTools` from `src/detect.js`.

Reads:
- `<vault>/Projeto.md` or `<vault>/Project.md` → `## Boas Praticas` / `## Best Practices` section
- `<vault>/Sessoes/contextos/` or `<vault>/Sessions/contexts/` → list `.md` files
- `<vault>/Sessoes/timeline/` or `<vault>/Sessions/timeline/` → most recent file (by filename sort, `YYYY-MM-DD.md`)
- Most recent timeline file → extract `- [ ]` lines as pending items

- [ ] **Step 4.1: Write the failing test**

Create `test/cmd-status.test.js`:

```js
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { createVault, slugifyVaultName } from '../src/vault.js'
import { buildStatus } from '../src/cli/cmd-status.js'

describe('cmd-status buildStatus', () => {
  it('retorna exit 1 se vault nao existe', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cortex-status-'))
    const prev = process.cwd()
    try {
      process.chdir(dir)
      const result = buildStatus()
      assert.equal(result.exitCode, 1)
      assert.match(result.lines.join('\n'), /vault/)
    } finally {
      process.chdir(prev)
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('retorna snapshot do vault Freestyled', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cortex-status-'))
    const prev = process.cwd()
    try {
      process.chdir(dir)
      createVault({
        NAME: 'My App',
        DESCRIPTION: 'Desc',
        STACK: 'Node.js',
        PRACTICES: [],
        PROJECT_TYPE: 'backend',
        DATE: '2026-01-01',
        MODE: 'Freestyled',
        LANG: 'pt',
      })
      const vaultName = slugifyVaultName('My App')
      const vaultPath = join(dir, vaultName)

      // Criar contexto e timeline para testar leitura
      mkdirSync(join(vaultPath, 'Sessoes', 'contextos'), { recursive: true })
      writeFileSync(join(vaultPath, 'Sessoes', 'contextos', 'auth.md'), '# auth\ndepends: []\n')
      mkdirSync(join(vaultPath, 'Sessoes', 'timeline'), { recursive: true })
      writeFileSync(join(vaultPath, 'Sessoes', 'timeline', '2026-01-01.md'),
        '# 2026-01-01\n\n## Proximos passos\n- [ ] Verificar testes\n- [x] Done item\n')

      const result = buildStatus()
      assert.equal(result.exitCode, 0)
      const output = result.lines.join('\n')
      assert.match(output, /my-app/)
      assert.match(output, /Freestyled/)
      assert.match(output, /auth/)
      assert.match(output, /2026-01-01/)
      assert.match(output, /Verificar testes/)
      assert.doesNotMatch(output, /Done item/)
    } finally {
      process.chdir(prev)
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('saude do vault detecta CLAUDE.md ausente', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cortex-status-health-'))
    const prev = process.cwd()
    try {
      process.chdir(dir)
      createVault({
        NAME: 'My App', DESCRIPTION: 'D', STACK: 'N', PRACTICES: [],
        PROJECT_TYPE: 'backend', DATE: '2026-01-01', MODE: 'Freestyled', LANG: 'pt',
      })
      const result = buildStatus()
      const output = result.lines.join('\n')
      assert.match(output, /CLAUDE\.md/)
    } finally {
      process.chdir(prev)
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
```

- [ ] **Step 4.2: Run test to verify it fails**

```bash
node --test test/cmd-status.test.js 2>&1 | tail -15
```

Expected: FAIL — `Cannot find module '../src/cli/cmd-status.js'`.

- [ ] **Step 4.3: Create `src/cli/cmd-status.js`**

```js
import { existsSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { readVaultName, vaultExists, detectVaultMode, detectVaultLang, detectAiTools } from '../detect.js'

/**
 * Builds the status output without side effects (testable).
 * @returns {{ exitCode: number, lines: string[] }}
 */
export function buildStatus() {
  if (!vaultExists()) {
    return {
      exitCode: 1,
      lines: ['', '  ✗ No vault found. Run: npx @fullchico/cortex-ai', ''],
    }
  }

  const vaultName = readVaultName()
  const mode = detectVaultMode() ?? 'Freestyled'
  const lang = detectVaultLang()
  const vaultPath = join(process.cwd(), vaultName)
  const isEN = lang === 'en'

  const lines = []
  lines.push('')
  lines.push(`  # Cortex Status — ${vaultName}`)
  lines.push('')
  lines.push(`  Vault: ${vaultName}/  ·  Mode: ${mode}  ·  Lang: ${lang.toUpperCase()}`)

  // AI tools
  const tools = detectAiTools()
  const claudeOn  = tools.includes('Claude Code') ? '✓' : '✗'
  const cursorOn  = tools.includes('Cursor') ? '✓' : '✗'
  const copilotOn = tools.includes('Copilot') ? '✓' : '✗'
  lines.push(`  AI tools:  Claude Code ${claudeOn}  ·  Cursor ${cursorOn}  ·  Copilot ${copilotOn}`)
  lines.push('')

  // Contexts
  const ctxDir = join(vaultPath, isEN ? 'Sessions/contexts' : 'Sessoes/contextos')
  if (existsSync(ctxDir)) {
    const ctxFiles = readdirSync(ctxDir).filter(f => f.endsWith('.md'))
    if (ctxFiles.length > 0) {
      lines.push('  Contexts:')
      for (const file of ctxFiles) {
        const content = readFileSync(join(ctxDir, file), 'utf8')
        const dependsLine = content.split('\n').find(l => l.startsWith('depends:'))
        const depends = dependsLine ? dependsLine.replace('depends:', '').trim() : ''
        const name = file.replace('.md', '')
        lines.push(depends && depends !== '[]'
          ? `  - ${name} (depends: ${depends.replace(/[\[\]]/g, '')})`
          : `  - ${name}`)
      }
      lines.push('')
    }
  }

  // Last session
  const tlDir = join(vaultPath, isEN ? 'Sessions/timeline' : 'Sessoes/timeline')
  if (existsSync(tlDir)) {
    const tlFiles = readdirSync(tlDir).filter(f => f.endsWith('.md')).sort()
    if (tlFiles.length > 0) {
      const lastFile = tlFiles[tlFiles.length - 1]
      const lastDate = lastFile.replace('.md', '')
      lines.push(`  Last session: ${lastDate}`)

      // Pending items from last timeline
      const tlContent = readFileSync(join(tlDir, lastFile), 'utf8')
      const pending = tlContent.split('\n').filter(l => l.trim().startsWith('- [ ]'))
      if (pending.length > 0) {
        lines.push('  Pending:')
        for (const p of pending) lines.push(`  ${p.trim()}`)
      }
      lines.push('')
    }
  }

  // Best practices (from Projeto.md / Project.md)
  const rootFile = join(vaultPath, isEN ? 'Project.md' : 'Projeto.md')
  if (existsSync(rootFile)) {
    const content = readFileSync(rootFile, 'utf8')
    const sectionMatch = content.match(/## (?:Boas Praticas|Best Practices)\n([\s\S]*?)(?=\n##|$)/)
    if (sectionMatch) {
      const practices = sectionMatch[1].split('\n')
        .map(l => l.replace(/^[-*·]\s*/, '').trim())
        .filter(Boolean)
      if (practices.length > 0) {
        lines.push(`  Best practices: ${practices.join(' · ')}`)
        lines.push('')
      }
    }
  }

  // Vault health
  lines.push('  Health:')
  const markerOk = existsSync(join(process.cwd(), '.cortex'))
  lines.push(`  ${markerOk ? '✓' : '✗'} .cortex marker`)
  const projetoFile = isEN ? 'Project.md' : 'Projeto.md'
  const memFile = isEN ? 'Project Memory.md' : 'Memoria Projeto.md'
  const rootOk = existsSync(join(vaultPath, projetoFile)) || existsSync(join(vaultPath, memFile))
  lines.push(`  ${rootOk ? '✓' : '✗'} ${vaultName}/${rootOk ? projetoFile : memFile}`)
  const sessOk = existsSync(join(vaultPath, isEN ? 'Sessions/timeline' : 'Sessoes/timeline'))
  lines.push(`  ${sessOk ? '✓' : '✗'} ${vaultName}/${isEN ? 'Sessions/timeline/' : 'Sessoes/timeline/'}`)
  const claudeMd = existsSync(join(process.cwd(), 'CLAUDE.md'))
  lines.push(`  ${claudeMd ? '✓' : '✗'} CLAUDE.md`)
  lines.push('')

  return { exitCode: 0, lines }
}

export async function runStatus() {
  const { exitCode, lines } = buildStatus()
  for (const line of lines) console.log(line)
  process.exit(exitCode)
}
```

- [ ] **Step 4.4: Run test to verify it passes**

```bash
node --test test/cmd-status.test.js 2>&1 | tail -10
```

Expected: 3 pass, 0 fail.

- [ ] **Step 4.5: Smoke test manually**

```bash
cd /Users/diogobarbosa/Desktop/EUREKA/PROJETOS/cortex
node bin/cortex.js status
```

Expected: status output for this project's own vault (if vault exists) or `✗ No vault found` (if not).

- [ ] **Step 4.6: Run full suite**

```bash
node --test 2>&1 | tail -10
```

Expected: 92 pass, 0 fail.

- [ ] **Step 4.7: Commit**

```bash
git add src/cli/cmd-status.js test/cmd-status.test.js
git commit -m "feat: add cortex-ai status subcommand"
```

---

## Task 5: `src/cli/cmd-context.js`

**Files:**
- Create: `src/cli/cmd-context.js`

Behavior:
- No name arg → error
- Vault doesn't exist → error  
- Context already exists → warn, show hint, exit 0
- Context doesn't exist → prompt for `depends:`, create file, exit 0

- [ ] **Step 5.1: Write the failing test**

Create `test/cmd-context.test.js`:

```js
import { describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, existsSync, readFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { createVault, slugifyVaultName } from '../src/vault.js'

mock.module('@inquirer/prompts', {
  namedExports: {
    input: async () => 'auth, orders',
  },
})

const { buildContextResult, createContextFile } = await import('../src/cli/cmd-context.js')

describe('cmd-context', () => {
  it('erro se nome nao fornecido', async () => {
    const result = await buildContextResult(undefined, process.cwd())
    assert.equal(result.exitCode, 1)
    assert.match(result.message, /name/)
  })

  it('erro se vault nao existe', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'cortex-ctx-'))
    const prev = process.cwd()
    try {
      process.chdir(dir)
      const result = await buildContextResult('payments', dir)
      assert.equal(result.exitCode, 1)
      assert.match(result.message, /vault/)
    } finally {
      process.chdir(prev)
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('avisa se contexto ja existe', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'cortex-ctx-'))
    const prev = process.cwd()
    try {
      process.chdir(dir)
      createVault({
        NAME: 'My App', DESCRIPTION: 'D', STACK: 'N', PRACTICES: [],
        PROJECT_TYPE: 'backend', DATE: '2026-01-01', MODE: 'Freestyled', LANG: 'pt',
      })
      const vaultName = slugifyVaultName('My App')
      const ctxDir = join(dir, vaultName, 'Sessoes', 'contextos')
      mkdirSync(ctxDir, { recursive: true })
      const ctxFile = join(ctxDir, 'payments.md')
      writeFileSync(ctxFile, '# payments\n')

      const result = await buildContextResult('payments', dir)
      assert.equal(result.exitCode, 0)
      assert.match(result.message, /already exists|ja existe/)
    } finally {
      process.chdir(prev)
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('cria arquivo de contexto com depends preenchido', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'cortex-ctx-create-'))
    const prev = process.cwd()
    try {
      process.chdir(dir)
      createVault({
        NAME: 'My App', DESCRIPTION: 'D', STACK: 'N', PRACTICES: [],
        PROJECT_TYPE: 'backend', DATE: '2026-01-01', MODE: 'Freestyled', LANG: 'pt',
      })
      const vaultName = slugifyVaultName('My App')
      const ctxFile = join(dir, vaultName, 'Sessoes', 'contextos', 'payments.md')

      const result = await buildContextResult('payments', dir)
      assert.equal(result.exitCode, 0)
      assert.ok(existsSync(ctxFile))
      const content = readFileSync(ctxFile, 'utf8')
      assert.match(content, /payments/)
      assert.match(content, /auth, orders/)
    } finally {
      process.chdir(prev)
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
```

Also add `writeFileSync` to the import at the top of the test file:
```js
import { mkdtempSync, rmSync, existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs'
```

- [ ] **Step 5.2: Run test to verify it fails**

```bash
node --test test/cmd-context.test.js 2>&1 | tail -15
```

Expected: FAIL — `Cannot find module '../src/cli/cmd-context.js'`.

- [ ] **Step 5.3: Create `src/cli/cmd-context.js`**

```js
import { existsSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { input } from '@inquirer/prompts'
import { readVaultName, vaultExists, detectVaultLang } from '../detect.js'

function contextTemplate(name, depends) {
  const depList = depends
    ? depends.split(',').map(d => d.trim()).filter(Boolean)
    : []
  return `# ${name}

depends: [${depList.join(', ')}]
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
`
}

/**
 * Core logic — separated from side effects for testability.
 * @param {string|undefined} name
 * @param {string} cwd
 * @returns {Promise<{ exitCode: number, message: string, filePath?: string }>}
 */
export async function buildContextResult(name, cwd) {
  if (!name) {
    return { exitCode: 1, message: '  ✗ Context name required: cortex-ai context <name>' }
  }

  if (!vaultExists({ cwd })) {
    return { exitCode: 1, message: '  ✗ No vault found. Run: npx @fullchico/cortex-ai' }
  }

  const vaultName = readVaultName({ cwd })
  const lang = detectVaultLang({ cwd })
  const isEN = lang === 'en'
  const ctxDir = join(cwd, vaultName, isEN ? 'Sessions/contexts' : 'Sessoes/contextos')
  const ctxFile = join(ctxDir, `${name}.md`)

  if (existsSync(ctxFile)) {
    const rel = `${vaultName}/${isEN ? 'Sessions/contexts' : 'Sessoes/contextos'}/${name}.md`
    return {
      exitCode: 0,
      message: [
        `  ✓ Context "${name}" already exists in ${rel}`,
        `  → Say "cortex start ${name}" to load it.`,
      ].join('\n'),
      filePath: ctxFile,
    }
  }

  const depends = await input({
    message: `  ? Depends on any context? (e.g. users, orders) `,
    default: '',
  })

  mkdirSync(ctxDir, { recursive: true })
  writeFileSync(ctxFile, contextTemplate(name, depends))

  const rel = `${vaultName}/${isEN ? 'Sessions/contexts' : 'Sessoes/contextos'}/${name}.md`
  return {
    exitCode: 0,
    message: [
      `  ✓ Context "${name}" created in ${rel}`,
      `  → Say "cortex start ${name}" to load it.`,
    ].join('\n'),
    filePath: ctxFile,
  }
}

export async function runContext(name) {
  const result = await buildContextResult(name, process.cwd())
  console.log()
  console.log(result.message)
  console.log()
  process.exit(result.exitCode)
}
```

- [ ] **Step 5.4: Run test to verify it passes**

```bash
node --test test/cmd-context.test.js 2>&1 | tail -10
```

Expected: 4 pass, 0 fail.

- [ ] **Step 5.5: Smoke test manually**

```bash
node bin/cortex.js context 2>&1
```

Expected: `✗ Context name required: cortex-ai context <name>`

- [ ] **Step 5.6: Run full suite**

```bash
node --test 2>&1 | tail -10
```

Expected: 96 pass, 0 fail.

- [ ] **Step 5.7: Commit**

```bash
git add src/cli/cmd-context.js test/cmd-context.test.js
git commit -m "feat: add cortex-ai context subcommand"
```

---

## Task 6: `src/cli/cmd-update.js`

**Files:**
- Create: `src/cli/cmd-update.js`

Uses:
- `src/detect.js`: `readVaultName`, `vaultExists`, `detectVaultLang`, `detectVaultMode`
- `src/install.js`: `installClaudeCode`, `installCursor`, `installCopilot` (existing logic already handles has-protocol detection)
- `src/vault.js`: `readSpec`, `writeProjetoNotes` (via internal — but `writeProjetoNotes` is not exported)

> **Note:** `writeProjetoNotes` is not exported from `src/vault.js`. For the update flow, we need it exported. Add `export` to that function in this task.

AI tools update strategy:
- CLAUDE.md: replace `<!-- cortex:start -->…<!-- cortex:end -->` block with current template
- Cursor `.mdc` files: overwrite (no user content inside)
- Copilot: replace cortex block

Since `installClaudeCode`, `installCursor`, `installCopilot` in `src/install.js` already handle the "already has protocol" case by skipping, we need a separate `updateClaudeCode`, `updateCursor`, `updateCopilot` approach that forcefully replaces the cortex block.

Simpler approach matching the spec: add `updateAiTools(lang)` to `src/install.js` that replaces the cortex block for CLAUDE.md and copilot, and overwrites cursor `.mdc` files.

- [ ] **Step 6.1: Export `writeProjetoNotes` from `src/vault.js`**

In `src/vault.js`, find `function writeProjetoNotes(vaultPath, vars, safe = false)` and add `export`:

```js
export function writeProjetoNotes(vaultPath, vars, safe = false) {
```

- [ ] **Step 6.2: Add update functions to `src/install.js`**

Append to the end of `src/install.js`:

```js
/**
 * Substitui o bloco cortex em CLAUDE.md com o template atual.
 * Preserva conteúdo fora do bloco.
 */
export function updateClaudeCode(lang = 'pt') {
  const dest = join(process.cwd(), 'CLAUDE.md')
  if (!existsSync(dest)) {
    console.log(`  - CLAUDE.md not found, skipping`)
    return
  }
  const existing = readFileSync(dest, 'utf8')
  if (!hasCortex(existing)) {
    console.log(`  - CLAUDE.md has no cortex block, skipping`)
    return
  }
  const fresh = readTemplate('CLAUDE.md', lang)
  const updated = existing.replace(
    new RegExp(`${MARKER_START}[\\s\\S]*?${MARKER_END}`),
    wrap(fresh),
  )
  writeFileSync(dest, updated)
  console.log(`  ✓ CLAUDE.md — cortex block updated`)
}

/**
 * Sobrescreve os 3 arquivos .mdc do Cursor com os templates atuais.
 * Os .mdc não têm conteúdo personalizado do usuário.
 */
export function updateCursor(lang = 'pt') {
  const rulesDir = join(process.cwd(), '.cursor', 'rules')
  if (!existsSync(rulesDir)) {
    console.log(`  - Cursor not configured, skipping`)
    return
  }
  const rules = ['cortex-protocol.mdc', 'cortex-start.mdc', 'cortex-end.mdc']
  for (const rule of rules) {
    writeFileSync(join(rulesDir, rule), readTemplate(`cursor/${rule}`, lang))
    console.log(`  ✓ .cursor/rules/${rule} — updated`)
  }
}

/**
 * Substitui o bloco cortex em copilot-instructions.md com o template atual.
 */
export function updateCopilot(lang = 'pt') {
  const dest = join(process.cwd(), '.github', 'copilot-instructions.md')
  if (!existsSync(dest)) {
    console.log(`  - Copilot not configured, skipping`)
    return
  }
  const existing = readFileSync(dest, 'utf8')
  if (!hasCortex(existing)) {
    console.log(`  - copilot-instructions.md has no cortex block, skipping`)
    return
  }
  const fresh = readTemplate('copilot/copilot-instructions.md', lang)
  const updated = existing.replace(
    new RegExp(`${MARKER_START}[\\s\\S]*?${MARKER_END}`),
    wrap(fresh),
  )
  writeFileSync(dest, updated)
  console.log(`  ✓ .github/copilot-instructions.md — cortex block updated`)
}
```

- [ ] **Step 6.3: Write the failing test**

Create `test/cmd-update.test.js`:

```js
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { createVault, slugifyVaultName } from '../src/vault.js'
import { buildUpdateResult } from '../src/cli/cmd-update.js'

describe('cmd-update buildUpdateResult', () => {
  it('erro se vault nao existe', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'cortex-update-'))
    const prev = process.cwd()
    try {
      process.chdir(dir)
      const result = await buildUpdateResult(dir)
      assert.equal(result.exitCode, 1)
      assert.match(result.lines.join('\n'), /vault/)
    } finally {
      process.chdir(prev)
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('atualiza CLAUDE.md substituindo bloco cortex', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'cortex-update-claude-'))
    const prev = process.cwd()
    try {
      process.chdir(dir)
      createVault({
        NAME: 'My App', DESCRIPTION: 'D', STACK: 'N', PRACTICES: [],
        PROJECT_TYPE: 'backend', DATE: '2026-01-01', MODE: 'Freestyled', LANG: 'pt',
      })

      // Criar CLAUDE.md com bloco cortex antigo
      const claudePath = join(dir, 'CLAUDE.md')
      writeFileSync(claudePath,
        'Custom content\n\n<!-- cortex:start -->\nold cortex block\n<!-- cortex:end -->\n')

      const result = await buildUpdateResult(dir)
      assert.equal(result.exitCode, 0)

      const content = readFileSync(claudePath, 'utf8')
      assert.match(content, /Custom content/)
      assert.doesNotMatch(content, /old cortex block/)
      assert.match(content, /<!-- cortex:start -->/)
    } finally {
      process.chdir(prev)
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('Freestyled nao toca notas do vault', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'cortex-update-free-'))
    const prev = process.cwd()
    try {
      process.chdir(dir)
      createVault({
        NAME: 'My App', DESCRIPTION: 'D', STACK: 'N', PRACTICES: [],
        PROJECT_TYPE: 'backend', DATE: '2026-01-01', MODE: 'Freestyled', LANG: 'pt',
      })
      const vaultName = slugifyVaultName('My App')
      const projetoPath = join(dir, vaultName, 'Projeto.md')
      const originalContent = readFileSync(projetoPath, 'utf8')

      await buildUpdateResult(dir)

      assert.equal(readFileSync(projetoPath, 'utf8'), originalContent)
    } finally {
      process.chdir(prev)
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
```

- [ ] **Step 6.4: Run test to verify it fails**

```bash
node --test test/cmd-update.test.js 2>&1 | tail -15
```

Expected: FAIL — `Cannot find module '../src/cli/cmd-update.js'`.

- [ ] **Step 6.5: Create `src/cli/cmd-update.js`**

```js
import { join } from 'path'
import { readVaultName, vaultExists, detectVaultLang, detectVaultMode } from '../detect.js'
import { readSpec, writeProjetoNotes, slugifyVaultName } from '../vault.js'
import { updateClaudeCode, updateCursor, updateCopilot } from '../install.js'
import { existsSync } from 'fs'

/**
 * Core update logic — separated from side effects for testability.
 * @param {string} cwd
 * @returns {Promise<{ exitCode: number, lines: string[] }>}
 */
export async function buildUpdateResult(cwd) {
  if (!vaultExists({ cwd })) {
    return {
      exitCode: 1,
      lines: ['', '  ✗ No vault found. Run: npx @fullchico/cortex-ai', ''],
    }
  }

  const lang = detectVaultLang({ cwd })
  const vaultName = readVaultName({ cwd })
  const vaultPath = join(cwd, vaultName)
  const mode = detectVaultMode({ cwd })

  const lines = ['', '  Updating...', '']

  // Temporarily override process.cwd for install functions that use it
  const prevCwd = process.cwd()
  process.chdir(cwd)

  try {
    lines.push('  AI tools:')
    updateClaudeCode(lang)
    updateCursor(lang)
    updateCopilot(lang)
    lines.push('')

    // Vault notes — only for Projeto mode
    lines.push(`  Vault (${vaultName}/):`)
    if (mode === 'Projeto') {
      const vars = readSpec(vaultPath)
      if (Object.keys(vars).length > 0) {
        writeProjetoNotes(vaultPath, {
          NAME: vars.NAME ?? vaultName,
          DESCRIPTION: vars.DESCRIPTION ?? '',
          STACK: vars.STACK ?? '',
          DATE: vars.DATE ?? new Date().toISOString().split('T')[0],
          MODE: vars.MODE ?? 'Projeto',
          LANG: vars.LANG ?? lang,
          PRACTICES: [],
          PROJECT_TYPE: 'fullstack',
        }, true)
        lines.push('  ✓ Existing notes preserved')
        lines.push('  + Missing notes added if any')
      } else {
        lines.push('  - .spec.md not found, skipping vault notes')
      }
    } else {
      lines.push('  - Freestyled: vault structure unchanged')
    }
    lines.push('')
  } finally {
    process.chdir(prevCwd)
  }

  return { exitCode: 0, lines }
}

export async function runUpdate() {
  const { exitCode, lines } = await buildUpdateResult(process.cwd())
  for (const line of lines) console.log(line)
  process.exit(exitCode)
}
```

- [ ] **Step 6.6: Run test to verify it passes**

```bash
node --test test/cmd-update.test.js 2>&1 | tail -10
```

Expected: 3 pass, 0 fail.

- [ ] **Step 6.7: Run full suite**

```bash
node --test 2>&1 | tail -10
```

Expected: 99+ pass, 0 fail.

- [ ] **Step 6.8: Commit**

```bash
git add src/cli/cmd-update.js src/install.js src/vault.js test/cmd-update.test.js
git commit -m "feat: add cortex-ai update subcommand"
```

---

## Acceptance Criteria Verification

After all tasks complete, verify:

```bash
# No-args init still works (just check it starts)
node bin/cortex.js --version     # prints version
node bin/cortex.js --help        # prints table
node bin/cortex.js badcmd 2>&1   # exit 1 + hint
node bin/cortex.js status 2>&1   # exit 1 (no vault in repo root) or shows vault
node bin/cortex.js context 2>&1  # exit 1 (no name)
node --test 2>&1 | tail -5       # all pass
```

---

## Self-Review

**Spec coverage:**
- [x] Router: `bin/cortex.js` checks `process.argv[2]` — Task 3
- [x] `status` → exit 1 if no vault — Task 4 test + implementation
- [x] `context <name>` creates file with depends — Task 5
- [x] `context <name>` warns without overwriting if exists — Task 5
- [x] `update` replaces cortex block without touching user content — Task 6
- [x] `--version` prints package.json version — Task 3
- [x] Error boundary → friendly message — Task 3
- [x] 2 archiveVault tests — Task 1
- [x] `readSpec` — Task 2 (needed by cmd-update)

**Spec requirement: `writeProjetoNotes` export** — Task 6.1 adds `export` to the function.

**Type consistency:** `buildStatus()` returns `{ exitCode, lines }`, `buildContextResult()` returns `{ exitCode, message, filePath? }`, `buildUpdateResult()` returns `{ exitCode, lines }` — consistent with how `runX()` wrappers consume them.

**No placeholders:** All steps contain complete code.
