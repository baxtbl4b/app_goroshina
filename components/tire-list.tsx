"use client"

import { useState, useEffect } from "react"
import TireCard from "@/components/tire-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Tire } from "@/lib/api"

interface TireListProps {
  filters: Record<string, string>
}

export default function TireList({ filters }: TireListProps) {
  const [tires, setTires] = useState<Tire[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filteredTires, setFilteredTires] = useState<Tire[]>([])

  // Функция для получения шин с API
  const fetchTires = async (pageNum: number, isNewFilter = false) => {
    setLoading(true)
    setError(null)

    try {
      // Создаем строку запроса из фильтров
      const queryParams = new URLSearchParams()

      // Добавляем все фильтры в запрос
      Object.entries(filters).forEach(([key, value]) => {
        queryParams.append(key, value)
      })

      // Добавляем номер страницы
      queryParams.append("page", pageNum.toString())

      // Выполняем з��прос к API
      const response = await fetch(`/api/tires?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error(`Ошибка при получении данных: ${response.status}`)
      }

      const data = await response.json()

      // Если данные пустые или их меньше ожидаемого, значит больше нет страниц
      if (!data.data || data.data.length === 0) {
        setHasMore(false)
        if (isNewFilter) {
          setTires([])
        }
        return
      }

      // Обновляем список шин
      if (isNewFilter) {
        setTires(data.data)
      } else {
        setTires((prev) => [...prev, ...data.data])
      }
    } catch (err) {
      console.error("Ошибка при получении данных:", err)
      setError(err.message || "Произошла ошибка при получении данных")
    } finally {
      setLoading(false)
    }
  }

  // Загружаем шины при изменении фильтров
  useEffect(() => {
    setPage(1)
    setHasMore(true)
    fetchTires(1, true)
  }, [filters])

  // Применяем дополнительную клиентскую фильтрацию для параметров spike и cargo
  useEffect(() => {
    if (tires.length === 0) {
      setFilteredTires([])
      return
    }

    // Создаем копию массива шин для фильтрации
    let filtered = [...tires]

    // Проверяем наличие параметра spike в фильтрах
    if (filters.spike === "true") {
      console.log("Применяем фильтр шипованных шин: показываем только шипованные шины")
      // Фильтруем только шины с spike=true
      filtered = filtered.filter((tire) => {
        console.log(`Tire ID: ${tire.id}, Spike value:`, tire.spike)
        return tire.spike === true
      })
    } else if (filters.spike === "false") {
      // Показываем только нешипованные шины (spike=false)
      filtered = filtered.filter((tire) => tire.spike === false)
    }

    // Проверяем наличие параметра cargo в фильтрах
    if (filters.cargo === "true") {
      console.log("Применяем фильтр грузовых шин: показываем только грузовые шины")
      // Фильтруем только шины с cargo=true
      filtered = filtered.filter((tire) => {
        console.log(`Tire ID: ${tire.id}, Cargo value:`, tire.cargo)
        // Проверяем все возможные значения, которые могут означать "true"
        return tire.cargo === true || tire.cargo === 1 || tire.cargo === "1" || tire.cargo === "true"
      })
    }

    // Добавим отладочную информацию
    console.log(`Отфильтровано ${filtered.length} шин из ${tires.length}`)
    console.log("Текущие фильтры:", filters)

    setFilteredTires(filtered)
  }, [tires, filters])

  // Функция для загрузки следующей страницы
  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchTires(nextPage)
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Индикатор активного фильтра шипованных шин */}
      {filters.spike === "true" && !loading && (
        <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-sm text-blue-800 dark:text-blue-400">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Отображаются только шипованные шин��</span>
          </div>
        </div>
      )}
      {/* Индикатор активного фильтра грузовых шин */}
      {filters.cargo === "true" && !loading && (
        <div className="mb-4 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded text-sm text-amber-800 dark:text-amber-400">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Отображаются только грузовые шины</span>
          </div>
        </div>
      )}

      {loading && page === 1 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px] rounded-xl" />
          ))}
        </div>
      ) : filteredTires.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTires.map((tire) => (
              <TireCard key={tire.id} tire={tire} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button onClick={loadMore} disabled={loading} className="bg-[#1F1F1F] hover:bg-[#1F1F1F]/90 text-white">
                {loading ? "Загрузка..." : "Показать еще"}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2 text-[#1F1F1F] dark:text-white">Шины не найдены</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Попробуйте изменить параметры фильтра или выбрать другую категорию.
          </p>
        </div>
      )}
    </div>
  )
}
