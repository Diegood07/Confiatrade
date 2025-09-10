'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function ReportesAdminPage() {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalClientes: 0,
    totalAdmins: 0,
    totalExperiencias: 0,
    totalReservas: 0,
    reservasPorEstado: [],
  })
  const [cargando, setCargando] = useState(true)

  // 📌 Colores para los gráficos
  const colores = {
    pendiente: '#FACC15', // amarillo
    confirmada: '#22C55E', // verde
    rechazada: '#EF4444', // rojo
  }

  // 📌 Cargar estadísticas desde Supabase
  const fetchStats = async () => {
    try {
      // Usuarios
      const { data: usuarios } = await supabase.from('profiles').select('*')
      const totalUsuarios = usuarios?.length || 0
      const totalClientes = usuarios?.filter((u) => u.rol === 'cliente').length
      const totalAdmins = usuarios?.filter((u) => u.rol === 'admin').length

      // Experiencias
      const { data: experiencias } = await supabase.from('experiencias').select('*')
      const totalExperiencias = experiencias?.length || 0

      // Reservas
      const { data: reservas } = await supabase.from('reservas').select('*')
      const totalReservas = reservas?.length || 0

      // Agrupamos reservas por estado
      const reservasPorEstado = [
        { name: 'Pendientes', value: reservas?.filter(r => r.estado === 'pendiente').length || 0, color: colores.pendiente },
        { name: 'Confirmadas', value: reservas?.filter(r => r.estado === 'confirmada').length || 0, color: colores.confirmada },
        { name: 'Rechazadas', value: reservas?.filter(r => r.estado === 'rechazada').length || 0, color: colores.rechazada },
      ]

      setStats({
        totalUsuarios,
        totalClientes,
        totalAdmins,
        totalExperiencias,
        totalReservas,
        reservasPorEstado,
      })
    } catch (err) {
      console.error('❌ Error al cargar reportes:', err)
    }
    setCargando(false)
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">📊 Reportes Generales</h1>

      {cargando ? (
        <p className="text-center">Cargando reportes...</p>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold">Usuarios</h2>
              <p className="text-2xl font-bold">{stats.totalUsuarios}</p>
              <p className="text-sm text-gray-500">
                {stats.totalClientes} Clientes / {stats.totalAdmins} Admins
              </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold">Experiencias</h2>
              <p className="text-2xl font-bold">{stats.totalExperiencias}</p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold">Reservas</h2>
              <p className="text-2xl font-bold">{stats.totalReservas}</p>
            </div>
          </div>

          {/* Gráfico */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Reservas por Estado</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.reservasPorEstado}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {stats.reservasPorEstado.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </main>
  )
}
