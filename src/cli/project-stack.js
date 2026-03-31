import { select, input } from '@inquirer/prompts'
import { t } from './i18n.js'

/**
 * @param {'pt'|'en'} lang
 * @returns {(v: string) => true | string}
 */
function required(lang) {
  return (v) => v.trim().length > 0 || t(lang, 'project.required')
}

/** @param {'pt'|'en'} lang */
async function pickFront(lang) {
  const choice = await select({
    message: t(lang, 'project.frontend'),
    choices: [
      { name: 'React', value: 'React' },
      { name: 'Angular', value: 'Angular' },
      { name: 'Vue', value: 'Vue' },
      { name: t(lang, 'project.otherDescribe'), value: 'other' },
      { name: t(lang, 'project.notSure'), value: 'tbd' },
    ],
  })
  if (choice === 'other') {
    return input({ message: t(lang, 'project.describeFrontend'), validate: required(lang) })
  }
  return choice === 'tbd' ? t(lang, 'project.stackTbd') : choice
}

/** @param {'pt'|'en'} lang */
async function pickBack(lang) {
  const choice = await select({
    message: t(lang, 'project.backend'),
    choices: [
      { name: 'Node.js', value: 'Node.js' },
      { name: 'Java', value: 'Java' },
      { name: 'Go', value: 'Go' },
      { name: t(lang, 'project.otherDescribe'), value: 'other' },
      { name: t(lang, 'project.notSure'), value: 'tbd' },
    ],
  })
  if (choice === 'other') {
    return input({ message: t(lang, 'project.describeBackend'), validate: required(lang) })
  }
  return choice === 'tbd' ? t(lang, 'project.stackTbd') : choice
}

/** @param {'pt'|'en'} lang */
export async function promptProjectType(lang) {
  return select({
    message: t(lang, 'project.type'),
    choices: [
      { name: t(lang, 'project.typeFullstack'), value: 'fullstack' },
      { name: t(lang, 'project.typeBackend'), value: 'backend' },
      { name: t(lang, 'project.typeFrontend'), value: 'frontend' },
    ],
  })
}

/** @param {'pt'|'en'} lang @param {'fullstack' | 'frontend' | 'backend'} projectType */
export async function promptStack(lang, projectType) {
  if (projectType === 'fullstack') {
    const front = await pickFront(lang)
    const back = await pickBack(lang)
    return `${front} + ${back}`
  }
  if (projectType === 'frontend') {
    return pickFront(lang)
  }
  return pickBack(lang)
}
