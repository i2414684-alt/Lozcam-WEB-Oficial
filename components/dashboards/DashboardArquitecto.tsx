import { CalendarDays } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import MetricasArquitecto from './arquitecto/MetricasArquitecto'
import ObrasAsignadasArquitecto from './arquitecto/ObrasAsignadasArquitecto'
import DocumentosRecientesArquitecto from './arquitecto/DocumentosRecientesArquitecto'
import IncidenciasRelacionadasArquitecto from './arquitecto/IncidenciasRelacionadasArquitecto'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  perfil: any
}

export default async function DashboardArquitecto({ perfil }: Props) {
  const supabase = await createClient()

  // ── 1. Obras asignadas via tabla asignaciones ────────────────────────────
  const { data: asignacionesData, error: asignacionesError } = await supabase
    .from('asignaciones')
    .select('obra_id, obras(id, nombre, estado, distrito, activo)')
    .eq('perfil_id', perfil.id)
    .eq('activo', true)

  if (asignacionesError) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-sm text-red-500">Error al cargar tus obras. Intenta de nuevo.</p>
      </div>
    )
  }

  // Extrae las obras del join, filtra nulos y obras inactivas
  const obrasList = (asignacionesData ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((a: any) => a.obras)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((o: any) => o && o.id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((o: any) => o.activo !== false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obraIds = obrasList.map((o: any) => o.id as number)

  // ── 2. Queries paralelas ─────────────────────────────────────────────────
  const emptyRes = Promise.resolve({ data: [] as any[], error: null })

  const [fasesRes, avancesRes, incidenciasRes] = await Promise.all([
    obraIds.length > 0
      ? supabase
          .from('fases_obra')
          .select('id, obra_id, nombre, orden, estado')
          .in('obra_id', obraIds)
          .order('orden', { ascending: true })
      : emptyRes,

    obraIds.length > 0
      ? supabase
          .from('avance_obra')
          .select('fase_id, obra_id, porcentaje, created_at')
          .in('obra_id', obraIds)
          .order('created_at', { ascending: false })
      : emptyRes,

    obraIds.length > 0
      ? supabase
          .from('incidencias')
          .select('id, obra_id, tipo, descripcion, gravedad, created_at')
          .in('obra_id', obraIds)
          .eq('resuelto', false)
          .order('created_at', { ascending: false })
      : emptyRes,
  ])

  // Documentos con count exacto (query separada para evitar conflictos de tipo)
  const documentosRes = obraIds.length > 0
    ? await supabase
        .from('documentos')
        .select('id, titulo, tipo, version_actual, created_at, obra_id, obras(nombre)', { count: 'exact' })
        .in('obra_id', obraIds)
        .order('created_at', { ascending: false })
        .limit(10)
    : { data: [] as any[], count: 0 }

  const fases       = fasesRes.data       ?? []
  const avances     = avancesRes.data     ?? []
  const incidencias = incidenciasRes.data ?? []
  const documentos  = documentosRes.data  ?? []
  const totalDocumentos = (documentosRes as any).count ?? 0

  // ── 3. Calcular avance por obra (promedio de fases) ──────────────────────
  // avances está ordenado por created_at desc → primer registro por fase_id = más reciente
  const latestAvanceByFase = new Map<number, number>()
  for (const av of avances) {
    if (!latestAvanceByFase.has(av.fase_id)) {
      latestAvanceByFase.set(av.fase_id, Number(av.porcentaje))
    }
  }

  const fasesByObra = new Map<number, typeof fases>()
  for (const f of fases) {
    const list = fasesByObra.get(f.obra_id) ?? []
    list.push(f)
    fasesByObra.set(f.obra_id, list)
  }

  const avancePorObra = new Map<number, number>()
  for (const obra of obrasList) {
    const obraFases = fasesByObra.get(obra.id) ?? []
    if (obraFases.length === 0) {
      avancePorObra.set(obra.id, 0)
    } else {
      const sum = obraFases.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acc: number, f: any) => acc + (latestAvanceByFase.get(f.id) ?? 0),
        0
      )
      avancePorObra.set(obra.id, Math.round(sum / obraFases.length))
    }
  }

  // ── 4. Mapa obra_id → nombre (para incidencias) ──────────────────────────
  const obraMap = new Map<number, string>()
  for (const obra of obrasList) {
    obraMap.set(obra.id, obra.nombre)
  }

  // ── 5. KPIs ──────────────────────────────────────────────────────────────
  const totalObras         = obrasList.length
  const incidenciasAbiertas = incidencias.length

  // ── 6. Saludo y fecha ────────────────────────────────────────────────────
  const nombreDisplay = perfil.nombre?.trim() || ''
  const saludo        = nombreDisplay ? `Hola, ${nombreDisplay}` : 'Hola 👋'

  const fechaHoy = new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }

  return (
    <div>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-0.5" style={tp}>{saludo}</h1>
          <p className="text-sm" style={ts}>Arquitecto · GRUPO LOZCAM S.A.C</p>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0 mt-1"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
          }}
        >
          <CalendarDays size={13} style={ts} />
          <span className="text-xs capitalize" style={ts}>{fechaHoy}</span>
        </div>
      </div>

      {/* ── Métricas ──────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <MetricasArquitecto
          totalObras={totalObras}
          totalDocumentos={totalDocumentos}
          incidenciasAbiertas={incidenciasAbiertas}
        />
      </div>

      {/* ── Obras asignadas ───────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold" style={tp}>Mis obras asignadas</h2>
          <a href="/obras" className="text-xs text-amber-500 hover:text-amber-400">
            Ver todas →
          </a>
        </div>
        <ObrasAsignadasArquitecto obras={obrasList} avancePorObra={avancePorObra} />
      </div>

      {/* ── Documentos recientes + panel de incidencias ───────────────────── */}
      {/* En desktop: 2 columnas (docs más ancho, incidencias lateral).      */}
      {/* En móvil: apilados (docs arriba, incidencias abajo).               */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        <DocumentosRecientesArquitecto
          documentos={documentos}
          totalDocumentos={totalDocumentos}
        />
        <IncidenciasRelacionadasArquitecto
          incidencias={incidencias}
          obraMap={obraMap}
        />
      </div>

    </div>
  )
}
