import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatFecha, formatPEN } from '@/lib/utils/formatters'
import { ESTADO_PRESUPUESTO_COLOR } from '@/lib/types/presupuestos'

export default async function PresupuestosPage() {
  const supabase = await createClient()
  const { data: presupuestos } = await supabase
    .from('presupuestos')
    .select('*, obras(nombre)')
    .order('created_at', { ascending: false })

  const lista = presupuestos ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Presupuestos</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {lista.length} presupuesto{lista.length !== 1 ? 's' : ''} registrado
            {lista.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/presupuestos/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Nuevo presupuesto
        </Link>
      </div>

      {lista.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">No hay presupuestos registrados aún</p>
          <Link
            href="/presupuestos/nuevo"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Crear primer presupuesto
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Presupuesto</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Obra</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Total</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Estado</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Vigente</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Fecha</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lista.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{p.nombre}</div>
                    {p.descripcion && (
                      <div className="text-xs text-gray-400 mt-0.5">{p.descripcion}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.obras?.nombre ?? '—'}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatPEN(p.total)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        ESTADO_PRESUPUESTO_COLOR[p.estado] ?? 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.es_vigente ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                        Vigente
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatFecha(p.created_at)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/presupuestos/${p.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
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

