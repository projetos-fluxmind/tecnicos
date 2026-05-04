import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://yxgynsajxtnqhjqlhhpt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Z3luc2FqeHRucWhqcWxoaHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk3OTYwOSwiZXhwIjoyMDg3NTU1NjA5fQ.I1gYI5m0tkH2II5Zay4xdc-xi9BJROOJCK2ksyF3X98'
)

async function getColumns() {
  // Como não temos acesso ao information_schema, vamos tentar dar um insert vazio para forçar um erro que liste as colunas ou usar um select de um registro existente
  const { data, error } = await supabase.from('despesas').select('*').limit(1)
  
  if (data && data.length > 0) {
    console.log('=== COLUNAS ENCONTRADAS EM despesas ===')
    console.log(Object.keys(data[0]).join(', '))
  } else {
    console.log('Tabela despesas vazia, não foi possível inferir colunas pelo select.')
  }
}

getColumns()
