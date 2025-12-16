"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { Slider } from "@/components/ui/slider"

interface VehicleWithWheels {
  id: string
  name: string
  wheelSize: {
    diameter: string
    width: string
    pcd: string
    et: string
    hub: string
  }
}

interface DiskSearchFilterProps {
  diskType: string
}

export default function DiskSearchFilter({ diskType = "cast" }: DiskSearchFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [diameter, setDiameter] = useState<string>(searchParams.get("diameter") || "")
  const [width, setWidth] = useState<string>(searchParams.get("width") || "")
  const [pcd, setPcd] = useState<string>(searchParams.get("pcd") || "")
  const [et, setEt] = useState<string>(searchParams.get("et") || "")
  const [hub, setHub] = useState<string>(searchParams.get("hub") || "")

  // Add state for filter collapse
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false)
  const [isFilterVisible, setIsFilterVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  // Add state for price range
  const [priceRange, setPriceRange] = useState<[number, number]>([3000, 30000])
  const [stockFilter, setStockFilter] = useState<"single" | "full">("single")

  // Add mock data for user's vehicles
  const userVehicles: VehicleWithWheels[] = [
    {
      id: "1",
      name: "Toyota Camry",
      wheelSize: {
        diameter: "17",
        width: "7",
        pcd: "5x114.3",
        et: "45",
        hub: "60.1",
      },
    },
    {
      id: "2",
      name: "VW Tiguan",
      wheelSize: {
        diameter: "18",
        width: "8",
        pcd: "5x112",
        et: "43",
        hub: "57.1",
      },
    },
  ]

  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)

  // Diameter options
  const diameterOptions = ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22"]

  // Width options
  const widthOptions = ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"]

  // PCD options
  const pcdOptions = ["4x100", "4x108", "5x100", "5x108", "5x112", "5x114.3", "5x120"]

  // ET options
  const etOptions = ["15", "20", "25", "30", "35", "40", "45", "50", "55"]

  // Hub options
  const hubOptions = ["54.1", "56.1", "57.1", "60.1", "63.3", "66.6", "71.6"]

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

  // Function to select vehicle and set wheel sizes
  const selectVehicle = (vehicle: VehicleWithWheels) => {
    setSelectedVehicle(vehicle.id)
    setDiameter(vehicle.wheelSize.diameter)
    setWidth(vehicle.wheelSize.width)
    setPcd(vehicle.wheelSize.pcd)
    setEt(vehicle.wheelSize.et)
    setHub(vehicle.wheelSize.hub)

    // Apply the filter immediately when a vehicle is selected
    applyDimensionFilter(
      vehicle.wheelSize.diameter,
      vehicle.wheelSize.width,
      vehicle.wheelSize.pcd,
      vehicle.wheelSize.et,
      vehicle.wheelSize.hub,
    )
  }

  // Function to apply dimension filter
  const applyDimensionFilter = (
    diameterValue: string,
    widthValue: string,
    pcdValue: string,
    etValue: string,
    hubValue: string,
  ) => {
    const params = new URLSearchParams(searchParams.toString())

    if (diameterValue) params.set("diameter", diameterValue)
    if (widthValue) params.set("width", widthValue)
    if (pcdValue) params.set("pcd", pcdValue)
    if (etValue) params.set("et", etValue)
    if (hubValue) params.set("hub", hubValue)

    // Navigate with the parameters
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  // Function to clear dimension filter
  const clearAllDimensions = () => {
    setDiameter("")
    setWidth("")
    setPcd("")
    setEt("")
    setHub("")
    setSelectedVehicle(null)

    const params = new URLSearchParams(searchParams.toString())
    params.delete("diameter")
    params.delete("width")
    params.delete("pcd")
    params.delete("et")
    params.delete("hub")

    // Navigate with the parameters
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  // Function to scroll to filter
  const scrollToFilter = () => {
    if (filterRef.current) {
      filterRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Get filter title based on disk type
  const getFilterTitle = () => {
    switch (diskType) {
      case "stamped":
        return "Фильтр штампованных дисков"
      case "cast":
        return "Фильтр литых дисков"
      case "forged":
        return "Фильтр кованых дисков"
      default:
        return "Фильтр дисков"
    }
  }

  return (
    <>
      {/* Floating button that appears when filter is not visible */}
      {!isFilterVisible && (
        <div className="fixed top-[120px] left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={scrollToFilter}
            className="bg-gray-200 dark:bg-gray-700 text-[#1F1F1F] dark:text-white p-2.5 shadow-sm flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 ease-in-out text-xs bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-full border border-gray-300 dark:border-gray-600 w-10 h-10"
            aria-label="Вернуться к фильтру"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        className={`bg-white dark:bg-[#2A2A2A] p-4 shadow-lg rounded-xl transition-all duration-300 ${
          isFilterCollapsed ? "max-h-[120px] overflow-hidden" : ""
        }`}
        aria-label={getFilterTitle()}
      >
        {/* Size selectors - always visible part of the filter */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-end gap-3">
            <div className="grid grid-cols-3 gap-3 flex-1">
              <div>
                <Label htmlFor="diameter" className="text-sm text-[#1F1F1F] dark:text-gray-300 mb-1 block text-center">
                  Диаметр
                </Label>
                <Select value={diameter} onValueChange={setDiameter}>
                  <SelectTrigger id="diameter" className="w-full bg-[#333333] text-white border border-gray-300/50">
                    <SelectValue placeholder="~" />
                  </SelectTrigger>
                  <SelectContent>
                    {diameterOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        R{option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="width" className="text-sm text-[#1F1F1F] dark:text-gray-300 mb-1 block text-center">
                  Ширина
                </Label>
                <Select value={width} onValueChange={setWidth}>
                  <SelectTrigger id="width" className="w-full bg-[#333333] text-white border border-gray-300/50">
                    <SelectValue placeholder="~" />
                  </SelectTrigger>
                  <SelectContent>
                    {widthOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}J
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pcd" className="text-sm text-[#1F1F1F] dark:text-gray-300 mb-1 block text-center">
                  PCD
                </Label>
                <Select value={pcd} onValueChange={setPcd}>
                  <SelectTrigger id="pcd" className="w-full bg-[#333333] text-white border border-gray-300/50">
                    <SelectValue placeholder="~" />
                  </SelectTrigger>
                  <SelectContent>
                    {pcdOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={clearAllDimensions}
              className="h-10 px-3 text-xs"
              disabled={!diameter && !width && !pcd && !et && !hub}
            >
              Сбросить
            </Button>
          </div>

          {/* Additional disk parameters moved from collapsible section */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="et" className="text-sm text-[#1F1F1F] dark:text-gray-300 mb-1 block">
                Вылет (ET)
              </Label>
              <Select value={et} onValueChange={setEt}>
                <SelectTrigger id="et" className="w-full bg-[#333333] text-white border border-gray-300/50">
                  <SelectValue placeholder="~" />
                </SelectTrigger>
                <SelectContent>
                  {etOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      ET{option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="hub" className="text-sm text-[#1F1F1F] dark:text-gray-300 mb-1 block">
                Ступица (DIA)
              </Label>
              <Select value={hub} onValueChange={setHub}>
                <SelectTrigger id="hub" className="w-full bg-[#333333] text-white border border-gray-300/50">
                  <SelectValue placeholder="~" />
                </SelectTrigger>
                <SelectContent>
                  {hubOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option} мм
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Header section with filter title and buttons */}
        <div className="flex flex-row items-center justify-between gap-3 mb-4">
          {/* My Garage section */}
          <div className="flex-1 flex items-center gap-1 sm:gap-2 overflow-hidden">
            <div className="flex flex-col w-full">
              <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-1">
                {userVehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => selectVehicle(vehicle)}
                    className={`text-xs px-2 py-0.5 rounded-md border whitespace-nowrap flex-shrink-0 ${
                      selectedVehicle === vehicle.id
                        ? "bg-[#c4d402] border-[#c4d402] text-[#1F1F1F]"
                        : "bg-white dark:bg-[#3A3A3A] border-[#D9D9DD] dark:border-[#3A3A3A] text-[#1F1F1F] dark:text-white"
                    }`}
                  >
                    {vehicle.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Toggle button for expanding/collapsing */}
          <div className="flex items-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-xs text-[#009CFF] hover:text-[#007ACC] transition-colors whitespace-nowrap"
            >
              <>
                Дополнительные фильтры
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d={isExpanded ? "M18 15L12 9L6 15" : "M6 9L12 15L18 9"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            </button>
          </div>
        </div>

        {/* Collapsible part (remaining filters) */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-4">
            <div className="space-y-3">
              {/* More compact filters in a row */}
              <div className="flex flex-wrap gap-3 justify-between">
                {/* Disk type options as compact checkboxes */}
                <div className="w-full md:flex-1 border border-[#D9D9DD] dark:border-[#3A3A3A] rounded-md p-3 flex items-center justify-center">
                  <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 items-center justify-center">
                    {diskType === "stamped" && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="black" className="h-4 w-4" />
                          <Label htmlFor="black" className="text-xs text-[#1F1F1F] dark:text-gray-300">
                            Черные
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="silver" className="h-4 w-4" />
                          <Label htmlFor="silver" className="text-xs text-[#1F1F1F] dark:text-gray-300">
                            Серебр��стые
                          </Label>
                        </div>
                      </>
                    )}

                    {diskType === "cast" && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="polished" className="h-4 w-4" />
                          <Label htmlFor="polished" className="text-xs text-[#1F1F1F] dark:text-gray-300">
                            Полированные
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="painted" className="h-4 w-4" />
                          <Label htmlFor="painted" className="text-xs text-[#1F1F1F] dark:text-gray-300">
                            Крашеные
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="diamond-cut" className="h-4 w-4" />
                          <Label htmlFor="diamond-cut" className="text-xs text-[#1F1F1F] dark:text-gray-300">
                            Алмазная огранка
                          </Label>
                        </div>
                      </>
                    )}

                    {diskType === "forged" && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="one-piece" className="h-4 w-4" />
                          <Label htmlFor="one-piece" className="text-xs text-[#1F1F1F] dark:text-gray-300">
                            Моноблок
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="multi-piece" className="h-4 w-4" />
                          <Label htmlFor="multi-piece" className="text-xs text-[#1F1F1F] dark:text-gray-300">
                            Составные
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="custom" className="h-4 w-4" />
                          <Label htmlFor="custom" className="text-xs text-[#1F1F1F] dark:text-gray-300">
                            Кастомные
                          </Label>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Filters in a row: Stock Filter and Price Range */}
                <div className="flex flex-wrap gap-3 w-full md:w-3/4">
                  {/* Stock Filter - Checkbox style button */}
                  <div className="w-[45%] sm:w-[30%] bg-[#F5F5F5] dark:bg-[#333333] rounded-md p-2">
                    <button
                      onClick={() => setStockFilter(stockFilter === "single" ? "full" : "single")}
                      className={`w-full h-16 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center px-2 ${
                        stockFilter === "full"
                          ? "bg-blue-500 text-white"
                          : "bg-white dark:bg-[#2A2A2A] text-[#1F1F1F] dark:text-white border border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 flex items-center justify-center rounded border ${
                            stockFilter === "full" ? "bg-white border-white" : "border-gray-400 dark:border-gray-500"
                          }`}
                        >
                          {stockFilter === "full" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-blue-500"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                        <span>Скрыть меньше 4шт</span>
                      </div>
                    </button>
                  </div>

                  {/* Price range slider */}
                  <div className="w-[50%] sm:w-[65%] bg-[#F5F5F5] dark:bg-[#333333] rounded-md p-2">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-[#1F1F1F] dark:text-white">Цена</h4>
                      <div className="text-xs text-[#1F1F1F] dark:text-white">
                        {priceRange[0].toLocaleString()} ₽ - {priceRange[1].toLocaleString()} ₽
                      </div>
                    </div>
                    <div className="px-1 py-2">
                      <Slider
                        defaultValue={[3000, 30000]}
                        min={3000}
                        max={30000}
                        step={1000}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
