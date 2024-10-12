"use client"

import ModeToggle from '@/components/mode-toggle'
import Link from 'next/link'

export default function DashboardTopNav() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center space-x-2">
        <Link href="/" className="font-semibold">
          <span className="text-lg font-bold"> Shot Beautifier</span>
        </Link>
      </div>
      <ModeToggle />
    </header>
  )
}
