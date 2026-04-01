import { existsSync } from 'fs'
import { join } from 'path'
import os from 'os'

/**
 * @typedef {{
 *   cwd?: string
 *   homedir?: string
 *   existsSync?: (p: string) => boolean
 * }} DetectOptions
 * `cwd` / `homedir` isolam testes; `existsSync` permite simular FS (ex.: sandbox bloqueia `.cursor/`).
 */

/** @param {DetectOptions} [opts] */
function resolveCwd(opts) {
  return opts?.cwd ?? process.cwd()
}

/** @param {DetectOptions} [opts] */
function resolveHomedir(opts) {
  return opts?.homedir ?? os.homedir()
}

/** @param {DetectOptions} [opts] */
function resolveExists(opts) {
  return opts?.existsSync ?? existsSync
}

export function detectAiTools(opts) {
  const cwd = resolveCwd(opts)
  const homedir = resolveHomedir(opts)
  const ex = resolveExists(opts)
  const tools = []

  if (ex(join(homedir, '.claude'))) {
    tools.push('Claude Code')
  }

  if (ex(join(cwd, '.cursor'))) {
    tools.push('Cursor')
  }

  if (ex(join(cwd, '.github'))) {
    tools.push('Copilot')
  }

  return tools
}

/** @param {DetectOptions} [opts] */
export function vaultExists(opts) {
  const ex = resolveExists(opts)
  return ex(join(resolveCwd(opts), 'cortex'))
}

/** @param {DetectOptions} [opts] */
export function detectVaultMode(opts) {
  const ex = resolveExists(opts)
  const vaultPath = join(resolveCwd(opts), 'cortex')
  if (!ex(vaultPath)) return null
  if (ex(join(vaultPath, 'Decisoes')) || ex(join(vaultPath, 'Decisions'))) return 'Projeto'
  return 'Freestyled'
}

/** @param {DetectOptions} [opts] */
export function detectVaultLang(opts) {
  const ex = resolveExists(opts)
  const vaultPath = join(resolveCwd(opts), 'cortex')
  if (ex(join(vaultPath, 'Project.md')) || ex(join(vaultPath, 'Project Memory.md'))) return 'en'
  return 'pt'
}
