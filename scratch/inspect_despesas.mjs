import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://yxgynsajxtnqhjqlhhpt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Z3luc2FqeHRucWhqcWxoaHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk3OTYwOSwiZXhwIjoyMDg3NTU1NjA5fQ.I1gYI5m0tkH2II5Zay4xdc-xi9BJROOJCK2ksyF3X98'
)

async function inspect() {
  const { data, error } = await supabase.from('despesas').select('*').limit(3)
  if (error) { console.log('Erro:', error.message); return }
  
  console.log('=== ESTRUTURA DA TABELA despesas ===')
  if (data && data.length > 0) {
    Object.entries(data[0]).forEach(([k, v]) => {
      console.log(`  ${k}: ${typeof v} = ${JSON.stringify(v)}`)
    })
    console.log('\n=== TODOS OS REGISTROS ===')
    data.forEach(r => console.log(JSON.stringify(r, null, 2)))
  }
}

inspect()
