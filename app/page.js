'use client'

import Link from 'next/link'
import { SignInButton, SignedOut, SignedIn, UserButton, useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const { user } = useUser()
  const [experiencias, setExperiencias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')

  // 🔹 Cargar experiencias
  useEffect(() => {
    const fetchExperiencias = async () => {
      const { data, error } = await supabase
        .from('experiencias')
        .select('*')
        .eq('estado', 'publicado')
        .order('id', { ascending: false })

      if (error) {
        console.error('❌ Error al cargar experiencias:', error)
      } else {
        setExperiencias(data)
      }
      setCargando(false)
    }

    fetchExperiencias()
  }, [])

  // 🔹 Función para reservar
  const handleReserva = async (exp) => {
    if (!user) {
      setMensaje('⚠️ Debes iniciar sesión para reservar.')
      return
    }

    try {
      // 1️⃣ Buscar el perfil del usuario en Supabase
      const { data: perfil, error: perfilError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', user.primaryEmailAddress?.emailAddress)
        .single()

      if (perfilError || !perfil) {
        console.error('❌ Error perfil:', perfilError)
        setMensaje('❌ No se encontró tu perfil en la base de datos.')
        return
      }

      // 2️⃣ Insertar la reserva
      const { error } = await supabase.from('reservas').insert([
        {
          experiencia_id: exp.id,
          user_id: perfil.id,   // id UUID desde profiles
          cantidad: 1,
          monto: exp.precio,
          estado: 'pendiente',
        },
      ])

      if (error) {
        console.error('❌ Error al crear reserva:', error)
        setMensaje('❌ No se pudo crear la reserva.')
      } else {
        setMensaje(`✅ Reserva creada para ${exp.titulo}`)
      }
    } catch (err) {
      console.error('❌ Error inesperado:', err)
      setMensaje('❌ Error inesperado al crear la reserva.')
    }
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-green-500 text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo ConfiaTrade" className="w-10 h-10" />
          <h1 className="text-3xl font-semibold ml-2">ConfiaTrade</h1>
        </div>

        {/* Menú de navegación */}
        <div className="flex gap-6">
          <Link href="/como-funciona" className="text-white text-lg hover:text-yellow-300">
            Cómo Funciona
          </Link>
          <Link href="/sobre-nosotros" className="text-white text-lg hover:text-yellow-300">
            Sobre Nosotros
          </Link>
        </div>

        <div className="text-lg">
          <SignedOut>
            <SignInButton>
              <button className="text-white">Iniciar Sesión</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <span>
              Hola, {user?.username || user?.fullName || user?.primaryEmailAddress?.emailAddress}
            </span>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      {/* Sección de bienvenida */}
      <section className="flex flex-col justify-center items-center p-6">
        <h2 className="text-4xl font-bold text-center mb-4">
          Bienvenido a <span className="text-[#F2C14E]">ConfiaTrade</span>
        </h2>
        <p className="text-lg text-center mb-8 max-w-2xl">
          Tu red de turismo colaborativo en Sudamérica. Conectamos viajeros con experiencias auténticas, locales y sostenibles.
        </p>
      </section>

      {/* Sección de experiencias */}
      <section className="p-6 bg-gray-50">
        <h3 className="text-3xl font-bold text-center mb-8">Explorar Experiencias</h3>

        {mensaje && (
          <div className="text-center mb-6">
            <p
              className={`px-4 py-2 rounded ${
                mensaje.startsWith('✅')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {mensaje}
            </p>
          </div>
        )}

        {cargando ? (
          <div className="text-center text-xl">Cargando experiencias...</div>
        ) : experiencias.length === 0 ? (
          <div className="text-center text-xl text-gray-500">
            No hay experiencias disponibles.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiencias.map((exp) => (
              <div
                key={exp.id}
                className="border-2 border-gray-300 p-4 rounded-lg shadow-lg bg-white hover:shadow-xl transition-all"
              >
                {exp.imagen && (
                  <img
                    src={exp.imagen}
                    alt={exp.titulo}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <h4 className="text-xl font-semibold">{exp.titulo}</h4>
                <p className="text-gray-600 text-sm">{exp.ubicacion}</p>
                <p className="text-green-600 font-bold mt-2">${exp.precio}</p>
                <p className="text-gray-700 mt-2">{exp.descripcion}</p>

                <div className="mt-4">
                  <SignedOut>
                    <SignInButton>
                      <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                        Inicia sesión para reservar
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <button
                      className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                      onClick={() => handleReserva(exp)}
                    >
                      Reservar
                    </button>
                  </SignedIn>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-green-500 text-white py-4 px-6 mt-auto">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-sm">
            <h3 className="font-semibold text-lg">Sobre ConfiaTrade</h3>
            <p className="text-xs">
              Plataforma colaborativa para experiencias turísticas auténticas en Sudamérica.
            </p>
          </div>
        </div>
        <div className="text-center text-xs mt-4">
          © 2025 ConfiaTrade. Todos los derechos reservados.
        </div>
      </footer>
    </main>
  )
}
