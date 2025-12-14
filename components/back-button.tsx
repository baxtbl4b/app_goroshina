"use client"

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  className?: string
}

export function BackButton({ className = "" }: BackButtonProps) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className={`p-2 transition-colors ${className}`}
      aria-label="Назад"
    >
      <ChevronLeft className="h-6 w-6 text-gray-300" />
    </button>
  )
}
