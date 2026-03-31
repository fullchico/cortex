# Contratos API

#arquitetura #api #contratos

> [!abstract] Endpoints que o sistema expoe (back → front)
> Define o shape de request/response de cada endpoint interno.
> Para servicos **externos** que consumimos, veja [[Integracoes Externas]].

Voltar: [[Memoria Projeto]] | Ver: [[Decisoes de Arquitetura]]

---

## Convencoes gerais

| Convencao | Valor |
|-----------|-------|
| Base URL (dev) | _(ex: http://localhost:3000)_ |
| Base URL (prod) | _(ex: https://api.meuprojeto.com)_ |
| Autenticacao | _(nenhuma / JWT Bearer / API Key)_ |
| Content-Type | `application/json` _(exceto uploads: multipart/form-data)_ |
| Formato de data | _(ISO 8601 — YYYY-MM-DDTHH:mm:ss.sssZ)_ |
| IDs | _(UUID / number auto-increment)_ |
| Decimais | _(number / string)_ |

---

## Paginacao padrao

```
GET /recurso?page=1&limit=20

→ { data: [...], total, page, limit, totalPages }
```

---

## Erros padrao

| Codigo | Significado |
|--------|------------|
| 400 | Dados invalidos |
| 401 | Token ausente/expirado |
| 403 | Sem permissao |
| 404 | Recurso nao existe |
| 409 | Duplicidade |
| 500 | Erro inesperado |

---

## Endpoints por modulo

> Documente cada modulo abaixo. Use o formato: verbo, rota, descricao, body/params, response.

### _(Nome do modulo)_

| Verbo | Rota | Descricao | Body/Params | Response |
|-------|------|-----------|-------------|----------|
| GET | `/recurso` | Lista | `?page&limit&search` | `PaginatedResponse<Recurso>` |
| GET | `/recurso/:id` | Detalhe | `id` (UUID) | `Recurso` |
| POST | `/recurso` | Criar | `{ nome, descricao? }` | `Recurso` (201) |
| PUT | `/recurso/:id` | Atualizar | `{ nome?, descricao? }` | `Recurso` |
| DELETE | `/recurso/:id` | Remover | — | 204 |
| POST | `/recurso/import` | Upload | `multipart file` | `{ criados, erros[] }` |

> [!tip] Para endpoints complexos, detalhe o body/response em bloco separado abaixo da tabela.

---

## Enums compartilhados (back + front)

| Enum | Valores |
|------|---------|
| _(ex: Status)_ | `ATIVO`, `INATIVO` |

Ver tambem: [[Glossario de Dominio]]

---

## Notas de integracao

- **Multipart**: nunca setar `Content-Type` manualmente no front
- **Decimais**: backend pode retornar `string` — front parseia
- **Datas**: UTC no banco/API, timezone local na UI
- **IDs**: tipo consistente — nao misturar UUID com number
