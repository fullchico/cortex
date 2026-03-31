# Clean Architecture — Referencia

#arquitetura #clean-architecture #boas-praticas

> [!abstract] Principios de Clean Architecture aplicados ao projeto
> Referencia rapida para o AI e desenvolvedores. Baseado em Robert C. Martin (Uncle Bob).
> Para os exemplos concretos do projeto, veja [[Padroes de Codigo]].

Voltar: [[Memoria Projeto]] | Ver: [[Padroes de Codigo]] | Ver: [[Decisoes de Arquitetura]]

---

## Regra de Dependencia (a unica regra)

```
Dependencias apontam PARA DENTRO, nunca para fora.

[Frameworks / Drivers]     ← camada mais externa
       ↓
[Interface Adapters]       ← controllers, presenters, gateways
       ↓
[Application / Use Cases]  ← regras de aplicacao
       ↓
[Domain / Entities]        ← regras de negocio puras  ← camada mais interna
```

> [!important] Camadas internas NUNCA conhecem camadas externas.
> Domain nao sabe que Prisma existe. Application nao sabe que HTTP existe.

---

## As 4 camadas

### 1. Domain (Entities)

**O que e:** Regras de negocio puras — existem independente de software.

**Contem:**
- Entidades de dominio (classes/tipos com regras)
- Value Objects
- Ports (interfaces/abstract classes de repositorio)

**NAO contem:**
- Nenhum import de framework (NestJS, Express, Prisma)
- Nenhum acesso a banco, HTTP, filesystem

```
domain/
  ports/
    user.repository.port.ts    ← abstract class (DI token)
  entities/
    user.entity.ts             ← regras de negocio puras (opcional)
```

---

### 2. Application (Use Cases)

**O que e:** Orquestracao — coordena entidades e ports para realizar uma operacao.

**Contem:**
- 1 use-case por operacao (SRP — Single Responsibility)
- Recebe ports via constructor (inversao de dependencia)
- Validacoes de negocio que dependem de estado (ex: "ja existe?")

**NAO contem:**
- Acesso direto ao banco (usa port)
- Conhecimento de HTTP (request, response, headers)
- Import de ORM (Prisma, TypeORM, Sequelize)

```
application/
  use-cases/
    criar-usuario.use-case.ts     ← 1 arquivo = 1 operacao
    buscar-usuario.use-case.ts
  helpers/
    validar-cpf.helper.ts         ← funcoes puras (sem side-effects)
```

**Padrao de um use-case:**

```typescript
// CORRETO
class CriarUsuarioUseCase {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async execute(dto: CriarUsuarioDto): Promise<User> {
    // logica de negocio aqui
    return this.userRepo.criar(dto);
  }
}

// ERRADO — acessa Prisma direto
class CriarUsuarioUseCase {
  constructor(private readonly prisma: PrismaService) {} // ← VIOLACAO
}
```

---

### 3. Interface Adapters (Controllers, Presenters, Gateways)

**O que e:** Traduz entre o mundo externo e a aplicacao.

**Contem:**
- Controllers (HTTP → use-case)
- DTOs de entrada/saida
- Mappers (entidade → response)

**NAO contem:**
- Logica de negocio (delega para use-case)
- Acesso direto ao banco

```
<modulo>.controller.ts      ← recebe HTTP, chama use-case, retorna response
dto/
  criar-usuario.dto.ts      ← validacao de entrada (class-validator)
```

**Padrao de um controller:**

```typescript
// CORRETO — controller fino
@Post()
async criar(@Body() dto: CriarUsuarioDto) {
  return this.criarUsuarioUseCase.execute(dto);
}

// ERRADO — logica no controller
@Post()
async criar(@Body() dto: CriarUsuarioDto) {
  const existe = await this.prisma.user.findFirst(...); // ← VIOLACAO
  if (existe) throw new ConflictException();
  return this.prisma.user.create(...); // ← VIOLACAO
}
```

---

### 4. Infrastructure (Frameworks & Drivers)

**O que e:** Implementacao concreta dos ports — banco, APIs externas, filesystem.

**Contem:**
- Implementacao de repository ports (ex: Prisma, TypeORM)
- Clients de APIs externas
- Modulo NestJS (wiring de DI)

**E o unico lugar onde:**
- PrismaService / ORM e importado
- Queries SQL sao escritas
- Conexoes externas sao feitas

```
infrastructure/
  user-prisma.repository.ts    ← implementa UserRepositoryPort
```

**Padrao de um repository:**

```typescript
// Implementa o port da camada domain
class UserPrismaRepository extends UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async criar(dto: CriarUsuarioDto): Promise<User> {
    return this.prisma.user.create({ data: dto });
  }
}
```

---

## Inversao de Dependencia (DIP)

O principio mais importante da Clean Architecture.

```
// Port (domain) — abstract class como DI token
export abstract class UserRepositoryPort {
  abstract criar(dto: CriarUsuarioDto): Promise<User>;
  abstract buscarPorId(id: string): Promise<User | null>;
}

// Implementacao (infrastructure)
export class UserPrismaRepository extends UserRepositoryPort { ... }

// Wiring (module)
@Module({
  providers: [
    { provide: UserRepositoryPort, useClass: UserPrismaRepository },
    CriarUsuarioUseCase,
  ],
})
```

> [!tip] Por que abstract class e nao interface?
> No NestJS, interfaces nao servem como DI token (nao existem em runtime).
> Abstract class serve como token E como contrato.

---

## Checklist rapido

Antes de criar/modificar codigo, verifique:

| Pergunta | Se "sim" |
|----------|----------|
| Controller acessa PrismaService? | **Mover** para repository via port |
| Use-case importa PrismaService? | **Mover** para repository via port |
| Logica de negocio no controller? | **Mover** para use-case |
| Domain importa NestJS? | **Remover** — domain e puro |
| Repository faz validacao de negocio? | **Mover** para use-case |
| Use-case conhece HTTP (req, res)? | **Mover** para controller |
| Loop com N queries individuais? | **Refatorar** para batch query |

---

## SOLID no contexto Clean Architecture

| Principio | Aplicacao |
|-----------|----------|
| **S** — Single Responsibility | 1 use-case por operacao. 1 repository por entidade. |
| **O** — Open/Closed | Novos comportamentos via novos use-cases, nao editando existentes. |
| **L** — Liskov Substitution | Qualquer implementacao de port funciona no lugar do port. |
| **I** — Interface Segregation | Ports com metodos especificos, nao "God Repository" com 30 metodos. |
| **D** — Dependency Inversion | Use-case depende do port (abstrato), nao da implementacao (Prisma). |

---

## Erros mais comuns

| Erro | Consequencia | Solucao |
|------|-------------|---------|
| God Service (500+ linhas) | Impossivel testar, impossivel entender | Quebrar em use-cases SRP |
| Prisma no controller | Acoplamento HTTP↔banco | Usar use-case + repository |
| Logica no repository | Repository vira service disfarçado | Repository so faz CRUD — logica no use-case |
| Skip de camada (controller → repo) | Perde validacao de negocio | Sempre passar pelo use-case |
| Import circular | Build quebra, DI confusa | Extrair para modulo shared |

---

## Quando NAO usar Clean Architecture

> [!warning] Clean Arch adiciona complexidade. Use com criterio.

- **CRUD simples sem logica** → controller + service direto e OK
- **Scripts de seed/migration** → nao precisa de camadas
- **Prototipo / POC rapido** → velocidade > pureza
- **Modulo com 1 endpoint e 0 regras** → overengineering

A regra: se o modulo tem **regras de negocio**, usa Clean Arch. Se e **CRUD puro**, avalie.

---

## Links

- [[Padroes de Codigo]] — exemplos concretos do projeto
- [[Mapa de Modulos]] — onde aplicar cada padrao
- [[Anti-patterns]] — erros que ja aconteceram
- [[Decisoes de Arquitetura]] — ADRs
