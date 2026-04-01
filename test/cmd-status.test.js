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
