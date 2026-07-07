import Link from 'next/link'
import RegistroClienteForm from '@/components/auth/RegistroClienteForm'

export const metadata = {
  title: 'Crear cuenta — Grupo Lozcam',
}

export default function RegistroClientePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f1117]">
      {/* Glow de fondo */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% -10%, rgba(245,166,35,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-md">

        {/* Logo / nombre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/20 mb-4">
            <span className="text-2xl font-extrabold text-amber-400">G</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Grupo Lozcam</h1>
          <p className="text-sm text-gray-400 mt-1">Crea tu cuenta de cliente</p>
        </div>

        {/* Tarjeta del formulario */}
        <div className="bg-[#161b27] border border-white/8 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <RegistroClienteForm />
        </div>

        {/* Link a login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link
            href="/login"
            className="text-amber-400 font-medium hover:text-amber-300 transition-colors"
          >
            Inicia sesión →
          </Link>
        </p>

      </div>
    </div>
  )
}
