# Estrategia de Testes

#arquitetura #testes #qualidade

> [!abstract] Como testar neste projeto
> Testes sao obrigatorios. Codigo sem teste e codigo que ninguem confia.
> O AI escreve testes ANTES ou JUNTO com a implementacao — nunca depois como afterthought.

> [!important] Por que testes sao obrigatorios
> Se o AI sumir amanha, qualquer engenheiro precisa alterar o codigo com confianca.
> Testes sao a rede de seguranca que garante isso. Sem testes, o projeto depende do AI — e isso e fragil.

Voltar: [[Memoria Projeto]] | Ver: [[Clean Architecture]] | Ver: [[Padroes de Codigo]]

---

## Piramide de testes

```
         /  E2E  \          ← poucos, lentos, caros
        /----------\
       / Integracao \       ← moderados, testam modulos juntos
      /--------------\
     /   Unitarios    \     ← muitos, rapidos, baratos
    /------------------\
```

| Tipo | O que testa | Quantidade | Velocidade |
|------|------------|------------|-----------|
| **Unitario** | 1 funcao/classe isolada | Muitos | Rapido (ms) |
| **Integracao** | Modulos juntos (ex: use-case + repo + banco) | Moderado | Medio (s) |
| **E2E** | Fluxo completo (HTTP → banco → response) | Poucos | Lento (s-min) |

---

## O que testar em cada camada (Clean Architecture)

### Domain (Entities + Ports)

| Testar | Exemplo |
|--------|---------|
| Regras de negocio puras | _(ex: calcularComissao retorna valor correto)_ |
| Validacoes de dominio | _(ex: valor negativo lanca erro)_ |
| Edge cases | _(ex: divisao por zero, lista vazia, null)_ |

**Tipo:** Unitario puro — sem banco, sem framework.

### Application (Use Cases)

| Testar | Exemplo |
|--------|---------|
| Orquestracao correta | _(ex: use-case chama repo na ordem certa)_ |
| Regras de aplicacao | _(ex: nao criar duplicado)_ |
| Tratamento de erro | _(ex: entidade nao encontrada → erro 404)_ |

**Tipo:** Unitario com mocks dos ports OU integracao com banco de teste.

### Infrastructure (Repositories)

| Testar | Exemplo |
|--------|---------|
| Queries retornam dados corretos | _(ex: findById retorna entidade completa)_ |
| Upsert/batch funcionam | _(ex: upsert nao duplica)_ |
| Filtros e paginacao | _(ex: page=2 retorna registros corretos)_ |

**Tipo:** Integracao com banco de teste real — **nunca mockar o banco**.

### Controllers

| Testar | Exemplo |
|--------|---------|
| Rota retorna status correto | _(ex: POST /recurso → 201)_ |
| Validacao de DTO rejeita input invalido | _(ex: campo obrigatorio ausente → 400)_ |
| Response tem shape correto | _(ex: { data, total, page })_ |

**Tipo:** E2E ou integracao com supertest/httpTesting.

---

## Convencoes de teste

| Convencao | Regra |
|-----------|-------|
| Localizacao | _(ex: colocalizados `*.spec.ts` ou pasta `__tests__/`?)_ |
| Nomenclatura | _(ex: `criar-usuario.use-case.spec.ts`)_ |
| Runner | _(ex: Jest, Vitest, Mocha)_ |
| Banco de teste | _(ex: SQLite in-memory, Docker PostgreSQL, banco separado)_ |
| Coverage minimo | _(ex: 80% em use-cases, 60% geral)_ |
| CI/CD | _(ex: testes rodam em toda PR, block merge se falhar)_ |

---

## Como rodar

```bash
# Todos os testes
_(ex: npm test)_

# Com coverage
_(ex: npm run test:cov)_

# Apenas unitarios
_(ex: npm run test:unit)_

# Apenas integracao
_(ex: npm run test:integration)_

# Watch mode
_(ex: npm run test:watch)_
```

---

## Padrao de um teste

```typescript
// _(Cole aqui um teste real do projeto como referencia)_
// O AI vai copiar este padrao ao criar novos testes
```

**Estrutura recomendada:**
```
describe('NomeDoModulo', () => {
  describe('operacao', () => {
    it('deve fazer X quando Y', () => {
      // Arrange — preparar dados
      // Act — executar operacao
      // Assert — verificar resultado
    });

    it('deve falhar quando Z', () => {
      // caso de erro
    });
  });
});
```

---

## O que NAO mockar

> [!warning] Mocks escondem bugs reais

| NAO mockar | Por que | Alternativa |
|-----------|---------|-------------|
| Banco de dados | Mock passa, prod quebra | Banco de teste real |
| Filesystem (se critico) | Permissoes, paths diferem | Pasta temp real |
| ORM/Prisma | Queries mocadas divergem | Prisma com banco teste |

**Mockar quando:**
- APIs externas (Stripe, SendGrid) → mock ou stub
- Servicos de terceiros caros → mock
- Tempo/data → clock mock

---

## Quando escrever testes

| Situacao | Regra |
|----------|-------|
| Feature nova | Teste JUNTO com implementacao (TDD ideal) |
| Bug fix | Teste que reproduz o bug ANTES do fix |
| Refactor | Testes existentes devem continuar passando |
| Endpoint novo | Teste E2E do happy path + erro principal |
| Regra de negocio | Teste unitario cobrindo formula/calculo |

> [!important] AI: nunca marcar tarefa como completa sem testes passando.

---

## Health check dos testes

| Sinal | Significado | Acao |
|-------|------------|------|
| Teste flaky (passa/falha aleatorio) | Dependencia de estado ou tempo | Isolar — provavelmente banco compartilhado |
| Coverage caindo | Codigo novo sem teste | Parar e cobrir antes de continuar |
| Teste lento (>5s unitario) | Provavelmente nao e unitario | Mover para integracao ou otimizar setup |
| 0 testes no modulo | Divida tecnica critica | Prioridade maxima |

---

## Links

- [[Clean Architecture]] — camadas e onde testar cada uma
- [[Padroes de Codigo]] — exemplos de implementacao
- [[Anti-patterns]] — erros a evitar
- [[Mapa de Modulos]] — cobertura por modulo
