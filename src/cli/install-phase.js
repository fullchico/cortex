import { updateGitignore } from '../install.js'
import { createVault, migrateVault, archiveVault, slugifyVaultName } from '../vault.js'
import { installSelectedAiTools } from './ai-tools.js'
import { t } from './i18n.js'

/** Instala integrações, cria/migra/arquiva vault e atualiza `.gitignore`. */
export function runVaultInstall(opts) {
  const { vars, aiTools, isMigrate, isReinit, lang } = opts

  console.log()
  console.log(t(lang, 'install.configuring'))
  console.log()

  installSelectedAiTools(aiTools, lang)

  const archiveDate = vars.DATE

  if (isMigrate) {
    migrateVault(vars)
  } else {
    if (isReinit) {
      try {
        archiveVault(archiveDate, lang)
      } catch (err) {
        console.error()
        console.error(t(lang, 'install.archiveFail'), err.message)
        console.error(t(lang, 'install.abortCorrupt'))
        console.error()
        process.exit(1)
      }
    }
    createVault(vars)
  }

  updateGitignore(lang, slugifyVaultName(vars.NAME))
}

/**
 * @param {object} p
 * @param {boolean} p.isMigrate
 * @param {boolean} p.isReinit
 * @param {boolean} p.hasSpec
 * @param {string[]} p.aiTools
 * @param {'pt'|'en'} p.lang
 * @param {string} p.archiveDate
 * @param {string} p.vaultName
 */
export function printCompletionSummary(p) {
  const { isMigrate, isReinit, hasSpec, aiTools, lang, archiveDate, vaultName } = p

  console.log()
  console.log(t(lang, 'done.allSet'))
  console.log()

  if (isMigrate) {
    console.log(t(lang, 'done.migrated', { vaultName }))
    console.log(t(lang, 'done.memoryRef'))
  } else {
    console.log(t(lang, 'done.created', { vaultName }))
    if (isReinit) console.log(t(lang, 'done.previous', { date: archiveDate, vaultName }))
  }

  console.log(t(lang, 'done.obsidian', { vaultName }))
  console.log()

  if (aiTools.length > 0) {
    console.log(t(lang, 'done.howToStart'))
    if (aiTools.includes('Claude Code')) console.log(t(lang, 'done.claudeStart'))
    if (aiTools.includes('Cursor')) console.log(t(lang, 'done.cursorStart'))
    if (aiTools.includes('Copilot')) console.log(t(lang, 'done.copilotStart'))
    console.log()
  }

  if (hasSpec) {
    console.log(t(lang, 'done.specTitle'))
    console.log(t(lang, 'done.specHint'))
    console.log()
  }
}
