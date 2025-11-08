import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  const files = form.getAll('file').filter((f): f is File => f instanceof File)
  if (files.length === 0) return NextResponse.json({ error: 'No files' }, { status: 400 })
  const urls: string[] = []
  for (const f of files) {
    const key = `images/${crypto.randomUUID()}-${sanitizeFileName(f.name || 'image')}`
    const blob = await put(key, f, { access: 'public', contentType: f.type || 'application/octet-stream' })
    urls.push(blob.url)
  }
  return NextResponse.json({ urls })
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9\._-]/g, '_')
}
