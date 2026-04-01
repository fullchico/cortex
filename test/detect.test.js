import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { tmpdir } from 'os'

const testFileDir = dirname(fileURLToPath(import.meta.url))
import {
  detectAiTools,
  vaultExists,
  detectVaultMode,
  detectVaultLang,
  readVaultName,
} from '../src/detect.js'

describe('detect (cwd/homedir injetáveis)', () => {
  let root
  let homedir

  beforeEach(() => {
    // Dentro do repo: alguns ambientes bloqueiam mkdir em /tmp para pastas como `.cursor`.
    root = mkdtempSync(join(testFileDir, 'tmp-detect-'))
    homedir = mkdtempSync(join(testFileDir, 'tmp-home-'))
  })

  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
    rmSync(homedir, { recursive: true, force: true })
  })

  it('vaultExists false sem cortex', () => {
    assert.equal(vaultExists({ cwd: root }), false)
  })

  it('vaultExists true com cortex', () => {
    mkdirSync(join(root, 'cortex'))
    assert.equal(vaultExists({ cwd: root }), true)
  })

  it('detectVaultMode null sem vault', () => {
    assert.equal(detectVaultMode({ cwd: root }), null)
  })

  it('detectVaultMode Freestyled sem Decisoes', () => {
    mkdirSync(join(root, 'cortex'))
    assert.equal(detectVaultMode({ cwd: root }), 'Freestyled')
  })

  it('detectVaultMode Projeto com Decisoes', () => {
    mkdirSync(join(root, 'cortex', 'Decisoes'), { recursive: true })
    assert.equal(detectVaultMode({ cwd: root }), 'Projeto')
  })

  it('detectVaultMode Projeto com Decisions (EN)', () => {
    mkdirSync(join(root, 'cortex', 'Decisions'), { recursive: true })
    assert.equal(detectVaultMode({ cwd: root }), 'Projeto')
  })

  it('detectVaultLang pt por omissão', () => {
    mkdirSync(join(root, 'cortex'))
    assert.equal(detectVaultLang({ cwd: root }), 'pt')
  })

  it('detectVaultLang en com Project.md', () => {
    mkdirSync(join(root, 'cortex'))
    writeFileSync(join(root, 'cortex', 'Project.md'), '# X')
    assert.equal(detectVaultLang({ cwd: root }), 'en')
  })

  it('detectVaultLang en com Project Memory.md', () => {
    mkdirSync(join(root, 'cortex'))
    writeFileSync(join(root, 'cortex', 'Project Memory.md'), '# X')
    assert.equal(detectVaultLang({ cwd: root }), 'en')
  })

  it('detectAiTools vazio sem marcas', () => {
    assert.deepEqual(detectAiTools({ cwd: root, homedir }), [])
  })

  it('detectAiTools Cursor + Copilot no cwd (existsSync injectado — sandbox bloqueia mkdir .cursor)', () => {
    const project = join(root, 'fake-project')
    const fakeHome = join(root, 'fake-home')
    const ex = (p) => {
      if (p === join(project, '.cursor') || p === join(project, '.github')) return true
      if (p === join(fakeHome, '.claude')) return false
      return existsSync(p)
    }
    assert.deepEqual(detectAiTools({ cwd: project, homedir: fakeHome, existsSync: ex }), [
      'Cursor',
      'Copilot',
    ])
  })

  it('detectAiTools Claude com .claude no homedir', () => {
    mkdirSync(join(homedir, '.claude'))
    assert.deepEqual(detectAiTools({ cwd: root, homedir }), ['Claude Code'])
  })
})

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
