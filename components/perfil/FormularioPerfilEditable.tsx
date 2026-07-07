'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import TarjetaHeroPerfil from './TarjetaHeroPerfil'
import TarjetasInfoPerfil from './TarjetasInfoPerfil'

interface Valores {
  dni: string
  telefono: string
  telefono_alt: string
  email_personal: string
  especialidades: string
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  perfil: any
  userId: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function perfilAValores(perfil: any): Valores {
  return {
    dni: perfil.dni ?? '',
    telefono: perfil.telefono ?? '',
    telefono_alt: perfil.telefono_alt ?? '',
    email_personal: perfil.email_personal ?? '',
    especialidades: (perfil.especialidades ?? []).join(', '),
  }
}

export default function FormularioPerfilEditable({ perfil, userId }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [modoEdicion, setModoEdicion] = useState(false)
  const [valores, setValores] = useState<Valores>(perfilAValores(perfil))
  const [loading, setLoading] = useState(false)
  const [loadingFoto, setLoadingFoto] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(perfil.avatar_url ?? null)

  // Sincroniza el estado local cuando el servidor refresca perfil (router.refresh)
  useEffect(() => {
    if (!modoEdicion) {
      setValores(perfilAValores(perfil))
      setAvatarUrl(perfil.avatar_url ?? null)
    }
  // Solo queremos disparar esto cuando cambia perfil, no en cada cambio de modoEdicion
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfil])

  function handleCampoChange(campo: string, valor: string) {
    setValores(prev => ({ ...prev, [campo]: valor }))
  }

  function handleCancelar() {
    setValores(perfilAValores(perfil))
    setModoEdicion(false)
  }

  async function handleGuardar() {
    setLoading(true)
    try {
      const especialidadesArray = valores.especialidades
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)

      const { error } = await supabase
        .from('profiles')
        .update({
          dni: valores.dni || null,
          telefono: valores.telefono || null,
          telefono_alt: valores.telefono_alt || null,
          email_personal: valores.email_personal || null,
          especialidades: especialidadesArray,
        })
        .eq('id', userId)

      if (error) throw error

      toast.success('Perfil actualizado correctamente.')
      setModoEdicion(false)
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo guardar. Intenta de nuevo.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleFotoChange(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no debe pesar más de 2 MB.')
      return
    }

    setLoadingFoto(true)
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const ruta = `${userId}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(ruta, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(ruta)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)

      if (updateError) throw updateError

      // Cache-buster para que el browser muestre la imagen nueva de inmediato
      setAvatarUrl(`${publicUrl}?t=${Date.now()}`)
      toast.success('Foto de perfil actualizada.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo subir la foto.'
      toast.error(msg)
    } finally {
      setLoadingFoto(false)
    }
  }

  return (
    <div className="space-y-6">
      <TarjetaHeroPerfil
        perfil={perfil}
        avatarUrl={avatarUrl}
        modoEdicion={modoEdicion}
        onActivarEdicion={() => setModoEdicion(true)}
        onFotoChange={handleFotoChange}
        loadingFoto={loadingFoto}
      />
      <TarjetasInfoPerfil
        perfil={perfil}
        modoEdicion={modoEdicion}
        valores={valores}
        onChange={handleCampoChange}
      />
      {modoEdicion && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleGuardar}
            disabled={loading}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-action transition-colors disabled:opacity-60"
          >
            {loading ? 'Guardando…' : 'Guardar cambios'}
          </button>
          <button
            type="button"
            onClick={handleCancelar}
            disabled={loading}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            style={{
              border: '1px solid var(--card-border)',
              color: 'var(--text-primary)',
              background: 'transparent',
            }}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}
