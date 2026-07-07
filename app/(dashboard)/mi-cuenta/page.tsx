'use client'

import { useState } from 'react'
import { Bell, Palette, Monitor } from 'lucide-react'
import ConfiguracionSidebar, { type SeccionConfig } from '@/components/cuenta/ConfiguracionSidebar'
import SeccionSeguridad from '@/components/cuenta/SeccionSeguridad'
import SeccionPlaceholder from '@/components/cuenta/SeccionPlaceholder'

export default function MiCuentaPage() {
  const [seccion, setSeccion] = useState<SeccionConfig>('seguridad')

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── Encabezado ──────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Mi cuenta
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Gestiona los datos de acceso y preferencias de tu cuenta
        </p>
      </div>

      {/* ── Layout: sidebar + contenido ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

        <ConfiguracionSidebar activa={seccion} onChange={setSeccion} />

        <div className="flex-1 min-w-0">
          {seccion === 'seguridad' && <SeccionSeguridad />}

          {seccion === 'notificaciones' && (
            <SeccionPlaceholder
              titulo="Notificaciones"
              icono={<Bell size={24} />}
              descripcion="Elige qué avisos recibir por incidencias, avances de obra y pagos."
            />
          )}

          {seccion === 'apariencia' && (
            <SeccionPlaceholder
              titulo="Apariencia"
              icono={<Palette size={24} />}
              descripcion="Tema claro, oscuro o según el sistema."
            />
          )}

          {seccion === 'sesiones' && (
            <SeccionPlaceholder
              titulo="Sesiones"
              icono={<Monitor size={24} />}
              descripcion="Revisa y cierra sesiones activas en otros dispositivos."
            />
          )}
        </div>

      </div>
    </div>
  )
}
