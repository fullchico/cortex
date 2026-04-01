import { existsSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { readVaultName, vaultExists, detectVaultMode, detectVaultLang, detectAiTools } from '../detect.js'

/**
 * Builds the status output without side effects (testable).
 * @returns {{ exitCode: number, lines: string[] }}
 */
export function buildStatus() {
  if (!vaultExists()) {
    return {
      exitCode: 1,
      lines: ['', '  ✗ No vault found. Run: npx @fullchico/cortex-ai', ''],
    }
  }

  const vaultName = readVaultName()
  const mode = detectVaultMode() ?? 'Freestyled'
  const lang = detectVaultLang()
  const vaultPath = join(process.cwd(), vaultName)
  const isEN = lang === 'en'

  const lines = []
  lines.push('')
  lines.push(`  # Cortex Status — ${vaultName}`)
  lines.push('')
  lines.push(`  Vault: ${vaultName}/  ·  Mode: ${mode}  ·  Lang: ${lang.toUpperCase()}`)

  // AI tools
  const tools = detectAiTools()
  const claudeOn  = tools.includes('Claude Code') ? '✓' : '✗'
  const cursorOn  = tools.includes('Cursor') ? '✓' : '✗'
  const copilotOn = tools.includes('Copilot') ? '✓' : '✗'
  lines.push(`  AI tools:  Claude Code ${claudeOn}  ·  Cursor ${cursorOn}  ·  Copilot ${copilotOn}`)
  lines.push('')

  // Contexts
  const ctxDir = join(vaultPath, isEN ? 'Sessions/contexts' : 'Sessoes/contextos')
  if (existsSync(ctxDir)) {
    const ctxFiles = readdirSync(ctxDir).filter(f => f.endsWith('.md'))
    if (ctxFiles.length > 0) {
      lines.push('  Contexts:')
      for (const file of ctxFiles) {
        const content = readFileSync(join(ctxDir, file), 'utf8')
        const dependsLine = content.split('\n').find(l => l.startsWith('depends:'))
        const depends = dependsLine ? dependsLine.replace('depends:', '').trim() : ''
        const name = file.replace('.md', '')
        lines.push(depends && depends !== '[]'
          ? `  - ${name} (depends: ${depends.replace(/[\[\]]/g, '')})`
          : `  - ${name}`)
      }
      lines.push('')
    }
  }

  // Last session
  const tlDir = join(vaultPath, isEN ? 'Sessions/timeline' : 'Sessoes/timeline')
  if (existsSync(tlDir)) {
    const tlFiles = readdirSync(tlDir).filter(f => f.endsWith('.md')).sort()
    if (tlFiles.length > 0) {
      const lastFile = tlFiles[tlFiles.length - 1]
      const lastDate = lastFile.replace('.md', '')
      lines.push(`  Last session: ${lastDate}`)

      const tlContent = readFileSync(join(tlDir, lastFile), 'utf8')
      const pending = tlContent.split('\n').filter(l => l.trim().startsWith('- [ ]'))
      if (pending.length > 0) {
        lines.push('  Pending:')
        for (const p of pending) lines.push(`  ${p.trim()}`)
      }
      lines.push('')
    }
  }

  // Best practices (from Projeto.md / Project.md)
  const rootFile = join(vaultPath, isEN ? 'Project.md' : 'Projeto.md')
  if (existsSync(rootFile)) {
    const content = readFileSync(rootFile, 'utf8')
    const sectionMatch = content.match(/## (?:Boas Praticas|Best Practices)\n([\s\S]*?)(?=\n##|$)/)
    if (sectionMatch) {
      const practices = sectionMatch[1].split('\n')
        .map(l => l.replace(/^[-*·]\s*/, '').trim())
        .filter(Boolean)
      if (practices.length > 0) {
        lines.push(`  Best practices: ${practices.join(' · ')}`)
        lines.push('')
      }
    }
  }

  // Vault health
  lines.push('  Health:')
  const markerOk = existsSync(join(process.cwd(), '.cortex'))
  lines.push(`  ${markerOk ? '✓' : '✗'} .cortex marker`)
  const projetoFile = isEN ? 'Project.md' : 'Projeto.md'
  const memFile = isEN ? 'Project Memory.md' : 'Memoria Projeto.md'
  const rootOk = existsSync(join(vaultPath, projetoFile)) || existsSync(join(vaultPath, memFile))
  lines.push(`  ${rootOk ? '✓' : '✗'} ${vaultName}/${rootOk ? projetoFile : memFile}`)
  const sessOk = existsSync(join(vaultPath, isEN ? 'Sessions/timeline' : 'Sessoes/timeline'))
  lines.push(`  ${sessOk ? '✓' : '✗'} ${vaultName}/${isEN ? 'Sessions/timeline/' : 'Sessoes/timeline/'}`)
  const claudeMd = existsSync(join(process.cwd(), 'CLAUDE.md'))
  lines.push(`  ${claudeMd ? '✓' : '✗'} CLAUDE.md`)
  lines.push('')

  return { exitCode: 0, lines }
}

export async function runStatus() {
  const { exitCode, lines } = buildStatus()
  for (const line of lines) console.log(line)
  process.exit(exitCode)
}
