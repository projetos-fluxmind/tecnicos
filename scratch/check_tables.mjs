import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://yxgynsajxtnqhjqlhhpt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Z3luc2FqeHRucWhqcWxoaHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk3OTYwOSwiZXhwIjoyMDg3NTU1NjA5fQ.I1gYI5m0tkH2II5Zay4xdc-xi9BJROOJCK2ksyF3X98'
)

const tables = [
  'tecnicos', 'motos', 'profiles',
  'gastos_alimentacao', 'gastos_abastecimento', 'gastos_manutencao',
  'gastos_hospedagem', 'recargas_flash',
  'alimentacao', 'abastecimento', 'manutencao', 'hospedagem', 'recargas',
  'gastos', 'despesas', 'lancamentos'
]

async function checkTables() {
  console.log('Verificando quais tabelas existem...\n')
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('id').limit(1)
    if (!error) {
      console.log(`✅ ${table} — EXISTE (${data?.length ?? 0} registros visíveis)`)
    } else {
      const msg = error.message.includes('does not exist') ? 'não existe' : error.message.substring(0,60)
      console.log(`❌ ${table} — ${msg}`)
    }
  }
}

checkTables()
