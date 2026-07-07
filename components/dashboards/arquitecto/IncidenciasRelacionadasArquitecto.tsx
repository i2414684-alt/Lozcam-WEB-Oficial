import { AlertTriangle } from 'lucide-react'

function haceCuanto(createdAt: string): string {
  const diff = Date.now() - new Date(createdAt).getTime()
  const minutos = Math.floor(diff / 60000)
  if (minutos < 1) return 'hace un momento'
  if (minutos < 60) return `hace ${minutos} min`
  const horas = Math.floor(minutos / 60)
  if (horas < 24) return `hace ${horas} hora${horas !== 1 ? 's' : ''}`
  const dias = Math.floor(horas / 24)
  if (dias < 7) return `hace ${dias} día${dias !== 1 ? 's' : ''}`
  const semanas = Math.floor(dias / 7)
  if (semanas < 5) return `hace ${semanas} semana${semanas !== 1 ? 's' : ''}`
  const meses = Math.floor(dias / 30)
  return `hace ${meses} mes${meses !== 1 ? 'es' : ''}`
}

// Valores confirmados del enum en el formulario de incidencias:
// leve | moderada | grave | critica
const GRAVEDAD_STYLE: Record<string, { badge: string; dot: string }> = {
  leve:     { badge: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',         dot: 'bg-teal-400' },
  moderada: { badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', dot: 'bg-yellow-400' },
  grave:    { badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', dot: 'bg-orange-500' },
  critica:  { badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',             dot: 'bg-red-500' },
}
const GRAVEDAD_FALLBACK = { badge: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', dot: 'bg-gray-400' }

const GRAVEDAD_LABEL: Record<string, string> = {
  leve:     'Leve',
  moderada: 'Moderada',
  grave:    'Grave',
  critica:  'Crítica',
}

// Convierte el tipo DB en un título legible: "falta_material" → "Falta de material"
function tipoLabel(tipo: string | null | undefined): string {
  return (tipo ?? 'incidencia').replace(/_/g, ' ')
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  incidencias: any[]
  obraMap: Map<number, string>
}

export default function IncidenciasRelacionadasArquitecto({ incidencias, obraMap }: Props) {
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
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: divider }}>
        <AlertTriangle size={16} className="text-red-500" />
        <h2 className="text-sm font-semibold" style={tp}>Incidencias abiertas</h2>
        {incidencias.length > 0 && (
          <span className="ml-auto text-[11px] font-semibold bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full">
            {incidencias.length}
          </span>
        )}
      </div>

      {incidencias.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-green-500">Sin incidencias abiertas ✅</p>
        </div>
      ) : (
        <div>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {incidencias.slice(0, 8).map((inc: any) => {
            const g = GRAVEDAD_STYLE[inc.gravedad] ?? GRAVEDAD_FALLBACK
            const badgeLabel = GRAVEDAD_LABEL[inc.gravedad] ?? (
              inc.gravedad
                ? inc.gravedad.charAt(0).toUpperCase() + inc.gravedad.slice(1)
                : 'Leve'
            )
            const obraNombre = obraMap.get(inc.obra_id)

            return (
              <div key={inc.id} className="px-5 py-3.5" style={{ borderBottom: divider }}>

                {/* Fila 1: punto indicador + tipo (título) + badge gravedad */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-0.5 ${g.dot}`} />
                    <span className="text-xs font-semibold capitalize truncate" style={tp}>
                      {tipoLabel(inc.tipo)}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide shrink-0 ${g.badge}`}>
                    {badgeLabel}
                  </span>
                </div>

                {/* Fila 2: descripción (máximo 2 líneas con CSS) */}
                {inc.descripcion && (
                  <p
                    className="text-xs mb-2 leading-relaxed line-clamp-2"
                    style={ts}
                  >
                    {inc.descripcion}
                  </p>
                )}

                {/* Fila 3: obra + tiempo relativo */}
                <div className="flex items-center justify-between gap-2">
                  {obraNombre && (
                    <span className="text-[11px] truncate" style={ts}>{obraNombre}</span>
                  )}
                  <span className="text-[11px] shrink-0 ml-auto" style={ts}>
                    {haceCuanto(inc.created_at)}
                  </span>
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
