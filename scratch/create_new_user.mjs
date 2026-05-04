import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yxgynsajxtnqhjqlhhpt.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Z3luc2FqeHRucWhqcWxoaHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk3OTYwOSwiZXhwIjoyMDg3NTU1NjA5fQ.I1gYI5m0tkH2II5Zay4xdc-xi9BJROOJCK2ksyF3X98'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createNewUser() {
  const email = 'fluxmind@controle.com'
  const password = 'fluxmind_admin_2026'
  
  console.log(`Criando novo usuário: ${email}...`)
  
  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: { nome: 'Acesso Fluxmind' }
  })

  if (error) {
    if (error.message.includes('already registered')) {
      console.log('Usuário já existe. Resetando senha...')
      const { data: listData } = await supabase.auth.admin.listUsers()
      const user = listData?.users.find(u => u.email === email)
      if (user) {
        await supabase.auth.admin.updateUserById(user.id, { 
          password: password,
          email_confirm: true 
        })
        console.log('Senha resetada e e-mail confirmado!')
      }
    } else {
      console.error('Erro:', error.message)
      return
    }
  } else {
    console.log('Novo usuário criado com sucesso!')
  }

  console.log('--- CREDENCIAIS ---')
  console.log(`Email: ${email}`)
  console.log(`Senha: ${password}`)
  console.log('-------------------')
}

createNewUser()
