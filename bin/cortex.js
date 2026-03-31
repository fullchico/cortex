#!/usr/bin/env node

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
import { t } from '../src/cli/i18n.js'

const lang = await promptLanguage()
printBanner(lang)

const existing = await runExistingVaultFlow(lang)
if (existing.kind === 'exit') {
  process.exit(existing.code ?? 0)
}

const { isMigrate, isReinit, prefill } = existing

if (!isReinit && !isMigrate && !vaultExists()) {
  const ok = await confirm({
    message: t(lang, 'init.confirmVault', { path: `${process.cwd()}/.cortex/` }),
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
})
