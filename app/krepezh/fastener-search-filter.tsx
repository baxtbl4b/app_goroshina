"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

interface FastenerSearchFilterProps {
  fastenerType?: string
  fasteners?: any[]
}

export function FastenerSearchFilter({ fastenerType = "nut", fasteners = [] }: FastenerSearchFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [thread, setThread] = useState<string>(searchParams.get("thread") || "")
  const [shape, setShape] = useState<string>(searchParams.get("shape") || "")
  const [color, setColor] = useState<string>(searchParams.get("color") || "")

  // Add state for filter collapse
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false)
  const [isFilterVisible, setIsFilterVisible] = useState(true)
  const filterRef = useRef<HTMLDivElement>(null)

  // Touch handling states
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [touchEndY, setTouchEndY] = useState<number | null>(null)
  const [handleTouchStartY, setHandleTouchStartY] = useState<number | null>(null)
  const [isHandleHighlighted, setIsHandleHighlighted] = useState(false)
  const handleHighlightTimeout = useRef<NodeJS.Timeout | null>(null)

  // Function to highlight handle
  const highlightHandle = () => {
    setIsHandleHighlighted(true)
    if (handleHighlightTimeout.current) {
      clearTimeout(handleHighlightTimeout.current)
    }
    handleHighlightTimeout.current = setTimeout(() => {
      setIsHandleHighlighted(false)
    }, 1000)
  }

  // Определяем категорию по типу крепежа
  const categoryMap: Record<string, string> = {
    nut: "Гайки",
    bolt: "Болты",
  }

  // Динамически извлекаем уникальные опции из данных каталога
  const threadOptions = useMemo(() => {
    const expectedCategory = categoryMap[fastenerType]
    const threads = new Set<string>()

    fasteners.forEach((fastener: any) => {
      if (fastener.category?.name === expectedCategory) {
        if (fastener.params?.diameter && fastener.params?.step) {
          threads.add(`${fastener.params.diameter}x${fastener.params.step}`)
        }
      }
    })

    return Array.from(threads).sort()
  }, [fasteners, fastenerType])

  // Динамически извлекаем уникальные формы из данных каталога
  const shapeOptions = useMemo(() => {
    const expectedCategory = categoryMap[fastenerType]
    const shapes = new Set<string>()

    fasteners.forEach((fastener: any) => {
      if (fastener.category?.name === expectedCategory) {
        if (fastener.params?.form) {
          shapes.add(fastener.params.form)
        }
      }
    })

    return Array.from(shapes).sort()
  }, [fasteners, fastenerType])

  // Динамически извлекаем уникальные цвета из данных каталога
  const colorOptions = useMemo(() => {
    const expectedCategory = categoryMap[fastenerType]
    const colors = new Set<string>()

    fasteners.forEach((fastener: any) => {
      if (fastener.category?.name === expectedCategory) {
        if (fastener.params?.color) {
          colors.add(fastener.params.color)
        }
      }
    })

    return Array.from(colors).sort()
  }, [fasteners, fastenerType])

  // Синхронизация состояния с URL параметрами
  useEffect(() => {
    setThread(searchParams.get("thread") || "")
    setShape(searchParams.get("shape") || "")
    setColor(searchParams.get("color") || "")
  }, [searchParams])

  // Add Intersection Observer to detect when filter scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFilterVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }, // Trigger when 10% of the element is visible
    )

    if (filterRef.current) {
      observer.observe(filterRef.current)
    }

    return () => {
      if (filterRef.current) {
        observer.unobserve(filterRef.current)
      }
    }
  }, [])

  // Обработчик изменения резьбы
  const handleThreadChange = (value: string) => {
    setThread(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("thread", value)
    } else {
      params.delete("thread")
    }
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  // Обработчик изменения формы
  const handleShapeChange = (value: string) => {
    setShape(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("shape", value)
    } else {
      params.delete("shape")
    }
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  // Обработчик изменения цвета
  const handleColorChange = (value: string) => {
    setColor(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("color", value)
    } else {
      params.delete("color")
    }
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  const clearAllFilters = () => {
    // Сбрасываем локальное состояние
    setThread("")
    setShape("")
    setColor("")

    // Очищаем все параметры фильтра из URL
    const params = new URLSearchParams(searchParams.toString())
    params.delete("thread")
    params.delete("shape")
    params.delete("color")

    // Обновляем URL (если параметров не осталось, используем просто путь)
    const queryString = params.toString()
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname
    router.push(newUrl)
  }

  // Function to scroll to filter
  const scrollToFilter = () => {
    if (filterRef.current) {
      filterRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Get filter title based on fastener type
  const getFilterTitle = () => {
    switch (fastenerType) {
      case "nut":
        return "Фильтр гаек"
      case "bolt":
        return "Фильтр болтов"
      case "lock":
        return "Фильтр секреток"
      default:
        return "Фильтр крепежа"
    }
  }

  return (
    <>
      {/* Floating button that appears when filter is not visible */}
      {!isFilterVisible && (
        <div className="fixed top-[120px] left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={scrollToFilter}
            className="bg-gray-200 dark:bg-gray-700 text-[#1F1F1F] dark:text-white p-2 shadow-sm flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 ease-in-out text-xs bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-full border border-gray-300 dark:border-gray-600 w-8 h-8"
            aria-label="Вернуться к фильтру"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 6H21M6 12H18M10 18H14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      <div
        ref={filterRef}
        className="px-4 pt-2 pb-8 fixed left-0 right-0 z-40 transition-all duration-300 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] bg-white dark:bg-[#2A2A2A] backdrop-blur-md"
        style={{
          bottom: '0',
          transform: isFilterCollapsed ? 'translateY(calc(100% - 56px))' : 'translateY(0)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 1) 100%)',
          maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 1) 100%)',
          touchAction: isFilterCollapsed ? 'none' : 'pan-x pinch-zoom',
          WebkitOverflowScrolling: 'touch',
        }}
        aria-label={getFilterTitle()}
        onTouchStart={(e) => {
          // When filter is collapsed - capture all touches
          if (isFilterCollapsed) {
            e.preventDefault()
            setTouchStartY(e.touches[0].clientY)
            setTouchEndY(null)
          }
        }}
        onTouchMove={(e) => {
          // When filter is collapsed - block system gestures
          if (isFilterCollapsed && touchStartY !== null) {
            e.preventDefault()
            setTouchEndY(e.touches[0].clientY)
          }
        }}
        onTouchEnd={() => {
          // Handle swipe when filter is collapsed (outside handle button)
          if (isFilterCollapsed && touchStartY !== null && touchEndY !== null) {
            const diff = touchEndY - touchStartY
            // Swipe up - expand
            if (diff < -20) {
              setIsFilterCollapsed(false)
              highlightHandle()
            }
          }
          setTouchStartY(null)
          setTouchEndY(null)
        }}
      >
        {/* Swipe handle for collapse/expand */}
        <div
          className="flex items-center justify-center -mx-4 px-4 py-3"
          style={{
            touchAction: 'none',
          }}
        >
          <button
            className="flex items-center justify-center cursor-pointer w-full group"
            style={{ touchAction: 'none' }}
            onClick={() => {
              setIsFilterCollapsed(!isFilterCollapsed)
              highlightHandle()
            }}
            onTouchStart={(e) => {
              e.preventDefault()
              setHandleTouchStartY(e.touches[0].clientY)
            }}
            onTouchMove={(e) => {
              e.preventDefault()
              if (handleTouchStartY !== null) {
                setTouchEndY(e.touches[0].clientY)
              }
            }}
            onTouchEnd={(e) => {
              e.preventDefault()

              if (handleTouchStartY !== null) {
                const endY = e.changedTouches[0].clientY
                const diff = endY - handleTouchStartY

                // Swipe threshold
                if (Math.abs(diff) > 20) {
                  // Swipe up (diff < 0)
                  if (diff < 0) {
                    if (isFilterCollapsed) {
                      setIsFilterCollapsed(false)
                      highlightHandle()
                    }
                  }
                  // Swipe down (diff > 0)
                  else {
                    if (!isFilterCollapsed) {
                      setIsFilterCollapsed(true)
                      highlightHandle()
                    }
                  }
                }

                setHandleTouchStartY(null)
                setTouchEndY(null)
              }
            }}
            aria-label={isFilterCollapsed ? "Нажмите для раскрытия фильтра" : "Нажмите для скрытия фильтра"}
            aria-expanded={!isFilterCollapsed}
          >
            <div className="flex flex-col items-center gap-1">
              <div className={`w-16 h-1.5 rounded-full transition-colors duration-300 ${isHandleHighlighted ? 'bg-[#c4d402]' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              {isFilterCollapsed && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-400 dark:text-gray-500 animate-bounce"
                >
                  <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </button>
        </div>

        {/* Filter content */}
        <div className={`transition-all duration-300 ${isFilterCollapsed ? 'hidden' : 'block'}`}>
          {/* Main filter selectors - 4 column grid (3 filters + reset button) */}
          <div className="grid grid-cols-4 gap-3">
            <div>
              <Label htmlFor="thread" className="text-xs text-[#1F1F1F] dark:text-gray-300 mb-1.5 block text-center">
                Резьба
              </Label>
              <Select value={thread} onValueChange={handleThreadChange}>
                <SelectTrigger
                  id="thread"
                  className="w-full h-10 text-xs bg-gray-100 dark:bg-[#333333] text-[#1F1F1F] dark:text-white border-0 rounded-lg pr-8"
                >
                  <SelectValue placeholder="~" />
                </SelectTrigger>
                <SelectContent>
                  {threadOptions.map((option) => (
                    <SelectItem key={option} value={option} className="text-sm">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="shape" className="text-xs text-[#1F1F1F] dark:text-gray-300 mb-1.5 block text-center">
                Форма
              </Label>
              <Select value={shape} onValueChange={handleShapeChange}>
                <SelectTrigger
                  id="shape"
                  className="w-full h-10 text-xs bg-gray-100 dark:bg-[#333333] text-[#1F1F1F] dark:text-white border-0 rounded-lg pr-8"
                >
                  <SelectValue placeholder="~" />
                </SelectTrigger>
                <SelectContent>
                  {shapeOptions.map((option) => (
                    <SelectItem key={option} value={option} className="text-sm">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="color" className="text-xs text-[#1F1F1F] dark:text-gray-300 mb-1.5 block text-center">
                Цвет
              </Label>
              <Select value={color} onValueChange={handleColorChange} disabled={colorOptions.length === 0}>
                <SelectTrigger
                  id="color"
                  className="w-full h-10 text-xs bg-gray-100 dark:bg-[#333333] text-[#1F1F1F] dark:text-white border-0 rounded-lg pr-8"
                >
                  <SelectValue placeholder="~" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option} value={option} className="text-sm">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className={`h-10 px-3 text-xs border-0 rounded-xl transition-all duration-300 ${
                  thread || shape || color
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 active:scale-95 shadow-md hover:shadow-red-500/30"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
                disabled={!thread && !shape && !color}
              >
                Сбросить
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
