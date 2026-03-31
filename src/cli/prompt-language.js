import { select } from '@inquirer/prompts'
import { t } from './i18n.js'

/** Heurística para texto do seletor antes do usuário escolher o idioma do vault. */
function bootstrapLang() {
  const l = (process.env.LANG || process.env.LANGUAGE || '').toLowerCase()
  return l.startsWith('pt') ? 'pt' : 'en'
}

/** Pergunta idioma do vault antes de qualquer detecção. */
export async function promptLanguage() {
  const hint = bootstrapLang()
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
