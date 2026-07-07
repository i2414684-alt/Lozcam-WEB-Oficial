'use client'

import { useRef } from 'react'
import { Camera } from 'lucide-react'
import BotonEditarPerfil from './BotonEditarPerfil'

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

function calcularAntigüedad(fechaIngreso: string | null): string {
  if (!fechaIngreso) return '—'
  const inicio = new Date(fechaIngreso + 'T00:00:00')
  const hoy = new Date()
  const meses =
    (hoy.getFullYear() - inicio.getFullYear()) * 12 +
    (hoy.getMonth() - inicio.getMonth())
  if (meses < 1) return 'Reciente'
  if (meses < 12) return `${meses} mes${meses !== 1 ? 'es' : ''}`
  const años = Math.floor(meses / 12)
  return `${años} año${años !== 1 ? 's' : ''}`
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  perfil: any
  avatarUrl: string | null
  modoEdicion: boolean
  onActivarEdicion: () => void
  onFotoChange: (file: File) => void
  loadingFoto: boolean
}

export default function TarjetaHeroPerfil({
  perfil,
  avatarUrl,
  modoEdicion,
  onActivarEdicion,
  onFotoChange,
  loadingFoto,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const iniciales =
    `${perfil.nombre?.[0] ?? ''}${perfil.apellidos?.[0] ?? ''}`.toUpperCase() || 'U'
  const rolLabel = ROL_LABEL[perfil.rol] ?? perfil.rol ?? '—'
  const antigüedad = calcularAntigüedad(perfil.fecha_ingreso)
  const cantEspecialidades = (perfil.especialidades ?? []).length

  const cardStyle = { background: 'var(--card-bg)', border: '1px solid var(--card-border)' }
  const metricStyle = {
    background: 'var(--table-header-bg)',
    border: '1px solid var(--card-border)',
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onFotoChange(file)
    // Resetea el input para que seleccionar el mismo archivo dispare onChange de nuevo
    e.target.value = ''
  }

  return (
    <div className="rounded-xl p-6" style={cardStyle}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">

        {/* Avatar con botón de cámara superpuesto */}
        <div className="relative group shrink-0 self-start sm:self-auto">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={`${perfil.nombre} ${perfil.apellidos}`}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center text-3xl font-bold text-white bg-action">
              {iniciales}
            </div>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loadingFoto}
            title="Cambiar foto de perfil"
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-action text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:opacity-40"
          >
            {loadingFoto ? (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera size={14} />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* Nombre + badge + rol */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {perfil.nombre} {perfil.apellidos}
            </h2>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-medium"
              style={
                perfil.activo
                  ? { background: 'rgba(34,197,94,0.12)', color: '#16a34a' }
                  : {
                      background: 'var(--table-header-bg)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--card-border)',
                    }
              }
            >
              {perfil.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{rolLabel}</p>
        </div>

        {/* Métricas + botón editar */}
        <div className="flex flex-col gap-3 shrink-0">
          <div className="flex gap-3">
            <div
              className="flex-1 text-center px-4 py-3 rounded-xl min-w-[5rem]"
              style={metricStyle}
            >
              <p className="text-base font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                {antigüedad}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Antigüedad
              </p>
            </div>
            <div
              className="flex-1 text-center px-4 py-3 rounded-xl min-w-[5rem]"
              style={metricStyle}
            >
              <p className="text-base font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                {cantEspecialidades}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Especialidades
              </p>
            </div>
          </div>
          {!modoEdicion && <BotonEditarPerfil onClick={onActivarEdicion} />}
        </div>

      </div>
    </div>
  )
}
