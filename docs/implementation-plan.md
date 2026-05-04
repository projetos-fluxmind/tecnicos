# Plano de Implementação por Partes

## Parte 1: Fundação

Objetivo: deixar a base do projeto pronta para evoluir sem retrabalho.

- Criar monorepo com `apps/frontend` em Next.js e `apps/backend` opcional.
- Definir contratos de API.
- Definir modelo inicial de dados.
- Criar shell visual do sistema com Next.js App Router.
- Criar migrations Supabase com schema, regras de negócio e RLS.
- Manter servidor Express apenas como camada opcional para integrações futuras.

## Parte 2: Cadastros

Objetivo: permitir que os módulos operacionais tenham dados de apoio.

- Cadastro de técnicos.
- Cadastro de motos.
- Cadastro de usuários e perfis.
- Regras de acesso por perfil.

## Parte 3: Lançamentos de Gastos

Objetivo: registrar os principais gastos operacionais.

- Alimentação com alerta para valor acima de R$ 35,00.
- Abastecimento com validação de KM.
- Manutenção vinculada à moto.
- Hospedagem vinculada ao técnico.
- Recarga Flash vinculada ao técnico.

## Parte 4: Listagens, Filtros e Exportação

Objetivo: transformar registros em consulta operacional.

- Padrão único de paginação.
- Filtros por data inicial, data final, técnico e placa.
- Ordenação por campos permitidos.
- Exportação CSV respeitando os filtros aplicados.

## Parte 5: Dashboard Gerencial

Objetivo: dar visibilidade rápida aos gestores.

- Total por categoria.
- Tendência mensal de gastos.
- Técnico com maior gasto no cartão.
- Técnico que mais recebeu recarga.
- Moto com maior volume de manutenção.

## Parte 6: Persistência e Segurança

Objetivo: preparar o sistema para uso real.

- Banco PostgreSQL no Supabase.
- Supabase migrations.
- Supabase Auth.
- RLS por perfil.
- Validação de entrada no frontend e constraints/triggers no banco.
- Logs e tratamento padronizado de erros.
