'use client'

import Link from 'next/link'
import { SignInButton, SignedOut, SignedIn, UserButton } from '@clerk/nextjs'

export default function SobreNosotros() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-green-500 text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo ConfiaTrade" className="w-10 h-10" />
          <h1 className="text-3xl font-semibold ml-2">ConfiaTrade</h1>
        </div>

        {/* Menú de navegación en el Header */}
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
            <span>Hola, Carlos</span> {/* Aquí se pondría el nombre del usuario */}
            <UserButton />
          </SignedIn>
        </div>
      </header>

      {/* Main Content */}
      <section className="flex-1 flex flex-col justify-center items-center p-6">
        <h2 className="text-4xl font-bold text-center mb-4">
          Conoce más sobre <span className="text-[#F2C14E]">ConfiaTrade</span>
        </h2>
        <p className="text-lg text-center mb-8">
          En ConfiaTrade, somos una plataforma dedicada a conectar viajeros con experiencias auténticas y locales en Sudamérica. 
          Creemos en el turismo colaborativo y sostenible, promoviendo el intercambio cultural mientras cuidamos el medio ambiente.
        </p>

        <div className="max-w-3xl mx-auto text-left">
          <h3 className="text-2xl font-semibold mb-3">Nuestra Misión</h3>
          <p className="mb-6">
            Nuestra misión es fomentar el turismo responsable y ofrecer a los viajeros una forma única de explorar Sudamérica 
            a través de experiencias locales auténticas. Queremos que cada viaje sea una oportunidad para aprender, disfrutar y 
            contribuir positivamente a las comunidades.
          </p>

          <h3 className="text-2xl font-semibold mb-3">Nuestros Valores</h3>
          <ul className="list-disc pl-6 mb-6">
            <li>Sostenibilidad</li>
            <li>Colaboración</li>
            <li>Autenticidad</li>
            <li>Respeto por las culturas locales</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-500 text-white py-4 px-6 mt-auto">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-sm">
            <h3 className="font-semibold text-lg">Sobre ConfiaTrade</h3>
            <p className="text-xs">Plataforma colaborativa para experiencias turísticas auténticas en Sudamérica.</p>
          </div>
        </div>
        <div className="text-center text-xs mt-4">
          © 2025 ConfiaTrade. Todos los derechos reservados.
        </div>
      </footer>
    </main>
  )
}
