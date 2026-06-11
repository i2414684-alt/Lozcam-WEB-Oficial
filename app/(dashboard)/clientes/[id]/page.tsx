import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatFecha } from '@/lib/utils/formatters'

export default async function ClienteDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idParam } = await params
  const id = Number(idParam)
  if (isNaN(id)) notFound()

  const supabase = await createClient()
  const { data: cliente, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !cliente) notFound()

  const cardStyle = { background: 'var(--card-bg)', border: '1px solid var(--card-border)' }
  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }
  const dividerStyle = { borderColor: 'var(--card-border)' }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={tp}>
            {cliente.tipo_persona === 'natural'
              ? `${cliente.nombres} ${cliente.apellidos}`
              : cliente.razon_social}
          </h1>
          <p className="text-sm mt-0.5" style={ts}>
            {cliente.tipo_persona === 'natural' ? 'Persona Natural' : 'Persona Jurídica'}
          </p>
        </div>
        <Link href="/clientes" className="text-sm hover:opacity-70 transition-opacity" style={ts}>
          ← Volver
        </Link>
      </div>

      <div className="rounded-xl p-6 space-y-4" style={cardStyle}>
        <div className="grid grid-cols-2 gap-4">
          {cliente.tipo_persona === 'natural' ? (
            <>
              <div>
                <p className="text-xs mb-1" style={ts}>DNI</p>
                <p className="text-sm font-medium" style={tp}>{cliente.dni ?? '—'}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-xs mb-1" style={ts}>RUC</p>
                <p className="text-sm font-medium" style={tp}>{cliente.ruc ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={ts}>Nombre comercial</p>
                <p className="text-sm font-medium" style={tp}>{cliente.nombre_comercial ?? '—'}</p>
              </div>
            </>
          )}

          <div>
            <p className="text-xs mb-1" style={ts}>Email</p>
            <p className="text-sm font-medium" style={tp}>{cliente.email ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={ts}>Teléfono</p>
            <p className="text-sm font-medium" style={tp}>{cliente.telefono ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={ts}>WhatsApp</p>
            <p className="text-sm font-medium" style={tp}>{cliente.whatsapp ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={ts}>Distrito</p>
            <p className="text-sm font-medium" style={tp}>{cliente.distrito ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={ts}>Provincia</p>
            <p className="text-sm font-medium" style={tp}>{cliente.provincia ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={ts}>Departamento</p>
            <p className="text-sm font-medium" style={tp}>{cliente.departamento ?? '—'}</p>
          </div>
        </div>

        {cliente.direccion && (
          <div>
            <p className="text-xs mb-1" style={ts}>Dirección</p>
            <p className="text-sm font-medium" style={tp}>{cliente.direccion}</p>
          </div>
        )}

        {cliente.notas && (
          <div>
            <p className="text-xs mb-1" style={ts}>Notas</p>
            <p className="text-sm" style={ts}>{cliente.notas}</p>
          </div>
        )}

        <div className="pt-2 border-t" style={dividerStyle}>
          <p className="text-xs" style={ts}>Registrado el {formatFecha(cliente.created_at)}</p>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <Link
          href={`/clientes/${cliente.id}/editar`}
          className="flex-1 text-center rounded-lg py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          style={{ border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
        >
          Editar cliente
        </Link>
      </div>
    </div>
  )
}

