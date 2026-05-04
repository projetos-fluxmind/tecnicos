import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yxgynsajxtnqhjqlhhpt.supabase.co'
const supabaseKey = 'sb_publishable_BbuinIK2E3WpFeCjqgNynw_QHWNS0dU'
const supabase = createClient(supabaseUrl, supabaseKey)

async function createUser() {
  console.log('Creating user in new project...')
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@controle.com',
    password: '1020304050',
  })

  if (error) {
    if (error.message.includes('already registered')) {
      console.log('User already exists in this project.')
    } else {
      console.error('Error creating user:', error.message)
    }
  } else {
    console.log('User created successfully in new project! ID:', data.user?.id)
  }
}

createUser()
