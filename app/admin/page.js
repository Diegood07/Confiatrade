'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [experiencias, setExperiencias] = useState([])
  const [cargando, setCargando] = useState(true)

  // 🔹 Obtener experiencias
  const fetchExperiencias = async () => {
    const { data, error } = await supabase
      .from('experiencias')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error('❌ Error al cargar experiencias:', error)
    } else {
      setExperiencias(data)
    }
    setCargando(false)
  }

  useEffect(() => {
    fetchExperiencias()
  }, [])

  // 🔹 Eliminar experiencia
  const eliminarExperiencia = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar esta experiencia?')) return

    const { error } = await supabase.from('experiencias').delete().eq('id', id)

    if (error) {
      console.error('❌ Error al eliminar:', error)
      alert('❌ No se pudo eliminar.')
    } else {
      alert('✅ Experiencia eliminada')
      fetchExperiencias() // refrescar después de borrar
    }
  }

  return (
    <main className="bg-gray-100 min-h-screen py-10 px-6">
      {/* 🔹 Encabezado principal */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Experiencias</h1>
        <Link href="/admin/crear">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
            ➕ Crear experiencia
          </button>
        </Link>
      </div>

      {/* 🔹 Contenido */}
      {cargando ? (
        <p className="text-center">Cargando...</p>
      ) : experiencias.length === 0 ? (
        <p className="text-center text-gray-500">No hay experiencias creadas.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiencias.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Imagen */}
              {exp.imagen ? (
                <img
                  src={exp.imagen}
                  alt={exp.titulo}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                  Sin imagen
                </div>
              )}

              {/* Contenido */}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{exp.titulo}</h2>
                <p className="text-gray-600 text-sm">{exp.ubicacion}</p>
                <p className="text-green-600 font-bold mt-2">${exp.precio}</p>

                {/* Botones */}
                <div className="mt-4 flex gap-2">
                  <Link href={`/admin/editar/${exp.id}`}>
                    <button className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                      ✏️ Editar
                    </button>
                  </Link>
                  <button
                    onClick={() => eliminarExperiencia(exp.id)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    🗑 Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
