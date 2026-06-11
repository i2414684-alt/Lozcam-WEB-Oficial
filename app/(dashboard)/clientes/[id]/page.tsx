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
  const mostrar = (v: any) =>
    v === null || v === undefined || v === '' ? '—' : String(v)

  const esNatural = cliente.tipo_persona === 'natural'

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={tp}>
            {esNatural
              ? `${cliente.nombres ?? ''} ${cliente.apellidos ?? ''}`.trim() || '—'
              : mostrar(cliente.razon_social)}
          </h1>
          <p className="text-sm mt-0.5" style={ts}>
            {esNatural ? 'Persona Natural' : 'Persona Jurídica'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/clientes/${cliente.id}/editar`}
            className="text-sm bg-amber-500 hover:bg-amber-400 text-gray-950 px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            Editar
          </Link>
          <Link href="/clientes" className="text-sm hover:opacity-70 transition-opacity" style={ts}>
            ← Volver
          </Link>
        </div>
      </div>

      {/* Identificación + Contacto */}
      <div className="grid grid-cols-2 gap-4 mb-4">

        {/* Identificación */}
        <div className="rounded-xl p-5" style={cardStyle}>
          <h2 className="text-sm font-semibold mb-3" style={tp}>Identificación</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs mb-0.5" style={ts}>Tipo de persona</p>
              <p className="text-sm" style={tp}>{esNatural ? 'Persona Natural' : 'Persona Jurídica'}</p>
            </div>

            {esNatural ? (
              <>
                <div>
                  <p className="text-xs mb-0.5" style={ts}>Nombres</p>
                  <p className="text-sm font-medium" style={tp}>{mostrar(cliente.nombres)}</p>
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={ts}>Apellidos</p>
                  <p className="text-sm font-medium" style={tp}>{mostrar(cliente.apellidos)}</p>
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={ts}>DNI</p>
                  <p className="text-sm font-mono" style={tp}>{mostrar(cliente.dni)}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs mb-0.5" style={ts}>Razón social</p>
                  <p className="text-sm font-medium" style={tp}>{mostrar(cliente.razon_social)}</p>
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={ts}>Nombre comercial</p>
                  <p className="text-sm" style={tp}>{mostrar(cliente.nombre_comercial)}</p>
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={ts}>RUC</p>
                  <p className="text-sm font-mono" style={tp}>{mostrar(cliente.ruc)}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contacto */}
        <div className="rounded-xl p-5" style={cardStyle}>
          <h2 className="text-sm font-semibold mb-3" style={tp}>Contacto</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs mb-0.5" style={ts}>Email</p>
              <p className="text-sm" style={tp}>{mostrar(cliente.email)}</p>
            </div>
            <div>
              <p className="text-xs mb-0.5" style={ts}>Teléfono</p>
              <p className="text-sm" style={tp}>{mostrar(cliente.telefono)}</p>
            </div>
            <div>
              <p className="text-xs mb-0.5" style={ts}>WhatsApp</p>
              <p className="text-sm" style={tp}>{mostrar(cliente.whatsapp)}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Ubicación */}
      <div className="rounded-xl p-5 mb-4" style={cardStyle}>
        <h2 className="text-sm font-semibold mb-3" style={tp}>Ubicación</h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs mb-0.5" style={ts}>Dirección</p>
            <p className="text-sm" style={tp}>{mostrar(cliente.direccion)}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs mb-0.5" style={ts}>Distrito</p>
              <p className="text-sm" style={tp}>{mostrar(cliente.distrito)}</p>
            </div>
            <div>
              <p className="text-xs mb-0.5" style={ts}>Provincia</p>
              <p className="text-sm" style={tp}>{mostrar(cliente.provincia)}</p>
            </div>
            <div>
              <p className="text-xs mb-0.5" style={ts}>Departamento</p>
              <p className="text-sm" style={tp}>{mostrar(cliente.departamento)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notas */}
      <div className="rounded-xl p-5 mb-4" style={cardStyle}>
        <h2 className="text-sm font-semibold mb-2" style={tp}>Notas</h2>
        <p className="text-sm" style={ts}>{mostrar(cliente.notas)}</p>
      </div>

      {/* Footer: activo + fecha registro */}
      <div className="rounded-xl px-5 py-4" style={cardStyle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-xs" style={ts}>Estado:</p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                cliente.activo
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {cliente.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <p className="text-xs" style={ts}>
            Registrado el {formatFecha(cliente.created_at)}
          </p>
        </div>
      </div>

    </div>
  )
}
