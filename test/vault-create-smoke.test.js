import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { createVault } from '../src/vault.js'

const baseVars = {
  NAME: 'Smoke',
  DESCRIPTION: 'Teste',
  STACK: 'Node.js',
  PRACTICES: [],
  PROJECT_TYPE: 'backend',
  DATE: '2026-01-01',
}

describe('createVault (smoke)', () => {
  it('cria vault Freestyled pt com Projeto.md', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cortex-smoke-'))
    const prev = process.cwd()
    try {
      process.chdir(dir)
      createVault({
        ...baseVars,
        MODE: 'Freestyled',
        LANG: 'pt',
      })
      const livre = join(dir, 'cortex', 'Projeto.md')
      assert.ok(existsSync(livre))
      assert.match(readFileSync(livre, 'utf8'), /Smoke/)
    } finally {
      process.chdir(prev)
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('cria vault Projeto en com Project Memory.md', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cortex-smoke-'))
    const prev = process.cwd()
    try {
      process.chdir(dir)
      createVault({
        ...baseVars,
        MODE: 'Projeto',
        LANG: 'en',
      })
      assert.ok(existsSync(join(dir, 'cortex', 'Project Memory.md')))
      assert.ok(existsSync(join(dir, 'cortex', 'Domain', 'Entities.md')))
    } finally {
      process.chdir(prev)
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
