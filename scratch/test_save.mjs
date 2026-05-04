import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://yxgynsajxtnqhjqlhhpt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Z3luc2FqeHRucWhqcWxoaHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk3OTYwOSwiZXhwIjoyMDg3NTU1NjA5fQ.I1gYI5m0tkH2II5Zay4xdc-xi9BJROOJCK2ksyF3X98'
)

async function testInsert() {
  console.log('Tentando inserir registro de teste em despesas...')
  
  const { data, error } = await supabase.from('despesas').insert([
    {
      tecnico_id: 2, // ID que existe no seu banco
      valor: 10.50,
      data: new Date().toISOString().split('T')[0],
      categoria: 'abastecimento',
      descricao: 'Teste de Inserção Antigravity',
      aprovado_supervisor: true
    }
  ]).select()

  if (error) {
    console.log('❌ ERRO AO SALVAR:', error.message)
    console.log('Dica: Se o erro for "new row violates row-level security policy", você precisa rodar o comando ALTER TABLE que te mandei.')
  } else {
    console.log('✅ SUCESSO! Registro salvo:', data)
  }
}

testInsert()
