import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://yxgynsajxtnqhjqlhhpt.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Z3luc2FqeHRucWhqcWxoaHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk3OTYwOSwiZXhwIjoyMDg3NTU1NjA5fQ.I1gYI5m0tkH2II5Zay4xdc-xi9BJROOJCK2ksyF3X98'
const PROJECT_REF = 'yxgynsajxtnqhjqlhhpt'

// Tenta usar a Management API do Supabase com a service key
async function runSQL(sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_KEY}`
    },
    body: JSON.stringify({ query: sql })
  })
  const data = await res.json()
  return { status: res.status, data }
}

// SQL statements para criar tabelas e desabilitar RLS
const statements = [
  {
    name: 'gastos_alimentacao',
    sql: `CREATE TABLE IF NOT EXISTS public.gastos_alimentacao (
      id BIGSERIAL PRIMARY KEY,
      tecnico_id integer NOT NULL REFERENCES public.tecnicos(id),
      valor numeric(12,2) NOT NULL CHECK (valor >= 0),
      data_gasto date NOT NULL,
      excedeu_limite boolean GENERATED ALWAYS AS (valor > 35.00) STORED,
      created_at timestamptz NOT NULL DEFAULT now()
    )`
  },
  {
    name: 'gastos_abastecimento',
    sql: `CREATE TABLE IF NOT EXISTS public.gastos_abastecimento (
      id BIGSERIAL PRIMARY KEY,
      tecnico_id integer NOT NULL REFERENCES public.tecnicos(id),
      moto_id integer NOT NULL REFERENCES public.motos(id),
      valor numeric(12,2) NOT NULL CHECK (valor >= 0),
      km_registrado integer NOT NULL CHECK (km_registrado >= 0),
      data_gasto date NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`
  },
  {
    name: 'gastos_manutencao',
    sql: `CREATE TABLE IF NOT EXISTS public.gastos_manutencao (
      id BIGSERIAL PRIMARY KEY,
      moto_id integer NOT NULL REFERENCES public.motos(id),
      valor numeric(12,2) NOT NULL CHECK (valor >= 0),
      descricao text NOT NULL,
      data_gasto date NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`
  },
  {
    name: 'gastos_hospedagem',
    sql: `CREATE TABLE IF NOT EXISTS public.gastos_hospedagem (
      id BIGSERIAL PRIMARY KEY,
      tecnico_id integer NOT NULL REFERENCES public.tecnicos(id),
      valor numeric(12,2) NOT NULL CHECK (valor >= 0),
      motivo text NOT NULL,
      data_gasto date NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`
  },
  {
    name: 'recargas_flash',
    sql: `CREATE TABLE IF NOT EXISTS public.recargas_flash (
      id BIGSERIAL PRIMARY KEY,
      tecnico_id integer NOT NULL REFERENCES public.tecnicos(id),
      valor numeric(12,2) NOT NULL CHECK (valor >= 0),
      data_recarga date NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`
  },
  { name: 'DISABLE RLS tecnicos', sql: 'ALTER TABLE public.tecnicos DISABLE ROW LEVEL SECURITY' },
  { name: 'DISABLE RLS motos', sql: 'ALTER TABLE public.motos DISABLE ROW LEVEL SECURITY' },
  { name: 'DISABLE RLS alimentacao', sql: 'ALTER TABLE public.gastos_alimentacao DISABLE ROW LEVEL SECURITY' },
  { name: 'DISABLE RLS abastecimento', sql: 'ALTER TABLE public.gastos_abastecimento DISABLE ROW LEVEL SECURITY' },
  { name: 'DISABLE RLS manutencao', sql: 'ALTER TABLE public.gastos_manutencao DISABLE ROW LEVEL SECURITY' },
  { name: 'DISABLE RLS hospedagem', sql: 'ALTER TABLE public.gastos_hospedagem DISABLE ROW LEVEL SECURITY' },
  { name: 'DISABLE RLS recargas', sql: 'ALTER TABLE public.recargas_flash DISABLE ROW LEVEL SECURITY' },
]

async function setup() {
  console.log('Iniciando configuração do banco de dados...\n')

  for (const stmt of statements) {
    process.stdout.write(`  → ${stmt.name}... `)
    const { status, data } = await runSQL(stmt.sql)
    if (status === 200 || status === 201) {
      console.log('✅ OK')
    } else {
      console.log(`❌ Erro (${status}): ${JSON.stringify(data).substring(0, 120)}`)
    }
  }

  console.log('\nVerificando tabelas criadas...')
  const { status, data } = await runSQL(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' ORDER BY table_name
  `)
  if (status === 200) {
    console.log('Tabelas existentes:', data.map(r => r.table_name).join(', '))
  }
}

setup()
