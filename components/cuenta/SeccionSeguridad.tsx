'use client'

import CambiarCorreoForm from '@/components/cuenta/CambiarCorreoForm'
import CambiarContrasenaForm from '@/components/cuenta/CambiarContrasenaForm'

const cardStyle = {
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
}

const divider = '1px solid var(--card-border)'

export default function SeccionSeguridad() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Seguridad
      </h2>

      <div className="space-y-4">

        {/* ── Correo electrónico ─────────────────────────────────────────── */}
        <div className="rounded-xl" style={cardStyle}>
          <div className="px-6 py-4" style={{ borderBottom: divider }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Correo electrónico
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Se enviará un correo de confirmación al nuevo correo al cambiarlo.
            </p>
          </div>
          <div className="px-6 py-5">
            <CambiarCorreoForm />
          </div>
        </div>

        {/* ── Contraseña ─────────────────────────────────────────────────── */}
        <div className="rounded-xl" style={cardStyle}>
          <div className="px-6 py-4" style={{ borderBottom: divider }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Contraseña
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Se pedirá un código de verificación al cambiarla.
            </p>
          </div>
          <div className="px-6 py-5">
            <CambiarContrasenaForm />
          </div>
        </div>

      </div>
    </div>
  )
}
