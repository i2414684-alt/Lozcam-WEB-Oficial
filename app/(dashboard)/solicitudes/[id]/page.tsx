import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatFecha, formatPEN } from '@/lib/utils/formatters'
import {
  ESTADO_SOLICITUD_COLOR,
  ESTADO_SOLICITUD_LABEL,
  PRIORIDAD_COLOR,
} from '@/lib/types/solicitudes'
import { TIPO_SERVICIO_LABEL } from '@/lib/utils/constants'

export default async function SolicitudDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idParam } = await params
  const id = Number(idParam)
  if (isNaN(id)) notFound()

  const supabase = await createClient()

  const { data: sol, error } = await supabase
    .from('solicitudes')
    .select(`*, clientes (nombres, apellidos, razon_social, telefono, email)`)
    .eq('id', id)
    .single()

  if (error || !sol) notFound()

  const { data: citas } = await supabase
    .from('citas')
    .select('*')
    .eq('solicitud_id', id)
    .order('fecha', { ascending: true })

  const cardStyle = { background: 'var(--card-bg)', border: '1px solid var(--card-border)' }
  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold" style={tp}>{sol.titulo}</h1>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${ESTADO_SOLICITUD_COLOR[sol.estado]}`}>
              {ESTADO_SOLICITUD_LABEL[sol.estado]}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${PRIORIDAD_COLOR[sol.prioridad]}`}>
              {sol.prioridad.charAt(0).toUpperCase() + sol.prioridad.slice(1)}
            </span>
          </div>
          <p className="text-sm" style={ts}>
            {TIPO_SERVICIO_LABEL[sol.tipo_servicio]} · {formatFecha(sol.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/solicitudes/${id}/editar`}
            className="text-sm bg-amber-500 hover:bg-amber-400 text-gray-950 px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            Editar
          </Link>
          <Link href="/solicitudes" className="text-sm hover:opacity-70 transition-opacity" style={ts}>
            ← Volver
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl p-5" style={cardStyle}>
          <h2 className="text-sm font-semibold mb-3" style={tp}>Cliente</h2>
          <p className="text-sm font-medium" style={tp}>
            {sol.clientes?.razon_social ?? `${sol.clientes?.nombres} ${sol.clientes?.apellidos}`}
          </p>
          {sol.clientes?.telefono && <p className="text-xs mt-1" style={ts}>{sol.clientes.telefono}</p>}
          {sol.clientes?.email && <p className="text-xs" style={ts}>{sol.clientes.email}</p>}
        </div>

        <div className="rounded-xl p-5" style={cardStyle}>
          <h2 className="text-sm font-semibold mb-3" style={tp}>Datos del proyecto</h2>
          {sol.direccion_obra && <p className="text-xs mb-1" style={ts}>{sol.direccion_obra}</p>}
          {sol.distrito && (
            <p className="text-xs" style={ts}>
              {sol.distrito}{sol.provincia ? `, ${sol.provincia}` : ''}
            </p>
          )}
          {sol.area_m2 && <p className="text-xs mt-1" style={ts}>Área: {sol.area_m2} m²</p>}
          {sol.presupuesto_ref && (
            <p className="text-xs" style={ts}>Presupuesto ref: {formatPEN(sol.presupuesto_ref)}</p>
          )}
          <div className="flex gap-3 mt-2">
            {sol.tiene_planos && (
              <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded">Tiene planos</span>
            )}
            {sol.tiene_terreno && (
              <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded">Tiene terreno</span>
            )}
          </div>
        </div>
      </div>

      {sol.descripcion && (
        <div className="rounded-xl p-5 mb-4" style={cardStyle}>
          <h2 className="text-sm font-semibold mb-2" style={tp}>Descripción</h2>
          <p className="text-sm" style={ts}>{sol.descripcion}</p>
        </div>
      )}

      <div className="rounded-xl p-5 mb-4" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={tp}>
            Citas ({citas?.length ?? 0})
          </h2>
          <Link href={`/solicitudes/${id}/cita`} className="text-sm text-amber-500 hover:text-amber-400 font-medium">
            + Agendar cita
          </Link>
        </div>
        {!citas || citas.length === 0 ? (
          <p className="text-sm text-center py-4" style={ts}>No hay citas agendadas</p>
        ) : (
          <div className="space-y-2">
            {citas.map((c: any) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ border: '1px solid var(--card-border)' }}
              >
                <div>
                  <p className="text-sm font-medium" style={tp}>
                    {formatFecha(c.fecha)} a las {c.hora.slice(0, 5)}
                  </p>
                  <p className="text-xs mt-0.5" style={ts}>
                    {c.tipo_cita} · {c.estado}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    c.estado === 'completada'
                      ? 'bg-green-100 text-green-700'
                      : c.estado === 'cancelada'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {c.estado.charAt(0).toUpperCase() + c.estado.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl p-5" style={cardStyle}>
        <h2 className="text-sm font-semibold mb-4" style={tp}>Acciones</h2>
        <div className="flex gap-3">
          <Link
            href={`/solicitudes/${id}/cotizacion`}
            className="flex-1 text-center bg-amber-500 hover:bg-amber-400 text-gray-950 rounded-lg py-2 text-sm font-medium transition-colors"
          >
            Crear cotización
          </Link>
          {sol.estado !== 'convertida_obra' && (
            <Link
              href={`/obras/nueva?solicitud_id=${id}&cliente_id=${sol.cliente_id}`}
              className="flex-1 text-center rounded-lg py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
            >
              Convertir a obra
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
