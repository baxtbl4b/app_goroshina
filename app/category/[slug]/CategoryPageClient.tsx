"use client"

import type React from "react"

import { ChevronLeft } from "lucide-react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import TireSearchFilter from "@/components/tire-search-filter"
import TireResults from "@/components/tire-results"
import QuickFilterButtons from "@/components/quick-filter-buttons"
import CartButton from "@/components/cart-button"
import { useState, useEffect, useRef } from "react"

interface CategoryPageClientProps {
  season: "s" | "w" | "a"
}

export default function CategoryPageClient({ season }: CategoryPageClientProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isCartButtonAnimating, setIsCartButtonAnimating] = useState(false)
  const [isCartAnimating, setIsCartAnimating] = useState(false)
  const winterButtonRef = useRef<HTMLButtonElement>(null)
  const [buttonCoords, setButtonCoords] = useState({ x: 0, left: 0, right: 0, width: 0, center: 0 })
  const cartCountRef = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cartCountPosition, setCartCountPosition] = useState(0)
  const [cartLabelPosition, setCartLabelPosition] = useState(0)

  // Inspector mode state
  const [inspectorMode, setInspectorMode] = useState(false)

  // Swipe handling for season tabs
  const touchStartRef = useRef<number | null>(null)
  const touchEndRef = useRef<number | null>(null)
  const minSwipeDistance = 50

  const seasonsList = [
    { key: "s", path: "/category/summer" },
    { key: "w", path: "/category/winter" },
    { key: "a", path: "/category/all-season" },
  ]

  const currentSeasonIndex = seasonsList.findIndex((s) => s.key === season)

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndRef.current = null
    touchStartRef.current = e.targetTouches[0].clientX
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX
  }

  const onTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return

    const distance = touchStartRef.current - touchEndRef.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    const params = new URLSearchParams(searchParams.toString())

    if (isLeftSwipe) {
      // Swipe left = next season (circular)
      const nextIndex = (currentSeasonIndex + 1) % seasonsList.length
      router.push(`${seasonsList[nextIndex].path}?${params.toString()}`)
    } else if (isRightSwipe) {
      // Swipe right = previous season (circular)
      const prevIndex = (currentSeasonIndex - 1 + seasonsList.length) % seasonsList.length
      router.push(`${seasonsList[prevIndex].path}?${params.toString()}`)
    }

    touchStartRef.current = null
    touchEndRef.current = null
  }
  const [hoveredElement, setHoveredElement] = useState<{ name: string; x: number; y: number } | null>(null)

  // Track winter button coordinates
  useEffect(() => {
    const updateCoords = () => {
      if (winterButtonRef.current) {
        const rect = winterButtonRef.current.getBoundingClientRect()
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

  // Calculate position for cart count to be centered under the winter button
  useEffect(() => {
    const updateCartPosition = () => {
      if (containerRef.current && cartCountRef.current && winterButtonRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const winterButtonRect = winterButtonRef.current.getBoundingClientRect()
        const cartCountRect = cartCountRef.current.getBoundingClientRect()

        const containerLeft = containerRect.left
        const winterButtonCenter = winterButtonRect.left + winterButtonRect.width / 2
        const cartCountWidth = 100 // Используем новую ширину

        // Calculate the left position needed to center the element under the winter button
        const leftPosition = winterButtonCenter - containerLeft - cartCountWidth / 2
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

  // Inspector mode event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "i") {
        setInspectorMode((prev) => !prev)
        if (!inspectorMode) {
          document.body.style.cursor = "crosshair"
        } else {
          document.body.style.cursor = "default"
          setHoveredElement(null)
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (inspectorMode) {
        const element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement
        if (element) {
          // Get element info
          let name = element.tagName.toLowerCase()

          // Add class if available
          if (element.className && typeof element.className === "string") {
            const firstClass = element.className.split(" ")[0]
            if (firstClass) name += `.${firstClass}`
          }

          // Add id if available
          if (element.id) name += `#${element.id}`

          // Add data attributes if available
          const dataAttrs = Array.from(element.attributes)
            .filter((attr) => attr.name.startsWith("data-"))
            .map((attr) => `[${attr.name}="${attr.value}"]`)
            .join("")

          if (dataAttrs) name += dataAttrs

          setHoveredElement({
            name,
            x: e.clientX + 15, // Offset from cursor
            y: e.clientY + 15,
          })
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.style.cursor = "default"
    }
  }, [inspectorMode])

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

  const handleSortChange = (value: string) => {
    console.log("Sort changed to:", value)
    // Here you would implement the actual sorting logic
  }

  const handleFilterToggle = () => {
    // This could scroll to the filter section or toggle its visibility on mobile
    const filterElement = document.querySelector(".tire-search-filter")
    if (filterElement) {
      filterElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Function to clear dimension filter
  const clearDimensionFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("width")
    params.delete("profile")
    params.delete("diameter")
    router.push(`${pathname}?${params.toString()}`)
    console.log("Dimension filter cleared") // Add logging for debugging
  }

  // Определяем позицию для индикатора корзины в зависимости от наличия фильтра размеров
  const cartIndicatorTopClass = isDimensionFilterActive ? "top-24" : "top-16"

  const [spike, setSpike] = useState<boolean | null>(null)

  const toggleSpikeParameter = (value: boolean | null) => {
    setSpike(value)
    const params = new URLSearchParams(searchParams.toString())

    if (value === true) {
      params.set("spike", "true")
    } else if (value === false) {
      params.set("spike", "false")
    } else {
      params.delete("spike")
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const quickFilterActive = searchParams.has("popularSize") && searchParams.has("stock")

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212] pt-[60px]">
      <style jsx global>
        {`
          /* Cart button animation */
          @keyframes cartButtonAnimation {
            0% {
              transform: scale(1);
              background-color: rgba(215, 224, 88, 0.1);
            }
            50% {
              transform: scale(1.05);
              background-color: rgba(215, 224, 88, 0.3);
              box-shadow: 0 0 15px rgba(215, 224, 88, 0.4);
            }
            100% {
              transform: scale(1);
              background-color: rgba(215, 224, 88, 0.1);
            }
          }

          @keyframes borderFlash {
            0% {
              border-color: rgba(215, 224, 88, 0.5);
            }
            50% {
              border-color: rgba(215, 224, 88, 1);
            }
            100% {
              border-color: rgba(215, 224, 88, 0.5);
            }
          }

          .cart-button-animated {
            animation: cartButtonAnimation 2s ease-in-out infinite, borderFlash 2s ease-in-out infinite;
            position: relative;
            overflow: hidden;
          }

          .cart-button-animated::before {
            content: "";
            position: absolute;
            top: -100%;
            left: -100%;
            width: 300%;
            height: 300%;
            background: linear-gradient(45deg, 
              rgba(255, 255, 255, 0) 0%, 
              rgba(255, 255, 255, 0.1) 50%, 
              rgba(255, 255, 255, 0) 100%);
            transform-origin: center;
            animation: shineEffect 3s linear infinite;
            z-index: 0;
            pointer-events: none;
          }

          @keyframes shineEffect {
            0% {
              transform: translateX(-100%) translateY(-100%) rotate(45deg);
            }
            100% {
              transform: translateX(100%) translateY(100%) rotate(45deg);
            }
          }
          
          /* Cart indicator container animation - removed */
          /* 
          @keyframes containerBorderPulse {
            0% {
              box-shadow: 0 0 0 1px rgba(215, 224, 88, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            50% {
              box-shadow: 0 0 0 2px rgba(215, 224, 88, 0.3), 0 4px 15px rgba(0, 0, 0, 0.2);
            }
            100% {
              box-shadow: 0 0 0 1px rgba(215, 224, 88, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1);
            }
          }

          .cart-container-animated {
            animation: containerBorderPulse 4s ease-in-out infinite;
          }
          */
          
          /* Basket icon animation */
          @keyframes basketBounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }
          
          .basket-icon-animated {
            animation: basketBounce 2s ease-in-out infinite;
          }
          
          .element-inspector {
            position: fixed;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 9999;
            pointer-events: none;
            max-width: 300px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          ${
            inspectorMode
              ? `
          * {
            outline: 1px dashed rgba(255, 0, 0, 0.5) !important;
          }
          *:hover {
            outline: 2px solid rgba(255, 0, 0, 0.8) !important;
          }
          `
              : ""
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

          /* Анимация покачивания корзины */
          @keyframes cartWiggle {
            0%, 100% {
              transform: rotate(0deg);
            }
            15% {
              transform: rotate(-15deg);
            }
            30% {
              transform: rotate(12deg);
            }
            45% {
              transform: rotate(-10deg);
            }
            60% {
              transform: rotate(8deg);
            }
            75% {
              transform: rotate(-5deg);
            }
            90% {
              transform: rotate(3deg);
            }
          }

          /* Анимация прыжка с отскоком */
          @keyframes cartJump {
            0% {
              transform: translateY(0) scale(1);
            }
            20% {
              transform: translateY(-12px) scale(1.1);
            }
            40% {
              transform: translateY(0) scale(0.95);
            }
            60% {
              transform: translateY(-6px) scale(1.05);
            }
            80% {
              transform: translateY(0) scale(0.98);
            }
            100% {
              transform: translateY(0) scale(1);
            }
          }

          /* Анимация появления бейджа */
          @keyframes badgePop {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.4);
              opacity: 1;
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          .cart-icon-bounce {
            animation: cartWiggle 0.5s ease-in-out;
          }

          /* Анимация бейджа */
          .cart-badge-animate {
            animation: badgePop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }

          /* Global cart button styles - IMPORTANT: Use these exact styles for all cart buttons across the app */
          .global-cart-button {
            position: fixed;
            top: 5px;
            right: 0;
            z-index: 100;
            padding: 8px;
            border-radius: 9999px;
            background-color: transparent;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease-in-out;
          }

          .global-cart-button:hover {
            background-color: rgba(0, 0, 0, 0.05);
          }

          .dark .global-cart-button:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }

          /* Hide scrollbar but keep scroll functionality */
          .hide-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;  /* Chrome, Safari and Opera */
          }

          /* Season tabs styles */
          .season-tabs-container {
            position: fixed;
            left: 50%;
            top: 30px;
            transform: translateX(-50%) translateY(-50%);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            touch-action: pan-y pinch-zoom;
            user-select: none;
            -webkit-user-select: none;
            cursor: grab;
            z-index: 51;
          }

          .season-tab {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px 8px;
            border-radius: 20px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            white-space: nowrap;
            text-align: center;
            width: 95px;
          }

          .season-tab-active {
            position: relative;
            overflow: hidden;
            transform: scale(1.1);
            background: var(--tab-color);
            border: none;
            color: #1F1F1F;
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0.2px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            z-index: 2;
          }

          .season-tab-inactive {
            transform: scale(0.85);
            background: rgba(128, 128, 128, 0.1);
            border: 1px solid transparent;
            color: #6B7280;
            font-size: 11px;
            opacity: 0.8;
            backdrop-filter: blur(4px);
          }

          .season-tab-inactive:hover {
            opacity: 1;
            background: rgba(211, 223, 61, 0.1);
            border-color: rgba(211, 223, 61, 0.3);
            transform: scale(0.88);
          }

          .dark .season-tab-inactive {
            color: #9CA3AF;
            background: rgba(255, 255, 255, 0.05);
          }

          .dark .season-tab-inactive:hover {
            color: white;
            background: rgba(211, 223, 61, 0.15);
            border-color: rgba(211, 223, 61, 0.3);
          }

          /* Cart pulsation when has items */
          @keyframes cartPulseGlow {
            0%, 100% {
              filter: brightness(0) saturate(100%) invert(83%) sepia(44%) saturate(484%) hue-rotate(22deg) brightness(97%) contrast(91%) drop-shadow(0 0 2px rgba(211, 223, 61, 0.5));
            }
            50% {
              filter: brightness(0) saturate(100%) invert(83%) sepia(44%) saturate(484%) hue-rotate(22deg) brightness(97%) contrast(91%) drop-shadow(0 0 8px rgba(211, 223, 61, 0.9));
            }
          }

          /* Rare wobble animation */
          @keyframes cartWobble {
            0%, 90%, 100% {
              transform: rotate(0deg) scaleX(-1);
            }
            92% {
              transform: rotate(-8deg) scaleX(-1);
            }
            94% {
              transform: rotate(6deg) scaleX(-1);
            }
            96% {
              transform: rotate(-4deg) scaleX(-1);
            }
            98% {
              transform: rotate(2deg) scaleX(-1);
            }
          }

          .cart-has-items {
            animation: cartPulseGlow 2s ease-in-out infinite, cartWobble 6s ease-in-out infinite;
          }
        `}
      </style>

      {/* Element inspector tooltip */}
      {inspectorMode && hoveredElement && (
        <div
          className="element-inspector"
          style={{
            left: `${hoveredElement.x}px`,
            top: `${hoveredElement.y}px`,
          }}
        >
          {hoveredElement.name}
        </div>
      )}

      {/* Inspector mode indicator */}
      {inspectorMode && (
        <div className="fixed top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs z-50">
          Режим инспектора активен (нажмите 'i' для выключения)
        </div>
      )}

      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1F1F1F] shadow-sm flex flex-col items-center h-[60px]"
        style={{ "--header-height": "60px" } as React.CSSProperties}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="container max-w-md flex items-center justify-center h-full relative overflow-hidden">
          <button
            onClick={() => router.push("/")}
            className="fixed left-0 top-[30px] -translate-y-1/2 p-2 transition-colors z-50"
            aria-label="На главную"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Season tabs with centered active element */}
          <div
            className="season-tabs-container"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {[
              { key: "s", label: "Летние", path: "/category/summer", color: "#D3DF3D" },
              { key: "w", label: "Зимние", path: "/category/winter", color: "#D3DF3D" },
              { key: "a", label: "Всесезонные", path: "/category/all-season", color: "#D3DF3D" },
            ].map((tab) => {
              const isActive = season === tab.key
              const activeIndex = season === "s" ? 0 : season === "w" ? 1 : 2
              const tabIndex = tab.key === "s" ? 0 : tab.key === "w" ? 1 : 2

              // Calculate order for circular carousel (prev - active - next)
              // Order: s(0) -> w(1) -> a(2) -> s(0) ...
              let order = tabIndex
              if (activeIndex === 0) {
                // s active: a(prev), s(center), w(next)
                if (tabIndex === 0) order = 1      // s -> center
                else if (tabIndex === 1) order = 2 // w -> right (next)
                else order = 0                      // a -> left (prev)
              } else if (activeIndex === 1) {
                // w active: s(prev), w(center), a(next)
                if (tabIndex === 0) order = 0      // s -> left (prev)
                else if (tabIndex === 1) order = 1 // w -> center
                else order = 2                      // a -> right (next)
              } else if (activeIndex === 2) {
                // a active: w(prev), a(center), s(next)
                if (tabIndex === 0) order = 2      // s -> right (next)
                else if (tabIndex === 1) order = 0 // w -> left (prev)
                else order = 1                      // a -> center
              }

              return (
                <Link
                  key={tab.key}
                  href={{ pathname: tab.path, query: queryParams }}
                  className={`season-tab ${isActive ? "season-tab-active" : "season-tab-inactive"}`}
                  style={{
                    order,
                    "--tab-color": tab.color,
                  } as React.CSSProperties}
                >
                  <span>{tab.label}</span>
                </Link>
              )
            })}
          </div>

        </div>
        {/* Global cart button - outside container */}
        <div style={{ position: 'fixed', right: '8px', top: '30px', transform: 'translateY(-50%)', zIndex: 100 }}>
          <CartButton />
        </div>
      </header>

      {/* Quick size links section */}
      <div className="px-4 mb-4 mt-4 overflow-hidden">
        <div className="flex gap-2 overflow-x-auto snap-x hide-scrollbar">
          {[
            { label: "195/65 R15", width: "195", profile: "65", diameter: "15" },
            { label: "205/55 R16", width: "205", profile: "55", diameter: "16" },
            { label: "225/45 R17", width: "225", profile: "45", diameter: "17" },
            { label: "235/35 R19", width: "235", profile: "35", diameter: "19" },
            { label: "215/60 R16", width: "215", profile: "60", diameter: "16" },
            { label: "225/50 R17", width: "225", profile: "50", diameter: "17" },
          ].map((size) => (
            <button
              key={size.label}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                params.set("width", size.width)
                params.set("profile", size.profile)
                params.set("diameter", size.diameter)
                router.push(`${pathname}?${params.toString()}`)
              }}
              className={`text-xs py-1.5 px-2.5 rounded-md border transition-all duration-200 whitespace-nowrap snap-start flex-shrink-0 ${
                currentWidth === size.width && currentProfile === size.profile && currentDiameter === size.diameter
                  ? "bg-[#D3DF3D] text-[#1F1F1F] border-[#D3DF3D] font-medium"
                  : "border-[#D9D9DD] dark:border-[#3A3A3A] text-[#1F1F1F] dark:text-white hover:border-[#D3DF3D] hover:bg-[#D3DF3D]/10"
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter section below header */}
      <div className="sticky top-[60px] z-40 w-full">
        <TireSearchFilter season={season} />
      </div>

      <div className="flex-1 px-4 pb-4 space-y-4">
        <QuickFilterButtons
          onSortChange={handleSortChange}
          onFilterToggle={handleFilterToggle}
          activeFiltersCount={activeFiltersCount}
        />
        <TireResults season={season} />
      </div>
    </main>
  )
}
