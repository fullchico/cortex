import { select } from '@inquirer/prompts'
import { detectAiTools, vaultExists, detectVaultMode, detectVaultLang } from '../detect.js'
import { readFreestyledRoot } from '../vault.js'
import { promptAiTools, installSelectedAiTools } from './ai-tools.js'
import { t, vaultModeDisplayLabel } from './i18n.js'

/**
 * Fluxo quando `cortex/` já existe: migrar, reinit, só tools ou sair.
 * @returns {Promise<
 *   | { kind: 'exit'; code?: number }
 *   | { kind: 'continue'; isMigrate: boolean; isReinit: boolean; prefill: Record<string, unknown> }
 * >}
 */
export async function runExistingVaultFlow(lang) {
  if (!vaultExists()) {
    return { kind: 'continue', isMigrate: false, isReinit: false, prefill: {} }
  }

  const currentMode = detectVaultMode()
  const modeLabel = vaultModeDisplayLabel(lang, currentMode)
  console.log(`  ${t(lang, 'existingVault.detected', { mode: modeLabel })}`)
  console.log()

  const choices = [
    {
      name: t(lang, 'existingVault.new.name'),
      value: 'new',
      description: t(lang, 'existingVault.new.description'),
    },
  ]

  if (currentMode === 'Freestyled') {
    choices.push({
      name: t(lang, 'existingVault.migrate.name'),
      value: 'migrate',
      description: t(lang, 'existingVault.migrate.description'),
    })
  }

  choices.push(
    {
      name: t(lang, 'existingVault.tools.name'),
      value: 'tools',
    },
    { name: t(lang, 'existingVault.exit'), value: 'exit' },
  )

  const action = await select({ message: t(lang, 'existingVault.whatToDo'), choices })

  if (action === 'exit') {
    console.log()
    return { kind: 'exit', code: 0 }
  }

  if (action === 'tools') {
    console.log()
    const detectedTools = detectAiTools()
    const toolsToInstall = await promptAiTools(lang, detectedTools, 'update')
    console.log()
    console.log(t(lang, 'install.configuring'))
    console.log()
    installSelectedAiTools(toolsToInstall, lang)
    console.log()
    console.log(t(lang, 'existingVault.doneTools'))
    console.log()
    return { kind: 'exit', code: 0 }
  }

  let isMigrate = false
  let isReinit = false
  let prefill = {}

  if (action === 'migrate') {
    isMigrate = true
    const existingLang = detectVaultLang()
    prefill = readFreestyledRoot(existingLang)
  } else {
    isReinit = true
  }

  console.log()
  return { kind: 'continue', isMigrate, isReinit, prefill }
}
