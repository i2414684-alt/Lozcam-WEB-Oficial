'use client'

import { useTheme } from '@/contexts/ThemeContext'
import PortalSidebar from '@/components/portal/PortalSidebar'
import PortalNavbar from '@/components/portal/PortalNavbar'

type Profile = any

export default function PortalShell({
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
      <PortalSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <PortalNavbar profile={profile} />

        <main
          className="flex-1 overflow-y-auto p-6"
          style={{ background: isDark ? '#0b1727' : '#f8fafc' }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

