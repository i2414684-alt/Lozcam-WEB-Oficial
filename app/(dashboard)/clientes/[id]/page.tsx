'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatFecha } from '@/lib/utils/formatters'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ClienteDetallePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = Number(params.id)

  const supabase = createClient()

  const [cliente, setCliente] = useState<any>(null)
  const [missing, setMissing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (isNaN(id)) { setMissing(true); return }

    supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setMissing(true); return }
        setCliente(data)
      })
  }, [id])

  async function handleDelete() {
    setDeleting(true)
    setDeleteError('')

    const { error } = await supabase
      .from('clientes')
      .update({ activo: false })
      .eq('id', id)

    if (error) {
      toast.error(error.message ?? 'No se pudo eliminar el cliente')
      setDeleteError(error.message)
      setDeleting(false)
      return
    }

    toast.success('Cliente eliminado')
    router.push('/clientes')
    router.refresh()
  }

  const cardStyle = { background: 'var(--card-bg)', border: '1px solid var(--card-border)' }
  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }
  const mostrar = (v: any) =>
    v === null || v === undefined || v === '' ? '—' : String(v)

  if (missing) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p style={tp}>Cliente no encontrado.</p>
        <Link href="/clientes" className="text-amber-500 text-sm mt-2 block">← Volver a clientes</Link>
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-sm" style={ts}>Cargando...</p>
      </div>
    )
  }

  const esNatural = cliente.tipo_persona === 'natural'

  return (
    <div className="max-w-2xl mx-auto">

      {/* Modal de confirmación soft-delete */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => { if (!deleting) setShowDeleteModal(false) }}
          />
          <div className="relative z-10 rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl bg-white dark:bg-gray-800" style={{ border: '1px solid var(--card-border)' }}>
            <h2 className="text-base font-semibold mb-2" style={tp}>¿Eliminar este cliente?</h2>
            <p className="text-sm mb-5" style={ts}>
              Dejará de aparecer en los listados. No se elimina su historial de obras/pagos.
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
          <h1 className="text-2xl font-bold" style={tp}>
            {esNatural
              ? `${cliente.nombres ?? ''} ${cliente.apellidos ?? ''}`.trim() || '—'
              : mostrar(cliente.razon_social)}
          </h1>
          <p className="text-sm mt-0.5" style={ts}>
            {esNatural ? 'Persona Natural' : 'Persona Jurídica'}
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
            href={`/clientes/${cliente.id}/editar`}
            className="flex items-center gap-1.5 text-sm border border-accent/40 text-accent hover:bg-accent/10 px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            <Pencil size={15} />
            Editar
          </Link>
          <Link href="/clientes" className="text-sm hover:opacity-70 transition-opacity" style={ts}>
            ← Volver
          </Link>
        </div>
      </div>

      {/* Identificación + Contacto */}
      <div className="grid grid-cols-2 gap-4 mb-4">

        {/* Identificación */}
        <div className="rounded-xl p-5" style={cardStyle}>
          <h2 className="text-sm font-semibold mb-3" style={tp}>Identificación</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs mb-0.5" style={ts}>Tipo de persona</p>
              <p className="text-sm" style={tp}>{esNatural ? 'Persona Natural' : 'Persona Jurídica'}</p>
            </div>

            {esNatural ? (
              <>
                <div>
                  <p className="text-xs mb-0.5" style={ts}>Nombres</p>
                  <p className="text-sm font-medium" style={tp}>{mostrar(cliente.nombres)}</p>
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={ts}>Apellidos</p>
                  <p className="text-sm font-medium" style={tp}>{mostrar(cliente.apellidos)}</p>
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={ts}>DNI</p>
                  <p className="text-sm font-mono" style={tp}>{mostrar(cliente.dni)}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs mb-0.5" style={ts}>Razón social</p>
                  <p className="text-sm font-medium" style={tp}>{mostrar(cliente.razon_social)}</p>
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={ts}>Nombre comercial</p>
                  <p className="text-sm" style={tp}>{mostrar(cliente.nombre_comercial)}</p>
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={ts}>RUC</p>
                  <p className="text-sm font-mono" style={tp}>{mostrar(cliente.ruc)}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contacto */}
        <div className="rounded-xl p-5" style={cardStyle}>
          <h2 className="text-sm font-semibold mb-3" style={tp}>Contacto</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs mb-0.5" style={ts}>Email</p>
              <p className="text-sm" style={tp}>{mostrar(cliente.email)}</p>
            </div>
            <div>
              <p className="text-xs mb-0.5" style={ts}>Teléfono</p>
              <p className="text-sm" style={tp}>{mostrar(cliente.telefono)}</p>
            </div>
            <div>
              <p className="text-xs mb-0.5" style={ts}>WhatsApp</p>
              <p className="text-sm" style={tp}>{mostrar(cliente.whatsapp)}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Ubicación */}
      <div className="rounded-xl p-5 mb-4" style={cardStyle}>
        <h2 className="text-sm font-semibold mb-3" style={tp}>Ubicación</h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs mb-0.5" style={ts}>Dirección</p>
            <p className="text-sm" style={tp}>{mostrar(cliente.direccion)}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs mb-0.5" style={ts}>Distrito</p>
              <p className="text-sm" style={tp}>{mostrar(cliente.distrito)}</p>
            </div>
            <div>
              <p className="text-xs mb-0.5" style={ts}>Provincia</p>
              <p className="text-sm" style={tp}>{mostrar(cliente.provincia)}</p>
            </div>
            <div>
              <p className="text-xs mb-0.5" style={ts}>Departamento</p>
              <p className="text-sm" style={tp}>{mostrar(cliente.departamento)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notas */}
      <div className="rounded-xl p-5 mb-4" style={cardStyle}>
        <h2 className="text-sm font-semibold mb-2" style={tp}>Notas</h2>
        <p className="text-sm" style={ts}>{mostrar(cliente.notas)}</p>
      </div>

      {/* Footer: activo + fecha registro */}
      <div className="rounded-xl px-5 py-4" style={cardStyle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-xs" style={ts}>Estado:</p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                cliente.activo
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {cliente.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <p className="text-xs" style={ts}>
            Registrado el {formatFecha(cliente.created_at)}
          </p>
        </div>
      </div>

    </div>
  )
}
