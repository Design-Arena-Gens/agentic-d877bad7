"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include'
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || '????')
      }
      router.push('/')
    } catch (err: any) {
      setError(err.message || '????')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm">
      <form onSubmit={onSubmit} className="card p-6 space-y-4">
        <div>
          <label className="label">????</label>
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="??????" required />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button disabled={loading} className="btn w-full" type="submit">{loading ? '????' : '??'}</button>
      </form>
      <p className="mt-4 text-sm text-gray-500">?????????????????????</p>
    </div>
  )
}
