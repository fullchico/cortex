import { describe, it, mock, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

let nextSelect = null
let vaultExistsMock = false
let detectVaultModeMock = 'Freestyled'
let detectVaultLangMock = 'pt'

mock.module('@inquirer/prompts', {
  namedExports: {
    select: async () => nextSelect,
    checkbox: async () => [],
    confirm: async () => true,
    input: async () => '',
  },
})

mock.module('../src/detect.js', {
  namedExports: {
    vaultExists: () => vaultExistsMock,
    detectVaultMode: () => detectVaultModeMock,
    detectVaultLang: () => detectVaultLangMock,
    detectAiTools: () => [],
  },
})

mock.module('../src/cli/ai-tools.js', {
  namedExports: {
    promptAiTools: async () => [],
    installSelectedAiTools: () => {},
    logDetectedTools: () => {},
    getAiToolCheckboxChoices: () => [],
  },
})

mock.module('../src/vault.js', {
  namedExports: {
    readFreestyledRoot: () => ({ name: 'Antigo', description: 'Desc antiga' }),
    createVault: () => {},
    archiveVault: () => {},
    migrateVault: () => {},
  },
})

const { runExistingVaultFlow } = await import('../src/cli/existing-vault.js')

describe('runExistingVaultFlow', () => {
  beforeEach(() => {
    nextSelect = null
    vaultExistsMock = false
    detectVaultModeMock = 'Freestyled'
    detectVaultLangMock = 'pt'
  })

  it('sem vault → continue sem flags', async () => {
    vaultExistsMock = false
    const result = await runExistingVaultFlow('pt')
    assert.deepEqual(result, { kind: 'continue', isMigrate: false, isReinit: false, prefill: {} })
  })

  it('vault existe + select exit → kind exit code 0', async () => {
    vaultExistsMock = true
    nextSelect = 'exit'
    const result = await runExistingVaultFlow('pt')
    assert.equal(result.kind, 'exit')
    assert.equal(result.code, 0)
  })

  it('vault existe + select tools → kind exit', async () => {
    vaultExistsMock = true
    detectVaultModeMock = 'Freestyled'
    nextSelect = 'tools'
    const result = await runExistingVaultFlow('pt')
    assert.equal(result.kind, 'exit')
  })

  it('vault Freestyled + select migrate → isMigrate true com prefill', async () => {
    vaultExistsMock = true
    detectVaultModeMock = 'Freestyled'
    detectVaultLangMock = 'pt'
    nextSelect = 'migrate'
    const result = await runExistingVaultFlow('pt')
    assert.equal(result.kind, 'continue')
    assert.equal(result.isMigrate, true)
    assert.equal(result.isReinit, false)
    assert.deepEqual(result.prefill, { name: 'Antigo', description: 'Desc antiga' })
  })

  it('vault existe + select new → isReinit true', async () => {
    vaultExistsMock = true
    nextSelect = 'new'
    const result = await runExistingVaultFlow('pt')
    assert.equal(result.kind, 'continue')
    assert.equal(result.isReinit, true)
    assert.equal(result.isMigrate, false)
  })

  it('en funciona para exit', async () => {
    vaultExistsMock = true
    detectVaultModeMock = 'Freestyled'
    nextSelect = 'exit'
    const result = await runExistingVaultFlow('en')
    assert.equal(result.kind, 'exit')
  })
})
