'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Eye, EyeOff, RefreshCw } from 'lucide-react'

type Paso = 'formulario' | 'verificacion'

/** Códigos de error de @supabase/auth-js que indican código OTP inválido o expirado */
const CODIGOS_OTP_INVALIDO = new Set([
  'otp_expired',
  'reauthentication_not_valid',
  'reauth_nonce_missing',
])

export default function CambiarContrasenaForm() {
  const supabase = createClient()

  const [paso, setPaso] = useState<Paso>('formulario')
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [codigo, setCodigo] = useState('')
  const [verNueva, setVerNueva] = useState(false)
  const [verConfirmar, setVerConfirmar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorLocal, setErrorLocal] = useState('')

  const inputStyle = {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    color: 'var(--text-primary)',
  }
  const ts = { color: 'var(--text-secondary)' }
  const inputClass =
    'w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-action/40'

  // ── Validación ────────────────────────────────────────────────────────────

  function validar(): string {
    if (!nuevaPassword) return 'Ingresa la nueva contraseña.'
    if (nuevaPassword.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
    if (!confirmarPassword) return 'Confirma la nueva contraseña.'
    if (nuevaPassword !== confirmarPassword) return 'Las contraseñas no coinciden.'
    return ''
  }

  // ── Paso 1: solicitar código vía supabase.auth.reauthenticate() ───────────

  async function solicitarCodigo() {
    const err = validar()
    if (err) { setErrorLocal(err); return }
    setErrorLocal('')
    setLoading(true)

    const { error } = await supabase.auth.reauthenticate()
    setLoading(false)

    if (error) {
      toast.error('No se pudo enviar el código. Intenta de nuevo.')
      return
    }

    toast.success('Te enviamos un código de verificación a tu correo.')
    setPaso('verificacion')
    setCodigo('')
  }

  // ── Reenviar código desde la pantalla de verificación ────────────────────

  async function reenviarCodigo() {
    setLoading(true)
    const { error } = await supabase.auth.reauthenticate()
    setLoading(false)

    if (error) {
      toast.error('No se pudo reenviar el código. Intenta de nuevo.')
    } else {
      toast.success('Código reenviado a tu correo.')
      setCodigo('')
      setErrorLocal('')
    }
  }

  // ── Paso 2: confirmar código → supabase.auth.updateUser({ password, nonce }) ──

  async function confirmarYActualizar() {
    if (!codigo.trim()) {
      setErrorLocal('Ingresa el código de verificación.')
      return
    }
    setErrorLocal('')
    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: nuevaPassword,
      nonce: codigo.trim(),
    })
    setLoading(false)

    if (error) {
      const esInvalido = CODIGOS_OTP_INVALIDO.has(error.code ?? '')
      if (esInvalido) {
        setErrorLocal('Código incorrecto o expirado.')
        toast.error('Código incorrecto o expirado. Solicita uno nuevo.')
      } else {
        toast.error(error.message ?? 'Error al actualizar la contraseña.')
      }
      return
    }

    toast.success('Contraseña actualizada correctamente.')
    resetFormulario()
  }

  // ── Reset completo al estado inicial ──────────────────────────────────────

  function resetFormulario() {
    setPaso('formulario')
    setNuevaPassword('')
    setConfirmarPassword('')
    setCodigo('')
    setErrorLocal('')
    setVerNueva(false)
    setVerConfirmar(false)
  }

  // ── Render: paso "formulario" ─────────────────────────────────────────────

  if (paso === 'formulario') {
    return (
      <div className="space-y-4 max-w-sm">

        {/* Nueva contraseña */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={ts}>
            Nueva contraseña
          </label>
          <div className="relative">
            <input
              type={verNueva ? 'text' : 'password'}
              value={nuevaPassword}
              onChange={e => { setNuevaPassword(e.target.value); setErrorLocal('') }}
              className={`${inputClass} pr-10`}
              style={inputStyle}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setVerNueva(v => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 opacity-50 hover:opacity-100 transition-opacity"
              style={ts}
              tabIndex={-1}
              aria-label={verNueva ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {verNueva ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Confirmar contraseña */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={ts}>
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              type={verConfirmar ? 'text' : 'password'}
              value={confirmarPassword}
              onChange={e => { setConfirmarPassword(e.target.value); setErrorLocal('') }}
              className={`${inputClass} pr-10`}
              style={inputStyle}
              placeholder="Repite la nueva contraseña"
              autoComplete="new-password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setVerConfirmar(v => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 opacity-50 hover:opacity-100 transition-opacity"
              style={ts}
              tabIndex={-1}
              aria-label={verConfirmar ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {verConfirmar ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Error de validación */}
        {errorLocal && (
          <p className="text-xs text-red-500">{errorLocal}</p>
        )}

        {/* Acción */}
        <button
          type="button"
          onClick={solicitarCodigo}
          disabled={loading}
          className="rounded-lg px-5 py-2 text-sm font-medium transition-colors disabled:opacity-50 hover:opacity-80"
          style={{
            border: '1px solid var(--card-border)',
            color: 'var(--text-primary)',
            background: 'transparent',
          }}
        >
          {loading ? 'Enviando código…' : 'Actualizar contraseña'}
        </button>
      </div>
    )
  }

  // ── Render: paso "verificacion" ───────────────────────────────────────────

  return (
    <div className="space-y-4 max-w-sm">

      {/* Banner informativo */}
      <div
        className="rounded-lg px-4 py-3 text-xs leading-relaxed"
        style={{ background: 'var(--table-header-bg)', color: 'var(--text-secondary)' }}
      >
        Te enviamos un código de 6 dígitos a tu correo. Ingrésalo para confirmar el cambio de contraseña.
      </div>

      {/* Campo código */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={ts}>
          Código de verificación
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={codigo}
          onChange={e => { setCodigo(e.target.value.replace(/\D/g, '')); setErrorLocal('') }}
          className={inputClass}
          style={inputStyle}
          placeholder="6 dígitos"
          autoComplete="one-time-code"
          autoFocus
          disabled={loading}
        />
      </div>

      {/* Error de código */}
      {errorLocal && (
        <p className="text-xs text-red-500">{errorLocal}</p>
      )}

      {/* Botones principales: columna en móvil, fila en desktop */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={confirmarYActualizar}
          disabled={loading}
          className="bg-action hover:bg-action-hover text-white rounded-lg px-5 py-2 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Actualizando…' : 'Confirmar y actualizar'}
        </button>

        <button
          type="button"
          onClick={resetFormulario}
          disabled={loading}
          className="rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 hover:opacity-80"
          style={{
            border: '1px solid var(--card-border)',
            color: 'var(--text-secondary)',
            background: 'transparent',
          }}
        >
          Cancelar
        </button>
      </div>

      {/* Reenviar código */}
      <button
        type="button"
        onClick={reenviarCodigo}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs transition-opacity disabled:opacity-50 hover:opacity-70"
        style={ts}
      >
        <RefreshCw size={11} />
        Reenviar código
      </button>
    </div>
  )
}
