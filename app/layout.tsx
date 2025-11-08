import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '???? | Private Daily',
  description: '??????????????????',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="container py-8">
          <h1 className="mb-6 text-2xl font-semibold">????</h1>
          {children}
        </div>
      </body>
    </html>
  )
}
