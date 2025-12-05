"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface ClientWindowHandlerProps {
  onUrlParamsChange?: (params: URLSearchParams) => void
  onStorageDataLoad?: (data: any) => void
}

export default function ClientWindowHandler({ onUrlParamsChange, onStorageDataLoad }: ClientWindowHandlerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  // Безопасная проверка монтирования компонента
  useEffect(() => {
    setMounted(true)
  }, [])

  // Обработка URL параметров
  useEffect(() => {
    if (mounted && onUrlParamsChange) {
      onUrlParamsChange(searchParams)
    }
  }, [mounted, searchParams, onUrlParamsChange])

  // Обработка localStorage
  useEffect(() => {
    if (mounted && onStorageDataLoad) {
      try {
        const paintingData = localStorage.getItem("paintingBookingData")
        const soundproofingData = localStorage.getItem("soundproofingData")

        onStorageDataLoad({
          paintingData: paintingData ? JSON.parse(paintingData) : null,
          soundproofingData: soundproofingData ? JSON.parse(soundproofingData) : null,
        })
      } catch (error) {
        console.error("Error loading storage data:", error)
      }
    }
  }, [mounted, onStorageDataLoad])

  // Безопасная навигация
  const safeNavigate = (url: string) => {
    if (mounted) {
      router.push(url)
    }
  }

  // Безопасная работа с localStorage
  const safeSetStorage = (key: string, value: any) => {
    if (mounted && typeof window !== "undefined") {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    }
  }

  if (!mounted) {
    return null // Не рендерим ничего до монтирования
  }

  return null // Этот компонент только для логики
}
