"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface QuickFilterButtonsProps {
  onSortChange?: (value: string) => void
  onFilterToggle?: () => void
  activeFiltersCount?: number
  insideTireResults?: boolean
  onBrandSelect?: (brands: string[]) => void
}

export default function QuickFilterButtons({
  onSortChange,
  onFilterToggle,
  activeFiltersCount = 0,
  insideTireResults = false,
  onBrandSelect,
}: QuickFilterButtonsProps) {
  // Базовые состояния
  const [priceFilter, setPriceFilter] = useState("cheaper")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [showBrandSelector, setShowBrandSelector] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [lastAction, setLastAction] = useState<string>("Нет действий")
  // Add a new state for the search input
  const [brandSearchInput, setBrandSearchInput] = useState("")

  // Add click outside handler to close brand selector
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".brand-selector-container")) {
        setShowBrandSelector(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Список брендов
  const brands = [
    "Michelin",
    "Continental",
    "Bridgestone",
    "Pirelli",
    "Goodyear",
    "Nokian",
    "Dunlop",
    "Hankook",
    "Yokohama",
    "Toyo",
    "Westlake",
  ]

  // Список брендов дисков
  const wheelBrands = [
    "BBS",
    "OZ Racing",
    "Enkei",
    "Vossen",
    "Rays",
    "Konig",
    "Borbet",
    "Sparco",
    "Work Wheels",
    "Rotiform",
    "American Racing",
    "Advanti Racing",
    "Fondmetal",
    "MAK",
    "RIAL",
    "AEZ",
    "Replay",
    "КиК",
    "СКАД",
    "Alcasta",
  ]

  // Обработчик изменения сортировки по цене
  const handlePriceFilterChange = (value: string) => {
    setPriceFilter(value)

    if (onSortChange) {
      const sortValue = value === "expensive" ? "price-desc" : "price-asc"
      onSortChange(sortValue)

      // Dispatch a custom event that the catalog can listen for
      window.dispatchEvent(
        new CustomEvent("applySorting", {
          detail: {
            type: "price",
            direction: value,
            value: sortValue,
          },
        }),
      )

      // Добавляем визуальную обратную связь
      console.log(`Сортировка применена: ${value === "cheaper" ? "от дешевых к дорогим" : "от дорогих к дешевым"}`)
    }
  }

  // Простая функция для добавления бренда
  const addBrand = (brand: string) => {
    setLastAction(`Добавление бренда: ${brand}`)
    console.log(`Добавление бренда: ${brand}`)

    if (!selectedBrands.includes(brand)) {
      const newSelectedBrands = [...selectedBrands, brand]
      setSelectedBrands(newSelectedBrands)

      // Вызываем колбэк, если он предоставлен
      if (onBrandSelect) {
        onBrandSelect(newSelectedBrands)
      }
    }
  }

  // Простая функция для удаления бренда
  const removeBrand = (brand: string) => {
    setLastAction(`Удаление бренда: ${brand}`)
    console.log(`Удаление бренда: ${brand}`)

    const newSelectedBrands = selectedBrands.filter((b) => b !== brand)
    setSelectedBrands(newSelectedBrands)

    // Вызываем колбэк, если он предоставлен
    if (onBrandSelect) {
      onBrandSelect(newSelectedBrands)
    }
  }

  // Переключение режима отладки
  const toggleDebugMode = () => {
    setDebugMode((prev) => !prev)
    console.log("Режим отладки:", !debugMode)
  }

  // Add a function to handle brand search
  const handleBrandSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (brandSearchInput.trim()) {
      // Check if the brand already exists in our list
      const formattedInput = brandSearchInput.trim()
      const brandsToSearch = window.location.pathname.includes("/diski") ? wheelBrands : brands
      const matchingBrand = brandsToSearch.find((brand) => brand.toLowerCase() === formattedInput.toLowerCase())

      if (matchingBrand) {
        // If it exists in our list, add the exact brand name
        addBrand(matchingBrand)
      } else {
        // If it doesn't exist, add the user input as is
        addBrand(formattedInput)
      }

      // Clear the input after adding
      setBrandSearchInput("")
    }
  }

  // Initialize sorting on component mount
  useEffect(() => {
    if (onSortChange) {
      const sortValue = priceFilter === "expensive" ? "price-desc" : "price-asc"
      onSortChange(sortValue)
    }
  }, [])

  if (!insideTireResults) return null

  return (
    <div
      className="flex flex-col bg-white dark:bg-[#2A2A2A] rounded-xl p-2 sm:p-3 mb-2 sm:mb-4 shadow-sm w-full"
      id="quick-filter-container"
      data-testid="quick-filter-panel"
    >
      {/* Отладочная информация */}
      {debugMode && (
        <div className="fixed top-0 right-0 bg-black/80 text-white p-2 text-xs z-[10000] max-w-xs overflow-auto">
          <div>Debug Mode: ON</div>
          <div>Selected Brands: {selectedBrands.length}</div>
          <div>Selected: {selectedBrands.join(", ")}</div>
          <div>Last Action: {lastAction}</div>
          <button onClick={toggleDebugMode} className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-xs">
            Выключить отладку
          </button>
        </div>
      )}

      {/* Верхняя часть с кнопкой выбора брендов и сортировкой */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-2">
        {/* Кнопка выбора брендов */}
        <div className="relative brand-selector-container w-full">
          <div className="relative w-full p-2 flex items-center space-x-3">
            <input
              type="text"
              value={brandSearchInput}
              onChange={(e) => {
                setBrandSearchInput(e.target.value)
                // Show the brand selector when typing and there's input
                if (e.target.value.trim()) {
                  setShowBrandSelector(true)
                } else if (e.target.value === "" && selectedBrands.length === 0) {
                  // Hide selector if input is empty and no brands are selected
                  setShowBrandSelector(false)
                }
              }}
              onFocus={() => setShowBrandSelector(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleBrandSearch(e as any)
                }
              }}
              placeholder={window.location.pathname.includes("/krepezh") ? "Фильтр по модели авто" : "Введите бренд"}
              className="w-[calc(100%-48px)] px-3 py-2 text-sm border border-[#D9D9DD] dark:border-[#3A3A3A] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#1A1A1A] dark:text-white"
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer hover:opacity-70 transition-opacity p-2 bg-gray-100 dark:bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={() => {
                // Toggle the price filter
                const newFilter = priceFilter === "cheaper" ? "expensive" : "cheaper"
                setPriceFilter(newFilter)

                // Apply the sorting to the catalog
                if (onSortChange) {
                  const sortValue = newFilter === "expensive" ? "price-desc" : "price-asc"
                  onSortChange(sortValue)

                  // Dispatch a custom event that the catalog can listen for
                  window.dispatchEvent(
                    new CustomEvent("applySorting", {
                      detail: {
                        type: "price",
                        direction: newFilter,
                        value: sortValue,
                      },
                    }),
                  )

                  // Add visual feedback
                  console.log(
                    `Сортировка применена: ${newFilter === "cheaper" ? "от дешевых к дорогим" : "от дорогих к дешевым"}`,
                  )
                }
              }}
              title={priceFilter === "cheaper" ? "Сортировать по возрастанию цены" : "Сортировать по убыванию цены"}
            >
              <Image
                src="/images/icons8-sorting-arrows-96.png"
                alt="Сортировка по цене"
                width={28}
                height={28}
                className={`transform ${priceFilter === "expensive" ? "rotate-180" : ""} transition-transform`}
              />
            </div>
          </div>

          {/* Упрощенный селектор брендов */}
          {showBrandSelector && (
            <div
              className="absolute top-full left-0 mt-1 bg-white dark:bg-[#2A2A2A] border border-[#D9D9DD] dark:border-[#3A3A3A] rounded-md shadow-lg z-50 w-full sm:w-64 max-h-48 sm:max-h-60 overflow-y-auto"
              id="brand-selector-dropdown"
            >
              <div className="p-1 sm:p-2">
                {/* Filter brands based on search input */}
                {(window.location.pathname.includes("/diski") ? wheelBrands : brands)
                  .filter(
                    (brand) => brandSearchInput === "" || brand.toLowerCase().includes(brandSearchInput.toLowerCase()),
                  )
                  .map((brand) => {
                    const isSelected = selectedBrands.includes(brand)
                    return (
                      <div
                        key={brand}
                        className={`flex items-center justify-between p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer ${
                          isSelected ? "bg-blue-50 dark:bg-blue-900/30" : ""
                        }`}
                        onClick={() => {
                          if (isSelected) {
                            removeBrand(brand)
                          } else {
                            addBrand(brand)
                          }
                        }}
                      >
                        <span className="text-xs sm:text-sm">{brand}</span>
                        <div>
                          {isSelected ? (
                            <button
                              className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center bg-blue-500 text-white rounded"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeBrand(brand)
                              }}
                            >
                              ✓
                            </button>
                          ) : (
                            <button
                              className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded"
                              onClick={(e) => {
                                e.stopPropagation()
                                addBrand(brand)
                              }}
                            >
                              +
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Контейнер активных фильтров */}
      {selectedBrands.length > 0 && (
        <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
          <span className="text-xs sm:text-sm text-[#1F1F1F]/70 dark:text-white/70 self-center">Активные фильтры:</span>
          {selectedBrands.map((brand) => (
            <div
              key={brand}
              className="flex items-center bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#009CFF] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium"
            >
              {brand}
              <button
                onClick={() => removeBrand(brand)}
                className="ml-1 sm:ml-2 text-[#009CFF] hover:text-[#0084d6] focus:outline-none"
                aria-label={`Удалить фильтр ${brand}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Дополнительные фильтры */}
      <div className="hidden md:flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm border-[#D9D9DD] dark:border-[#3A3A3A] text-[#1F1F1F] dark:text-white"
        >
          Цена до 10 000 ₽
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm border-[#D9D9DD] dark:border-[#3A3A3A] text-[#1F1F1F] dark:text-white"
        >
          Только в наличии
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm border-[#D9D9DD] dark:border-[#3A3A3A] text-[#1F1F1F] dark:text-white"
        >
          Michelin
        </Button>
      </div>
    </div>
  )
}
