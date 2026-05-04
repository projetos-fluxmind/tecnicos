# Contrato Inicial de Dados e Consultas

Com Supabase como backend principal, o frontend Next.js consulta tabelas e views usando `@supabase/supabase-js`.

O backend Express fica reservado para casos em que uma operação não deve ser exposta ao cliente, como integrações externas, relatórios pesados ou rotinas administrativas.

## Padrão de listagem

Todas as rotas de listagem devem aceitar:

| Query | Tipo | Padrão |
| --- | --- | --- |
| page | number | `1` |
| limit | number | `10` |
| sort_by | string | `id` |
| order | string | `desc` |
| data_inicio | date | opcional |
| data_fim | date | opcional |
| tecnico_id | uuid | opcional |
| placa_moto | string | opcional |

Resposta:

```json
{
  "data": [],
  "pagination": {
    "total_items": 0,
    "total_pages": 1,
    "current_page": 1,
    "items_per_page": 10,
    "next_page": null,
    "prev_page": null
  }
}
```

## Chamadas diretas Supabase

| Recurso | Tabela |
| --- | --- |
| Técnicos | `tecnicos` |
| Motos | `motos` |
| Alimentação | `gastos_alimentacao` |
| Abastecimento | `gastos_abastecimento` |
| Manutenção | `gastos_manutencao` |
| Hospedagem | `gastos_hospedagem` |
| Recarga Flash | `recargas_flash` |

Exemplo de paginação:

```ts
const from = (page - 1) * limit;
const to = from + limit - 1;

const { data, count, error } = await supabase
  .from("gastos_alimentacao")
  .select("*", { count: "exact" })
  .gte("data_gasto", dataInicio)
  .lte("data_gasto", dataFim)
  .eq("tecnico_id", tecnicoId)
  .order("data_gasto", { ascending: false })
  .range(from, to);
```

## Rotas opcionais Express

### Sistema

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api/health` | Verifica status da API |

## Rotas de autenticação

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/api/auth/login` | Login por e-mail e senha |
| GET | `/api/auth/me` | Dados do usuário autenticado |

## Rotas de cadastros

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api/tecnicos` | Lista técnicos |
| POST | `/api/tecnicos` | Cria técnico |
| PUT | `/api/tecnicos/:id` | Atualiza técnico |
| DELETE | `/api/tecnicos/:id` | Desativa técnico |
| GET | `/api/motos` | Lista motos |
| POST | `/api/motos` | Cria moto |
| PUT | `/api/motos/:id` | Atualiza moto |

## Rotas de gastos

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api/gastos/alimentacao` | Lista gastos de alimentação |
| POST | `/api/gastos/alimentacao` | Cria gasto de alimentação |
| GET | `/api/gastos/alimentacao/export` | Exporta CSV |
| GET | `/api/gastos/abastecimento` | Lista abastecimentos |
| POST | `/api/gastos/abastecimento` | Cria abastecimento |
| GET | `/api/gastos/abastecimento/export` | Exporta CSV |
| GET | `/api/gastos/manutencao` | Lista manutenções |
| POST | `/api/gastos/manutencao` | Cria manutenção |
| GET | `/api/gastos/hospedagem` | Lista hospedagens |
| POST | `/api/gastos/hospedagem` | Cria hospedagem |
| GET | `/api/gastos/recargas-flash` | Lista recargas Flash |
| POST | `/api/gastos/recargas-flash` | Cria recarga Flash |

## Rotas de dashboard

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api/dashboard/summary` | Indicadores consolidados |
| GET | `/api/dashboard/trends` | Tendência de gastos |
| GET | `/api/dashboard/rankings` | Rankings por técnico e moto |
