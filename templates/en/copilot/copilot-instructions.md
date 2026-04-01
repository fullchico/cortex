# Cortex — AI Memory Framework

This project uses the Cortex framework. The vault is at `./<vault>/` — name detected via `.cortex` marker.

## Detect vault (mandatory first step)

Read the `.cortex` file at the project root:
- If it exists: `vault = JSON.parse(.cortex).vault` (e.g. `{"vault":"my-app"}` → vault = `my-app`)
- If it does not exist: `vault = cortex` (fallback)
- If the `<vault>/` folder does not exist: suggest `npx cortex-ai` to initialize

All paths below use `./<vault>/` with the detected value.

## Consultation protocol (MANDATORY)

BEFORE writing any code, read these vault notes:

### For coding

1. `./<vault>/Domain/Entities.md` — real database fields. Do NOT invent fields.
2. `./<vault>/Architecture/Code Patterns.md` — copy existing patterns. Do NOT invent structure.
3. `./<vault>/Decisions/Anti-patterns.md` — list of what to NEVER do in this project.
4. `./<vault>/Architecture/Module Map.md` — check if module/logic already exists.
5. `./<vault>/Architecture/Test Strategy.md` — how to test in this project.
6. `./<vault>/Architecture/Bounded Contexts.md` — correct bounded context. Do NOT cross boundaries.
7. `./<vault>/Architecture/Clean Architecture.md` — correct layer + DDD building block + SOLID.

### For decisions

8. `./<vault>/Decisions/Locked Definitions.md` — immutable decisions. Do NOT re-open.
9. `./<vault>/Decisions/Open Questions.md` — if not decided, ASK.
10. `./<vault>/Business Rules/General Rules.md` — real formulas and logic. Do NOT guess.

### For integration

11. `./<vault>/Architecture/API Contracts.md` — real request/response shape.
12. `./<vault>/Domain/Domain Glossary.md` — correct domain terms.

## Contexts

The vault uses contexts to organize knowledge by area (e.g. auth, dashboard, payments).

When starting work in an area:
- Read `./<vault>/Sessions/contexts/<area>.md`
- Read contexts listed in `depends:` in the header

## Sessions

At the start of work, read:
- `./<vault>/Project Memory.md` (or `Memoria Projeto.md`)
- Recent files in `./<vault>/Sessions/timeline/`
- Relevant context in `./<vault>/Sessions/contexts/`

At the end, create/update:
- `./<vault>/Sessions/timeline/YYYY-MM-DD.md` — one note per day
- `./<vault>/Sessions/contexts/<area>.md` — if you worked in a specific area

## Mandatory rules

- **Vault = source of truth** — vault > memory > code
- **Do NOT guess** — if it is not in the vault, ask
- **Do NOT re-open** — if it is in Locked Definitions, respect it
- **Do NOT duplicate** — if it exists elsewhere, reuse
- **Tests are mandatory** — code without tests does not exist

## When completing a task

Suggest the user record in the vault:
- New term → `./<vault>/Domain/Domain Glossary.md`
- Field/entity → `./<vault>/Domain/Entities.md`
- Pattern → `./<vault>/Architecture/Code Patterns.md`
- Anti-pattern → `./<vault>/Decisions/Anti-patterns.md`
- Decision → `./<vault>/Decisions/Locked Definitions.md`
- Question → `./<vault>/Decisions/Open Questions.md`
- Module/endpoint → `./<vault>/Architecture/Module Map.md` or `API Contracts.md`
