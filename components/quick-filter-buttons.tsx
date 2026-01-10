"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { X } from "lucide-react"

interface QuickFilterButtonsProps {
  onSortChange?: (value: string) => void
  onFilterToggle?: () => void
  activeFiltersCount?: number
  insideTireResults?: boolean
  onBrandSelect?: (brands: string[]) => void
  resultsCount?: number
  availableBrands?: string[]
  onCarSelect?: (fastenerData: { type: string | null; thread: string | null }) => void
}

export default function QuickFilterButtons({
  onSortChange,
  onFilterToggle,
  activeFiltersCount = 0,
  insideTireResults = false,
  onBrandSelect,
  resultsCount,
  availableBrands,
  onCarSelect,
}: QuickFilterButtonsProps) {
  const pathname = usePathname()

  // Базовые состояния
  const [priceFilter, setPriceFilter] = useState("expensive")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [showBrandSelector, setShowBrandSelector] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [lastAction, setLastAction] = useState<string>("Нет действий")
  // Add a new state for the search input
  const [brandSearchInput, setBrandSearchInput] = useState("")
  // Add state for brands loaded from API
  const [brands, setBrands] = useState<string[]>([])
  const [brandsLoading, setBrandsLoading] = useState(true)

  // Car selector states for krepezh page
  const [carBrands, setCarBrands] = useState<any[]>([])
  const [carModels, setCarModels] = useState<any[]>([])
  const [carYears, setCarYears] = useState<number[]>([])
  const [loadingYears, setLoadingYears] = useState(false)
  const [selectedCarBrand, setSelectedCarBrand] = useState<any | null>(null)
  const [selectedCarModel, setSelectedCarModel] = useState<any | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [carSearchInput, setCarSearchInput] = useState("")
  const [showCarSelector, setShowCarSelector] = useState(false)
  const [carSelectorStep, setCarSelectorStep] = useState<"brand" | "model" | "year">("brand")
  const [searchResults, setSearchResults] = useState<{ brands: any[]; models: any[] }>({ brands: [], models: [] })
  const [isSearching, setIsSearching] = useState(false)

  // Load brands from API
  useEffect(() => {
    async function loadBrands() {
      try {
        const response = await fetch("/api/brands")
        if (response.ok) {
          const data = await response.json()
          setBrands(data.brands || [])
        }
      } catch (error) {
        console.error("Failed to load brands:", error)
        // Fallback to default brands
        setBrands([
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
        ])
      } finally {
        setBrandsLoading(false)
      }
    }
    loadBrands()
  }, [])

  // Search for cars (brands and models) with debounce
  useEffect(() => {
    if (!pathname?.includes("/krepezh") && !pathname?.includes("/diski")) return
    if (!carSearchInput || carSearchInput.length < 2) {
      setSearchResults({ brands: [], models: [] })
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/fitment/search?q=${encodeURIComponent(carSearchInput)}`)
        if (response.ok) {
          const data = await response.json()
          console.log("Search results:", data)
          setSearchResults(data)
        }
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsSearching(false)
      }
    }, 300) // Debounce 300ms

    return () => clearTimeout(timeoutId)
  }, [carSearchInput, pathname])

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

  // Add scroll handler to close brand selector
  useEffect(() => {
    const handleScroll = () => {
      if (showBrandSelector) {
        setShowBrandSelector(false)
      }
    }

    window.addEventListener("scroll", handleScroll, true)
    return () => {
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [showBrandSelector])

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

  // Get the appropriate brands list
  const getBrandsList = () => {
    if (window.location.pathname.includes("/diski")) {
      return availableBrands && availableBrands.length > 0 ? availableBrands : wheelBrands
    }
    return brands
  }

  // Add a function to handle brand search
  const handleBrandSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (brandSearchInput.trim()) {
      // Check if the brand already exists in our list
      const formattedInput = brandSearchInput.trim()
      const brandsToSearch = getBrandsList()
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

  // Handle car brand selection
  const handleCarBrandSelect = async (brand: any) => {
    setSelectedCarBrand(brand)
    setCarSearchInput(brand.name)
    setCarSelectorStep("model")

    // Load models for this brand
    try {
      const response = await fetch(`/api/fitment/models?brand_slug=${brand.slug}`)
      if (response.ok) {
        const data = await response.json()
        setCarModels(data.models || [])
      }
    } catch (error) {
      console.error("Failed to load car models:", error)
    }
  }

  // Load years for selected model
  const loadYearsForModel = async (brandSlug: string, modelSlug: string) => {
    setLoadingYears(true)
    setCarYears([])
    try {
      // Запрашиваем fitment для модели без года чтобы получить все доступные года
      const response = await fetch(`https://api.tirebase.ru/api/fitment?access_token=xN6JxoibNEbSFt952_O5kf-VxL61lOX4k5KAS-iGlBU&brand_slug=${brandSlug}&model_slug=${modelSlug}`)
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          // Извлекаем уникальные года
          const uniqueYears = new Set<number>()
          data.forEach((fitment: any) => {
            if (fitment.year) {
              uniqueYears.add(Number(fitment.year))
            }
          })
          const yearsList = Array.from(uniqueYears).sort((a, b) => b - a)
          console.log("Загружены года:", yearsList)
          setCarYears(yearsList.length > 0 ? yearsList : Array.from({ length: 26 }, (_, i) => 2025 - i))
        } else {
          // Fallback
          setCarYears(Array.from({ length: 26 }, (_, i) => 2025 - i))
        }
      } else {
        setCarYears(Array.from({ length: 26 }, (_, i) => 2025 - i))
      }
    } catch (error) {
      console.error("Failed to load years:", error)
      setCarYears(Array.from({ length: 26 }, (_, i) => 2025 - i))
    } finally {
      setLoadingYears(false)
    }
  }

  // Handle direct model selection from search
  const handleModelSelect = async (model: any) => {
    // Set the brand first
    setSelectedCarBrand({ name: model.brandName, slug: model.brandSlug })
    setSelectedCarModel({ name: model.name, slug: model.slug })
    setCarSearchInput(`${model.brandName} ${model.name}`)
    setCarSelectorStep("year")

    // Load years for this model
    await loadYearsForModel(model.brandSlug, model.slug)
  }

  // Handle car model selection
  const handleCarModelSelect = async (model: any) => {
    setSelectedCarModel(model)
    setCarSearchInput(`${selectedCarBrand?.name} ${model.name}`)
    setCarSelectorStep("year")

    // Load years for this model
    if (selectedCarBrand?.slug) {
      await loadYearsForModel(selectedCarBrand.slug, model.model_slug || model.slug)
    }
  }

  // Handle year selection and fetch fitment data
  const handleYearSelect = async (year: number) => {
    setSelectedYear(year)
    setCarSearchInput(`${selectedCarBrand?.name} ${selectedCarModel?.name} ${year}`)
    setShowCarSelector(false)

    // Fetch fitment data
    try {
      const response = await fetch(
        `/api/fitment?brand_slug=${selectedCarBrand?.slug}&model_slug=${selectedCarModel?.slug}&year=${year}`
      )
      if (response.ok) {
        const data = await response.json()

        // For /krepezh page - use fastener data
        if (pathname?.includes("/krepezh") && data.fastener && onCarSelect) {
          console.log("Fastener data from API:", data.fastener)
          onCarSelect({
            type: data.fastener.type,
            thread: data.fastener.thread
          })
        }

        // For /diski page - dispatch event with wheel data
        if (pathname?.includes("/diski") && data.wheels) {
          console.log("Wheel data from API:", data.wheels)
          window.dispatchEvent(new CustomEvent("carWheelDataSelected", {
            detail: {
              wheels: data.wheels,
              carInfo: {
                brand: selectedCarBrand?.name,
                model: selectedCarModel?.name,
                year: year
              }
            }
          }))
        }
      }
    } catch (error) {
      console.error("Failed to load fitment data:", error)
    }
  }

  // Clear car selection
  const clearCarSelection = () => {
    setSelectedCarBrand(null)
    setSelectedCarModel(null)
    setSelectedYear(null)
    setCarYears([])
    setCarSearchInput("")
    setCarSelectorStep("brand")
    setShowCarSelector(false)
  }

  if (!insideTireResults) return null

  return (
    <>
    <div
      className="flex flex-col w-full"
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

      {/* Верхняя часть - два скруглённых прямоугольника */}
      <div className="flex gap-2 w-full items-center">
        {/* Левый блок - Введите бренд / Фильтр по модели авто */}
        <div className="relative brand-selector-container flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={(pathname?.includes("/krepezh") || pathname?.includes("/diski")) ? carSearchInput : brandSearchInput}
              onChange={(e) => {
                if (pathname?.includes("/krepezh") || pathname?.includes("/diski")) {
                  setCarSearchInput(e.target.value)
                  if (e.target.value.trim()) {
                    setShowCarSelector(true)
                    setCarSelectorStep("brand")
                  } else {
                    setShowCarSelector(false)
                  }
                } else {
                  setBrandSearchInput(e.target.value)
                  // Show the brand selector when typing and there's input
                  if (e.target.value.trim()) {
                    setShowBrandSelector(true)
                  } else if (e.target.value === "" && selectedBrands.length === 0) {
                    // Hide selector if input is empty and no brands are selected
                    setShowBrandSelector(false)
                  }
                }
              }}
              onFocus={() => {
                if (pathname?.includes("/krepezh") || pathname?.includes("/diski")) {
                  setShowCarSelector(true)
                } else {
                  setShowBrandSelector(true)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !pathname?.includes("/krepezh") && !pathname?.includes("/diski")) {
                  e.preventDefault()
                  handleBrandSearch(e as any)
                }
              }}
              placeholder={(pathname?.includes("/krepezh") || pathname?.includes("/diski")) ? "Фильтр по модели авто" : "Введите бренд"}
              className="w-full px-3 py-2 rounded-2xl focus:outline-none bg-white dark:bg-[#333333]/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 placeholder:text-sm border border-gray-300 dark:border-transparent"
              style={{ fontSize: '16px' }}
            />
            {/* Car selector for krepezh and diski pages - внутри контейнера input для одинаковой ширины */}
            {(pathname?.includes("/krepezh") || pathname?.includes("/diski")) && showCarSelector && (carSearchInput.length >= 2 || carSelectorStep !== "brand") && (
              <div
                className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#2A2A2A] border border-[#D9D9DD] dark:border-[#3A3A3A] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
                id="car-selector-dropdown"
              >
                <div className="p-2">
                  {carSelectorStep === "brand" && (
                    <>
                      {isSearching && (
                        <div className="p-4 text-center text-gray-500">
                          Поиск...
                        </div>
                      )}
                      {!isSearching && carSearchInput.length >= 2 && (
                        <>
                          {searchResults.brands.length > 0 && (
                            <div className="mb-2">
                              <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 font-semibold">
                                МАРКИ
                              </div>
                              {searchResults.brands.map((brand) => (
                                <div
                                  key={`brand-${brand.slug}`}
                                  className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer"
                                  onClick={() => handleCarBrandSelect(brand)}
                                >
                                  <span className="text-base font-medium">{brand.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {searchResults.models.length > 0 && (
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 font-semibold">
                                МОДЕЛИ
                              </div>
                              {searchResults.models.map((model) => (
                                <div
                                  key={`model-${model.brandSlug}-${model.slug}`}
                                  className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer"
                                  onClick={() => handleModelSelect(model)}
                                >
                                  <div className="flex flex-col">
                                    <span className="text-base">{model.name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{model.brandName}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {searchResults.brands.length === 0 && searchResults.models.length === 0 && (
                            <div className="p-4 text-center text-gray-500">
                              Ничего не найдено
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {carSelectorStep === "model" && (
                    <>
                      <button
                        className="w-full text-left p-2 mb-2 text-sm text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        onClick={() => {
                          setCarSelectorStep("brand")
                          setSelectedCarBrand(null)
                          setCarModels([])
                        }}
                      >
                        ← Назад к маркам
                      </button>
                      {carModels.map((model) => (
                        <div
                          key={model.slug}
                          className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer"
                          onClick={() => handleCarModelSelect(model)}
                        >
                          <span className="text-base">{model.name}</span>
                        </div>
                      ))}
                    </>
                  )}

                  {carSelectorStep === "year" && selectedCarModel && (
                    <>
                      <button
                        className="w-full text-left p-2 mb-2 text-sm text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        onClick={() => {
                          setCarSelectorStep("model")
                          setSelectedCarModel(null)
                          setCarYears([])
                        }}
                      >
                        ← Назад к моделям
                      </button>
                      {loadingYears ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          Загрузка годов...
                        </div>
                      ) : carYears.length > 0 ? (
                        <div className="grid grid-cols-4 gap-1">
                          {carYears.map((year: number) => (
                            <div
                              key={year}
                              className="flex items-center justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                              onClick={() => handleYearSelect(year)}
                            >
                              <span className="text-sm text-[#1F1F1F] dark:text-white">{year}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          Нет доступных годов
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Clear button - вынесен за блок справа */}
          <button
            onClick={() => {
              if (pathname?.includes("/krepezh")) {
                clearCarSelection()
              } else {
                if (selectedBrands.length > 0 || brandSearchInput.trim()) {
                  setBrandSearchInput("")
                  setSelectedBrands([])
                  if (onBrandSelect) {
                    onBrandSelect([])
                  }
                  setShowBrandSelector(false)
                }
              }
            }}
            disabled={
              pathname?.includes("/krepezh")
                ? !carSearchInput.trim()
                : selectedBrands.length === 0 && !brandSearchInput.trim()
            }
            className={`p-1.5 rounded-full transition-colors flex-shrink-0 ${
              (pathname?.includes("/krepezh") ? carSearchInput.trim() : selectedBrands.length > 0 || brandSearchInput.trim())
                ? "hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer bg-gray-200 dark:bg-[#333333]/50"
                : "cursor-not-allowed opacity-30 bg-gray-200 dark:bg-[#333333]/30"
            }`}
            aria-label="Очистить фильтр брендов"
          >
            <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Упрощенный селектор брендов */}
          {!pathname?.includes("/krepezh") && showBrandSelector && (
            <div
              className="absolute top-full left-0 mt-1 bg-white dark:bg-[#2A2A2A] border border-[#D9D9DD] dark:border-[#3A3A3A] rounded-md shadow-lg z-50 w-48 max-h-48 sm:max-h-60 overflow-y-auto"
              id="brand-selector-dropdown"
            >
              <div className="p-1 sm:p-2">
                {/* Filter brands based on search input */}
                {getBrandsList()
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
                        <span className="text-base">{brand}</span>
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

        {/* Правый блок - Сортировка по цене */}
        <div
          className="flex items-center justify-center bg-white dark:bg-[#333333]/50 rounded-2xl px-3 py-2.5 cursor-pointer hover:opacity-70 transition-opacity border border-gray-300 dark:border-transparent"
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
            width={20}
            height={20}
            className={`transform ${priceFilter === "expensive" ? "rotate-180" : ""} transition-transform dark:invert-0 invert`}
          />
        </div>
      </div>
    </div>

    {/* Контейнер активных фильтров - ВНЕ основного блока */}
    {selectedBrands.length > 0 && (
      <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
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
    </>
  )
}
