'use client'

import { Pencil } from 'lucide-react'

interface Props {
  onClick: () => void
  disabled?: boolean
}

export default function BotonEditarPerfil({ onClick, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
      style={{
        border: '1px solid var(--card-border)',
        color: 'var(--text-primary)',
        background: 'transparent',
      }}
    >
      <Pencil size={14} />
      Editar perfil
    </button>
  )
}
