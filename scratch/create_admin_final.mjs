import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yxgynsajxtnqhjqlhhpt.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Z3luc2FqeHRucWhqcWxoaHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk3OTYwOSwiZXhwIjoyMDg3NTU1NjA5fQ.I1gYI5m0tkH2II5Zay4xdc-xi9BJROOJCK2ksyF3X98'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupAdmin() {
  console.log('Buscando usuário...')
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('Erro ao listar usuários:', listError.message)
    return
  }

  let user = users.find(u => u.email === 'admin@controle.com')

  if (user) {
    console.log('Usuário encontrado. Confirmando e-mail e atualizando senha...')
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: '1020304050',
      email_confirm: true
    })
    if (updateError) console.error('Erro ao atualizar:', updateError.message)
    else console.log('Usuário atualizado e confirmado!')
  } else {
    console.log('Usuário não encontrado. Criando novo...')
    const { data: newData, error: createError } = await supabase.auth.admin.createUser({
      email: 'admin@controle.com',
      password: '1020304050',
      email_confirm: true
    })
    if (createError) console.error('Erro ao criar:', createError.message)
    else console.log('Usuário criado e confirmado! ID:', newData.user?.id)
  }

  console.log('Operação finalizada.')
}

setupAdmin()
