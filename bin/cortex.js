#!/usr/bin/env node

import { select, input, confirm, checkbox } from '@inquirer/prompts'
import { detectAiTools, vaultExists } from '../src/detect.js'
import { installClaudeCode, installCursor, installCopilot, updateGitignore } from '../src/install.js'
import { createVault } from '../src/vault.js'

console.log()
console.log('  ╔══════════════════════════════════════╗')
console.log('  ║   Cortex — AI Memory Framework       ║')
console.log('  ║   Contexto persistente para AI       ║')
console.log('  ╚══════════════════════════════════════╝')
console.log()
console.log(`  Projeto: ${process.cwd()}`)
console.log()

if (vaultExists()) {
  console.log('  ⚠  Vault ja existe em .cortex/')
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
  transformer: (v) => v,
  validate: (v) => v.trim().length > 0 || 'Campo obrigatorio',
})

const stack = await input({
  message: 'Stack principal:',
  default: 'ainda nao sei',
})

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
