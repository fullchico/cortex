# Integracoes Externas

#arquitetura #integracoes

> [!abstract] Servicos externos que o sistema consome
> APIs de terceiros, webhooks recebidos, bancos externos, servicos cloud.
> Para endpoints que o sistema **expoe** (back→front), veja [[Contratos API]].

Voltar: [[Memoria Projeto]] | Ver: [[Decisoes de Arquitetura]]

---

## APIs consumidas

| Servico | Base URL | Autenticacao | Uso |
|---------|----------|-------------|-----|
| _(ex: Stripe)_ | _(URL)_ | _(API key / OAuth / JWT)_ | _(pagamentos)_ |

---

## Webhooks recebidos

| Origem | Evento | Endpoint nosso | Payload |
|--------|--------|---------------|---------|
| _(servico)_ | _(evento)_ | _(POST /webhooks/...)_ | _(formato)_ |

---

## Servicos cloud / terceiros

| Servico | Finalidade | Credenciais em |
|---------|-----------|----------------|
| _(ex: AWS S3)_ | _(armazenamento de arquivos)_ | _(env vars: AWS_*)_ |

---

## Links

- [[Decisoes de Arquitetura]]
- [[Contratos API]]
- [[Mapa de Fontes de Dados]]
