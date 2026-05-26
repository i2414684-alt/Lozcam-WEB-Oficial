import { getClientes } from '@/lib/supabase/queries/clientes'
import Link from 'next/link'
import { formatFecha } from '@/lib/utils/formatters'

export default async function ClientesPage() {
  const clientes = await getClientes()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {clientes.length} cliente{clientes.length !== 1 ? 's' : ''} registrado
            {clientes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/clientes/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Nuevo cliente
        </Link>
      </div>

      {clientes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">No hay clientes registrados aún</p>
          <Link
            href="/clientes/nuevo"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Registrar primer cliente
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Cliente</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">DNI / RUC</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Contacto</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Distrito</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Registrado</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {cliente.tipo_persona === 'natural'
                        ? `${cliente.nombres} ${cliente.apellidos}`
                        : cliente.razon_social}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {cliente.tipo_persona === 'natural'
                        ? 'Persona natural'
                        : 'Persona jurídica'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {cliente.tipo_persona === 'natural' ? cliente.dni : cliente.ruc}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-600">{cliente.email ?? '—'}</div>
                    <div className="text-xs text-gray-400">{cliente.telefono ?? '—'}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{cliente.distrito ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{formatFecha(cliente.created_at)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/clientes/${cliente.id}`}
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

