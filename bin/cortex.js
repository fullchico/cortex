#!/usr/bin/env node

import { select, input, confirm, checkbox } from '@inquirer/prompts'
import { detectAiTools, vaultExists, detectVaultMode, detectVaultLang } from '../src/detect.js'
import { installClaudeCode, installCursor, installCopilot, updateGitignore } from '../src/install.js'
import { createVault, migrateVault, readFreestyledRoot } from '../src/vault.js'

console.log()
console.log('  ╔══════════════════════════════════════╗')
console.log('  ║   Cortex — AI Memory Framework       ║')
console.log('  ║   Contexto persistente para AI       ║')
console.log('  ╚══════════════════════════════════════╝')
console.log()
console.log(`  Projeto: ${process.cwd()}`)
console.log()

if (vaultExists()) {
  const currentMode = detectVaultMode()

  if (currentMode === 'Freestyled') {
    console.log('  Vault Freestyled detectado em .cortex/')
    console.log()

    const upgrade = await confirm({
      message: 'Migrar para modo Projeto?',
      default: false,
    })

    if (!upgrade) {
      console.log()
      console.log('  Vault Freestyled mantido.')
      console.log()
      process.exit(0)
    }

    console.log()

    // Ler info existente do vault como defaults
    const existingLang = detectVaultLang()
    const existing = readFreestyledRoot(existingLang)

    const migName = await input({
      message: 'Nome do projeto:',
      default: existing.name || undefined,
      validate: (v) => v.trim().length > 0 || 'Campo obrigatorio',
    })

    const migDescription = await input({
      message: 'Descricao em 1 frase:',
      default: existing.description || undefined,
      validate: (v) => v.trim().length > 0 || 'Campo obrigatorio',
    })

    const migStack = await input({
      message: 'Stack principal:',
      default: existing.stack || 'ainda nao sei',
    })

    const migLang = await select({
      message: 'Idioma do vault:',
      default: existingLang,
      choices: [
        { name: 'PT  —  Portugues', value: 'pt' },
        { name: 'EN  —  English',   value: 'en' },
      ],
    })

    const migVars = {
      NAME: migName.trim(),
      DESCRIPTION: migDescription.trim(),
      STACK: migStack.trim(),
      MODE: 'Projeto',
      LANG: migLang,
      DATE: new Date().toISOString().split('T')[0],
    }

    console.log()
    console.log('  Migrando...')
    console.log()

    migrateVault(migVars)

    console.log()
    console.log('  ✦ Migrado para modo Projeto!')
    console.log()
    console.log('  Sessoes e contextos existentes preservados.')
    console.log(`  Memoria Projeto.md referencia o [[${migLang === 'en' ? 'Project' : 'Projeto'}]] original.`)
    console.log()
    process.exit(0)
  }

  console.log('  ⚠  Vault Projeto ja existe em .cortex/')
  console.log()
  console.log('  Para reiniciar, remova .cortex/ e rode novamente.')
  console.log()
  process.exit(0)
}

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
  validate: (v) => v.trim().length > 0 || 'Campo obrigatorio',
})

const description = await input({
  message: 'Descricao em 1 frase:',
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

const lang = await select({
  message: 'Idioma do vault:',
  choices: [
    { name: 'PT  —  Portugues', value: 'pt' },
    { name: 'EN  —  English',   value: 'en' },
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
      { name: isEN ? 'Unit tests'                      : 'Testes unitarios',              value: 'tests', description: `  ${desc.tests}` },
      { name: 'Clean Architecture + Clean Code',                                           value: 'clean', description: `  ${desc.clean}` },
      { name: isEN ? 'SOLID Principles'                : 'Principios SOLID',              value: 'solid', description: `  ${desc.solid}` },
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

createVault(vars)
updateGitignore()

// ── Pronto ────────────────────────────────────────────────────────────────

console.log()
console.log('  ✦ Tudo pronto!')
console.log()
console.log('  Vault criado em  →  ./.cortex/')
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
