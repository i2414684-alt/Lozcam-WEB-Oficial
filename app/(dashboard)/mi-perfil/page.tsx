import { createClient } from '@/lib/supabase/server'
import FormularioPerfilEditable from '@/components/perfil/FormularioPerfilEditable'

export default async function MiPerfilPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          No se pudo cargar tu perfil.
        </p>
      </div>
    )
  }

  const { data: perfil } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!perfil) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          No se encontró tu perfil en el sistema.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Mi perfil
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Información de tu cuenta en el sistema
        </p>
      </div>
      <FormularioPerfilEditable perfil={perfil} userId={user.id} />
    </div>
  )
}
