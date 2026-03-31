import { checkbox } from '@inquirer/prompts'
import { installClaudeCode, installCursor, installCopilot } from '../install.js'
import { t } from './i18n.js'

/** @param {'init' | 'update'} variant */
function buildToolChoices(lang, detected, variant) {
  const isUpdate = variant === 'update'
  return [
    {
      name: isUpdate ? t(lang, 'aiTools.claudeUpdate') : t(lang, 'aiTools.claudeInit'),
      value: 'Claude Code',
      checked: detected.includes('Claude Code'),
    },
    {
      name: isUpdate ? t(lang, 'aiTools.cursorUpdate') : t(lang, 'aiTools.cursorInit'),
      value: 'Cursor',
      checked: detected.includes('Cursor'),
    },
    {
      name: isUpdate ? t(lang, 'aiTools.copilotUpdate') : t(lang, 'aiTools.copilotInit'),
      value: 'Copilot',
      checked: detected.includes('Copilot'),
    },
  ]
}

export function logDetectedTools(lang, detected) {
  if (detected.length === 0) return
  console.log(`  ${t(lang, 'aiTools.detected')} ${detected.join(', ')}`)
  console.log()
}

/** @param {'init' | 'update'} variant */
export async function promptAiTools(lang, detected, variant) {
  logDetectedTools(lang, detected)
  return checkbox({
    message: t(lang, 'aiTools.message'),
    instructions: t(lang, 'aiTools.instructions'),
    choices: buildToolChoices(lang, detected, variant),
  })
}

/** Instala integrações conforme seleção. */
export function installSelectedAiTools(selection, lang) {
  if (selection.includes('Claude Code')) installClaudeCode(lang)
  if (selection.includes('Cursor')) installCursor(lang)
  if (selection.includes('Copilot')) installCopilot(lang)
}
