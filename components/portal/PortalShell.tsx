'use client'

import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

type Profile = {
  id: string | number
  nombre: string
  apellidos: string
  rol: string
  cliente_id: string | number | null
}

export function PortalShell({
  profile,
  children,
}: {
  profile: Profile | null
  children: React.ReactNode
}) {
  const { isDark } = useTheme()

  return (
    <div
      className="flex h-screen transition-colors duration-200"
      style={{ background: isDark ? '#0b1727' : '#f8fafc' }}
    >
      <aside
        className="w-72 border-r transition-colors duration-200"
        style={{ background: isDark ? '#0b1727' : '#ffffff' }}
      >
        <div className="p-6">
          <div className="text-sm font-bold text-amber-500">GRUPO LOZCAM</div>
          <div className="text-xs text-gray-400">Portal del Cliente</div>
        </div>

        <nav className="px-4 pb-6 space-y-2">
          <Link
            href="/portal"
            className="block rounded-xl px-3 py-2 text-sm hover:bg-amber-500/10 text-amber-400"
          >
            Resumen
          </Link>
          <Link
            href="/portal/obras"
            className="block rounded-xl px-3 py-2 text-sm hover:bg-amber-500/10 text-amber-400"
          >
            Mis Obras
          </Link>
          <Link
            href="/portal/pagos"
            className="block rounded-xl px-3 py-2 text-sm hover:bg-amber-500/10 text-amber-400"
          >
            Mis Pagos
          </Link>
          <Link
            href="/portal/solicitudes"
            className="block rounded-xl px-3 py-2 text-sm hover:bg-amber-500/10 text-amber-400"
          >
            Mis Solicitudes
          </Link>
        </nav>
      </aside>

      <div className="flex-1 overflow-hidden">
        <main
          className="h-full overflow-y-auto p-6 transition-colors duration-200"
          style={{ background: isDark ? '#0b1727' : '#f8fafc' }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

