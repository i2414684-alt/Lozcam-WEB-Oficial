import { ShieldOff, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NoAutorizadoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div
        className="w-full max-w-sm rounded-2xl p-8 text-center"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        {/* Ícono */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-5">
          <ShieldOff size={28} className="text-red-500" />
        </div>

        {/* Título */}
        <h1
          className="text-lg font-bold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Acceso no autorizado
        </h1>

        {/* Descripción */}
        <p
          className="text-sm leading-relaxed mb-7"
          style={{ color: 'var(--text-secondary)' }}
        >
          No tienes permiso para acceder a esta sección.
          <br />
          Contacta a un administrador si crees que esto es un error.
        </p>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-action hover:bg-action-hover text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <ArrowLeft size={15} />
          Volver al dashboard
        </Link>
      </div>
    </div>
  )
}
