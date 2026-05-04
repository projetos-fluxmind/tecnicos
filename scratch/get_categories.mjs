import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://yxgynsajxtnqhjqlhhpt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Z3luc2FqeHRucWhqcWxoaHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk3OTYwOSwiZXhwIjoyMDg3NTU1NjA5fQ.I1gYI5m0tkH2II5Zay4xdc-xi9BJROOJCK2ksyF3X98'
)

async function getCategories() {
  // Vamos tentar pegar todas as categorias únicas que já existem no banco
  const { data, error } = await supabase.from('despesas').select('categoria')
  
  if (data) {
    const uniqueCategories = [...new Set(data.map(d => d.categoria))]
    console.log('=== CATEGORIAS ENCONTRADAS NO BANCO ===')
    console.log(uniqueCategories.join(', '))
  } else {
    console.log('Erro ao buscar categorias:', error.message)
  }
}

getCategories()
