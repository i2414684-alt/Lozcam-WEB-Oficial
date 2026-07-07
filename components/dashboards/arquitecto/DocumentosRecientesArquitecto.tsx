'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { formatFecha } from '@/lib/utils/formatters'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  documentos: any[]
  totalDocumentos: number
}

export default function DocumentosRecientesArquitecto({ documentos, totalDocumentos }: Props) {
  const router = useRouter()

  const cardStyle = {
    background: 'var(--card-bg)',
    boxShadow: 'var(--card-shadow)',
    border: '1px solid var(--card-border)',
  }
  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }
  const divider = '1px solid var(--card-border)'

  return (
    <div className="rounded-2xl overflow-hidden" style={cardStyle}>
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: divider }}>
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-amber-500" />
          <h2 className="text-sm font-semibold" style={tp}>Documentos recientes</h2>
        </div>
        <div className="flex items-center gap-3">
          {totalDocumentos > documentos.length && (
            <span className="text-xs hidden sm:block" style={ts}>
              Mostrando {documentos.length} de {totalDocumentos}
            </span>
          )}
          <Link href="/documentos" className="text-xs text-amber-500 hover:text-amber-400">
            Ver todos →
          </Link>
        </div>
      </div>

      {documentos.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm" style={ts}>No hay documentos en tus obras aún</p>
        </div>
      ) : (
        <>
          {/* Indicador en móvil */}
          {totalDocumentos > documentos.length && (
            <p className="px-5 pt-3 text-xs sm:hidden" style={ts}>
              Mostrando {documentos.length} de {totalDocumentos}
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead style={{ background: 'var(--table-header-bg)' }}>
                <tr style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <th className="text-left px-5 py-2.5 text-xs font-semibold uppercase tracking-wide" style={ts}>
                    Nombre
                  </th>
                  <th className="text-left px-5 py-2.5 text-xs font-semibold uppercase tracking-wide" style={ts}>
                    Obra
                  </th>
                  <th className="text-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wide" style={ts}>
                    Versión
                  </th>
                  <th className="text-left px-5 py-2.5 text-xs font-semibold uppercase tracking-wide" style={ts}>
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {documentos.map((doc: any) => (
                  <tr
                    key={doc.id}
                    className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    style={{ borderBottom: divider }}
                    onClick={() => router.push(`/documentos/${doc.id}`)}
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium truncate max-w-[200px]" style={tp}>{doc.titulo}</p>
                      {doc.tipo && (
                        <p className="text-[11px] mt-0.5 capitalize" style={ts}>
                          {doc.tipo.replace(/_/g, ' ')}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs max-w-[160px]">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <span className="truncate block" style={ts}>
                        {(doc.obras as any)?.nombre ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-medium" style={ts}>
                      v{doc.version_actual ?? '1'}
                    </td>
                    <td className="px-5 py-3 text-xs whitespace-nowrap" style={ts}>
                      {formatFecha(doc.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
