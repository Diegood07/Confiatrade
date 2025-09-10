// app/api/sync-profile/route.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(req) {
  try {
    const body = await req.json()
    const { id, email, nombre } = body

    // 👇 Usamos el mismo id de Clerk como PK en profiles
    const { error } = await supabaseAdmin.from('profiles').upsert(
      {
        id,           // <-- este es el userId de Clerk
        clerk_id: id, // opcional, redundante pero sirve para debug
        email,
        nombre,
        rol: 'cliente',
      },
      { onConflict: 'id' } // 🔹 si ya existe ese id, actualiza
    )

    if (error) {
      console.error('❌ Error en Supabase:', error)
      return new Response(JSON.stringify({ error }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error('❌ Error inesperado en sync-profile:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
