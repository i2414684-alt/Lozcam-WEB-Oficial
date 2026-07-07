import { Building2, FolderOpen, AlertTriangle } from 'lucide-react'

interface Props {
  totalObras: number
  totalDocumentos: number
  incidenciasAbiertas: number
}

export default function MetricasArquitecto({ totalObras, totalDocumentos, incidenciasAbiertas }: Props) {
  const cardStyle = {
    background: 'var(--card-bg)',
    boxShadow: 'var(--card-shadow)',
    border: '1px solid var(--card-border)',
  }
  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

      <div className="rounded-2xl p-5" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={ts}>
            Obras asignadas
          </p>
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Building2 size={18} className="text-blue-500" />
          </div>
        </div>
        <p className="text-3xl font-bold mb-1" style={tp}>{totalObras}</p>
        <p className="text-xs" style={ts}>a tu cargo</p>
      </div>

      <div className="rounded-2xl p-5" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={ts}>
            Documentos
          </p>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <FolderOpen size={18} className="text-amber-500" />
          </div>
        </div>
        <p className="text-3xl font-bold mb-1 text-accent">{totalDocumentos}</p>
        <p className="text-xs" style={ts}>en tus obras</p>
      </div>

      <div className="rounded-2xl p-5" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={ts}>
            Incidencias abiertas
          </p>
          <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
        </div>
        <p
          className={`text-3xl font-bold mb-1 ${incidenciasAbiertas > 0 ? 'text-red-500' : ''}`}
          style={incidenciasAbiertas === 0 ? tp : undefined}
        >
          {incidenciasAbiertas}
        </p>
        <p className="text-xs" style={ts}>sin resolver</p>
      </div>

    </div>
  )
}
