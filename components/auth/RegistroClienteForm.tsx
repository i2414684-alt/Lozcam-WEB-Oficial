'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'

const INPUT_CLASS =
  'w-full bg-[#1e2535] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors'

const LABEL_CLASS = 'block text-sm font-semibold text-gray-300 mb-2'

/** Traduce errores de Supabase Auth a mensajes amigables en español. */
function traducirError(code: string | undefined, message: string | undefined): string {
  if (code === 'user_already_exists' || message?.toLowerCase().includes('already registered')) {
    return 'Ese correo ya tiene una cuenta registrada.'
  }
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit') {
    return 'Demasiados intentos. Espera unos minutos e intenta de nuevo.'
  }
  if (code === 'weak_password') {
    return 'La contraseña es demasiado débil. Elige una más segura.'
  }
  if (code === 'validation_failed') {
    return 'El correo ingresado no es válido.'
  }
  return 'No se pudo completar el registro. Intenta de nuevo.'
}

export default function RegistroClienteForm() {
  const supabase = createClient()

  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')

  const [verPassword, setVerPassword] = useState(false)
  const [verConfirmar, setVerConfirmar] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [enviado, setEnviado] = useState(false)

  // ── Validación local ─────────────────────────────────────────────────────

  function validar(): string {
    if (!nombre.trim())     return 'El nombre es obligatorio.'
    if (!apellidos.trim())  return 'Los apellidos son obligatorios.'
    if (!correo.trim())     return 'El correo es obligatorio.'
    // Validación de formato de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      return 'Ingresa un correo con formato válido.'
    }
    if (!telefono.trim())   return 'El teléfono es obligatorio.'
    if (!password)          return 'La contraseña es obligatoria.'
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
    if (!confirmar)         return 'Confirma tu contraseña.'
    if (password !== confirmar) return 'Las contraseñas no coinciden.'
    return ''
  }

  // ── Envío ────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const errValidacion = validar()
    if (errValidacion) { setError(errValidacion); return }

    setLoading(true)

    const { data, error: authError } = await supabase.auth.signUp({
      email: correo.trim(),
      password,
      options: {
        data: {
          rol: 'cliente',
          nombre: nombre.trim(),
          apellidos: apellidos.trim(),
          telefono: telefono.trim(),
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
      },
    })

    setLoading(false)

    if (authError) {
      setError(traducirError(authError.code, authError.message))
      return
    }

    // Supabase puede devolver éxito sin error pero con identidades vacías
    // cuando el correo ya está registrado y las confirmaciones están activas.
    if (data.user && (data.user.identities?.length ?? 0) === 0) {
      setError('Ese correo ya tiene una cuenta registrada.')
      return
    }

    setEnviado(true)
  }

  // ── Estado: éxito ────────────────────────────────────────────────────────

  if (enviado) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={28} className="text-green-400" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">¡Revisa tu correo!</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Te enviamos un correo de confirmación a{' '}
          <span className="text-amber-400 font-medium">{correo.trim()}</span>.
          <br />
          Revisa tu bandeja de entrada (y la carpeta de spam) para activar tu cuenta.
        </p>
      </div>
    )
  }

  // ── Estado: formulario ───────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>

      {/* Nombre + Apellidos — fila en desktop, columna en móvil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLASS}>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={e => { setNombre(e.target.value); setError('') }}
            placeholder="Juan"
            autoComplete="given-name"
            disabled={loading}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Apellidos</label>
          <input
            type="text"
            value={apellidos}
            onChange={e => { setApellidos(e.target.value); setError('') }}
            placeholder="Pérez García"
            autoComplete="family-name"
            disabled={loading}
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {/* Correo */}
      <div>
        <label className={LABEL_CLASS}>Correo electrónico</label>
        <input
          type="email"
          value={correo}
          onChange={e => { setCorreo(e.target.value); setError('') }}
          placeholder="tu@correo.com"
          autoComplete="email"
          inputMode="email"
          disabled={loading}
          className={INPUT_CLASS}
        />
      </div>

      {/* Teléfono */}
      <div>
        <label className={LABEL_CLASS}>Teléfono</label>
        <input
          type="tel"
          value={telefono}
          onChange={e => { setTelefono(e.target.value); setError('') }}
          placeholder="+51 999 000 000"
          autoComplete="tel"
          inputMode="tel"
          disabled={loading}
          className={INPUT_CLASS}
        />
      </div>

      {/* Contraseña */}
      <div>
        <label className={LABEL_CLASS}>Contraseña</label>
        <div className="relative">
          <input
            type={verPassword ? 'text' : 'password'}
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            disabled={loading}
            className={`${INPUT_CLASS} pr-11`}
          />
          <button
            type="button"
            onClick={() => setVerPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            tabIndex={-1}
            aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {verPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Confirmar contraseña */}
      <div>
        <label className={LABEL_CLASS}>Confirmar contraseña</label>
        <div className="relative">
          <input
            type={verConfirmar ? 'text' : 'password'}
            value={confirmar}
            onChange={e => { setConfirmar(e.target.value); setError('') }}
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
            disabled={loading}
            className={`${INPUT_CLASS} pr-11`}
          />
          <button
            type="button"
            onClick={() => setVerConfirmar(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            tabIndex={-1}
            aria-label={verConfirmar ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {verConfirmar ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-900 font-bold py-3 rounded-xl transition-colors text-sm shadow-lg shadow-amber-900/30 mt-2"
      >
        {loading ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>
    </form>
  )
}
