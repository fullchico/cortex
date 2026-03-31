import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES = join(__dirname, '..', 'templates')

export function installClaudeCode() {
  const dest = join(process.cwd(), 'CLAUDE.md')
  if (existsSync(dest)) {
    console.log('  ⚠  CLAUDE.md ja existe — pulando')
    return
  }
  copyFileSync(join(TEMPLATES, 'CLAUDE.md'), dest)
  console.log('  ✓ Criou CLAUDE.md')
}

export function installCursor() {
  const rulesDir = join(process.cwd(), '.cursor', 'rules')
  mkdirSync(rulesDir, { recursive: true })

  const rules = ['cortex-protocol.mdc', 'cortex-start.mdc', 'cortex-end.mdc']
  for (const rule of rules) {
    const dest = join(rulesDir, rule)
    if (existsSync(dest)) {
      console.log(`  ⚠  .cursor/rules/${rule} ja existe — pulando`)
      continue
    }
    copyFileSync(join(TEMPLATES, 'cursor', rule), dest)
    console.log(`  ✓ Criou .cursor/rules/${rule}`)
  }
}

export function installCopilot() {
  const githubDir = join(process.cwd(), '.github')
  mkdirSync(githubDir, { recursive: true })

  const dest = join(githubDir, 'copilot-instructions.md')
  if (existsSync(dest)) {
    console.log('  ⚠  .github/copilot-instructions.md ja existe — pulando')
    return
  }
  copyFileSync(join(TEMPLATES, 'copilot', 'copilot-instructions.md'), dest)
  console.log('  ✓ Criou .github/copilot-instructions.md')
}

export function updateGitignore() {
  const gitignorePath = join(process.cwd(), '.gitignore')
  const entry = '.cortex/'

  if (existsSync(gitignorePath)) {
    const content = readFileSync(gitignorePath, 'utf8')
    if (content.includes(entry)) {
      console.log('  ✓ .cortex/ ja esta no .gitignore')
      return
    }
    writeFileSync(gitignorePath, content + '\n# Cortex vault\n' + entry + '\n')
  } else {
    writeFileSync(gitignorePath, '# Cortex vault\n' + entry + '\n')
  }
  console.log('  ✓ Adicionou .cortex/ ao .gitignore')
}
