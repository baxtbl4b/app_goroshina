"use client"

import { useState, useEffect } from "react"
import { fetchTires } from "@/app/actions"
import type { Tire, Season } from "@/lib/api-types"
import { useSearchParams } from "next/navigation"

interface TireResultsProps {
  season: Season
}

export default function TireResults({ season }: TireResultsProps) {
  const [tires, setTires] = useState<Tire[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  // Извлекаем параметры фильтров из URL
  const widthFilter = searchParams.get("width")
  const profileFilter = searchParams.get("profile") || searchParams.get("height")
  const diameterFilter = searchParams.get("diameter") || searchParams.get("diam")

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    async function loadTires() {
      try {
        // Создаем объект с параметрами фильтрации
        const filters: Record<string, any> = { season }

        // Добавляем параметры размера, если они указаны
        if (widthFilter) filters.width = widthFilter
        if (profileFilter) filters.height = profileFilter
        if (diameterFilter) filters.diam = diameterFilter

        // Используем Server Action для загрузки данных
        const data = await fetchTires(filters)

        if (isMounted) {
          setTires(data)
        }
      } catch (err) {
        console.error("Error loading tires:", err)
        if (isMounted) {
          setError("Произошла ошибка при загрузке данных")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadTires()

    return () => {
      isMounted = false
    }
  }, [season, widthFilter, profileFilter, diameterFilter])

  // Остальной код компонента...
}
