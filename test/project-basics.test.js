import { describe, it, mock, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

let inputQueue = []

mock.module('@inquirer/prompts', {
  namedExports: {
    input: async () => inputQueue.shift(),
    select: async () => null,
    confirm: async () => false,
    checkbox: async () => [],
  },
})

const { promptProjectBasics } = await import('../src/cli/project-basics.js')

describe('promptProjectBasics', () => {
  beforeEach(() => {
    inputQueue = []
  })

  it('sem prefill retorna name e description', async () => {
    inputQueue = ['MeuProjeto', 'Framework de AI']
    const result = await promptProjectBasics({}, 'pt')
    assert.deepEqual(result, { name: 'MeuProjeto', description: 'Framework de AI' })
  })

  it('faz trim de espaços', async () => {
    inputQueue = ['  Cortex  ', '  Contexto persistente  ']
    const result = await promptProjectBasics({}, 'pt')
    assert.deepEqual(result, { name: 'Cortex', description: 'Contexto persistente' })
  })

  it('en funciona igual', async () => {
    inputQueue = ['MyProject', 'A great tool']
    const result = await promptProjectBasics({}, 'en')
    assert.deepEqual(result, { name: 'MyProject', description: 'A great tool' })
  })
})
