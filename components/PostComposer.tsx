"use client"

import { useMemo, useState } from 'react'
import Image from 'next/image'
import type { Post } from '@/lib/types'

export default function PostComposer({ onPosted, existingPosts }: { onPosted: () => void, existingPosts: Post[] }) {
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const todayKey = useMemo(() => {
    const d = new Date()
    const y = d.getFullYear()
    const m = `${d.getMonth() + 1}`.padStart(2, '0')
    const day = `${d.getDate()}`.padStart(2, '0')
    return `${y}-${m}-${day}`
  }, [])

  const alreadyPostedToday = existingPosts?.some(p => p.dateKey === todayKey)

  const disabled = uploading || alreadyPostedToday

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      setUploading(true)
      let imageUrls: string[] = []
      if (files.length > 0) {
        const fd = new FormData()
        for (const file of files) fd.append('file', file)
        const upRes = await fetch('/api/upload', { method: 'POST', body: fd })
        if (!upRes.ok) {
          const j = await upRes.json().catch(() => ({}))
          throw new Error(j?.error || '??????')
        }
        const j = await upRes.json()
        imageUrls = j.urls || []
      }
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, images: imageUrls }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || '????')
      }
      setContent('')
      setFiles([])
      onPosted()
    } catch (err: any) {
      setError(err.message || '????')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 space-y-3">
      {alreadyPostedToday && (
        <div className="text-sm text-green-700">??????????????????? ?</div>
      )}
      <textarea
        className="textarea min-h-28"
        placeholder="????????"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={disabled}
      />
      <div>
        <label className="label">???????????9??</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const f = Array.from(e.target.files || [])
            const limited = f.slice(0, 9)
            setFiles(limited)
          }}
          disabled={disabled}
        />
      </div>
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {files.map((f, i) => {
            const url = URL.createObjectURL(f)
            return (
              <div key={i} className="relative aspect-square overflow-hidden rounded-md border">
                <Image src={url} alt={`????${i+1}`} fill className="object-cover" onLoad={() => URL.revokeObjectURL(url)} />
              </div>
            )
          })}
        </div>
      )}
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="flex justify-end">
        <button className="btn" disabled={disabled || (!content && files.length === 0)} type="submit">
          {uploading ? '????' : '??'}
        </button>
      </div>
    </form>
  )
}
