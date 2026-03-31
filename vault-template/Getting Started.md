# Getting Started

#framework #onboarding

> [!abstract] 3 modos de uso, 1 principio: nada se perde.
> Toda conversa, toda decisao, toda descoberta fica registrada no vault.
> O AI aprende junto com voce — e nunca esquece.

Voltar: [[Memoria Projeto]]

---

## Qual modo?

| Modo | Quando usar |
|------|------------|
| **Construir** | Ideia nova. Nao tem codigo. AI ajuda a pensar, decidir e codar. |
| **Decidir** | Projeto com base. Precisa tomar decisoes concretas com AI. |
| **Explorar** | Projeto existente sem docs. Cada descoberta e documentada. |

---

## Vault minimo viavel (todos os modos)

> 3 arquivos, 5 minutos. Comece por aqui independente do modo.

- [ ] **[[Memoria Projeto]]** — nome, descricao (1 frase), stack (se sabe)
- [ ] **[[Glossario de Dominio]]** — 5 termos que voce ja usa
- [ ] **[[Definicoes Travadas]]** — vazio (cresce a cada decisao)

---

# Modo Construir

> Ideia → debate com AI → decisao → codigo → ideia muda → debate de novo.
> Tudo registrado. Nada se perde.

## Conceito

Voce e o AI sao **co-criadores**. Voce traz a ideia, o AI questiona, sugere, desafia. Juntos decidem. O vault registra cada decisao para que a proxima conversa nao comece do zero.

```
voce: "quero fazer X"
  AI: "faz sentido. mas ja pensou em Y?"
voce: "verdade. entao vamos com Y"
  AI: [registra decisao no vault]
  AI: [coda baseado na decisao]
  ...
voce: "mudou. agora e Z"
  AI: [atualiza vault, ajusta codigo]
```

## O que acontece na pratica

| Voce diz... | AI faz... | Vai para... |
|---|---|---|
| "Quero criar um sistema de X" | Faz perguntas, explora o dominio | [[Glossario de Dominio]], [[Memoria Projeto]] |
| "Quem vai usar?" | Debate personas, levanta dores | [[Personas]] |
| "Preciso de uma entidade Y" | Sugere campos, questiona relacoes | [[Entidades]] |
| "A regra e assim" | Valida, registra | [[Regras Gerais]], [[Definicoes Travadas]] |
| "Nao sei se deveria usar X ou Y" | Debate pros/contras, documenta ADR | [[Decisoes de Arquitetura]] |
| "Cria esse modulo" | Coda seguindo padroes do vault | [[Padroes de Codigo]], [[Mapa de Modulos]] |
| "Mudei de ideia" | Atualiza vault, refatora se necessario | Notas afetadas + [[Definicoes Travadas]] |
| "Isso deu errado" | Documenta o anti-pattern | [[Anti-patterns]] |

## Principio

> Cada conversa deixa o vault mais rico. Cada decisao fica travada.
> Na proxima sessao, o AI retoma de onde parou — sem reexplicar nada.

---

# Modo Decidir

> Projeto ja tem base. Voce precisa tomar decisoes concretas — arquitetura, regras, fluxos.
> AI ajuda a avaliar opcoes e registra cada decisao.

## Conceito

Voce traz o contexto (PRD, spec, planilha, reuniao). O AI organiza no vault e te ajuda a decidir o que falta. Cada decisao vira uma entrada em [[Definicoes Travadas]].

## Como comecar

```
Voce: "Tenho esse PRD / spec / planilha. Organiza no vault."
AI: [extrai e distribui:]
  → termos → Glossario
  → entidades → Entidades
  → regras → Regras Gerais
  → duvidas → Questoes em Aberto
  → links → Referencias
```

## O que acontece na pratica

| Voce diz... | AI faz... | Vai para... |
|---|---|---|
| "Organiza esse documento no vault" | Extrai e distribui por nota | Varias notas |
| "Essa regra esta correta. Trava." | Registra como imutavel | [[Definicoes Travadas]] |
| "Nao tenho certeza sobre X" | Registra como pendente | [[Questoes em Aberto]] |
| "Devo usar SQL ou NoSQL?" | Debate opcoes, registra ADR | [[Decisoes de Arquitetura]] |
| "Como ficaria o schema?" | Modela entidades com voce | [[Entidades]] |
| "Qual a melhor estrutura de testes?" | Propoe estrategia | [[Estrategia de Testes]] |
| "Confirma com stakeholder: regra e X" | Quando confirmado, trava | [[Definicoes Travadas]] |
| "Agora coda" | Tem contexto completo, coda preciso | Codigo |

## Principio

> Nenhuma decisao fica na cabeca de alguem. Tudo travado no vault.
> Meses depois, qualquer pessoa (ou AI) sabe POR QUE cada escolha foi feita.

---

# Modo Explorar

> Projeto existe. Documentacao nao (ou e fraca). Voce ta aprendendo.
> Cada coisa nova que descobre e documentada. O vault cresce por descoberta.

## Conceito

Voce e um **explorador**. O projeto e territorio desconhecido. Cada task que completa, cada bug que corrige, cada conversa com colega revela algo novo. O vault e seu diario de bordo — nada se perde.

> [!important] O vault nao e preenchido de uma vez.
> Ele cresce organicamente, task a task, descoberta a descoberta.
> Em 2 semanas ja tem cobertura solida.

## Dia 1 — Reconhecimento

```
Voce: "Me explica esse projeto"
AI: [le codigo, schema, README, estrutura]
AI: [preenche:]
  → Memoria Projeto (visao geral)
  → Entidades (extraido do schema)
  → Glossario (termos encontrados no codigo)
  → Padroes de Codigo (estrutura observada)
```

O AI faz a primeira varredura. Voce ja tem fundacao.

## Task a task — vault cresce

Cada task que voce completa e uma oportunidade de registrar algo novo:

| Voce completou... | Voce descobriu... | Registra em... |
|---|---|---|
| Fix de bug | O que causou o bug | [[Anti-patterns]] |
| Feature nova | Entidade, endpoint, regra | [[Entidades]], [[Contratos API]], [[Regras Gerais]] |
| Refactor | Padrao melhor | [[Padroes de Codigo]] |
| Integracao com API | Servico externo | [[Integracoes Externas]], [[Referencias]] |
| Conversa com colega | Regra nao documentada | [[Definicoes Travadas]], [[Regras Gerais]] |
| Code review | Padrao do time | [[Padroes de Codigo]], [[Anti-patterns]] |
| Reuniao com stakeholder | Decisao de negocio | [[Definicoes Travadas]], [[Questoes em Aberto]] |
| Leitura de doc | Link util | [[Referencias]] |

## Checklist pos-task

> Depois de cada task, pergunte:

- [ ] Aprendi termo novo? → [[Glossario de Dominio]]
- [ ] Descobri campo/entidade? → [[Entidades]]
- [ ] Descobri padrao do projeto? → [[Padroes de Codigo]]
- [ ] Encontrei anti-pattern? → [[Anti-patterns]]
- [ ] Decisao foi tomada? → [[Definicoes Travadas]]
- [ ] Ficou duvida? → [[Questoes em Aberto]]
- [ ] Criei modulo/endpoint? → [[Mapa de Modulos]] / [[Contratos API]]
- [ ] Usei doc externo? → [[Referencias]]

Nao precisa marcar todos. So os que se aplicam.

## Principio

> O proximo dev que entrar encontra tudo documentado.
> Voce sofreu para aprender — ele nao precisa sofrer.

---

# Manutencao — todos os modos

## Diario

```
/iniciar-sessao VAULT  → AI le contexto, retoma
  trabalhar...         → AI consulta vault antes de codar
/fechar-sessao VAULT   → registra o que aconteceu
```

## Semanal

- [ ] [[Health Check]] — vault atualizado? testes passando?

## Conforme surgir

| Evento | Acao |
|--------|------|
| Pergunta repetiu 2x | Adicionar [[FAQ Tecnico]] |
| Bug por padrao ruim | Adicionar [[Anti-patterns]] |
| Ideia/regra mudou | Atualizar notas + [[Definicoes Travadas]] |
| Doc/link util | Adicionar [[Referencias]] |
| Migration/schema mudou | Atualizar [[Entidades]] |

---

# Checklist de saude

> O vault esta saudavel quando todas forem "sim".

| Pergunta | Nota |
|----------|------|
| AI sabe o que o projeto faz? | [[Memoria Projeto]] |
| AI fala a lingua certa? | [[Glossario de Dominio]] |
| AI sabe os campos do banco? | [[Entidades]] |
| AI sabe o padrao de codigo? | [[Padroes de Codigo]] |
| AI sabe o que NAO fazer? | [[Anti-patterns]] |
| AI sabe as regras? | [[Regras Gerais]] |
| AI sabe o que ja decidiu? | [[Definicoes Travadas]] |
| AI sabe o que falta decidir? | [[Questoes em Aberto]] |
| AI sabe onde mora cada modulo? | [[Mapa de Modulos]] |
| AI sabe como testar? | [[Estrategia de Testes]] |

---

## Links

- [[Memoria Projeto]]
- [[Health Check]]
- [[MANIFESTO]]
