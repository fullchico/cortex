# Manifesto

#framework #filosofia

---

## O problema

AI alucina porque nao tem contexto. Inventa campos que nao existem, ignora regras validadas, duplica logica, quebra padroes. Quanto mais o projeto cresce, pior fica — porque o AI esquece tudo a cada conversa.

O resultado: codigo que compila mas nao faz sentido. Retrabalho. Decisoes rediscutidas. Tempo perdido.

## A solucao

Estruturar o contexto do projeto de forma que o AI (ou qualquer engenheiro) consiga produzir codigo preciso, consistente e alinhado com as decisoes do time.

## Os 3 pilares

### 1. Codigo que sobrevive sem AI

> Se o AI sumir amanha, qualquer engenheiro consegue entender e alterar o projeto.

Isso exige:
- **Clean Architecture** — camadas claras, dependencias para dentro
- **Testes obrigatorios** — rede de seguranca para alterar com confianca
- **Padroes documentados** — nao precisa perguntar "como faz aqui?"

### 2. Contexto estruturado > memoria do AI

> O AI so e tao bom quanto o contexto que recebe.

Isso exige:
- **Vault como fonte da verdade** — decisoes, regras, entidades, contratos
- **Protocolo de consulta** — o AI sabe O QUE ler e EM QUE ORDEM antes de codar
- **Sessoes temporais** — contexto se acumula, nao se perde

### 3. Decisoes sao imutaveis ate prova contraria

> O que foi validado nao se rediscute. O que nao foi decidido nao se implementa.

Isso exige:
- **Definicoes Travadas** — regras confirmadas pelo stakeholder
- **Questoes em Aberto** — o AI para e pergunta em vez de adivinhar
- **Anti-patterns** — erros reais documentados para nao repetir

---

## Principios

1. **Vault > memoria > codigo** — sempre consultar o vault antes de implementar
2. **Testes obrigatorios** — codigo sem teste nao existe
3. **Clean Architecture obrigatoria** — separacao de camadas nao e opcional
4. **Uma sessao por dia** — contexto se acumula na mesma nota
5. **Nao adivinhar** — se nao esta decidido, perguntar
6. **Nao duplicar** — se ja existe, reutilizar
7. **Nao rediscutir** — se esta travado, respeitar

---

## 3 modos de uso

| Modo | Descricao |
|------|-----------|
| **Construir** | Do zero. AI e co-criador — debate, questiona, sugere. Cada conversa alimenta o vault. |
| **Decidir** | Base pronta. AI organiza contexto e ajuda a tomar decisoes concretas. Cada decisao fica travada. |
| **Explorar** | Projeto existente. Cada task e uma descoberta documentada. O vault e diario de bordo. |

Os 3 modos convergem no mesmo principio: **nada se perde**.

## Para quem

- Times que usam AI para desenvolvimento (Claude Code, Cursor, Copilot)
- Desenvolvedores solo que querem manter contexto entre sessoes
- Novos colaboradores que precisam aprender um projeto existente
- Projetos onde decisoes de negocio mudam e precisam ser rastreadas
- Qualquer projeto que precisa ser mantido por humanos, nao so por AI
