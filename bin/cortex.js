#!/usr/bin/env node

import { select, input, confirm, checkbox } from '@inquirer/prompts'
import { detectAiTools, vaultExists } from '../src/detect.js'
import { installClaudeCode, installCursor, installCopilot, updateGitignore } from '../src/install.js'
import { createVault } from '../src/vault.js'

console.log('\n  Cortex — AI Memory Framework')
console.log('  Contexto persistente para vibecoding\n')
console.log(`  Projeto: ${process.cwd()}\n`)

if (vaultExists()) {
  console.log('  ⚠  Vault ja existe em .cortex/\n')
  console.log('  Para reiniciar, remova a pasta .cortex/ e rode novamente.\n')
  process.exit(0)
}

const ok = await confirm({
  message: `Criar vault em ${process.cwd()}/.cortex/ ?`,
  default: true,
})

if (!ok) {
  console.log('\n  Operacao cancelada. Navegue ate a pasta do projeto e rode novamente.\n')
  process.exit(0)
}

// Detectar AI tools instalados
const detected = detectAiTools()
if (detected.length > 0) {
  console.log(`  Detectado: ${detected.join(', ')}\n`)
}

// Sempre perguntar — instalacao e opcional e pode ser multipla
const aiTools = await checkbox({
  message: 'Quais AI tools configurar? (espaco para selecionar, enter para confirmar)',
  choices: [
    {
      name: 'Claude Code — cria CLAUDE.md com protocolo e comandos cortex',
      value: 'Claude Code',
      checked: detected.includes('Claude Code'),
    },
    {
      name: 'Cursor — cria .cursor/rules/ com protocol, start e end',
      value: 'Cursor',
      checked: detected.includes('Cursor'),
    },
    {
      name: 'Copilot — cria .github/copilot-instructions.md',
      value: 'Copilot',
      checked: detected.includes('Copilot'),
    },
  ],
})

if (aiTools.length === 0) {
  console.log('\n  Nenhuma ferramenta selecionada.')
  console.log('  O vault sera criado sem configuracao de AI tool.\n')
}

// Coletar info do projeto
const name = await input({
  message: 'Nome do projeto:',
  validate: (v) => v.trim().length > 0 || 'Obrigatorio',
})

const description = await input({
  message: 'Descricao em 1 frase (ex: "API de gestao de tarefas para times remotos"):',
  validate: (v) => v.trim().length > 0 || 'Obrigatorio',
})

const stack = await input({
  message: 'Stack principal (ex: "Node.js + React + PostgreSQL", ou "ainda nao sei"):',
  default: 'ainda nao sei',
})

const mode = await select({
  message: 'Modo do vault:',
  choices: [
    {
      name: 'Projeto — vault completo: decisoes, arquitetura, entidades, regras de negocio, testes',
      value: 'Projeto',
    },
    {
      name: 'Livre — minimo: so timeline de sessoes e contextos por area. Ideal para tarefas do dia a dia.',
      value: 'Livre',
    },
  ],
})

const lang = await select({
  message: 'Idioma do vault / Vault language:',
  choices: [
    { name: 'PT — Portugues', value: 'pt' },
    { name: 'EN — English', value: 'en' },
  ],
})

let hasSpec = false
if (mode === 'Projeto') {
  hasSpec = await confirm({
    message: 'Tem spec, PRD ou doc existente para importar no vault?',
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

// Instalar AI tools selecionados
if (aiTools.includes('Claude Code')) installClaudeCode()
if (aiTools.includes('Cursor')) installCursor()
if (aiTools.includes('Copilot')) installCopilot()

// Criar vault
createVault(vars)

// Atualizar .gitignore
updateGitignore()

// Resultado
console.log('\n  Pronto!\n')
console.log(`  Vault criado em ./.cortex/`)
console.log(`  Abra ./.cortex/ no Obsidian como vault\n`)

if (aiTools.includes('Claude Code')) {
  console.log('  Claude Code → diga "cortex start" para comecar')
}
if (aiTools.includes('Cursor')) {
  console.log('  Cursor      → diga "cortex start" no chat')
}
if (aiTools.includes('Copilot')) {
  console.log('  Copilot     → diga "cortex start" no chat')
}

if (hasSpec) {
  console.log('\n  Para importar seu spec/PRD:')
  console.log('  Diga "cortex start", cole o documento e peca para distribuir no vault.')
}

console.log()
