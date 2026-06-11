import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const ROL_LABEL: Record<string, string> = {
  gerente_general:     'Gerente General',
  subgerente:          'Subgerente',
  administrador:       'Administrador',
  ingeniero_residente: 'Ing. Residente',
  arquitecto:          'Arquitecto',
  tecnico_autocad:     'Técnico AutoCAD',
  topografo:           'Topógrafo',
  maestro_obra:        'Maestro de Obra',
  personal_obra:       'Personal de Obra',
  contador:            'Contador',
  vendedor:            'Vendedor',
  cliente:             'Cliente',
}

export default async function PersonalDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: perfil, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !perfil) notFound()

  const { data: asignaciones } = await supabase
    .from('asignaciones')
    .select('*, obras(nombre, estado)')
    .eq('perfil_id', id)
    .eq('activo', true)

  const cardStyle = { background: 'var(--card-bg)', border: '1px solid var(--card-border)' }
  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={tp}>
            {perfil.nombre} {perfil.apellidos}
          </h1>
          <p className="text-sm mt-0.5" style={ts}>
            {ROL_LABEL[perfil.rol] ?? perfil.rol}
          </p>
        </div>
        <Link href="/personal" className="text-sm hover:opacity-70 transition-opacity" style={ts}>
          ← Volver
        </Link>
      </div>

      <div className="rounded-xl p-6 space-y-4 mb-4" style={cardStyle}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs mb-1" style={ts}>DNI</p>
            <p className="text-sm font-medium" style={tp}>{perfil.dni ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={ts}>Teléfono</p>
            <p className="text-sm font-medium" style={tp}>{perfil.telefono ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={ts}>Email personal</p>
            <p className="text-sm font-medium" style={tp}>{perfil.email_personal ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={ts}>Fecha ingreso</p>
            <p className="text-sm font-medium" style={tp}>{perfil.fecha_ingreso ?? '—'}</p>
          </div>
        </div>
        {perfil.especialidades && perfil.especialidades.length > 0 && (
          <div>
            <p className="text-xs mb-2" style={ts}>Especialidades</p>
            <div className="flex flex-wrap gap-2">
              {perfil.especialidades.map((esp: string) => (
                <span key={esp} className="text-xs px-2 py-1 bg-amber-500/10 text-amber-500 rounded-full">
                  {esp}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl p-5" style={cardStyle}>
        <h2 className="text-sm font-semibold mb-4" style={tp}>
          Obras asignadas ({asignaciones?.length ?? 0})
        </h2>
        {!asignaciones || asignaciones.length === 0 ? (
          <p className="text-sm text-center py-4" style={ts}>
            No tiene obras asignadas actualmente
          </p>
        ) : (
          <div className="space-y-2">
            {asignaciones.map((a: any) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ border: '1px solid var(--card-border)' }}
              >
                <div>
                  <p className="text-sm font-medium" style={tp}>{a.obras?.nombre}</p>
                  <p className="text-xs mt-0.5" style={ts}>
                    {ROL_LABEL[a.rol_en_obra] ?? a.rol_en_obra}
                  </p>
                </div>
                <Link
                  href={`/obras/${a.obra_id}`}
                  className="text-xs text-amber-500 hover:text-amber-400"
                >
                  Ver obra →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
