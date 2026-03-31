#!/usr/bin/env node

import { select, input, confirm, checkbox } from '@inquirer/prompts'
import { detectAiTools, vaultExists, detectVaultMode, detectVaultLang } from '../src/detect.js'
import { installClaudeCode, installCursor, installCopilot, updateGitignore } from '../src/install.js'
import { createVault, migrateVault, archiveVault, readFreestyledRoot } from '../src/vault.js'

console.log()
console.log('  ╔══════════════════════════════════════╗')
console.log('  ║   Cortex — AI Memory Framework       ║')
console.log('  ║   Contexto persistente para AI       ║')
console.log('  ╚══════════════════════════════════════╝')
console.log()
console.log(`  Projeto: ${process.cwd()}`)
console.log()

// ── Idioma ────────────────────────────────────────────────────────────────

const lang = await select({
  message: 'Idioma do vault:',
  default: 'pt',
  choices: [
    { name: 'PT  —  Portugues', value: 'pt' },
    { name: 'EN  —  English',   value: 'en' },
  ],
})

console.log()

// ── Vault existente ───────────────────────────────────────────────────────

let isMigrate   = false  // true = migrateVault (preserva sessoes)
let isReinit    = false  // true = archiveVault + createVault
let prefill     = {}     // defaults pre-preenchidos para migracao

if (vaultExists()) {
  const currentMode = detectVaultMode()
  console.log(`  Vault ${currentMode} detectado em .cortex/`)
  console.log()

  const choices = [
    {
      name:  'Iniciar novo projeto  —  arquiva vault atual e comeca do zero',
      value: 'new',
      description: '  O vault atual vai para .cortex/Anterior/ e um novo e criado no lugar.',
    },
  ]

  if (currentMode === 'Freestyled') {
    choices.push({
      name:  'Migrar para modo Projeto  —  preserva sessoes e contextos',
      value: 'migrate',
      description: '  Adiciona estrutura Projeto ao vault. Sessoes e timeline preservados.',
    })
  }

  choices.push(
    {
      name:  'Configurar AI tools  —  adicionar ou atualizar CLAUDE.md, cursor rules, copilot',
      value: 'tools',
    },
    { name: 'Sair', value: 'exit' },
  )

  const action = await select({ message: 'O que deseja fazer?', choices })

  if (action === 'exit') {
    console.log()
    process.exit(0)
  }

  if (action === 'tools') {
    console.log()
    const detectedTools = detectAiTools()
    if (detectedTools.length > 0) {
      console.log(`  Detectado no ambiente: ${detectedTools.join(', ')}`)
      console.log()
    }
    const toolsToInstall = await checkbox({
      message: 'Quais AI tools configurar?',
      instructions: '  Espaco para selecionar · Enter para confirmar',
      choices: [
        { name: 'Claude Code  →  cria/atualiza CLAUDE.md',                       value: 'Claude Code', checked: detectedTools.includes('Claude Code') },
        { name: 'Cursor       →  cria/atualiza .cursor/rules/',                  value: 'Cursor',      checked: detectedTools.includes('Cursor') },
        { name: 'Copilot      →  cria/atualiza .github/copilot-instructions.md', value: 'Copilot',     checked: detectedTools.includes('Copilot') },
      ],
    })
    console.log()
    console.log('  Configurando...')
    console.log()
    if (toolsToInstall.includes('Claude Code')) installClaudeCode(lang)
    if (toolsToInstall.includes('Cursor'))      installCursor(lang)
    if (toolsToInstall.includes('Copilot'))     installCopilot(lang)
    console.log()
    console.log('  ✦ Pronto!')
    console.log()
    process.exit(0)
  }

  if (action === 'migrate') {
    isMigrate = true
    // Pre-preencher com dados do vault existente
    const existingLang = detectVaultLang()
    prefill = readFreestyledRoot(existingLang)
  } else {
    // action === 'new'
    isReinit = true
  }

  console.log()
}

// ── Confirmacao (apenas novo vault sem vault existente) ───────────────────

if (!isReinit && !isMigrate && !vaultExists()) {
  const ok = await confirm({
    message: `Inicializar vault em ${process.cwd()}/.cortex/ ?`,
    default: true,
  })
  if (!ok) {
    console.log()
    console.log('  Operacao cancelada.')
    console.log('  Navegue ate a pasta do projeto e rode novamente.')
    console.log()
    process.exit(0)
  }
  console.log()
}

// ── AI Tools ──────────────────────────────────────────────────────────────

const detected = detectAiTools()
if (detected.length > 0) {
  console.log(`  Detectado no ambiente: ${detected.join(', ')}`)
  console.log()
}

const aiTools = await checkbox({
  message: 'Quais AI tools configurar?',
  instructions: '  Espaco para selecionar · Enter para confirmar',
  choices: [
    {
      name: 'Claude Code  →  cria CLAUDE.md com protocolo e comandos cortex',
      value: 'Claude Code',
      checked: detected.includes('Claude Code'),
    },
    {
      name: 'Cursor       →  cria .cursor/rules/ com protocol, start e end',
      value: 'Cursor',
      checked: detected.includes('Cursor'),
    },
    {
      name: 'Copilot      →  cria .github/copilot-instructions.md',
      value: 'Copilot',
      checked: detected.includes('Copilot'),
    },
  ],
})

if (aiTools.length === 0) {
  console.log()
  console.log('  Nenhuma ferramenta selecionada.')
  console.log('  O vault sera criado sem configuracao de AI tool.')
}

console.log()

// ── Projeto ───────────────────────────────────────────────────────────────

const name = await input({
  message: 'Nome do projeto:',
  default: prefill.name || undefined,
  validate: (v) => v.trim().length > 0 || 'Campo obrigatorio',
})

const description = await input({
  message: 'Descreva brevemente o projeto:',
  default: prefill.description || undefined,
  validate: (v) => v.trim().length > 0 || 'Campo obrigatorio',
})

// ── Stack ─────────────────────────────────────────────────────────────────

const projectType = await select({
  message: 'Tipo de projeto:',
  choices: [
    { name: 'Fullstack   —  frontend + backend', value: 'fullstack' },
    { name: 'Backend     —  API, servico, CLI, worker', value: 'backend' },
    { name: 'Frontend    —  interface, SPA, app', value: 'frontend' },
  ],
})

async function pickFront() {
  const choice = await select({
    message: 'Frontend:',
    choices: [
      { name: 'React', value: 'React' },
      { name: 'Angular', value: 'Angular' },
      { name: 'Vue', value: 'Vue' },
      { name: 'Outra  —  descrever', value: 'other' },
      { name: 'Ainda nao sei', value: 'tbd' },
    ],
  })
  if (choice === 'other') {
    return await input({ message: 'Descreva o frontend:', validate: (v) => v.trim().length > 0 || 'Campo obrigatorio' })
  }
  return choice === 'tbd' ? 'a definir' : choice
}

async function pickBack() {
  const choice = await select({
    message: 'Backend:',
    choices: [
      { name: 'Node.js', value: 'Node.js' },
      { name: 'Java', value: 'Java' },
      { name: 'Go', value: 'Go' },
      { name: 'Outra  —  descrever', value: 'other' },
      { name: 'Ainda nao sei', value: 'tbd' },
    ],
  })
  if (choice === 'other') {
    return await input({ message: 'Descreva o backend:', validate: (v) => v.trim().length > 0 || 'Campo obrigatorio' })
  }
  return choice === 'tbd' ? 'a definir' : choice
}

let stack = ''
if (projectType === 'fullstack') {
  const front = await pickFront()
  const back  = await pickBack()
  stack = `${front} + ${back}`
} else if (projectType === 'frontend') {
  stack = await pickFront()
} else {
  stack = await pickBack()
}

console.log()

// ── Modo ──────────────────────────────────────────────────────────────────

const mode = await select({
  message: 'Modo do vault:',
  default: isMigrate ? 'Projeto' : 'Freestyled',
  choices: [
    {
      name: 'Freestyled  ✦  minimo e organico — timeline + contextos. Cresce com o uso.',
      value: 'Freestyled',
      description: '  Recomendado para projetos do dia a dia. Zero configuracao inicial.',
    },
    {
      name: 'Projeto     ✦  vault completo — decisoes, arquitetura, entidades, testes.',
      value: 'Projeto',
      description: '  Para projetos com estrutura definida, time, ou spec/PRD.',
    },
  ],
})

// ── Boas praticas (Freestyled) ────────────────────────────────────────────

let practices = []
if (mode === 'Freestyled') {
  const isFront = projectType === 'frontend'
  const isBack  = projectType === 'backend'
  const isEN    = lang === 'en'

  const desc = {
    tests: isFront
      ? (isEN ? 'Jest + Testing Library · test behavior, not implementation'
               : 'Jest + Testing Library · testar comportamento, nao implementacao')
      : isBack
      ? (isEN ? 'Jest/Vitest · unit tests for services, integration tests for endpoints'
               : 'Jest/Vitest · unit tests para services, integration tests para endpoints')
      : (isEN ? 'Front: Testing Library · Back: Jest/Vitest + integration tests'
               : 'Front: Testing Library · Back: Jest/Vitest + integration tests'),

    clean: isFront
      ? (isEN ? 'Presentational vs container components · hooks extract logic · services for API calls'
               : 'Presentational vs container · hooks extraem logica · services para chamadas API')
      : isBack
      ? (isEN ? 'Controller → Service → Repository · no business logic in controllers · single responsibility per layer'
               : 'Controller → Service → Repository · sem logica de negocio no controller · responsabilidade unica por camada')
      : (isEN ? 'Front: component layers · Back: service/repository layers · shared: no logic leaking between layers'
               : 'Front: camadas de componente · Back: camadas service/repo · compartilhado: sem vazamento entre camadas'),

    solid: isEN
      ? 'S: one reason to change · O: extend without modifying · L: subtypes are interchangeable · I: specific interfaces · D: depend on abstractions'
      : 'S: uma razao para mudar · O: estender sem modificar · L: subtipos intercambiaveis · I: interfaces especificas · D: depender de abstracoes',
  }

  console.log()
  practices = await checkbox({
    message: 'Boas praticas a adotar? (opcional — Enter para pular)',
    instructions: '  Espaco para selecionar · Enter para confirmar',
    choices: [
      { name: isEN ? 'Unit tests'                 : 'Testes unitarios',         value: 'tests', description: `  ${desc.tests}` },
      { name: 'Clean Architecture + Clean Code',                                 value: 'clean', description: `  ${desc.clean}` },
      { name: isEN ? 'SOLID Principles'           : 'Principios SOLID',         value: 'solid', description: `  ${desc.solid}` },
    ],
  })
}

let hasSpec = false
if (mode === 'Projeto') {
  console.log()
  hasSpec = await confirm({
    message: 'Tem spec, PRD ou doc existente para importar?',
    default: false,
  })
}

const vars = {
  NAME: name.trim(),
  DESCRIPTION: description.trim(),
  STACK: stack.trim(),
  MODE: mode,
  LANG: lang,
  PRACTICES: practices,
  PROJECT_TYPE: projectType,
  DATE: new Date().toISOString().split('T')[0],
}

// ── Instalando ────────────────────────────────────────────────────────────

console.log()
console.log('  Configurando...')
console.log()

if (aiTools.includes('Claude Code')) installClaudeCode(lang)
if (aiTools.includes('Cursor'))      installCursor(lang)
if (aiTools.includes('Copilot'))     installCopilot(lang)

const archiveDate = vars.DATE

if (isMigrate) {
  migrateVault(vars)
} else {
  if (isReinit) {
    try {
      archiveVault(archiveDate)
    } catch (err) {
      console.error()
      console.error('  ✗ Falha ao arquivar vault anterior:', err.message)
      console.error('  Abortando para nao corromper o vault.')
      console.error()
      process.exit(1)
    }
  }
  createVault(vars)
}

updateGitignore()

// ── Pronto ────────────────────────────────────────────────────────────────

console.log()
console.log('  ✦ Tudo pronto!')
console.log()

if (isMigrate) {
  console.log('  Vault migrado em  →  ./.cortex/')
  console.log(`  Memoria referencia o [[${lang === 'en' ? 'Project' : 'Projeto'}]] original.`)
} else {
  console.log('  Vault criado em  →  ./.cortex/')
  if (isReinit) console.log(`  Anterior em      →  ./.cortex/Anterior/${archiveDate}/`)
}

console.log('  Abra no Obsidian →  File > Open Vault > .cortex/')
console.log()

if (aiTools.length > 0) {
  console.log('  Como comecar:')
  if (aiTools.includes('Claude Code')) console.log('  · Claude Code  →  diga "cortex start"')
  if (aiTools.includes('Cursor'))      console.log('  · Cursor       →  diga "cortex start" no chat')
  if (aiTools.includes('Copilot'))     console.log('  · Copilot      →  diga "cortex start" no chat')
  console.log()
}

if (hasSpec) {
  console.log('  Para importar seu spec/PRD:')
  console.log('  Diga "cortex start", cole o documento e peca para distribuir no vault.')
  console.log()
}
