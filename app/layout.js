'use client'

import { ClerkProvider, useUser } from '@clerk/nextjs'
import './globals.css'
import { useEffect } from 'react'
import { syncProfile } from '@/lib/syncProfile'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body>
          <SyncWrapper>{children}</SyncWrapper>
        </body>
      </html>
    </ClerkProvider>
  )
}

function SyncWrapper({ children }) {
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      console.log('🟢 Usuario Clerk detectado:', user.id)
      syncProfile(user) // 🔹 aquí llamamos la API
    }
  }, [user])

  return <>{children}</>
}
