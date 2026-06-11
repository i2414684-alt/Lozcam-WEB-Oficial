import { getObraById, getFasesObra } from '@/lib/supabase/queries/obras'
import { formatFecha, formatPEN } from '@/lib/utils/formatters'
import { ESTADO_OBRA_COLOR, ESTADO_OBRA_LABEL, TIPO_SERVICIO_LABEL } from '@/lib/utils/constants'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ObraDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idParam } = await params
  const id = Number(idParam)
  if (isNaN(id)) notFound()

  const [obra, fases] = await Promise.all([
    getObraById(id),
    getFasesObra(id),
  ])

  if (!obra) notFound()

  const cardStyle = { background: 'var(--card-bg)', border: '1px solid var(--card-border)' }
  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold" style={tp}>{obra.nombre}</h1>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${ESTADO_OBRA_COLOR[obra.estado]}`}>
              {ESTADO_OBRA_LABEL[obra.estado]}
            </span>
          </div>
          <p className="text-sm" style={ts}>
            {TIPO_SERVICIO_LABEL[obra.tipo_servicio]} · {obra.direccion}
            {obra.distrito && `, ${obra.distrito}`}
          </p>
        </div>
        <Link href="/obras" className="text-sm hover:opacity-70 transition-opacity" style={ts}>
          ← Volver
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl p-4" style={cardStyle}>
          <p className="text-xs mb-1" style={ts}>Monto contrato</p>
          <p className="text-xl font-bold" style={tp}>{formatPEN(obra.monto_contrato)}</p>
        </div>
        <div className="rounded-xl p-4" style={cardStyle}>
          <p className="text-xs mb-1" style={ts}>Fecha inicio</p>
          <p className="text-sm font-semibold" style={tp}>
            {obra.fecha_inicio_planificada ? formatFecha(obra.fecha_inicio_planificada) : '—'}
          </p>
        </div>
        <div className="rounded-xl p-4" style={cardStyle}>
          <p className="text-xs mb-1" style={ts}>Fecha fin</p>
          <p className="text-sm font-semibold" style={tp}>
            {obra.fecha_fin_planificada ? formatFecha(obra.fecha_fin_planificada) : '—'}
          </p>
        </div>
      </div>

      {obra.clientes && (
        <div className="rounded-xl p-5 mb-4" style={cardStyle}>
          <h2 className="text-sm font-semibold mb-2" style={tp}>Cliente</h2>
          <p style={ts}>
            {obra.clientes.razon_social ?? `${obra.clientes.nombres} ${obra.clientes.apellidos}`}
          </p>
        </div>
      )}

      <div className="rounded-xl p-5" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={tp}>Fases de obra ({fases.length})</h2>
          <Link
            href={`/obras/${obra.id}/fases/nueva`}
            className="text-sm text-amber-500 hover:text-amber-400 font-medium"
          >
            + Agregar fase
          </Link>
        </div>

        {fases.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm mb-3" style={ts}>No hay fases registradas</p>
            <Link
              href={`/obras/${obra.id}/fases/nueva`}
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Agregar primera fase
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {fases.map((fase, index) => (
              <div
                key={fase.id}
                className="flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ border: '1px solid var(--card-border)' }}
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={tp}>{fase.nombre}</p>
                  {fase.descripcion && (
                    <p className="text-xs mt-0.5" style={ts}>{fase.descripcion}</p>
                  )}
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      fase.estado === 'completada'
                        ? 'bg-green-100 text-green-700'
                        : fase.estado === 'en_progreso'
                          ? 'bg-blue-100 text-blue-700'
                          : fase.estado === 'bloqueada'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {fase.estado === 'completada'
                      ? 'Completada'
                      : fase.estado === 'en_progreso'
                        ? 'En progreso'
                        : fase.estado === 'bloqueada'
                          ? 'Bloqueada'
                          : 'Pendiente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {obra.descripcion && (
        <div className="rounded-xl p-5 mt-4" style={cardStyle}>
          <h2 className="text-sm font-semibold mb-2" style={tp}>Descripción</h2>
          <p className="text-sm" style={ts}>{obra.descripcion}</p>
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <Link
          href={`/obras/${obra.id}/editar`}
          className="flex-1 text-center rounded-lg py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          style={{ border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
        >
          Editar obra
        </Link>
      </div>
    </div>
  )
}
