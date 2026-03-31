import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { getAiToolCheckboxChoices } from '../src/cli/ai-tools.js'

describe('getAiToolCheckboxChoices', () => {
  it('valores estáveis e checked conforme detected', () => {
    const choices = getAiToolCheckboxChoices('pt', ['Cursor'], 'init')
    assert.equal(choices.length, 3)
    assert.deepEqual(
      choices.map((c) => ({ value: c.value, checked: c.checked })),
      [
        { value: 'Claude Code', checked: false },
        { value: 'Cursor', checked: true },
        { value: 'Copilot', checked: false },
      ],
    )
  })

  it('init vs update altera labels (Claude)', () => {
    const init = getAiToolCheckboxChoices('en', [], 'init').find((c) => c.value === 'Claude Code')
    const upd = getAiToolCheckboxChoices('en', [], 'update').find((c) => c.value === 'Claude Code')
    assert.match(init.name, /creates/i)
    assert.match(upd.name, /updates/i)
    assert.notEqual(init.name, upd.name)
  })
})
