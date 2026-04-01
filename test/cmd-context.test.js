import { describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { createVault, slugifyVaultName } from '../src/vault.js'

mock.module('@inquirer/prompts', {
  namedExports: {
    input: async () => 'auth, orders',
  },
})

const { buildContextResult } = await import('../src/cli/cmd-context.js')

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
      writeFileSync(join(ctxDir, 'payments.md'), '# payments\n')

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
