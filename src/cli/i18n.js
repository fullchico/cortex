/**
 * Textos do CLI por idioma do vault (`pt` | `en`).
 * Valores internos (MODE, tool ids, practice ids) permanecem estáveis; só UI traduz.
 */

/** @param {Record<string, string>} vars */
function interpolate(template, vars = {}) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, name) => (vars[name] != null ? String(vars[name]) : ''))
}

/** @typedef {'pt'|'en'} Lang */

/**
 * @param {Lang} lang
 * @param {string} path ponto.exemplo.chave
 * @param {Record<string, string>} [vars]
 */
export function t(lang, path, vars) {
  const bundle = lang === 'en' ? en : pt
  const parts = path.split('.')
  let cur = bundle
  for (const p of parts) {
    cur = cur?.[p]
  }
  if (typeof cur !== 'string') {
    return path
  }
  return vars ? interpolate(cur, vars) : cur
}

/** Labels só para exibição (detectVaultMode continua retornando Freestyled | Projeto). */
export function vaultModeDisplayLabel(lang, mode) {
  if (mode === 'Projeto') return t(lang, 'labels.vaultMode.projeto')
  return t(lang, 'labels.vaultMode.freestyled')
}

const pt = {
  labels: {
    vaultMode: {
      freestyled: 'Freestyled',
      projeto: 'Projeto',
    },
  },
  langPrompt: {
    message: 'Idioma do vault:',
    choicePt: 'PT  —  Portugues',
    choiceEn: 'EN  —  English',
  },
  banner: {
    line2: 'Contexto persistente para AI',
    project: 'Projeto:',
  },
  existingVault: {
    detected: 'Vault {{mode}} detectado em {{vaultName}}/',
    whatToDo: 'O que deseja fazer?',
    exit: 'Sair',
    new: {
      name: 'Iniciar novo projeto  —  arquiva vault atual e comeca do zero',
      description: '  O vault atual vai para {{vaultName}}/Anterior/ e um novo e criado no lugar.',
    },
    migrate: {
      name: 'Migrar para modo Projeto  —  preserva sessoes e contextos',
      description: '  Adiciona estrutura Projeto ao vault. Sessoes e timeline preservados.',
    },
    tools: {
      name: 'Configurar AI tools  —  adicionar ou atualizar CLAUDE.md, cursor rules, copilot',
    },
    doneTools: '  ✦ Pronto!',
  },
  aiTools: {
    message: 'Quais AI tools configurar?',
    instructions: '  Espaco para selecionar · Enter para confirmar',
    detected: 'Detectado no ambiente:',
    claudeInit: 'Claude Code  →  cria CLAUDE.md com protocolo e comandos cortex',
    claudeUpdate: 'Claude Code  →  cria/atualiza CLAUDE.md',
    cursorInit: 'Cursor       →  cria .cursor/rules/ com protocol, start e end',
    cursorUpdate: 'Cursor       →  cria/atualiza .cursor/rules/',
    copilotInit: 'Copilot      →  cria .github/copilot-instructions.md',
    copilotUpdate: 'Copilot      →  cria/atualiza .github/copilot-instructions.md',
  },
  project: {
    required: 'Campo obrigatorio',
    name: 'Nome do projeto:',
    description: 'Descreva brevemente o projeto:',
    type: 'Tipo de projeto:',
    typeFullstack: 'Fullstack   —  frontend + backend',
    typeBackend: 'Backend     —  API, servico, CLI, worker',
    typeFrontend: 'Frontend    —  interface, SPA, app',
    frontend: 'Frontend:',
    backend: 'Backend:',
    otherDescribe: 'Outra  —  descrever',
    notSure: 'Ainda nao sei',
    describeFrontend: 'Descreva o frontend:',
    describeBackend: 'Descreva o backend:',
    stackTbd: 'a definir',
  },
  mode: {
    prompt: 'Modo do vault:',
    freestyled: {
      name: 'Freestyled  ✦  minimo e organico — timeline + contextos. Cresce com o uso.',
      description: '  Recomendado para projetos do dia a dia. Zero configuracao inicial.',
    },
    projeto: {
      name: 'Projeto     ✦  vault completo — decisoes, arquitetura, entidades, testes.',
      description: '  Para projetos com estrutura definida, time, ou spec/PRD.',
    },
  },
  practices: {
    prompt: 'Boas praticas a adotar? (opcional — Enter para pular)',
    instructions: '  Espaco para selecionar · Enter para confirmar',
    unitTests: 'Testes unitarios',
    solid: 'Principios SOLID',
    cleanName: 'Clean Architecture + Clean Code',
    testsFront:
      'Jest + Testing Library · testar comportamento, nao implementacao',
    testsBack: 'Jest/Vitest · unit tests para services, integration tests para endpoints',
    testsFull:
      'Front: Testing Library · Back: Jest/Vitest + integration tests',
    cleanFront:
      'Presentational vs container · hooks extraem logica · services para chamadas API',
    cleanBack:
      'Controller → Service → Repository · sem logica de negocio no controller · responsabilidade unica por camada',
    cleanFull:
      'Front: camadas de componente · Back: camadas service/repo · compartilhado: sem vazamento entre camadas',
    solidDesc:
      'S: uma razao para mudar · O: estender sem modificar · L: subtipos intercambiaveis · I: interfaces especificas · D: depender de abstracoes',
  },
  spec: {
    confirm: 'Tem spec, PRD ou doc existente para importar?',
  },
  init: {
    confirmVault: 'Inicializar vault em {{path}} ?',
    cancelled: '  Operacao cancelada.',
    runFromProjectDir: '  Navegue ate a pasta do projeto e rode novamente.',
    noToolsSelected: '  Nenhuma ferramenta selecionada.',
    noToolsHint: '  O vault sera criado sem configuracao de AI tool.',
  },
  install: {
    configuring: '  Configurando...',
    archiveFail: '  ✗ Falha ao arquivar vault anterior:',
    abortCorrupt: '  Abortando para nao corromper o vault.',
  },
  installLog: {
    createdFile: '  ✓ Criou {{label}}',
    hasProtocol: '  ✓ {{label}} ja tem protocolo Cortex',
    appended: '  ✓ Cortex adicionado ao {{label}} existente',
    cursorHasProtocol: '  ✓ .cursor/rules/{{rule}} ja tem protocolo Cortex',
    cursorCreated: '  ✓ Criou .cursor/rules/{{rule}}',
    gitignoreHas: '  ✓ {{vaultName}}/ ja esta no .gitignore',
    gitignoreAdded: '  ✓ Adicionou {{vaultName}}/ ao .gitignore',
  },
  vaultLog: {
    created: '  ✓ Vault criado em {{vaultName}}/',
    migrated: '  ✓ Vault migrado para modo Projeto em {{vaultName}}/',
    archived: '  ✓ Vault anterior arquivado em {{vaultName}}/Anterior/{{archiveName}}/',
  },
  done: {
    allSet: '  ✦ Tudo pronto!',
    migrated: '  Vault migrado em  →  ./{{vaultName}}/',
    memoryRef: '  Memoria referencia o [[Projeto]] original.',
    created: '  Vault criado em  →  ./{{vaultName}}/',
    previous: '  Anterior em      →  ./{{vaultName}}/Anterior/{{date}}/',
    obsidian: '  Abra no Obsidian →  File > Open Vault > {{vaultName}}/',
    howToStart: '  Como comecar:',
    claudeStart: '  · Claude Code  →  diga "cortex start"',
    cursorStart: '  · Cursor       →  diga "cortex start" no chat',
    copilotStart: '  · Copilot      →  diga "cortex start" no chat',
    specTitle: '  Para importar seu spec/PRD:',
    specHint: '  Diga "cortex start", cole o documento e peca para distribuir no vault.',
  },
}

const en = {
  labels: {
    vaultMode: {
      freestyled: 'Freestyled',
      projeto: 'Project',
    },
  },
  langPrompt: {
    message: 'Vault language:',
    choicePt: 'PT  —  Portuguese',
    choiceEn: 'EN  —  English',
  },
  banner: {
    line2: 'Persistent context for AI',
    project: 'Project:',
  },
  existingVault: {
    detected: '{{mode}} vault detected in {{vaultName}}/',
    whatToDo: 'What would you like to do?',
    exit: 'Exit',
    new: {
      name: 'Start new project  —  archive current vault and begin fresh',
      description: '  Current vault moves to {{vaultName}}/Anterior/ and a new one is created.',
    },
    migrate: {
      name: 'Migrate to Project mode  —  keeps sessions and contexts',
      description: '  Adds Project structure. Sessions and timeline preserved.',
    },
    tools: {
      name: 'Configure AI tools  —  add or update CLAUDE.md, Cursor rules, Copilot',
    },
    doneTools: '  ✦ Done!',
  },
  aiTools: {
    message: 'Which AI tools should we set up?',
    instructions: '  Space to select · Enter to confirm',
    detected: 'Detected in your environment:',
    claudeInit: 'Claude Code  →  creates CLAUDE.md with protocol and cortex commands',
    claudeUpdate: 'Claude Code  →  creates/updates CLAUDE.md',
    cursorInit: 'Cursor       →  creates .cursor/rules/ with protocol, start, end',
    cursorUpdate: 'Cursor       →  creates/updates .cursor/rules/',
    copilotInit: 'Copilot      →  creates .github/copilot-instructions.md',
    copilotUpdate: 'Copilot      →  creates/updates .github/copilot-instructions.md',
  },
  project: {
    required: 'Required field',
    name: 'Project name:',
    description: 'Briefly describe the project:',
    type: 'Project type:',
    typeFullstack: 'Fullstack   —  frontend + backend',
    typeBackend: 'Backend     —  API, service, CLI, worker',
    typeFrontend: 'Frontend    —  UI, SPA, app',
    frontend: 'Frontend:',
    backend: 'Backend:',
    otherDescribe: 'Other  —  describe',
    notSure: 'Not sure yet',
    describeFrontend: 'Describe the frontend:',
    describeBackend: 'Describe the backend:',
    stackTbd: 'TBD',
  },
  mode: {
    prompt: 'Vault mode:',
    freestyled: {
      name: 'Freestyled  ✦  minimal and organic — timeline + contexts. Grows with use.',
      description: '  Great for day-to-day work. Zero upfront setup.',
    },
    projeto: {
      name: 'Project     ✦  full vault — decisions, architecture, entities, tests.',
      description: '  For structured teams, specs, or PRDs.',
    },
  },
  practices: {
    prompt: 'Adopt any best practices? (optional — Enter to skip)',
    instructions: '  Space to select · Enter to confirm',
    unitTests: 'Unit tests',
    solid: 'SOLID principles',
    cleanName: 'Clean Architecture + Clean Code',
    testsFront: 'Jest + Testing Library · test behavior, not implementation',
    testsBack:
      'Jest/Vitest · unit tests for services, integration tests for endpoints',
    testsFull:
      'Front: Testing Library · Back: Jest/Vitest + integration tests',
    cleanFront:
      'Presentational vs container · hooks extract logic · services for API calls',
    cleanBack:
      'Controller → Service → Repository · no business logic in controllers · single responsibility per layer',
    cleanFull:
      'Front: component layers · Back: service/repository · shared: no logic leaking between layers',
    solidDesc:
      'S: one reason to change · O: extend without modifying · L: subtypes interchangeable · I: specific interfaces · D: depend on abstractions',
  },
  spec: {
    confirm: 'Do you have a spec, PRD, or doc to import?',
  },
  init: {
    confirmVault: 'Initialize vault at {{path}}?',
    cancelled: '  Cancelled.',
    runFromProjectDir: '  Open your project folder and run again.',
    noToolsSelected: '  No tools selected.',
    noToolsHint: '  The vault will be created without AI tool config.',
  },
  install: {
    configuring: '  Setting up...',
    archiveFail: '  ✗ Failed to archive previous vault:',
    abortCorrupt: '  Aborting to avoid a corrupted vault.',
  },
  installLog: {
    createdFile: '  ✓ Created {{label}}',
    hasProtocol: '  ✓ {{label}} already includes the Cortex protocol',
    appended: '  ✓ Appended Cortex block to existing {{label}}',
    cursorHasProtocol: '  ✓ .cursor/rules/{{rule}} already has the Cortex protocol',
    cursorCreated: '  ✓ Created .cursor/rules/{{rule}}',
    gitignoreHas: '  ✓ {{vaultName}}/ is already in .gitignore',
    gitignoreAdded: '  ✓ Added {{vaultName}}/ to .gitignore',
  },
  vaultLog: {
    created: '  ✓ Vault created at {{vaultName}}/',
    migrated: '  ✓ Vault migrated to Project mode in {{vaultName}}/',
    archived: '  ✓ Previous vault archived at {{vaultName}}/Anterior/{{archiveName}}/',
  },
  done: {
    allSet: '  ✦ All set!',
    migrated: '  Vault migrated at  →  ./{{vaultName}}/',
    memoryRef: '  Memory references the original [[Project]] note.',
    created: '  Vault created at  →  ./{{vaultName}}/',
    previous: '  Previous at       →  ./{{vaultName}}/Anterior/{{date}}/',
    obsidian: '  Open in Obsidian →  File > Open Vault > {{vaultName}}/',
    howToStart: '  How to start:',
    claudeStart: '  · Claude Code  →  say "cortex start"',
    cursorStart: '  · Cursor       →  say "cortex start" in chat',
    copilotStart: '  · Copilot      →  say "cortex start" in chat',
    specTitle: '  To import your spec/PRD:',
    specHint: '  Say "cortex start", paste the document, and ask to distribute it in the vault.',
  },
}

/**
 * @param {Lang} lang
 * @param {'frontend'|'backend'|'fullstack'} projectType
 */
export function getPracticeDescriptions(lang, projectType) {
  const L = lang === 'en' ? en.practices : pt.practices
  const isFront = projectType === 'frontend'
  const isBack = projectType === 'backend'
  if (isFront) {
    return { tests: L.testsFront, clean: L.cleanFront, solid: L.solidDesc }
  }
  if (isBack) {
    return { tests: L.testsBack, clean: L.cleanBack, solid: L.solidDesc }
  }
  return { tests: L.testsFull, clean: L.cleanFull, solid: L.solidDesc }
}

/** Árvores pt/en (ex.: paridade de chaves nos testes). */
export const locales = { pt, en }
