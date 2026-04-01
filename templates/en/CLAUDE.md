# Cortex — AI Memory Framework

This project uses the Cortex framework. The vault lives at `./<vault>/` — name detected via `.cortex` marker.

## Detect vault (mandatory first step)

Read the `.cortex` file at the project root:
- If it exists: `vault = JSON.parse(.cortex).vault` (e.g. `{"vault":"my-app"}` → vault = `my-app`)
- If it does not exist: `vault = cortex` (fallback)
- If the vault folder does not exist: suggest `npx cortex-ai` to initialize

All paths below use `./<vault>/` with the detected value.

---

## Mandatory protocol — before coding

Detect language: if `./<vault>/Project Memory.md` exists → EN. If `./<vault>/Memoria Projeto.md` exists → PT.

**Before writing any code:**

1. Read `./<vault>/Domain/Entities.md` — real fields. Do NOT invent.
2. Read `./<vault>/Architecture/Code Patterns.md` — copy patterns. Do NOT improvise.
3. Read `./<vault>/Decisions/Anti-patterns.md` — what to NEVER do.
4. Read `./<vault>/Architecture/Module Map.md` — does it already exist? Do NOT duplicate.
5. Read `./<vault>/Architecture/Test Strategy.md` — tests are mandatory.

**DDD — before creating any class/type:**
- Identify: Entity (has ID) / Value Object (immutable, no ID) / Aggregate (consistency root)
- Bounded context: what am I creating and which context does it belong to?
- Read `./<vault>/Architecture/Bounded Contexts.md` — do not cross boundaries
- Read `./<vault>/Domain/Entities.md` — existing model, do not duplicate

**SOLID — when writing code:**
- S: does this class/component have a single reason to change?
- O: can I extend without modifying existing code?
- D: am I depending on abstractions, not concrete implementations?

**Before deciding:**

6. Read `./<vault>/Decisions/Locked Definitions.md` — do NOT re-open.
7. Read `./<vault>/Decisions/Open Questions.md` — not decided? ASK.
8. Read `./<vault>/Business Rules/General Rules.md` — real formulas. Do NOT guess.

**Before integrating:**

9. Read `./<vault>/Architecture/API Contracts.md` — real shape.
10. Read `./<vault>/Domain/Domain Glossary.md` — correct terms.

---

## cortex start [context]

When the user says "cortex start" or "start session":

1. Detect vault (see step above)
2. Detect language from the root note
3. Read `./<vault>/Project Memory.md` (or `Memoria Projeto.md`)
4. If a context is given (e.g. "cortex start auth"):
   - Read `./<vault>/Sessions/contexts/<context>.md`
   - Read `depends:` in the header and load each dependency
   - List files in `./<vault>/Sessions/timeline/` and read the 3 most recent
5. If no context: ask "what are you working on today?"
6. Summarize:

```
Session open — <PROJECT> (<DATE>)

Context: <name> [depends: ...]

Recent decisions:
- ...

Pending:
- [ ] ...

What should we do?
```

---

## cortex end

When the user says "cortex end" or "end session":

1. Analyze the full conversation and extract:
   - Decisions made
   - Patterns discovered
   - Bugs found
   - Next steps

2. Create/update `./<vault>/Sessions/timeline/YYYY-MM-DD.md`

3. If there was an active context:
   - Read `./<vault>/Sessions/contexts/<name>.md`
   - Update with decisions, patterns, bugs, session reference

4. If there was no active context:
   - Suggest: "We covered a lot on [topic]. Want to create a context?"

5. Update reference notes if anything changed:

| What happened | Update |
|-----------|-----------|
| Decision confirmed | `./<vault>/Decisions/Locked Definitions.md` |
| Question resolved | `./<vault>/Decisions/Open Questions.md` |
| New question | `./<vault>/Decisions/Open Questions.md` |
| Anti-pattern | `./<vault>/Decisions/Anti-patterns.md` |
| Entity created/changed | `./<vault>/Domain/Entities.md` |
| New term | `./<vault>/Domain/Domain Glossary.md` |
| New module | `./<vault>/Architecture/Module Map.md` |
| New endpoint | `./<vault>/Architecture/API Contracts.md` |

6. Improvement suggestions — check opportunities from the session:

| Opportunity | Check |
|---|---|
| Missing tests | Code without coverage or associated tests |
| Clean Code | Long functions, confusing names, unnecessary comments |
| Clean Architecture | Dependencies crossing wrong layers |
| SOLID | Single responsibility violated, open for modification, etc. |

Rule: **do not interrupt flow** — if you spot an opportunity, add it as `- [ ]` under Next steps in the timeline. Do not suggest what is already done.

If the vault has `./<vault>/Project.md` with a `## Best practices` section: prioritize those practices.

7. Update index `./<vault>/Sessions/Sessions - Temporal Memory.md`

8. Confirm:
```
Session saved:
- Timeline: ./<vault>/Sessions/timeline/YYYY-MM-DD.md
- Context updated: <name> (if applicable)
- Refs updated: [list]
- Suggestions: [list or "none"]
```

---

## cortex context <name>

When the user says "cortex context <name>":

1. Check if `./<vault>/Sessions/contexts/<name>.md` already exists
2. If not, create from template:

```markdown
# <name>

depends: []
tags: [context]

---

## Decisions
| Decision | Definition | Date |
|---------|-----------|------|

## Patterns
-

## Bugs found
-

## Sessions
-
```

3. Ask: "Does this context depend on any other? (e.g. auth, users)"
4. Fill `depends:` from the answer

---

## Rules

- Vault = source of truth (vault > memory > code)
- Read before adding — do NOT duplicate
- Do not guess — ask if it is not in the vault
- Do not re-open — respect Locked Definitions
- One timeline note per day — append if it already exists
