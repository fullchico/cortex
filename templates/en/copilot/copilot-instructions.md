# Cortex — AI Memory Framework

This project uses the Cortex framework. The context vault is at `./.cortex/`.

## Consultation protocol (MANDATORY)

BEFORE writing any code, read these vault notes:

### For coding

1. `./.cortex/Domain/Entities.md` — real database fields. Do NOT invent fields.
2. `./.cortex/Architecture/Code Patterns.md` — copy existing patterns. Do NOT invent structure.
3. `./.cortex/Decisions/Anti-patterns.md` — list of what to NEVER do in this project.
4. `./.cortex/Architecture/Module Map.md` — check if module/logic already exists.
5. `./.cortex/Architecture/Test Strategy.md` — how to test in this project.
6. `./.cortex/Architecture/Bounded Contexts.md` — correct bounded context. Do NOT cross boundaries.
7. `./.cortex/Architecture/Clean Architecture.md` — correct layer + DDD building block + SOLID.

### For decisions

8. `./.cortex/Decisions/Locked Definitions.md` — immutable decisions. Do NOT re-open.
9. `./.cortex/Decisions/Open Questions.md` — if not decided, ASK.
10. `./.cortex/Business Rules/General Rules.md` — real formulas and logic. Do NOT guess.

### For integration

11. `./.cortex/Architecture/API Contracts.md` — real request/response shape.
12. `./.cortex/Domain/Domain Glossary.md` — correct domain terms.

## Contexts

The vault uses contexts to organize knowledge by area (e.g. auth, dashboard, payments).

When starting work in an area:
- Read `./.cortex/Sessions/contexts/<area>.md`
- Read contexts listed in `depends:` in the header

## Sessions

At the start of work, read:
- `./.cortex/Project Memory.md` (or `Memoria Projeto.md`)
- Recent files in `./.cortex/Sessions/timeline/`
- Relevant context in `./.cortex/Sessions/contexts/`

At the end, create/update:
- `./.cortex/Sessions/timeline/YYYY-MM-DD.md` — one note per day
- `./.cortex/Sessions/contexts/<area>.md` — if you worked in a specific area

## Mandatory rules

- **Vault = source of truth** — vault > memory > code
- **Do NOT guess** — if it is not in the vault, ask
- **Do NOT re-open** — if it is in Locked Definitions, respect it
- **Do NOT duplicate** — if it exists elsewhere, reuse
- **Tests are mandatory** — code without tests does not exist

## When completing a task

Suggest the user record in the vault:
- New term → `./.cortex/Domain/Domain Glossary.md`
- Field/entity → `./.cortex/Domain/Entities.md`
- Pattern → `./.cortex/Architecture/Code Patterns.md`
- Anti-pattern → `./.cortex/Decisions/Anti-patterns.md`
- Decision → `./.cortex/Decisions/Locked Definitions.md`
- Question → `./.cortex/Decisions/Open Questions.md`
- Module/endpoint → `./.cortex/Architecture/Module Map.md` or `API Contracts.md`
