import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listarNotificaciones, marcarNotificacionLeida } from '@/lib/notificaciones'

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 })
    }

    // Verifica que la notificación pertenezca al usuario autenticado
    // antes de delegar al microservicio, para evitar que un usuario
    // marque como leídas notificaciones ajenas.
    const notificaciones = await listarNotificaciones(user.id)
    const pertenece = notificaciones.some(n => String(n.id) === String(id))

    if (!pertenece) {
      return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 403 })
    }

    const result = await marcarNotificacionLeida(id)

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error ?? 'Error al marcar' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
