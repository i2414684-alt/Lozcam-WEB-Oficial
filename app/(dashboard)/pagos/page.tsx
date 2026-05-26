import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatFecha, formatPEN } from '@/lib/utils/formatters'
import {
  ESTADO_PAGO_COLOR,
  ESTADO_PAGO_LABEL,
  METODO_PAGO_LABEL,
} from '@/lib/types/pagos'

export default async function PagosPage() {
  const supabase = await createClient()
  const { data: pagos } = await supabase
    .from('pagos_clientes')
    .select(`
      *,
      obras (nombre),
      clientes (nombres, apellidos, razon_social)
    `)
    .order('created_at', { ascending: false })

  const lista = pagos ?? []
  const totalPagado = lista
    .filter((p) => p.estado === 'pagado')
    .reduce((sum, p) => sum + Number(p.monto), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pagos</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {lista.length} pago{lista.length !== 1 ? 's' : ''} registrado
            {lista.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/pagos/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Registrar pago
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Total pagos</p>
          <p className="text-xl font-bold text-gray-900">{lista.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Total cobrado</p>
          <p className="text-xl font-bold text-green-600">
            {formatPEN(totalPagado)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Pendientes</p>
          <p className="text-xl font-bold text-yellow-600">
            {lista.filter((p) => p.estado === 'pendiente').length}
          </p>
        </div>
      </div>

      {lista.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">No hay pagos registrados aún</p>
          <Link
            href="/pagos/nuevo"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Registrar primer pago
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">
                  Concepto
                </th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">
                  Obra
                </th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">
                  Cliente
                </th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">
                  Monto
                </th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">
                  Método
                </th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">
                  Estado
                </th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">
                  Fecha
                </th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lista.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{p.concepto}</div>
                    {p.numero_cuota ? (
                      <div className="text-xs text-gray-400">Cuota #{p.numero_cuota}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {p.obras?.nombre ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {p.clientes?.razon_social ??
                      `${p.clientes?.nombres ?? ''} ${p.clientes?.apellidos ?? ''}`}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {formatPEN(Number(p.monto))}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {METODO_PAGO_LABEL[p.metodo_pago] ?? p.metodo_pago}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_PAGO_COLOR[p.estado]}`}
                    >
                      {ESTADO_PAGO_LABEL[p.estado]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {formatFecha(p.fecha_pago)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/pagos/${p.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

