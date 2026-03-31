# Cortex — Setup para Cursor

## Instalacao

### 1. Criar o vault

Copie a pasta `vault-template/` para onde quiser e abra como vault no Obsidian:

```bash
cp -r vault-template/ ~/vaults/meu-projeto/
# Obsidian → Open folder as vault → selecionar a pasta
```

### 2. Copiar .cursorrules para o projeto

```bash
cp cursor-setup/.cursorrules /path/do/seu/projeto/.cursorrules
```

### 3. Editar o path do vault

Abra `.cursorrules` e preencha o path do vault:

```
**Path do vault:** /Users/meu-user/vaults/meu-projeto/
```

### 4. (Opcional) Copiar .cursorignore

Se o vault estiver dentro do projeto:

```bash
cp cursor-setup/.cursorignore /path/do/seu/projeto/.cursorignore
```

## Como usar

### Inicio do dia

Diga ao Cursor:
```
Leia o vault em [path] — Memoria Projeto + ultima sessao + Definicoes Travadas.
Resuma o contexto e pendencias.
```

### Durante o trabalho

O `.cursorrules` instrui o Cursor a consultar o vault automaticamente antes de codar.

### Fim do dia

Diga ao Cursor:
```
Crie/atualize a nota de sessao de hoje no vault.
Registre decisoes, artefatos e proximos passos.
```

## Diferenca vs Claude Code

| Aspecto | Claude Code | Cursor |
|---------|------------|--------|
| Skill automatico | `/cortex init/start/end` | Manual (pedir ao AI) |
| Vault access | Obsidian CLI | Leitura de arquivo (path) |
| Sessoes | Automatizadas | Pedir ao AI |
| Protocolo | Carregado via skill | Carregado via .cursorrules |
| Resultado | Igual — vault como fonte da verdade |

## Dicas

- Mantenha o Obsidian aberto enquanto trabalha — ve mudancas em tempo real
- Se o vault estiver FORA do projeto, o Cursor precisa do path absoluto
- Se o vault estiver DENTRO do projeto, adicione `.cursorignore` para nao indexar `.obsidian/`
