import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES = join(__dirname, '..', 'templates')

// --- Estruturas de diretórios ---

const DIRS = {
  pt: {
    projeto: [
      'Decisoes',
      'Dominio',
      'Arquitetura',
      'Regras de Negocio',
      'Sessoes',
      'Sessoes/timeline',
      'Sessoes/contextos',
    ],
    livre: [
      'Sessoes/timeline',
      'Sessoes/contextos',
    ],
  },
  en: {
    projeto: [
      'Decisions',
      'Domain',
      'Architecture',
      'Business Rules',
      'Sessions',
      'Sessions/timeline',
      'Sessions/contexts',
    ],
    livre: [
      'Sessions/timeline',
      'Sessions/contexts',
    ],
  },
}

// --- Builders ---

function buildLivreRoot(vars, lang) {
  const isEN = lang === 'en'
  return `# ${vars.NAME}

${isEN ? '#project' : '#projeto'}

---

## ${isEN ? 'About' : 'Sobre'}

${vars.DESCRIPTION}

| ${isEN ? 'Field' : 'Campo'} | ${isEN ? 'Value' : 'Valor'} |
|-------|-------|
| **Stack** | ${vars.STACK} |
| **${isEN ? 'Started' : 'Inicio'}** | ${vars.DATE} |

---

## ${isEN ? 'How to use' : 'Como usar'}

\`\`\`
cortex start [contexto]   ${isEN ? '→ opens session, loads context' : '→ abre sessao, carrega contexto'}
cortex end                ${isEN ? '→ saves session to timeline' : '→ salva sessao na timeline'}
cortex context <nome>     ${isEN ? '→ creates a new context island' : '→ cria uma ilha de contexto'}
\`\`\`
`
}

function buildProjectMemory(vars, lang) {
  const isEN = lang === 'en'
  const links = isEN
    ? { entities: 'Entities', patterns: 'Code Patterns', anti: 'Anti-patterns', modules: 'Module Map', tests: 'Test Strategy', locked: 'Locked Definitions', open: 'Open Questions', rules: 'General Rules' }
    : { entities: 'Entidades', patterns: 'Padroes de Codigo', anti: 'Anti-patterns', modules: 'Mapa de Modulos', tests: 'Estrategia de Testes', locked: 'Definicoes Travadas', open: 'Questoes em Aberto', rules: 'Regras Gerais' }

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
1. [[${links.entities}]] — ${isEN ? 'real fields exist?' : 'campos reais existem?'}
2. [[${links.patterns}]] — ${isEN ? 'how is it done here?' : 'como e feito aqui?'}
3. [[${links.anti}]] — ${isEN ? 'what not to do?' : 'o que nao fazer?'}
4. [[${links.modules}]] — ${isEN ? 'already exists?' : 'ja existe?'}
5. [[${links.tests}]] — ${isEN ? 'how to test?' : 'como testar?'}

**${isEN ? 'To decide:' : 'Para decidir:'}**
6. [[${links.locked}]] — ${isEN ? 'already decided?' : 'ja foi decidido?'}
7. [[${links.open}]] — ${isEN ? 'not decided yet?' : 'ainda nao foi decidido?'}
8. [[${links.rules}]] — ${isEN ? 'what is the formula/logic?' : 'qual a formula/logica?'}
`
}

function buildLockedDefinitions(lang) {
  const isEN = lang === 'en'
  const back = isEN ? 'Project Memory' : 'Memoria Projeto'
  return `# ${isEN ? 'Locked Definitions' : 'Definicoes Travadas'}

${isEN ? '#decisions' : '#decisoes'}

> [!abstract] ${isEN ? 'Confirmed rules — do not change without explicit review' : 'Regras confirmadas — nao alterar sem revisao explicita'}

> [!tip] ${isEN
    ? '**Locked Definitions** = what was decided (choices that do not change)\n> **Business Rules** = how it works (formulas, logic, calculations)'
    : '**Definicoes Travadas** = o que foi decidido (escolhas que nao mudam)\n> **Regras de Negocio** = como funciona (formulas, logica, calculos)'}

${isEN ? 'Back' : 'Voltar'}: [[${back}]]

---

| ${isEN ? 'Decision' : 'Decisao'} | ${isEN ? 'Definition' : 'Definicao'} | ${isEN ? 'Date' : 'Data'} |
|---------|-----------|------|
`
}

function buildSessionsIndex(lang) {
  const isEN = lang === 'en'
  const back = isEN ? 'Project Memory' : 'Memoria Projeto'
  return `# ${isEN ? 'Sessions — Temporal Memory' : 'Sessoes — Memoria Temporal'}

${isEN ? '#sessions #moc' : '#sessoes #moc'}

> [!abstract] ${isEN ? 'The chronological brain of the project' : 'O cerebro cronologico do projeto'}

${isEN ? 'Back' : 'Voltar'}: [[${back}]]

---

## ${isEN ? 'Registered sessions' : 'Sessoes registradas'}

| ${isEN ? 'Date' : 'Data'} | ${isEN ? 'Session' : 'Sessao'} | ${isEN ? 'Focus' : 'Foco'} |
|------|--------|------|
`
}

function buildEmptyNote(title, tags, callout, back, lang) {
  const isEN = lang === 'en'
  return `# ${title}

${tags}

> [!abstract] ${callout}

${isEN ? 'Back' : 'Voltar'}: [[${back}]]

---

_(${isEN ? 'fill in as the project evolves' : 'preencher conforme o projeto evolui'})_
`
}

function buildManifesto(lang) {
  const isEN = lang === 'en'
  return `# ${isEN ? 'Manifesto' : 'Manifesto'}

${isEN ? '#framework #philosophy' : '#framework #filosofia'}

---

## ${isEN ? 'The problem' : 'O problema'}

${isEN
    ? 'AI hallucinates because it lacks context. It invents fields that do not exist, ignores validated rules, duplicates logic, breaks patterns. The larger the project grows, the worse it gets — because AI forgets everything each conversation.'
    : 'AI alucina porque nao tem contexto. Inventa campos que nao existem, ignora regras validadas, duplica logica, quebra padroes. Quanto mais o projeto cresce, pior fica — porque o AI esquece tudo a cada conversa.'}

## ${isEN ? 'The solution' : 'A solucao'}

${isEN
    ? 'Structure project context so that AI (or any engineer) can produce precise, consistent code aligned with team decisions.'
    : 'Estruturar o contexto do projeto de forma que o AI (ou qualquer engenheiro) consiga produzir codigo preciso, consistente e alinhado com as decisoes do time.'}

## ${isEN ? 'Principles' : 'Principios'}

1. **${isEN ? 'Vault > memory > code' : 'Vault > memoria > codigo'}** — ${isEN ? 'always consult the vault before implementing' : 'sempre consultar o vault antes de implementar'}
2. **${isEN ? 'Mandatory tests' : 'Testes obrigatorios'}** — ${isEN ? 'code without tests does not exist' : 'codigo sem teste nao existe'}
3. **${isEN ? 'Do not guess' : 'Nao adivinhar'}** — ${isEN ? 'if not decided, ask' : 'se nao esta decidido, perguntar'}
4. **${isEN ? 'Do not duplicate' : 'Nao duplicar'}** — ${isEN ? 'if it already exists, reuse it' : 'se ja existe, reutilizar'}
5. **${isEN ? 'Do not re-discuss' : 'Nao rediscutir'}** — ${isEN ? 'if locked, respect it' : 'se esta travado, respeitar'}
`
}

function buildHealthCheck(lang) {
  const isEN = lang === 'en'
  const back = isEN ? 'Project Memory' : 'Memoria Projeto'
  return `# ${isEN ? 'Health Check' : 'Health Check'}

${isEN ? '#framework #health' : '#framework #saude'}

> [!abstract] ${isEN ? 'Is the vault healthy?' : 'O vault esta saudavel?'}

${isEN ? 'Back' : 'Voltar'}: [[${back}]]

---

| ${isEN ? 'Question' : 'Pergunta'} | ${isEN ? 'Note' : 'Nota'} |
|----------|------|
| ${isEN ? 'AI knows what the project does?' : 'AI sabe o que o projeto faz?'} | [[${isEN ? 'Project Memory' : 'Memoria Projeto'}]] |
| ${isEN ? 'AI speaks the right language?' : 'AI fala a lingua certa?'} | [[${isEN ? 'Domain Glossary' : 'Glossario de Dominio'}]] |
| ${isEN ? 'AI knows the database fields?' : 'AI sabe os campos do banco?'} | [[${isEN ? 'Entities' : 'Entidades'}]] |
| ${isEN ? 'AI knows the code pattern?' : 'AI sabe o padrao de codigo?'} | [[${isEN ? 'Code Patterns' : 'Padroes de Codigo'}]] |
| ${isEN ? 'AI knows what NOT to do?' : 'AI sabe o que NAO fazer?'} | [[Anti-patterns]] |
| ${isEN ? 'AI knows the rules?' : 'AI sabe as regras?'} | [[${isEN ? 'General Rules' : 'Regras Gerais'}]] |
| ${isEN ? 'AI knows what was decided?' : 'AI sabe o que ja decidiu?'} | [[${isEN ? 'Locked Definitions' : 'Definicoes Travadas'}]] |
| ${isEN ? 'AI knows what is pending?' : 'AI sabe o que falta decidir?'} | [[${isEN ? 'Open Questions' : 'Questoes em Aberto'}]] |
| ${isEN ? 'AI knows where each module lives?' : 'AI sabe onde mora cada modulo?'} | [[${isEN ? 'Module Map' : 'Mapa de Modulos'}]] |
| ${isEN ? 'AI knows how to test?' : 'AI sabe como testar?'} | [[${isEN ? 'Test Strategy' : 'Estrategia de Testes'}]] |
`
}

function buildChangelog(lang) {
  const isEN = lang === 'en'
  const back = isEN ? 'Project Memory' : 'Memoria Projeto'
  return `# Changelog

${isEN ? '#changelog' : '#changelog'}

> [!abstract] ${isEN ? 'Release history and milestones' : 'Historico de versoes e marcos'}

${isEN ? 'Back' : 'Voltar'}: [[${back}]]

---

## [Unreleased]

### ${isEN ? 'Added' : 'Adicionado'}
-

### ${isEN ? 'Changed' : 'Alterado'}
-

---

## [v0.1.0] — ${new Date().toISOString().split('T')[0]}

- ${isEN ? 'Project initialized with Cortex' : 'Projeto inicializado com Cortex'}
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

// --- Main ---

export function createVault(vars) {
  const { LANG, MODE } = vars
  const vaultPath = join(process.cwd(), '.cortex')
  const isEN = LANG === 'en'
  const isLivre = MODE === 'Freestyled' || MODE === 'Livre' || MODE === 'Free'
  const dirs = DIRS[isEN ? 'en' : 'pt'][isLivre ? 'livre' : 'projeto']
  const back = isEN ? 'Project Memory' : 'Memoria Projeto'

  // Criar diretório raiz + subdiretórios
  mkdirSync(vaultPath, { recursive: true })
  for (const dir of dirs) {
    mkdirSync(join(vaultPath, dir), { recursive: true })
  }

  // Arquivos base (ambos os modos)
  writeFileSync(join(vaultPath, '.gitignore'), '# Obsidian\n.obsidian/\n.trash/\n')
  writeFileSync(join(vaultPath, '.spec.md'), buildSpec(vars))

  // --- Modo Livre ---
  if (isLivre) {
    const rootFile = isEN ? 'Project.md' : 'Projeto.md'
    writeFileSync(join(vaultPath, rootFile), buildLivreRoot(vars, LANG))
    console.log('  ✓ Vault criado em .cortex/')
    return
  }

  // --- Modo Projeto ---

  // Nota raiz
  writeFileSync(join(vaultPath, isEN ? 'Project Memory.md' : 'Memoria Projeto.md'), buildProjectMemory(vars, LANG))

  // Notas raiz extras
  writeFileSync(join(vaultPath, 'MANIFESTO.md'), buildManifesto(LANG))
  writeFileSync(join(vaultPath, 'Health Check.md'), buildHealthCheck(LANG))
  writeFileSync(join(vaultPath, 'Changelog.md'), buildChangelog(LANG))
  writeFileSync(join(vaultPath, isEN ? 'Technical FAQ.md' : 'FAQ Tecnico.md'),
    buildEmptyNote(isEN ? 'Technical FAQ' : 'FAQ Tecnico', isEN ? '#faq' : '#faq', isEN ? 'Frequently asked questions' : 'Perguntas frequentes', back, LANG))
  writeFileSync(join(vaultPath, 'Getting Started.md'),
    buildEmptyNote('Getting Started', '#framework #onboarding', isEN ? '3 modes, 1 principle: nothing is lost' : '3 modos, 1 principio: nada se perde', back, LANG))

  // Sessoes
  const sessDir = isEN ? 'Sessions' : 'Sessoes'
  const sessIndex = isEN ? 'Sessions - Temporal Memory.md' : 'Sessoes - Memoria Temporal.md'
  writeFileSync(join(vaultPath, sessDir, sessIndex), buildSessionsIndex(LANG))

  // Decisoes
  const decDir = isEN ? 'Decisions' : 'Decisoes'
  writeFileSync(join(vaultPath, decDir, isEN ? 'Locked Definitions.md' : 'Definicoes Travadas.md'), buildLockedDefinitions(LANG))
  writeFileSync(join(vaultPath, decDir, isEN ? 'Open Questions.md' : 'Questoes em Aberto.md'),
    buildEmptyNote(isEN ? 'Open Questions' : 'Questoes em Aberto', isEN ? '#decisions' : '#decisoes', isEN ? 'Items requiring definition before implementing' : 'Itens que precisam de definicao antes de implementar', back, LANG))
  writeFileSync(join(vaultPath, decDir, 'Anti-patterns.md'),
    buildEmptyNote('Anti-patterns', isEN ? '#decisions' : '#decisoes', isEN ? 'What NEVER to do in this project' : 'O que NUNCA fazer neste projeto', back, LANG))

  // Dominio
  const domDir = isEN ? 'Domain' : 'Dominio'
  writeFileSync(join(vaultPath, domDir, isEN ? 'Domain Glossary.md' : 'Glossario de Dominio.md'),
    buildEmptyNote(isEN ? 'Domain Glossary' : 'Glossario de Dominio', isEN ? '#domain' : '#dominio', isEN ? 'Business terms' : 'Termos do negocio', back, LANG))
  writeFileSync(join(vaultPath, domDir, isEN ? 'Entities.md' : 'Entidades.md'),
    buildEmptyNote(isEN ? 'Entities' : 'Entidades', isEN ? '#domain #schema' : '#dominio #schema', isEN ? 'Real database fields — check before coding' : 'Campos reais do banco — consultar antes de codar', back, LANG))

  // Arquitetura
  const archDir = isEN ? 'Architecture' : 'Arquitetura'
  const archNotes = isEN ? [
    { file: 'Code Patterns.md', title: 'Code Patterns', tags: '#architecture', callout: 'Real examples — copy, do not invent' },
    { file: 'Module Map.md', title: 'Module Map', tags: '#architecture', callout: 'Who does what — module dependencies' },
    { file: 'Test Strategy.md', title: 'Test Strategy', tags: '#architecture', callout: 'How to test in this project — tests are mandatory' },
    { file: 'API Contracts.md', title: 'API Contracts', tags: '#architecture', callout: 'Endpoints exposed by the system (back → front)' },
    { file: 'Architecture Decisions.md', title: 'Architecture Decisions', tags: '#architecture #adr', callout: 'ADRs — Architecture Decision Records' },
    { file: 'Integrations.md', title: 'Integrations', tags: '#architecture', callout: 'External services consumed by the system' },
    { file: 'Clean Architecture.md', title: 'Clean Architecture', tags: '#architecture', callout: 'Clean Architecture principles applied to the project' },
  ] : [
    { file: 'Padroes de Codigo.md', title: 'Padroes de Codigo', tags: '#arquitetura', callout: 'Exemplos reais — copiar, nao inventar' },
    { file: 'Mapa de Modulos.md', title: 'Mapa de Modulos', tags: '#arquitetura', callout: 'Quem faz o que — dependencias entre modulos' },
    { file: 'Estrategia de Testes.md', title: 'Estrategia de Testes', tags: '#arquitetura', callout: 'Como testar neste projeto — testes obrigatorios' },
    { file: 'Contratos API.md', title: 'Contratos API', tags: '#arquitetura', callout: 'Endpoints que o sistema expoe (back → front)' },
    { file: 'Decisoes de Arquitetura.md', title: 'Decisoes de Arquitetura', tags: '#arquitetura #adr', callout: 'ADRs — Architectural Decision Records' },
    { file: 'Integracoes.md', title: 'Integracoes', tags: '#arquitetura', callout: 'Servicos externos consumidos pelo sistema' },
    { file: 'Clean Architecture.md', title: 'Clean Architecture', tags: '#arquitetura', callout: 'Principios de Clean Architecture aplicados ao projeto' },
  ]

  for (const note of archNotes) {
    writeFileSync(join(vaultPath, archDir, note.file), buildEmptyNote(note.title, note.tags, note.callout, back, LANG))
  }

  // Regras de negocio
  const rulesDir = isEN ? 'Business Rules' : 'Regras de Negocio'
  writeFileSync(join(vaultPath, rulesDir, isEN ? 'General Rules.md' : 'Regras Gerais.md'),
    buildEmptyNote(isEN ? 'General Rules' : 'Regras Gerais', isEN ? '#rules' : '#regras', isEN ? 'Validated rules that govern the system' : 'Regras validadas que governam o sistema', back, LANG))

  console.log('  ✓ Vault criado em .cortex/')
}
