"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

interface FastenerSearchFilterProps {
  fastenerType?: string
}

export function FastenerSearchFilter({ fastenerType = "nut" }: FastenerSearchFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [thread, setThread] = useState<string>(searchParams.get("thread") || "")
  const [shape, setShape] = useState<string>(searchParams.get("shape") || "")
  const [color, setColor] = useState<string>(searchParams.get("color") || "")
  const [length, setLength] = useState<string>(searchParams.get("length") || "")
  const [isSecretkaFilter, setIsSecretkaFilter] = useState<boolean>(searchParams.get("secretka") === "true")
  const [isStandardFilter, setIsStandardFilter] = useState<boolean>(searchParams.get("standard") === "true")
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(searchParams.get("open") === "true")
  const [isExtendedFilter, setIsExtendedFilter] = useState<boolean>(searchParams.get("extended") === "true")
  const [isKeyFilter, setIsKeyFilter] = useState<boolean>(searchParams.get("key") === "true")
  const [isSocketFilter, setIsSocketFilter] = useState<boolean>(searchParams.get("socket") === "true")

  // Add car data with predefined fastener specifications
  const carData = {
    "Toyota Camry": {
      thread: "M12x1.5",
      shape: "Конус",
      color: "Серебро",
    },
    "BMW X5": {
      thread: "M14x1.25",
      shape: "Сфера",
      color: "Черный",
    },
  }

  const [selectedCar, setSelectedCar] = useState<string | null>(null)

  // Add state for filter collapse
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false)
  const [isFilterVisible, setIsFilterVisible] = useState(true)
  const isExpanded = true // Always expanded
  const filterRef = useRef<HTMLDivElement>(null)

  // Add state for price range
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [stockFilter, setStockFilter] = useState<"single" | "full">("single")

  // Thread options
  const threadOptions = ["M12x1.25", "M12x1.5", "M14x1.25", "M14x1.5", "M14x2.0"]

  // Shape options
  const shapeOptions = ["Конус", "Сфера", "Шайба", "Секретка"]

  // Color options
  const colorOptions = ["Серебро", "Черный", "Хром", "Титан"]

  // Length options
  const lengthOptions = ["20mm", "25mm", "30mm", "35mm", "40mm", "45mm", "50mm"]

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

  // Function to apply dimension filter
  const applyFilter = (threadValue: string, shapeValue: string, colorValue: string, lengthValue: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (threadValue) params.set("thread", threadValue)
    if (shapeValue) params.set("shape", shapeValue)
    if (colorValue) params.set("color", colorValue)
    if (lengthValue) params.set("length", lengthValue)

    // Navigate with the parameters
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  const handleSecretkaChange = (checked: boolean) => {
    setIsSecretkaFilter(checked)

    const params = new URLSearchParams(searchParams.toString())
    if (checked) {
      params.set("secretka", "true")
    } else {
      params.delete("secretka")
    }

    // Navigate with the parameters
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  const handleStandardChange = (checked: boolean) => {
    setIsStandardFilter(checked)

    const params = new URLSearchParams(searchParams.toString())
    if (checked) {
      params.set("standard", "true")
    } else {
      params.delete("standard")
    }

    // Navigate with the parameters
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  const handleOpenChange = (checked: boolean) => {
    setIsOpenFilter(checked)

    const params = new URLSearchParams(searchParams.toString())
    if (checked) {
      params.set("open", "true")
    } else {
      params.delete("open")
    }

    // Navigate with the parameters
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  const handleExtendedChange = (checked: boolean) => {
    setIsExtendedFilter(checked)

    const params = new URLSearchParams(searchParams.toString())
    if (checked) {
      params.set("extended", "true")
    } else {
      params.delete("extended")
    }

    // Navigate with the parameters
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  const handleKeyChange = (checked: boolean) => {
    setIsKeyFilter(checked)

    const params = new URLSearchParams(searchParams.toString())
    if (checked) {
      params.set("key", "true")
    } else {
      params.delete("key")
    }

    // Navigate with the parameters
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  const handleSocketChange = (checked: boolean) => {
    setIsSocketFilter(checked)

    const params = new URLSearchParams(searchParams.toString())
    if (checked) {
      params.set("socket", "true")
    } else {
      params.delete("socket")
    }

    // Navigate with the parameters
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  const clearAllFilters = () => {
    setThread("")
    setShape("")
    setColor("")
    setLength("")
    setStockFilter("single")
    setPriceRange([0, 2000])
    setIsSecretkaFilter(false)
    setIsStandardFilter(false)
    setIsOpenFilter(false)
    setIsExtendedFilter(false)
    setIsKeyFilter(false)
    setIsSocketFilter(false)
    setSelectedCar(null) // Reset selected car

    const params = new URLSearchParams(searchParams.toString())
    params.delete("thread")
    params.delete("shape")
    params.delete("color")
    params.delete("length")
    params.delete("secretka")
    params.delete("standard")
    params.delete("open")
    params.delete("extended")
    params.delete("key")
    params.delete("socket")

    // Navigate with the parameters
    router.push(`${window.location.pathname}?${params.toString()}`)
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
        className={`bg-white dark:bg-[#2A2A2A] p-2 shadow-lg rounded-xl transition-all duration-300 ${
          isFilterCollapsed ? "max-h-[100px] overflow-hidden" : ""
        }`}
        aria-label={getFilterTitle()}
      >
        {/* Size selectors - always visible part of the filter */}
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex items-end gap-2">
            <div className="grid grid-cols-3 gap-2 flex-1">
              <div>
                <Label htmlFor="thread" className="text-xs text-[#1F1F1F] dark:text-gray-300 mb-0.5 block text-center">
                  Резьба
                </Label>
                <Select value={thread} onValueChange={setThread}>
                  <SelectTrigger
                    id="thread"
                    className="w-full h-8 text-xs bg-[#333333] text-white border border-gray-300/50"
                  >
                    <SelectValue placeholder="~" />
                  </SelectTrigger>
                  <SelectContent>
                    {threadOptions.map((option) => (
                      <SelectItem key={option} value={option} className="text-xs">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <div>
                  <Label htmlFor="shape" className="text-xs text-[#1F1F1F] dark:text-gray-300 mb-0.5 block text-center">
                    Форма
                  </Label>
                  <Select value={shape} onValueChange={setShape}>
                    <SelectTrigger
                      id="shape"
                      className="w-full h-8 text-xs bg-[#333333] text-white border border-gray-300/50"
                    >
                      <SelectValue placeholder="~" />
                    </SelectTrigger>
                    <SelectContent>
                      {shapeOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-xs">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={length} onValueChange={setLength}>
                    <SelectTrigger
                      id="length"
                      className="w-full h-8 text-xs bg-[#333333] text-white border border-gray-300/50"
                    >
                      <SelectValue placeholder="~" />
                    </SelectTrigger>
                    <SelectContent>
                      {lengthOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-xs">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Label
                    htmlFor="length"
                    className="text-xs text-[#1F1F1F] dark:text-gray-300 mt-0.5 block text-center"
                  >
                    Длина
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor="color" className="text-xs text-[#1F1F1F] dark:text-gray-300 mb-0.5 block text-center">
                  Цвет
                </Label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger
                    id="color"
                    className="w-full h-8 text-xs bg-[#333333] text-white border border-gray-300/50"
                  >
                    <SelectValue placeholder="~" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option} value={option} className="text-xs">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="w-full mt-1 flex flex-col gap-1">
                  <Button
                    size="sm"
                    onClick={() => handleSecretkaChange(!isSecretkaFilter)}
                    className={`w-full h-[26px] px-2 text-xs ${
                      isSecretkaFilter
                        ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                    }`}
                  >
                    ��екретка
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="w-full h-6 px-2 text-xs mt-1"
                    disabled={!thread && !shape && !color && !length}
                  >
                    Сбросить
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Garage section and filter options in a horizontal row */}
        <div className="flex justify-between items-center gap-2">
          {/* My Garage Section */}
          <div className="w-1/4 flex items-center">
            <div className="flex flex-col justify-center w-full">
              <div className="flex gap-1 overflow-x-auto scrollbar-hide" style={{ marginTop: "-60px" }}>
                {Object.keys(carData).map((car) => (
                  <button
                    key={car}
                    onClick={() => {
                      // Set selected car
                      setSelectedCar(car === selectedCar ? null : car)

                      // If selecting a car, apply its filter values
                      if (car !== selectedCar) {
                        const carSpecs = carData[car as keyof typeof carData]
                        setThread(carSpecs.thread)
                        setShape(carSpecs.shape)
                        setColor(carSpecs.color)

                        // Update URL params
                        const params = new URLSearchParams(searchParams.toString())
                        params.set("thread", carSpecs.thread)
                        params.set("shape", carSpecs.shape)
                        params.set("color", carSpecs.color)
                        router.push(`${window.location.pathname}?${params.toString()}`)
                      } else {
                        // If deselecting, clear filters
                        clearAllFilters()
                      }
                    }}
                    className={`text-xs px-1.5 py-0.5 rounded-md border whitespace-nowrap flex-shrink-0 ${
                      selectedCar === car
                        ? "bg-[#D3DF3D] border-[#D3DF3D] text-[#1F1F1F]"
                        : "bg-white dark:bg-[#3A3A3A] border-[#D9D9DD] dark:border-[#3A3A3A] text-[#1F1F1F] dark:text-white"
                    }`}
                  >
                    {car}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
