'use client'

import { Fragment, useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatFecha } from '@/lib/utils/formatters'
import { TIPO_DOCUMENTO_LABEL, ESTADO_DOCUMENTO_COLOR, ESTADO_DOCUMENTO_LABEL } from '@/lib/types/documentos'
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Layers,
  Filter,
  Rows3,
} from 'lucide-react'
import HistorialVersionesFila from './HistorialVersionesFila'

const PAGE_SIZE = 10

/** Clases de color para el cuadrado del ícono según tipo de documento */
function estiloIcono(tipo: string): { bg: string; icon: string } {
  return tipo?.startsWith('plano_')
    ? { bg: 'bg-action/10', icon: 'text-action' }
    : { bg: 'bg-amber-500/10', icon: 'text-amber-500' }
}

/** Ícono según tipo de documento */
function IconoTipo({ tipo, size = 15 }: { tipo: string; size?: number }) {
  if (tipo?.startsWith('plano_')) return <Layers size={size} />
  return <FileText size={size} />
}

/** Toggle switch accesible */
function ToggleSwitch({
  activo,
  onChange,
  label,
}: {
  activo: boolean
  onChange: () => void
  label: string
}) {
  const ts = { color: 'var(--text-secondary)' }
  return (
    <label className="flex items-center gap-1.5 cursor-pointer select-none" title={label}>
      <span className="text-xs hidden sm:inline" style={ts}>
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={activo}
        aria-label={label}
        onClick={onChange}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-action ${
          activo ? 'bg-action' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
            activo ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  )
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  documentosIniciales: any[]
  totalDocs: number
  obraIds: number[]
}

export default function TablaPlanosTecnico({ documentosIniciales, totalDocs, obraIds }: Props) {
  const supabase = createClient()
  const totalPaginas = Math.max(1, Math.ceil(totalDocs / PAGE_SIZE))

  const [pagina, setPagina] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [paginasCache, setPaginasCache] = useState<Record<number, any[]>>({ 0: documentosIniciales })
  const [expandido, setExpandido] = useState<number | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [versionesCache, setVersionesCache] = useState<Record<number, any[]>>({})
  const [loadingDocId, setLoadingDocId] = useState<number | null>(null)
  const [cargandoPagina, setCargandoPagina] = useState(false)

  // ── Controles de tabla ────────────────────────────────────────────────────
  const [filtroAbierto, setFiltroAbierto] = useState(false)
  const [compacto, setCompacto] = useState(false)
  const filtroRef = useRef<HTMLDivElement>(null)

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    if (!filtroAbierto) return
    function handleClickOutside(e: MouseEvent) {
      if (filtroRef.current && !filtroRef.current.contains(e.target as Node)) {
        setFiltroAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [filtroAbierto])

  const documentosActuales = paginasCache[pagina] ?? []

  async function irAPagina(p: number) {
    if (p < 0 || p >= totalPaginas || cargandoPagina) return
    if (paginasCache[p]) { setPagina(p); setExpandido(null); return }

    setCargandoPagina(true)
    if (obraIds.length > 0) {
      const { data } = await supabase
        .from('documentos')
        .select('id, titulo, tipo, estado, version_actual, obra_id, created_at, obras(nombre)')
        .in('obra_id', obraIds)
        .order('created_at', { ascending: false })
        .range(p * PAGE_SIZE, (p + 1) * PAGE_SIZE - 1)
      setPaginasCache(prev => ({ ...prev, [p]: data ?? [] }))
    }
    setPagina(p)
    setExpandido(null)
    setCargandoPagina(false)
  }

  async function toggleExpand(docId: number) {
    if (expandido === docId) { setExpandido(null); return }
    setExpandido(docId)
    if (versionesCache[docId]) return

    setLoadingDocId(docId)
    const { data: versiones } = await supabase
      .from('versiones_documento')
      .select('id, version, archivo_url, nombre_archivo, tipo_archivo, tamanio_bytes, notas_version, subido_por, created_at')
      .eq('documento_id', docId)
      .order('version', { ascending: false })

    const ids = [...new Set((versiones ?? []).map((v: { subido_por: string }) => v.subido_por).filter(Boolean))]
    const { data: profiles } = ids.length > 0
      ? await supabase.from('profiles').select('id, nombre, apellidos').in('id', ids)
      : { data: [] }

    const profileMap = new Map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (profiles ?? []).map((p: any) => [
        p.id,
        [p.nombre, p.apellidos].filter(Boolean).join(' ') || 'Usuario',
      ])
    )

    setVersionesCache(prev => ({
      ...prev,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [docId]: (versiones ?? []).map((v: any) => ({
        ...v,
        nombreSubidor: profileMap.get(v.subido_por) ?? 'Usuario',
      })),
    }))
    setLoadingDocId(null)
  }

  const cardStyle = {
    background: 'var(--card-bg)',
    boxShadow: 'var(--card-shadow)',
    border: '1px solid var(--card-border)',
  }
  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }
  const divider = '1px solid var(--card-border)'

  // Padding de fila: compacto reduce el espacio vertical
  const rp = compacto ? 'py-2' : 'py-3.5'

  /* ── Estado vacío ─────────────────────────────────────────────────────────── */
  if (totalDocs === 0) {
    return (
      <div className="rounded-2xl py-16 px-8 text-center" style={cardStyle}>
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
          <FileText size={28} className="text-amber-400 opacity-60" />
        </div>
        <p className="text-sm font-medium mb-1" style={tp}>No hay documentos en tus obras aún</p>
        <p className="text-xs" style={ts}>Usa &ldquo;Subir plano nuevo&rdquo; para agregar el primero</p>
      </div>
    )
  }

  const inicio = pagina * PAGE_SIZE + 1
  const fin = Math.min((pagina + 1) * PAGE_SIZE, totalDocs)

  return (
    <div className="rounded-2xl overflow-hidden" style={cardStyle}>

      {/* ── Header de la tabla ───────────────────────────────────────────────── */}
      <div
        className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{ borderBottom: divider }}
      >
        {/* Título + contador */}
        <div className="min-w-0">
          <h2 className="text-sm font-semibold" style={tp}>Mis planos</h2>
          <p className="text-xs mt-0.5" style={ts}>
            Mostrando {inicio}–{fin} de {totalDocs} documentos
          </p>
        </div>

        {/* Controles: toggle compacto + filtrar + ver todos */}
        <div className="flex items-center gap-2 flex-wrap">

          {/* Toggle Vista compacta */}
          <ToggleSwitch
            activo={compacto}
            onChange={() => setCompacto(c => !c)}
            label="Vista compacta"
          />

          {/* Separador visual (solo desktop) */}
          <span
            className="hidden sm:inline-block w-px h-4 opacity-30"
            style={{ background: 'var(--text-secondary)' }}
          />

          {/* Botón Filtrar + dropdown */}
          <div ref={filtroRef} className="relative">
            <button
              type="button"
              onClick={() => setFiltroAbierto(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filtroAbierto
                  ? 'bg-action/10 text-action'
                  : 'hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              style={filtroAbierto ? undefined : { border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
            >
              <Filter size={12} />
              Filtrar
              <ChevronDown
                size={11}
                className={`transition-transform ${filtroAbierto ? 'rotate-180' : ''}`}
              />
            </button>

            {filtroAbierto && (
              <div
                className="absolute right-0 top-full mt-1.5 w-52 rounded-xl shadow-lg z-30 overflow-hidden bg-white dark:bg-gray-900"
                style={{ border: '1px solid var(--card-border)' }}
              >
                {/* Sección: Tipo de documento */}
                <div className="px-3 pt-2.5 pb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={ts}>
                    Tipo de documento
                  </p>
                </div>
                {[
                  { value: 'todos', label: 'Todos los tipos' },
                  { value: 'plano_arquitectonico', label: 'Planos arquitectónicos' },
                  { value: 'plano_estructural', label: 'Planos estructurales' },
                  { value: 'presupuesto', label: 'Presupuestos' },
                  { value: 'memoria_descriptiva', label: 'Memorias descriptivas' },
                ].map(op => (
                  <button
                    key={op.value}
                    type="button"
                    className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    style={tp}
                    onClick={() => {
                      // TODO: implementar lógica de filtrado real por tipo
                      setFiltroAbierto(false)
                    }}
                  >
                    {op.label}
                  </button>
                ))}

                {/* Sección: Estado */}
                <div className="px-3 pt-2.5 pb-1" style={{ borderTop: '1px solid var(--card-border)' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={ts}>
                    Estado
                  </p>
                </div>
                {[
                  { value: 'todos', label: 'Todos los estados' },
                  { value: 'borrador', label: 'Borrador' },
                  { value: 'en_revision', label: 'En revisión' },
                  { value: 'aprobado', label: 'Aprobado' },
                ].map(op => (
                  <button
                    key={op.value}
                    type="button"
                    className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    style={tp}
                    onClick={() => {
                      // TODO: implementar lógica de filtrado real por estado
                      setFiltroAbierto(false)
                    }}
                  >
                    {op.label}
                  </button>
                ))}

                {/* Limpiar filtros */}
                <div style={{ borderTop: '1px solid var(--card-border)' }}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2.5 text-xs font-medium text-amber-500 hover:text-amber-400 transition-colors"
                    onClick={() => {
                      // TODO: limpiar filtros activos
                      setFiltroAbierto(false)
                    }}
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Separador visual (solo desktop) */}
          <span
            className="hidden sm:inline-block w-px h-4 opacity-30"
            style={{ background: 'var(--text-secondary)' }}
          />

          {/* Ver todos */}
          <Link href="/documentos" className="text-xs text-amber-500 hover:text-amber-400 whitespace-nowrap">
            Ver todos →
          </Link>
        </div>
      </div>

      {/* ── Tabla ────────────────────────────────────────────────────────────── */}
      <div className={`overflow-x-auto transition-opacity ${cargandoPagina ? 'opacity-40 pointer-events-none' : ''}`}>
        <table className="w-full text-sm min-w-[640px]">
          <thead style={{ background: 'var(--table-header-bg)' }}>
            <tr style={{ borderBottom: divider }}>
              <th className="w-8 px-3 py-3" />
              <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={ts}>
                Nombre
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={ts}>
                Obra
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={ts}>
                Estado
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={ts}>
                Versión
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={ts}>
                Fecha
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={ts}>
                Ver
              </th>
            </tr>
          </thead>
          <tbody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {documentosActuales.map((doc: any) => {
              const estaExpandido = expandido === doc.id
              const isLoadingThis = loadingDocId === doc.id
              const versiones = versionesCache[doc.id] ?? []
              const estadoColor = ESTADO_DOCUMENTO_COLOR[doc.estado] ?? 'bg-gray-100 text-gray-700'
              const estadoLabel = ESTADO_DOCUMENTO_LABEL[doc.estado] ?? doc.estado ?? '—'
              const { bg: iconBg, icon: iconColor } = estiloIcono(doc.tipo)
              const versionActual = doc.version_actual ?? 1

              return (
                <Fragment key={doc.id}>
                  <tr
                    className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer select-none"
                    style={{ borderBottom: estaExpandido ? 'none' : divider }}
                    onClick={() => toggleExpand(doc.id)}
                  >
                    {/* Toggle chevron */}
                    <td className={`px-3 ${rp}`}>
                      <span style={ts}>
                        {estaExpandido ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </span>
                    </td>

                    {/* Nombre: ícono en cuadrado + título bold + subtipo */}
                    <td className={`px-4 ${rp}`}>
                      <div className="flex items-center gap-2.5">
                        {!compacto && (
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
                            <span className={iconColor}>
                              <IconoTipo tipo={doc.tipo} size={15} />
                            </span>
                          </div>
                        )}
                        {compacto && (
                          <span className={`shrink-0 ${iconColor}`}>
                            <IconoTipo tipo={doc.tipo} size={13} />
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className={`font-semibold truncate max-w-[200px] ${compacto ? 'text-xs' : 'text-sm'}`} style={tp}>
                            {doc.titulo}
                          </p>
                          {!compacto && (
                            <p className="text-[11px] mt-0.5 truncate max-w-[200px]" style={ts}>
                              {TIPO_DOCUMENTO_LABEL[doc.tipo] ?? doc.tipo ?? '—'}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Obra */}
                    <td className={`px-4 ${rp} max-w-[140px]`} style={ts}>
                      <span className={`truncate block ${compacto ? 'text-xs' : 'text-xs'}`}>
                        {doc.obras?.nombre ?? '—'}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className={`px-4 ${rp}`}>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estadoColor}`}>
                        {estadoLabel}
                      </span>
                    </td>

                    {/* Versión: dos badges lado a lado */}
                    <td className={`px-4 ${rp}`}>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-action/10 text-action">
                          v{versionActual}
                        </span>
                        {versionActual > 1 && (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{ background: 'var(--table-header-bg)', color: 'var(--text-secondary)' }}
                          >
                            {versionActual} versiones
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Fecha */}
                    <td className={`px-4 ${rp} text-xs whitespace-nowrap`} style={ts}>
                      {formatFecha(doc.created_at)}
                    </td>

                    {/* Enlace al detalle */}
                    <td className={`px-4 ${rp}`} onClick={e => e.stopPropagation()}>
                      <Link
                        href={`/documentos/${doc.id}`}
                        className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1 whitespace-nowrap"
                      >
                        <ExternalLink size={12} />
                        Abrir
                      </Link>
                    </td>
                  </tr>

                  {/* Fila expandida: historial de versiones */}
                  {estaExpandido && (
                    <tr style={{ borderBottom: divider }}>
                      <td colSpan={7} className="px-6 pb-5 pt-3">
                        <HistorialVersionesFila
                          versiones={versiones}
                          isLoading={isLoadingThis}
                          versionActual={versionActual}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── Paginación ───────────────────────────────────────────────────────── */}
      {totalPaginas > 1 && (
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: divider }}>
          <button
            onClick={() => irAPagina(pagina - 1)}
            disabled={pagina === 0 || cargandoPagina}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5"
            style={{ border: divider, color: 'var(--text-primary)' }}
          >
            ← Anterior
          </button>
          <span className="text-xs" style={ts}>
            Página {pagina + 1} de {totalPaginas}
          </span>
          <button
            onClick={() => irAPagina(pagina + 1)}
            disabled={pagina >= totalPaginas - 1 || cargandoPagina}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5"
            style={{ border: divider, color: 'var(--text-primary)' }}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
