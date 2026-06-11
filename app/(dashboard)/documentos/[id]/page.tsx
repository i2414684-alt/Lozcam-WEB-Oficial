import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatFecha, formatFechaHora } from '@/lib/utils/formatters'
import {
  TIPO_DOCUMENTO_LABEL,
  ESTADO_DOCUMENTO_COLOR,
  ESTADO_DOCUMENTO_LABEL,
} from '@/lib/types/documentos'

export default async function DocumentoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idParam } = await params
  const id = Number(idParam)
  if (isNaN(id)) notFound()

  const supabase = await createClient()

  const { data: doc, error } = await supabase
    .from('documentos')
    .select('*, obras (nombre)')
    .eq('id', id)
    .single()

  if (error || !doc) notFound()

  const { data: versiones } = await supabase
    .from('versiones_documento')
    .select('*')
    .eq('documento_id', id)
    .order('version', { ascending: false })

  const cardStyle = { background: 'var(--card-bg)', border: '1px solid var(--card-border)' }
  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }
  const dividerStyle = { borderColor: 'var(--card-border)' }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold" style={tp}>{doc.titulo}</h1>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${ESTADO_DOCUMENTO_COLOR[doc.estado]}`}>
              {ESTADO_DOCUMENTO_LABEL[doc.estado]}
            </span>
          </div>
          <p className="text-sm" style={ts}>
            {TIPO_DOCUMENTO_LABEL[doc.tipo]} · v{doc.version_actual}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/documentos/${id}/editar`}
            className="text-sm bg-amber-500 hover:bg-amber-400 text-gray-950 px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            Editar
          </Link>
          <Link href="/documentos" className="text-sm hover:opacity-70 transition-opacity" style={ts}>
            ← Volver
          </Link>
        </div>
      </div>

      <div className="rounded-xl p-6 mb-4" style={cardStyle}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs mb-1" style={ts}>Obra</p>
            <p className="text-sm font-medium" style={tp}>{doc.obras?.nombre ?? '—'}</p>
          </div>
          {doc.numero_plano && (
            <div>
              <p className="text-xs mb-1" style={ts}>Número de plano</p>
              <p className="text-sm font-medium font-mono" style={tp}>{doc.numero_plano}</p>
            </div>
          )}
          {doc.escala && (
            <div>
              <p className="text-xs mb-1" style={ts}>Escala</p>
              <p className="text-sm font-medium" style={tp}>{doc.escala}</p>
            </div>
          )}
          <div>
            <p className="text-xs mb-1" style={ts}>Fecha registro</p>
            <p className="text-sm font-medium" style={tp}>{formatFecha(doc.created_at)}</p>
          </div>
        </div>
        {doc.descripcion && (
          <div className="mt-4 pt-4 border-t" style={dividerStyle}>
            <p className="text-xs mb-1" style={ts}>Descripción</p>
            <p className="text-sm" style={ts}>{doc.descripcion}</p>
          </div>
        )}
      </div>

      <div className="rounded-xl p-5" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={tp}>Versiones ({versiones?.length ?? 0})</h2>
          <Link
            href={`/documentos/${id}/nueva-version`}
            className="text-sm text-amber-500 hover:text-amber-400 font-medium"
          >
            + Nueva versión
          </Link>
        </div>

        {!versiones || versiones.length === 0 ? (
          <p className="text-sm text-center py-4" style={ts}>No hay archivos subidos aún</p>
        ) : (
          <div className="space-y-2">
            {versiones.map((v: any) => (
              <div
                key={v.id}
                className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ border: '1px solid var(--card-border)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-xs font-bold">
                    v{v.version}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={tp}>{v.nombre_archivo}</p>
                    <p className="text-xs mt-0.5" style={ts}>
                      {v.tipo_archivo?.toUpperCase()}
                      {v.tamanio_bytes ? ` · ${(v.tamanio_bytes / 1024 / 1024).toFixed(2)} MB` : ''}
                      {` · ${formatFechaHora(v.created_at)}`}
                    </p>
                  </div>
                </div>
                <a
                  href={v.archivo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-amber-500 hover:text-amber-400 font-medium"
                >
                  Descargar
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
