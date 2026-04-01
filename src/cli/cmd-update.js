import { join } from 'path'
import { readVaultName, vaultExists, detectVaultLang, detectVaultMode } from '../detect.js'
import { readSpec, writeProjetoNotes } from '../vault.js'
import { updateClaudeCode, updateCursor, updateCopilot } from '../install.js'

/**
 * Core update logic — separated from side effects for testability.
 * @param {string} cwd
 * @returns {Promise<{ exitCode: number, lines: string[] }>}
 */
export async function buildUpdateResult(cwd) {
  if (!vaultExists({ cwd })) {
    return {
      exitCode: 1,
      lines: ['', '  ✗ No vault found. Run: npx @fullchico/cortex-ai', ''],
    }
  }

  const lang = detectVaultLang({ cwd })
  const vaultName = readVaultName({ cwd })
  const vaultPath = join(cwd, vaultName)
  const mode = detectVaultMode({ cwd })

  const lines = ['', '  Updating...', '']

  // Temporarily switch cwd so install functions (which use process.cwd()) work correctly
  const prevCwd = process.cwd()
  process.chdir(cwd)

  try {
    lines.push('  AI tools:')
    updateClaudeCode(lang)
    updateCursor(lang)
    updateCopilot(lang)
    lines.push('')

    lines.push(`  Vault (${vaultName}/):`)
    if (mode === 'Projeto') {
      const vars = readSpec(vaultPath)
      if (Object.keys(vars).length > 0) {
        writeProjetoNotes(vaultPath, {
          NAME: vars.NAME ?? vaultName,
          DESCRIPTION: vars.DESCRIPTION ?? '',
          STACK: vars.STACK ?? '',
          DATE: vars.DATE ?? new Date().toISOString().split('T')[0],
          MODE: vars.MODE ?? 'Projeto',
          LANG: vars.LANG ?? lang,
          PRACTICES: [],
          PROJECT_TYPE: 'fullstack',
        }, true)
        lines.push('  ✓ Existing notes preserved')
        lines.push('  + Missing notes added if any')
      } else {
        lines.push('  - .spec.md not found, skipping vault notes')
      }
    } else {
      lines.push('  - Freestyled: vault structure unchanged')
    }
    lines.push('')
  } finally {
    process.chdir(prevCwd)
  }

  return { exitCode: 0, lines }
}

export async function runUpdate() {
  const { exitCode, lines } = await buildUpdateResult(process.cwd())
  for (const line of lines) console.log(line)
  process.exit(exitCode)
}
