import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatFecha } from '@/lib/utils/formatters'
import {
  ESTADO_SOLICITUD_COLOR,
  ESTADO_SOLICITUD_LABEL,
  PRIORIDAD_COLOR,
} from '@/lib/types/solicitudes'
import { TIPO_SERVICIO_LABEL } from '@/lib/utils/constants'

export default async function SolicitudesPage() {
  const supabase = await createClient()
  const { data: solicitudes } = await supabase
    .from('solicitudes')
    .select(`*, clientes (nombres, apellidos, razon_social)`)
    .order('created_at', { ascending: false })

  const lista = solicitudes ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Solicitudes</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {lista.length} solicitud{lista.length !== 1 ? 'es' : ''} registrada
            {lista.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/solicitudes/nueva"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Nueva solicitud
        </Link>
      </div>

      {lista.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">No hay solicitudes registradas aún</p>
          <Link
            href="/solicitudes/nueva"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Registrar primera solicitud
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Solicitud</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Cliente</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Servicio</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Estado</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Prioridad</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Fecha</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lista.map((s: any) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{s.titulo}</div>
                    {s.distrito && (
                      <div className="text-xs text-gray-400 mt-0.5">{s.distrito}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {s.clientes?.razon_social ?? `${s.clientes?.nombres ?? ''} ${s.clientes?.apellidos ?? ''}`}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {TIPO_SERVICIO_LABEL[s.tipo_servicio] ?? s.tipo_servicio}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_SOLICITUD_COLOR[s.estado]}`}
                    >
                      {ESTADO_SOLICITUD_LABEL[s.estado]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORIDAD_COLOR[s.prioridad]}`}
                    >
                      {s.prioridad.charAt(0).toUpperCase() + s.prioridad.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatFecha(s.created_at)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/solicitudes/${s.id}`}
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

