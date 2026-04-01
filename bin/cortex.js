#!/usr/bin/env node

import { createRequire } from 'module'
import { confirm } from '@inquirer/prompts'
import { vaultExists, detectAiTools } from '../src/detect.js'
import { printBanner } from '../src/cli/banner.js'
import { promptLanguage } from '../src/cli/prompt-language.js'
import { runExistingVaultFlow } from '../src/cli/existing-vault.js'
import { promptAiTools } from '../src/cli/ai-tools.js'
import { promptProjectBasics } from '../src/cli/project-basics.js'
import { promptProjectType, promptStack } from '../src/cli/project-stack.js'
import {
  promptMode,
  promptFreestyledPractices,
  promptHasSpecImport,
} from '../src/cli/mode-and-practices.js'
import { runVaultInstall, printCompletionSummary } from '../src/cli/install-phase.js'
import { slugifyVaultName } from '../src/vault.js'
import { t } from '../src/cli/i18n.js'

const require = createRequire(import.meta.url)

try {
  const cmd = process.argv[2]

  // --version
  if (cmd === '--version' || cmd === '-v') {
    const { version } = require('../package.json')
    console.log(version)
    process.exit(0)
  }

  // --help
  if (cmd === '--help' || cmd === '-h') {
    console.log(`
  cortex-ai — AI memory framework

  Usage:
    npx @fullchico/cortex-ai           Initialize vault (interactive)
    npx @fullchico/cortex-ai status    Current vault state
    npx @fullchico/cortex-ai context   Create context: context <name>
    npx @fullchico/cortex-ai update    Update AI tools and vault
    npx @fullchico/cortex-ai --help    This message
    npx @fullchico/cortex-ai --version Installed version
`)
    process.exit(0)
  }

  // Subcommands
  if (cmd === 'status') {
    const { runStatus } = await import('../src/cli/cmd-status.js')
    await runStatus()
    process.exit(0)
  }

  if (cmd === 'context') {
    const { runContext } = await import('../src/cli/cmd-context.js')
    await runContext(process.argv[3])
    process.exit(0)
  }

  if (cmd === 'update') {
    const { runUpdate } = await import('../src/cli/cmd-update.js')
    await runUpdate()
    process.exit(0)
  }

  // Unknown subcommand
  if (cmd && !cmd.startsWith('-')) {
    console.error(`\n  ✗ Unknown command: ${cmd}`)
    console.error('  Run with --help for available commands\n')
    process.exit(1)
  }

  // Init flow (no args)
  const lang = await promptLanguage()
  printBanner(lang)

  const existing = await runExistingVaultFlow(lang)
  if (existing.kind === 'exit') {
    process.exit(existing.code ?? 0)
  }

  const { isMigrate, isReinit, prefill } = existing

  if (!isReinit && !isMigrate && !vaultExists()) {
    const ok = await confirm({
      message: t(lang, 'init.confirmVault', { path: process.cwd() }),
      default: true,
    })
    if (!ok) {
      console.log()
      console.log(t(lang, 'init.cancelled'))
      console.log(t(lang, 'init.runFromProjectDir'))
      console.log()
      process.exit(0)
    }
    console.log()
  }

  const detected = detectAiTools()
  const aiTools = await promptAiTools(lang, detected, 'init')

  if (aiTools.length === 0) {
    console.log()
    console.log(t(lang, 'init.noToolsSelected'))
    console.log(t(lang, 'init.noToolsHint'))
  }

  console.log()

  const { name, description } = await promptProjectBasics(prefill, lang)
  const projectType = await promptProjectType(lang)
  const stack = await promptStack(lang, projectType)

  console.log()

  const mode = await promptMode(lang, isMigrate)

  let practices = []
  if (mode === 'Freestyled') {
    practices = await promptFreestyledPractices(lang, projectType)
  }

  let hasSpec = false
  if (mode === 'Projeto') {
    hasSpec = await promptHasSpecImport(lang)
  }

  const vars = {
    NAME: name,
    DESCRIPTION: description,
    STACK: stack.trim(),
    MODE: mode,
    LANG: lang,
    PRACTICES: practices,
    PROJECT_TYPE: projectType,
    DATE: new Date().toISOString().split('T')[0],
  }

  runVaultInstall({ vars, aiTools, isMigrate, isReinit, lang })

  printCompletionSummary({
    isMigrate,
    isReinit,
    hasSpec,
    aiTools,
    lang,
    archiveDate: vars.DATE,
    vaultName: slugifyVaultName(vars.NAME),
  })
} catch (err) {
  console.error('\n  ✗ Unexpected error:', err.message)
  console.error('  Report at: https://github.com/fullchico/cortex/issues\n')
  process.exit(1)
}
