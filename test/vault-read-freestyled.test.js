import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { readFreestyledRoot } from '../src/vault.js'

describe('readFreestyledRoot', () => {
  let root

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'cortex-vault-'))
    mkdirSync(join(root, '.cortex'), { recursive: true })
  })

  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it('retorna {} sem ficheiro raiz', () => {
    assert.deepEqual(readFreestyledRoot('pt', { cwd: root }), {})
  })

  it('extrai nome, Sobre e Stack de Projeto.md', () => {
    const md = `# Meu App

## Sobre

Uma descricao util.

| **Stack** | Node.js |
`
    writeFileSync(join(root, '.cortex', 'Projeto.md'), md)
    const r = readFreestyledRoot('pt', { cwd: root })
    assert.equal(r.name, 'Meu App')
    assert.equal(r.description, 'Uma descricao util.')
    assert.equal(r.stack, 'Node.js')
  })

  it('usa Project.md quando lang en', () => {
    writeFileSync(
      join(root, '.cortex', 'Project.md'),
      `# App EN

## About

English desc.

| **Stack** | React |
`,
    )
    const r = readFreestyledRoot('en', { cwd: root })
    assert.equal(r.name, 'App EN')
    assert.equal(r.description, 'English desc.')
    assert.equal(r.stack, 'React')
  })
})
