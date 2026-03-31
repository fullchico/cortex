import { select, confirm, checkbox } from '@inquirer/prompts'
import { t, getPracticeDescriptions } from './i18n.js'

/** @param {'pt'|'en'} lang */
export async function promptMode(lang, isMigrate) {
  return select({
    message: t(lang, 'mode.prompt'),
    default: isMigrate ? 'Projeto' : 'Freestyled',
    choices: [
      {
        name: t(lang, 'mode.freestyled.name'),
        value: 'Freestyled',
        description: t(lang, 'mode.freestyled.description'),
      },
      {
        name: t(lang, 'mode.projeto.name'),
        value: 'Projeto',
        description: t(lang, 'mode.projeto.description'),
      },
    ],
  })
}

/**
 * Boas práticas opcionais (Freestyled).
 * @returns {Promise<string[]>}
 */
export async function promptFreestyledPractices(lang, projectType) {
  const desc = getPracticeDescriptions(lang, projectType)

  console.log()
  return checkbox({
    message: t(lang, 'practices.prompt'),
    instructions: t(lang, 'practices.instructions'),
    choices: [
      {
        name: t(lang, 'practices.unitTests'),
        value: 'tests',
        description: `  ${desc.tests}`,
      },
      {
        name: t(lang, 'practices.cleanName'),
        value: 'clean',
        description: `  ${desc.clean}`,
      },
      {
        name: t(lang, 'practices.solid'),
        value: 'solid',
        description: `  ${desc.solid}`,
      },
    ],
  })
}

/** @param {'pt'|'en'} lang */
export async function promptHasSpecImport(lang) {
  console.log()
  return confirm({
    message: t(lang, 'spec.confirm'),
    default: false,
  })
}
