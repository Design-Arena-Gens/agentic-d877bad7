import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSessionCookie, sessionCookieOptions, verifyPassword } from '@/lib/auth'

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: '' }))
  const ok = await verifyPassword(password)
  if (!ok) {
    return NextResponse.json({ error: '?????' }, { status: 401 })
  }
  const token = await createSessionCookie()
  const res = NextResponse.json({ ok: true })
  ;(await cookies()).set({
    name: sessionCookieOptions.name,
    value: token,
    httpOnly: sessionCookieOptions.httpOnly,
    sameSite: sessionCookieOptions.sameSite,
    secure: sessionCookieOptions.secure,
    path: sessionCookieOptions.path,
    maxAge: sessionCookieOptions.maxAge,
  })
  return res
}
