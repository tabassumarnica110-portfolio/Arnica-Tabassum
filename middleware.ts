// middleware.ts - project er root e rakhbe
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// optional - kon route e cholbe
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
