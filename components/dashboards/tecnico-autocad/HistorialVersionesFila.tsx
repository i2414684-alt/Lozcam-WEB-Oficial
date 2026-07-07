import { Clock, FileText, Layers, File, Image as ImageIcon, Download } from 'lucide-react'
import { formatFecha } from '@/lib/utils/formatters'

function iconoArchivo(tipoArchivo: string | null) {
  const t = tipoArchivo?.toLowerCase() ?? ''
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(t)) return <ImageIcon size={15} />
  if (t === 'pdf') return <FileText size={15} />
  if (['dwg', 'rvt'].includes(t)) return <Layers size={15} />
  return <File size={15} />
}

function esImagen(tipoArchivo: string | null) {
  return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(tipoArchivo?.toLowerCase() ?? '')
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  versiones: any[]
  isLoading: boolean
  versionActual: number
}

export default function HistorialVersionesFila({ versiones, isLoading, versionActual: _versionActual }: Props) {
  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-5">
        <p className="text-xs" style={ts}>Cargando historial…</p>
      </div>
    )
  }

  if (versiones.length === 0) {
    return (
      <p className="text-xs py-2" style={ts}>Sin historial de versiones disponible</p>
    )
  }

  return (
    <div>
      {/* Título con ícono */}
      <div className="flex items-center gap-1.5 mb-3">
        <Clock size={13} style={ts} />
        <p className="text-[11px] font-semibold uppercase tracking-wider" style={ts}>
          Historial de versiones
        </p>
      </div>

      <div className="space-y-2">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {versiones.map((v: any, i: number) => {
          const esUltima = i === 0 // versiones ordenadas desc → index 0 = más reciente

          return (
            <div
              key={v.id}
              className="rounded-xl p-3"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            >
              {/* Fila superior: dot + badge versión + nombre + ext + fecha + descarga */}
              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                {/* Punto indicador */}
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    esUltima ? 'bg-action' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />

                {/* Badge versión */}
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    esUltima
                      ? 'bg-action/10 text-action'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  v{v.version}
                </span>

                {/* Nombre de archivo */}
                <span className="text-xs font-semibold truncate flex-1 min-w-0" style={tp}>
                  {v.nombre_archivo}
                </span>

                {/* Badge extensión */}
                {v.tipo_archivo && (
                  <span
                    className="text-[10px] uppercase px-1.5 py-0.5 rounded font-mono shrink-0"
                    style={{ background: 'var(--table-header-bg)', color: 'var(--text-secondary)' }}
                  >
                    {v.tipo_archivo}
                  </span>
                )}

                {/* Fecha alineada a la derecha */}
                <span className="text-[11px] ml-auto shrink-0" style={ts}>
                  {formatFecha(v.created_at)}
                </span>

                {/* Enlace de descarga */}
                <a
                  href={v.archivo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-amber-500 hover:text-amber-400 transition-colors"
                  onClick={e => e.stopPropagation()}
                  title="Descargar"
                >
                  <Download size={13} />
                </a>
              </div>

              {/* Cuerpo: miniatura + metadatos */}
              {/* En móvil: columna (texto arriba, miniatura abajo). En desktop: fila (miniatura izq, texto der). */}
              <div className="flex flex-col sm:flex-row items-start gap-3">
                {/* Texto va primero en DOM → aparece arriba en móvil */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[11px]" style={ts}>
                    Subido por{' '}
                    <span className="font-medium" style={tp}>{v.nombreSubidor}</span>
                    {v.tamanio_bytes
                      ? ` · ${(v.tamanio_bytes / 1024 / 1024).toFixed(2)} MB`
                      : ''}
                  </p>
                  {v.notas_version && (
                    <p className="text-xs mt-1 italic leading-relaxed" style={ts}>
                      {v.notas_version}
                    </p>
                  )}
                </div>

                {/* Miniatura o ícono — sm:order-first la mueve a la izquierda en desktop */}
                <div className="shrink-0 sm:order-first">
                  {esImagen(v.tipo_archivo) ? (
                    <img
                      src={v.archivo_url}
                      alt={v.nombre_archivo}
                      className="w-14 h-14 rounded-lg object-cover shadow-sm"
                      style={{ border: '1px solid var(--card-border)' }}
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'var(--table-header-bg)',
                        border: '1px solid var(--card-border)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {iconoArchivo(v.tipo_archivo)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
