import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const COOKIE_NAME = 'pdj_session'

export async function verifyPassword(input: string): Promise<boolean> {
  const hash = process.env.ACCESS_PASSWORD_BCRYPT
  const plain = process.env.ACCESS_PASSWORD
  if (hash) {
    try {
      return await bcrypt.compare(input, hash)
    } catch {
      return false
    }
  }
  if (plain) {
    return input === plain
  }
  return false
}

export type Session = { ok: true, sub: 'user' } | { ok: false }

export async function createSessionCookie(): Promise<string> {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET not set')
  const token = await new SignJWT({ sub: 'user' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(new TextEncoder().encode(secret))
  return token
}

export async function readSession(): Promise<Session> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return { ok: false }
    const secret = process.env.AUTH_SECRET
    if (!secret) return { ok: false }
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
    if (payload.sub === 'user') return { ok: true, sub: 'user' }
    return { ok: false }
  } catch {
    return { ok: false }
  }
}

export const sessionCookieOptions = {
  name: COOKIE_NAME,
  httpOnly: true as const,
  sameSite: 'lax' as const,
  secure: true as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
}
