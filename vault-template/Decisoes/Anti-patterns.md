# Anti-patterns

#decisoes #anti-patterns

> [!abstract] O que NUNCA fazer neste projeto
> Lista explicita de praticas proibidas. O AI consulta antes de codar para nao repetir erros.

> [!important] Cada anti-pattern aqui foi aprendido com um erro real ou quase-erro.
> Nao e teoria — e protecao contra problemas que ja aconteceram.

Voltar: [[Memoria Projeto]] | Ver: [[Definicoes Travadas]] | Ver: [[Padroes de Codigo]]

---

## Codigo

| Anti-pattern | Por que e ruim | Faca isso |
|-------------|---------------|-----------|
| _(ex: `.includes()` para match de nome)_ | _(match parcial causa falso positivo)_ | _(usar `===` com UPPERCASE)_ |
| _(ex: Prisma no controller)_ | _(viola separacao de camadas)_ | _(usar use-case + repository port)_ |
| _(ex: N+1 queries em loop)_ | _(performance — 600 queries vira 30)_ | _(batch query com WHERE IN)_ |
| _(ex: `any` como tipo)_ | _(perde type-safety, bugs silenciosos)_ | _(tipar explicitamente)_ |
| _(ex: import dotenv em modulo NestJS)_ | _(quebra producao — dotenv e devDep)_ | _(usar ConfigModule do NestJS)_ |

---

## Banco de dados

| Anti-pattern | Por que e ruim | Faca isso |
|-------------|---------------|-----------|
| _(ex: campo calculado no banco)_ | _(rigido, precisa migration pra mudar)_ | _(calcular na camada de servico)_ |
| _(ex: gravar lowercase quando fonte e UPPERCASE)_ | _(match quebra)_ | _(manter UPPERCASE original)_ |
| _(ex: deletar sem soft-delete)_ | _(perde historico)_ | _(flag status=INATIVO)_ |

---

## Arquitetura

| Anti-pattern | Por que e ruim | Faca isso |
|-------------|---------------|-----------|
| _(ex: logica de negocio no controller)_ | _(nao testavel, acoplado ao HTTP)_ | _(mover para use-case)_ |
| _(ex: import circular entre modulos)_ | _(build quebra, DI confusa)_ | _(extrair para modulo shared)_ |
| _(ex: duplicar query que ja existe em outro modulo)_ | _(divergencia, manutencao dobrada)_ | _(importar service existente)_ |

---

## Processo / Git

| Anti-pattern | Por que e ruim | Faca isso |
|-------------|---------------|-----------|
| _(ex: commit sem pedir ao usuario)_ | _(usuario perde controle do historico)_ | _(sempre pedir permissao)_ |
| _(ex: force push em main)_ | _(destroi trabalho de outros)_ | _(nunca — usar branch + PR)_ |
| _(ex: commitar .env)_ | _(expoe credenciais)_ | _(adicionar ao .gitignore)_ |

---

## Frontend

| Anti-pattern | Por que e ruim | Faca isso |
|-------------|---------------|-----------|
| _(ex: setar Content-Type em multipart)_ | _(browser nao envia boundary)_ | _(deixar browser definir)_ |
| _(ex: confiar que decimal vem como number)_ | _(ORM retorna string)_ | _(parsear com parseFloat)_ |
| _(ex: exibir datetime UTC direto)_ | _(horario errado pro usuario)_ | _(converter para timezone local)_ |

---

## Como adicionar novo anti-pattern

Quando encontrar um bug ou quase-erro causado por um padrao ruim:
1. Adicione na tabela da categoria certa
2. Inclua o **por que** (sem motivo, a regra e ignorada)
3. Inclua o **faca isso** (alternativa concreta)
4. Se for regra absoluta, adicione tambem em [[Definicoes Travadas]]

---

## Links

- [[Definicoes Travadas]] — decisoes imutaveis
- [[Padroes de Codigo]] — o que fazer (positivo)
- [[Mapa de Modulos]] — onde colocar cada coisa
