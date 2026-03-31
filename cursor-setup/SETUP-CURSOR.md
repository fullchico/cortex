# Cortex — Setup para Cursor

## Instalacao

### 1. Criar o vault

```bash
cp -r vault-template/ ~/vaults/meu-projeto/
# Obsidian → Open folder as vault
```

### 2. Instalar Cursor Rules (escolha uma opcao)

**Opcao A — Rules por projeto (recomendado)**

```bash
mkdir -p /path/do/projeto/.cursor/rules
cp cursor-setup/rules/*.mdc /path/do/projeto/.cursor/rules/
```

**Opcao B — Rules globais (todos os projetos)**

```bash
mkdir -p ~/.cursor/rules
cp cursor-setup/rules/*.mdc ~/.cursor/rules/
```

### 3. Editar o path do vault

Abra `cortex-protocol.mdc` e preencha:

```
## Vault path
/Users/meu-user/vaults/meu-projeto/
```

### 4. (Opcional) Copiar .cursorignore

Se o vault estiver dentro do projeto:

```bash
cp cursor-setup/.cursorignore /path/do/projeto/.cursorignore
```

## Rules instalados

| Rule | Arquivo | Trigger | alwaysApply |
|------|---------|---------|-------------|
| **Protocol** | `cortex-protocol.mdc` | Sempre ativo | **sim** |
| **Init** | `cortex-init.mdc` | "cortex init", "criar vault", "novo projeto" | nao |
| **Start** | `cortex-start.mdc` | "cortex start", "iniciar sessao" | nao |
| **End** | `cortex-end.mdc` | "cortex end", "fechar sessao" | nao |

- **Protocol** fica sempre ativo — o Cursor consulta o vault antes de codar automaticamente
- **Init/Start/End** ativam quando voce pede — igual ao `/cortex` no Claude Code

## Como usar

### Iniciar projeto novo

```
Voce: "cortex init"
Cursor: [pergunta nome, stack, modo → cria vault]
```

### Inicio do dia

```
Voce: "cortex start"
Cursor: [le vault, resume contexto e pendencias]
```

### Durante o trabalho

O `cortex-protocol.mdc` (alwaysApply) garante que o Cursor consulta o vault automaticamente.

### Fim do dia

```
Voce: "cortex end"
Cursor: [analisa conversa, salva no vault]
```

## Diferenca vs Claude Code

| Aspecto | Claude Code | Cursor |
|---------|------------|--------|
| Formato | `SKILL.md` em `~/.claude/skills/` | `.mdc` em `.cursor/rules/` |
| Comandos | `/cortex init/start/end` | Digitar "cortex init/start/end" no chat |
| Protocolo | Dentro do SKILL.md | `cortex-protocol.mdc` (alwaysApply) |
| Resultado | Igual — vault como fonte da verdade |

## Dicas

- Mantenha o Obsidian aberto — ve mudancas em tempo real
- Se vault FORA do projeto: usar path absoluto no protocol
- Se vault DENTRO do projeto: adicionar `.cursorignore`
- As rules `.mdc` podem ser versionadas no repo do projeto
