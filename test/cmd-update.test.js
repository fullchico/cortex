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
