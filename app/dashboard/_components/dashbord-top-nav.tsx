"use client"

import ModeToggle from '@/components/mode-toggle'
import Link from 'next/link'

export default function DashboardTopNav() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <Link href="/" className="font-semibold">
        Nextjs Starter Kit
      </Link>
      <ModeToggle />
    </header>
  )
}
