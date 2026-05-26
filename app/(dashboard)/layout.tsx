import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/shared/Sidebar'
import Navbar from '@/components/shared/Navbar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, nombre, apellidos, rol, avatar_url')
    .eq('id', user.id)
    .single()


  console.log('PERFIL:', profile)
  console.log('ERROR:', error)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar rol={profile?.rol ?? ''} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar profile={profile} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}


