/**
 * Matriz de permisos por ruta para el middleware.
 *
 * Reglas evaluadas en ORDEN: la primera que coincida gana.
 * Las reglas más específicas (rutas más largas o con condición extra)
 * deben ir ANTES que las más genéricas del mismo prefijo.
 *
 * Rutas NO listadas aquí → permitidas para cualquier rol autenticado.
 */

export interface ReglaRuta {
  match: (pathname: string) => boolean
  roles: readonly string[]
}

const REGLAS: ReglaRuta[] = [
  // ── /personal ──────────────────────────────────────────────────────────────
  // /personal/nuevo — solo gerente y admin pueden crear usuarios
  {
    match: (p) => p === '/personal/nuevo',
    roles: ['gerente_general', 'administrador'],
  },
  // /personal/[id]/editar — solo gerente y admin pueden editar cualquier perfil
  {
    match: (p) => p.startsWith('/personal/') && p.endsWith('/editar'),
    roles: ['gerente_general', 'administrador'],
  },
  // /personal — lista y detalle (subgerente también puede ver, pero no modificar)
  {
    match: (p) => p === '/personal' || p.startsWith('/personal/'),
    roles: ['gerente_general', 'subgerente', 'administrador'],
  },

  // ── Resto de módulos (regla única por prefijo) ─────────────────────────────
  {
    match: (p) => p === '/obras' || p.startsWith('/obras/'),
    roles: ['gerente_general', 'subgerente', 'administrador', 'ingeniero_residente', 'arquitecto', 'maestro_obra', 'contador'],
  },
  {
    match: (p) => p === '/clientes' || p.startsWith('/clientes/'),
    roles: ['gerente_general', 'subgerente', 'administrador', 'vendedor', 'contador'],
  },
  {
    match: (p) => p === '/solicitudes' || p.startsWith('/solicitudes/'),
    roles: ['gerente_general', 'subgerente', 'administrador', 'vendedor'],
  },
  {
    match: (p) => p === '/presupuestos' || p.startsWith('/presupuestos/'),
    roles: ['gerente_general', 'subgerente', 'administrador', 'contador'],
  },
  {
    match: (p) => p === '/pagos' || p.startsWith('/pagos/'),
    roles: ['gerente_general', 'subgerente', 'administrador', 'contador'],
  },
  {
    match: (p) => p === '/documentos' || p.startsWith('/documentos/'),
    roles: ['gerente_general', 'subgerente', 'administrador', 'ingeniero_residente', 'arquitecto', 'tecnico_autocad', 'topografo'],
  },
  {
    match: (p) => p === '/reportes' || p.startsWith('/reportes/'),
    roles: ['gerente_general', 'subgerente', 'administrador', 'ingeniero_residente', 'maestro_obra'],
  },
]

/**
 * Devuelve la primera regla que coincide con el pathname dado,
 * o undefined si la ruta no tiene restricción de rol.
 */
export function buscarRegla(pathname: string): ReglaRuta | undefined {
  return REGLAS.find((r) => r.match(pathname))
}
