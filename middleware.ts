import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { buscarRegla } from './lib/permisos-rutas'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ── Rutas públicas: no requieren autenticación ────────────────────────────
  const rutasPublicas = ['/', '/landing', '/login', '/recuperar', '/reset-password', '/registro-cliente']
  const esPublica = rutasPublicas.some(r =>
    pathname === r || pathname.startsWith(r + '/')
  )
  if (esPublica) return NextResponse.next()

  // ── Cliente Supabase para el middleware (gestiona cookies de sesión) ───────
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // ── Verificación de autenticación (comportamiento original, intacto) ───────
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ── Verificación de rol (capa adicional, solo si la ruta tiene regla) ──────
  // Consultamos profiles SOLO cuando el pathname coincide con un prefijo
  // protegido, para evitar una query extra en cada request de rutas libres
  // como /dashboard, /mi-cuenta, /mi-perfil, /no-autorizado, etc.
  const regla = buscarRegla(pathname)

  if (regla) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('rol')
      .eq('id', user.id)
      .single()

    const rol: string = profile?.rol ?? ''

    if (!regla.roles.includes(rol)) {
      return NextResponse.redirect(new URL('/no-autorizado', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Excluye archivos estáticos de Next, favicon e imágenes.
    // El resto de rutas (incluyendo /no-autorizado) pasa por el middleware.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
