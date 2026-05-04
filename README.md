# Sistema Web de Controle de Gastos Operacionais

Projeto para registrar, acompanhar e analisar gastos operacionais de uma frota técnica.

## Partes do sistema

1. **Base e arquitetura**
   - Monorepo com frontend, backend e documentação.
   - Contratos de API, modelo de dados e padrões de paginação/filtros.

2. **Cadastros principais**
   - Usuários, técnicos e motos.
   - Perfis: Operador, Gestor e Administrador.

3. **Lançamentos operacionais**
   - Alimentação, abastecimento, manutenção, hospedagem e recarga Flash.
   - Validações de limite de refeição e consistência de KM.

4. **Consulta e exportação**
   - Listagens paginadas com filtros por período, técnico e placa.
   - Exportação CSV.

5. **Dashboard**
   - Indicadores consolidados por categoria.
   - Ranking de gastos, manutenção e recargas.

## Estrutura

```text
apps/
  backend/   API REST opcional em Node.js + Express + TypeScript
  frontend/  Interface web em Next.js + React + TypeScript
docs/
  implementation-plan.md
  data-model.md
  api-contract.md
supabase/
  migrations/ Schema SQL, regras de negócio e RLS
```

## Backend no Supabase

O backend principal será criado no Supabase:

- **Supabase Auth** para login.
- **Postgres** para dados.
- **RLS** para permissões por perfil.
- **Migrations SQL** em `supabase/migrations`.
- **Triggers** para validações críticas, como KM de abastecimento.

Configure o frontend com:

```text
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

## Próximo passo

Criar o projeto no Supabase, aplicar a migration inicial e implementar a tela de login/cadastros usando o cliente Supabase.
