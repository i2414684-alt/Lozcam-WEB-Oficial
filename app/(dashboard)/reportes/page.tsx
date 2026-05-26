import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatFecha } from '@/lib/utils/formatters'

export default async function ReportesPage() {
  const supabase = await createClient()

  const { data: reportes } = await supabase
    .from('reportes_diarios')
    .select('*, obras(nombre)')
    .order('fecha', { ascending: false })

  const { data: incidencias } = await supabase
    .from('incidencias')
    .select('*')
    .eq('resuelto', false)

  const lista = reportes ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes de Obra</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {lista.length} reporte{lista.length !== 1 ? 's' : ''} registrado{lista.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/reportes/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Nuevo reporte
        </Link>
      </div>

      {(incidencias?.length ?? 0) > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-lg">⚠️</span>
            <p className="text-sm font-medium text-red-700">
              {incidencias?.length} incidencia{incidencias!.length !== 1 ? 's' : ''} sin resolver
            </p>
            <Link href="/reportes/incidencias" className="ml-auto text-xs text-red-600 hover:text-red-800 font-medium">
              Ver incidencias →
            </Link>
          </div>
        </div>
      )}

      {lista.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">No hay reportes registrados aún</p>
          <Link
            href="/reportes/nuevo"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Crear primer reporte
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Obra</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Fecha</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Clima</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Personal</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Resumen</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lista.map((r: any) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{r.obras?.nombre ?? '—'}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatFecha(r.fecha)}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {r.clima ?? '—'}
                    {r.temp_celsius && ` · ${r.temp_celsius}°C`}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-center">{r.personal_count ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{r.descripcion}</td>
                  <td className="px-4 py-3">
                    <Link href={`/reportes/${r.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
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

