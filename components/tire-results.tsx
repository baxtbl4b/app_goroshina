"use client"

import { useState, useEffect, useMemo } from "react"
import { Loader2, AlertTriangle } from "lucide-react"
import TireCard from "@/components/tire-card"
import { getTires, type Tire, type Season } from "@/lib/api"
import { useSearchParams } from "next/navigation"

// Interface for tire pair (front and rear axle)
interface TirePair {
  frontTire: Tire
  rearTire: Tire
  brandModel: string
}

interface TireResultsProps {
  season: Season
  selectedBrands?: string[]
}

export default function TireResults({ season, selectedBrands = [] }: TireResultsProps) {
  const [tires, setTires] = useState<Tire[]>([])
  const [rearAxisTires, setRearAxisTires] = useState<Tire[]>([]) // Tires for second axis
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
  const minPriceFilter = searchParams.get("minPrice") // Добавляем извлечение параметра minPrice
  const maxPriceFilter = searchParams.get("maxPrice") // Добавляем извлечение параметра maxPrice

  // Second axis parameters
  const secondAxisEnabled = searchParams.get("secondAxis") === "true"
  const width2Filter = searchParams.get("width2")
  const profile2Filter = searchParams.get("profile2") || searchParams.get("height2")
  const diameter2Filter = searchParams.get("diameter2") || searchParams.get("diam2")

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

  // Фильтры для второй оси
  const filters2 = useMemo(() => {
    if (!secondAxisEnabled || !width2Filter || !profile2Filter || !diameter2Filter) {
      return null
    }

    const result: Record<string, any> = { season }

    result.width = width2Filter
    result.height = profile2Filter
    result.diam = diameter2Filter

    // Копируем остальные фильтры
    if (spikeFilter !== null) {
      result.spike = spikeFilter === "true"
    }
    if (runflatFilter !== null) {
      result.runflat = runflatFilter === "true"
    }
    if (cargoFilter !== null) {
      result.cargo = cargoFilter === "true"
    }

    return result
  }, [season, secondAxisEnabled, width2Filter, profile2Filter, diameter2Filter, spikeFilter, runflatFilter, cargoFilter])

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
    console.log(`[TireResults] Starting with ${result.length} tires`)

    // Фильтр "Сегодня" - только товары с provider === "tireshop"
    if (todayFilter === "true") {
      result = result.filter((tire) => tire.provider?.toLowerCase() === "tireshop")
      console.log(`[TireResults] After today filter: ${result.length} tires`)
    }

    // Фильтр минимального количества на складе
    if (minStockFilter === "4") {
      result = result.filter((tire) => (tire.stock || 0) >= 4)
      console.log(`[TireResults] After minStock filter: ${result.length} tires`)
    }

    // Фильтр по брендам
    if (selectedBrands.length > 0) {
      console.log(`[TireResults] Applying brand filter:`, selectedBrands)
      result = result.filter((tire) => {
        const tireBrand = tire.model?.brand?.name || tire.brand
        return selectedBrands.some(brand =>
          tireBrand?.toLowerCase() === brand.toLowerCase()
        )
      })
      console.log(`[TireResults] After brand filter: ${result.length} tires`)
    }

    // Фильтр по минимальной цене
    if (minPriceFilter) {
      const minPrice = parseInt(minPriceFilter)
      result = result.filter((tire) => (tire.price || 0) >= minPrice)
      console.log(`[TireResults] After minPrice filter: ${result.length} tires`)
    }

    // Фильтр по максимальной цене
    if (maxPriceFilter) {
      const maxPrice = parseInt(maxPriceFilter)
      result = result.filter((tire) => (tire.price || 0) <= maxPrice)
      console.log(`[TireResults] After maxPrice filter: ${result.length} tires`)
    }

    // Сортировка по цене
    result = [...result].sort((a, b) => {
      const priceA = a.price || 0
      const priceB = b.price || 0
      return sortOrder === "price-asc" ? priceA - priceB : priceB - priceA
    })

    return result
  }, [tires, todayFilter, minStockFilter, minPriceFilter, maxPriceFilter, selectedBrands, sortOrder])

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
        console.log("Second axis filters:", filters2)

        // Add a timeout to prevent infinite loading
        const timeoutPromise = new Promise<Tire[]>((_, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), 10000)
        })

        // Race between the actual request and the timeout
        const data = await Promise.race([getTires(filters), timeoutPromise])

        if (isMounted) {
          console.log(`Loaded ${data.length} tires for front axis`)
          setTires(data)
        }

        // Load rear axis tires if second axis is enabled
        if (filters2 && isMounted) {
          const rearData = await Promise.race([getTires(filters2), timeoutPromise])
          if (isMounted) {
            console.log(`Loaded ${rearData.length} tires for rear axis`)
            setRearAxisTires(rearData)
          }
        } else {
          setRearAxisTires([])
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
  }, [filters, filters2, retryCount])

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

  // Helper function to get brand+model key for grouping
  const getBrandModelKey = (tire: Tire): string => {
    let brand = tire.brand || ""
    let model = ""

    // Handle model field which can be string or object
    if (typeof tire.model === "string") {
      model = tire.model
    } else if (tire.model && typeof tire.model === "object") {
      const modelObj = tire.model as any
      model = modelObj.name || ""
      if (!brand && modelObj.brand) {
        brand = typeof modelObj.brand === "string" ? modelObj.brand : modelObj.brand?.name || ""
      }
    }

    return `${brand.toLowerCase()}_${model.toLowerCase()}`
  }

  // Group tires by brand+model for second axis matching
  const tirePairs = useMemo((): TirePair[] => {
    if (!secondAxisEnabled || !filters2 || rearAxisTires.length === 0) {
      return []
    }

    const pairs: TirePair[] = []

    // Create a map of rear axis tires by brand+model
    const rearTiresMap = new Map<string, Tire[]>()
    rearAxisTires.forEach((tire) => {
      const key = getBrandModelKey(tire)
      if (!rearTiresMap.has(key)) {
        rearTiresMap.set(key, [])
      }
      rearTiresMap.get(key)!.push(tire)
    })

    // Match front axis tires with rear axis tires by brand+model
    filteredTires.forEach((frontTire) => {
      const key = getBrandModelKey(frontTire)
      const matchingRearTires = rearTiresMap.get(key)

      if (matchingRearTires && matchingRearTires.length > 0) {
        // Find best matching rear tire (same brand, model)
        const rearTire = matchingRearTires[0]
        pairs.push({
          frontTire,
          rearTire,
          brandModel: key,
        })
        // Remove used rear tire to avoid duplicates
        matchingRearTires.shift()
      }
    })

    console.log(`Found ${pairs.length} matching tire pairs`)
    return pairs
  }, [filteredTires, rearAxisTires, secondAxisEnabled, filters2])

  // Check if we should show paired view
  const showPairedView = secondAxisEnabled && filters2 && width2Filter && profile2Filter && diameter2Filter

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

  // Show message when second axis is enabled but no pairs found
  if (showPairedView && tirePairs.length === 0 && filteredTires.length > 0) {
    return (
      <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-8 text-center mt-8">
        <h3 className="text-xl font-bold mb-2 text-[#1F1F1F] dark:text-white">Пары шин не найдены</h3>
        <p className="text-[#1F1F1F] dark:text-white mb-4">
          Не удалось найти шины с одинаковым брендом и моделью для обоих размеров.
          <br />
          Попробуйте изменить размеры осей.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Передняя ось: {widthFilter}/{profileFilter} R{diameterFilter}
          <br />
          Задняя ось: {width2Filter}/{profile2Filter} R{diameter2Filter}
        </p>
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
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  // Render paired view when second axis is enabled
  if (showPairedView && tirePairs.length > 0) {
    return (
      <div
        className="space-y-4 pb-[180px]"
        aria-label="Результаты поиска шин - разноширокие пары"
        data-testid="tire-results-container"
      >
        {/* Header showing pair count */}
        <div className="bg-[#D3DF3D]/20 dark:bg-[#D3DF3D]/10 rounded-xl p-3 flex items-center justify-between">
          <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">
            Найдено пар: {tirePairs.length}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {widthFilter}/{profileFilter} R{diameterFilter} + {width2Filter}/{profile2Filter} R{diameter2Filter}
          </span>
        </div>

        {/* Tire pairs */}
        {tirePairs.map((pair, index) => (
          <div
            key={`pair-${index}-${pair.frontTire.id}-${pair.rearTire.id}`}
            className="bg-gray-100 dark:bg-[#333333] rounded-xl p-2 space-y-2"
          >
            {/* Pair header */}
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {pair.frontTire.brand} {typeof pair.frontTire.model === "string" ? pair.frontTire.model : (pair.frontTire.model as any)?.name || ""}
              </span>
              <span className="text-xs bg-[#D3DF3D] text-[#1F1F1F] px-2 py-0.5 rounded-full">
                Пара #{index + 1}
              </span>
            </div>

            {/* Front axis tire - labeled */}
            <div className="relative">
              <div className="absolute left-2 top-2 z-10 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                Передняя ось
              </div>
              <TireCard tire={pair.frontTire} />
            </div>

            {/* Rear axis tire - labeled */}
            <div className="relative">
              <div className="absolute left-2 top-2 z-10 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                Задняя ось
              </div>
              <TireCard tire={pair.rearTire} />
            </div>

            {/* Combined price */}
            <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-[#2A2A2A] rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Комплект (4 шт):</span>
              <span className="text-lg font-bold text-[#1F1F1F] dark:text-white">
                {((pair.frontTire.price || 0) * 2 + (pair.rearTire.price || 0) * 2).toLocaleString()} ₽
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Default view - single axis
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
