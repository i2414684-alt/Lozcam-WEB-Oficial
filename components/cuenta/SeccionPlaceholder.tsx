'use client'

import type { ReactNode } from 'react'

interface Props {
  titulo: string
  icono: ReactNode
  descripcion: string
}

const cardStyle = {
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
}

export default function SeccionPlaceholder({ titulo, icono, descripcion }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        {titulo}
      </h2>

      <div className="rounded-xl p-6 opacity-65" style={cardStyle}>
        <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'var(--surface-elevated)', color: 'var(--text-secondary)' }}
          >
            {icono}
          </div>

          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {titulo}
              </h3>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: 'var(--surface-elevated)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--card-border)',
                }}
              >
                Próximamente
              </span>
            </div>
            <p className="text-sm max-w-xs" style={{ color: 'var(--text-secondary)' }}>
              {descripcion}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
