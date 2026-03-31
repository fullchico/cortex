import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { resolveLangHint } from '../src/cli/prompt-language.js'

describe('resolveLangHint', () => {
  it('LANG pt_BR → pt', () => {
    assert.equal(resolveLangHint({ LANG: 'pt_BR.UTF-8' }), 'pt')
  })

  it('LANG pt-PT → pt', () => {
    assert.equal(resolveLangHint({ LANG: 'pt_PT.UTF-8' }), 'pt')
  })

  it('LANG en_US → en', () => {
    assert.equal(resolveLangHint({ LANG: 'en_US.UTF-8' }), 'en')
  })

  it('usa LANGUAGE quando LANG vazio', () => {
    assert.equal(resolveLangHint({ LANG: '', LANGUAGE: 'pt' }), 'pt')
  })

  it('vazio → en', () => {
    assert.equal(resolveLangHint({}), 'en')
  })
})
