# Mapa de Fontes de Dados

#dados #fontes

> [!abstract] Origens de dados do projeto
> Documente todas as fontes de dados que alimentam o sistema.

Voltar: [[Memoria Projeto]]

---

## Fontes

| # | Fonte | Tipo | Formato | Conteudo | Frequencia |
|---|-------|------|---------|----------|------------|
| 1 | _(nome)_ | Planilha | XLSX/CSV | _(o que contem)_ | _(mensal)_ |
| 2 | _(nome)_ | API REST | JSON | _(o que contem)_ | _(tempo real)_ |
| 3 | _(nome)_ | Banco externo | SQL | _(o que contem)_ | _(diaria)_ |
| 4 | _(nome)_ | Webhook | JSON | _(o que contem)_ | _(evento)_ |
| 5 | _(nome)_ | Arquivo | XML/TXT | _(o que contem)_ | _(sob demanda)_ |

### Tipos de fonte

- **Planilha**: XLSX, CSV — upload manual ou automatizado
- **API REST**: GET/POST para servico externo
- **Banco externo**: Query direta em banco de terceiros
- **Webhook**: Callback recebido de servico externo
- **Arquivo**: Importacao de XML, TXT, JSON, etc.

---

## Mapeamento de campos

### Fonte 1: _(nome)_

| Campo origem | Campo destino | Transformacao |
|-------------|---------------|---------------|
| _(coluna/campo)_ | _(entidade.campo)_ | _(nenhuma / uppercase / parse / converter tipo)_ |

---

## Qualidade dos dados

| Fonte | Confiabilidade | Problemas conhecidos |
|-------|---------------|---------------------|
| _(nome)_ | _(alta/media/baixa)_ | _(dados faltantes, formato inconsistente, etc.)_ |
