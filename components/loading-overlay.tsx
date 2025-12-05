"use client"

import { Loader2 } from "lucide-react"

export function LoadingOverlay() {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center
                 bg-white/70 dark:bg-black/70"
      aria-label="Загрузка"
    >
      <Loader2 className="h-6 w-6 animate-spin text-gray-800 dark:text-gray-200" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
