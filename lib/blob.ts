import { put, list, del } from '@vercel/blob'
import { Post } from './types'

const POSTS_PREFIX = 'posts/'

export async function savePost(post: Post) {
  const key = `${POSTS_PREFIX}${post.id}.json`
  await put(key, JSON.stringify(post, null, 2), {
    access: 'public',
    contentType: 'application/json; charset=utf-8',
  })
}

export async function deletePost(id: string) {
  const key = `${POSTS_PREFIX}${id}.json`
  await del(key)
}

export async function listPosts(): Promise<Post[]> {
  const { blobs } = await list({ prefix: POSTS_PREFIX })
  const items = blobs.filter(b => b.pathname.endsWith('.json'))
  const posts: Post[] = []
  for (const b of items) {
    try {
      const res = await fetch(b.url, { cache: 'no-store' })
      if (!res.ok) continue
      const json = await res.json()
      posts.push(json as Post)
    } catch {
      // ignore bad json
    }
  }
  posts.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  return posts
}

export async function generateDateKey(date = new Date()) {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}
