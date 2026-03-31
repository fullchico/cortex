# Entidades

#dominio #entidades #schema

> [!abstract] Mapa de entidades do sistema
> Campos reais, tipos e relacoes. O AI consulta esta nota antes de escrever queries, DTOs ou migrations.
> Nao e o schema completo — e o que importa para o negocio.

> [!warning] Mantenha atualizado
> Se o schema mudar (migration, novo campo, rename), atualize aqui. Campo errado nesta nota = AI escreve codigo errado.

Voltar: [[Memoria Projeto]] | Ver: [[Glossario de Dominio]] | Ver: [[Contratos API]]

---

## Entidades principais

### _(NomeEntidade)_

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `id` | UUID | sim | Chave primaria |
| `nome` | string | sim | _(descricao)_ |
| `status` | enum | sim | `ATIVO`, `INATIVO` |
| `criadoEm` | DateTime | sim | Auto-gerado |
| _(campo)_ | _(tipo)_ | _(sim/nao)_ | _(descricao)_ |

**Relacoes:**
- pertence a → `[[OutraEntidade]]` (via `outraEntidadeId`)
- tem muitos → `[[Filha]]`

**Unique constraints:** `@@unique([campo1, campo2])`

**Indices:** `@@index([campo])`

---

### _(OutraEntidade)_

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `id` | UUID | sim | Chave primaria |
| _(campo)_ | _(tipo)_ | _(sim/nao)_ | _(descricao)_ |

**Relacoes:**
- tem muitos → `[[NomeEntidade]]`

---

## Tabelas de referencia (lookup)

> Tabelas de de/para, bridge, normalizacao. Sufixo `Ref` no nome.

| Tabela | Chave | Resolve para | Fonte |
|--------|-------|-------------|-------|
| _(ex: SegmentoRef)_ | `nome @unique` | _(enum ou ID)_ | _(planilha, hardcoded)_ |

---

## Tipos especiais

| Tipo | Comportamento | Cuidado |
|------|--------------|---------|
| Decimal | Retornado como `string` pelo ORM | Parsear no front com `parseFloat()` |
| DateTime | UTC no banco | Converter timezone na UI |
| Json | Campo flexivel | Validar shape no codigo |
| Enum | Valores fixos | Manter sync entre banco e codigo |

---

## Diagrama de relacoes (simplificado)

```
[Entidade A] 1---N [Entidade B] N---1 [Entidade C]
                         |
                         N
                         |
                    [Entidade D]
```

---

## Links

- [[Glossario de Dominio]] — termos de negocio
- [[Contratos API]] — como as entidades aparecem nos endpoints
- [[Regras Gerais]] — logica que opera sobre essas entidades
