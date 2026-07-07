import Link from 'next/link'
import { Building2 } from 'lucide-react'
import { ESTADO_OBRA_LABEL, ESTADO_OBRA_COLOR } from '@/lib/utils/constants'

function barColorClass(pct: number): string {
  if (pct >= 80) return 'bg-green-500'
  if (pct >= 30) return 'bg-amber-500'
  return 'bg-slate-400'
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obras: any[]
  avancePorObra: Map<number, number>
}

export default function ObrasAsignadasArquitecto({ obras, avancePorObra }: Props) {
  const cardStyle = {
    background: 'var(--card-bg)',
    boxShadow: 'var(--card-shadow)',
    border: '1px solid var(--card-border)',
  }
  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }

  if (obras.length === 0) {
    return (
      <div className="rounded-2xl p-10 text-center" style={cardStyle}>
        <Building2 size={32} className="mx-auto mb-3 opacity-25" style={ts} />
        <p className="text-sm mb-1" style={ts}>No tienes obras asignadas aún</p>
        <p className="text-xs" style={ts}>Contacta al administrador para recibir una asignación</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {obras.map((obra: any) => {
        const avancePct = avancePorObra.get(obra.id) ?? 0
        const estadoLabel = ESTADO_OBRA_LABEL[obra.estado] ?? obra.estado ?? '—'
        const estadoColor = ESTADO_OBRA_COLOR[obra.estado] ?? 'bg-gray-100 text-gray-700'

        return (
          <Link
            key={obra.id}
            href={`/obras/${obra.id}`}
            className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow block"
            style={cardStyle}
          >
            {/* Banner de color sólido con ícono — sin imagen real */}
            <div className="relative h-20 bg-action flex items-center justify-center">
              <Building2 size={40} className="text-white/20" />
              <span
                className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${estadoColor}`}
              >
                {estadoLabel}
              </span>
            </div>

            {/* Cuerpo */}
            <div className="p-4">
              <p className="text-sm font-semibold mb-1 truncate" style={tp}>{obra.nombre}</p>
              <p className="text-xs mb-3 truncate" style={ts}>
                {obra.distrito ?? 'Sin ubicación registrada'}
              </p>

              {/* Barra de progreso */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-black/10 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColorClass(avancePct)}`}
                    style={{ width: `${avancePct}%` }}
                  />
                </div>
                <span className="text-xs font-semibold shrink-0 w-9 text-right" style={ts}>
                  {avancePct}%
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
