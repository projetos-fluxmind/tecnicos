import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yxgynsajxtnqhjqlhhpt.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Z3luc2FqeHRucWhqcWxoaHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk3OTYwOSwiZXhwIjoyMDg3NTU1NjA5fQ.I1gYI5m0tkH2II5Zay4xdc-xi9BJROOJCK2ksyF3X98'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// SQL para desabilitar RLS e criar políticas abertas em todas as tabelas
const sql = `
-- Desabilitar RLS em todas as tabelas operacionais
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tecnicos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gastos_alimentacao DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gastos_abastecimento DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gastos_manutencao DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gastos_hospedagem DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.recargas_flash DISABLE ROW LEVEL SECURITY;
`

async function disableRLS() {
  console.log('Desabilitando RLS em todas as tabelas...')

  // Executa cada statement separadamente
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0)
  
  for (const stmt of statements) {
    const { error } = await supabase.rpc('exec_sql', { sql: stmt }).catch(() => ({ error: null }))
    // O rpc pode não existir, então tentamos via REST diretamente
    console.log(`Executando: ${stmt.substring(0, 60)}...`)
  }
  
  // Alternativa: usar a REST API do Postgres diretamente
  const { data, error } = await supabase.from('tecnicos').select('count').limit(1)
  if (error) {
    console.log('Erro ao acessar tabelas:', error.message)
    console.log('\n⚠️  Execute o SQL abaixo manualmente no Supabase SQL Editor:\n')
    console.log(sql)
  } else {
    console.log('✅ Conexão OK. Tabelas acessíveis.')
    console.log('\n⚠️  Execute o SQL abaixo no Supabase SQL Editor para liberar acesso total:\n')
    console.log(sql)
  }
}

disableRLS()
