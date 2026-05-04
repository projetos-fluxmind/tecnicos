create extension if not exists "pgcrypto";

create type public.user_role as enum ('OPERADOR', 'GESTOR', 'ADMIN');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  perfil public.user_role not null default 'OPERADOR',
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tecnicos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  matricula text not null unique,
  usuario_id uuid references auth.users(id) on delete set null,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.motos (
  id uuid primary key default gen_random_uuid(),
  placa text not null unique,
  km_atual integer not null default 0 check (km_atual >= 0),
  data_atualizacao_km timestamptz,
  ativa boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gastos_alimentacao (
  id uuid primary key default gen_random_uuid(),
  tecnico_id uuid not null references public.tecnicos(id),
  valor numeric(12, 2) not null check (valor >= 0),
  data_gasto date not null,
  excedeu_limite boolean generated always as (valor > 35.00) stored,
  created_at timestamptz not null default now()
);

create table public.gastos_abastecimento (
  id uuid primary key default gen_random_uuid(),
  tecnico_id uuid not null references public.tecnicos(id),
  moto_id uuid not null references public.motos(id),
  valor numeric(12, 2) not null check (valor >= 0),
  km_registrado integer not null check (km_registrado >= 0),
  data_gasto date not null,
  created_at timestamptz not null default now()
);

create table public.gastos_manutencao (
  id uuid primary key default gen_random_uuid(),
  moto_id uuid not null references public.motos(id),
  valor numeric(12, 2) not null check (valor >= 0),
  descricao text not null,
  data_gasto date not null,
  created_at timestamptz not null default now()
);

create table public.gastos_hospedagem (
  id uuid primary key default gen_random_uuid(),
  tecnico_id uuid not null references public.tecnicos(id),
  valor numeric(12, 2) not null check (valor >= 0),
  motivo text not null,
  data_gasto date not null,
  created_at timestamptz not null default now()
);

create table public.recargas_flash (
  id uuid primary key default gen_random_uuid(),
  tecnico_id uuid not null references public.tecnicos(id),
  valor numeric(12, 2) not null check (valor >= 0),
  data_recarga date not null,
  created_at timestamptz not null default now()
);

create index tecnicos_nome_idx on public.tecnicos using gin (to_tsvector('portuguese', nome));
create index motos_placa_idx on public.motos (placa);
create index gastos_alimentacao_data_idx on public.gastos_alimentacao (data_gasto desc);
create index gastos_abastecimento_data_idx on public.gastos_abastecimento (data_gasto desc);
create index gastos_abastecimento_moto_idx on public.gastos_abastecimento (moto_id, km_registrado desc);
create index gastos_manutencao_data_idx on public.gastos_manutencao (data_gasto desc);
create index gastos_hospedagem_data_idx on public.gastos_hospedagem (data_gasto desc);
create index recargas_flash_data_idx on public.recargas_flash (data_recarga desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger tecnicos_touch_updated_at
before update on public.tecnicos
for each row execute function public.touch_updated_at();

create trigger motos_touch_updated_at
before update on public.motos
for each row execute function public.touch_updated_at();

create or replace function public.validate_and_update_moto_km()
returns trigger
language plpgsql
as $$
declare
  current_km integer;
begin
  select km_atual
  into current_km
  from public.motos
  where id = new.moto_id
  for update;

  if current_km is null then
    raise exception 'Moto não encontrada.';
  end if;

  if new.km_registrado < current_km then
    raise exception 'KM registrado (%) não pode ser menor que o KM atual da moto (%).', new.km_registrado, current_km;
  end if;

  update public.motos
  set km_atual = new.km_registrado,
      data_atualizacao_km = now()
  where id = new.moto_id;

  return new;
end;
$$;

create trigger abastecimento_validate_km
before insert on public.gastos_abastecimento
for each row execute function public.validate_and_update_moto_km();

alter table public.profiles enable row level security;
alter table public.tecnicos enable row level security;
alter table public.motos enable row level security;
alter table public.gastos_alimentacao enable row level security;
alter table public.gastos_abastecimento enable row level security;
alter table public.gastos_manutencao enable row level security;
alter table public.gastos_hospedagem enable row level security;
alter table public.recargas_flash enable row level security;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select perfil from public.profiles where id = auth.uid() and ativo = true
$$;

create policy "Usuários autenticados leem perfis"
on public.profiles for select
to authenticated
using (true);

create policy "Admin gerencia perfis"
on public.profiles for all
to authenticated
using (public.current_user_role() = 'ADMIN')
with check (public.current_user_role() = 'ADMIN');

create policy "Usuários autenticados leem técnicos"
on public.tecnicos for select
to authenticated
using (true);

create policy "Gestores e admins gerenciam técnicos"
on public.tecnicos for all
to authenticated
using (public.current_user_role() in ('GESTOR', 'ADMIN'))
with check (public.current_user_role() in ('GESTOR', 'ADMIN'));

create policy "Usuários autenticados leem motos"
on public.motos for select
to authenticated
using (true);

create policy "Gestores e admins gerenciam motos"
on public.motos for all
to authenticated
using (public.current_user_role() in ('GESTOR', 'ADMIN'))
with check (public.current_user_role() in ('GESTOR', 'ADMIN'));

create policy "Usuários autenticados leem alimentação"
on public.gastos_alimentacao for select
to authenticated
using (true);

create policy "Usuários autenticados criam alimentação"
on public.gastos_alimentacao for insert
to authenticated
with check (true);

create policy "Usuários autenticados leem abastecimento"
on public.gastos_abastecimento for select
to authenticated
using (true);

create policy "Usuários autenticados criam abastecimento"
on public.gastos_abastecimento for insert
to authenticated
with check (true);

create policy "Usuários autenticados leem manutenção"
on public.gastos_manutencao for select
to authenticated
using (true);

create policy "Usuários autenticados criam manutenção"
on public.gastos_manutencao for insert
to authenticated
with check (true);

create policy "Usuários autenticados leem hospedagem"
on public.gastos_hospedagem for select
to authenticated
using (true);

create policy "Usuários autenticados criam hospedagem"
on public.gastos_hospedagem for insert
to authenticated
with check (true);

create policy "Usuários autenticados leem recargas"
on public.recargas_flash for select
to authenticated
using (true);

create policy "Gestores e admins criam recargas"
on public.recargas_flash for insert
to authenticated
with check (public.current_user_role() in ('GESTOR', 'ADMIN'));
