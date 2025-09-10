// En el archivo lib/syncProfile.js
export async function syncProfile(user) {
  if (!user) return

  const { id, primaryEmailAddress, username, fullName } = user
  const email = primaryEmailAddress?.emailAddress || ''
  const nombre = fullName || username || ''

  try {
    const res = await fetch('/api/sync-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, email, nombre }),
    })

    const data = await res.json()

    if (data.success) {
      console.log('✅ Perfil sincronizado en Supabase')
    } else {
      console.error('❌ Error al sincronizar perfil:', data.error || 'Error desconocido')
    }
  } catch (err) {
    console.error('❌ Error al llamar API sync-profile:', err)
  }
}
