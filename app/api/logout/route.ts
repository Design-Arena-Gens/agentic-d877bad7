import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sessionCookieOptions } from '@/lib/auth'

export async function POST() {
  ;(await cookies()).set({
    name: sessionCookieOptions.name,
    value: '',
    httpOnly: sessionCookieOptions.httpOnly,
    sameSite: sessionCookieOptions.sameSite,
    secure: sessionCookieOptions.secure,
    path: sessionCookieOptions.path,
    maxAge: 0,
  })
  return NextResponse.json({ ok: true })
}
