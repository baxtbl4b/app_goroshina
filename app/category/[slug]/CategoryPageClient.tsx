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
          setIsCartAnimating(true)
          setTimeout(() => setIsCartAnimating(false), 1000)
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

  // Season-specific styles and animations
  const getSeasonStyles = () => {
    switch (season) {
      case "s":
        return {
          buttonStyle: {
            marginTop: "-6px",
            marginBottom: "-6px",
          },
          buttonClass: "relative overflow-hidden summer-button-active text-[#1F1F1F] dark:text-white font-medium",
          animationStyle: `
.summer-button-active {
  background: linear-gradient(120deg, rgba(255, 236, 179, 0.15), rgba(255, 193, 7, 0.2));
  border: 1px solid rgba(255, 193, 7, 0.6);
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.3);
  position: relative;
}

.summer-button-active::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: summerShine 3s infinite;
  z-index: 1;
}

@keyframes summerShine {
  0% {
    left: -100%;
  }
  20%, 100% {
    left: 100%;
  }
}
`,
        }
      case "w":
        return {
          buttonStyle: {
            marginTop: "-6px",
            marginBottom: "-6px",
          },
          buttonClass: "relative overflow-hidden winter-button-active text-[#1F1F1F] dark:text-white font-medium",
          animationStyle: `
.winter-button-active {
  background: linear-gradient(120deg, rgba(224, 242, 254, 0.15), rgba(59, 130, 246, 0.2));
  border: 1px solid rgba(59, 130, 246, 0.6);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
  position: relative;
}

.winter-button-active::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: winterShine 3s infinite;
  z-index: 1;
}

@keyframes winterShine {
  0% {
    left: -100%;
  }
  20%, 100% {
    left: 100%;
  }
}
`,
        }
      case "a":
        return {
          buttonStyle: {
            marginTop: "-6px",
            marginBottom: "-6px",
          },
          buttonClass: "relative overflow-hidden allseason-button-active text-[#1F1F1F] dark:text-white font-medium",
          animationStyle: `
      .allseason-button-active {
        background: linear-gradient(120deg, rgba(236, 253, 245, 0.15), rgba(16, 185, 129, 0.2));
        border: 1px solid rgba(16, 185, 129, 0.6);
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
        position: relative;
      }
      
      .allseason-button-active::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.4) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        animation: allseasonShine 3s infinite;
        z-index: 1;
      }
      
      @keyframes allseasonShine {
        0% {
          left: -100%;
        }
        20%, 100% {
          left: 100%;
        }
      }
      
      .allseason-gradient {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          45deg,
          rgba(16, 185, 129, 0.1) 0%,
          rgba(245, 158, 11, 0.1) 50%,
          rgba(16, 185, 129, 0.1) 100%
        );
        background-size: 200% 200%;
        animation: allseasonGradient 6s ease infinite;
        z-index: 0;
      }
      
      @keyframes allseasonGradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    `,
        }
      default:
        return {
          buttonStyle: {
            marginTop: "-6px",
            marginBottom: "-6px",
          },
          buttonClass: "",
          animationStyle: "",
        }
    }
  }

  const getButtonClass = (tabSeason: "s" | "w" | "a") => {
    const isActive = season === tabSeason
    const baseClass =
      "text-sm px-3 py-3 h-full flex items-center justify-center transition-all duration-300 ease-in-out"

    if (isActive) {
      return `${baseClass} ${tabSeason === season ? buttonClass : ""}`
    }

    switch (tabSeason) {
      case "s":
        return `${baseClass} border border-transparent hover:border-[#FFB300] hover:bg-gradient-to-r hover:from-[#FFB300]/5 hover:to-[#FFB300]/10 text-[#1F1F1F] dark:text-white`
      case "w":
        return `${baseClass} border border-transparent hover:border-[#3B82F6] hover:bg-gradient-to-r hover:from-[#3B82F6]/5 hover:to-[#3B82F6]/10 text-[#1F1F1F] dark:text-white`
      case "a":
        return `${baseClass} border border-transparent hover:border-[#10B981] hover:bg-gradient-to-r hover:from-[#10B981]/5 hover:to-[#10B981]/10 text-[#1F1F1F] dark:text-white`
      default:
        return baseClass
    }
  }

  const { buttonStyle, buttonClass, animationStyle } = getSeasonStyles()

  // Helper function to get button classes for each season tab
  // const getButtonClass = (tabSeason: string) => {
  //   const isActive = slug === tabSeason
  //   const baseClass = "text-sm px-3 py-3 h-full flex items-center"

  //   if (isActive) {
  //     return `${baseClass} ${tabSeason === slug ? buttonClass : ""}`
  //   }

  //   switch (tabSeason) {
  //     case "summer":
  //       return `${baseClass} border border-transparent hover:border-[#D3DF3D] hover:bg-[#D3DF3D]/10 transition-all duration-200 ease-in-out text-[#1F1F1F] dark:text-white`
  //     case "winter":
  //       return `${baseClass} border border-transparent hover:border-[#3D8DDF] hover:bg-[#3D8DDF]/10 transition-all duration-200 ease-in-out text-[#1F1F1F] dark:text-white`
  //     case "all-season":
  //       return `${baseClass} border border-transparent hover:border-gradient-to-r hover:from-yellow-400 hover:to-green-400 hover:bg-gradient-to-r hover:from-yellow-400/10 hover:to-green-400/10 transition-all duration-200 ease-in-out text-[#1F1F1F] dark:text-white`
  //     default:
  //       return baseClass
  //   }
  // }

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
          ${animationStyle}
          
          /* New cart button animation */
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

          @keyframes cartIconBounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-4px);
            }
          }

          .cart-icon-bounce {
            animation: cartIconBounce 0.6s ease-in-out;
          }
          
          /* Global cart button styles - IMPORTANT: Use these exact styles for all cart buttons across the app */
          .global-cart-button {
            position: fixed;
            top: 5px;
            right: 16px;
            z-index: 100;
            padding: 8px;
            border-radius: 9999px;
            background-color: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease-in-out;
          }
          
          .dark .global-cart-button {
            background-color: #1F1F1F;
          }
          
          .global-cart-button:hover {
            background-color: #f3f4f6;
          }
          
          .dark .global-cart-button:hover {
            background-color: #2d2d2d;
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
        className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1F1F1F] py-2 shadow-sm flex flex-col items-center"
        style={{ "--header-height": "60px" } as React.CSSProperties}
      >
        <div className="container max-w-md flex items-center justify-center h-full relative">
          <button
            onClick={() => router.push("/")}
            className="fixed left-0 top-2 p-2 rounded-tr-md rounded-br-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-50 bg-white dark:bg-[#1F1F1F]"
            aria-label="На главную"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>

          <div className="flex items-center justify-center space-x-2 h-full">
            <Link href={{ pathname: "/category/summer", query: queryParams }} className="h-full">
              <Button
                variant="ghost"
                className={getButtonClass("s")}
                style={season === "s" ? buttonStyle : { marginTop: "-6px", marginBottom: "-6px" }}
              >
                <span className="relative z-10">ЛЕТНИЕ</span>
                {season === "s" && (
                  <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-[#FFB300]/5 to-[#FFB300]/10 z-0"></div>
                )}
              </Button>
            </Link>
            <Link href={{ pathname: "/category/winter", query: queryParams }} className="h-full">
              <Button
                ref={winterButtonRef}
                variant="ghost"
                className={getButtonClass("w")}
                style={season === "w" ? buttonStyle : { marginTop: "-6px", marginBottom: "-6px" }}
              >
                <span className="relative z-10">ЗИМНИЕ</span>
                {season === "w" && (
                  <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-[#3B82F6]/5 to-[#3B82F6]/10 z-0 rounded-lg"></div>
                )}
              </Button>
            </Link>
            <Link href={{ pathname: "/category/all-season", query: queryParams }} className="h-full">
              <Button
                variant="ghost"
                className={getButtonClass("a")}
                style={season === "a" ? buttonStyle : { marginTop: "-6px", marginBottom: "-6px" }}
              >
                <span className="relative z-10">ALLSEASON</span>
                {season === "a" && <div className="allseason-gradient"></div>}
              </Button>
            </Link>
          </div>

          {/* Global cart button - IMPORTANT: Use this same markup and class on all pages */}
          <button
            onClick={handleCartClick}
            className={`global-cart-button ${isCartButtonAnimating ? "cart-button-pulse" : ""}`}
            aria-label="Корзина"
          >
            <div className={isCartButtonAnimating ? "cart-icon-bounce" : ""}>
              <Image
                src="/images/korzina2.png"
                alt="Корзина"
                width={26}
                height={26}
                className="opacity-90 hover:opacity-100 transition-opacity dark:invert dark:brightness-200 dark:contrast-200"
              />
            </div>

            {/* Cart count badge */}
            {cartItemCount > 0 && (
              <div className="absolute top-[5px] -right-1 bg-[#D3DF3D] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-sm">
                {cartItemCount}
              </div>
            )}
          </button>
        </div>
      </header>

      {/* Quick size links section */}
      <div className="bg-white dark:bg-[#2A2A2A] p-3 mx-4 rounded-lg shadow-sm mb-4 mt-[30px] overflow-hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent snap-x">
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

      <div className="flex-1 p-4 space-y-6 pt-2">
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
