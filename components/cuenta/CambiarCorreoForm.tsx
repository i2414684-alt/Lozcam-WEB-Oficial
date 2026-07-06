'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function CambiarCorreoForm() {
  const supabase = createClient()

  const [correoActual, setCorreoActual] = useState<string>('')
  const [correoNuevo, setCorreoNuevo]   = useState<string>('')
  const [loading, setLoading]           = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCorreoActual(data.user?.email ?? '')
    })
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const trimmed = correoNuevo.trim()

    if (!trimmed) {
      toast.error('Ingresa el nuevo correo')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) {
      toast.error('El formato del correo no es válido')
      return
    }

    if (trimmed.toLowerCase() === correoActual.toLowerCase()) {
      toast.warning('El nuevo correo es igual al actual')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ email: trimmed })

    setLoading(false)

    if (error) {
      toast.error(error.message ?? 'Error al actualizar el correo')
      return
    }

    toast.success(
      `Se envió un correo de verificación a ${trimmed}. El cambio se aplicará cuando lo confirmes desde ese correo.`
    )
    setCorreoNuevo('')
  }

  const tp = { color: 'var(--text-primary)' }
  const ts = { color: 'var(--text-secondary)' }
  const inputStyle = {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    color: 'var(--text-primary)',
  }
  const inputClass =
    'w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500'
  const labelClass = 'block text-sm font-medium mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Correo actual — solo lectura */}
      <div>
        <label className={labelClass} style={ts}>Correo actual</label>
        <input
          type="email"
          readOnly
          value={correoActual}
          className={`${inputClass} opacity-60 cursor-default`}
          style={inputStyle}
        />
      </div>

      {/* Correo nuevo */}
      <div>
        <label className={labelClass} style={tp}>Nuevo correo *</label>
        <input
          type="email"
          required
          value={correoNuevo}
          onChange={(e) => setCorreoNuevo(e.target.value)}
          placeholder="nuevo@ejemplo.com"
          className={inputClass}
          style={inputStyle}
        />
        <p className="text-xs mt-1" style={ts}>
          Supabase enviará un enlace de confirmación al nuevo correo. El cambio se activa al hacer clic en ese enlace.
        </p>
      </div>

      <div className="pt-1">
        <button
          type="submit"
          disabled={loading}
          className="bg-action hover:bg-action-hover text-white rounded-lg px-5 py-2 text-sm font-medium disabled:opacity-50 transition-colors"
        >
          {loading ? 'Enviando...' : 'Actualizar correo'}
        </button>
      </div>

    </form>
  )
}
