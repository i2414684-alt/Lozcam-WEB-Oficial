import CambiarCorreoForm from '@/components/cuenta/CambiarCorreoForm'

const cardStyle = {
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
}

export default function MiCuentaPage() {
  return (
    <div className="max-w-xl mx-auto">

      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Mi cuenta
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Gestiona los datos de acceso de tu cuenta
        </p>
      </div>

      <div className="rounded-xl p-6" style={cardStyle}>
        <h2
          className="text-sm font-semibold mb-5 pb-4"
          style={{
            color: 'var(--text-primary)',
            borderBottom: '1px solid var(--card-border)',
          }}
        >
          Cambiar correo de acceso
        </h2>
        <CambiarCorreoForm />
      </div>

    </div>
  )
}
