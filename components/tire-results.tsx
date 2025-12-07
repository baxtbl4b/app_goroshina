"use client"

import { useState, useEffect, useMemo } from "react"
import { Loader2, AlertTriangle } from "lucide-react"
import TireCard from "@/components/tire-card"
import { getTires, type Tire, type Season } from "@/lib/api"
import { useSearchParams } from "next/navigation"

interface TireResultsProps {
  season: Season
  selectedBrands?: string[]
}

export default function TireResults({ season, selectedBrands = [] }: TireResultsProps) {
  const [tires, setTires] = useState<Tire[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [sortOrder, setSortOrder] = useState<"price-asc" | "price-desc">("price-desc")
  const searchParams = useSearchParams()

  // Извлекаем параметры фильтров из URL
  const widthFilter = searchParams.get("width")
  const profileFilter = searchParams.get("profile") || searchParams.get("height")
  const diameterFilter = searchParams.get("diameter") || searchParams.get("diam")
  const brandFilter = searchParams.get("brand")
  const spikeFilter = searchParams.get("spike") // Добавляем извлечение параметра spike
  const runflatFilter = searchParams.get("runflat") // Добавляем извлечение параметра runflat
  const cargoFilter = searchParams.get("cargo") // Добавляем извлечение параметра cargo
  const todayFilter = searchParams.get("today") // Добавляем извлечение параметра today
  const minStockFilter = searchParams.get("minStock") // Добавляем извлечение параметра minStock

  // Создаем мемоизированный объект фильтров
  const filters = useMemo(() => {
    const result: Record<string, any> = { season }

    if (widthFilter) result.width = widthFilter
    if (profileFilter) result.height = profileFilter
    if (diameterFilter) result.diam = diameterFilter
    if (brandFilter) result.brand = brandFilter

    // Добавляем параметр spike в фильтры, если он присутствует в URL
    if (spikeFilter !== null) {
      result.spike = spikeFilter === "true" // Преобразуем строку в булево значение
    }

    // Добавляем параметр runflat в фильтры, если он присутствует в URL
    if (runflatFilter !== null) {
      result.runflat = runflatFilter === "true" // Преобразуем строку в булево значение
    }

    // Добавляем параметр cargo в фильтры, если он присутствует в URL
    if (cargoFilter !== null) {
      result.cargo = cargoFilter === "true" // Преобразуем строку в булево значение
    }

    return result
  }, [season, widthFilter, profileFilter, diameterFilter, brandFilter, spikeFilter, runflatFilter, cargoFilter])

  // Создаем строку запроса API для отображения - перемещаем этот хук выше условных возвратов
  const apiRequestUrl = useMemo(() => {
    const apiParams = new URLSearchParams()

    // Добавляем все параметры из фильтров
    Object.entries(filters).forEach(([key, value]) => {
      apiParams.append(key, String(value))
    })

    return `/api/tires?${apiParams.toString()}`
  }, [filters])

  // Применяем клиентские фильтры
  const filteredTires = useMemo(() => {
    let result = tires

    // Фильтр "Сегодня" - только товары с provider === "tireshop"
    if (todayFilter === "true") {
      result = result.filter((tire) => tire.provider?.toLowerCase() === "tireshop")
    }

    // Фильтр минимального количества на складе
    if (minStockFilter === "4") {
      result = result.filter((tire) => (tire.stock || 0) >= 4)
    }

    // Фильтр по брендам
    if (selectedBrands.length > 0) {
      result = result.filter((tire) => {
        const tireBrand = tire.model?.brand?.name || tire.brand
        return selectedBrands.some(brand =>
          tireBrand?.toLowerCase() === brand.toLowerCase()
        )
      })
    }

    // Сортировка по цене
    result = [...result].sort((a, b) => {
      const priceA = a.price || 0
      const priceB = b.price || 0
      return sortOrder === "price-asc" ? priceA - priceB : priceB - priceA
    })

    return result
  }, [tires, todayFilter, minStockFilter, selectedBrands, sortOrder])

  // Слушаем событие сортировки
  useEffect(() => {
    const handleSorting = (event: CustomEvent) => {
      const { value } = event.detail
      if (value === "price-asc" || value === "price-desc") {
        setSortOrder(value)
      }
    }

    window.addEventListener("applySorting", handleSorting as EventListener)
    return () => {
      window.removeEventListener("applySorting", handleSorting as EventListener)
    }
  }, [])

  // Функция для повторной загрузки данных
  const retryLoading = () => {
    setRetryCount((prev) => prev + 1)
    setLoading(true)
    setError(null)
  }

  // Загружаем шины для выбранного сезона и размера
  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    async function loadTires() {
      try {
        // Загружаем шины с учетом параметров фильтрации
        console.log("Loading tires with filters:", filters)

        // Add a timeout to prevent infinite loading
        const timeoutPromise = new Promise<Tire[]>((_, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), 10000)
        })

        // Race between the actual request and the timeout
        const data = await Promise.race([getTires(filters), timeoutPromise])

        if (isMounted) {
          console.log(`Loaded ${data.length} tires`)
          setTires(data)
        }
      } catch (err) {
        console.error("Error loading tires:", err)
        if (isMounted) {
          setError("Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    // Добавляем обработку ошибок при загрузке данных
    loadTires().catch((err) => {
      console.error("Unhandled error in loadTires:", err)
      if (isMounted) {
        setError("Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.")
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [filters, retryCount])

  // Функция для определения цвета фона
  const calculateGradientColors = () => {
    if (tires.length === 0) return "bg-white dark:bg-[#2A2A2A]"

    // Find min and max prices
    const prices = tires.map((tire) => tire.price || 0)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    // Calculate average price
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length

    // Determine background color based on price range
    if (maxPrice - minPrice < 1000) {
      // Small price range
      return "bg-[#d7e058] dark:bg-[#d7e058]/20"
    } else if (avgPrice < 5000) {
      // Lower average price
      return "bg-[#2d8df1] dark:bg-[#2d8df1]/20"
    } else if (avgPrice < 10000) {
      // Medium average price
      return "bg-[#c2e810] dark:bg-[#c2e810]/20"
    } else if (avgPrice < 15000) {
      // Higher average price
      return "bg-[#1f1f1f] dark:bg-[#1f1f1f]/70 text-white"
    } else {
      // Premium price range
      return "bg-[#2d8df1] dark:bg-[#2d8df1]/30"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 mt-8">
        <Loader2 className="h-8 w-8 text-[#009CFF] animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-8 text-center mt-8">
        <div className="flex flex-col items-center gap-4">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
          <p className="text-red-500">{error}</p>
          <button
            onClick={retryLoading}
            className="mt-4 px-4 py-2 bg-[#009CFF] text-white rounded-md hover:bg-[#0084D6] transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  if (filteredTires.length === 0) {
    return (
      <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-8 text-center mt-8">
        <h3 className="text-xl font-bold mb-2 text-[#1F1F1F] dark:text-white">Шины не найдены</h3>
        <p className="text-[#1F1F1F] dark:text-white mb-4">
          По вашему запросу ничего не найдено. Попробуйте изменить параметры фильтрации.
        </p>
        <div className="flex justify-center">
          <button
            onClick={retryLoading}
            className="px-4 py-2 bg-[#009CFF] text-white rounded-md hover:bg-[#0084D6] transition-colors"
          >
            Попробовать сно��а
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="space-y-3 pb-[180px]"
      aria-label="Результаты поиска шин"
      data-testid="tire-results-container"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2 md:gap-2.5">
        {filteredTires.map((tire) => (
          <TireCard key={tire.id} tire={tire} />
        ))}
      </div>
    </div>
  )
}
