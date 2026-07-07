import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listarNotificaciones } from '@/lib/notificaciones'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 })
    }

    const notificaciones = await listarNotificaciones(user.id)
    return NextResponse.json({ ok: true, notificaciones })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
