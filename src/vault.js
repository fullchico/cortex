import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, cpSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { t } from './cli/i18n.js'
import { readVaultName } from './detect.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES = join(__dirname, '..', 'templates')

// --- Helpers públicos ---

export function slugifyVaultName(name) {
  return name
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'cortex'
}

// --- Estruturas de diretórios ---

const DIRS = {
  pt: {
    projeto: [
      'Decisoes',
      'Dominio',
      'Arquitetura',
      'Regras de Negocio',
      'Sessoes',
      'Sessoes/timeline',
      'Sessoes/contextos',
    ],
    livre: [
      'Sessoes/timeline',
      'Sessoes/contextos',
    ],
  },
  en: {
    projeto: [
      'Decisions',
      'Domain',
      'Architecture',
      'Business Rules',
      'Sessions',
      'Sessions/timeline',
      'Sessions/contexts',
    ],
    livre: [
      'Sessions/timeline',
      'Sessions/contexts',
    ],
  },
}

// --- Builders ---

function buildPracticesSection(vars, lang) {
  const practices = vars.PRACTICES || []
  if (practices.length === 0) return ''

  const isEN  = lang === 'en'
  const type  = vars.PROJECT_TYPE || 'fullstack'
  const isFront = type === 'frontend'
  const isBack  = type === 'backend'

  const examples = {
    tests: {
      title: isEN ? 'Unit tests' : 'Testes unitarios',
      items: isFront
        ? (isEN
            ? ['Jest + Testing Library (React) / Vitest + Vue Test Utils / Angular Testing',
               'Test behavior, not implementation details',
               'One test file per component · describe/it blocks',
               'Mock only external dependencies (API calls, localStorage)']
            : ['Jest + Testing Library (React) / Vitest + Vue Test Utils / Angular Testing',
               'Testar comportamento, nao detalhes de implementacao',
               'Um arquivo de teste por componente · blocos describe/it',
               'Mockar apenas dependencias externas (chamadas API, localStorage)'])
        : isBack
        ? (isEN
            ? ['Jest/Vitest (Node.js) · JUnit (Java) · testify (Go)',
               'Unit tests: pure functions and service logic in isolation',
               'Integration tests: real database, real HTTP calls',
               'Test file mirrors source structure (users.service.test.ts)']
            : ['Jest/Vitest (Node.js) · JUnit (Java) · testify (Go)',
               'Unit tests: funcoes puras e logica de service em isolamento',
               'Integration tests: banco real, chamadas HTTP reais',
               'Arquivo de teste espelha a estrutura do source'])
        : (isEN
            ? ['Front: Testing Library · behavior tests per component',
               'Back: Jest/Vitest · unit + integration tests',
               'E2E: Playwright or Cypress for critical user flows']
            : ['Front: Testing Library · testes de comportamento por componente',
               'Back: Jest/Vitest · unit + integration tests',
               'E2E: Playwright ou Cypress para fluxos criticos']),
    },
    clean: {
      title: 'Clean Architecture + Clean Code',
      items: isFront
        ? (isEN
            ? ['Presentational vs container components (UI vs logic)',
               'Hooks extract reusable logic from components',
               'Services layer for all API calls — no fetch inside components',
               'Clean Code: functions < 20 lines · names that reveal intent · no dead comments']
            : ['Presentational vs container components (UI vs logica)',
               'Hooks extraem logica reutilizavel dos componentes',
               'Camada de services para todas as chamadas API — sem fetch dentro de componente',
               'Clean Code: funcoes < 20 linhas · nomes que revelam intencao · sem comentarios mortos'])
        : isBack
        ? (isEN
            ? ['Layers: Controller → Service → Repository (no layer skipping)',
               'No business logic in controllers — only orchestration',
               'Repositories abstract all database access',
               'Clean Code: single responsibility · early return · no magic numbers']
            : ['Camadas: Controller → Service → Repository (sem pular camada)',
               'Sem logica de negocio no controller — apenas orquestracao',
               'Repositories abstraem todo acesso ao banco',
               'Clean Code: responsabilidade unica · early return · sem numeros magicos'])
        : (isEN
            ? ['Front: component layers — UI / hooks / services',
               'Back: Controller → Service → Repository',
               'Shared: no business logic leaking between layers',
               'Clean Code: names that reveal intent · small focused functions']
            : ['Front: camadas — UI / hooks / services',
               'Back: Controller → Service → Repository',
               'Compartilhado: sem logica de negocio vazando entre camadas',
               'Clean Code: nomes que revelam intencao · funcoes pequenas e focadas']),
    },
    solid: {
      title: isEN ? 'SOLID Principles' : 'Principios SOLID',
      items: isEN
        ? ['S — Single Responsibility: one class/component = one reason to change',
           'O — Open/Closed: extend behavior without modifying existing code (strategy, plugins)',
           'L — Liskov Substitution: subtypes must be interchangeable with their base type',
           'I — Interface Segregation: specific interfaces, not one fat interface',
           'D — Dependency Inversion: depend on abstractions, inject concrete implementations']
        : ['S — Single Responsibility: uma classe/componente = uma razao para mudar',
           'O — Open/Closed: estender comportamento sem modificar codigo existente (strategy, plugins)',
           'L — Liskov Substitution: subtipos devem ser intercambiaveis com o tipo base',
           'I — Interface Segregation: interfaces especificas, nao uma interface gorda',
           'D — Dependency Inversion: depender de abstracoes, injetar implementacoes concretas'],
    },
  }

  const blocks = practices.map(p => {
    const ex = examples[p]
    if (!ex) return ''
    return `### ${ex.title}\n${ex.items.map(i => `- ${i}`).join('\n')}`
  }).filter(Boolean)

  return `\n---\n\n## ${isEN ? 'Best Practices' : 'Boas Praticas'}\n\n${blocks.join('\n\n')}\n`
}

function buildLivreRoot(vars, lang) {
  const isEN = lang === 'en'
  const practicesSection = buildPracticesSection(vars, lang)

  return `# ${vars.NAME}

${isEN ? '#project' : '#projeto'}

---

## ${isEN ? 'About' : 'Sobre'}

${vars.DESCRIPTION}

| ${isEN ? 'Field' : 'Campo'} | ${isEN ? 'Value' : 'Valor'} |
|-------|-------|
| **Stack** | ${vars.STACK} |
| **${isEN ? 'Started' : 'Inicio'}** | ${vars.DATE} |

---

## ${isEN ? 'How to use' : 'Como usar'}

\`\`\`
cortex start [contexto]   ${isEN ? '→ opens session, loads context' : '→ abre sessao, carrega contexto'}
cortex end                ${isEN ? '→ saves session to timeline' : '→ salva sessao na timeline'}
cortex context <nome>     ${isEN ? '→ creates a new context island' : '→ cria uma ilha de contexto'}
\`\`\`
${practicesSection}`
}

function buildProjectMemory(vars, lang) {
  const isEN = lang === 'en'
  const links = isEN
    ? { entities: 'Entities', patterns: 'Code Patterns', anti: 'Anti-patterns', modules: 'Module Map', tests: 'Test Strategy', locked: 'Locked Definitions', open: 'Open Questions', rules: 'General Rules' }
    : { entities: 'Entidades', patterns: 'Padroes de Codigo', anti: 'Anti-patterns', modules: 'Mapa de Modulos', tests: 'Estrategia de Testes', locked: 'Definicoes Travadas', open: 'Questoes em Aberto', rules: 'Regras Gerais' }

  return `# ${isEN ? 'Project Memory' : 'Memoria Projeto'}

${isEN ? '#moc #project #memory' : '#moc #projeto #memoria'}

> [!abstract] ${isEN ? 'Project second brain — AI reads this first' : 'Segundo cerebro do projeto — AI le isto primeiro'}

---

## ${isEN ? 'About the project' : 'Sobre o projeto'}

| ${isEN ? 'Field' : 'Campo'} | ${isEN ? 'Value' : 'Valor'} |
|-------|-------|
| **${isEN ? 'Name' : 'Nome'}** | ${vars.NAME} |
| **${isEN ? 'Description' : 'Descricao'}** | ${vars.DESCRIPTION} |
| **Stack** | ${vars.STACK} |
| **${isEN ? 'Mode' : 'Modo'}** | ${vars.MODE} |
| **${isEN ? 'Language' : 'Idioma'}** | ${vars.LANG.toUpperCase()} |
| **${isEN ? 'Started' : 'Inicio'}** | ${vars.DATE} |

---

## ${isEN ? 'Project status' : 'Estado do projeto'}

### ${isEN ? 'Implemented' : 'Implementado'}
- [ ] _(${isEN ? 'fill in as it evolves' : 'preencher conforme evolui'})_

### ${isEN ? 'In progress' : 'Em andamento'}
- [ ] _(${isEN ? 'fill in as it evolves' : 'preencher conforme evolui'})_

### ${isEN ? 'Pending' : 'Pendente'}
- [ ] _(${isEN ? 'fill in as it evolves' : 'preencher conforme evolui'})_

---

## ${isEN ? 'AI consultation protocol' : 'Protocolo de consulta do AI'}

> [!important] ${isEN ? 'Follow BEFORE writing any code' : 'Seguir ANTES de escrever qualquer codigo'}

**${isEN ? 'To code:' : 'Para codar:'}**
1. [[${links.entities}]] — ${isEN ? 'real fields exist?' : 'campos reais existem?'}
2. [[${links.patterns}]] — ${isEN ? 'how is it done here?' : 'como e feito aqui?'}
3. [[${links.anti}]] — ${isEN ? 'what not to do?' : 'o que nao fazer?'}
4. [[${links.modules}]] — ${isEN ? 'already exists?' : 'ja existe?'}
5. [[${links.tests}]] — ${isEN ? 'how to test?' : 'como testar?'}

**${isEN ? 'To decide:' : 'Para decidir:'}**
6. [[${links.locked}]] — ${isEN ? 'already decided?' : 'ja foi decidido?'}
7. [[${links.open}]] — ${isEN ? 'not decided yet?' : 'ainda nao foi decidido?'}
8. [[${links.rules}]] — ${isEN ? 'what is the formula/logic?' : 'qual a formula/logica?'}
`
}

function buildLockedDefinitions(lang) {
  const isEN = lang === 'en'
  const back = isEN ? 'Project Memory' : 'Memoria Projeto'
  return `# ${isEN ? 'Locked Definitions' : 'Definicoes Travadas'}

${isEN ? '#decisions' : '#decisoes'}

> [!abstract] ${isEN ? 'Confirmed rules — do not change without explicit review' : 'Regras confirmadas — nao alterar sem revisao explicita'}

> [!tip] ${isEN
    ? '**Locked Definitions** = what was decided (choices that do not change)\n> **Business Rules** = how it works (formulas, logic, calculations)'
    : '**Definicoes Travadas** = o que foi decidido (escolhas que nao mudam)\n> **Regras de Negocio** = como funciona (formulas, logica, calculos)'}

${isEN ? 'Back' : 'Voltar'}: [[${back}]]

---

| ${isEN ? 'Decision' : 'Decisao'} | ${isEN ? 'Definition' : 'Definicao'} | ${isEN ? 'Date' : 'Data'} |
|---------|-----------|------|
`
}

function buildSessionsIndex(lang) {
  const isEN = lang === 'en'
  const back = isEN ? 'Project Memory' : 'Memoria Projeto'
  return `# ${isEN ? 'Sessions — Temporal Memory' : 'Sessoes — Memoria Temporal'}

${isEN ? '#sessions #moc' : '#sessoes #moc'}

> [!abstract] ${isEN ? 'The chronological brain of the project' : 'O cerebro cronologico do projeto'}

${isEN ? 'Back' : 'Voltar'}: [[${back}]]

---

## ${isEN ? 'Registered sessions' : 'Sessoes registradas'}

| ${isEN ? 'Date' : 'Data'} | ${isEN ? 'Session' : 'Sessao'} | ${isEN ? 'Focus' : 'Foco'} |
|------|--------|------|
`
}

function buildEntidades(lang) {
  const isEN = lang === 'en'
  const back = isEN ? 'Project Memory' : 'Memoria Projeto'
  const title = isEN ? 'Entities' : 'Entidades'
  const tags = isEN ? '#domain #schema #ddd' : '#dominio #schema #ddd'
  const callout = isEN ? 'Real fields — check before coding' : 'Campos reais — consultar antes de codar'

  return `# ${title}

${tags}

> [!abstract] ${callout}

> [!tip] **Entity** tem identidade (ID) · **Value Object** imutavel, igualdade por valor · **Aggregate** raiz de consistencia transacional

${isEN ? 'Back' : 'Voltar'}: [[${back}]]

---

## ${isEN ? 'Entities' : 'Entidades'}

| ${isEN ? 'Name' : 'Nome'} | ${isEN ? 'Fields' : 'Campos'} | ${isEN ? 'Invariants' : 'Invariantes'} |
|------|--------|-------------|
| _ex: User_ | id, email, name | ${isEN ? 'unique email' : 'email unico'} |

## Value Objects

| ${isEN ? 'Name' : 'Nome'} | ${isEN ? 'Fields' : 'Campos'} | ${isEN ? 'Validation rule' : 'Regra de validacao'} |
|------|--------|--------------------|
| _ex: Email_ | value | ${isEN ? 'valid format, immutable' : 'formato valido, imutavel'} |

## Aggregates

| ${isEN ? 'Root' : 'Raiz'} | ${isEN ? 'Included entities' : 'Entidades incluidas'} | ${isEN ? 'Main invariant' : 'Invariante principal'} |
|------|---------------------|---------------------|
| _ex: Order_ | OrderItem, ShippingAddress | ${isEN ? 'total > 0' : 'total > 0'} |

## ${isEN ? 'See also' : 'Ver tambem'}

- [[Bounded Contexts]]
- [[${isEN ? 'Domain Events' : 'Eventos de Dominio'}]]
`
}

function buildDomainEvents(lang) {
  const isEN = lang === 'en'
  const back = isEN ? 'Project Memory' : 'Memoria Projeto'
  const title = isEN ? 'Domain Events' : 'Eventos de Dominio'
  const tags = isEN ? '#domain #ddd #events' : '#dominio #ddd #eventos'
  const callout = isEN
    ? 'Facts that happened in the domain — past-tense naming'
    : 'Fatos que aconteceram no dominio — nomenclatura no passado'

  return `# ${title}

${tags}

> [!abstract] ${callout}

> [!tip] ${isEN
    ? 'Domain Events represent something the business cares about. Ex: UserRegistered, OrderPlaced, PaymentFailed.'
    : 'Domain Events representam algo que o negocio se importa. Ex: UserRegistered, OrderPlaced, PaymentFailed.'}

${isEN ? 'Back' : 'Voltar'}: [[${back}]]

---

| ${isEN ? 'Event' : 'Evento'} | ${isEN ? 'Emitted by' : 'Emitido por'} | ${isEN ? 'Data' : 'Dados'} | ${isEN ? 'Subscribers' : 'Assinantes'} |
|--------|-------------|-------|------------|
| _ex: UserRegistered_ | User aggregate | userId, email, createdAt | EmailService, AuditLog |

## ${isEN ? 'See also' : 'Ver tambem'}

- [[${isEN ? 'Entities' : 'Entidades'}]]
- [[Bounded Contexts]]
`
}

function buildBoundedContexts(lang) {
  const isEN = lang === 'en'
  const back = isEN ? 'Project Memory' : 'Memoria Projeto'
  const title = isEN ? 'Bounded Contexts' : 'Bounded Contexts'
  const tags = isEN ? '#architecture #ddd' : '#arquitetura #ddd'
  const callout = isEN
    ? 'Context boundaries — each context has its own model and language'
    : 'Fronteiras de contexto — cada contexto tem seu modelo e linguagem proprios'

  return `# ${title}

${tags}

> [!abstract] ${callout}

> [!tip] ${isEN
    ? 'Rule: do NOT import entities from another context directly — communicate via events or DTOs.'
    : 'Regra: NAO importar entidades de outro contexto diretamente — comunicar via eventos ou DTOs.'}

${isEN ? 'Back' : 'Voltar'}: [[${back}]]

---

| ${isEN ? 'Context' : 'Contexto'} | ${isEN ? 'Responsibility' : 'Responsabilidade'} | ${isEN ? 'Main model' : 'Modelo principal'} | ${isEN ? 'Communication' : 'Comunicacao'} |
|----------|-----------------|-----------------|-------------|
| _ex: Auth_ | ${isEN ? 'authentication and sessions' : 'autenticacao e sessoes'} | User, Session | ${isEN ? 'emits UserLoggedIn' : 'emite UserLoggedIn'} |

## ${isEN ? 'Dependency map' : 'Mapa de dependencias'}

_(${isEN ? 'how the contexts communicate' : 'como os contextos se comunicam'})_

## ${isEN ? 'Frontend: Feature Modules as Bounded Contexts' : 'Frontend: Feature Modules como Bounded Contexts'}

${isEN
  ? `Each feature (\`/auth\`, \`/dashboard\`, \`/payments\`) is a bounded context:
- Has its own types/interfaces
- Does not import directly from another feature — uses shared/ or events
- Same vocabulary as the backend (do NOT rename \`user\` to \`loggedPerson\`)`
  : `Cada feature (\`/auth\`, \`/dashboard\`, \`/payments\`) e um bounded context:
- Tem seus proprios types/interfaces
- Nao importa diretamente de outro feature — usa shared/ ou eventos
- Mesmo vocabulario que o back (NAO renomear \`user\` para \`loggedPerson\`)`}

## ${isEN ? 'See also' : 'Ver tambem'}

- [[${isEN ? 'Entities' : 'Entidades'}]]
- [[${isEN ? 'Domain Events' : 'Eventos de Dominio'}]]
`
}

function buildCleanArch(lang) {
  const isEN = lang === 'en'
  const back = isEN ? 'Project Memory' : 'Memoria Projeto'
  const domainEventsLink = isEN ? 'Domain Events' : 'Eventos de Dominio'

  return `# Clean Architecture

${isEN ? '#architecture #clean-arch #ddd #solid' : '#arquitetura #clean-arch #ddd #solid'}

> [!abstract] ${isEN ? 'Layers + DDD building blocks + SOLID' : 'Camadas + DDD building blocks + SOLID'}

${isEN ? 'Back' : 'Voltar'}: [[${back}]]

---

## ${isEN ? 'Layers' : 'Camadas'}

| ${isEN ? 'Layer' : 'Camada'} | ${isEN ? 'Responsibility' : 'Responsabilidade'} | ${isEN ? 'Can depend on' : 'Pode depender de'} |
|--------|-----------------|-----------------|
| **Domain** | ${isEN ? 'Entities, VOs, Aggregates, Domain Services, Domain Events' : 'Entities, VOs, Aggregates, Domain Services, Domain Events'} | ${isEN ? 'Nothing' : 'Nada'} |
| **Application** | ${isEN ? 'Use Cases, Application Services, Commands/Queries' : 'Use Cases, Application Services, Commands/Queries'} | Domain |
| **Infrastructure** | ${isEN ? 'Repositories, Adapters, External APIs, DB' : 'Repositories, Adapters, APIs externas, DB'} | Application, Domain |
| **Presentation** | ${isEN ? 'Controllers, UI Components, Hooks' : 'Controllers, UI Components, Hooks'} | Application |

> ${isEN ? 'Dependencies point INWARD. Domain does not know Infrastructure.' : 'Dependencias apontam para DENTRO. Domain nao conhece Infrastructure.'}

---

## DDD Building Blocks

### Entity
- ${isEN ? 'Has identity (unique ID)' : 'Tem identidade (ID unico)'}
- ${isEN ? 'Mutable over time' : 'Mutavel ao longo do tempo'}
- ${isEN ? 'Equality by ID' : 'Igualdade por ID'}
- ${isEN ? 'Ex: User, Order, Product' : 'Ex: User, Order, Product'}

### Value Object
- ${isEN ? 'No own identity' : 'Sem identidade propria'}
- ${isEN ? 'Immutable — create new instead of modifying' : 'Imutavel — criar novo ao inves de modificar'}
- ${isEN ? 'Equality by value of all fields' : 'Igualdade por valor de todos os campos'}
- ${isEN ? 'Ex: Money, Email, Address' : 'Ex: Money, Email, Address, CPF'}

### Aggregate
- ${isEN ? 'Consistency root (Aggregate Root)' : 'Raiz de consistencia (Aggregate Root)'}
- ${isEN ? 'External operations ALWAYS go through the root' : 'Operacoes externas passam SEMPRE pela raiz'}
- ${isEN ? 'Defines transactional boundary' : 'Define fronteira transacional'}
- ${isEN ? 'Ex: Order (root) + OrderItems + ShippingAddress' : 'Ex: Order (raiz) + OrderItems + ShippingAddress'}

### Domain Service
- ${isEN ? 'Domain logic that does not belong to a specific entity' : 'Logica de dominio que nao pertence a uma entidade especifica'}
- ${isEN ? 'No own state' : 'Sem estado proprio'}
- ${isEN ? 'Ex: PricingService, TaxCalculator' : 'Ex: PricingService, TaxCalculator'}

### Domain Event
- ${isEN ? 'Something important happened in the domain' : 'Algo importante aconteceu no dominio'}
- ${isEN ? 'Past-tense naming: UserRegistered, OrderPlaced' : 'Nomenclatura no passado: UserRegistered, OrderPlaced'}
- ${isEN ? 'See' : 'Ver'}: [[${domainEventsLink}]]

### Repository
- ${isEN ? 'Interface defined in Domain' : 'Interface definida no Domain'}
- ${isEN ? 'Implementation in Infrastructure' : 'Implementacao na Infrastructure'}
- ${isEN ? 'Completely abstracts persistence' : 'Abstrai persistencia completamente'}

---

## SOLID

| ${isEN ? 'Principle' : 'Principio'} | ${isEN ? 'Rule' : 'Regra'} | ${isEN ? 'Common violation' : 'Violacao comum'} |
|-----------|-------|---------------|
| **S** Single Responsibility | ${isEN ? 'One class = one reason to change' : 'Uma classe = uma razao para mudar'} | ${isEN ? 'Service with business logic + db access + email sending' : 'Service com logica de negocio + acesso a banco + envio de email'} |
| **O** Open/Closed | ${isEN ? 'Extend without modifying' : 'Estender sem modificar'} | ${isEN ? 'cascading if/else instead of strategy pattern' : 'if/else cascata em vez de strategy pattern'} |
| **L** Liskov Substitution | ${isEN ? 'Subtypes interchangeable with base type' : 'Subtipos intercambiaveis com tipo base'} | ${isEN ? 'Override that breaks the interface contract' : 'Override que quebra contrato da interface'} |
| **I** Interface Segregation | ${isEN ? 'Specific interfaces, not one fat one' : 'Interfaces especificas, nao uma gorda'} | ${isEN ? 'Interface with 15 methods of which the client uses 2' : 'Interface com 15 metodos dos quais o cliente usa 2'} |
| **D** Dependency Inversion | ${isEN ? 'Depend on abstractions, inject concretes' : 'Depender de abstracoes, injetar concretos'} | ${isEN ? '`new ConcreteRepository()` inside the service' : '`new ConcreteRepository()` dentro do service'} |

---

## ${isEN ? 'Frontend: SOLID + DDD adapted' : 'Frontend: SOLID + DDD adaptado'}

| ${isEN ? 'Concept' : 'Conceito'} | Frontend |
|----------|----------|
| Entity/VO | ${isEN ? 'TypeScript types/interfaces that mirror the backend domain' : 'TypeScript types/interfaces que espelham o dominio do back'} |
| Bounded Context | ${isEN ? 'Feature module (`/auth`, `/payments`) — do not import from another feature directly' : 'Feature module (`/auth`, `/payments`) — nao importar de outro feature diretamente'} |
| Domain Service | ${isEN ? 'Custom hook or composable that encapsulates UI business logic' : 'Custom hook ou composable que encapsula logica de negocio de UI'} |
| Repository | ${isEN ? 'Service layer — all fetch/axios centralized, never inside a component' : 'Service layer — todo fetch/axios centralizado, nunca dentro de componente'} |
| S — SRP | ${isEN ? 'One component = one visual or interaction responsibility' : 'Um componente = uma responsabilidade visual ou de interacao'} |
| O — OCP | ${isEN ? 'Component composition instead of excessive conditional props' : 'Composicao de componentes em vez de props condicionais excessivos'} |
| D — DIP | ${isEN ? 'Inject services via props/context, do not import directly' : 'Injetar servicos via props/context, nao importar diretamente'} |

## ${isEN ? 'See also' : 'Ver tambem'}

- [[${isEN ? 'Entities' : 'Entidades'}]]
- [[Bounded Contexts]]
- [[${isEN ? 'Domain Events' : 'Eventos de Dominio'}]]
`
}

function buildEmptyNote(title, tags, callout, back, lang) {
  const isEN = lang === 'en'
  return `# ${title}

${tags}

> [!abstract] ${callout}

${isEN ? 'Back' : 'Voltar'}: [[${back}]]

---

_(${isEN ? 'fill in as the project evolves' : 'preencher conforme o projeto evolui'})_
`
}

function buildManifesto(lang) {
  const isEN = lang === 'en'
  return `# ${isEN ? 'Manifesto' : 'Manifesto'}

${isEN ? '#framework #philosophy' : '#framework #filosofia'}

---

## ${isEN ? 'The problem' : 'O problema'}

${isEN
    ? 'AI hallucinates because it lacks context. It invents fields that do not exist, ignores validated rules, duplicates logic, breaks patterns. The larger the project grows, the worse it gets — because AI forgets everything each conversation.'
    : 'AI alucina porque nao tem contexto. Inventa campos que nao existem, ignora regras validadas, duplica logica, quebra padroes. Quanto mais o projeto cresce, pior fica — porque o AI esquece tudo a cada conversa.'}

## ${isEN ? 'The solution' : 'A solucao'}

${isEN
    ? 'Structure project context so that AI (or any engineer) can produce precise, consistent code aligned with team decisions.'
    : 'Estruturar o contexto do projeto de forma que o AI (ou qualquer engenheiro) consiga produzir codigo preciso, consistente e alinhado com as decisoes do time.'}

## ${isEN ? 'Principles' : 'Principios'}

1. **${isEN ? 'Vault > memory > code' : 'Vault > memoria > codigo'}** — ${isEN ? 'always consult the vault before implementing' : 'sempre consultar o vault antes de implementar'}
2. **${isEN ? 'Mandatory tests' : 'Testes obrigatorios'}** — ${isEN ? 'code without tests does not exist' : 'codigo sem teste nao existe'}
3. **${isEN ? 'Do not guess' : 'Nao adivinhar'}** — ${isEN ? 'if not decided, ask' : 'se nao esta decidido, perguntar'}
4. **${isEN ? 'Do not duplicate' : 'Nao duplicar'}** — ${isEN ? 'if it already exists, reuse it' : 'se ja existe, reutilizar'}
5. **${isEN ? 'Do not re-discuss' : 'Nao rediscutir'}** — ${isEN ? 'if locked, respect it' : 'se esta travado, respeitar'}
`
}

function buildHealthCheck(lang) {
  const isEN = lang === 'en'
  const back = isEN ? 'Project Memory' : 'Memoria Projeto'
  return `# ${isEN ? 'Health Check' : 'Health Check'}

${isEN ? '#framework #health' : '#framework #saude'}

> [!abstract] ${isEN ? 'Is the vault healthy?' : 'O vault esta saudavel?'}

${isEN ? 'Back' : 'Voltar'}: [[${back}]]

---

| ${isEN ? 'Question' : 'Pergunta'} | ${isEN ? 'Note' : 'Nota'} |
|----------|------|
| ${isEN ? 'AI knows what the project does?' : 'AI sabe o que o projeto faz?'} | [[${isEN ? 'Project Memory' : 'Memoria Projeto'}]] |
| ${isEN ? 'AI speaks the right language?' : 'AI fala a lingua certa?'} | [[${isEN ? 'Domain Glossary' : 'Glossario de Dominio'}]] |
| ${isEN ? 'AI knows the database fields?' : 'AI sabe os campos do banco?'} | [[${isEN ? 'Entities' : 'Entidades'}]] |
| ${isEN ? 'AI knows the code pattern?' : 'AI sabe o padrao de codigo?'} | [[${isEN ? 'Code Patterns' : 'Padroes de Codigo'}]] |
| ${isEN ? 'AI knows what NOT to do?' : 'AI sabe o que NAO fazer?'} | [[Anti-patterns]] |
| ${isEN ? 'AI knows the rules?' : 'AI sabe as regras?'} | [[${isEN ? 'General Rules' : 'Regras Gerais'}]] |
| ${isEN ? 'AI knows what was decided?' : 'AI sabe o que ja decidiu?'} | [[${isEN ? 'Locked Definitions' : 'Definicoes Travadas'}]] |
| ${isEN ? 'AI knows what is pending?' : 'AI sabe o que falta decidir?'} | [[${isEN ? 'Open Questions' : 'Questoes em Aberto'}]] |
| ${isEN ? 'AI knows where each module lives?' : 'AI sabe onde mora cada modulo?'} | [[${isEN ? 'Module Map' : 'Mapa de Modulos'}]] |
| ${isEN ? 'AI knows how to test?' : 'AI sabe como testar?'} | [[${isEN ? 'Test Strategy' : 'Estrategia de Testes'}]] |
`
}

function buildChangelog(lang) {
  const isEN = lang === 'en'
  const back = isEN ? 'Project Memory' : 'Memoria Projeto'
  return `# Changelog

${isEN ? '#changelog' : '#changelog'}

> [!abstract] ${isEN ? 'Release history and milestones' : 'Historico de versoes e marcos'}

${isEN ? 'Back' : 'Voltar'}: [[${back}]]

---

## [Unreleased]

### ${isEN ? 'Added' : 'Adicionado'}
-

### ${isEN ? 'Changed' : 'Alterado'}
-

---

## [v0.1.0] — ${new Date().toISOString().split('T')[0]}

- ${isEN ? 'Project initialized with Cortex' : 'Projeto inicializado com Cortex'}
`
}

function buildSpec(vars) {
  const langDir = vars.LANG === 'en' ? 'en' : 'pt'
  const specContent = readFileSync(join(TEMPLATES, langDir, 'vault-spec.md'), 'utf8')
  return specContent
    .replace(/\{\{NAME\}\}/g, vars.NAME)
    .replace(/\{\{DESCRIPTION\}\}/g, vars.DESCRIPTION)
    .replace(/\{\{STACK\}\}/g, vars.STACK)
    .replace(/\{\{DATE\}\}/g, vars.DATE)
    .replace(/\{\{MODE\}\}/g, vars.MODE)
    .replace(/\{\{LANG\}\}/g, vars.LANG)
}

// --- Helpers ---

/**
 * Lê o Projeto.md/Project.md do vault Freestyled e extrai name/description/stack.
 * @param {'pt'|'en'} lang
 * @param {{ cwd?: string }} [opts] cwd do projeto (default: process.cwd())
 */
export function readFreestyledRoot(lang, opts) {
  const cwd = opts?.cwd ?? process.cwd()
  const vaultName = readVaultName({ cwd })
  const vaultPath = join(cwd, vaultName)
  const rootFile = lang === 'en' ? 'Project.md' : 'Projeto.md'
  const filePath = join(vaultPath, rootFile)
  if (!existsSync(filePath)) return {}

  const lines = readFileSync(filePath, 'utf8').split('\n')

  const name = (lines.find(l => l.startsWith('# ')) || '').replace(/^# /, '').trim()

  const sobreIdx = lines.findIndex(l => /^## (Sobre|About)/.test(l))
  let description = ''
  if (sobreIdx >= 0) {
    for (let i = sobreIdx + 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line && !line.startsWith('#') && !line.startsWith('|') && !line.startsWith('-') && !line.startsWith('`')) {
        description = line
        break
      }
    }
  }

  const stackLine = lines.find(l => l.includes('**Stack**'))
  const stack = stackLine ? (stackLine.split('|')[2] || '').trim() : ''

  return { name, description, stack }
}

// Escreve todas as notas do modo Projeto (exceto Memoria Projeto.md que é tratada separadamente)
// safe = true: só cria arquivos que não existem (usado na migração)
function writeProjetoNotes(vaultPath, vars, safe = false) {
  const { LANG } = vars
  const isEN = LANG === 'en'
  const back = isEN ? 'Project Memory' : 'Memoria Projeto'

  const w = (file, content) => {
    const p = join(vaultPath, file)
    if (safe && existsSync(p)) return
    writeFileSync(p, content)
  }

  // Raiz
  w('MANIFESTO.md', buildManifesto(LANG))
  w('Health Check.md', buildHealthCheck(LANG))
  w('Changelog.md', buildChangelog(LANG))
  w(isEN ? 'Technical FAQ.md' : 'FAQ Tecnico.md',
    buildEmptyNote(isEN ? 'Technical FAQ' : 'FAQ Tecnico', '#faq', isEN ? 'Frequently asked questions' : 'Perguntas frequentes', back, LANG))
  w('Getting Started.md',
    buildEmptyNote('Getting Started', '#framework #onboarding', isEN ? '3 modes, 1 principle: nothing is lost' : '3 modos, 1 principio: nada se perde', back, LANG))

  // Sessoes index
  const sessDir = isEN ? 'Sessions' : 'Sessoes'
  w(join(sessDir, isEN ? 'Sessions - Temporal Memory.md' : 'Sessoes - Memoria Temporal.md'), buildSessionsIndex(LANG))

  // Decisoes
  const decDir = isEN ? 'Decisions' : 'Decisoes'
  w(join(decDir, isEN ? 'Locked Definitions.md' : 'Definicoes Travadas.md'), buildLockedDefinitions(LANG))
  w(join(decDir, isEN ? 'Open Questions.md' : 'Questoes em Aberto.md'),
    buildEmptyNote(isEN ? 'Open Questions' : 'Questoes em Aberto', isEN ? '#decisions' : '#decisoes', isEN ? 'Items requiring definition before implementing' : 'Itens que precisam de definicao antes de implementar', back, LANG))
  w(join(decDir, 'Anti-patterns.md'),
    buildEmptyNote('Anti-patterns', isEN ? '#decisions' : '#decisoes', isEN ? 'What NEVER to do in this project' : 'O que NUNCA fazer neste projeto', back, LANG))

  // Dominio
  const domDir = isEN ? 'Domain' : 'Dominio'
  w(join(domDir, isEN ? 'Domain Glossary.md' : 'Glossario de Dominio.md'),
    buildEmptyNote(isEN ? 'Domain Glossary' : 'Glossario de Dominio', isEN ? '#domain' : '#dominio', isEN ? 'Business terms' : 'Termos do negocio', back, LANG))
  w(join(domDir, isEN ? 'Entities.md' : 'Entidades.md'), buildEntidades(LANG))
  w(join(domDir, isEN ? 'Domain Events.md' : 'Eventos de Dominio.md'), buildDomainEvents(LANG))

  // Arquitetura
  const archDir = isEN ? 'Architecture' : 'Arquitetura'
  const archNotes = isEN ? [
    { file: 'Code Patterns.md',          title: 'Code Patterns',           tags: '#architecture',       callout: 'Real examples — copy, do not invent' },
    { file: 'Module Map.md',             title: 'Module Map',              tags: '#architecture',       callout: 'Who does what — module dependencies' },
    { file: 'Test Strategy.md',          title: 'Test Strategy',           tags: '#architecture',       callout: 'How to test in this project — tests are mandatory' },
    { file: 'API Contracts.md',          title: 'API Contracts',           tags: '#architecture',       callout: 'Endpoints exposed by the system (back → front)' },
    { file: 'Architecture Decisions.md', title: 'Architecture Decisions',  tags: '#architecture #adr',  callout: 'ADRs — Architecture Decision Records' },
    { file: 'Integrations.md',           title: 'Integrations',            tags: '#architecture',       callout: 'External services consumed by the system' },
  ] : [
    { file: 'Padroes de Codigo.md',       title: 'Padroes de Codigo',       tags: '#arquitetura',        callout: 'Exemplos reais — copiar, nao inventar' },
    { file: 'Mapa de Modulos.md',         title: 'Mapa de Modulos',         tags: '#arquitetura',        callout: 'Quem faz o que — dependencias entre modulos' },
    { file: 'Estrategia de Testes.md',    title: 'Estrategia de Testes',    tags: '#arquitetura',        callout: 'Como testar neste projeto — testes obrigatorios' },
    { file: 'Contratos API.md',           title: 'Contratos API',           tags: '#arquitetura',        callout: 'Endpoints que o sistema expoe (back → front)' },
    { file: 'Decisoes de Arquitetura.md', title: 'Decisoes de Arquitetura', tags: '#arquitetura #adr',   callout: 'ADRs — Architectural Decision Records' },
    { file: 'Integracoes.md',             title: 'Integracoes',             tags: '#arquitetura',        callout: 'Servicos externos consumidos pelo sistema' },
  ]

  for (const note of archNotes) {
    w(join(archDir, note.file), buildEmptyNote(note.title, note.tags, note.callout, back, LANG))
  }
  w(join(archDir, 'Clean Architecture.md'), buildCleanArch(LANG))
  w(join(archDir, 'Bounded Contexts.md'), buildBoundedContexts(LANG))

  // Regras de negocio
  const rulesDir = isEN ? 'Business Rules' : 'Regras de Negocio'
  w(join(rulesDir, isEN ? 'General Rules.md' : 'Regras Gerais.md'),
    buildEmptyNote(isEN ? 'General Rules' : 'Regras Gerais', isEN ? '#rules' : '#regras', isEN ? 'Validated rules that govern the system' : 'Regras validadas que governam o sistema', back, LANG))
}

// --- Main ---

export function createVault(vars) {
  const { LANG, MODE } = vars
  const vaultName = slugifyVaultName(vars.NAME)
  writeFileSync(join(process.cwd(), '.cortex'), JSON.stringify({ vault: vaultName }))
  const vaultPath = join(process.cwd(), vaultName)
  const isEN = LANG === 'en'
  const isLivre = MODE === 'Freestyled' || MODE === 'Livre' || MODE === 'Free'
  const dirs = DIRS[isEN ? 'en' : 'pt'][isLivre ? 'livre' : 'projeto']

  mkdirSync(vaultPath, { recursive: true })
  for (const dir of dirs) {
    mkdirSync(join(vaultPath, dir), { recursive: true })
  }

  writeFileSync(join(vaultPath, '.gitignore'), '# Obsidian\n.obsidian/\n.trash/\n')
  writeFileSync(join(vaultPath, '.spec.md'), buildSpec(vars))

  if (isLivre) {
    writeFileSync(join(vaultPath, isEN ? 'Project.md' : 'Projeto.md'), buildLivreRoot(vars, LANG))
    console.log(t(LANG, 'vaultLog.created'))
    return
  }

  // Modo Projeto
  writeFileSync(join(vaultPath, isEN ? 'Project Memory.md' : 'Memoria Projeto.md'), buildProjectMemory(vars, LANG))
  writeProjetoNotes(vaultPath, vars)
  console.log(t(LANG, 'vaultLog.created'))
}

export function migrateVault(vars) {
  const { LANG } = vars
  const vaultName = slugifyVaultName(vars.NAME)
  writeFileSync(join(process.cwd(), '.cortex'), JSON.stringify({ vault: vaultName }))
  const vaultPath = join(process.cwd(), vaultName)
  const isEN = LANG === 'en'
  const freeRootName = isEN ? 'Project' : 'Projeto'

  // Criar diretórios do Projeto que não existem no Freestyled
  const newDirs = DIRS[isEN ? 'en' : 'pt'].projeto.filter(d =>
    !DIRS[isEN ? 'en' : 'pt'].livre.includes(d)
  )
  for (const dir of newDirs) {
    mkdirSync(join(vaultPath, dir), { recursive: true })
  }

  // Atualizar .spec.md com spec do Projeto
  writeFileSync(join(vaultPath, '.spec.md'), buildSpec(vars))

  // Criar Memoria Projeto.md com referência ao contexto original
  const memFile = isEN ? 'Project Memory.md' : 'Memoria Projeto.md'
  const migrationNote = [
    '',
    '---',
    '',
    `> [!info] ${isEN ? 'Migrated from Freestyled' : 'Migrado de Freestyled'}`,
    `> ${isEN ? 'Original context' : 'Contexto original'}: [[${freeRootName}]] · ${isEN ? 'Sessions and contexts preserved.' : 'Sessoes e contextos preservados.'}`,
    '',
  ].join('\n')
  writeFileSync(join(vaultPath, memFile), buildProjectMemory(vars, LANG) + migrationNote)

  // Criar notas do Projeto sem sobrescrever o que já existe
  writeProjetoNotes(vaultPath, vars, true)

  console.log(t(LANG, 'vaultLog.migrated'))
}

export function archiveVault(date, lang = 'pt') {
  const vaultName = readVaultName()
  const vaultPath = join(process.cwd(), vaultName)

  // Evita conflito se ja existe arquivo do mesmo dia
  const anteriorBase = join(vaultPath, 'Anterior')
  let archiveName = date
  if (existsSync(join(anteriorBase, date))) {
    archiveName = `${date}-${Date.now()}`
  }

  const archiveDir = join(anteriorBase, archiveName)
  mkdirSync(archiveDir, { recursive: true })

  for (const entry of readdirSync(vaultPath, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'Anterior') continue
    const src = join(vaultPath, entry.name)
    const dest = join(archiveDir, entry.name)
    cpSync(src, dest, { recursive: true })
    rmSync(src, { recursive: true, force: true })
  }

  console.log(t(lang, 'vaultLog.archived', { archiveName }))
}
