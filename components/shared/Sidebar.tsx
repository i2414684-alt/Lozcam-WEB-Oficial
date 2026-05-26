'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/formatters'
import {
  Building2,
  Users,
  FileText,
  FolderOpen,
  Calculator,
  CreditCard,
  UserCheck,
  ClipboardList,
  LayoutDashboard,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles: string[]
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard size={18} />,
    roles: ['gerente_general', 'subgerente', 'administrador'],
  },
  {
    label: 'Obras',
    href: '/obras',
    icon: <Building2 size={18} />,
    roles: [
      'gerente_general',
      'subgerente',
      'administrador',
      'ingeniero_residente',
      'arquitecto',
      'maestro_obra',
    ],
  },
  {
    label: 'Clientes',
    href: '/clientes',
    icon: <Users size={18} />,
    roles: ['gerente_general', 'subgerente', 'administrador', 'vendedor'],
  },
  {
    label: 'Solicitudes',
    href: '/solicitudes',
    icon: <ClipboardList size={18} />,
    roles: ['gerente_general', 'subgerente', 'administrador', 'vendedor'],
  },
  {
    label: 'Documentos',
    href: '/documentos',
    icon: <FolderOpen size={18} />,
    roles: [
      'gerente_general',
      'subgerente',
      'administrador',
      'ingeniero_residente',
      'arquitecto',
      'tecnico_autocad',
      'topografo',
    ],
  },
  {
    label: 'Presupuestos',
    href: '/presupuestos',
    icon: <Calculator size={18} />,
    roles: [
      'gerente_general',
      'subgerente',
      'administrador',
      'ingeniero_residente',
      'contador',
    ],
  },
  {
    label: 'Pagos',
    href: '/pagos',
    icon: <CreditCard size={18} />,
    roles: ['gerente_general', 'subgerente', 'administrador', 'contador'],
  },
  {
    label: 'Personal',
    href: '/personal',
    icon: <UserCheck size={18} />,
    roles: ['gerente_general', 'subgerente', 'administrador'],
  },
  {
    label: 'Reportes',
    href: '/reportes',
    icon: <FileText size={18} />,
    roles: [
      'gerente_general',
      'subgerente',
      'administrador',
      'ingeniero_residente',
      'maestro_obra',
    ],
  },
]

export default function Sidebar({ rol }: { rol: string }) {
  const pathname = usePathname()

  const itemsVisibles = navItems.filter((item) => item.roles.includes(rol))

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">GRUPO LOZCAM</h1>
        <p className="text-xs text-gray-500 mt-0.5">Sistema de Gestión</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {itemsVisibles.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === item.href
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 text-xs text-gray-400 text-center">
        LOZCAM © 2025
      </div>
    </aside>
  )
}

