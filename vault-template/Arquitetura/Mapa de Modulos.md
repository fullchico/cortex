# Mapa de Modulos

#arquitetura #modulos

> [!abstract] Quem faz o que — dependencias entre modulos
> O AI consulta antes de criar imports, injetar servicos ou duplicar logica.
> Se um modulo ja resolve, nao reinvente.

Voltar: [[Memoria Projeto]] | Ver: [[Decisoes de Arquitetura]] | Ver: [[Padroes de Codigo]]

---

## Modulos do sistema

| Modulo | Responsabilidade | Depende de | Expoe |
|--------|-----------------|------------|-------|
| _(ex: auth)_ | _(autenticacao e autorizacao)_ | _(users, config)_ | _(AuthGuard, JwtService)_ |
| _(ex: users)_ | _(CRUD de usuarios)_ | _(database)_ | _(UsersService)_ |
| _(ex: orders)_ | _(gestao de pedidos)_ | _(users, products, payments)_ | _(OrdersService, OrdersController)_ |

---

## Diagrama de dependencias

```
[auth] ← [users]
   ↑
[orders] → [products]
   ↓
[payments] → [notifications]
```

> [!tip] Leia o diagrama como: "orders depende de products" (seta = dependencia)

---

## Modulos compartilhados / utilitarios

| Modulo | O que oferece | Quem usa |
|--------|-------------|----------|
| _(ex: database)_ | _(PrismaService, conexao)_ | _(todos)_ |
| _(ex: common)_ | _(DTOs base, pipes, filters)_ | _(todos)_ |
| _(ex: config)_ | _(env vars, feature flags)_ | _(auth, payments)_ |

---

## Regras de dependencia

> [!warning] Dependencias proibidas

- _(ex: Controller nunca importa de outro controller)_
- _(ex: Modulo A nunca importa de Modulo B se B ja importa A — sem circular)_
- _(ex: Infrastructure nunca importa de Application de outro modulo)_

---

## Onde fica cada responsabilidade

| Preciso de... | Modulo | Arquivo |
|---------------|--------|---------|
| _(ex: validar token JWT)_ | _(auth)_ | _(auth.guard.ts)_ |
| _(ex: buscar usuario por email)_ | _(users)_ | _(users.repository.ts)_ |
| _(ex: calcular preco com desconto)_ | _(orders)_ | _(calcular-preco.use-case.ts)_ |

> [!important] Antes de criar logica nova, verifique nesta tabela se ja existe.

---

## Links

- [[Decisoes de Arquitetura]]
- [[Padroes de Codigo]]
- [[Anti-patterns]]
