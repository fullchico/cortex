import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES = join(__dirname, '..', 'templates')

// Substitui paths PT → EN nos templates para vaults EN
const EN_PATHS = [
  [/Sessoes\/Sessoes - Memoria Temporal\.md/g, 'Sessions/Sessions - Temporal Memory.md'],
  [/Sessoes\/contextos\//g, 'Sessions/contexts/'],
  [/Sessoes\/timeline\//g, 'Sessions/timeline/'],
  [/Sessoes\//g, 'Sessions/'],
  [/Dominio\/Glossario de Dominio\.md/g, 'Domain/Domain Glossary.md'],
  [/Dominio\/Entidades\.md/g, 'Domain/Entities.md'],
  [/Dominio\//g, 'Domain/'],
  [/Arquitetura\/Padroes de Codigo\.md/g, 'Architecture/Code Patterns.md'],
  [/Arquitetura\/Mapa de Modulos\.md/g, 'Architecture/Module Map.md'],
  [/Arquitetura\/Estrategia de Testes\.md/g, 'Architecture/Test Strategy.md'],
  [/Arquitetura\/Contratos API\.md/g, 'Architecture/API Contracts.md'],
  [/Arquitetura\/Decisoes de Arquitetura\.md/g, 'Architecture/Architecture Decisions.md'],
  [/Arquitetura\/Integracoes\.md/g, 'Architecture/Integrations.md'],
  [/Arquitetura\//g, 'Architecture/'],
  [/Decisoes\/Definicoes Travadas\.md/g, 'Decisions/Locked Definitions.md'],
  [/Decisoes\/Questoes em Aberto\.md/g, 'Decisions/Open Questions.md'],
  [/Decisoes\//g, 'Decisions/'],
  [/Regras de Negocio\/Regras Gerais\.md/g, 'Business Rules/General Rules.md'],
  [/Regras de Negocio\//g, 'Business Rules/'],
  [/Memoria Projeto\.md/g, 'Project Memory.md'],
]

function applyLang(content, lang) {
  if (lang !== 'en') return content
  let result = content
  for (const [pattern, replacement] of EN_PATHS) {
    result = result.replace(pattern, replacement)
  }
  return result
}

function readTemplate(relPath, lang) {
  const raw = readFileSync(join(TEMPLATES, relPath), 'utf8')
  return applyLang(raw, lang)
}

export function installClaudeCode(lang = 'pt') {
  const dest = join(process.cwd(), 'CLAUDE.md')
  if (existsSync(dest)) {
    console.log('  ⚠  CLAUDE.md ja existe — pulando')
    return
  }
  writeFileSync(dest, readTemplate('CLAUDE.md', lang))
  console.log('  ✓ Criou CLAUDE.md')
}

export function installCursor(lang = 'pt') {
  const rulesDir = join(process.cwd(), '.cursor', 'rules')
  mkdirSync(rulesDir, { recursive: true })

  const rules = ['cortex-protocol.mdc', 'cortex-start.mdc', 'cortex-end.mdc']
  for (const rule of rules) {
    const dest = join(rulesDir, rule)
    if (existsSync(dest)) {
      console.log(`  ⚠  .cursor/rules/${rule} ja existe — pulando`)
      continue
    }
    writeFileSync(dest, readTemplate(`cursor/${rule}`, lang))
    console.log(`  ✓ Criou .cursor/rules/${rule}`)
  }
}

export function installCopilot(lang = 'pt') {
  const githubDir = join(process.cwd(), '.github')
  mkdirSync(githubDir, { recursive: true })

  const dest = join(githubDir, 'copilot-instructions.md')
  if (existsSync(dest)) {
    console.log('  ⚠  .github/copilot-instructions.md ja existe — pulando')
    return
  }
  writeFileSync(dest, readTemplate('copilot/copilot-instructions.md', lang))
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
