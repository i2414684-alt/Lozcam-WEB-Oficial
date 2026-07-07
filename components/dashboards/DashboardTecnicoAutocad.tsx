import { createClient } from '@/lib/supabase/server'
import MetricasTecnico from './tecnico-autocad/MetricasTecnico'
import TablaPlanosTecnico from './tecnico-autocad/TablaPlanosTecnico'
import SubirPlanoModal from './tecnico-autocad/SubirPlanoModal'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  perfil: any
}

export default async function DashboardTecnicoAutocad({ perfil }: Props) {
  const supabase = await createClient()

  // ── 1. Obras asignadas ───────────────────────────────────────────────────
  const { data: asignacionesData, error: asignacionesError } = await supabase
    .from('asignaciones')
    .select('obra_id, obras(id, nombre, activo)')
    .eq('perfil_id', perfil.id)
    .eq('activo', true)

  if (asignacionesError) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-sm text-red-500">Error al cargar tus obras. Intenta de nuevo.</p>
      </div>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obrasList = (asignacionesData ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((a: any) => a.obras)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((o: any) => o && o.id && o.activo !== false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obraIds = obrasList.map((o: any) => o.id as number)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obrasParaModal = obrasList.map((o: any) => ({ id: o.id as number, nombre: o.nombre as string }))

  // ── 2. Queries en paralelo ───────────────────────────────────────────────
  const emptyCount = Promise.resolve({ count: 0, data: null, error: null })

  const [enRevisionRes, lastUpdateRes, docsRes] = await Promise.all([
    obraIds.length > 0
      ? supabase
          .from('documentos')
          .select('*', { count: 'exact', head: true })
          .in('obra_id', obraIds)
          .eq('estado', 'en_revision')
      : emptyCount,

    obraIds.length > 0
      ? supabase
          .from('documentos')
          .select('updated_at')
          .in('obra_id', obraIds)
          .order('updated_at', { ascending: false })
          .limit(1)
      : Promise.resolve({ data: null, error: null }),

    obraIds.length > 0
      ? supabase
          .from('documentos')
          .select('id, titulo, tipo, estado, version_actual, obra_id, created_at, obras(nombre)', { count: 'exact' })
          .in('obra_id', obraIds)
          .order('created_at', { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] as unknown[], count: 0, error: null }),
  ])

  const docsEnRevision     = enRevisionRes.count ?? 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ultimaActualizacion = (lastUpdateRes.data as any)?.[0]?.updated_at ?? null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const documentosPagina   = (docsRes.data as any[]) ?? []
  const totalDocs          = (docsRes as { count: number | null }).count ?? 0

  // ── 3. Saludo y breadcrumb ────────────────────────────────────────────────
  const nombreDisplay   = perfil.nombre?.trim() || ''
  const saludo          = nombreDisplay ? `Hola, ${nombreDisplay}` : 'Hola'

  // Breadcrumb: si hay una sola obra muestra su nombre real; si hay varias, "Mis obras"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nombreObraUnica = obrasList.length === 1 ? (obrasList[0] as any).nombre as string : null
  const breadcrumbObra  = nombreObraUnica ?? (obrasList.length > 1 ? 'Mis obras' : null)

  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="min-w-0">

          {/* Breadcrumb */}
          <nav aria-label="Ubicación" className="flex items-center gap-1 text-xs mb-2 flex-wrap">
            <span style={ts}>Dashboard</span>
            <span style={ts} className="opacity-40">/</span>
            {breadcrumbObra && (
              <>
                <span className="truncate max-w-[120px] sm:max-w-[200px]" style={ts}>
                  {breadcrumbObra}
                </span>
                <span style={ts} className="opacity-40">/</span>
              </>
            )}
            <span className="font-semibold" style={tp}>Planos</span>
          </nav>

          {/* Saludo + subtítulo + descripción */}
          <h1 className="text-2xl font-bold mb-0.5" style={tp}>{saludo}</h1>
          <p className="text-sm font-semibold mb-1 text-action">
            Gestión de documentos técnicos
          </p>
          <p className="text-xs leading-relaxed max-w-lg" style={ts}>
            Administra tus planos, revisa el historial de versiones y mantén
            sincronizados los archivos de tus obras asignadas.
          </p>
        </div>

        {obrasParaModal.length > 0 && (
          <div className="shrink-0 mt-1">
            <SubirPlanoModal
              obras={obrasParaModal}
              obraIdPorDefecto={obrasParaModal[0]?.id}
            />
          </div>
        )}
      </div>

      {/* Métricas */}
      <div className="mb-6">
        <MetricasTecnico
          totalDocs={totalDocs}
          ultimaActualizacion={ultimaActualizacion}
          docsEnRevision={docsEnRevision}
        />
      </div>

      {/* Tabla de planos con versiones expandibles */}
      <TablaPlanosTecnico
        key={`${totalDocs}-${documentosPagina[0]?.id ?? 0}`}
        documentosIniciales={documentosPagina}
        totalDocs={totalDocs}
        obraIds={obraIds}
      />
    </div>
  )
}
