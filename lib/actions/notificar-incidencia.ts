'use server'

import { createClient } from '@/lib/supabase/server'
import { crearNotificacion } from '@/lib/notificaciones'

interface NotificarIncidenciaParams {
  obra_id: number
  incidencia_id: number
  tipo: string
  descripcion: string
  gravedad: string
}

export async function notificarIncidencia({
  obra_id,
  incidencia_id,
  tipo,
  descripcion,
  gravedad,
}: NotificarIncidenciaParams): Promise<void> {
  try {
    const supabase = await createClient()

    const { data: asignados, error } = await supabase
      .from('asignaciones')
      .select('perfil_id')
      .eq('obra_id', obra_id)
      .eq('activo', true)
      .in('rol_en_obra', ['ingeniero_residente', 'maestro_obra', 'arquitecto'])

    if (error) {
      console.error(`[notificar-incidencia] Error consultando asignaciones: ${error.message}`)
      return
    }

    if (!asignados || asignados.length === 0) return

    const resumen = descripcion.length > 120
      ? descripcion.slice(0, 120).trimEnd() + '…'
      : descripcion

    const mensaje = `Incidencia de gravedad ${gravedad} (${tipo}): ${resumen}`

    await Promise.allSettled(
      asignados.map((a) =>
        crearNotificacion({
          perfil_id: a.perfil_id,
          tipo: 'incidencia',
          titulo: 'Nueva incidencia reportada',
          mensaje,
          referencia_tabla: 'incidencias',
          referencia_id: incidencia_id,
        }),
      ),
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[notificar-incidencia] Error inesperado: ${msg}`)
  }
}
