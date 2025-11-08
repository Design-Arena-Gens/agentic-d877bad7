import { NextResponse } from 'next/server'
import { listPosts, savePost, generateDateKey } from '@/lib/blob'
import { Post } from '@/lib/types'

export async function GET() {
  const posts = await listPosts()
  return NextResponse.json({ posts })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  const content = String(body.content || '').trim()
  const images = Array.isArray(body.images) ? body.images.filter((u: any) => typeof u === 'string') : []
  if (!content && images.length === 0) {
    return NextResponse.json({ error: '???????????' }, { status: 400 })
  }
  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()
  const dateKey = await generateDateKey(new Date())
  const post: Post = { id, content, images, createdAt, dateKey }
  await savePost(post)
  return NextResponse.json({ post })
}
