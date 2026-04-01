# CLI Subcommands Design

**Data:** 2026-04-01
**Escopo:** Adicionar subcomandos ao CLI `cortex-ai`, error boundary global e testes para `archiveVault`.

---

## Contexto

O CLI `npx @fullchico/cortex-ai` hoje é exclusivamente um installer — abre o fluxo interativo de criação de vault sem aceitar argumentos. Os comandos `cortex start`, `cortex end` e `cortex context` são instruções de linguagem natural executadas pela IA via CLAUDE.md/cursor rules.

Este design adiciona subcomandos ao CLI **sem duplicar o protocolo de IA**. Cada subcomando preenche um gap que o protocolo não cobre.

---

## Separação de camadas (imutável)

| Camada | Responsabilidade | Exemplos |
|--------|-----------------|---------|
| **CLI** (`cortex-ai`) | Setup e manutenção — roda o dev ou a IA via bash | `npx @fullchico/cortex-ai status` |
| **Protocolo** (CLAUDE.md / cursor rules) | Runtime da IA durante sessão | `cortex start`, `cortex end` |

Subcomandos não substituem o protocolo — complementam.

---

## Roteamento

`bin/cortex.js` detecta `process.argv[2]` antes de qualquer prompt:

```
npx @fullchico/cortex-ai              → fluxo init atual (sem mudança)
npx @fullchico/cortex-ai status       → src/cli/cmd-status.js
npx @fullchico/cortex-ai context auth → src/cli/cmd-context.js
npx @fullchico/cortex-ai update       → src/cli/cmd-update.js
npx @fullchico/cortex-ai --help       → imprime tabela de comandos e sai
npx @fullchico/cortex-ai --version    → imprime versão do package.json e sai
npx @fullchico/cortex-ai <desconhecido> → erro + hint para --help
```

O fluxo init existente em `bin/cortex.js` permanece intacto. O router despacha antes do `promptLanguage()`.

---

## Subcomando: `status`

**Propósito primário:** Orientar a IA em uma nova conversa com um único comando bash, sem precisar ler múltiplos arquivos do vault.

**Output:**

```
  # Cortex Status — my-app

  Vault:     my-app/  ·  Modo: Freestyled  ·  Lang: PT
  AI tools:  Claude Code ✓  ·  Cursor ✗  ·  Copilot ✗

  Contextos:
  - auth (depends: users, sessions)
  - payments

  Última sessão: 2026-04-01
  Pendências abertas:
  - [ ] Verificar README na pagina npm

  Boas práticas: Testes unitarios · Principios SOLID
```

**Implementação:**
- Usa funções existentes: `readVaultName`, `vaultExists`, `detectVaultMode`, `detectVaultLang`, `detectAiTools`
- Lê `cortex/Projeto.md` para extrair boas práticas (seção `## Boas Praticas`)
- Lista arquivos em `cortex/Sessoes/contextos/` para contextos ativos
- Lê `cortex/Sessoes/timeline/` para última sessão (arquivo mais recente)
- Extrai `- [ ]` da última timeline para pendências
- Exit code 1 se vault não existe (útil para scripts)
- Sem prompts — output direto

**Arquivo:** `src/cli/cmd-status.js`

**Saúde do vault:**
```
  Saúde:
  ✓ .cortex marker
  ✓ my-app/Projeto.md
  ✓ my-app/Sessoes/timeline/
  ✗ CLAUDE.md não encontrado
```

Verifica arquivos esperados por modo (Freestyled vs Projeto).

---

## Subcomando: `context <nome>`

**Propósito:** Criar arquivo de contexto via CLI para devs sem IA aberta ou para scripts.

**Comportamento:**

```bash
# Contexto não existe → cria com prompt
$ cortex-ai context payments
  ? Depende de algum contexto? (ex: users, orders)  auth, orders
  ✓ Contexto "payments" criado em my-app/Sessoes/contextos/payments.md
  → Diga "cortex start payments" para carregar.

# Contexto já existe → avisa, não sobrescreve
$ cortex-ai context auth
  ✓ Contexto "auth" já existe em my-app/Sessoes/contextos/auth.md
  → Diga "cortex start auth" para carregar.
```

**Template criado:**
```markdown
# payments

depends: [auth, orders]
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

**Implementação:**
- Valida que vault existe antes de prosseguir
- Um único prompt interativo para `depends:` (aceita lista separada por vírgula)
- Arquivo vai para `<vaultName>/Sessoes/contextos/<nome>.md`
- Erro se nome não fornecido: `cortex-ai context → erro: nome obrigatório`

**Arquivo:** `src/cli/cmd-context.js`

---

## Subcomando: `update`

**Propósito:** Atualizar AI tools (templates mais recentes) e vault (notas faltantes) após nova versão do pacote.

**Output:**

```
  Atualizando...

  AI tools:
  ✓ CLAUDE.md — bloco Cortex atualizado
  ✓ .cursor/rules/cortex-protocol.mdc — atualizado
  ✓ .cursor/rules/cortex-start.mdc — atualizado
  ✓ .cursor/rules/cortex-end.mdc — atualizado
  - Copilot não configurado, pulando

  Vault (my-app/):
  ✓ Notas existentes preservadas
  + Adicionadas 0 notas ausentes
```

**AI tools:**
- Detecta quais tools estão instalados via presença de arquivos (`CLAUDE.md`, `.cursor/rules/`, `.github/copilot-instructions.md`)
- Para CLAUDE.md e copilot-instructions: substitui o bloco `<!-- cortex:start -->…<!-- cortex:end -->` com template mais recente. Conteúdo fora do bloco preservado.
- Para cursor rules: sobrescreve os 3 arquivos `.mdc` com os templates atuais (não têm conteúdo personalizado do usuário).

**Vault:**
- Usa `writeProjetoNotes(vaultPath, vars, safe=true)` para modo Projeto — cria notas faltantes, nunca sobrescreve as existentes.
- Para Freestyled: sem ação no vault (estrutura mínima não muda).
- Lê `vaultName` do marker `.cortex`, `lang` via `detectVaultLang`, `mode` via `detectVaultMode`.
- Vars de stack/practices lidos do `.spec.md` do vault via nova função `readSpec(vaultPath)` em `src/vault.js`. O `.spec.md` é gerado por `buildSpec(vars)` e contém campos `NAME:`, `LANG:`, `MODE:`, `STACK:`, `PRACTICES:` como linhas `key: value`. `readSpec` faz parse linha a linha e retorna o objeto `vars` necessário para `writeProjetoNotes`.

**Arquivo:** `src/cli/cmd-update.js`

---

## `--help` e `--version`

**`--help`:**
```
  cortex-ai — AI memory framework

  Uso:
    npx @fullchico/cortex-ai           Inicializar vault (fluxo interativo)
    npx @fullchico/cortex-ai status    Estado atual do vault
    npx @fullchico/cortex-ai context   Criar contexto: context <nome>
    npx @fullchico/cortex-ai update    Atualizar AI tools e vault
    npx @fullchico/cortex-ai --help    Esta mensagem
    npx @fullchico/cortex-ai --version Versão instalada
```

**`--version`:** Lê `version` do `package.json` via `createRequire` e imprime. Sem dependência nova.

---

## Error boundary global

Wrap de todo o fluxo em `bin/cortex.js`:

```js
try {
  // fluxo atual + router
} catch (err) {
  console.error('\n  ✗ Erro inesperado:', err.message)
  console.error('  Reporte em: https://github.com/fullchico/cortex/issues')
  process.exit(1)
}
```

Captura erros não tratados e exibe mensagem amigável em vez de stack trace bruto.

---

## Testes para `archiveVault`

Dois novos testes em `test/vault-create-smoke.test.js`:

1. **Archive básico:** Cria vault em tmpdir → chama `archiveVault(date)` → verifica que arquivos foram para `<vaultName>/Anterior/<date>/` e pasta raiz do vault está vazia (exceto `Anterior/`).

2. **Colisão de data:** Arquiva duas vezes com a mesma data → verifica que a segunda cria `<date>-<timestamp>/` em vez de sobrescrever.

---

## Arquivos novos

| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/cli/cmd-status.js` | Subcomando status |
| `src/cli/cmd-context.js` | Subcomando context |
| `src/cli/cmd-update.js` | Subcomando update |

## Arquivos modificados

| Arquivo | O que muda |
|---------|-----------|
| `bin/cortex.js` | Router de subcomandos + error boundary |
| `test/vault-create-smoke.test.js` | 2 testes de archiveVault |

---

## Critérios de aceitação

- [ ] `npx @fullchico/cortex-ai` sem args continua funcionando exatamente como antes
- [ ] `cortex-ai status` retorna exit 1 se vault não existe
- [ ] `cortex-ai context <nome>` cria arquivo correto com depends: preenchido
- [ ] `cortex-ai context <nome>` em contexto existente avisa sem sobrescrever
- [ ] `cortex-ai update` atualiza bloco cortex sem tocar conteúdo do usuário
- [ ] `cortex-ai --version` imprime versão do package.json
- [ ] Erro inesperado → mensagem amigável, não stack trace
- [ ] `npm test` passa com 87+ testes (85 atuais + 2 archiveVault)
