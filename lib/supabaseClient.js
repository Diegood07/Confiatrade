// lib/supabaseClient.js
// 📌 Cliente de Supabase que usa el token de Clerk para autenticar al usuario.

import { createClient } from '@supabase/supabase-js'
import { useAuth } from '@clerk/nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

export function useSupabaseClient() {
  const { getToken } = useAuth()

  const supabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    global: {
      headers: {
        // 🔹 Pasamos el JWT de Clerk en cada request
        Authorization: `Bearer ${getToken({ template: 'supabase' })}`,
      },
    },
  })

  return supabase
}
