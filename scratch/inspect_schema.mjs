import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yxgynsajxtnqhjqlhhpt.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Z3luc2FqeHRucWhqcWxoaHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk3OTYwOSwiZXhwIjoyMDg3NTU1NjA5fQ.I1gYI5m0tkH2II5Zay4xdc-xi9BJROOJCK2ksyF3X98'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function inspectSchema() {
  // Tenta inserir um registro de teste para ver a estrutura
  const { data: sample, error } = await supabase
    .from('tecnicos')
    .select('*')
    .limit(1)

  if (error) {
    console.log('Erro:', error.message)
  } else {
    console.log('=== AMOSTRA DA TABELA tecnicos ===')
    if (sample && sample.length > 0) {
      console.log('Campos e tipos encontrados:')
      Object.entries(sample[0]).forEach(([k, v]) => {
        console.log(`  ${k}: ${typeof v} = ${JSON.stringify(v)}`)
      })
    } else {
      console.log('Tabela vazia. Testando insert para ver tipos...')
      // Tenta insert com integer para ver se aceita
      const { error: intErr } = await supabase.from('tecnicos').insert([{ nome: '__TEST__', matricula: '__T0__' }])
      console.log('Insert sem id explícito:', intErr ? intErr.message : 'OK')
    }
  }

  // Verifica motos também
  const { data: motos, error: motosErr } = await supabase.from('motos').select('*').limit(1)
  if (!motosErr && motos) {
    console.log('\n=== AMOSTRA DA TABELA motos ===')
    if (motos.length > 0) {
      Object.entries(motos[0]).forEach(([k, v]) => {
        console.log(`  ${k}: ${typeof v} = ${JSON.stringify(v)}`)
      })
    } else {
      console.log('Tabela motos vazia.')
    }
  }
}

inspectSchema()
