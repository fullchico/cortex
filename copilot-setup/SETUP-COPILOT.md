# Cortex — Setup para GitHub Copilot

## Instalacao

### 1. Criar o vault

Copie o template para **dentro do seu projeto** (recomendado para Copilot):

```bash
cp -r vault-template/ /path/do/seu/projeto/docs/vault/
# ou
cp -r vault-template/ /path/do/seu/projeto/.cortex/
```

Abra como vault no Obsidian (`Open folder as vault`).

> [!important] Por que dentro do projeto?
> O Copilot no VS Code nao le arquivos fora do workspace facilmente.
> Mantendo o vault dentro do projeto, o Copilot consegue consultar as notas.

### 2. Copiar instrucoes do Copilot

```bash
mkdir -p /path/do/seu/projeto/.github
cp copilot-setup/.github/copilot-instructions.md /path/do/seu/projeto/.github/
```

### 3. Editar path do vault

Abra `.github/copilot-instructions.md` e preencha:

```
**Path do vault:** docs/vault/
```

### 4. (Opcional) Adicionar vault ao .gitignore

Se nao quiser versionar as sessoes (contem contexto de trabalho diario):

```gitignore
# Obsidian
docs/vault/.obsidian/
docs/vault/.trash/
docs/vault/Sessoes/
```

Ou versionar tudo (recomendado para times — todos compartilham contexto).

## Como usar

### Inicio do trabalho

No chat do Copilot:
```
Leia o vault em docs/vault/ — Memoria Projeto + ultima sessao + Definicoes Travadas.
Me resuma o contexto e pendencias.
```

### Durante o trabalho

O `copilot-instructions.md` instrui o Copilot a consultar o vault antes de codar.
O Copilot vai:
- Verificar campos reais em Entidades.md antes de escrever queries
- Seguir padroes de Padroes de Codigo.md
- Respeitar decisoes de Definicoes Travadas.md
- Evitar anti-patterns listados

### Fim do trabalho

No chat do Copilot:
```
Crie/atualize a sessao de hoje em docs/vault/Sessoes/.
Registre decisoes, artefatos e proximos passos.
```

## Diferenca entre agents

| Aspecto | Claude Code | Cursor | Copilot |
|---------|------------|--------|---------|
| Instrucoes | `~/.claude/skills/` (global) | `.cursorrules` (projeto) | `.github/copilot-instructions.md` (projeto) |
| Vault recomendado | Qualquer path | Qualquer path | Dentro do projeto |
| Comandos `/cortex` | Sim | Nao | Nao |
| Sessoes automaticas | Sim (skill) | Manual | Manual |
| Le fora do workspace | Sim | Parcial | Nao |

## Dicas

- **Vault dentro do projeto** e o melhor setup para Copilot
- **Versionar o vault** permite que todo o time compartilhe contexto
- Se usar `.cortex/` como pasta, adicione ao `.github/copilot-instructions.md` o path correto
- O Copilot respeita bem o `copilot-instructions.md` — teste fazendo perguntas sobre regras travadas
