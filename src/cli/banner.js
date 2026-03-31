import { t } from './i18n.js'

/** @param {'pt'|'en'} lang */
export function printBanner(lang, cwd = process.cwd()) {
  console.log()
  console.log('  ╔══════════════════════════════════════╗')
  console.log('  ║   Cortex — AI Memory Framework       ║')
  console.log(`  ║${`   ${t(lang, 'banner.line2')}`.padEnd(38)}║`)
  console.log('  ╚══════════════════════════════════════╝')
  console.log()
  console.log(`  ${t(lang, 'banner.project')} ${cwd}`)
  console.log()
}
