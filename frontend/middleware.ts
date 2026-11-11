import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const code = searchParams.get('code')

  // Se o OAuth retornar para a raiz com ?code=, redireciona para a rota que troca o código pela sessão
  if (code && pathname === '/') {
    const callbackUrl = new URL('/auth/callback', request.url)
    callbackUrl.search = request.nextUrl.search
    if (!callbackUrl.searchParams.has('next')) {
      callbackUrl.searchParams.set('next', '/dashboard')
    }
    return NextResponse.redirect(callbackUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
