import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function EstadoObraBadge({ estado }: { estado: string | null }) {
  const text = (estado ?? '').toLowerCase()
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

export default async function PortalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre, apellidos, rol, cliente_id')
    .eq('id', user.id)
    .single()

  const [{ data: obras }, { data: pagos }, { data: solicitudes }] = await Promise.all([
    supabase
      .from('obras')
      .select('id, nombre, estado, monto_contrato')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('pagos_clientes')
      .select('monto, estado')
      .order('fecha_pago', { ascending: false })
      .limit(200),
    supabase
      .from('solicitudes')
      .select('id, estado, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const obrasList = obras ?? []
  const pagosList = pagos ?? []
  const solicitudesList = solicitudes ?? []

  const formatMonto = (monto: number) =>
    new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(monto)

  const misObrasCount = obrasList.length
  const enEjecucionCount = obrasList.filter((o: any) => {
    const t = String(o.estado ?? '')
    return /ejecuc|complet/i.test(t)
  }).length

  const deudaPendiente = pagosList
    .filter((p: any) => String(p.estado ?? '').toLowerCase() === 'pendiente')
    .reduce((acc: number, p: any) => acc + Number(p.monto ?? 0), 0)

  const solicitudesCount = solicitudesList.length

  const obrasRecientes = obrasList.slice(0, 5)
  const solicitudesRecientes = solicitudesList.slice(0, 5)

  const deudaPendingFormatted = formatMonto(deudaPendiente)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">
          Bienvenido, {profile?.nombre ?? ''}
        </h1>
        <p className="text-sm text-gray-400">Resumen del Portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div
          className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5"
        >
          <div className="text-sm text-gray-400">Mis Obras</div>
          <div className="text-3xl font-semibold text-white">{misObrasCount}</div>
        </div>

        <div
          className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5"
        >
          <div className="text-sm text-gray-400">En Ejecución</div>
          <div className="text-3xl font-semibold text-white">{enEjecucionCount}</div>
        </div>

        <div
          className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5"
        >
          <div className="text-sm text-gray-400">Deuda Pendiente</div>
          <div className="text-3xl font-semibold text-white">{deudaPendingFormatted}</div>
        </div>

        <div
          className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5"
        >
          <div className="text-sm text-gray-400">Solicitudes</div>
          <div className="text-3xl font-semibold text-white">{solicitudesCount}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Mis Obras</h2>

          {obrasRecientes.length === 0 ? (
            <div className="rounded-xl border border-[var(--table-border)] bg-[var(--card-bg)] p-6">
              <p className="text-sm text-gray-400">No tienes obras registradas.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--table-border)] bg-[var(--card-bg)] overflow-hidden">
              <div className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] border-b border-[var(--table-border)]">
                <div className="grid grid-cols-12 gap-3 px-4 py-3 text-xs font-semibold">
                  <div className="col-span-6">Nombre</div>
                  <div className="col-span-3">Estado</div>
                  <div className="col-span-3 text-right">Monto</div>
                </div>
              </div>

              <div className="divide-y divide-[var(--table-border)]">
                {obrasRecientes.map((o: any) => (
                  <div
                    key={o.id}
                    className="grid grid-cols-12 gap-3 px-4 py-3 hover:bg-[var(--table-row-hover)] transition-colors"
                  >
                    <div className="col-span-6 text-sm text-[var(--text-primary)]">
                      {o.nombre}
                    </div>
                    <div className="col-span-3">
                      <EstadoObraBadge estado={o.estado} />
                    </div>
                    <div className="col-span-3 text-right text-sm text-[var(--text-primary)]">
                      {formatMonto(Number(o.monto_contrato ?? 0))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Solicitudes recientes</h2>

          {solicitudesRecientes.length === 0 ? (
            <div className="rounded-xl border border-[var(--table-border)] bg-[var(--card-bg)] p-6">
              <p className="text-sm text-gray-400">No tienes solicitudes registradas.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--table-border)] bg-[var(--card-bg)] overflow-hidden">
              <div className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] border-b border-[var(--table-border)]">
                <div className="grid grid-cols-12 gap-3 px-4 py-3 text-xs font-semibold">
                  <div className="col-span-4">Fecha</div>
                  <div className="col-span-4">Estado</div>
                  <div className="col-span-4">ID</div>
                </div>
              </div>

              <div className="divide-y divide-[var(--table-border)]">
                {solicitudesRecientes.map((s: any) => (
                  <div
                    key={s.id}
                    className="grid grid-cols-12 gap-3 px-4 py-3 hover:bg-[var(--table-row-hover)] transition-colors"
                  >
                    <div className="col-span-4 text-sm text-[var(--text-primary)]">
                      {s.created_at ? String(s.created_at).slice(0, 10) : '-'}
                    </div>
                    <div className="col-span-4">
                      <span
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-amber-500/10 text-amber-400"
                      >
                        {s.estado ?? 'Sin estado'}
                      </span>
                    </div>
                    <div className="col-span-4 text-sm text-[var(--text-primary)]">
                      {s.id}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}


