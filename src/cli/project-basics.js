import { input } from '@inquirer/prompts'
import { t } from './i18n.js'

/**
 * @param {{ name?: string, description?: string }} prefill
 * @param {'pt'|'en'} lang
 */
export async function promptProjectBasics(prefill, lang) {
  const required = (v) => v.trim().length > 0 || t(lang, 'project.required')

  const name = await input({
    message: t(lang, 'project.name'),
    default: prefill.name || undefined,
    validate: required,
  })

  const description = await input({
    message: t(lang, 'project.description'),
    default: prefill.description || undefined,
    validate: required,
  })

  return { name: name.trim(), description: description.trim() }
}
