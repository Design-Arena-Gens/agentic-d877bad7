"use client"

import Image from 'next/image'
import type { Post } from '@/lib/types'

export default function PostList({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) {
    return <div className="text-sm text-gray-500">??????????????</div>
  }
  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <article key={p.id} className="card p-4">
          <div className="mb-2 text-xs text-gray-500">{formatDateTime(p.createdAt)}</div>
          {p.content && <div className="whitespace-pre-wrap text-[15px] leading-relaxed">{p.content}</div>}
          {p.images?.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {p.images.map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-md border">
                  <Image src={src} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  const hh = `${d.getHours()}`.padStart(2, '0')
  const mm = `${d.getMinutes()}`.padStart(2, '0')
  return `${y}-${m}-${day} ${hh}:${mm}`
}
