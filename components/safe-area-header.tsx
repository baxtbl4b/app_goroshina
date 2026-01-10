"use client"

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

interface SafeAreaHeaderProps {
  title?: string
  showBackButton?: boolean
  children?: ReactNode
  className?: string
}

export function SafeAreaHeader({ title, showBackButton = false, children, className = "" }: SafeAreaHeaderProps) {
  const router = useRouter()

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white px-4 flex items-center justify-between h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] shadow-sm ${className}`}
    >
      <div className="flex items-center">
        {showBackButton && (
          <button onClick={() => router.back()} className="mr-3" aria-label="Go back">
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        {title && <h1 className="text-xl font-bold">{title}</h1>}
      </div>
      {children}
    </header>
  )
}

export default SafeAreaHeader
