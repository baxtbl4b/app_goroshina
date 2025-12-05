"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
import DiskSearchFilter from "./disk-search-filter"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import QuickFilterButtons from "@/components/quick-filter-buttons"
import DiskCard from "@/components/disk-card"
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
        const count = cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0)
        setCartItemCount(count)
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
  }, [])

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

  // Disk type-specific styles and animations
  const getDiskTypeStyles = () => {
    switch (diskType) {
      case "stamped":
        return {
          buttonStyle: {
            marginTop: "-6px",
            marginBottom: "-6px",
          },
          buttonClass: "border border-[#D3DF3D] bg-[#D3DF3D]/10 text-[#1F1F1F] dark:text-white font-medium",
          animationStyle: "",
        }
      case "cast":
        return {
          buttonStyle: {
            marginTop: "-6px",
            marginBottom: "-6px",
          },
          buttonClass: "border border-[#3D8DDF] bg-[#3D8DDF]/10 text-[#1F1F1F] dark:text-white font-medium",
          animationStyle: "",
        }
      case "forged":
        return {
          buttonStyle: {
            marginTop: "-6px",
            marginBottom: "-6px",
          },
          buttonClass: "border border-[#F59E0B] bg-[#F59E0B]/10 text-[#1F1F1F] dark:text-white font-medium",
          animationStyle: "",
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

  const { buttonStyle, buttonClass, animationStyle } = getDiskTypeStyles()

  // Helper function to get button classes for each disk type tab
  const getButtonClass = (tabDiskType: string) => {
    const isActive = diskType === tabDiskType
    const baseClass = "text-sm px-3 py-3 h-full flex items-center transition-all duration-200 ease-in-out"

    if (isActive) {
      return `${baseClass} ${tabDiskType === diskType ? buttonClass : ""} rounded-xl`
    }

    switch (tabDiskType) {
      case "stamped":
        return `${baseClass} border border-transparent hover:border-[#D3DF3D] hover:bg-[#D3DF3D]/10 text-[#1F1F1F] dark:text-white rounded-xl`
      case "cast":
        return `${baseClass} border border-transparent hover:border-[#3D8DDF] hover:bg-[#3D8DDF]/10 text-[#1F1F1F] dark:text-white rounded-xl`
      case "forged":
        return `${baseClass} border border-transparent hover:border-[#F59E0B] hover:bg-[#F59E0B]/10 text-[#1F1F1F] dark:text-white rounded-xl`
      default:
        return baseClass
    }
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
          

          /* Basket icon animation */
          
          
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

      <header className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-[#1F1F1F] shadow-sm">
        <div className="p-2 px-4 flex items-center justify-between w-full h-[60px]">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-[#1F1F1F] dark:text-white">
              <ChevronLeft className="h-6 w-6" />
            </Link>
          </div>

          <div className="flex items-center space-x-2 h-full">
            <button
              onClick={() => setDiskType("stamped")}
              className={getButtonClass("stamped")}
              style={{
                ...(diskType === "stamped" ? buttonStyle : { marginTop: "-6px", marginBottom: "-6px" }),
                borderRadius: "6px",
              }}
            >
              <span className="relative z-10">ШТАМПЫ</span>
            </button>
            <button
              ref={castButtonRef}
              onClick={() => setDiskType("cast")}
              className={getButtonClass("cast")}
              style={{
                ...(diskType === "cast" ? buttonStyle : { marginTop: "-6px", marginBottom: "-6px" }),
                borderRadius: "6px",
              }}
            >
              <span className="relative z-10">ЛИТЫЕ</span>
            </button>
            <button
              onClick={() => setDiskType("forged")}
              className={getButtonClass("forged")}
              style={{
                ...(diskType === "forged" ? buttonStyle : { marginTop: "-6px", marginBottom: "-6px" }),
                borderRadius: "6px",
              }}
            >
              <span className="relative z-10">КОВАННЫЕ</span>
            </button>
          </div>

          {/* Cart button positioned at the right */}
          <div className="flex items-center h-full">
            <button
              onClick={() => router.push("/order/checkout")}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex flex-col items-center justify-center relative"
              aria-label="Оформить заказ"
            >
              <div>
                <Image
                  src="/images/korzina2.png"
                  alt="Оформить заказ"
                  width={26}
                  height={26}
                  className="opacity-90 hover:opacity-100 transition-opacity dark:invert dark:brightness-200 dark:contrast-200"
                />
              </div>

              {/* Cart count badge */}
              {cartItemCount > 0 && (
                <div className="absolute top-[4px] -right-1 bg-[#D3DF3D] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 pt-4 sm:pt-6 pb-[250px] sm:pb-[280px] mt-2 sm:mt-4 max-w-7xl mx-auto">
        {/* Quick Filter Container */}
        <div className="w-full">
          <QuickFilterButtons
            insideTireResults={true}
            onBrandSelect={handleBrandSelect}
            onSortChange={handleSortChange}
            activeFiltersCount={selectedBrands.length}
          />
        </div>

        {/* Диски в стиле карточек шин */}
        {/* Адаптивная сетка карточек дисков */}
        <div className="space-y-3 sm:space-y-4 sm:grid sm:grid-cols-1 sm:gap-3 sm:space-y-0 md:grid-cols-2 md:gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {/* Отдельные карточки для каждого диска */}
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
