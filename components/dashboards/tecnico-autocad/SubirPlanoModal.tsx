'use client'

import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Upload, X } from 'lucide-react'
import { TIPO_DOCUMENTO_LABEL } from '@/lib/types/documentos'

interface Props {
  obras: { id: number; nombre: string }[]
  obraIdPorDefecto?: number
}

export default function SubirPlanoModal({ obras, obraIdPorDefecto }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)

  const defaultObraId = obraIdPorDefecto
    ? String(obraIdPorDefecto)
    : obras[0]
    ? String(obras[0].id)
    : ''

  const [abierto, setAbierto] = useState(false)
  const [loading, setLoading] = useState(false)
  const [archivo, setArchivo] = useState<File | null>(null)
  const [obraId, setObraId] = useState(defaultObraId)
  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState(Object.keys(TIPO_DOCUMENTO_LABEL)[0] ?? 'plano_arquitectonico')

  function resetForm() {
    setArchivo(null)
    setTitulo('')
    setTipo(Object.keys(TIPO_DOCUMENTO_LABEL)[0] ?? 'plano_arquitectonico')
    setObraId(defaultObraId)
    if (fileRef.current) fileRef.current.value = ''
  }

  function cerrar() {
    setAbierto(false)
    resetForm()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!archivo) { toast.error('Selecciona un archivo'); return }
    if (!titulo.trim()) { toast.error('Ingresa un título'); return }
    if (!obraId) { toast.error('Selecciona una obra'); return }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      const ext = archivo.name.split('.').pop()?.toLowerCase() ?? 'bin'
      const filePath = `${Date.now()}_${archivo.name}`
      const obraIdNum = Number(obraId)

      const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(filePath, archivo)
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('documentos').getPublicUrl(filePath)

      // Verificar si ya existe un documento con el mismo título en esa obra
      const { data: docExistente } = await supabase
        .from('documentos')
        .select('id, version_actual')
        .eq('obra_id', obraIdNum)
        .eq('titulo', titulo.trim())
        .maybeSingle()

      if (docExistente) {
        const nuevaVersion = (docExistente.version_actual ?? 0) + 1
        const { error: vErr } = await supabase.from('versiones_documento').insert({
          documento_id: docExistente.id,
          version: nuevaVersion,
          archivo_url: publicUrl,
          nombre_archivo: archivo.name,
          tipo_archivo: ext,
          tamanio_bytes: archivo.size,
          subido_por: user.id,
        })
        if (vErr) throw vErr
        await supabase.from('documentos').update({ version_actual: nuevaVersion }).eq('id', docExistente.id)
        toast.success(`Nueva versión (v${nuevaVersion}) guardada para "${titulo.trim()}"`)
      } else {
        const { data: nuevoDoc, error: docErr } = await supabase
          .from('documentos')
          .insert({
            titulo: titulo.trim(),
            tipo,
            obra_id: obraIdNum,
            estado: 'borrador',
            version_actual: 1,
            subido_por: user.id,
          })
          .select('id')
          .single()
        if (docErr) throw docErr

        const { error: vErr } = await supabase.from('versiones_documento').insert({
          documento_id: nuevoDoc.id,
          version: 1,
          archivo_url: publicUrl,
          nombre_archivo: archivo.name,
          tipo_archivo: ext,
          tamanio_bytes: archivo.size,
          subido_por: user.id,
        })
        if (vErr) throw vErr
        toast.success(`Plano "${titulo.trim()}" subido correctamente`)
      }

      cerrar()
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al subir el archivo')
    } finally {
      setLoading(false)
    }
  }

  const cardStyle = { background: 'var(--card-bg)', border: '1px solid var(--card-border)' }
  const inputStyle = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }
  const labelClass = 'block text-sm font-medium mb-1'
  const inputClass = 'w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500'
  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="flex items-center gap-2 bg-action hover:bg-action-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        <Upload size={15} />
        Subir plano nuevo
      </button>

      {abierto && createPortal(
        /* El portal se monta en document.body, fuera del árbol del dashboard.
           Esto evita que overflow-y-auto / overflow-x-auto de contenedores
           padres creen stacking contexts que atrapen el z-index del modal. */
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop sólido — cubre TODA la pantalla con opacidad uniforme */}
          <div className="absolute inset-0 bg-black/60" onClick={cerrar} />

          {/* Tarjeta del modal — fondo sólido en ambos modos (var(--card-bg) es
               rgba(255,255,255,0.04) en dark → casi transparente → usa Tailwind) */}
          <div
            className="relative z-10 w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900"
            style={{ border: '1px solid var(--card-border)' }}
          >
            <div
              className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white dark:bg-gray-900"
              style={{ borderBottom: '1px solid var(--card-border)' }}
            >
              <h2 className="text-base font-semibold" style={tp}>Subir plano</h2>
              <button
                type="button"
                onClick={cerrar}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-black/10 dark:hover:bg-white/10"
                style={ts}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {obras.length > 1 ? (
                <div>
                  <label className={labelClass} style={ts}>Obra *</label>
                  <select
                    value={obraId}
                    onChange={e => setObraId(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                    required
                  >
                    {obras.map(o => (
                      <option key={o.id} value={o.id}>{o.nombre}</option>
                    ))}
                  </select>
                </div>
              ) : obras.length === 1 && (
                <div
                  className="text-sm rounded-lg px-3 py-2"
                  style={{ background: 'var(--table-header-bg)' }}
                >
                  <span style={ts}>Obra: </span>
                  <span className="font-medium" style={tp}>{obras[0].nombre}</span>
                </div>
              )}

              <div>
                <label className={labelClass} style={ts}>Título del plano *</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="Ej: Plano de planta primer piso"
                  required
                />
                <p className="text-xs mt-1" style={ts}>
                  Si el título ya existe en esta obra se creará una nueva versión automáticamente.
                </p>
              </div>

              <div>
                <label className={labelClass} style={ts}>Tipo de documento *</label>
                <select
                  value={tipo}
                  onChange={e => setTipo(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                  required
                >
                  {Object.entries(TIPO_DOCUMENTO_LABEL).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass} style={ts}>Archivo *</label>
                <div
                  className="border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors hover:border-amber-500"
                  style={{ borderColor: 'var(--card-border)' }}
                  onClick={() => fileRef.current?.click()}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.dwg,.rvt,.xlsx,.docx,.png,.jpg,.jpeg"
                    onChange={e => setArchivo(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                  {archivo ? (
                    <>
                      <p className="text-sm font-medium text-amber-500 break-all">{archivo.name}</p>
                      <p className="text-xs mt-1" style={ts}>{(archivo.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm" style={ts}>Haz clic para seleccionar el archivo</p>
                      <p className="text-xs mt-1" style={ts}>PDF, DWG, RVT, Excel, Word, JPG, PNG</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-1 pb-1">
                <button
                  type="button"
                  onClick={cerrar}
                  disabled={loading}
                  className="flex-1 rounded-lg py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50"
                  style={{ border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-action hover:bg-action-hover text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Subiendo…' : 'Subir plano'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
