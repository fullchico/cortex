# Memoria Projeto

#moc #projeto #memoria

> [!abstract] Segundo cerebro do projeto
> Ponto de entrada para todo o conhecimento. O AI le esta nota PRIMEIRO.
> Ver [[MANIFESTO]] para a filosofia. Ver [[Getting Started]] para comecar.

---

## Navegacao rapida

### Core — impacto direto no codigo

| Area | Notas |
|------|-------|
| Dominio | [[Glossario de Dominio]] · [[Entidades]] |
| Arquitetura | [[Clean Architecture]] · [[Padroes de Codigo]] · [[Mapa de Modulos]] · [[Estrategia de Testes]] |
| Decisoes | [[Definicoes Travadas]] · [[Anti-patterns]] · [[Questoes em Aberto]] |
| Regras | [[Regras Gerais]] |
| ADRs | [[Decisoes de Arquitetura]] |

### Complementar

| Area | Notas |
|------|-------|
| Pipeline / Fluxo | [[Pipeline - Visao Geral]] |
| Contratos API | [[Contratos API]] |
| Integracoes externas | [[Integracoes Externas]] |
| Fontes de Dados | [[Mapa de Fontes de Dados]] |
| Personas | [[Personas]] |
| Referencias | [[Referencias]] |

### Framework

| Area | Notas |
|------|-------|
| Filosofia | [[MANIFESTO]] |
| Onboarding | [[Getting Started]] |
| Manutencao | [[Health Check]] |
| Sessoes | [[Sessoes - Memoria Temporal]] |
| FAQ | [[FAQ Tecnico]] |
| Changelog | [[Changelog]] |

---

## Sobre o projeto

| Campo | Valor |
|-------|-------|
| **Nome** | _(nome do projeto)_ |
| **Descricao** | _(1-2 frases)_ |
| **Stack** | _(tecnologias)_ |
| **Dominio** | _(area de negocio)_ |
| **Inicio** | _(data)_ |

---

## Estado do projeto

### Implementado
- [ ] _(preencher conforme evolui)_

### Em andamento
- [ ] _(preencher conforme evolui)_

### Pendente
- [ ] _(preencher conforme evolui)_

---

## Definicoes travadas

> [!warning] Nao rediscutir sem motivo explicito

Ver lista completa: [[Definicoes Travadas]]

---

## Setup do projeto

> [!tip] Como rodar localmente

```bash
# Instalar dependencias
_(ex: npm install)_

# Configurar banco
_(ex: npx prisma migrate dev)_

# Rodar testes
_(ex: npm test)_

# Popular dados iniciais
_(ex: npm run seed)_

# Rodar
_(ex: npm run dev)_
```

### Variaveis de ambiente

| Variavel | Descricao | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | _(conexao com banco)_ | `postgresql://...` |
| `PORT` | _(porta do servidor)_ | `3000` |

> [!warning] Nunca colocar valores reais aqui

---

## Links uteis

| Recurso | Local |
|---------|-------|
| Codigo | _(path do repositorio)_ |
| Deploy (prod) | _(URL)_ |
| Deploy (staging) | _(URL)_ |
| Docs / Swagger | _(URL)_ |
| Board / Tasks | _(URL)_ |

---

## Protocolo de consulta do AI

> [!important] Seguir ANTES de escrever qualquer codigo

**Para codar:**
1. [[Entidades]] → campos reais existem?
2. [[Padroes de Codigo]] → como e feito aqui?
3. [[Anti-patterns]] → o que nao fazer?
4. [[Mapa de Modulos]] → ja existe?
5. [[Estrategia de Testes]] → como testar?

**Para decidir:**
6. [[Definicoes Travadas]] → ja foi decidido?
7. [[Questoes em Aberto]] → ainda nao foi decidido?
8. [[Regras Gerais]] → qual a formula/logica?

**Para integrar:**
9. [[Contratos API]] → qual o shape?
10. [[Glossario de Dominio]] → termo certo?

**Duvida recorrente:**
11. [[FAQ Tecnico]] → resposta ja existe?
