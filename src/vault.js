import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES = join(__dirname, '..', 'templates')

const PT_STRUCTURE = {
  projeto: {
    root: [
      'Memoria Projeto.md',
      'MANIFESTO.md',
      'Getting Started.md',
      'Health Check.md',
      'FAQ Tecnico.md',
      'Changelog.md',
    ],
    dirs: {
      'Decisoes': ['Definicoes Travadas.md', 'Questoes em Aberto.md', 'Anti-patterns.md'],
      'Dominio': ['Glossario de Dominio.md', 'Entidades.md'],
      'Arquitetura': [
        'Clean Architecture.md',
        'Estrategia de Testes.md',
        'Padroes de Codigo.md',
        'Mapa de Modulos.md',
        'Decisoes de Arquitetura.md',
        'Contratos API.md',
        'Integracoes.md',
      ],
      'Regras de Negocio': ['Regras Gerais.md'],
      'Sessoes': ['Sessoes - Memoria Temporal.md'],
      'Sessoes/timeline': [],
      'Sessoes/contextos': [],
    },
  },
  livre: {
    root: ['Projeto.md'],
    dirs: {
      'Sessoes/timeline': [],
      'Sessoes/contextos': [],
    },
  },
}

const EN_STRUCTURE = {
  projeto: {
    root: [
      'Project Memory.md',
      'MANIFESTO.md',
      'Getting Started.md',
      'Health Check.md',
      'Technical FAQ.md',
      'Changelog.md',
    ],
    dirs: {
      'Decisions': ['Locked Definitions.md', 'Open Questions.md', 'Anti-patterns.md'],
      'Domain': ['Domain Glossary.md', 'Entities.md'],
      'Architecture': [
        'Clean Architecture.md',
        'Test Strategy.md',
        'Code Patterns.md',
        'Module Map.md',
        'Architecture Decisions.md',
        'API Contracts.md',
        'Integrations.md',
      ],
      'Business Rules': ['General Rules.md'],
      'Sessions': ['Sessions - Temporal Memory.md'],
      'Sessions/timeline': [],
      'Sessions/contexts': [],
    },
  },
  livre: {
    root: ['Project.md'],
    dirs: {
      'Sessions/timeline': [],
      'Sessions/contexts': [],
    },
  },
}

function buildProjectMemory(vars, lang) {
  const isEN = lang === 'en'
  return `# ${isEN ? 'Project Memory' : 'Memoria Projeto'}

${isEN ? '#moc #project #memory' : '#moc #projeto #memoria'}

> [!abstract] ${isEN ? 'Project second brain — AI reads this first' : 'Segundo cerebro do projeto — AI le isto primeiro'}

---

## ${isEN ? 'About the project' : 'Sobre o projeto'}

| ${isEN ? 'Field' : 'Campo'} | ${isEN ? 'Value' : 'Valor'} |
|-------|-------|
| **${isEN ? 'Name' : 'Nome'}** | ${vars.NAME} |
| **${isEN ? 'Description' : 'Descricao'}** | ${vars.DESCRIPTION} |
| **Stack** | ${vars.STACK} |
| **${isEN ? 'Mode' : 'Modo'}** | ${vars.MODE} |
| **${isEN ? 'Language' : 'Idioma'}** | ${vars.LANG.toUpperCase()} |
| **${isEN ? 'Started' : 'Inicio'}** | ${vars.DATE} |

---

## ${isEN ? 'Project status' : 'Estado do projeto'}

### ${isEN ? 'Implemented' : 'Implementado'}
- [ ] _(${isEN ? 'fill in as it evolves' : 'preencher conforme evolui'})_

### ${isEN ? 'In progress' : 'Em andamento'}
- [ ] _(${isEN ? 'fill in as it evolves' : 'preencher conforme evolui'})_

### ${isEN ? 'Pending' : 'Pendente'}
- [ ] _(${isEN ? 'fill in as it evolves' : 'preencher conforme evolui'})_

---

## ${isEN ? 'AI consultation protocol' : 'Protocolo de consulta do AI'}

> [!important] ${isEN ? 'Follow BEFORE writing any code' : 'Seguir ANTES de escrever qualquer codigo'}

**${isEN ? 'To code:' : 'Para codar:'}**
1. ${isEN ? '[[Entities]]' : '[[Entidades]]'} — ${isEN ? 'real fields exist?' : 'campos reais existem?'}
2. ${isEN ? '[[Code Patterns]]' : '[[Padroes de Codigo]]'} — ${isEN ? 'how is it done here?' : 'como e feito aqui?'}
3. ${isEN ? '[[Anti-patterns]]' : '[[Anti-patterns]]'} — ${isEN ? 'what not to do?' : 'o que nao fazer?'}
4. ${isEN ? '[[Module Map]]' : '[[Mapa de Modulos]]'} — ${isEN ? 'already exists?' : 'ja existe?'}
5. ${isEN ? '[[Test Strategy]]' : '[[Estrategia de Testes]]'} — ${isEN ? 'how to test?' : 'como testar?'}

**${isEN ? 'To decide:' : 'Para decidir:'}**
6. ${isEN ? '[[Locked Definitions]]' : '[[Definicoes Travadas]]'} — ${isEN ? 'already decided?' : 'ja foi decidido?'}
7. ${isEN ? '[[Open Questions]]' : '[[Questoes em Aberto]]'} — ${isEN ? 'not decided yet?' : 'ainda nao foi decidido?'}
8. ${isEN ? '[[General Rules]]' : '[[Regras Gerais]]'} — ${isEN ? 'what is the formula/logic?' : 'qual a formula/logica?'}
`
}

function buildEmptyNote(title, tags, callout, lang) {
  const isEN = lang === 'en'
  return `# ${title}

${tags}

> [!abstract] ${callout}

${isEN ? 'Back' : 'Voltar'}: [[${isEN ? 'Project Memory' : 'Memoria Projeto'}]]

---

_(${isEN ? 'fill in as the project evolves' : 'preencher conforme o projeto evolui'})_
`
}

function buildLockedDefinitions(lang) {
  const isEN = lang === 'en'
  return `# ${isEN ? 'Locked Definitions' : 'Definicoes Travadas'}

${isEN ? '#decisions' : '#decisoes'}

> [!abstract] ${isEN ? 'Confirmed rules — do not change without explicit review' : 'Regras confirmadas — nao alterar sem revisao explicita'}

${isEN ? 'Back' : 'Voltar'}: [[${isEN ? 'Project Memory' : 'Memoria Projeto'}]]

---

| ${isEN ? 'Decision' : 'Decisao'} | ${isEN ? 'Definition' : 'Definicao'} | ${isEN ? 'Date' : 'Data'} |
|---------|-----------|------|
`
}

function buildSessionsIndex(lang) {
  const isEN = lang === 'en'
  return `# ${isEN ? 'Sessions — Temporal Memory' : 'Sessoes — Memoria Temporal'}

${isEN ? '#sessions #moc' : '#sessoes #moc'}

> [!abstract] ${isEN ? 'The chronological brain of the project' : 'O cerebro cronologico do projeto'}

${isEN ? 'Back' : 'Voltar'}: [[${isEN ? 'Project Memory' : 'Memoria Projeto'}]]

---

## ${isEN ? 'Registered sessions' : 'Sessoes registradas'}

| ${isEN ? 'Date' : 'Data'} | ${isEN ? 'Session' : 'Sessao'} | ${isEN ? 'Focus' : 'Foco'} |
|------|--------|------|
`
}

function buildSpec(vars) {
  const specContent = readFileSync(join(TEMPLATES, 'vault-spec.md'), 'utf8')
  return specContent
    .replace(/\{\{NAME\}\}/g, vars.NAME)
    .replace(/\{\{DESCRIPTION\}\}/g, vars.DESCRIPTION)
    .replace(/\{\{STACK\}\}/g, vars.STACK)
    .replace(/\{\{DATE\}\}/g, vars.DATE)
    .replace(/\{\{MODE\}\}/g, vars.MODE)
    .replace(/\{\{LANG\}\}/g, vars.LANG)
}

export function createVault(vars) {
  const { NAME, LANG, MODE } = vars
  const vaultPath = join(process.cwd(), '.cortex')
  const isEN = LANG === 'en'
  const isLivre = MODE === 'Livre' || MODE === 'Free'
  const structure = isEN
    ? (isLivre ? EN_STRUCTURE.livre : EN_STRUCTURE.projeto)
    : (isLivre ? PT_STRUCTURE.livre : PT_STRUCTURE.projeto)

  // Criar diretorio raiz
  mkdirSync(vaultPath, { recursive: true })

  // Criar .gitignore do vault
  writeFileSync(join(vaultPath, '.gitignore'), '# Obsidian\n.obsidian/\n.trash/\n')

  // Criar .spec.md (blueprint interno)
  writeFileSync(join(vaultPath, '.spec.md'), buildSpec(vars))

  // Criar diretorios
  for (const dir of Object.keys(structure.dirs)) {
    mkdirSync(join(vaultPath, dir), { recursive: true })
  }

  // Criar nota principal com vars substituidas
  const rootNote = isEN ? 'Project Memory.md' : (isLivre ? 'Projeto.md' : 'Memoria Projeto.md')
  writeFileSync(join(vaultPath, rootNote), buildProjectMemory(vars, LANG))

  // Criar notas de sessoes
  if (!isLivre) {
    const sessionsDir = isEN ? 'Sessions' : 'Sessoes'
    const sessionsIndex = isEN ? 'Sessions - Temporal Memory.md' : 'Sessoes - Memoria Temporal.md'
    writeFileSync(join(vaultPath, sessionsDir, sessionsIndex), buildSessionsIndex(LANG))

    // Decisoes
    const decisoesDir = isEN ? 'Decisions' : 'Decisoes'
    const lockedFile = isEN ? 'Locked Definitions.md' : 'Definicoes Travadas.md'
    writeFileSync(join(vaultPath, decisoesDir, lockedFile), buildLockedDefinitions(LANG))

    // Demais notas vazias (estrutura minima)
    const emptyNotes = isEN ? [
      { dir: 'Decisions', file: 'Open Questions.md', title: 'Open Questions', tags: '#decisions', callout: 'Items requiring definition before implementing' },
      { dir: 'Decisions', file: 'Anti-patterns.md', title: 'Anti-patterns', tags: '#decisions', callout: 'What NEVER to do in this project' },
      { dir: 'Domain', file: 'Domain Glossary.md', title: 'Domain Glossary', tags: '#domain', callout: 'Business terms' },
      { dir: 'Domain', file: 'Entities.md', title: 'Entities', tags: '#domain #schema', callout: 'Real database fields — check before coding' },
      { dir: 'Architecture', file: 'Code Patterns.md', title: 'Code Patterns', tags: '#architecture', callout: 'Real examples — copy, do not invent' },
      { dir: 'Architecture', file: 'Module Map.md', title: 'Module Map', tags: '#architecture', callout: 'Who does what — module dependencies' },
      { dir: 'Architecture', file: 'Test Strategy.md', title: 'Test Strategy', tags: '#architecture', callout: 'How to test in this project — tests are mandatory' },
      { dir: 'Architecture', file: 'API Contracts.md', title: 'API Contracts', tags: '#architecture', callout: 'Endpoints exposed by the system' },
      { dir: 'Architecture', file: 'Architecture Decisions.md', title: 'Architecture Decisions', tags: '#architecture #adr', callout: 'ADRs — Architecture Decision Records' },
      { dir: 'Architecture', file: 'Integrations.md', title: 'Integrations', tags: '#architecture', callout: 'External services consumed by the system' },
      { dir: 'Architecture', file: 'Clean Architecture.md', title: 'Clean Architecture', tags: '#architecture', callout: 'Clean Architecture principles applied to the project' },
      { dir: 'Business Rules', file: 'General Rules.md', title: 'General Rules', tags: '#rules', callout: 'Validated rules that govern the system' },
    ] : [
      { dir: 'Decisoes', file: 'Questoes em Aberto.md', title: 'Questoes em Aberto', tags: '#decisoes', callout: 'Itens que precisam de definicao antes de implementar' },
      { dir: 'Decisoes', file: 'Anti-patterns.md', title: 'Anti-patterns', tags: '#decisoes', callout: 'O que NUNCA fazer neste projeto' },
      { dir: 'Dominio', file: 'Glossario de Dominio.md', title: 'Glossario de Dominio', tags: '#dominio', callout: 'Termos do negocio' },
      { dir: 'Dominio', file: 'Entidades.md', title: 'Entidades', tags: '#dominio #schema', callout: 'Campos reais do banco — consultar antes de codar' },
      { dir: 'Arquitetura', file: 'Padroes de Codigo.md', title: 'Padroes de Codigo', tags: '#arquitetura', callout: 'Exemplos reais — copiar, nao inventar' },
      { dir: 'Arquitetura', file: 'Mapa de Modulos.md', title: 'Mapa de Modulos', tags: '#arquitetura', callout: 'Quem faz o que — dependencias entre modulos' },
      { dir: 'Arquitetura', file: 'Estrategia de Testes.md', title: 'Estrategia de Testes', tags: '#arquitetura', callout: 'Como testar neste projeto — testes obrigatorios' },
      { dir: 'Arquitetura', file: 'Contratos API.md', title: 'Contratos API', tags: '#arquitetura', callout: 'Endpoints que o sistema expoe' },
      { dir: 'Arquitetura', file: 'Decisoes de Arquitetura.md', title: 'Decisoes de Arquitetura', tags: '#arquitetura #adr', callout: 'ADRs — Architectural Decision Records' },
      { dir: 'Arquitetura', file: 'Integracoes.md', title: 'Integracoes', tags: '#arquitetura', callout: 'Servicos externos consumidos pelo sistema' },
      { dir: 'Arquitetura', file: 'Clean Architecture.md', title: 'Clean Architecture', tags: '#arquitetura', callout: 'Principios de Clean Architecture aplicados ao projeto' },
      { dir: 'Regras de Negocio', file: 'Regras Gerais.md', title: 'Regras Gerais', tags: '#regras', callout: 'Regras validadas que governam o sistema' },
    ]

    for (const note of emptyNotes) {
      writeFileSync(
        join(vaultPath, note.dir, note.file),
        buildEmptyNote(note.title, note.tags, note.callout, LANG)
      )
    }
  }

  console.log(`  ✓ Vault criado em ./cortex/`)
}
