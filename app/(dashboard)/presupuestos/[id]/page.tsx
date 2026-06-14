'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatFecha, formatPEN } from '@/lib/utils/formatters'
import { ESTADO_PRESUPUESTO_COLOR, TIPO_COSTO_LABEL } from '@/lib/types/presupuestos'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function PresupuestoDetallePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = Number(params.id)

  const supabase = createClient()

  const [pres, setPres] = useState<any>(null)
  const [partidas, setPartidas] = useState<any[]>([])
  const [missing, setMissing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (isNaN(id)) { setMissing(true); return }

    supabase
      .from('presupuestos')
      .select('*, obras(nombre)')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setMissing(true); return }
        setPres(data)
      })

    supabase
      .from('partidas')
      .select('id, presupuesto_id, codigo, descripcion, unidad, metrado, precio_unitario, parcial, tipo_costo, orden')
      .eq('presupuesto_id', id)
      .order('orden', { ascending: true })
      .then(({ data }) => setPartidas(data ?? []))
  }, [id])

  async function handleDelete() {
    setDeleting(true)
    setDeleteError('')

    const { error } = await supabase
      .from('presupuestos')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error(error.message ?? 'No se pudo eliminar el presupuesto')
      setDeleteError(error.message)
      setDeleting(false)
      return
    }

    toast.success('Presupuesto eliminado')
    router.push('/presupuestos')
    router.refresh()
  }

  const cardStyle = { background: 'var(--card-bg)', border: '1px solid var(--card-border)' }
  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }

  if (missing) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p style={tp}>Presupuesto no encontrado.</p>
        <Link href="/presupuestos" className="text-amber-500 text-sm mt-2 block">← Volver a presupuestos</Link>
      </div>
    )
  }

  if (!pres) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-sm" style={ts}>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => { if (!deleting) setShowDeleteModal(false) }}
          />
          <div className="relative z-10 rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl bg-white dark:bg-gray-800" style={{ border: '1px solid var(--card-border)' }}>
            <h2 className="text-base font-semibold mb-2" style={tp}>¿Eliminar este presupuesto?</h2>
            <p className="text-sm mb-5" style={ts}>
              Esta acción no se puede deshacer y también eliminará sus partidas.
            </p>
            {deleteError && (
              <p className="text-red-500 text-sm mb-3">{deleteError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 rounded-lg py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50"
                style={{ border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50 transition-colors"
              >
                {deleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold" style={tp}>{pres.nombre}</h1>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                ESTADO_PRESUPUESTO_COLOR[pres.estado] ?? 'bg-gray-100 text-gray-700'
              }`}
            >
              {pres.estado.charAt(0).toUpperCase() + pres.estado.slice(1)}
            </span>
            {pres.es_vigente && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">Vigente</span>
            )}
          </div>
          <p className="text-sm" style={ts}>
            {pres.obras?.nombre} · {formatFecha(pres.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-400 px-3 py-1.5 rounded-lg font-medium transition-colors"
            style={{ border: '1px solid rgba(239,68,68,0.3)' }}
          >
            <Trash2 size={15} />
            Eliminar
          </button>
          <Link
            href={`/presupuestos/${id}/editar`}
            className="flex items-center gap-1.5 text-sm border border-accent/40 text-accent hover:bg-accent/10 px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            <Pencil size={15} />
            Editar
          </Link>
          <Link href="/presupuestos" className="text-sm hover:opacity-70 transition-opacity" style={ts}>
            ← Volver
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl p-4" style={cardStyle}>
          <p className="text-xs mb-1" style={ts}>Costo directo</p>
          <p className="text-lg font-bold" style={tp}>{formatPEN(pres.total_directo)}</p>
        </div>
        <div className="rounded-xl p-4" style={cardStyle}>
          <p className="text-xs mb-1" style={ts}>Gastos generales</p>
          <p className="text-lg font-bold" style={tp}>{formatPEN(pres.gastos_generales)}</p>
        </div>
        <div className="rounded-xl p-4" style={cardStyle}>
          <p className="text-xs mb-1" style={ts}>IGV</p>
          <p className="text-lg font-bold" style={tp}>{formatPEN(pres.igv)}</p>
        </div>
        <div className="bg-amber-500 rounded-xl p-4">
          <p className="text-xs text-white/70 mb-1">TOTAL</p>
          <p className="text-lg font-bold text-white">{formatPEN(pres.total)}</p>
        </div>
      </div>

      {/* Tabla de partidas */}
      <div className="rounded-xl overflow-hidden" style={cardStyle}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
          <h2 className="text-sm font-semibold" style={tp}>Partidas ({partidas?.length ?? 0})</h2>
        </div>

        {!partidas || partidas.length === 0 ? (
          <p className="text-sm text-center py-8" style={ts}>No hay partidas registradas</p>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--table-header-bg)', borderBottom: '2px solid var(--table-border)' }}>
              <tr>
                <th className="text-left px-4 py-2 text-xs font-medium" style={ts}>Código</th>
                <th className="text-left px-4 py-2 text-xs font-medium" style={ts}>Descripción</th>
                <th className="text-left px-4 py-2 text-xs font-medium" style={ts}>Unidad</th>
                <th className="text-right px-4 py-2 text-xs font-medium" style={ts}>Metrado</th>
                <th className="text-right px-4 py-2 text-xs font-medium" style={ts}>P. Unit</th>
                <th className="text-right px-4 py-2 text-xs font-medium" style={ts}>Parcial</th>
                <th className="text-left px-4 py-2 text-xs font-medium" style={ts}>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {partidas.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  style={{ borderTop: '1px solid var(--table-border)' }}
                >
                  <td className="px-4 py-2 text-xs font-mono" style={ts}>{p.codigo ?? '—'}</td>
                  <td className="px-4 py-2" style={tp}>{p.descripcion}</td>
                  <td className="px-4 py-2" style={ts}>{p.unidad ?? '—'}</td>
                  <td className="px-4 py-2 text-right" style={tp}>{p.metrado}</td>
                  <td className="px-4 py-2 text-right" style={tp}>{formatPEN(p.precio_unitario ?? 0)}</td>
                  <td className="px-4 py-2 font-medium text-right" style={tp}>{formatPEN(p.parcial ?? 0)}</td>
                  <td className="px-4 py-2 text-xs" style={ts}>{TIPO_COSTO_LABEL[p.tipo_costo] ?? p.tipo_costo}</td>
                </tr>
              ))}
            </tbody>
            <tfoot style={{ borderTop: '2px solid var(--table-border)', background: 'var(--table-header-bg)' }}>
              <tr>
                <td colSpan={5} className="px-4 py-2 text-sm font-bold text-right" style={tp}>
                  TOTAL DIRECTO
                </td>
                <td className="px-4 py-2 text-sm font-bold text-right text-amber-500">
                  {formatPEN(pres.total_directo)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

    </div>
  )
}
