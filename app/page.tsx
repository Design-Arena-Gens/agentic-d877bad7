"use client"

import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import PostComposer from '@/components/PostComposer'
import PostList from '@/components/PostList'

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json())

export default function HomePage() {
  const router = useRouter()
  const { data, mutate } = useSWR('/api/posts', fetcher)

  const posts = data?.posts ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-gray-600">?????????????????</div>
        <button className="text-sm text-gray-500 hover:underline" onClick={async () => {
          await fetch('/api/logout', { method: 'POST', credentials: 'include' })
          router.push('/login')
        }}>??</button>
      </div>
      <PostComposer onPosted={() => mutate()} existingPosts={posts} />
      <PostList posts={posts} />
    </div>
  )
}
