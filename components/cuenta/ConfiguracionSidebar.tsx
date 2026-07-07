'use client'

import { ShieldCheck, Bell, Palette, Monitor } from 'lucide-react'

export type SeccionConfig = 'seguridad' | 'notificaciones' | 'apariencia' | 'sesiones'

interface Item {
  id: SeccionConfig
  label: string
  icon: React.ReactNode
}

const ITEMS: Item[] = [
  { id: 'seguridad',      label: 'Seguridad',       icon: <ShieldCheck size={16} /> },
  { id: 'notificaciones', label: 'Notificaciones',   icon: <Bell        size={16} /> },
  { id: 'apariencia',     label: 'Apariencia',       icon: <Palette     size={16} /> },
  { id: 'sesiones',       label: 'Sesiones',         icon: <Monitor     size={16} /> },
]

interface Props {
  activa: SeccionConfig
  onChange: (s: SeccionConfig) => void
}

export default function ConfiguracionSidebar({ activa, onChange }: Props) {
  return (
    <>
      {/* ── Desktop: columna vertical ──────────────────────────────────── */}
      <nav className="hidden md:flex flex-col gap-1 w-48 shrink-0">
        {ITEMS.map((item) => {
          const isActive = item.id === activa
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors"
              style={
                isActive
                  ? { background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }
                  : { background: 'transparent', border: '1px solid transparent', color: 'var(--text-secondary)' }
              }
            >
              <span className={isActive ? 'text-[#1E6FBF]' : ''}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* ── Mobile: pestañas horizontales con scroll ───────────────────── */}
      <nav
        className="md:hidden flex flex-row gap-1 overflow-x-auto pb-1 mb-4"
        style={{ scrollbarWidth: 'none' }}
      >
        {ITEMS.map((item) => {
          const isActive = item.id === activa
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shrink-0"
              style={
                isActive
                  ? { background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }
                  : { background: 'transparent', border: '1px solid transparent', color: 'var(--text-secondary)' }
              }
            >
              <span className={isActive ? 'text-[#1E6FBF]' : ''}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>
    </>
  )
}
