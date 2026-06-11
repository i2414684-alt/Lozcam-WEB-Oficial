import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatFecha, formatPEN } from '@/lib/utils/formatters'
import { ESTADO_PAGO_COLOR, ESTADO_PAGO_LABEL, METODO_PAGO_LABEL } from '@/lib/types/pagos'

export default async function PagoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idParam } = await params
  const id = Number(idParam)
  if (isNaN(id)) notFound()

  const supabase = await createClient()

  const { data: pago, error } = await supabase
    .from('pagos_clientes')
    .select(`
      *,
      obras (
        nombre,
        clientes (nombres, apellidos, razon_social)
      )
    `)
    .eq('id', id)
    .single()

  if (error || !pago) notFound()

  const cardStyle = { background: 'var(--card-bg)', border: '1px solid var(--card-border)' }
  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }
  const dividerStyle = { borderColor: 'var(--card-border)' }

  const cliente = (pago.obras as any)?.clientes
  const nombreCliente = cliente?.razon_social
    ?? (cliente?.nombres ? `${cliente.nombres} ${cliente.apellidos ?? ''}`.trim() : null)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold" style={tp}>{pago.concepto}</h1>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${ESTADO_PAGO_COLOR[pago.estado]}`}>
              {ESTADO_PAGO_LABEL[pago.estado]}
            </span>
          </div>
          <p className="text-sm" style={ts}>
            {(pago.obras as any)?.nombre ?? '—'}
            {pago.numero_cuota ? ` · Cuota #${pago.numero_cuota}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/pagos/${id}/editar`}
            className="text-sm bg-amber-500 hover:bg-amber-400 text-gray-950 px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            Editar
          </Link>
          <Link href="/pagos" className="text-sm hover:opacity-70 transition-opacity" style={ts}>
            ← Volver
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="rounded-xl p-4" style={cardStyle}>
          <p className="text-xs mb-1" style={ts}>Monto</p>
          <p className="text-xl font-bold" style={tp}>{formatPEN(Number(pago.monto))}</p>
          <p className="text-xs mt-0.5" style={ts}>{pago.moneda}</p>
        </div>
        <div className="rounded-xl p-4" style={cardStyle}>
          <p className="text-xs mb-1" style={ts}>Fecha de pago</p>
          <p className="text-sm font-semibold" style={tp}>{formatFecha(pago.fecha_pago)}</p>
        </div>
        <div className="rounded-xl p-4" style={cardStyle}>
          <p className="text-xs mb-1" style={ts}>Método</p>
          <p className="text-sm font-semibold" style={tp}>
            {METODO_PAGO_LABEL[pago.metodo_pago] ?? pago.metodo_pago}
          </p>
        </div>
      </div>

      <div className="rounded-xl p-6 space-y-4" style={cardStyle}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs mb-1" style={ts}>Obra</p>
            <p className="text-sm font-medium" style={tp}>{(pago.obras as any)?.nombre ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={ts}>Cliente</p>
            <p className="text-sm font-medium" style={tp}>{nombreCliente ?? '—'}</p>
          </div>
          {pago.numero_cuota && (
            <div>
              <p className="text-xs mb-1" style={ts}>Número de cuota</p>
              <p className="text-sm font-medium" style={tp}>#{pago.numero_cuota}</p>
            </div>
          )}
          {pago.numero_operacion && (
            <div>
              <p className="text-xs mb-1" style={ts}>N° operación</p>
              <p className="text-sm font-medium font-mono" style={tp}>{pago.numero_operacion}</p>
            </div>
          )}
        </div>

        {pago.archivo_voucher && (
          <div className="pt-4 border-t" style={dividerStyle}>
            <p className="text-xs mb-2" style={ts}>Voucher adjunto</p>
            <a
              href={pago.archivo_voucher}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amber-500 hover:text-amber-400 font-medium"
            >
              Ver comprobante →
            </a>
          </div>
        )}

        {pago.notas && (
          <div className="pt-4 border-t" style={dividerStyle}>
            <p className="text-xs mb-1" style={ts}>Notas</p>
            <p className="text-sm" style={ts}>{pago.notas}</p>
          </div>
        )}

        <div className="pt-4 border-t" style={dividerStyle}>
          <p className="text-xs" style={ts}>Registrado el {formatFecha(pago.created_at)}</p>
        </div>
      </div>
    </div>
  )
}
