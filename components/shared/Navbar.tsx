'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ROL_SISTEMA } from '@/lib/utils/constants'

const ROL_LABEL: Record<string, string> = {
  gerente_general: 'Gerente General',
  subgerente: 'Subgerente',
  administrador: 'Administrador',
  ingeniero_residente: 'Ing. Residente',
  arquitecto: 'Arquitecto',
  tecnico_autocad: 'Técnico AutoCAD',
  topografo: 'Topógrafo',
  maestro_obra: 'Maestro de Obra',
  personal_obra: 'Personal de Obra',
  contador: 'Contador',
  vendedor: 'Vendedor',
  cliente: 'Cliente',
}

interface Profile {
  nombre: string
  apellidos: string
  rol: string
  avatar_url: string | null
}

export default function Navbar({ profile }: { profile: Profile | null }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {profile?.nombre} {profile?.apellidos}
          </p>
          <p className="text-xs text-gray-500">
            {profile?.rol ? ROL_LABEL[profile.rol] : ''}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Salir
        </button>
      </div>
    </header>
  )
}

