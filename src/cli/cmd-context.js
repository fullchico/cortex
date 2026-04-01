import { existsSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { input } from '@inquirer/prompts'
import { readVaultName, vaultExists, detectVaultLang } from '../detect.js'

function contextTemplate(name, depends) {
  const depList = depends
    ? depends.split(',').map(d => d.trim()).filter(Boolean)
    : []
  return `# ${name}

depends: [${depList.join(', ')}]
tags: [contexto]

---

## Decisoes
| Decisao | Definicao | Data |
|---------|-----------|------|

## Padroes
-

## Bugs encontrados
-

## Sessoes
-
`
}

/**
 * Core logic — separated from side effects for testability.
 * @param {string|undefined} name
 * @param {string} cwd
 * @returns {Promise<{ exitCode: number, message: string, filePath?: string }>}
 */
export async function buildContextResult(name, cwd) {
  if (!name) {
    return { exitCode: 1, message: '  ✗ Context name required: cortex-ai context <name>' }
  }

  if (!vaultExists({ cwd })) {
    return { exitCode: 1, message: '  ✗ No vault found. Run: npx @fullchico/cortex-ai' }
  }

  const vaultName = readVaultName({ cwd })
  const lang = detectVaultLang({ cwd })
  const isEN = lang === 'en'
  const ctxDir = join(cwd, vaultName, isEN ? 'Sessions/contexts' : 'Sessoes/contextos')
  const ctxFile = join(ctxDir, `${name}.md`)

  if (existsSync(ctxFile)) {
    const rel = `${vaultName}/${isEN ? 'Sessions/contexts' : 'Sessoes/contextos'}/${name}.md`
    return {
      exitCode: 0,
      message: [
        `  ✓ Context "${name}" already exists in ${rel}`,
        `  → Say "cortex start ${name}" to load it.`,
      ].join('\n'),
      filePath: ctxFile,
    }
  }

  const depends = await input({
    message: `  ? Depends on any context? (e.g. users, orders) `,
    default: '',
  })

  mkdirSync(ctxDir, { recursive: true })
  writeFileSync(ctxFile, contextTemplate(name, depends))

  const rel = `${vaultName}/${isEN ? 'Sessions/contexts' : 'Sessoes/contextos'}/${name}.md`
  return {
    exitCode: 0,
    message: [
      `  ✓ Context "${name}" created in ${rel}`,
      `  → Say "cortex start ${name}" to load it.`,
    ].join('\n'),
    filePath: ctxFile,
  }
}

export async function runContext(name) {
  const result = await buildContextResult(name, process.cwd())
  console.log()
  console.log(result.message)
  console.log()
  process.exit(result.exitCode)
}
