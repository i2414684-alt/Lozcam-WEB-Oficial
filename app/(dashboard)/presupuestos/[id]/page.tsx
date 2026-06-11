import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatFecha, formatPEN } from '@/lib/utils/formatters'
import { ESTADO_PRESUPUESTO_COLOR, TIPO_COSTO_LABEL } from '@/lib/types/presupuestos'

export default async function PresupuestoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idParam } = await params
  const id = Number(idParam)
  if (isNaN(id)) notFound()

  const supabase = await createClient()

  const { data: pres, error } = await supabase
    .from('presupuestos')
    .select('*, obras(nombre)')
    .eq('id', id)
    .single()

  if (error || !pres) notFound()

  const { data: partidas } = await supabase
    .from('partidas')
    .select('id, presupuesto_id, codigo, descripcion, unidad, metrado, precio_unitario, parcial, tipo_costo, orden')
    .eq('presupuesto_id', id)
    .order('orden', { ascending: true })

  const cardStyle = { background: 'var(--card-bg)', border: '1px solid var(--card-border)' }
  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold" style={tp}>{pres.nombre}</h1>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                ESTADO_PRESUPUESTO_COLOR[pres.estado] ?? 'bg-gray-100 text-gray-700'
              }`}
            >
              {pres.estado.charAt(0).toUpperCase() + pres.estado.slice(1)}
            </span>
            {pres.es_vigente && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">Vigente</span>
            )}
          </div>
          <p className="text-sm" style={ts}>
            {pres.obras?.nombre} · {formatFecha(pres.created_at)}
          </p>
        </div>
        <Link href="/presupuestos" className="text-sm hover:opacity-70 transition-opacity" style={ts}>
          ← Volver
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl p-4" style={cardStyle}>
          <p className="text-xs mb-1" style={ts}>Costo directo</p>
          <p className="text-lg font-bold" style={tp}>{formatPEN(pres.total_directo)}</p>
        </div>
        <div className="rounded-xl p-4" style={cardStyle}>
          <p className="text-xs mb-1" style={ts}>Gastos generales</p>
          <p className="text-lg font-bold" style={tp}>{formatPEN(pres.gastos_generales)}</p>
        </div>
        <div className="rounded-xl p-4" style={cardStyle}>
          <p className="text-xs mb-1" style={ts}>IGV</p>
          <p className="text-lg font-bold" style={tp}>{formatPEN(pres.igv)}</p>
        </div>
        <div className="bg-amber-500 rounded-xl p-4">
          <p className="text-xs text-white/70 mb-1">TOTAL</p>
          <p className="text-lg font-bold text-white">{formatPEN(pres.total)}</p>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={cardStyle}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
          <h2 className="text-sm font-semibold" style={tp}>Partidas ({partidas?.length ?? 0})</h2>
        </div>

        {!partidas || partidas.length === 0 ? (
          <p className="text-sm text-center py-8" style={ts}>No hay partidas registradas</p>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--table-header-bg)', borderBottom: '2px solid var(--table-border)' }}>
              <tr>
                <th className="text-left px-4 py-2 text-xs font-medium" style={ts}>Código</th>
                <th className="text-left px-4 py-2 text-xs font-medium" style={ts}>Descripción</th>
                <th className="text-left px-4 py-2 text-xs font-medium" style={ts}>Unidad</th>
                <th className="text-right px-4 py-2 text-xs font-medium" style={ts}>Metrado</th>
                <th className="text-right px-4 py-2 text-xs font-medium" style={ts}>P. Unit</th>
                <th className="text-right px-4 py-2 text-xs font-medium" style={ts}>Parcial</th>
                <th className="text-left px-4 py-2 text-xs font-medium" style={ts}>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {partidas.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  style={{ borderTop: '1px solid var(--table-border)' }}
                >
                  <td className="px-4 py-2 text-xs font-mono" style={ts}>{p.codigo ?? '—'}</td>
                  <td className="px-4 py-2" style={tp}>{p.descripcion}</td>
                  <td className="px-4 py-2" style={ts}>{p.unidad ?? '—'}</td>
                  <td className="px-4 py-2 text-right" style={tp}>{p.metrado}</td>
                  <td className="px-4 py-2 text-right" style={tp}>{formatPEN(p.precio_unitario ?? 0)}</td>
                  <td className="px-4 py-2 font-medium text-right" style={tp}>{formatPEN(p.parcial ?? 0)}</td>
                  <td className="px-4 py-2 text-xs" style={ts}>{TIPO_COSTO_LABEL[p.tipo_costo] ?? p.tipo_costo}</td>
                </tr>
              ))}
            </tbody>
            <tfoot style={{ borderTop: '2px solid var(--table-border)', background: 'var(--table-header-bg)' }}>
              <tr>
                <td colSpan={5} className="px-4 py-2 text-sm font-bold text-right" style={tp}>
                  TOTAL DIRECTO
                </td>
                <td className="px-4 py-2 text-sm font-bold text-right text-amber-500">
                  {formatPEN(pres.total_directo)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  )
}
