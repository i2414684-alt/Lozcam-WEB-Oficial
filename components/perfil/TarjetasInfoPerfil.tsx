'use client'

import { User, Briefcase } from 'lucide-react'

const ROL_LABEL: Record<string, string> = {
  gerente_general: 'Gerente General',
  subgerente: 'Subgerente',
  administrador: 'Administrador',
  ingeniero_residente: 'Ing. Residente',
  arquitecto: 'Arquitecto',
  tecnico_autocad: 'Técnico AutoCAD',
  topografo: 'Topógrafo',
  maestro_obra: 'Maestro de Obra',
  personal_obra: 'Personal de Obra',
  contador: 'Contador',
  vendedor: 'Vendedor',
  cliente: 'Cliente',
}

const MESES = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
]

function formatFechaIngreso(fecha: string | null): string | null {
  if (!fecha) return null
  const partes = fecha.split('-')
  if (partes.length !== 3) return fecha
  const [year, month, day] = partes
  return `${parseInt(day)} ${MESES[parseInt(month) - 1]} ${year}`
}

const inputStyle = {
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  color: 'var(--text-primary)',
}

interface Valores {
  dni: string
  telefono: string
  telefono_alt: string
  email_personal: string
  especialidades: string
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  perfil: any
  modoEdicion: boolean
  valores: Valores
  onChange: (campo: string, valor: string) => void
}

export default function TarjetasInfoPerfil({ perfil, modoEdicion, valores, onChange }: Props) {
  const cardStyle = { background: 'var(--card-bg)', border: '1px solid var(--card-border)' }
  const dividerStyle = { borderBottom: '1px solid var(--card-border)' }
  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }

  const especialidades: string[] = perfil.especialidades ?? []
  const rolLabel = ROL_LABEL[perfil.rol] ?? perfil.rol ?? '—'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Información personal */}
      <div className="rounded-xl" style={cardStyle}>
        <div className="flex items-center gap-2 px-6 py-4" style={dividerStyle}>
          <User size={15} style={ts} />
          <h3 className="text-sm font-semibold" style={tp}>Información personal</h3>
        </div>
        <div className="px-6 py-5">
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4">
            <CampoEditable
              label="DNI"
              campo="dni"
              valor={modoEdicion ? valores.dni : (perfil.dni ?? null)}
              modoEdicion={modoEdicion}
              onChange={onChange}
              ts={ts}
              tp={tp}
            />
            <CampoEditable
              label="Correo personal"
              campo="email_personal"
              valor={modoEdicion ? valores.email_personal : (perfil.email_personal ?? null)}
              modoEdicion={modoEdicion}
              onChange={onChange}
              ts={ts}
              tp={tp}
            />
            <CampoEditable
              label="Teléfono"
              campo="telefono"
              valor={modoEdicion ? valores.telefono : (perfil.telefono ?? null)}
              modoEdicion={modoEdicion}
              onChange={onChange}
              ts={ts}
              tp={tp}
            />
            <CampoEditable
              label="Tel. alternativo"
              campo="telefono_alt"
              valor={modoEdicion ? valores.telefono_alt : (perfil.telefono_alt ?? null)}
              modoEdicion={modoEdicion}
              onChange={onChange}
              ts={ts}
              tp={tp}
            />
          </dl>
        </div>
      </div>

      {/* Información profesional */}
      <div className="rounded-xl" style={cardStyle}>
        <div className="flex items-center gap-2 px-6 py-4" style={dividerStyle}>
          <Briefcase size={15} style={ts} />
          <h3 className="text-sm font-semibold" style={tp}>Información profesional</h3>
        </div>
        <div className="px-6 py-5 space-y-4">

          {/* Rol y fecha: NUNCA editables */}
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4">
            <CampoSoloLectura label="Rol" valor={rolLabel} ts={ts} tp={tp} />
            <CampoSoloLectura
              label="Fecha de ingreso"
              valor={formatFechaIngreso(perfil.fecha_ingreso)}
              ts={ts}
              tp={tp}
            />
          </dl>

          {/* Especialidades */}
          <div>
            <p className="text-xs mb-2" style={ts}>Especialidades</p>
            {modoEdicion ? (
              <div>
                <input
                  type="text"
                  value={valores.especialidades}
                  onChange={e => onChange('especialidades', e.target.value)}
                  placeholder="Ej: Topografía, Costos y presupuestos"
                  className="w-full px-3 py-1.5 rounded-lg text-sm"
                  style={inputStyle}
                />
                <p className="text-[11px] mt-1" style={ts}>Separa cada especialidad con una coma.</p>
              </div>
            ) : especialidades.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {especialidades.map((esp: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: 'rgba(245,166,35,0.12)',
                      color: 'var(--accent)',
                      border: '1px solid rgba(245,166,35,0.25)',
                    }}
                  >
                    {esp}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={ts}>No registrado</p>
            )}
          </div>

        </div>
      </div>

    </div>
  )
}

/* Campo siempre de solo lectura (rol, fecha_ingreso) */
function CampoSoloLectura({
  label,
  valor,
  ts,
  tp,
}: {
  label: string
  valor: string | null
  ts: React.CSSProperties
  tp: React.CSSProperties
}) {
  return (
    <>
      <dt className="text-xs shrink-0 self-baseline pt-0.5" style={ts}>{label}</dt>
      <dd className="text-sm font-medium break-words" style={valor ? tp : ts}>
        {valor ?? 'No registrado'}
      </dd>
    </>
  )
}

/* Campo editable (dni, telefono, telefono_alt, email_personal) */
function CampoEditable({
  label,
  campo,
  valor,
  modoEdicion,
  onChange,
  ts,
  tp,
}: {
  label: string
  campo: string
  valor: string | null
  modoEdicion: boolean
  onChange: (campo: string, valor: string) => void
  ts: React.CSSProperties
  tp: React.CSSProperties
}) {
  if (modoEdicion) {
    return (
      <>
        <dt className="text-xs shrink-0 self-center" style={ts}>{label}</dt>
        <dd>
          <input
            type="text"
            value={valor ?? ''}
            onChange={e => onChange(campo, e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg text-sm"
            style={inputStyle}
          />
        </dd>
      </>
    )
  }
  return (
    <>
      <dt className="text-xs shrink-0 self-baseline pt-0.5" style={ts}>{label}</dt>
      <dd className="text-sm font-medium break-words" style={valor ? tp : ts}>
        {valor || 'No registrado'}
      </dd>
    </>
  )
}
