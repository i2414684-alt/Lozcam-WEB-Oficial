import { createClient } from '@/lib/supabase/server'

function EstadoBadge({ estado }: { estado: string | null }) {
  const text = estado ?? ''
  const verde = /ejecuc|complet/i.test(text)

  const bg = verde ? 'bg-emerald-500/10' : 'bg-gray-500/10'
  const fg = verde ? 'text-emerald-400' : 'text-gray-400'

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${bg} ${fg}`}
    >
      {estado ?? 'Sin estado'}
    </span>
  )
}

export default async function MisObrasPage() {
  const supabase = await createClient()

  const { data: obras, error } = await supabase
    .from('obras')
    .select(
      'id, codigo, nombre, tipo_servicio, distrito, estado, monto_contrato'
    )
    .order('created_at', { ascending: false })

  if (error) {
    // RLS/errores de query: mostramos empty state seguro
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Mis Obras</h1>
        <p className="text-sm text-[var(--text-secondary)]">No tienes obras registradas.</p>
      </div>
    )
  }

  if (!obras || obras.length === 0) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Mis Obras</h1>
        <p className="text-sm text-[var(--text-secondary)]">No tienes obras registradas</p>
      </div>
    )
  }

  const formatMonto = (monto: number | null) =>
    new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(monto ?? 0)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Mis Obras</h1>


      <div
        className="rounded-xl border border-[var(--table-border)] bg-[var(--card-bg)] overflow-hidden"
      >
        <div
          className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] border-b border-[var(--table-border)]"
        >
          <div className="grid grid-cols-12 gap-3 px-4 py-3 text-xs font-semibold">
            <div className="col-span-1">Código</div>
            <div className="col-span-3">Nombre</div>
            <div className="col-span-2">Tipo de servicio</div>
            <div className="col-span-2">Distrito</div>
            <div className="col-span-2">Estado</div>
            <div className="col-span-2 text-right">Monto contrato</div>
          </div>
        </div>

        <div className="divide-y divide-[var(--table-border)]">
          {obras.map((o) => (
            <div
              key={o.id}
              className="grid grid-cols-12 gap-3 px-4 py-3 hover:bg-[var(--table-row-hover)] transition-colors"
            >
              <div className="col-span-1 text-sm text-[var(--text-primary)]">
                {o.codigo}
              </div>
              <div className="col-span-3 text-sm text-[var(--text-primary)]">
                {o.nombre}
              </div>
              <div className="col-span-2 text-sm text-[var(--text-primary)]">
                {o.tipo_servicio}
              </div>
              <div className="col-span-2 text-sm text-[var(--text-primary)]">
                {o.distrito}
              </div>
              <div className="col-span-2">
                <EstadoBadge estado={o.estado as string | null} />
              </div>
              <div className="col-span-2 text-right text-sm text-[var(--text-primary)]">
                {formatMonto(o.monto_contrato as number | null)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

