# Cortex Vault Spec

> Blueprint do vault. O CLI usa este arquivo para projetar as notas.
> Edite à vontade para customizar a estrutura do seu projeto.

---

## Configuração

```
name: {{NAME}}
description: {{DESCRIPTION}}
stack: {{STACK}}
date: {{DATE}}
mode: {{MODE}}
lang: {{LANG}}
```

---

## Notas raiz

### project-memory
file:
  pt: Memoria Projeto.md
  en: Project Memory.md
path: /
tags: [moc, projeto, memoria]
vars: [NAME, DESCRIPTION, STACK, DATE, MODE, LANG]
sections:
  - callout  | Segundo cerebro do projeto        | Project second brain           | abstract
  - nav      | Navegacao rapida                  | Quick navigation               | table
  - about    | Sobre o projeto                   | About the project              | table:NAME,DESCRIPTION,STACK,DATE
  - status   | Estado do projeto                 | Project status                 | checklist
  - protocol | Protocolo de consulta do AI       | AI consultation protocol       | checklist

### manifesto
file:
  pt: MANIFESTO.md
  en: MANIFESTO.md
path: /
tags: [framework, filosofia]
sections:
  - text | O problema        | The problem       | text
  - text | A solucao         | The solution      | text
  - text | Os 3 pilares      | The 3 pillars     | text
  - text | Principios        | Principles        | text

### getting-started
file:
  pt: Getting Started.md
  en: Getting Started.md
path: /
tags: [framework, onboarding]
sections:
  - text    | Qual modo?                    | Which mode?                   | text
  - text    | Vault minimo viavel           | Minimum viable vault          | checklist
  - text    | Manutencao — todos os modos   | Maintenance — all modes       | text
  - table   | Checklist de saude            | Health checklist              | table

### health-check
file:
  pt: Health Check.md
  en: Health Check.md
path: /
tags: [framework, saude]
sections:
  - table | Verificacoes        | Checks              | table:Verificacao,Como checar,Se falhar|Check,How to verify,If failing
  - table | Sinais de stale     | Stale signals       | table:Sinal,Gravidade,Significado|Signal,Severity,Meaning

### faq
file:
  pt: FAQ Tecnico.md
  en: Technical FAQ.md
path: /
tags: [faq, referencia]
sections:
  - text | Como usar          | How to use          | text
  - text | Regras de negocio  | Business rules      | text
  - text | Banco / Schema     | Database / Schema   | text
  - text | Codigo / Padroes   | Code / Patterns     | text
  - text | Endpoints / API    | Endpoints / API     | text

### changelog
file:
  pt: Changelog.md
  en: Changelog.md
path: /
tags: [changelog]
sections:
  - text | Unreleased   | Unreleased   | text
  - text | v0.1.0       | v0.1.0       | text

---

## Decisoes

### locked-definitions
file:
  pt: Definicoes Travadas.md
  en: Locked Definitions.md
path: Decisoes/ | Decisions/
tags: [decisoes]
sections:
  - callout | Regras confirmadas — nao alterar sem revisao | Confirmed rules — do not change without review | abstract
  - callout | Definicoes Travadas vs Regras de Negocio     | Locked Definitions vs Business Rules           | tip
  - table   | Decisao,Definicao,Data                       | Decision,Definition,Date                       | table

### open-questions
file:
  pt: Questoes em Aberto.md
  en: Open Questions.md
path: Decisoes/ | Decisions/
tags: [pendencias, decisoes]
sections:
  - callout   | Itens que precisam de definicao | Items requiring definition | warning
  - checklist | Pendentes                       | Pending                    | checklist
  - table     | Resolvidas                      | Resolved                   | table:Questao,Resolucao,Data|Question,Resolution,Date

### anti-patterns
file:
  pt: Anti-patterns.md
  en: Anti-patterns.md
path: Decisoes/ | Decisions/
tags: [decisoes, anti-patterns]
sections:
  - callout | O que NUNCA fazer neste projeto | What NEVER to do in this project | abstract
  - table   | Codigo                          | Code                             | table:Anti-pattern,Por que e ruim,Faca isso|Anti-pattern,Why it's bad,Do this instead
  - table   | Banco                           | Database                         | table:Anti-pattern,Por que e ruim,Faca isso|Anti-pattern,Why it's bad,Do this instead
  - table   | Arquitetura                     | Architecture                     | table:Anti-pattern,Por que e ruim,Faca isso|Anti-pattern,Why it's bad,Do this instead

---

## Dominio

### glossary
file:
  pt: Glossario de Dominio.md
  en: Domain Glossary.md
path: Dominio/ | Domain/
tags: [dominio, glossario]
sections:
  - callout | Termos do negocio      | Business terms        | abstract
  - table   | Termo,Sigla,Definicao  | Term,Acronym,Definition | table
  - table   | Enums / Tipos          | Enums / Types          | table:Nome,Valores,Descricao|Name,Values,Description

### entities
file:
  pt: Entidades.md
  en: Entities.md
path: Dominio/ | Domain/
tags: [dominio, entidades, schema]
sections:
  - callout | Campos reais do banco — consultar antes de codar | Real database fields — check before coding | abstract
  - callout | Mantenha atualizado                              | Keep updated                               | warning
  - text    | _(preencher conforme modelar)_                   | _(fill in as you model)_                   | text

---

## Arquitetura

### clean-architecture
file:
  pt: Clean Architecture.md
  en: Clean Architecture.md
path: Arquitetura/ | Architecture/
tags: [arquitetura, clean-arch]
sections:
  - callout | Principios de Clean Architecture | Clean Architecture principles | abstract
  - text    | As 4 camadas                     | The 4 layers                  | text
  - text    | Inversao de Dependencia (DIP)    | Dependency Inversion (DIP)    | text
  - table   | Checklist rapido                 | Quick checklist               | table
  - table   | Erros mais comuns                | Most common errors            | table:Erro,Consequencia,Solucao|Error,Consequence,Solution

### test-strategy
file:
  pt: Estrategia de Testes.md
  en: Test Strategy.md
path: Arquitetura/ | Architecture/
tags: [arquitetura, testes]
sections:
  - callout | Testes sao obrigatorios          | Tests are mandatory              | important
  - table   | Piramide de testes               | Test pyramid                     | table:Tipo,O que testa,Quantidade,Velocidade|Type,What it tests,Quantity,Speed
  - table   | Convencoes de teste              | Test conventions                 | table:Convencao,Regra|Convention,Rule
  - table   | O que NAO mockar                 | What NOT to mock                 | table:NAO mockar,Por que,Alternativa|Do not mock,Why,Alternative

### code-patterns
file:
  pt: Padroes de Codigo.md
  en: Code Patterns.md
path: Arquitetura/ | Architecture/
tags: [arquitetura, padroes]
sections:
  - callout | Exemplos reais de cada camada — copiar, nao inventar | Real examples per layer — copy, don't invent | abstract
  - text    | _(colar exemplos reais conforme o projeto evoluir)_  | _(paste real examples as project evolves)_   | text

### module-map
file:
  pt: Mapa de Modulos.md
  en: Module Map.md
path: Arquitetura/ | Architecture/
tags: [arquitetura, modulos]
sections:
  - callout | Quem faz o que — dependencias entre modulos | Who does what — module dependencies | abstract
  - table   | Modulo,Responsabilidade,Depende de,Expoe    | Module,Responsibility,Depends on,Exposes | table

### adr
file:
  pt: Decisoes de Arquitetura.md
  en: Architecture Decisions.md
path: Arquitetura/ | Architecture/
tags: [arquitetura, adr]
sections:
  - table | Stack tecnologica                | Technology stack               | table:Camada,Tecnologia,Motivo|Layer,Technology,Reason
  - text  | ADR-001 — _(titulo da decisao)_ | ADR-001 — _(decision title)_   | text

### api-contracts
file:
  pt: Contratos API.md
  en: API Contracts.md
path: Arquitetura/ | Architecture/
tags: [arquitetura, api]
sections:
  - callout | Endpoints que o sistema expoe (back→front) | Endpoints exposed by the system (back→front) | abstract
  - table   | Convencoes gerais                          | General conventions                          | table:Convencao,Valor|Convention,Value
  - table   | Erros padrao                               | Standard errors                              | table:Codigo,Significado|Code,Meaning
  - table   | Endpoints por modulo                       | Endpoints by module                          | table:Verbo,Rota,Descricao,Body,Response|Verb,Route,Description,Body,Response

### integrations
file:
  pt: Integracoes.md
  en: Integrations.md
path: Arquitetura/ | Architecture/
tags: [arquitetura, integracoes]
sections:
  - table | APIs consumidas      | Consumed APIs       | table:Servico,Base URL,Autenticacao,Uso|Service,Base URL,Auth,Usage
  - table | Webhooks recebidos   | Received webhooks   | table:Origem,Evento,Endpoint,Payload|Origin,Event,Endpoint,Payload

---

## Regras de Negocio

### business-rules
file:
  pt: Regras Gerais.md
  en: General Rules.md
path: Regras de Negocio/ | Business Rules/
tags: [regras, negocio]
sections:
  - callout | Regras validadas que governam o sistema     | Validated rules that govern the system | abstract
  - callout | Regras de Negocio vs Definicoes Travadas    | Business Rules vs Locked Definitions   | tip
  - text    | _(descrever regras conforme forem validadas) | _(describe rules as validated)_        | text

---

## Sessoes

### sessions-index
file:
  pt: Sessoes - Memoria Temporal.md
  en: Sessions - Temporal Memory.md
path: Sessoes/
tags: [sessoes, moc]
sections:
  - callout | O cerebro cronologico do projeto | The chronological brain of the project | abstract
  - table   | Sessoes registradas              | Registered sessions                    | table:Data,Sessao,Foco|Date,Session,Focus

---

## Templates internos

### context-template
> Template usado ao criar novos contextos com "cortex context <nome>"

```markdown
# {{CONTEXT_NAME}}

depends: []
tags: [contexto]

---

## Decisoes
| Decisao | Definicao | Data |
|---------|-----------|------|

## Padroes
-

## Bugs encontrados
-

## Sessoes
-
```

### timeline-template
> Template usado ao criar notas de timeline

```markdown
# {{DATE}}

tags: [sessao, timeline]

---

## Contextos tocados
-

## Decisoes
-

## Proximos passos
- [ ]
```
