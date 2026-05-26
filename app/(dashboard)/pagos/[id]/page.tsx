import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatFecha, formatPEN } from '@/lib/utils/formatters'
import {
  ESTADO_PAGO_COLOR,
  ESTADO_PAGO_LABEL,
  METODO_PAGO_LABEL,
} from '@/lib/types/pagos'

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
      obras (nombre),
      clientes (nombres, apellidos, razon_social, telefono, email)
    `)
    .eq('id', id)
    .single()

  if (error || !pago) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{pago.concepto}</h1>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${ESTADO_PAGO_COLOR[pago.estado]}`}
            >
              {ESTADO_PAGO_LABEL[pago.estado]}
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            {pago.obras?.nombre} · {formatFecha(pago.fecha_pago)}
          </p>
        </div>
        <Link href="/pagos" className="text-sm text-gray-500 hover:text-gray-700">
          ← Volver
        </Link>
      </div>

      <div className="bg-blue-600 rounded-xl p-6 mb-4 text-white">
        <p className="text-sm text-blue-100 mb-1">Monto recibido</p>
        <p className="text-4xl font-bold">{formatPEN(Number(pago.monto))}</p>
        <p className="text-sm text-blue-200 mt-1">
          {METODO_PAGO_LABEL[pago.metodo_pago] ?? pago.metodo_pago}
          {pago.numero_operacion ? ` · Op: ${pago.numero_operacion}` : null}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Cliente</p>
            <p className="text-sm font-medium text-gray-900">
              {pago.clientes?.razon_social ??
                `${pago.clientes?.nombres ?? ''} ${pago.clientes?.apellidos ?? ''}`}
            </p>
            {pago.clientes?.telefono ? (
              <p className="text-xs text-gray-400 mt-0.5">{pago.clientes.telefono}</p>
            ) : null}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Obra</p>
            <p className="text-sm font-medium text-gray-900">{pago.obras?.nombre}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Fecha de pago</p>
            <p className="text-sm font-medium text-gray-900">{formatFecha(pago.fecha_pago)}</p>
          </div>
          {pago.numero_cuota ? (
            <div>
              <p className="text-xs text-gray-500 mb-1">Cuota</p>
              <p className="text-sm font-medium text-gray-900">#{pago.numero_cuota}</p>
            </div>
          ) : null}

          {pago.numero_operacion ? (
            <div>
              <p className="text-xs text-gray-500 mb-1">N° Operación</p>
              <p className="text-sm font-medium text-gray-900 font-mono">
                {pago.numero_operacion}
              </p>
            </div>
          ) : null}
        </div>

        {pago.notas ? (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Notas</p>
            <p className="text-sm text-gray-600">{pago.notas}</p>
          </div>
        ) : null}
      </div>

      {pago.archivo_voucher ? (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Voucher</h2>
          <Link
            href={pago.archivo_voucher}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver voucher →
          </Link>
        </div>
      ) : null}

      {pago.estado === 'pendiente' ? (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Acciones</h2>
          <div className="flex gap-3">
            <VerificarPagoButton pagoId={pago.id} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function VerificarPagoButton({ pagoId }: { pagoId: number }) {
  return (
    <form
      action={async () => {
        'use server'
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = await createClient()
        await supabase.from('pagos_clientes').update({ estado: 'pagado' }).eq('id', pagoId)
      }}
    >
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
      >
        ✓ Marcar como pagado
      </button>
    </form>
  )
}

