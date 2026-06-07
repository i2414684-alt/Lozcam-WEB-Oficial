import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  Building,
  Activity,
  Wallet,
  ClipboardList,
} from 'lucide-react'

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

  const deudaPendingFormatted = formatMonto(deudaPendiente)

  return (
    <div className="space-y-6">
      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
          <div className="flex items-start justify-between">
            <div className="text-[10px] tracking-wide text-[var(--text-secondary)] uppercase">
              Mis Obras
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <Building className="text-blue-400" size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
            {misObrasCount}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">
            Total registradas
          </div>
        </div>

        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
          <div className="flex items-start justify-between">
            <div className="text-[10px] tracking-wide text-[var(--text-secondary)] uppercase">
              En Ejecución
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <Activity className="text-emerald-400" size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
            {enEjecucionCount}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1 inline-flex items-center gap-1">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                enEjecucionCount > 0 ? 'bg-emerald-400' : 'bg-gray-400'
              }`}
            />
            {enEjecucionCount > 0 ? 'Activa ahora' : 'Sin ejecuciones'}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
          <div className="flex items-start justify-between">
            <div className="text-[10px] tracking-wide text-[var(--text-secondary)] uppercase">
              Deuda Pendiente
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <Wallet className="text-amber-400" size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
            {deudaPendingFormatted}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">
            Saldo por pagar
          </div>
        </div>

        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
          <div className="flex items-start justify-between">
            <div className="text-[10px] tracking-wide text-[var(--text-secondary)] uppercase">
              Solicitudes
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
              <ClipboardList className="text-purple-400" size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
            {solicitudesCount}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">
            {solicitudesCount === 0 ? 'Sin pendientes' : `${solicitudesCount} pendientes`}
          </div>
        </div>
      </div>

      {/* 2 COLUMNAS */}
      <div className="grid grid-cols-[1.4fr_1fr] gap-4">
        <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 space-y-3">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Mis Obras</h2>

          {obrasList.length === 0 ? (
            <div className="text-sm text-[var(--text-secondary)]">No hay obras registradas.</div>
          ) : (
            <div className="space-y-3">
              {obrasList.slice(0, 8).map((o: any) => {
                const estadoText = String(o.estado ?? '')
                const verde = /ejecuc|complet/i.test(estadoText)
                return (
                  <div
                    key={o.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--table-border)] px-3 py-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                        <Building size={16} className="text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-[var(--text-primary)] truncate">
                          {o.nombre}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] truncate">
                          {o.tipo ?? o.distrito ?? '—'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-sm font-medium text-[var(--text-primary)]">
                        {formatMonto(Number(o.monto_contrato ?? 0))}
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          verde ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {o.estado ?? '—'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 space-y-3">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Estado de pagos</h2>

          {pagosList.length === 0 ? (
            <div className="text-sm text-[var(--text-secondary)]">Sin pagos registrados</div>
          ) : (
            (() => {
              const total = pagosList.reduce((acc: number, p: any) => acc + Number(p.monto ?? 0), 0)
              const pagado = pagosList
                .filter((p: any) => String(p.estado ?? '').toLowerCase() === 'pagado')
                .reduce((acc: number, p: any) => acc + Number(p.monto ?? 0), 0)
              const pendiente = pagosList
                .filter((p: any) => String(p.estado ?? '').toLowerCase() === 'pendiente')
                .reduce((acc: number, p: any) => acc + Number(p.monto ?? 0), 0)

              const pctPagado = total > 0 ? Math.min(100, Math.round((pagado / total) * 100)) : 0
              const pctPendiente = total > 0 ? Math.min(100, Math.round((pendiente / total) * 100)) : 0

              return (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>Pagado</span>
                      <span className="text-emerald-400">{formatMonto(pagado)}</span>
                    </div>
                    <div className="mt-2 w-full">
                      <div className="h-2 rounded-full bg-[var(--table-header-bg)] border border-[var(--table-border)]" />
                      <div
                        className="h-2 rounded-full bg-emerald-500 -mt-2"
                        style={{ width: `${pctPagado}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>Pendiente</span>
                      <span className="text-amber-400">{formatMonto(pendiente)}</span>
                    </div>
                    <div className="mt-2 w-full">
                      <div className="h-2 rounded-full bg-[var(--table-header-bg)] border border-[var(--table-border)]" />
                      <div
                        className="h-2 rounded-full bg-amber-500 -mt-2"
                        style={{ width: `${pctPendiente}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })()
          )}
        </section>
      </div>
    </div>
  )
}

