import { select } from '@inquirer/prompts'
import { t } from './i18n.js'

/**
 * Ambiente → idioma sugerido para rótulos do seletor inicial (antes de escolher o vault).
 * @param {Record<string, string | undefined>} [env]
 */
export function resolveLangHint(env = process.env) {
  const l = (env.LANG || env.LANGUAGE || '').toLowerCase()
  return l.startsWith('pt') ? 'pt' : 'en'
}

/** Pergunta idioma do vault antes de qualquer detecção. */
export async function promptLanguage() {
  const hint = resolveLangHint()
  const lang = await select({
    message: t(hint, 'langPrompt.message'),
    default: hint,
    choices: [
      { name: t(hint, 'langPrompt.choicePt'), value: 'pt' },
      { name: t(hint, 'langPrompt.choiceEn'), value: 'en' },
    ],
  })
  console.log()
  return lang
}
