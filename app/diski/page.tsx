"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import DiskSearchFilter from "./disk-search-filter"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import QuickFilterButtons from "@/components/quick-filter-buttons"
import DiskCard from "@/components/disk-card"
import CartButton from "@/components/cart-button"
import { BackButton } from "@/components/back-button"

// Тип для диска
interface Disk {
  id: string
  name: string
  price: number
  rrc: number
  stock: number
  image: string
  brand: string
  diameter: number
  width: number
  pcd: string
  et: number
  dia: number
  type: "stamped" | "cast" | "forged"
  color?: string
  isPromotional?: boolean
  provider?: string | null
  storehouse?: Record<string, number>
}

// Interface for disk pair (front and rear axle)
interface DiskPair {
  frontDisk: Disk
  rearDisk: Disk
  brandModel: string
}

export default function DiskiPage() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [diskType, setDiskType] = useState("cast") // stamped, cast, forged - начинаем с литых
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isCartButtonAnimating, setIsCartButtonAnimating] = useState(false)
  const castButtonRef = useRef<HTMLButtonElement>(null)
  const [buttonCoords, setButtonCoords] = useState({ x: 0, left: 0, right: 0, width: 0, center: 0 })
  const cartCountRef = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cartCountPosition, setCartCountPosition] = useState(0)
  const [cartLabelPosition, setCartLabelPosition] = useState(0)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [allDisks, setAllDisks] = useState<Disk[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<string>("default")
  const [filterHeight, setFilterHeight] = useState(200)
  const [displayLimit, setDisplayLimit] = useState(50) // Pagination: show 50 at a time
  const loadMoreRef = useRef<HTMLDivElement>(null) // Ref for infinite scroll trigger

  // Read filter values directly from URL parameters (like tire page)
  const filterDiameter = searchParams.get("diameter")
  const filterWidth = searchParams.get("width")
  const filterPcd = searchParams.get("pcd")
  const filterEt = searchParams.get("et")
  const filterHub = searchParams.get("hub")
  const filterColor = searchParams.get("color")
  const minPriceParam = searchParams.get("minPrice")
  const maxPriceParam = searchParams.get("maxPrice")
  const stockFilterParam = searchParams.get("stockFilter")

  // Second axis and additional filters
  const filterSecondAxis = searchParams.get("secondAxis") === "true"
  const filterTodayOnly = searchParams.get("today") === "true"
  const filterDiameter2 = searchParams.get("diameter2")
  const filterWidth2 = searchParams.get("width2")
  const filterEt2 = searchParams.get("et2")

  // Сброс курсора при загрузке страницы
  useEffect(() => {
    // Сбрасываем курсор на body и html
    document.body.style.cursor = "default"
    document.documentElement.style.cursor = "default"

    // Убираем crosshair если он был установлен
    const allElements = document.querySelectorAll('*')
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement
      if (htmlEl.style.cursor === 'crosshair') {
        htmlEl.style.cursor = 'default'
      }
    })

    return () => {
      // При размонтировании тоже сбрасываем
      document.body.style.cursor = "default"
      document.documentElement.style.cursor = "default"
    }
  }, [])

  // Загрузка всех дисков из API один раз
  useEffect(() => {
    const fetchDisks = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/wheels`)
        if (!response.ok) {
          throw new Error("Failed to fetch wheels")
        }
        const data = await response.json()
        setAllDisks(data.data || [])
      } catch (error) {
        console.error("Error fetching wheels:", error)
        setAllDisks([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchDisks()
  }, [])

  // Фильтруем диски по типу на клиенте - memoized
  const filteredByType = useMemo(() => {
    return allDisks.filter((disk) => disk.type === diskType)
  }, [allDisks, diskType])

  // Фильтруем по брендам - memoized
  const filteredByBrand = useMemo(() => {
    if (selectedBrands.length === 0) return filteredByType
    return filteredByType.filter((disk) => selectedBrands.includes(disk.brand))
  }, [filteredByType, selectedBrands])

  // Применяем фильтры из URL параметров - memoized (like tire page)
  const filteredDisks = useMemo(() => {
    return filteredByBrand.filter((disk) => {
      // Second axis filter logic: if enabled and specified, disk should match either main params OR second axis params
      if (filterSecondAxis && (filterDiameter2 || filterWidth2 || filterEt2)) {
        // Check if disk matches main axis parameters
        const matchesMainAxis = (
          (!filterDiameter || parseFloat(disk.diameter.toString()) === parseFloat(filterDiameter)) &&
          (!filterWidth || parseFloat(disk.width.toString()) === parseFloat(filterWidth)) &&
          (!filterEt || Math.abs(parseFloat(disk.et.toString()) - parseFloat(filterEt)) <= 5)
        )

        // Check if disk matches second axis parameters
        const matchesSecondAxis = (
          (!filterDiameter2 || parseFloat(disk.diameter.toString()) === parseFloat(filterDiameter2)) &&
          (!filterWidth2 || parseFloat(disk.width.toString()) === parseFloat(filterWidth2)) &&
          (!filterEt2 || Math.abs(parseFloat(disk.et.toString()) - parseFloat(filterEt2)) <= 5)
        )

        // Disk should match either main axis OR second axis
        if (!matchesMainAxis && !matchesSecondAxis) {
          return false
        }
      } else {
        // Normal filtering without second axis
        // Diameter filter
        if (filterDiameter && parseFloat(disk.diameter.toString()) !== parseFloat(filterDiameter)) {
          return false
        }

        // Width filter
        if (filterWidth && parseFloat(disk.width.toString()) !== parseFloat(filterWidth)) {
          return false
        }

        // ET filter - allow range of ±5
        if (filterEt) {
          const filterEtNum = parseFloat(filterEt)
          const diskEt = parseFloat(disk.et.toString())
          if (Math.abs(diskEt - filterEtNum) > 5) {
            return false
          }
        }
      }

      // PCD filter (always applies)
      if (filterPcd && disk.pcd !== filterPcd) {
        return false
      }

      // Hub/DIA filter - disk hub should be >= filter hub
      if (filterHub) {
        const filterHubNum = parseFloat(filterHub)
        const diskHub = parseFloat(disk.dia.toString())
        if (diskHub < filterHubNum) {
          return false
        }
      }

      // Color filter
      if (filterColor && disk.color !== filterColor) {
        return false
      }

      // Price range filter
      const minPrice = minPriceParam ? parseFloat(minPriceParam) : 3000
      const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : 30000
      if (disk.price < minPrice || disk.price > maxPrice) {
        return false
      }

      // Stock filter - hide disks with less than 4 items
      if (stockFilterParam === "full" && disk.stock < 4) {
        return false
      }

      // "Забрать сегодня" filter - show only disks available from main stock (provider null or empty)
      if (filterTodayOnly && disk.provider) {
        return false
      }

      return true
    })
  }, [filteredByBrand, filterDiameter, filterWidth, filterPcd, filterEt, filterHub, filterColor, minPriceParam, maxPriceParam, stockFilterParam, filterSecondAxis, filterDiameter2, filterWidth2, filterEt2, filterTodayOnly])

  // Применяем сортировку - memoized
  const sortedDisks = useMemo(() => {
    const sorted = [...filteredDisks]
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.price - a.price)
    }
    return sorted
  }, [filteredDisks, sortBy])

  // Helper function to get brand+model key for grouping
  const getBrandModelKey = (disk: Disk): string => {
    const brand = disk.brand || ""
    const model = disk.name || ""
    return `${brand.toLowerCase()}_${model.toLowerCase()}`
  }

  // Group disks by brand+model for second axis matching
  const diskPairs = useMemo((): DiskPair[] => {
    if (!filterSecondAxis || !filterDiameter2 || !filterWidth2 || !filterEt2) {
      return []
    }

    const pairs: DiskPair[] = []

    // Separate disks into main axis and second axis
    const mainAxisDisks: Disk[] = []
    const secondAxisDisks: Disk[] = []

    sortedDisks.forEach((disk) => {
      const matchesMainAxis = (
        (!filterDiameter || parseFloat(disk.diameter.toString()) === parseFloat(filterDiameter)) &&
        (!filterWidth || parseFloat(disk.width.toString()) === parseFloat(filterWidth)) &&
        (!filterEt || Math.abs(parseFloat(disk.et.toString()) - parseFloat(filterEt)) <= 5)
      )

      const matchesSecondAxis = (
        parseFloat(disk.diameter.toString()) === parseFloat(filterDiameter2) &&
        parseFloat(disk.width.toString()) === parseFloat(filterWidth2) &&
        Math.abs(parseFloat(disk.et.toString()) - parseFloat(filterEt2)) <= 5
      )

      if (matchesMainAxis) {
        mainAxisDisks.push(disk)
      }
      if (matchesSecondAxis) {
        secondAxisDisks.push(disk)
      }
    })

    // Create a map of second axis disks by brand+model
    const secondAxisDisksMap = new Map<string, Disk[]>()
    secondAxisDisks.forEach((disk) => {
      const key = getBrandModelKey(disk)
      if (!secondAxisDisksMap.has(key)) {
        secondAxisDisksMap.set(key, [])
      }
      secondAxisDisksMap.get(key)!.push(disk)
    })

    // Match main axis disks with second axis disks by brand+model
    mainAxisDisks.forEach((frontDisk) => {
      const key = getBrandModelKey(frontDisk)
      const matchingSecondAxisDisks = secondAxisDisksMap.get(key)

      if (matchingSecondAxisDisks && matchingSecondAxisDisks.length > 0) {
        // Find best matching second axis disk (same brand, model)
        const rearDisk = matchingSecondAxisDisks[0]
        pairs.push({
          frontDisk,
          rearDisk,
          brandModel: key,
        })
        // Remove used rear disk to avoid duplicates
        matchingSecondAxisDisks.shift()
      }
    })

    console.log(`Found ${pairs.length} matching disk pairs`)
    return pairs
  }, [sortedDisks, filterSecondAxis, filterDiameter2, filterWidth2, filterEt2, filterDiameter, filterWidth, filterEt])

  // Check if we should show paired view
  const showPairedView = filterSecondAxis && filterDiameter2 && filterWidth2 && filterEt2

  // Limit displayed disks for better performance
  const displayedDisks = useMemo(() => {
    return sortedDisks.slice(0, displayLimit)
  }, [sortedDisks, displayLimit])

  // Reset display limit when filters change
  useEffect(() => {
    setDisplayLimit(50)
  }, [filterDiameter, filterWidth, filterPcd, filterEt, filterHub, filterColor, minPriceParam, maxPriceParam, stockFilterParam, selectedBrands, sortBy, diskType, filterSecondAxis, filterDiameter2, filterWidth2, filterEt2, filterTodayOnly])

  // Infinite scroll: load more disks when scrolling to bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && displayLimit < sortedDisks.length) {
          setDisplayLimit((prev) => prev + 50)
        }
      },
      { threshold: 0.1 }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [displayLimit, sortedDisks.length])


  // Track cast button coordinates
  useEffect(() => {
    const updateCoords = () => {
      if (castButtonRef.current) {
        const rect = castButtonRef.current.getBoundingClientRect()
        setButtonCoords({
          x: rect.x,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          center: rect.left + rect.width / 2,
        })
      }
    }

    updateCoords()
    window.addEventListener("resize", updateCoords)
    return () => window.removeEventListener("resize", updateCoords)
  }, [])

  // Calculate position for cart count to be centered under the cast button
  useEffect(() => {
    const updateCartPosition = () => {
      if (containerRef.current && cartCountRef.current && castButtonRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const castButtonRect = castButtonRef.current.getBoundingClientRect()
        const cartCountRect = cartCountRef.current.getBoundingClientRect()

        const containerLeft = containerRect.left
        const castButtonCenter = castButtonRect.left + castButtonRect.width / 2
        const cartCountWidth = 100 // Используем новую ширину

        // Calculate the left position needed to center the element under the cast button
        const leftPosition = castButtonCenter - containerLeft - cartCountWidth / 2
        setCartCountPosition(leftPosition)

        // Calculate position for the "В корзине:" label to be right before the cart count
        setCartLabelPosition(leftPosition - 80) // 80px to the left of the cart count
      }
    }

    // Initial calculation
    updateCartPosition()

    // Set up a small delay to ensure the element has been positioned
    const timer = setTimeout(updateCartPosition, 100)

    // Update on resize
    window.addEventListener("resize", updateCartPosition)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", updateCartPosition)
    }
  }, [cartItemCount])


  // Convert searchParams to a regular object
  const createQueryString = (params: URLSearchParams) => {
    const queryParams: Record<string, string> = {}
    params.forEach((value, key) => {
      queryParams[key] = value
    })
    return queryParams
  }

  const queryParams = createQueryString(searchParams)

  // Check if dimension filter is active
  const isDimensionFilterActive =
    searchParams.has("width") && searchParams.has("profile") && searchParams.has("diameter")

  // Get current dimension values
  const currentWidth = searchParams.get("width") || ""
  const currentProfile = searchParams.get("profile") || ""
  const currentDiameter = searchParams.get("diameter") || ""

  // Format current size for display
  const currentSizeDisplay = isDimensionFilterActive ? `${currentWidth}/${currentProfile} R${currentDiameter}` : ""

  // Count active filters
  useEffect(() => {
    let count = 0
    if (searchParams.has("width")) count++
    if (searchParams.has("profile")) count++
    if (searchParams.has("diameter")) count++
    if (searchParams.has("minPrice") || searchParams.has("maxPrice")) count++
    if (searchParams.has("stock")) count++
    setActiveFiltersCount(count)
  }, [searchParams])

  // Получаем количество товаров в корзине
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        const newCount = cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0)

        // If cart count increased, trigger animation
        if (newCount > cartItemCount) {
          setIsCartButtonAnimating(true)
          setTimeout(() => setIsCartButtonAnimating(false), 600)
        }

        setCartItemCount(newCount)
      } catch (error) {
        console.error("Ошибка при получении данных корзины:", error)
        setCartItemCount(0)
      }
    }

    updateCartCount()
    window.addEventListener("cartUpdated", updateCartCount)
    window.addEventListener("cartItemAdded", updateCartCount)

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount)
      window.removeEventListener("cartItemAdded", updateCartCount)
    }
  }, [cartItemCount])

  const handleCartClick = () => {
    setIsCartButtonAnimating(true)
    setTimeout(() => {
      setIsCartButtonAnimating(false)
      router.push("/order")
    }, 300)
  }

  const handleClearCart = () => {
    // Clear the cart in localStorage
    localStorage.setItem("cart", "[]")
    // Update cart count
    setCartItemCount(0)
    // Dispatch event to notify other components
    window.dispatchEvent(new Event("cartUpdated"))
    // Dispatch a custom event to reset all tire card counters
    window.dispatchEvent(new CustomEvent("resetAllCartCounters"))
  }

  // Disk type-specific styles and animations - unified brand color
  const getDiskTypeStyles = () => {
    return {
      buttonStyle: {
        marginTop: "-6px",
        marginBottom: "-6px",
      },
      buttonClass: "border border-[#c4d402] bg-[#c4d402]/10 text-[#1F1F1F] dark:text-white font-medium",
      animationStyle: "",
    }
  }

  const { buttonStyle, buttonClass, animationStyle } = getDiskTypeStyles()

  // Helper function to get button classes for each disk type tab - unified brand color
  const getButtonClass = (tabDiskType: string) => {
    const isActive = diskType === tabDiskType
    const baseClass = "text-sm px-3 py-3 h-full flex items-center transition-all duration-200 ease-in-out"

    if (isActive) {
      return `${baseClass} ${buttonClass} rounded-xl`
    }

    return `${baseClass} border border-transparent hover:border-[#c4d402] hover:bg-[#c4d402]/10 text-[#1F1F1F] dark:text-white rounded-xl`
  }

  const handleBrandSelect = useCallback((brands: string[]) => {
    setSelectedBrands(brands)
    console.log("Выбранные бренды дисков:", brands)
  }, [])

  const handleSortChange = useCallback((sortValue: string) => {
    setSortBy(sortValue)
    console.log("Применена сортировка:", sortValue)
  }, [])

  const handleDiskTypeChange = useCallback((type: "stamped" | "cast" | "forged") => {
    setDiskType(type)
  }, [])


  // Определяем позицию для индикатора корзины в зависимости от наличия фильтра размеров
  const cartIndicatorTopClass = isDimensionFilterActive ? "top-24" : "top-16"

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212] pt-[60px]">
      <style jsx global>
        {`
          /* Carousel Horizontal styles - Dynamic Island style */
          .carousel-container {
            position: fixed;
            left: 50%;
            top: 30px;
            transform: translateX(-50%) translateY(-50%);
            height: 34px;
            z-index: 51;
            -webkit-tap-highlight-color: transparent;
          }

          .carousel-track {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
          }

          .carousel-item {
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            white-space: nowrap;
            -webkit-tap-highlight-color: transparent;
            outline: none;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .carousel-highlight {
            position: absolute;
            background: #c4d402;
            border-radius: 50px;
            z-index: 2;
            pointer-events: none;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .carousel-item-center {
            padding: 7px 18px;
            background: #c4d402;
            color: #1F1F1F;
            font-size: 14px;
            font-weight: 600;
            border-radius: 50px;
            z-index: 3;
          }

          .carousel-item-center-text {
            padding: 7px 18px;
            background: transparent;
            color: #1F1F1F;
            font-size: 14px;
            font-weight: 600;
            border-radius: 50px;
            z-index: 3;
          }

          .carousel-item-side {
            position: absolute;
            padding: 5px 10px;
            background: transparent;
            color: #6B7280;
            font-size: 11px;
            font-weight: 500;
            border-radius: 50px;
            z-index: 4;
            opacity: 0.5;
            top: 50%;
          }

          .carousel-item-left {
            right: calc(50% + 60px);
            transform: translateY(-50%);
          }

          .carousel-item-right {
            left: calc(50% + 60px);
            transform: translateY(-50%);
          }

          .dark .carousel-item-side {
            color: #9CA3AF;
          }

          @media (hover: hover) {
            .carousel-item-side:hover {
              opacity: 0.8;
              background: rgba(128, 128, 128, 0.1);
            }
          }

          /* Hide scrollbar but keep scroll functionality */
          .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;  /* Chrome, Safari and Opera */
          }

          /* Cart button animation */
          @keyframes cartPulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(211, 223, 61, 0.7);
            }
            50% {
              transform: scale(1.15);
              box-shadow: 0 0 10px 5px rgba(211, 223, 61, 0.5);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(211, 223, 61, 0);
            }
          }

          .cart-button-pulse {
            animation: cartPulse 0.6s ease-in-out;
          }

          /* Cart badge pop animation */
          @keyframes badgePop {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.4);
            }
            100% {
              transform: scale(1);
            }
          }

          .cart-badge-animate {
            animation: badgePop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }

          /* Cart icon bounce */
          @keyframes cartIconBounce {
            0%, 100% {
              transform: translateY(0) scaleX(-1);
            }
            25% {
              transform: translateY(-4px) scaleX(-1);
            }
            50% {
              transform: translateY(0) scaleX(-1);
            }
            75% {
              transform: translateY(-2px) scaleX(-1);
            }
          }

          .cart-icon-bounce {
            animation: cartIconBounce 0.5s ease-in-out;
          }

        `}
      </style>


      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1F1F1F] shadow-sm flex flex-col items-center h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] overflow-visible"
        style={{ "--header-height": "60px" } as React.CSSProperties}
      >
        <div className="container max-w-md flex items-center justify-center h-full relative overflow-visible">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-50">
            <BackButton />
          </div>

          {/* Disk Type Horizontal Carousel */}
          {(() => {
            const tabs = [
              { key: "stamped", label: "Штампы" },
              { key: "cast", label: "Литые" },
              { key: "forged", label: "Кованные" },
            ]

            // Current active index
            const activeIndex = diskType === "stamped" ? 0 : diskType === "cast" ? 1 : 2

            // Get prev and next indices (circular)
            const prevIndex = (activeIndex - 1 + 3) % 3
            const nextIndex = (activeIndex + 1) % 3

            // Order: [prev, active, next]
            const orderedTabs = [
              { ...tabs[prevIndex], position: 'left' },
              { ...tabs[activeIndex], position: 'center' },
              { ...tabs[nextIndex], position: 'right' },
            ]

            return (
              <div className="carousel-container">
                {/* Yellow highlight background - stays in place with fixed width */}
                <div
                  className="carousel-highlight"
                  style={{
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    width: '120px',
                    minWidth: '120px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                />

                {/* Static text labels */}
                <div className="carousel-track">
                  {orderedTabs.map((tab) => {
                    const isCenter = tab.position === 'center'
                    const positionClass = isCenter
                      ? 'carousel-item-center-text'
                      : `carousel-item-side carousel-item-${tab.position}`

                    if (isCenter) {
                      return (
                        <div
                          key={tab.key}
                          className={`carousel-item ${positionClass}`}
                        >
                          <div
                            style={{
                              position: 'relative',
                              overflow: 'hidden',
                              width: '110px',
                              height: '20px',
                            }}
                          >
                            <span
                              style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                whiteSpace: 'nowrap',
                                transform: 'translate(-50%, -50%)',
                              }}
                            >
                              {tab.label}
                            </span>
                          </div>
                        </div>
                      )
                    }

                    // Side arrows - clickable buttons
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setDiskType(tab.key as "stamped" | "cast" | "forged")}
                        className={`carousel-item ${positionClass}`}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {tab.position === 'left' ? (
                          <ChevronLeft
                            className="w-[25px] h-[25px]"
                            style={{
                              color: '#B0B5BD',
                              opacity: 0.7,
                            }}
                          />
                        ) : (
                          <ChevronRight
                            className="w-[25px] h-[25px]"
                            style={{
                              color: '#B0B5BD',
                              opacity: 0.7,
                            }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })()}

        </div>
        {/* Global cart button - outside container */}
        <div style={{ position: 'fixed', right: '16px', top: '30px', transform: 'translateY(-50%)', zIndex: 100 }}>
          <CartButton />
        </div>
      </header>

      <div className="flex-1 px-4 pt-4 pb-4 space-y-4">
        <QuickFilterButtons
          insideTireResults={true}
          onBrandSelect={handleBrandSelect}
          onSortChange={handleSortChange}
          activeFiltersCount={selectedBrands.length}
        />

        {/* Адаптивная сетка карточек дисков */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#009CFF]"></div>
            </div>
          </div>
        ) : showPairedView && diskPairs.length === 0 && sortedDisks.length > 0 ? (
          <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-8 text-center mt-8">
            <h3 className="text-xl font-bold mb-2 text-[#1F1F1F] dark:text-white">Пары дисков не найдены</h3>
            <p className="text-[#1F1F1F] dark:text-white mb-4">
              Не удалось найти диски с одинаковым брендом и моделью для обоих размеров.
              <br />
              Попробуйте изменить размеры осей.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Передняя ось: {filterWidth}J x R{filterDiameter} ET{filterEt}
              <br />
              Задняя ось: {filterWidth2}J x R{filterDiameter2} ET{filterEt2}
            </p>
          </div>
        ) : sortedDisks.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">Диски не найдены</p>
            </div>
          </div>
        ) : showPairedView && diskPairs.length > 0 ? (
          // Paired view when second axis is enabled
          <div className="space-y-4" style={{ paddingBottom: `${filterHeight + 20}px` }}>
            {/* Header showing pair count */}
            <div className="bg-[#c4d402]/20 dark:bg-[#c4d402]/10 rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">
                Найдено пар: {diskPairs.length}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {filterWidth}J x R{filterDiameter} ET{filterEt} + {filterWidth2}J x R{filterDiameter2} ET{filterEt2}
              </span>
            </div>

            {/* Disk pairs */}
            {diskPairs.map((pair, index) => (
              <div
                key={`pair-${index}-${pair.frontDisk.id}-${pair.rearDisk.id}`}
                className="bg-gray-100 dark:bg-[#333333] rounded-xl p-2 space-y-2"
              >
                {/* Pair header */}
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {pair.frontDisk.brand} {pair.frontDisk.name}
                  </span>
                  <span className="text-xs bg-[#c4d402] text-[#1F1F1F] px-2 py-0.5 rounded-full">
                    Пара #{index + 1}
                  </span>
                </div>

                {/* Front axis disk - labeled */}
                <div className="relative">
                  <div className="absolute left-2 top-2 z-10 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                    Передняя ось
                  </div>
                  <DiskCard disk={pair.frontDisk} />
                </div>

                {/* Rear axis disk - labeled */}
                <div className="relative">
                  <div className="absolute left-2 top-2 z-10 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                    Задняя ось
                  </div>
                  <DiskCard disk={pair.rearDisk} />
                </div>

                {/* Combined price */}
                <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-[#2A2A2A] rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Комплект (4 шт):</span>
                  <span className="text-lg font-bold text-[#1F1F1F] dark:text-white">
                    {((pair.frontDisk.price || 0) * 2 + (pair.rearDisk.price || 0) * 2).toLocaleString()} ₽
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Default view - single axis
          <>
            <div
              className="space-y-3 sm:space-y-4 sm:grid sm:grid-cols-1 sm:gap-3 sm:space-y-0 md:grid-cols-2 md:gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
            >
              {displayedDisks.map((disk) => (
                <div key={disk.id} className="w-full">
                  <DiskCard disk={disk} />
                </div>
              ))}
            </div>

            {/* Infinite scroll trigger */}
            {displayLimit < sortedDisks.length && (
              <div
                ref={loadMoreRef}
                className="flex justify-center py-6"
                style={{ paddingBottom: `${filterHeight + 20}px` }}
              >
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#009CFF]"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Загрузка...
                  </p>
                </div>
              </div>
            )}
            {displayLimit >= sortedDisks.length && (
              <div style={{ paddingBottom: `${filterHeight + 20}px` }} />
            )}
          </>
        )}
      </div>

      {/* Fixed filter at the bottom */}
      <DiskSearchFilter
        diskType={diskType}
        onDiskTypeChange={handleDiskTypeChange}
        onFilterHeightChange={setFilterHeight}
      />
    </main>
  )
}
