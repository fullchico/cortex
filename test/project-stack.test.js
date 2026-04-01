import { describe, it, mock, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

let selectQueue = []
let inputQueue = []

mock.module('@inquirer/prompts', {
  namedExports: {
    select: async () => selectQueue.shift(),
    input: async () => inputQueue.shift(),
    confirm: async () => false,
    checkbox: async () => [],
  },
})

const { promptProjectType, promptStack } = await import('../src/cli/project-stack.js')

describe('promptProjectType', () => {
  beforeEach(() => {
    selectQueue = []
  })

  it('retorna o valor selecionado', async () => {
    selectQueue = ['backend']
    assert.equal(await promptProjectType('pt'), 'backend')
  })

  it('en funciona igual', async () => {
    selectQueue = ['frontend']
    assert.equal(await promptProjectType('en'), 'frontend')
  })
})

describe('promptStack — backend', () => {
  beforeEach(() => {
    selectQueue = []
    inputQueue = []
  })

  it('backend Node.js', async () => {
    selectQueue = ['Node.js']
    assert.equal(await promptStack('pt', 'backend'), 'Node.js')
  })

  it('backend Java', async () => {
    selectQueue = ['Java']
    assert.equal(await promptStack('pt', 'backend'), 'Java')
  })

  it('backend other → custom input', async () => {
    selectQueue = ['other']
    inputQueue = ['Bun']
    assert.equal(await promptStack('pt', 'backend'), 'Bun')
  })
})

describe('promptStack — frontend', () => {
  beforeEach(() => {
    selectQueue = []
    inputQueue = []
  })

  it('frontend React', async () => {
    selectQueue = ['React']
    assert.equal(await promptStack('pt', 'frontend'), 'React')
  })

  it('frontend other → custom input', async () => {
    selectQueue = ['other']
    inputQueue = ['Svelte']
    assert.equal(await promptStack('pt', 'frontend'), 'Svelte')
  })
})

describe('promptStack — fullstack', () => {
  beforeEach(() => {
    selectQueue = []
    inputQueue = []
  })

  it('combina front + back com " + "', async () => {
    selectQueue = ['React', 'Node.js']
    assert.equal(await promptStack('pt', 'fullstack'), 'React + Node.js')
  })

  it('front other + back Go', async () => {
    selectQueue = ['other', 'Go']
    inputQueue = ['Svelte']
    assert.equal(await promptStack('pt', 'fullstack'), 'Svelte + Go')
  })
})
