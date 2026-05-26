import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const ROL_LABEL: Record<string, string> = {
  gerente_general:     'Gerente General',
  subgerente:          'Subgerente',
  administrador:       'Administrador',
  ingeniero_residente: 'Ing. Residente',
  arquitecto:          'Arquitecto',
  tecnico_autocad:     'Técnico AutoCAD',
  topografo:           'Topógrafo',
  maestro_obra:        'Maestro de Obra',
  personal_obra:       'Personal de Obra',
  contador:            'Contador',
  vendedor:            'Vendedor',
  cliente:             'Cliente',
}

const ROL_COLOR: Record<string, string> = {
  gerente_general:     'bg-purple-100 text-purple-700',
  subgerente:          'bg-purple-100 text-purple-700',
  administrador:       'bg-blue-100 text-blue-700',
  ingeniero_residente: 'bg-green-100 text-green-700',
  arquitecto:          'bg-teal-100 text-teal-700',
  tecnico_autocad:     'bg-cyan-100 text-cyan-700',
  topografo:           'bg-indigo-100 text-indigo-700',
  maestro_obra:        'bg-orange-100 text-orange-700',
  personal_obra:       'bg-gray-100 text-gray-700',
  contador:            'bg-yellow-100 text-yellow-700',
  vendedor:            'bg-pink-100 text-pink-700',
  cliente:             'bg-red-100 text-red-700',
}

export default async function PersonalPage() {
  const supabase = await createClient()
  const { data: personal } = await supabase
    .from('profiles')
    .select('*')
    .eq('activo', true)
    .order('nombre', { ascending: true })

  const lista = personal ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personal</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {lista.length} miembro{lista.length !== 1 ? 's' : ''} del equipo
          </p>
        </div>
        <Link
          href="/personal/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Nuevo usuario
        </Link>
      </div>

      {lista.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">No hay personal registrado aún</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Nombre</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Rol</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">DNI</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Teléfono</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Especialidades</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lista.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {p.nombre} {p.apellidos}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {p.email_personal ?? '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        ROL_COLOR[p.rol] ?? 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {ROL_LABEL[p.rol] ?? p.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.dni ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{p.telefono ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {p.especialidades?.join(', ') ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/personal/${p.id}`}
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

