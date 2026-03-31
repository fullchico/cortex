import { existsSync } from 'fs'
import { join } from 'path'
import os from 'os'

export function detectAiTools() {
  const tools = []

  // Claude Code — ~/.claude/ existe
  if (existsSync(join(os.homedir(), '.claude'))) {
    tools.push('Claude Code')
  }

  // Cursor — .cursor/ no projeto atual
  if (existsSync(join(process.cwd(), '.cursor'))) {
    tools.push('Cursor')
  }

  // Copilot — .github/ no projeto atual
  if (existsSync(join(process.cwd(), '.github'))) {
    tools.push('Copilot')
  }

  return tools
}

export function vaultExists() {
  return existsSync(join(process.cwd(), 'cortex'))
}
