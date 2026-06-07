'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Building2,
  Building,
  CreditCard,
  ClipboardList,
  LayoutDashboard,
  Menu,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function PortalSidebar() {
  const pathname = usePathname()
  const { isDark } = useTheme()
  const [colapsado, setColapsado] = useState(false)

  const navItems = [
    {
      label: 'Resumen',
      href: '/portal',
      icon: <LayoutDashboard size={17} />,
      exact: true,
    },
    {
      label: 'Mis Obras',
      href: '/portal/obras',
      icon: <Building size={17} />,
      exact: false,
    },
    {
      label: 'Mis Pagos',
      href: '/portal/pagos',
      icon: <CreditCard size={17} />,
      exact: false,
    },
    {
      label: 'Mis Solicitudes',
      href: '/portal/solicitudes',
      icon: <ClipboardList size={17} />,
      exact: false,
    },
  ]

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  const asideBg = isDark ? '#081320' : '#ffffff'
  const borderColor = isDark ? 'rgba(255,255,255,0.10)' : '#e5e7eb'

  return (
    <aside
      className="h-screen border-r transition-all duration-300"
      style={{ background: asideBg, borderColor }}
    >
      <div className="border-r transition-colors" style={{ borderColor }} />

      <div className="p-4">
        {/* Toggle */}
        <button
          type="button"
          onClick={() => setColapsado(!colapsado)}
          className="mb-4 p-1.5 rounded-lg transition-colors"
          style={{ color: isDark ? 'rgba(255,255,255,0.75)' : '#6b7280' }}
          aria-label={colapsado ? 'Expandir menú' : 'Colapsar menú'}
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
            <Building2 size={19} className="text-gray-950" />
          </div>

          <div
            className={
              colapsado
                ? 'min-w-0 overflow-hidden opacity-0 w-0 transition-all duration-300'
                : 'min-w-0 transition-all duration-300'
            }
          >
            <div className="leading-tight">
              <div
                className={
                  isDark
                    ? 'font-semibold text-sm text-white'
                    : 'font-semibold text-sm text-gray-900'
                }
              >
                GRUPO LOZCAM
              </div>
              <div className="text-[10px] text-amber-500">Portal del Cliente</div>
            </div>
          </div>
        </div>

        <nav className="mt-4 space-y-1">
          {navItems.map((item) => {
            const activo = isActive(item.href, item.exact)
            const baseText = isDark ? 'text-gray-400' : 'text-gray-600'

            return (
              <Link
                key={item.href}
                href={item.href}
                title={colapsado ? item.label : undefined}
                className={
                  'flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors ' +
                  (activo
                    ? 'bg-amber-500/12 text-amber-500 font-medium'
                    : `${baseText} hover:bg-amber-500/5 hover:text-amber-500/90`)
                }
                style={{ justifyContent: colapsado ? 'center' : undefined }}
              >
                {item.icon}

                <span
                  className={
                    colapsado
                      ? 'text-sm whitespace-nowrap overflow-hidden w-0 opacity-0 transition-all duration-300'
                      : 'text-sm transition-all duration-300 whitespace-nowrap'}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Width control */}
      <style jsx>{`
        aside {
          width: ${colapsado ? 'w-16' : 'w-52'};
        }
      `}</style>
    </aside>
  )
}

