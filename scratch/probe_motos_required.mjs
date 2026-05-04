import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://yxgynsajxtnqhjqlhhpt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Z3luc2FqeHRucWhqcWxoaHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk3OTYwOSwiZXhwIjoyMDg3NTU1NjA5fQ.I1gYI5m0tkH2II5Zay4xdc-xi9BJROOJCK2ksyF3X98'
)

async function probe() {
  console.log(`Testando inserção completa...`)
  const { error } = await supabase.from('motos').insert([
    { 
      placa: 'TEST' + Math.floor(Math.random()*1000), 
      status: 'ativa', 
      hodometro_atual: 0,
      modelo: 'Modelo Teste',
      marca: 'Marca Teste',
      ano: 2024
    }
  ])
  
  if (!error) {
    console.log(`✅ SUCESSO! Todos esses campos são suficientes.`)
  } else {
    console.log(`❌ ERRO: ${error.message}`)
  }
}

probe()
