import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  t,
  vaultModeDisplayLabel,
  getPracticeDescriptions,
  locales,
} from '../src/cli/i18n.js'

/** @param {Record<string, unknown>} obj @param {string} [prefix] */
function collectStringPaths(obj, prefix = '') {
  /** @type {string[]} */
  const paths = []
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k
    if (typeof v === 'string') paths.push(p)
    else if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      paths.push(...collectStringPaths(v, p))
    }
  }
  return paths.sort()
}

describe('i18n.t', () => {
  it('resolve strings em pt e en', () => {
    assert.equal(t('pt', 'banner.line2'), 'Contexto persistente para AI')
    assert.equal(t('en', 'banner.line2'), 'Persistent context for AI')
  })

  it('interpola placeholders', () => {
    assert.equal(
      t('pt', 'init.confirmVault', { path: '/app/cortex/' }),
      'Inicializar vault em /app/cortex/ ?',
    )
    assert.equal(
      t('en', 'init.confirmVault', { path: '/app/cortex/' }),
      'Initialize vault at /app/cortex/?',
    )
  })

  it('retorna a propria chave quando nao existe', () => {
    assert.equal(t('pt', 'nao.existe'), 'nao.existe')
  })

  it('idioma desconhecido usa bundle pt', () => {
    assert.equal(t('fr', 'banner.line2'), t('pt', 'banner.line2'))
  })

  it('nao interpola sem vars quando template tem placeholders', () => {
    const raw = t('pt', 'vaultLog.archived')
    assert.match(raw, /\{\{archiveName\}\}/)
  })
})

describe('i18n.vaultModeDisplayLabel', () => {
  it('Projeto → Project em en', () => {
    assert.equal(vaultModeDisplayLabel('en', 'Projeto'), 'Project')
    assert.equal(vaultModeDisplayLabel('pt', 'Projeto'), 'Projeto')
  })

  it('Freestyled mantem label', () => {
    assert.equal(vaultModeDisplayLabel('en', 'Freestyled'), 'Freestyled')
    assert.equal(vaultModeDisplayLabel('pt', 'Freestyled'), 'Freestyled')
  })

  it('outro valor cai em Freestyled', () => {
    assert.equal(vaultModeDisplayLabel('pt', null), 'Freestyled')
    assert.equal(vaultModeDisplayLabel('en', undefined), 'Freestyled')
  })
})

describe('i18n.getPracticeDescriptions', () => {
  it('retorna tests, clean e solid para cada projectType', () => {
    for (const type of ['frontend', 'backend', 'fullstack']) {
      const d = getPracticeDescriptions('en', type)
      assert.ok(d.tests.length > 10)
      assert.ok(d.clean.length > 10)
      assert.ok(d.solid.length > 10)
    }
  })

  it('frontend difere de backend em en', () => {
    const f = getPracticeDescriptions('en', 'frontend')
    const b = getPracticeDescriptions('en', 'backend')
    assert.notEqual(f.tests, b.tests)
  })
})

describe('i18n paridade pt/en', () => {
  it('mesmo conjunto de chaves folha (strings)', () => {
    const ptPaths = collectStringPaths(locales.pt)
    const enPaths = collectStringPaths(locales.en)
    assert.deepEqual(ptPaths, enPaths)
  })
})
