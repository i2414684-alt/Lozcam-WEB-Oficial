'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, Building, CreditCard, ClipboardList, LayoutDashboard } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function PortalSidebar() {
  const pathname = usePathname()
  const { isDark } = useTheme()

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

  return (
    <aside
      className="w-52 h-screen border-r transition-colors"
      style={{ background: isDark ? '#081320' : '#ffffff' }}
    >
      <div
        className="border-r transition-colors"
        style={{ borderColor: isDark ? 'rgba(255,255,255,0.10)' : '#e5e7eb' }}
      />

      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
            <Building2 size={19} className="text-gray-950" />
          </div>
          <div className="leading-tight">
            <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              GRUPO LOZCAM
            </div>
            <div className="text-[10px] text-amber-500">Portal del Cliente</div>
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
                className={
                  activo
                    ? 'flex items-center gap-2 px-3 py-2.5 rounded-lg bg-amber-500/12 text-amber-500 font-medium'
                    : `flex items-center gap-2 px-3 py-2.5 rounded-lg ${baseText} hover:bg-amber-500/5 hover:text-amber-500/90 transition-colors`
                }
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

