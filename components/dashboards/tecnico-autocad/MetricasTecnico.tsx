import { FolderOpen, CalendarCheck, Clock } from 'lucide-react'
import { formatFecha } from '@/lib/utils/formatters'

interface Props {
  totalDocs: number
  ultimaActualizacion: string | null
  docsEnRevision: number
}

export default function MetricasTecnico({ totalDocs, ultimaActualizacion, docsEnRevision }: Props) {
  const cardStyle = {
    background: 'var(--card-bg)',
    boxShadow: 'var(--card-shadow)',
    border: '1px solid var(--card-border)',
  }
  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

      {/* Total documentos */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={ts}>
            Total documentos
          </p>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <FolderOpen size={20} className="text-amber-500" />
          </div>
        </div>
        <p className="text-4xl font-bold mb-1 text-accent">{totalDocs}</p>
        <p className="text-xs" style={ts}>en tus obras</p>
      </div>

      {/* Última actualización */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={ts}>
            Última actualización
          </p>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <CalendarCheck size={20} className="text-blue-500" />
          </div>
        </div>
        <p className="text-2xl font-bold mb-1 leading-tight" style={tp}>
          {ultimaActualizacion ? formatFecha(ultimaActualizacion) : '—'}
        </p>
        <p className="text-xs" style={ts}>del documento más reciente</p>
      </div>

      {/* En revisión */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={ts}>
            En revisión
          </p>
          <div className="w-11 h-11 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
            <Clock size={20} className="text-yellow-500" />
          </div>
        </div>
        <p
          className={`text-4xl font-bold mb-1 ${docsEnRevision > 0 ? 'text-yellow-500' : ''}`}
          style={docsEnRevision === 0 ? tp : undefined}
        >
          {docsEnRevision}
        </p>
        <p className="text-xs" style={ts}>pendientes de aprobación</p>
      </div>

    </div>
  )
}
