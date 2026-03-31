import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { printBanner } from '../src/cli/banner.js'

describe('printBanner', () => {
  it('imprime tagline e cwd (mock console.log)', () => {
    /** @type {string[]} */
    const out = []
    const orig = console.log
    console.log = (...args) => {
      out.push(args.join(' '))
    }
    try {
      printBanner('en', '/tmp/proj')
    } finally {
      console.log = orig
    }
    const flat = out.join('\n')
    assert.match(flat, /Persistent context for AI/)
    assert.match(flat, /\/tmp\/proj/)
    assert.match(flat, /Cortex — AI Memory Framework/)
  })
})
