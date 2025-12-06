"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
import DiskSearchFilter from "./disk-search-filter"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import QuickFilterButtons from "@/components/quick-filter-buttons"
import DiskCard from "@/components/disk-card"
import CartButton from "@/components/cart-button"
import Link from "next/link"

export default function DiskiPage() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [diskType, setDiskType] = useState("stamped") // stamped, cast, forged
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isCartButtonAnimating, setIsCartButtonAnimating] = useState(false)
  const castButtonRef = useRef<HTMLButtonElement>(null)
  const [buttonCoords, setButtonCoords] = useState({ x: 0, left: 0, right: 0, width: 0, center: 0 })
  const cartCountRef = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cartCountPosition, setCartCountPosition] = useState(0)
  const [cartLabelPosition, setCartLabelPosition] = useState(0)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  // Демо-данные для дисков
  const disks = [
    {
      id: "1",
      name: "СКАД Монако Алмаз R17 5x114.3 ET45 DIA67.1",
      price: 5500,
      rrc: 6200,
      stock: 12,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/test5-Z7PC3n995cm9WeQU3R3CtistrMl66H.png", // Updated image URL
      brand: "СКАД",
      country: "Россия",
      diameter: 17,
      width: 7,
      pcd: "5x114.3",
      et: 45,
      dia: 67.1,
      type: "cast" as const,
      color: "Алмаз",
      isPromotional: true,
    },
    {
      id: "2",
      name: "Replay KI300 Черный R16 5x114.3 ET41 DIA67.1",
      price: 4800,
      rrc: 5300,
      stock: 8,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/test4-48SGtGCEdDpyqVnh93vaH6YETrUqUp.png", // Updated image URL
      brand: "Replay",
      country: "Китай",
      diameter: 16,
      width: 6.5,
      pcd: "5x114.3",
      et: 41,
      dia: 67.1,
      type: "cast" as const,
      color: "Черный",
    },
    {
      id: "3",
      name: "Штампованный диск Magnetto R15 5x100 ET38 DIA57.1",
      price: 2200,
      rrc: 2500,
      stock: 20,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/disk2-obwRb5S4x7B3Rzqpl8Me4DGEN5KO4o.png", // Direct blob URL for black stamped wheel
      brand: "Magnetto",
      country: "Россия",
      diameter: 15,
      width: 6,
      pcd: "5x100",
      et: 38,
      dia: 57.1,
      type: "stamped" as const,
    },
    {
      id: "4",
      name: "BBS CH-R Platinum Silver R18 5x112 ET35 DIA66.5",
      price: 18500,
      rrc: 21000,
      stock: 4,
      image: "/images/black-wheel.png",
      brand: "BBS",
      country: "Германия",
      diameter: 18,
      width: 8,
      pcd: "5x112",
      et: 35,
      dia: 66.5,
      type: "forged" as const,
      color: "Platinum Silver",
    },
    {
      id: "5",
      name: "OZ Racing Superturismo LM R19 5x120 ET40 DIA79.0",
      price: 22000,
      rrc: 24500,
      stock: 2,
      image: "/images/black-wheel.png",
      brand: "OZ Racing",
      country: "Италия",
      diameter: 19,
      width: 8.5,
      pcd: "5x120",
      et: 40,
      dia: 79.0,
      type: "forged" as const,
      color: "Matt Race Silver",
    },
    {
      id: "6",
      name: "Штампованный диск Trebl R16 5x114.3 ET50 DIA67.1",
      price: 2800,
      rrc: 3200,
      stock: 15,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/disk-QfI8EZksA5Y1HlY7EIjedjSkXSl4cp.png", // Direct blob URL for silver stamped wheel
      brand: "Trebl",
      country: "Россия",
      diameter: 16,
      width: 6.5,
      pcd: "5x114.3",
      et: 50,
      dia: 67.1,
      type: "stamped" as const,
    },
    // Новые диски с предоставленными изображениями
    {
      id: "7",
      name: "Carwel Тауус Черный матовый R17 5x114.3 ET42 DIA67.1",
      price: 6200,
      rrc: 6800,
      stock: 10,
      image: "/images/carwel-wheel.png",
      brand: "Carwel",
      country: "Россия",
      diameter: 17,
      width: 7.5,
      pcd: "5x114.3",
      et: 42,
      dia: 67.1,
      type: "cast" as const,
      color: "Черный матовый",
      isPromotional: true,
    },
    {
      id: "8",
      name: "BBS RX-R Bi-color R18 5x112 ET35 DIA66.5",
      price: 21500,
      rrc: 24000,
      stock: 6,
      image: "/images/bbs-wheel.png",
      brand: "BBS",
      country: "Германия",
      diameter: 18,
      width: 8.5,
      pcd: "5x112",
      et: 35,
      dia: 66.5,
      type: "forged" as const,
      color: "Bi-color",
      isPromotional: true,
    },
    {
      id: "9",
      name: "Alutec Grip Graphite R16 6x139.7 ET38 DIA67.1",
      price: 7800,
      rrc: 8500,
      stock: 12,
      image: "/images/alutec-wheel-1.png",
      brand: "Alutec",
      country: "Германия",
      diameter: 16,
      width: 7,
      pcd: "6x139.7",
      et: 38,
      dia: 67.1,
      type: "cast" as const,
      color: "Graphite",
    },
    {
      id: "10",
      name: "Alutec Raptr Racing Black R17 5x112 ET40 DIA57.1",
      price: 8900,
      rrc: 9800,
      stock: 8,
      image: "/images/alutec-wheel-2.png",
      brand: "Alutec",
      country: "Германия",
      diameter: 17,
      width: 7.5,
      pcd: "5x112",
      et: 40,
      dia: 57.1,
      type: "cast" as const,
      color: "Racing Black",
    },
    {
      id: "11",
      name: "Oxigin 19 Oxspoke Black Polish R18 5x112 ET45 DIA72.6",
      price: 12800,
      rrc: 14500,
      stock: 8,
      image: "/images/disk-black-silver-accent.png",
      brand: "Oxigin",
      country: "Германия",
      diameter: 18,
      width: 8,
      pcd: "5x112",
      et: 45,
      dia: 72.6,
      type: "cast" as const,
      color: "Black Polish",
      isPromotional: true,
    },
    {
      id: "12",
      name: "Dezent TM Silver R17 5x114.3 ET40 DIA71.6",
      price: 8900,
      rrc: 9800,
      stock: 12,
      image: "/images/disk-silver-gray.png",
      brand: "Dezent",
      country: "Германия",
      diameter: 17,
      width: 7.5,
      pcd: "5x114.3",
      et: 40,
      dia: 71.6,
      type: "cast" as const,
      color: "Silver",
    },
    {
      id: "13",
      name: "GMP Italia Angel Silver R19 5x120 ET35 DIA72.6",
      price: 16500,
      rrc: 18200,
      stock: 6,
      image: "/images/disk-silver-multi-spoke.png",
      brand: "GMP Italia",
      country: "Италия",
      diameter: 19,
      width: 8.5,
      pcd: "5x120",
      et: 35,
      dia: 72.6,
      type: "forged" as const,
      color: "Silver",
      isPromotional: true,
    },
    {
      id: "14",
      name: "Carwel Gamma Black Polished R18 5x114.3 ET42 DIA67.1",
      price: 9800,
      rrc: 11200,
      stock: 10,
      image: "/images/disk-carwel-black-silver.png",
      brand: "Carwel",
      country: "Россия",
      diameter: 18,
      width: 7.5,
      pcd: "5x114.3",
      et: 42,
      dia: 67.1,
      type: "cast" as const,
      color: "Black Polished",
    },
  ]

  // Фильтрация дисков по типу
  const filteredDisks = disks.filter((disk) => disk.type === diskType)

  // Inspector mode state
  const [inspectorMode, setInspectorMode] = useState(false)
  const [hoveredElement, setHoveredElement] = useState<{ name: string; x: number; y: number } | null>(null)

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

  // Disk type-specific styles and animations - unified brand color
  const getDiskTypeStyles = () => {
    return {
      buttonStyle: {
        marginTop: "-6px",
        marginBottom: "-6px",
      },
      buttonClass: "border border-[#D3DF3D] bg-[#D3DF3D]/10 text-[#1F1F1F] dark:text-white font-medium",
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

    return `${baseClass} border border-transparent hover:border-[#D3DF3D] hover:bg-[#D3DF3D]/10 text-[#1F1F1F] dark:text-white rounded-xl`
  }

  const handleBrandSelect = (brands: string[]) => {
    setSelectedBrands(brands)
    console.log("Выбранные бренды дисков:", brands)
  }

  const handleSortChange = (sortValue: string) => {
    console.log("Применена сортировка:", sortValue)
    // Здесь можно добавить логику сортировки
  }

  // Определяем позицию для индикатора корзины в зависимости от наличия фильтра размеров
  const cartIndicatorTopClass = isDimensionFilterActive ? "top-24" : "top-16"

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212] pt-[60px]">
      <style jsx global>
        {`
          /* Disk type tabs styles - same as season tabs */
          .disk-tabs-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            height: 100%;
            padding: 0 45px;
            touch-action: pan-y pinch-zoom;
            user-select: none;
            -webkit-user-select: none;
          }

          .disk-tab {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 500;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            white-space: nowrap;
            min-width: 80px;
            text-align: center;
            font-size: 12px;
            cursor: pointer;
            border: none;
            background: transparent;
          }

          .disk-tab-active {
            position: relative;
            overflow: hidden;
            transform: scale(1.1);
            background: linear-gradient(135deg,
              color-mix(in srgb, var(--tab-color) 80%, transparent),
              color-mix(in srgb, var(--tab-color) 60%, transparent)
            );
            border: none;
            color: white;
            font-size: 13px;
            z-index: 2;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            box-shadow: 0 0 12px color-mix(in srgb, var(--tab-color) 50%, transparent);
          }

          .disk-tab-inactive {
            transform: scale(0.85);
            background: rgba(128, 128, 128, 0.1);
            border: 1px solid transparent;
            color: #6B7280;
            font-size: 11px;
            opacity: 0.8;
            backdrop-filter: blur(4px);
          }

          .disk-tab-inactive:hover {
            opacity: 1;
            background: rgba(211, 223, 61, 0.1);
            border-color: rgba(211, 223, 61, 0.3);
            transform: scale(0.88);
          }

          .dark .disk-tab-inactive {
            color: #9CA3AF;
            background: rgba(255, 255, 255, 0.05);
          }

          .dark .disk-tab-inactive:hover {
            color: white;
            background: rgba(211, 223, 61, 0.15);
            border-color: rgba(211, 223, 61, 0.3);
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

      <header className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-[#1F1F1F] shadow-sm flex flex-col items-center h-[60px]">
        <div className="container max-w-md flex items-center justify-center h-full relative overflow-hidden">
          <Link
            href="/"
            className="fixed left-0 top-2 p-2 rounded-tr-md rounded-br-md hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors z-50"
            aria-label="На главную"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Link>

          <div className="disk-tabs-container">
            {[
              { key: "stamped", label: "Штампы", color: "#D3DF3D", index: 0 },
              { key: "cast", label: "Литые", color: "#D3DF3D", index: 1 },
              { key: "forged", label: "Кованные", color: "#D3DF3D", index: 2 },
            ].map((tab) => {
              const isActive = diskType === tab.key
              const activeIndex = diskType === "stamped" ? 0 : diskType === "cast" ? 1 : 2

              // Calculate order for circular carousel (prev - active - next)
              let order = tab.index
              if (activeIndex === 0) {
                // stamped active: forged(prev), stamped(center), cast(next)
                if (tab.index === 0) order = 1      // stamped -> center
                else if (tab.index === 1) order = 2 // cast -> right (next)
                else order = 0                       // forged -> left (prev)
              } else if (activeIndex === 1) {
                // cast active: stamped(prev), cast(center), forged(next)
                if (tab.index === 0) order = 0      // stamped -> left (prev)
                else if (tab.index === 1) order = 1 // cast -> center
                else order = 2                       // forged -> right (next)
              } else if (activeIndex === 2) {
                // forged active: cast(prev), forged(center), stamped(next)
                if (tab.index === 0) order = 2      // stamped -> right (next)
                else if (tab.index === 1) order = 0 // cast -> left (prev)
                else order = 1                       // forged -> center
              }

              return (
                <button
                  key={tab.key}
                  ref={tab.key === "cast" ? castButtonRef : undefined}
                  onClick={() => setDiskType(tab.key as "stamped" | "cast" | "forged")}
                  className={`disk-tab ${isActive ? "disk-tab-active" : "disk-tab-inactive"}`}
                  style={{ "--tab-color": tab.color, order } as React.CSSProperties}
                >
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Cart button */}
          <CartButton className="fixed right-0 top-2 z-50" />
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
        <div className="space-y-3 sm:space-y-4 sm:grid sm:grid-cols-1 sm:gap-3 sm:space-y-0 md:grid-cols-2 md:gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 pb-[200px]">
          {filteredDisks.map((disk) => (
            <div key={disk.id} className="w-full">
              <DiskCard disk={disk} />
            </div>
          ))}
        </div>
      </div>

      {/* Fixed filter at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#1F1F1F] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl">
        <DiskSearchFilter diskType={diskType} />
      </div>
    </main>
  )
}
