#!/usr/bin/env node

import { select, input, confirm } from '@inquirer/prompts'
import { detectAiTools, vaultExists } from '../src/detect.js'
import { installClaudeCode, installCursor, installCopilot, updateGitignore } from '../src/install.js'
import { createVault } from '../src/vault.js'

console.log('\n  Cortex — AI Memory Framework\n')

if (vaultExists()) {
  console.log('  ⚠  Vault ja existe em ./cortex/\n')
  console.log('  Para reiniciar, remova a pasta ./cortex/ e rode novamente.\n')
  process.exit(0)
}

// Detectar AI tools instalados
const detected = detectAiTools()

// Selecionar AI tool
let aiTool
if (detected.length === 1) {
  aiTool = detected[0]
  console.log(`  Detectado: ${aiTool}\n`)
} else {
  aiTool = await select({
    message: 'Qual AI tool voce usa?',
    choices: [
      { name: 'Claude Code', value: 'Claude Code' },
      { name: 'Cursor', value: 'Cursor' },
      { name: 'Copilot', value: 'Copilot' },
      { name: 'Todos', value: 'Todos' },
    ],
    default: detected[0] ?? 'Claude Code',
  })
}

// Coletar info do projeto
const name = await input({
  message: 'Nome do projeto:',
  validate: (v) => v.trim().length > 0 || 'Obrigatorio',
})

const description = await input({
  message: 'Descricao (1 frase):',
  validate: (v) => v.trim().length > 0 || 'Obrigatorio',
})

const stack = await input({
  message: 'Stack (ou "ainda nao sei"):',
  default: 'ainda nao sei',
})

const mode = await select({
  message: 'Modo:',
  choices: [
    { name: 'Projeto — vault completo com estrutura de decisoes e arquitetura', value: 'Projeto' },
    { name: 'Livre — minimo, so timeline e contextos', value: 'Livre' },
  ],
})

const lang = await select({
  message: 'Idioma / Language:',
  choices: [
    { name: 'PT — Portugues', value: 'pt' },
    { name: 'EN — English', value: 'en' },
  ],
})

let hasSpec = false
if (mode === 'Projeto') {
  hasSpec = await confirm({
    message: 'Tem spec, PRD ou docs para importar?',
    default: false,
  })
}

const vars = {
  NAME: name.trim(),
  DESCRIPTION: description.trim(),
  STACK: stack.trim(),
  MODE: mode,
  LANG: lang,
  DATE: new Date().toISOString().split('T')[0],
}

console.log('\n  Configurando...\n')

// Instalar AI tool
if (aiTool === 'Claude Code' || aiTool === 'Todos') installClaudeCode()
if (aiTool === 'Cursor' || aiTool === 'Todos') installCursor()
if (aiTool === 'Copilot' || aiTool === 'Todos') installCopilot()

// Criar vault
createVault(vars)

// Atualizar .gitignore
updateGitignore()

// Resultado
console.log('\n  Pronto!\n')
console.log(`  Vault: ./cortex/`)
console.log(`  Abra ./cortex/ no Obsidian como vault\n`)

if (aiTool === 'Claude Code' || aiTool === 'Todos') {
  console.log('  Claude Code: diga "cortex start" para comecar')
}
if (aiTool === 'Cursor' || aiTool === 'Todos') {
  console.log('  Cursor: diga "cortex start" no chat')
}
if (aiTool === 'Copilot' || aiTool === 'Todos') {
  console.log('  Copilot: diga "cortex start" no chat')
}

if (hasSpec) {
  console.log('\n  Importar spec: diga "cortex start" e cole seu PRD/spec no chat')
}

console.log()
