import { describe, it, beforeEach, mock } from 'node:test'
import assert from 'node:assert/strict'

// Mocks declarados antes de qualquer import dinâmico
let nextSelect = null
let nextCheckbox = []
let nextConfirm = false

mock.module('@inquirer/prompts', {
  namedExports: {
    select: async () => nextSelect,
    checkbox: async () => nextCheckbox,
    confirm: async () => nextConfirm,
    input: async () => '',
  },
})

const { promptMode, promptFreestyledPractices, promptHasSpecImport } =
  await import('../src/cli/mode-and-practices.js')

describe('promptMode', () => {
  beforeEach(() => { nextSelect = null })

  it('pt retorna Freestyled quando select resolve Freestyled', async () => {
    nextSelect = 'Freestyled'
    assert.equal(await promptMode('pt', false), 'Freestyled')
  })

  it('pt retorna Projeto quando select resolve Projeto', async () => {
    nextSelect = 'Projeto'
    assert.equal(await promptMode('pt', false), 'Projeto')
  })

  it('en retorna Freestyled', async () => {
    nextSelect = 'Freestyled'
    assert.equal(await promptMode('en', false), 'Freestyled')
  })

  it('isMigrate true não afeta o retorno quando select resolve', async () => {
    nextSelect = 'Projeto'
    assert.equal(await promptMode('pt', true), 'Projeto')
  })
})

describe('promptFreestyledPractices', () => {
  beforeEach(() => { nextCheckbox = [] })

  it('retorna array vazio quando nada selecionado', async () => {
    nextCheckbox = []
    const result = await promptFreestyledPractices('pt', 'backend')
    assert.deepEqual(result, [])
  })

  it('retorna práticas selecionadas', async () => {
    nextCheckbox = ['tests', 'solid']
    const result = await promptFreestyledPractices('pt', 'backend')
    assert.deepEqual(result, ['tests', 'solid'])
  })

  it('aceita todas as práticas', async () => {
    nextCheckbox = ['tests', 'clean', 'solid']
    const result = await promptFreestyledPractices('en', 'frontend')
    assert.deepEqual(result, ['tests', 'clean', 'solid'])
  })
})

describe('promptHasSpecImport', () => {
  beforeEach(() => { nextConfirm = false })

  it('retorna false quando confirm resolve false', async () => {
    nextConfirm = false
    assert.equal(await promptHasSpecImport('pt'), false)
  })

  it('retorna true quando confirm resolve true', async () => {
    nextConfirm = true
    assert.equal(await promptHasSpecImport('pt'), true)
  })

  it('en retorna false por padrão', async () => {
    nextConfirm = false
    assert.equal(await promptHasSpecImport('en'), false)
  })
})
