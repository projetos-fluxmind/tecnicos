import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://yxgynsajxtnqhjqlhhpt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Z3luc2FqeHRucWhqcWxoaHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk3OTYwOSwiZXhwIjoyMDg3NTU1NjA5fQ.I1gYI5m0tkH2II5Zay4xdc-xi9BJROOJCK2ksyF3X98'
)

const tests = ['combustivel', 'manutencao', 'hospedagem', 'flash', 'outros', 'abastecimento_combustivel']

async function probe() {
  for (const cat of tests) {
    console.log(`Testando categoria: ${cat}...`)
    const { error } = await supabase.from('despesas').insert([
      { tecnico_id: 2, valor: 0.01, data: '2026-01-01', categoria: cat, descricao: 'Probe' }
    ])
    
    if (!error) {
      console.log(`✅ ACEITO: ${cat}`)
      // Remove o lixo
      await supabase.from('despesas').delete().eq('descricao', 'Probe').eq('categoria', cat)
    } else {
      console.log(`❌ NEGADO: ${cat} (${error.message.substring(0, 50)})`)
    }
  }
}

probe()
