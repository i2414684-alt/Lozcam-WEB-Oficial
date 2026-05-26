import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatFecha } from '@/lib/utils/formatters'
import {
  TIPO_DOCUMENTO_LABEL,
  ESTADO_DOCUMENTO_COLOR,
  ESTADO_DOCUMENTO_LABEL,
} from '@/lib/types/documentos'

export default async function DocumentosPage() {
  const supabase = await createClient()
  const { data: documentos } = await supabase
    .from('documentos')
    .select('*, obras (nombre)')
    .order('created_at', { ascending: false })

  const lista = documentos ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentos Técnicos</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {lista.length} documento{lista.length !== 1 ? 's' : ''} registrado{lista.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/documentos/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Subir documento
        </Link>
      </div>

      {lista.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">No hay documentos registrados aún</p>
          <Link
            href="/documentos/nuevo"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Subir primer documento
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Documento</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Tipo</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Obra</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Estado</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Versión</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Subido</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lista.map((doc: any) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{doc.titulo}</div>
                    {doc.numero_plano && (
                      <div className="text-xs text-gray-400 mt-0.5 font-mono">{doc.numero_plano}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {TIPO_DOCUMENTO_LABEL[doc.tipo] ?? doc.tipo}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {doc.obras?.nombre ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_DOCUMENTO_COLOR[doc.estado]}`}
                    >
                      {ESTADO_DOCUMENTO_LABEL[doc.estado]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-center">v{doc.version_actual}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatFecha(doc.created_at)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/documentos/${doc.id}`}
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

