import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { t } from './cli/i18n.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES = join(__dirname, '..', 'templates')

const MARKER_START = '<!-- cortex:start -->'
const MARKER_END   = '<!-- cortex:end -->'

function hasCortex(content) {
  return content.includes(MARKER_START)
}

function wrap(content) {
  return `${MARKER_START}\n${content.trim()}\n${MARKER_END}`
}

/** @param {string} lang */
export function templateLocaleDir(lang) {
  return lang === 'en' ? 'en' : 'pt'
}

// Escreve arquivo novo ou appenda bloco cortex ao existente
function installOrAppend(dest, content, label, lang) {
  if (!existsSync(dest)) {
    writeFileSync(dest, wrap(content))
    console.log(t(lang, 'installLog.createdFile', { label }))
    return
  }
  const existing = readFileSync(dest, 'utf8')
  if (hasCortex(existing)) {
    console.log(t(lang, 'installLog.hasProtocol', { label }))
    return
  }
  writeFileSync(dest, existing.trimEnd() + '\n\n' + wrap(content))
  console.log(t(lang, 'installLog.appended', { label }))
}

function readTemplate(relPath, lang) {
  const dir = templateLocaleDir(lang)
  return readFileSync(join(TEMPLATES, dir, relPath), 'utf8')
}

export function installClaudeCode(lang = 'pt') {
  const dest = join(process.cwd(), 'CLAUDE.md')
  installOrAppend(dest, readTemplate('CLAUDE.md', lang), 'CLAUDE.md', lang)
}

export function installCursor(lang = 'pt') {
  const rulesDir = join(process.cwd(), '.cursor', 'rules')
  mkdirSync(rulesDir, { recursive: true })

  const rules = ['cortex-protocol.mdc', 'cortex-start.mdc', 'cortex-end.mdc']
  for (const rule of rules) {
    const dest = join(rulesDir, rule)
    if (existsSync(dest)) {
      console.log(t(lang, 'installLog.cursorHasProtocol', { rule }))
      continue
    }
    writeFileSync(dest, readTemplate(`cursor/${rule}`, lang))
    console.log(t(lang, 'installLog.cursorCreated', { rule }))
  }
}

export function installCopilot(lang = 'pt') {
  const githubDir = join(process.cwd(), '.github')
  mkdirSync(githubDir, { recursive: true })

  const dest = join(githubDir, 'copilot-instructions.md')
  installOrAppend(dest, readTemplate('copilot/copilot-instructions.md', lang), '.github/copilot-instructions.md', lang)
}

export function updateGitignore(lang = 'pt', vaultName = 'cortex') {
  const gitignorePath = join(process.cwd(), '.gitignore')
  const entry = `${vaultName}/`

  if (existsSync(gitignorePath)) {
    const content = readFileSync(gitignorePath, 'utf8')
    if (content.includes(entry)) {
      console.log(t(lang, 'installLog.gitignoreHas', { vaultName }))
      return
    }
    writeFileSync(gitignorePath, content + '\n# Cortex vault\n' + entry + '\n')
  } else {
    writeFileSync(gitignorePath, '# Cortex vault\n' + entry + '\n')
  }
  console.log(t(lang, 'installLog.gitignoreAdded', { vaultName }))
}
