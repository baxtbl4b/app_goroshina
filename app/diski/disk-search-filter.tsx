"use client"

import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react"
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
  onDiskTypeChange?: (type: "stamped" | "cast" | "forged") => void
  diameterOptions?: string[]
  widthOptions?: string[]
  pcdOptions?: string[]
  etOptions?: string[]
  hubOptions?: string[]
  onFilterHeightChange?: (height: number) => void
}

const DiskSearchFilter = memo(function DiskSearchFilter({
  diskType = "cast",
  onDiskTypeChange,
  diameterOptions = [],
  widthOptions = [],
  pcdOptions = [],
  etOptions = [],
  hubOptions = [],
  onFilterHeightChange
}: DiskSearchFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [diameter, setDiameter] = useState<string>(searchParams.get("diameter") || "")
  const [width, setWidth] = useState<string>(searchParams.get("width") || "")
  const [pcd, setPcd] = useState<string>(searchParams.get("pcd") || "")
  const [et, setEt] = useState<string>(searchParams.get("et") || "")
  const [hub, setHub] = useState<string>(searchParams.get("hub") || "")

  // State to track which Select is currently open (only one can be open at a time)
  const [openSelect, setOpenSelect] = useState<string | null>(null)

  // Add state for filter collapse
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false)
  const [isFilterVisible, setIsFilterVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  // Add touch handling states
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

  // Add state for price range
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseFloat(searchParams.get("minPrice") || "3000"),
    parseFloat(searchParams.get("maxPrice") || "30000")
  ])
  const [stockFilter, setStockFilter] = useState<"single" | "full">(
    searchParams.get("stockFilter") as "single" | "full" || "single"
  )

  // Debounced URL update ONLY for price slider (for smooth dragging)
  const priceUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Clear existing timeout
    if (priceUpdateTimeoutRef.current) {
      clearTimeout(priceUpdateTimeoutRef.current)
    }

    // Debounce ONLY price range updates for smooth slider
    priceUpdateTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      // Price range
      if (priceRange[0] !== 3000) params.set("minPrice", priceRange[0].toString())
      else params.delete("minPrice")

      if (priceRange[1] !== 30000) params.set("maxPrice", priceRange[1].toString())
      else params.delete("maxPrice")

      // Only update if params changed
      const newParamsString = params.toString()
      const currentParamsString = searchParams.toString()
      if (newParamsString !== currentParamsString) {
        router.push(`${window.location.pathname}?${newParamsString}`, { scroll: false })
      }
    }, 300) // 300ms debounce for price slider only

    return () => {
      if (priceUpdateTimeoutRef.current) {
        clearTimeout(priceUpdateTimeoutRef.current)
      }
    }
  }, [priceRange, router, searchParams])

  // Immediate URL update for stock filter (no debounce for buttons)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    // Stock filter - immediate update
    if (stockFilter !== "single") params.set("stockFilter", stockFilter)
    else params.delete("stockFilter")

    const newParamsString = params.toString()
    const currentParamsString = searchParams.toString()
    if (newParamsString !== currentParamsString) {
      router.push(`${window.location.pathname}?${newParamsString}`, { scroll: false })
    }
  }, [stockFilter, router, searchParams])

  // Immediate URL update for dimension filters (no debounce for select dropdowns)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    // Dimension filters - immediate updates
    if (diameter) params.set("diameter", diameter)
    else params.delete("diameter")

    if (width) params.set("width", width)
    else params.delete("width")

    if (pcd) params.set("pcd", pcd)
    else params.delete("pcd")

    if (et) params.set("et", et)
    else params.delete("et")

    if (hub) params.set("hub", hub)
    else params.delete("hub")

    const newParamsString = params.toString()
    const currentParamsString = searchParams.toString()
    if (newParamsString !== currentParamsString) {
      router.push(`${window.location.pathname}?${newParamsString}`, { scroll: false })
    }
  }, [diameter, width, pcd, et, hub, router, searchParams])

  // Add state for garage scroll gradients
  const [showLeftGradient, setShowLeftGradient] = useState(false)
  const [showRightGradient, setShowRightGradient] = useState(true)
  const garageScrollRef = useRef<HTMLDivElement>(null)

  // Handle garage scroll - memoized
  const handleGarageScroll = useCallback(() => {
    if (garageScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = garageScrollRef.current
      setShowLeftGradient(scrollLeft > 5)
      setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 5)
    }
  }, [])

  // State for user's vehicles from localStorage
  const [userVehicles, setUserVehicles] = useState<VehicleWithWheels[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)

  // Load user vehicles from localStorage with wheel sizes
  useEffect(() => {
    const loadUserCars = () => {
      try {
        const storedCars = JSON.parse(localStorage.getItem("userCars") || "[]")
        const vehicles: VehicleWithWheels[] = storedCars.map((car: any) => {
          return {
            id: car.id,
            name: `${car.brand} ${car.model}`,
            wheelSize: {
              diameter: car.wheelDiameter || "",
              width: car.wheelWidth || "",
              pcd: car.wheelPcd || "",
              et: car.wheelEt || "",
              hub: car.wheelHub || "",
            },
          }
        }).filter((v: VehicleWithWheels) =>
          v.wheelSize.diameter && v.wheelSize.width && v.wheelSize.pcd
        )
        setUserVehicles(vehicles)
      } catch (error) {
        console.error("Error loading user cars:", error)
        setUserVehicles([])
      }
    }

    loadUserCars()

    // Listen for storage changes (when user adds/removes cars)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userCars") {
        loadUserCars()
      }
    }

    // Also listen for focus to reload when user navigates back
    const handleFocus = () => {
      loadUserCars()
    }

    // Listen for custom event when cars are updated in the same tab
    const handleCarsUpdated = () => {
      loadUserCars()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("focus", handleFocus)
    window.addEventListener("userCarsUpdated", handleCarsUpdated)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("userCarsUpdated", handleCarsUpdated)
    }
  }, [])

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

  // Track filter height and notify parent
  useEffect(() => {
    const updateHeight = () => {
      if (filterRef.current && onFilterHeightChange) {
        const height = filterRef.current.offsetHeight
        onFilterHeightChange(height)
      }
    }

    // Initial measurement
    updateHeight()

    // Update on state changes
    const timer = setTimeout(updateHeight, 350) // Wait for animation to complete

    // Update on window resize
    window.addEventListener("resize", updateHeight)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", updateHeight)
    }
  }, [isFilterCollapsed, isExpanded, onFilterHeightChange])

  // Function to select vehicle and set wheel sizes - memoized
  const selectVehicle = useCallback((vehicle: VehicleWithWheels) => {
    setSelectedVehicle(vehicle.id)
    setDiameter(vehicle.wheelSize.diameter)
    setWidth(vehicle.wheelSize.width)
    setPcd(vehicle.wheelSize.pcd)
    setEt(vehicle.wheelSize.et)
    setHub(vehicle.wheelSize.hub)
    // URL will be updated automatically by the dimension filters useEffect
  }, [])

  // Function to clear dimension filter - memoized
  const clearAllDimensions = useCallback(() => {
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
  }, [router, searchParams])

  // Function to scroll to filter - memoized
  const scrollToFilter = useCallback(() => {
    if (filterRef.current) {
      filterRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  // Get filter title based on disk type - memoized
  const filterTitle = useMemo(() => {
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
  }, [diskType])

  // Toggle stock filter - memoized
  const toggleStockFilter = useCallback(() => {
    setStockFilter(prev => prev === "single" ? "full" : "single")
  }, [])

  // Handle price range change - memoized
  const handlePriceRangeChange = useCallback((value: number[]) => {
    setPriceRange(value as [number, number])
  }, [])

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
        className={`px-4 pt-2 pb-4 fixed left-0 right-0 z-40 transition-all duration-300 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] bg-white dark:bg-[#2A2A2A] backdrop-blur-md`}
        style={{
          bottom: '0',
          transform: isFilterCollapsed ? 'translateY(calc(100% - 56px))' : 'translateY(0)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 1) 100%)',
          maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 1) 100%)',
          touchAction: isFilterCollapsed ? 'none' : 'pan-x pinch-zoom',
          WebkitOverflowScrolling: 'touch',
          pointerEvents: 'auto',
        }}
        aria-label={filterTitle}
        data-testid="disk-filter-container"
        onTouchStart={(e) => {
          if (isFilterCollapsed) {
            e.preventDefault()
            setTouchStartY(e.touches[0].clientY)
            setTouchEndY(null)
          }
        }}
        onTouchMove={(e) => {
          if (isFilterCollapsed && touchStartY !== null) {
            e.preventDefault()
            setTouchEndY(e.touches[0].clientY)
          }
        }}
        onTouchEnd={() => {
          if (isFilterCollapsed && touchStartY !== null && touchEndY !== null) {
            const diff = touchEndY - touchStartY
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
          className="flex items-center justify-center mb-2 -mx-4 px-4"
          data-swipe-handle
          style={{
            touchAction: 'none',
            paddingTop: isFilterCollapsed ? '12px' : '0',
            paddingBottom: isFilterCollapsed ? '12px' : '0',
          }}
        >
          <button
            className="flex items-center justify-center py-3 cursor-pointer w-full group"
            style={{ touchAction: 'none' }}
            onClick={() => {
              if (isFilterCollapsed) {
                setIsFilterCollapsed(false)
              } else if (!isExpanded) {
                setIsExpanded(true)
              } else {
                setIsExpanded(false)
              }
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

                if (Math.abs(diff) > 20) {
                  if (diff < 0) {
                    if (isFilterCollapsed) {
                      setIsFilterCollapsed(false)
                      highlightHandle()
                    } else if (!isExpanded) {
                      setIsExpanded(true)
                      highlightHandle()
                    }
                  } else {
                    if (isExpanded) {
                      setIsExpanded(false)
                      highlightHandle()
                    } else if (!isFilterCollapsed) {
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
        {/* Size selectors - always visible part of the filter */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-end gap-3">
            <div className="grid grid-cols-3 gap-3 flex-1">
              <div>
                <Label htmlFor="diameter" className="text-xs text-[#1F1F1F] dark:text-gray-300 mb-1 block text-center">
                  Диаметр
                </Label>
                <Select
                  value={diameter}
                  onValueChange={setDiameter}
                  open={openSelect === "diameter"}
                  onOpenChange={(open) => setOpenSelect(open ? "diameter" : null)}
                >
                  <SelectTrigger id="diameter" className="w-full bg-[#333333] text-white border-0 rounded-xl">
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
                <Label htmlFor="width" className="text-xs text-[#1F1F1F] dark:text-gray-300 mb-1 block text-center">
                  Ширина
                </Label>
                <Select
                  value={width}
                  onValueChange={setWidth}
                  open={openSelect === "width"}
                  onOpenChange={(open) => setOpenSelect(open ? "width" : null)}
                >
                  <SelectTrigger id="width" className="w-full bg-[#333333] text-white border-0 rounded-xl">
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
                <Label htmlFor="pcd" className="text-xs text-[#1F1F1F] dark:text-gray-300 mb-1 block text-center">
                  PCD
                </Label>
                <Select
                  value={pcd}
                  onValueChange={setPcd}
                  open={openSelect === "pcd"}
                  onOpenChange={(open) => setOpenSelect(open ? "pcd" : null)}
                >
                  <SelectTrigger id="pcd" className="w-full bg-[#333333] text-white border-0 rounded-xl">
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
              className={`h-10 px-3 text-xs border-0 rounded-xl transition-all duration-300 ${
                diameter || width || pcd || et || hub || priceRange[0] > 3000 || priceRange[1] < 30000 || stockFilter === "full"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 active:scale-95 shadow-md hover:shadow-red-500/30"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
              disabled={!diameter && !width && !pcd && !et && !hub && priceRange[0] === 3000 && priceRange[1] === 30000 && stockFilter === "single"}
            >
              Сбросить
            </Button>
          </div>

          {/* Additional disk parameters moved from collapsible section */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="et" className="text-xs text-[#1F1F1F] dark:text-gray-300 mb-1 block">
                Вылет (ET)
              </Label>
              <Select
                value={et}
                onValueChange={setEt}
                open={openSelect === "et"}
                onOpenChange={(open) => setOpenSelect(open ? "et" : null)}
              >
                <SelectTrigger id="et" className="w-full bg-[#333333] text-white border-0 rounded-xl">
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
              <Label htmlFor="hub" className="text-xs text-[#1F1F1F] dark:text-gray-300 mb-1 block">
                Ступица (DIA)
              </Label>
              <Select
                value={hub}
                onValueChange={setHub}
                open={openSelect === "hub"}
                onOpenChange={(open) => setOpenSelect(open ? "hub" : null)}
              >
                <SelectTrigger id="hub" className="w-full bg-[#333333] text-white border-0 rounded-xl">
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
        <div className="flex flex-row items-center justify-between gap-3 mb-3">
          {/* My Garage section */}
          <div className="flex-1 flex items-center gap-1 sm:gap-2 overflow-hidden min-w-0">
            <div className="flex flex-col w-full">
              <div className="relative w-full">
                {/* Left gradient fade-out overlay */}
                <div
                  className={`absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-[#2A2A2A] to-transparent pointer-events-none z-10 transition-opacity duration-200 ${showLeftGradient ? 'opacity-100' : 'opacity-0'}`}
                ></div>
                <div
                  ref={garageScrollRef}
                  onScroll={handleGarageScroll}
                  className="flex gap-1 overflow-x-auto scrollbar-hide mb-1 px-1"
                >
                  {userVehicles.length > 0 ? (
                    userVehicles.map((vehicle) => (
                      <button
                        key={vehicle.id}
                        onClick={() => selectVehicle(vehicle)}
                        className={`text-xs px-2 py-0.5 rounded-xl border whitespace-nowrap flex-shrink-0 ${
                          selectedVehicle === vehicle.id
                            ? "bg-[#c4d402] border-[#c4d402] text-[#1F1F1F]"
                            : "bg-white dark:bg-[#3A3A3A] border-[#D9D9DD] dark:border-[#3A3A3A] text-[#1F1F1F] dark:text-white"
                        }`}
                      >
                        {vehicle.name}
                      </button>
                    ))
                  ) : (
                    <a
                      href="/account/cars/add"
                      className="text-xs px-2 py-0.5 rounded-xl border whitespace-nowrap flex-shrink-0 bg-white dark:bg-[#3A3A3A] border-[#D9D9DD] dark:border-[#3A3A3A] text-gray-500 dark:text-gray-400 hover:border-[#c4d402] hover:text-[#1F1F1F] dark:hover:text-white transition-colors"
                    >
                      + Добавить авто
                    </a>
                  )}
                </div>
                {/* Right gradient fade-out overlay */}
                <div
                  className={`absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-[#2A2A2A] to-transparent pointer-events-none z-10 transition-opacity duration-200 ${showRightGradient ? 'opacity-100' : 'opacity-0'}`}
                ></div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden">Мой гараж</span>
            </div>
          </div>

          {/* Toggle button for expanding/collapsing */}
          <div className="flex items-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-xs text-[#009CFF] hover:text-[#007ACC] transition-colors whitespace-nowrap"
            >
              <>
                Фильтры
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
              {/* Filters in a row: Stock Filter and Price Range */}
              <div className="flex flex-wrap gap-3 justify-between">
                <div className="flex gap-3 w-full">
                  {/* Stock Filter - Button style */}
                  <div className="w-[45%] sm:w-[30%]">
                    <button
                      onClick={toggleStockFilter}
                      className={`w-full h-16 rounded-t-xl rounded-bl-[28px] rounded-br-xl text-xs font-medium transition-all duration-200 flex items-center justify-center px-2 ${
                        stockFilter === "full"
                          ? "bg-blue-500 text-white"
                          : "bg-[#F5F5F5] dark:bg-[#333333] text-[#1F1F1F] dark:text-white"
                      }`}
                    >
                      Скрыть меньше 4шт
                    </button>
                  </div>

                  {/* Price range slider */}
                  <div className="flex-1 bg-[#F5F5F5] dark:bg-[#333333] rounded-t-xl rounded-bl-xl rounded-br-[28px] p-2">
                    <div className="px-1 pt-2 pb-1">
                      <Slider
                        defaultValue={[3000, 30000]}
                        min={3000}
                        max={30000}
                        step={1000}
                        value={priceRange}
                        onValueChange={handlePriceRangeChange}
                        className="w-full"
                      />
                    </div>
                    <div className="text-xs text-[#1F1F1F] dark:text-white text-center mt-2 pb-1">
                      <span className="font-medium">Цена:</span> {priceRange[0].toLocaleString()} ₽ - {priceRange[1].toLocaleString()} ₽
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
})

export default DiskSearchFilter
