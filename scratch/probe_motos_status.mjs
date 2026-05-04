import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://yxgynsajxtnqhjqlhhpt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Z3luc2FqeHRucWhqcWxoaHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk3OTYwOSwiZXhwIjoyMDg3NTU1NjA5fQ.I1gYI5m0tkH2II5Zay4xdc-xi9BJROOJCK2ksyF3X98'
)

const tests = ['disponivel', 'em_uso', 'ativo', 'ativa', 'operacional']

async function probe() {
  for (const s of tests) {
    console.log(`Testando status: ${s}...`)
    const { error } = await supabase.from('motos').insert([
      { placa: 'TEST' + Math.floor(Math.random()*1000), status: s, hodometro_atual: 0 }
    ])
    
    if (!error) {
      console.log(`✅ ACEITO: ${s}`)
      await supabase.from('motos').delete().eq('placa', 'TEST...') // Limpeza aproximada
    } else {
      console.log(`❌ NEGADO: ${s} (${error.message.substring(0, 50)})`)
    }
  }
}

probe()
