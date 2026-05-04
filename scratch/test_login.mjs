import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ecinlqdssglowdrqwcjy.supabase.co'
const supabaseKey = 'sb_publishable_B8Cu2rbV6x-aVLHxvJ1uwQ_Z2eMwYPX'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testLogin() {
  console.log('Testing login for admin@controle.com...')
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@controle.com',
    password: '1020304050',
  })

  if (error) {
    console.error('Login failed:', error.message)
  } else {
    console.log('Login successful! User ID:', data.user?.id)
    console.log('Email confirmed at:', data.user?.email_confirmed_at)
  }
}

testLogin()
