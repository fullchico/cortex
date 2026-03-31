import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { templateLocaleDir } from '../src/install.js'

const here = dirname(fileURLToPath(import.meta.url))
const templatesRoot = join(here, '..', 'templates')

describe('templateLocaleDir', () => {
  it('en vs pt', () => {
    assert.equal(templateLocaleDir('en'), 'en')
    assert.equal(templateLocaleDir('pt'), 'pt')
    assert.equal(templateLocaleDir('fr'), 'pt')
  })
})

describe('templates por idioma', () => {
  it('PT: instruções e caminhos em português', () => {
    const claude = readFileSync(join(templatesRoot, 'pt', 'CLAUDE.md'), 'utf8')
    assert.match(claude, /antes de codar/)
    assert.match(claude, /Dominio\/Entidades/)
  })

  it('EN: instruções e caminhos em inglês', () => {
    const claude = readFileSync(join(templatesRoot, 'en', 'CLAUDE.md'), 'utf8')
    assert.match(claude, /before coding/i)
    assert.match(claude, /Domain\/Entities/)
  })

  it('cada locale tem os mesmos ficheiros de integração', () => {
    const rels = ['CLAUDE.md', 'cursor/cortex-protocol.mdc', 'copilot/copilot-instructions.md']
    for (const rel of rels) {
      assert.doesNotThrow(() => {
        readFileSync(join(templatesRoot, 'pt', rel), 'utf8')
      })
      assert.doesNotThrow(() => {
        readFileSync(join(templatesRoot, 'en', rel), 'utf8')
      })
    }
  })
})
