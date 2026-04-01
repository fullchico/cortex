import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { createVault, slugifyVaultName } from '../src/vault.js'

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
      const livre = join(dir, slugifyVaultName(baseVars.NAME), 'Projeto.md')
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
      const vaultName = slugifyVaultName(baseVars.NAME)
      assert.ok(existsSync(join(dir, vaultName, 'Project Memory.md')))
      assert.ok(existsSync(join(dir, vaultName, 'Domain', 'Entities.md')))
    } finally {
      process.chdir(prev)
      rmSync(dir, { recursive: true, force: true })
    }
  })

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

  it('cria marcador .cortex com nome do baseVars slugificado', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cortex-smoke-'))
    const prev = process.cwd()
    try {
      process.chdir(dir)
      createVault({ ...baseVars, MODE: 'Freestyled', LANG: 'pt' })
      const marker = JSON.parse(readFileSync(join(dir, '.cortex'), 'utf8'))
      assert.equal(marker.vault, slugifyVaultName(baseVars.NAME))
      assert.ok(existsSync(join(dir, slugifyVaultName(baseVars.NAME), 'Projeto.md')))
    } finally {
      process.chdir(prev)
      rmSync(dir, { recursive: true, force: true })
    }
  })
})

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
