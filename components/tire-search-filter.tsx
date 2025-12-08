"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Season } from "@/lib/api"
import { useRouter, useSearchParams } from "next/navigation"
import { Slider } from "@/components/ui/slider"

interface VehicleWithTires {
  id: string
  name: string
  tireSize: {
    width: string
    profile: string
    diameter: string
  }
}

interface TireSearchFilterProps {
  season?: Season
}


export default function TireSearchFilter({ season }: { season: Season }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Обновите инициализацию состояний для правильного чтения параметров URL
  const [width, setWidth] = useState<string>(() => {
    const widthParam = searchParams.get("width")
    console.log("Initializing width from URL:", widthParam)
    return widthParam || ""
  })

  const [profile, setProfile] = useState<string>(() => {
    const profileParam = searchParams.get("profile") || searchParams.get("height")
    console.log("Initializing profile from URL:", profileParam)
    return profileParam || ""
  })

  const [diameter, setDiameter] = useState<string>(() => {
    const diameterParam = searchParams.get("diameter") || searchParams.get("diam")
    console.log("Initializing diameter from URL:", diameterParam)
    return diameterParam || ""
  })

  const [commonSizes, setCommonSizes] = useState<{ label: string; width: string; profile: string; diameter: string }[]>(
    [
      { label: "195/65 R15", width: "195", profile: "65", diameter: "15" },
      { label: "205/55 R16", width: "205", profile: "55", diameter: "16" },
      { label: "225/45 R17", width: "225", profile: "45", diameter: "17" },
      { label: "235/35 R19", width: "235", profile: "35", diameter: "19" },
    ],
  )


  // Add mock data for user's vehicles
  const userVehicles: VehicleWithTires[] = [
    {
      id: "1",
      name: "Toyota Camry",
      tireSize: {
        width: "225",
        profile: "45",
        diameter: "17",
      },
    },
    {
      id: "2",
      name: "VW Tiguan",
      tireSize: {
        width: "235",
        profile: "55",
        diameter: "18",
      },
    },
  ]

  // Add state for selected vehicle and tire size values
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)

  // Add these state variables inside the TireSearchFilter component, after the existing useState declarations
  const [priceRange, setPriceRange] = useState<[number, number]>([3000, 30000])
  // Changed default value from "all" to "quarter"
  const [stockFilter, setStockFilter] = useState<"single" | "full">("single")
  const [isPriceFilterVisible, setIsPriceFilterVisible] = useState(true)
  const [isStockFilterVisible, setIsStockFilterVisible] = useState(true)
  const [cargo, setCargo] = useState(false)

  // Add state for the new round toggle button
  const [quickFilterActive, setQuickFilterActive] = useState(false)

  // First, add a new state for the studs/friction toggle
  // Add this after the other useState declarations, near where studs and cargo are defined
  const [isStudded, setIsStudded] = useState(false)

  // Add state for dropdown visibility
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)
  const [isFilterVisible, setIsFilterVisible] = useState(true)

  // Add state for winter tire type toggle
  const [winterTireType, setWinterTireType] = useState<"studded" | "friction" | "both">("both")

  // Initialize spike state from URL parameter or default to true for studded tires
  const [spike, setSpike] = useState<boolean | null>(null)

  // Add a new state variable for tracking if the filter is expanded
  // Add this after the other useState declarations
  const [isExpanded, setIsExpanded] = useState(false)

  // Add state for filter collapse
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false)

  // Track if all dimensions are specified
  const [allDimensionsSpecified, setAllDimensionsSpecified] = useState(false)

  // Добавьте новые состояния для отслеживания свайпа после других useState объявлений
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [touchEndY, setTouchEndY] = useState<number | null>(null)

  // Отдельные состояния для свайпа на полоске
  const [handleTouchStartY, setHandleTouchStartY] = useState<number | null>(null)

  // Состояние для подсветки полоски
  const [isHandleHighlighted, setIsHandleHighlighted] = useState(false)
  const handleHighlightTimeout = useRef<NodeJS.Timeout | null>(null)

  // Состояние для отслеживания прокрутки гаража
  const [showLeftGradient, setShowLeftGradient] = useState(false)
  const [showRightGradient, setShowRightGradient] = useState(true)
  const garageScrollRef = useRef<HTMLDivElement>(null)

  // Обработчик прокрутки гаража
  const handleGarageScroll = () => {
    if (garageScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = garageScrollRef.current
      setShowLeftGradient(scrollLeft > 5)
      setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 5)
    }
  }

  // Функция для подсветки полоски с задержкой затухания
  const highlightHandle = () => {
    setIsHandleHighlighted(true)
    if (handleHighlightTimeout.current) {
      clearTimeout(handleHighlightTimeout.current)
    }
    handleHighlightTimeout.current = setTimeout(() => {
      setIsHandleHighlighted(false)
    }, 1000)
  }

  // Check if all dimensions are specified
  useEffect(() => {
    setAllDimensionsSpecified(!!width && !!profile && !!diameter)
  }, [width, profile, diameter])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (width) params.set("width", width)
    else params.delete("width")

    if (profile) params.set("profile", profile)
    else params.delete("profile")

    if (diameter) params.set("diameter", diameter)
    else params.delete("diameter")

    // Update URL without refreshing the page
    const url = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({ path: url }, "", url)
  }, [width, profile, diameter, searchParams])

  // Добавьте этот useEffect после других useEffect
  useEffect(() => {
    const widthParam = searchParams.get("width")
    const profileParam = searchParams.get("profile") || searchParams.get("height")
    const diameterParam = searchParams.get("diameter") || searchParams.get("diam")

    console.log("URL params changed:", { widthParam, profileParam, diameterParam })

    if (widthParam && widthParam !== width) setWidth(widthParam)
    if (profileParam && profileParam !== profile) setProfile(profileParam)
    if (diameterParam && diameterParam !== diameter) setDiameter(diameterParam)
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

  // Обновим useEffect для обработки свайпов в обоих направлениях
  // Найдите существующий useEffect, который обрабатывает свайпы, и замените его на следующий:
  useEffect(() => {
    // Проверяем, был ли выполнен свайп
    if (touchStartY && touchEndY) {
      const swipeDistance = touchEndY - touchStartY
      // Если свайп вверх (начальная точка ниже конечной) и фильтр свёрнут
      if (swipeDistance < -50 && isFilterCollapsed) {
        setIsFilterCollapsed(false)
      }
      // Если свайп вниз (начальная точка выше конечной) и фильтр развёрнут
      else if (swipeDistance > 50 && !isFilterCollapsed) {
        setIsFilterCollapsed(true)
      }

      // Сбрасываем значения после обработки
      setTouchStartY(null)
      setTouchEndY(null)
    }
  }, [touchEndY, touchStartY, isFilterCollapsed])

  // Add function to select vehicle and set tire sizes
  const selectVehicle = (vehicle: VehicleWithTires) => {
    setSelectedVehicle(vehicle.id)
    setWidth(vehicle.tireSize.width)
    setProfile(vehicle.tireSize.profile)
    setDiameter(vehicle.tireSize.diameter)

    // Apply the filter immediately when a vehicle is selected
    applyDimensionFilter(vehicle.tireSize.width, vehicle.tireSize.profile, vehicle.tireSize.diameter)
  }

  // Add function to toggle quick filter
  const toggleQuickFilter = () => {
    setQuickFilterActive(!quickFilterActive)
    // If activating quick filter, set some predefined values
    if (!quickFilterActive) {
      // Example: Set popular tire size and in-stock only
      setWidth("205")
      setProfile("55")
      setDiameter("16")
      setStockFilter("full")

      // Apply the filter immediately
      applyDimensionFilter("205", "55", "16")
    } else {
      // Reset filters when turning off quick filter
      setWidth("")
      setProfile("")
      setDiameter("")
      setStockFilter("single") // Changed from "all" to "quarter"

      // Clear the dimension filter
      clearDimensionFilter()
    }
  }

  const [secondAxis, setSecondAxis] = useState(false)
  const [runflat, setRunflat] = useState(false)
  const [todayOnly, setTodayOnly] = useState(false)

  // Function to toggle runflat parameter and update API request
  const toggleRunflatParameter = (checked: boolean) => {
    setRunflat(checked)

    // Apply the filter immediately
    const params = new URLSearchParams(searchParams.toString())

    // Preserve existing parameters
    if (width) params.set("width", width)
    if (profile) params.set("profile", profile)
    if (diameter) params.set("diameter", diameter)

    // Update runflat parameter
    if (checked) {
      params.set("runflat", "true")
    } else {
      params.delete("runflat")
    }

    // Log the filter being applied for debugging
    console.log(`Applying runflat filter: ${checked}`, params.toString())

    // Navigate with the updated parameters - force a full navigation to ensure filter is applied
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  // Function to toggle cargo parameter and update API request
  const toggleCargoParameter = (checked: boolean) => {
    setCargo(checked)

    // Apply the filter immediately
    const params = new URLSearchParams(searchParams.toString())

    // Preserve existing parameters
    if (width) params.set("width", width)
    if (profile) params.set("profile", profile)
    if (diameter) params.set("diameter", diameter)

    // Update cargo parameter
    if (checked) {
      params.set("cargo", "true")
    } else {
      params.delete("cargo")
    }

    // Log the filter being applied for debugging
    console.log(`Applying cargo filter: ${checked}`, params.toString())

    // Navigate with the updated parameters - force a full navigation to ensure filter is applied
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  // Function to toggle today parameter and update API request
  const toggleTodayParameter = (checked: boolean) => {
    setTodayOnly(checked)

    // Apply the filter immediately
    const params = new URLSearchParams(searchParams.toString())

    // Preserve existing parameters
    if (width) params.set("width", width)
    if (profile) params.set("profile", profile)
    if (diameter) params.set("diameter", diameter)

    // Update today parameter
    if (checked) {
      params.set("today", "true")
    } else {
      params.delete("today")
    }

    // Log the filter being applied for debugging
    console.log(`Applying today filter: ${checked}`, params.toString())

    // Navigate with the updated parameters - force a full navigation to ensure filter is applied
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  // Width options
  const widthOptions = [
    "145",
    "155",
    "165",
    "175",
    "185",
    "195",
    "205",
    "215",
    "225",
    "235",
    "245",
    "255",
    "265",
    "275",
    "285",
    "295",
    "305",
    "315",
  ]

  // Profile options
  const profileOptions = ["30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80"]

  // Diameter options
  const diameterOptions = ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]

  // Brand options with count
  const brandOptions = [
    { name: "Michelin", count: 42 },
    { name: "Continental", count: 38 },
    { name: "Bridgestone", count: 35 },
    { name: "Pirelli", count: 31 },
    { name: "Goodyear", count: 29 },
    { name: "Nokian", count: 27 },
    { name: "Yokohama", count: 24 },
    { name: "Dunlop", count: 22 },
  ]

  // Add a new array for popular/suggested brands
  const popularBrands = ["Michelin", "Continental", "Bridgestone", "Pirelli"]

  // State for brand search query
  const [brandSearchQuery, setBrandSearchQuery] = useState("")

  // State for selected brands
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  // Filter brands based on search query
  const filteredBrands = brandSearchQuery
    ? brandOptions
        .filter((brand) => brand.name.toLowerCase().includes(brandSearchQuery.toLowerCase()))
        .filter((brand) => !selectedBrands.includes(brand.name))
    : brandOptions.filter((brand) => !selectedBrands.includes(brand.name))

  // Suggested brands based on search query (limited to 3)
  const suggestedBrands = brandSearchQuery ? filteredBrands.slice(0, 3) : []

  // Toggle brand selection
  const toggleBrand = (brandName: string) => {
    if (selectedBrands.includes(brandName)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brandName))
    } else {
      setSelectedBrands([...selectedBrands, brandName])
      setBrandSearchQuery("") // Clear search after selection
      setIsDropdownVisible(false) // Hide dropdown after selection
    }
  }

  // Add click outside handler to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Show dropdown when typing
  useEffect(() => {
    if (brandSearchQuery && filteredBrands.length > 0) {
      setIsDropdownVisible(true)
    } else {
      setIsDropdownVisible(false)
    }
  }, [brandSearchQuery, filteredBrands])

  // Function to apply dimension filter
  const applyDimensionFilter = (widthValue: string, profileValue: string, diameterValue: string) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set("width", widthValue)
    params.set("profile", profileValue)
    params.set("diameter", diameterValue)

    // Navigate with the parameters
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  // Function to clear dimension filter
  const clearDimensionFilter = () => {
    const params = new URLSearchParams(searchParams.toString())

    params.delete("width")
    params.delete("profile")
    params.delete("diameter")

    // Navigate with the parameters
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  // Найдите функцию toggleSpikeParameter и замените её на следующую версию:

  // Function to toggle spike parameter and update UI
  const toggleSpikeParameter = (value: boolean | null) => {
    setSpike(value)
    setWinterTireType(value === true ? "studded" : value === false ? "friction" : "both")

    // Apply the filter immediately
    const params = new URLSearchParams(searchParams.toString())

    // Preserve existing parameters
    if (width) params.set("width", width)
    if (profile) params.set("profile", profile)
    if (diameter) params.set("diameter", diameter)

    // Update spike parameter - ensure it's a string "true" or "false" for API compatibility
    if (value === null) {
      params.delete("spike")
    } else {
      params.set("spike", value.toString())
    }

    // Log the filter being applied for debugging
    console.log(`Applying spike filter: ${value}`, params.toString())

    // Navigate with the updated parameters - force a full navigation to ensure filter is applied
    router.push(`${window.location.pathname}?${params.toString()}`)
  }


  // Функция для применения быстрого фильтра по типоразмеру
  const applyQuickSizeFilter = (size: { width: string; profile: string; diameter: string }) => {
    // Создаем новый объект URLSearchParams на основе текущих параметров
    const params = new URLSearchParams(searchParams.toString())

    // Устанавливаем параметры фильтра
    params.set("width", size.width)
    params.set("profile", size.profile)
    params.set("diameter", size.diameter)

    // Обновляем URL с новыми параметрами
    router.push(
      `/category/${season === "s" ? "summer" : season === "w" ? "winter" : "all-season"}?${params.toString()}`,
    )

    // Обновляем локальное состояние
    setWidth(size.width)
    setProfile(size.profile)
    setDiameter(size.diameter)
  }

  // Function to handle width change
  const handleWidthChange = (value: string) => {
    setWidth(value)
    if (value && profile && diameter) {
      // If all dimensions are specified, apply filter
      applyDimensionFilter(value, profile, diameter)
    } else if (!value) {
      // If width is cleared, update URL
      const params = new URLSearchParams(searchParams.toString())
      params.delete("width")
      router.push(`${window.location.pathname}?${params.toString()}`)
    }
  }

  // Function to handle profile change
  const handleProfileChange = (value: string) => {
    setProfile(value)
    if (width && value && diameter) {
      // If all dimensions are specified, apply filter
      applyDimensionFilter(width, value, diameter)
    } else if (!value) {
      // If profile is cleared, update URL
      const params = new URLSearchParams(searchParams.toString())
      params.delete("profile")
      router.push(`${window.location.pathname}?${params.toString()}`)
    }
  }

  // Function to handle diameter change
  const handleDiameterChange = (value: string) => {
    setDiameter(value)
    if (width && profile && value) {
      // If all dimensions are specified, apply filter
      applyDimensionFilter(width, profile, value)
    } else if (!value) {
      // If diameter is cleared, update URL  profile, value)
    } else if (!value) {
      // If diameter is cleared, update URL
      const params = new URLSearchParams(searchParams.toString())
      params.delete("diameter")
      router.push(`${window.location.pathname}?${params.toString()}`)
    }
  }

  // Function to clear all dimension filters
  const clearAllDimensions = () => {
    setWidth("")
    setProfile("")
    setDiameter("")
    setSelectedVehicle(null) // Reset the selected vehicle
    setPriceRange([3000, 30000]) // Reset price range
    setStockFilter("single") // Reset stock filter
    setRunflat(false) // Reset runflat
    setCargo(false) // Reset cargo
    setSecondAxis(false) // Reset second axis
    setTodayOnly(false) // Reset today filter
    setSpike(null) // Reset spike filter
    setSelectedBrands([]) // Reset brands

    // Clear all URL parameters
    const params = new URLSearchParams()
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  // Initialize from URL parameters
  useEffect(() => {
    if (season === "w") {
      const spikeParam = searchParams.get("spike")
      if (spikeParam !== null) {
        const isStudded = spikeParam === "true"
        setSpike(isStudded)
        setWinterTireType(isStudded ? "studded" : "friction")
      } else {
        setSpike(null)
        setWinterTireType("both")
      }

      // Log the current state for debugging
      console.log("Winter tire filter initialized:", {
        spikeParam,
        spike: spikeParam !== null ? spikeParam === "true" : null,
        winterTireType: spikeParam !== null ? (spikeParam === "true" ? "studded" : "friction") : "both",
      })
    }

    // Initialize runflat from URL parameter
    const runflatParam = searchParams.get("runflat")
    if (runflatParam === "true") {
      setRunflat(true)
    } else {
      setRunflat(false)
    }

    // Initialize todayOnly from URL parameter
    const todayParam = searchParams.get("today")
    if (todayParam === "true") {
      setTodayOnly(true)
    } else {
      setTodayOnly(false)
    }

    // Initialize stock filter from URL parameter
    const minStockParam = searchParams.get("minStock")
    if (minStockParam === "4") {
      setStockFilter("full")
    } else {
      setStockFilter("single")
    }
  }, [searchParams, season])

  // Function to scroll to filter
  const scrollToFilter = () => {
    if (filterRef.current) {
      filterRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Add style with keyframes animation
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
      @keyframes pulse-filter {
        0% {
          box-shadow: 0 0 0 0 rgba(211, 223, 61, 0.4);
        }
        70% {
          box-shadow: 0 0 0 6px rgba(211, 223, 61, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(211, 223, 61, 0);
        }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])


  const [isOpen, setIsOpen] = useState(true)
  const [selectedWidths, setSelectedWidths] = useState<string[]>([])
  const [selectedHeights, setSelectedHeights] = useState<string[]>([])
  const [selectedDiameters, setSelectedDiameters] = useState<string[]>([])

  // Modify the return statement to add the collapsible functionality
  // Replace the entire return statement with this updated version
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
        className={`px-4 pt-2 pb-4 fixed left-0 right-0 z-40 transition-all duration-300 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] bg-white dark:bg-[#2A2A2A]`}
        style={{
          bottom: '0',
          transform: isFilterCollapsed ? 'translateY(calc(100% - 50px))' : 'translateY(0)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 1) 100%)',
          maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 1) 100%)',
        }}
        aria-label="Блок фильтра шин"
        data-testid="tire-filter-container"
      >
        {/* Swipe handle for collapse/expand - now also clickable */}
        <div className="flex items-center justify-center mb-2 -mx-4 px-4">
          <button
            className="flex items-center justify-center py-3 cursor-pointer w-full group"
            onClick={() => {
              setIsFilterCollapsed(!isFilterCollapsed)
              highlightHandle()
            }}
            onTouchStart={(e) => {
              e.stopPropagation()
              setHandleTouchStartY(e.touches[0].clientY)
            }}
            onTouchMove={(e) => {
              if (handleTouchStartY !== null) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
            onTouchEnd={(e) => {
              if (handleTouchStartY !== null) {
                const endY = e.changedTouches[0].clientY
                const diff = endY - handleTouchStartY

                // Свайп вниз (diff > 0) - закрыть, свайп вверх (diff < 0) - открыть
                if (Math.abs(diff) > 20) {
                  if (diff > 0 && !isFilterCollapsed) {
                    setIsFilterCollapsed(true)
                    highlightHandle()
                  } else if (diff < 0 && isFilterCollapsed) {
                    setIsFilterCollapsed(false)
                    highlightHandle()
                  }
                }

                setHandleTouchStartY(null)
              }
            }}
            aria-label={isFilterCollapsed ? "Нажмите для раскрытия фильтра" : "Нажмите для скрытия фильтра"}
            aria-expanded={!isFilterCollapsed}
          >
            <div className="flex flex-col items-center gap-1">
              <div className={`w-16 h-1.5 rounded-full transition-colors duration-300 ${isHandleHighlighted ? 'bg-[#D3DF3D]' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
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
        <div className="flex items-end gap-3 mb-3 mt-1">
          <div className="grid grid-cols-3 gap-3 flex-1">
            <div>
              <Label htmlFor="width" className="text-xs text-[#1F1F1F] dark:text-gray-300 mb-1 block text-center">
                Ширина
              </Label>
              <Select value={width} onValueChange={handleWidthChange}>
                <SelectTrigger id="width" className="w-full bg-[#333333] text-white border-0">
                  <SelectValue placeholder="~" />
                </SelectTrigger>
                <SelectContent>
                  {widthOptions.map((widthOption) => (
                    <SelectItem key={widthOption} value={widthOption}>
                      {widthOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="profile" className="text-xs text-[#1F1F1F] dark:text-gray-300 mb-1 block text-center">
                Высота
              </Label>
              <Select value={profile} onValueChange={handleProfileChange}>
                <SelectTrigger id="profile" className="w-full bg-[#333333] text-white border-0">
                  <SelectValue placeholder="~" />
                </SelectTrigger>
                <SelectContent>
                  {profileOptions.map((profileOption) => (
                    <SelectItem key={profileOption} value={profileOption}>
                      {profileOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-center mb-1 w-full">
                {" "}
                {/* Updated line */}
                <Label htmlFor="diameter" className="text-xs text-[#1F1F1F] dark:text-gray-300 text-center">
                  Диаметр
                </Label>
              </div>
              <Select value={diameter} onValueChange={handleDiameterChange}>
                <SelectTrigger id="diameter" className="w-full bg-[#333333] text-white border-0">
                  <SelectValue placeholder="~" />
                </SelectTrigger>
                <SelectContent>
                  {diameterOptions.map((diameterOption) => (
                    <SelectItem key={diameterOption} value={diameterOption}>
                      R{diameterOption}
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
            className={`h-10 px-3 text-xs border-0 transition-all duration-300 ${
              width || profile || diameter || priceRange[0] > 3000 || priceRange[1] < 30000 || stockFilter === "full" || runflat || cargo || secondAxis || todayOnly || spike !== null || selectedBrands.length > 0
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 active:scale-95 shadow-md hover:shadow-red-500/30"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
            disabled={!width && !profile && !diameter && priceRange[0] === 3000 && priceRange[1] === 30000 && stockFilter === "single" && !runflat && !cargo && !secondAxis && !todayOnly && spike === null && selectedBrands.length === 0}
          >
            Сбросить
          </Button>
        </div>

        {/* Second axis selectors (conditional) */}
        {secondAxis && (
          <div className="flex items-end gap-3 mb-3 mt-1">
            <div className="grid grid-cols-3 gap-3 flex-1">
              <div>
                <Label htmlFor="width2" className="text-xs text-[#1F1F1F] dark:text-gray-300 mb-1 block text-center">
                  Ширина (2 ось)
                </Label>
                <Select>
                  <SelectTrigger id="width2" className="w-full bg-[#333333] text-white border-0">
                    <SelectValue placeholder="~" />
                  </SelectTrigger>
                  <SelectContent>
                    {widthOptions.map((width) => (
                      <SelectItem key={width} value={width}>
                        {width}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="profile2" className="text-xs text-[#1F1F1F] dark:text-gray-300 mb-1 block text-center">
                  Высота (2 ось)
                </Label>
                <Select>
                  <SelectTrigger id="profile2" className="w-full bg-[#333333] text-white border-0">
                    <SelectValue placeholder="~" />
                  </SelectTrigger>
                  <SelectContent>
                    {profileOptions.map((profile) => (
                      <SelectItem key={profile} value={profile}>
                        {profile}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-center mb-1 w-full">
                  <Label htmlFor="diameter2" className="text-xs text-[#1F1F1F] dark:text-gray-300 text-center">
                    Диаметр (2 ось)
                  </Label>
                </div>
                <Select>
                  <SelectTrigger id="diameter2" className="w-full bg-[#333333] text-white border-0">
                    <SelectValue placeholder="~" />
                  </SelectTrigger>
                  <SelectContent>
                    {diameterOptions.map((diameter) => (
                      <SelectItem key={diameter} value={diameter}>
                        R{diameter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-10 px-3 text-xs border-0 invisible"
              disabled
            >
              Сбросить
            </Button>
          </div>
        )}

        {/* Header section with filter title and buttons - all on one horizontal line */}
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
                  {userVehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => selectVehicle(vehicle)}
                      className={`text-xs px-2 py-0.5 rounded-md border whitespace-nowrap flex-shrink-0 ${
                        selectedVehicle === vehicle.id
                          ? "bg-[#D3DF3D] border-[#D3DF3D] text-[#1F1F1F]"
                          : "bg-white dark:bg-[#3A3A3A] border-[#D9D9DD] dark:border-[#3A3A3A] text-[#1F1F1F] dark:text-white"
                      }`}
                    >
                      {vehicle.name}
                    </button>
                  ))}
                </div>
                {/* Right gradient fade-out overlay */}
                <div
                  className={`absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-[#2A2A2A] to-transparent pointer-events-none z-10 transition-opacity duration-200 ${showRightGradient ? 'opacity-100' : 'opacity-0'}`}
                ></div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden">Мой гараж</span>
            </div>
          </div>

          {/* Toggle button for expanding/collapsing - moved to the middle */}
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

          {/* Winter tire type toggle - only show for winter season */}
          {season === "w" && (
            <div className="flex-1 max-w-[210px]">
              <style jsx>{`
                @keyframes spikeGlow {
                  0%, 100% {
                    box-shadow: 0 0 8px rgba(59, 130, 246, 0.5), 0 0 16px rgba(59, 130, 246, 0.5);
                  }
                  50% {
                    box-shadow: 0 0 12px rgba(59, 130, 246, 0.5), 0 0 24px rgba(59, 130, 246, 0.5);
                  }
                }
                .spike-btn-active {
                  animation: spikeGlow 2s ease-in-out infinite;
                }
              `}</style>
              <div
                className="relative h-8 w-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center z-0 overflow-hidden touch-pan-x"
                role="radiogroup"
                aria-label="Тип зимних шин"
                onTouchStart={(e) => {
                  const touch = e.touches[0]
                  e.currentTarget.dataset.touchStartX = touch.clientX.toString()
                }}
                onTouchEnd={(e) => {
                  const startX = parseFloat(e.currentTarget.dataset.touchStartX || "0")
                  const endX = e.changedTouches[0].clientX
                  const diff = endX - startX

                  // Swipe threshold
                  if (Math.abs(diff) > 30) {
                    // Swipe left - move to next option
                    if (diff < 0) {
                      if (spike === true) toggleSpikeParameter(false)
                      else if (spike === false) toggleSpikeParameter(null)
                    }
                    // Swipe right - move to previous option
                    else {
                      if (spike === null) toggleSpikeParameter(false)
                      else if (spike === false) toggleSpikeParameter(true)
                    }
                  }
                }}
              >
                {/* Toggle buttons */}
                <button
                  onClick={() => {
                    console.log("Setting spike filter to TRUE")
                    toggleSpikeParameter(true)
                  }}
                  className={`flex-1 h-full rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 z-10 relative mx-0.5 ${
                    spike === true
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold spike-btn-active"
                      : "text-[#1F1F1F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  aria-pressed={spike === true}
                  role="radio"
                  aria-checked={spike === true}
                >
                  Шип
                </button>
                <button
                  onClick={() => toggleSpikeParameter(false)}
                  className={`flex-1 h-full rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 z-10 relative mx-0.5 ${
                    spike === false
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold spike-btn-active"
                      : "text-[#1F1F1F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  aria-pressed={spike === false}
                  role="radio"
                  aria-checked={spike === false}
                >
                  Лип
                </button>
                <button
                  onClick={() => toggleSpikeParameter(null)}
                  className={`flex-1 h-full rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 z-10 relative mx-0.5 ${
                    spike === null
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold spike-btn-active"
                      : "text-[#1F1F1F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  aria-pressed={spike === null}
                  role="radio"
                  aria-checked={spike === null}
                >
                  Все
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick filter indicator - only show when filter is active and NOT on summer tab */}
        {quickFilterActive && season !== "s" && (
          <div className="bg-[#D3DF3D]/20 dark:bg-[#D3DF3D]/10 rounded-md p-2 mb-4 flex items-center justify-between">
            <span className="text-sm text-[#1F1F1F] dark:text-white">
              Быстрый фильтр активирован: популярный размер, только в наличии
            </span>
          </div>
        )}

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
                {/* RunFlat and Second Axis options as compact checkboxes */}
                <div className="w-full md:flex-1 border border-[#D9D9DD] dark:border-[#3A3A3A] rounded-md p-3 flex items-center justify-center">
                  <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="runflat"
                        checked={runflat}
                        onCheckedChange={(checked) => toggleRunflatParameter(!!checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="runflat" className="text-xs text-[#1F1F1F] dark:text-gray-300">
                        RunFlat
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="second-axis"
                        checked={secondAxis}
                        onCheckedChange={(checked) => setSecondAxis(!!checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="second-axis" className="text-xs text-[#1F1F1F] dark:text-gray-300">
                        Вторая ось
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cargo"
                        checked={cargo}
                        onCheckedChange={(checked) => toggleCargoParameter(!!checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="cargo" className="text-xs text-[#1F1F1F] dark:text-gray-300">
                        Грузовая
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="today"
                        checked={todayOnly}
                        onCheckedChange={(checked) => toggleTodayParameter(!!checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="today" className="text-xs text-[#1F1F1F] dark:text-gray-300">
                        Сегодня
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Filters in a row: Stock Filter and Price Range */}
                <div className="flex flex-wrap gap-3 w-full md:w-3/4">
                  {/* Stock Filter - Checkbox style button */}
                  <div className="w-[45%] sm:w-[30%] bg-[#F5F5F5] dark:bg-[#333333] rounded-md p-2">
                    <button
                      onClick={() => {
                        const newStockFilter = stockFilter === "single" ? "full" : "single"
                        setStockFilter(newStockFilter)

                        // Apply to URL parameters
                        const params = new URLSearchParams(searchParams.toString())
                        if (newStockFilter === "full") {
                          params.set("minStock", "4")
                        } else {
                          params.delete("minStock")
                        }
                        router.push(`${window.location.pathname}?${params.toString()}`)
                      }}
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
