# Padroes de Codigo

#arquitetura #padroes #codigo

> [!abstract] Como o codigo e organizado neste projeto
> Exemplos concretos de cada camada. O AI copia estes padroes ao criar novos arquivos.
> Nao invente padroes — siga o que esta aqui.

> [!important] Regra de ouro
> Antes de criar um arquivo novo, leia esta nota e siga o exemplo da camada correspondente.

Voltar: [[Memoria Projeto]] | Ver: [[Clean Architecture]] | Ver: [[Decisoes de Arquitetura]] | Ver: [[Mapa de Modulos]]

---

## Estrutura de um modulo

```
src/modules/<modulo>/
  <modulo>.controller.ts       # Rotas, decorators, validacao
  <modulo>.module.ts           # Imports e providers
  domain/
    ports/                     # Interfaces (abstract class como DI token)
  application/
    use-cases/                 # 1 use-case por operacao (SRP)
    helpers/                   # Funcoes puras de parsing/transformacao
  infrastructure/
    *-prisma.repository.ts     # Implementacao concreta do port
  dto/
    create-*.dto.ts
    find-*.dto.ts
    update-*.dto.ts
```

> [!warning] Adapte ao seu projeto
> O exemplo acima usa Clean Architecture com NestJS. Substitua pela estrutura real do seu projeto.

---

## Exemplo: Controller

```typescript
// _(Cole aqui um controller real do projeto como referencia)_
// O AI vai copiar este padrao ao criar novos controllers
```

**Regras:**
- _(ex: Controller nunca acessa o banco diretamente)_
- _(ex: Validacao via DTOs com class-validator)_
- _(ex: Retornar tipos explicitos, nunca `any`)_

---

## Exemplo: Use Case

```typescript
// _(Cole aqui um use-case real do projeto como referencia)_
```

**Regras:**
- _(ex: 1 use-case por operacao — Single Responsibility)_
- _(ex: Recebe ports no constructor, nunca PrismaService)_
- _(ex: Operacoes compostas usam $transaction)_

---

## Exemplo: Repository (Port + Implementacao)

```typescript
// PORT (domain/ports/)
// _(Cole aqui um port real)_

// IMPLEMENTACAO (infrastructure/)
// _(Cole aqui a implementacao Prisma real)_
```

**Regras:**
- _(ex: Port e abstract class, nao interface)_
- _(ex: Unico lugar com PrismaService)_
- _(ex: Batch queries, nunca N+1)_

---

## Exemplo: DTO

```typescript
// _(Cole aqui um DTO real do projeto)_
```

**Regras:**
- _(ex: Usar decorators class-validator)_
- _(ex: Campos opcionais com @IsOptional())_
- _(ex: Transformacoes com @Transform())_

---

## Convencoes de codigo

| Convencao | Regra |
|-----------|-------|
| Nomes de arquivo | _(ex: kebab-case — meu-modulo.service.ts)_ |
| Nomes de classe | _(ex: PascalCase — MeuModuloService)_ |
| Nomes de variavel | _(ex: camelCase)_ |
| Nomes no banco | _(ex: snake_case via @@map)_ |
| Strings no banco | _(ex: UPPERCASE para nomes/aliases)_ |
| Match de strings | _(ex: === exato, nunca .includes())_ |
| Imports | _(ex: absolutos com @src/ ou relativos?)_ |
| Testes | _(ex: colocalizados ou pasta __tests__?)_ |

---

## Links

- [[Clean Architecture]] — principios e referencia completa
- [[Decisoes de Arquitetura]] — ADRs que justificam esses padroes
- [[Mapa de Modulos]] — quem faz o que
- [[Anti-patterns]] — o que NAO fazer
