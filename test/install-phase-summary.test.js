import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { printCompletionSummary } from '../src/cli/install-phase.js'

describe('printCompletionSummary', () => {
  it('imprime blocos esperados para migração EN', () => {
    /** @type {string[]} */
    const lines = []
    const orig = console.log
    console.log = (...a) => lines.push(a.join(' '))
    try {
      printCompletionSummary({
        isMigrate: true,
        isReinit: false,
        hasSpec: false,
        aiTools: [],
        lang: 'en',
        archiveDate: '2026-03-31',
      })
    } finally {
      console.log = orig
    }
    const text = lines.join('\n')
    assert.match(text, /migrated/i)
    assert.match(text, /\[\[Project\]\]/)
  })

  it('imprime dicas de ferramentas quando aiTools preenchido', () => {
    const lines = []
    const orig = console.log
    console.log = (...a) => lines.push(a.join(' '))
    try {
      printCompletionSummary({
        isMigrate: false,
        isReinit: false,
        hasSpec: true,
        aiTools: ['Claude Code'],
        lang: 'pt',
        archiveDate: '2026-03-31',
      })
    } finally {
      console.log = orig
    }
    const text = lines.join('\n')
    assert.match(text, /cortex start/)
    assert.match(text, /spec/i)
  })
})
