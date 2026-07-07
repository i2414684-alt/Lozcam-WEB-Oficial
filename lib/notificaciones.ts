/**
 * Helper servidor para el microservicio lozcam-notificaciones-service.
 * Solo importar desde Server Components o Server Actions — nunca desde 'use client'.
 * NOTIFICACIONES_API_SECRET jamás llega al cliente desde aquí.
 */

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface CrearNotificacionParams {
  perfil_id: string
  tipo: string
  titulo: string
  mensaje: string
  referencia_tabla?: string
  referencia_id?: string | number
}

export interface Notificacion {
  id: string | number
  perfil_id: string
  tipo: string
  titulo: string
  mensaje: string
  leida: boolean
  referencia_tabla?: string | null
  referencia_id?: string | number | null
  created_at: string
}

export interface NotificacionResult {
  ok: boolean
  error?: string
}

// ── Internos ──────────────────────────────────────────────────────────────────

const TIMEOUT_MS = 5_000

function baseUrl(): string {
  const url = process.env.NOTIFICACIONES_SERVICE_URL
  if (!url) throw new Error('NOTIFICACIONES_SERVICE_URL no está definida')
  return url.replace(/\/$/, '')
}

function authHeaders(): HeadersInit {
  const secret = process.env.NOTIFICACIONES_API_SECRET
  if (!secret) throw new Error('NOTIFICACIONES_API_SECRET no está definida')
  return {
    'Content-Type': 'application/json',
    'x-api-secret': secret,
  }
}

function makeSignal(): AbortSignal {
  return AbortSignal.timeout(TIMEOUT_MS)
}

// ── crearNotificacion ─────────────────────────────────────────────────────────

/**
 * Envía una notificación al microservicio.
 * Si falla (red, timeout, 4xx/5xx), captura el error y devuelve { ok: false }
 * sin propagar la excepción — el flujo principal de la app no se interrumpe.
 */
export async function crearNotificacion(
  params: CrearNotificacionParams,
): Promise<NotificacionResult> {
  try {
    const res = await fetch(`${baseUrl()}/notificaciones`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(params),
      signal: makeSignal(),
    })

    if (!res.ok) {
      const texto = await res.text().catch(() => '(sin cuerpo)')
      console.error(
        `[notificaciones] crearNotificacion falló — HTTP ${res.status}: ${texto}`,
      )
      return { ok: false, error: `HTTP ${res.status}` }
    }

    return { ok: true }
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : String(err)
    console.error(`[notificaciones] crearNotificacion — error de red/timeout: ${mensaje}`)
    return { ok: false, error: mensaje }
  }
}

// ── listarNotificaciones ──────────────────────────────────────────────────────

/**
 * Obtiene las notificaciones de un perfil.
 * Devuelve array vacío si el microservicio no responde o devuelve error.
 */
export async function listarNotificaciones(perfil_id: string): Promise<Notificacion[]> {
  try {
    const res = await fetch(`${baseUrl()}/notificaciones/${encodeURIComponent(perfil_id)}`, {
      method: 'GET',
      headers: authHeaders(),
      signal: makeSignal(),
    })

    if (!res.ok) {
      const texto = await res.text().catch(() => '(sin cuerpo)')
      console.error(
        `[notificaciones] listarNotificaciones falló — HTTP ${res.status}: ${texto}`,
      )
      return []
    }

    const json = await res.json()
    return Array.isArray(json.notificaciones) ? json.notificaciones : []
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : String(err)
    console.error(`[notificaciones] listarNotificaciones — error de red/timeout: ${mensaje}`)
    return []
  }
}

// ── marcarNotificacionLeida ───────────────────────────────────────────────────

/**
 * Marca una notificación como leída.
 * Resiliente: si falla, devuelve { ok: false } sin lanzar excepción.
 */
export async function marcarNotificacionLeida(
  id: string | number,
): Promise<NotificacionResult> {
  try {
    const res = await fetch(
      `${baseUrl()}/notificaciones/${encodeURIComponent(String(id))}/leida`,
      {
        method: 'PATCH',
        headers: authHeaders(),
        signal: makeSignal(),
      },
    )

    if (!res.ok) {
      const texto = await res.text().catch(() => '(sin cuerpo)')
      console.error(
        `[notificaciones] marcarNotificacionLeida falló — HTTP ${res.status}: ${texto}`,
      )
      return { ok: false, error: `HTTP ${res.status}` }
    }

    return { ok: true }
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : String(err)
    console.error(`[notificaciones] marcarNotificacionLeida — error de red/timeout: ${mensaje}`)
    return { ok: false, error: mensaje }
  }
}
