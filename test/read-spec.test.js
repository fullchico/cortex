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
