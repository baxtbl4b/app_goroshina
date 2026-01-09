"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { FastenerSearchFilter } from "./fastener-search-filter"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import QuickFilterButtons from "@/components/quick-filter-buttons"
import { FastenerCard } from "@/components/fastener-card"
import CartButton from "@/components/cart-button"
import { BackButton } from "@/components/back-button"
import LoadingSpinner from "@/components/loading-spinner"

export default function KrepezhPageClient() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [fastenerType, setFastenerType] = useState("nut") // nut, bolt, lock-nut, lock-bolt
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isCartButtonAnimating, setIsCartButtonAnimating] = useState(false)
  const boltButtonRef = useRef<HTMLButtonElement>(null)
  const [buttonCoords, setButtonCoords] = useState({ x: 0, left: 0, right: 0, width: 0, center: 0 })
  const cartCountRef = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cartCountPosition, setCartCountPosition] = useState(0)
  const [cartLabelPosition, setCartLabelPosition] = useState(0)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fasteners, setFasteners] = useState([])
  const [sortOrder, setSortOrder] = useState<"price-desc" | "price-asc">("price-desc")

  // Загрузка данных из CRM API
  useEffect(() => {
    const loadFasteners = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/fasteners")
        const data = await response.json()

        if (data.data) {
          console.log("Loaded fasteners:", data.data.length, "items")
          console.log("Sample fastener:", data.data[0])
          setFasteners(data.data)
        } else {
          console.error("No data received from API")
        }
      } catch (error) {
        console.error("Error loading fasteners:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFasteners()
  }, [])

  // Демо-данные для крепежа
  // const fasteners = [
  //   {
  //     id: "1",
  //     name: "Гайка M12x1.5 конус серебро",
  //     price: 120,
  //     rrc: 150,
  //     stock: 100,
  //     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-M3bygLp1Pk3gtK3mjtQlVLwX4nsxco.png",
  //     brand: "Starleks",
  //     country: "Россия",
  //     type: "nut",
  //     thread: "M12x1.5",
  //     shape: "cone",
  //     color: "silver",
  //   },
  //   {
  //     id: "2",
  //     name: "Гайка M14x1.5 конус черная",
  //     price: 150,
  //     rrc: 180,
  //     stock: 80,
  //     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sbgcZnynEkUJ5bjlfd3qmARKlbPIfm.png",
  //     brand: "Starleks",
  //     country: "Россия",
  //     type: "nut",
  //     thread: "M14x1.5",
  //     shape: "cone",
  //     color: "black",
  //   },
  //   {
  //     id: "3",
  //     name: "Болт M12x1.25 конус серебро",
  //     price: 180,
  //     rrc: 220,
  //     stock: 60,
  //     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EHCgdNXeCUnS29e8FP2pvTZd1VeHAj.png",
  //     brand: "Starleks",
  //     country: "Россия",
  //     type: "bolt",
  //     thread: "M12x1.25",
  //     shape: "cone",
  //     color: "silver",
  //   },
  //   {
  //     id: "4",
  //     name: "Болт M14x1.5 конус черный",
  //     price: 200,
  //     rrc: 240,
  //     stock: 40,
  //     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2wGMSLx8KSJNV2fQE43bkVEjiXPtA9.png",
  //     brand: "Starleks",
  //     country: "Россия",
  //     type: "bolt",
  //     thread: "M14x1.5",
  //     shape: "cone",
  //     color: "black",
  //   },
  //   {
  //     id: "5",
  //     name: "Гайка секретка M12x1.5 сфера серебро",
  //     price: 1200,
  //     rrc: 1500,
  //     stock: 20,
  //     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ggjwN8Pz83v1B1VKooTLHDrGxWwU9M.png",
  //     brand: "McGard",
  //     country: "США",
  //     type: "lock-nut",
  //     thread: "M12x1.5",
  //     shape: "sphere",
  //     color: "silver",
  //   },
  //   {
  //     id: "6",
  //     name: "Болт секретка M14x1.5 конус черный",
  //     price: 1500,
  //     rrc: 1800,
  //     stock: 15,
  //     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2wGMSLx8KSJNV2fQE43bkVEjiXPtA9.png",
  //     brand: "McGard",
  //     country: "США",
  //     type: "lock-bolt",
  //     thread: "M14x1.5",
  //     shape: "cone",
  //     color: "black",
  //   },
  //   {
  //     id: "7",
  //     name: "Гайка M12x1.25 шайба серебро",
  //     price: 130,
  //     rrc: 160,
  //     stock: 90,
  //     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GoLdlJLff3k6zlMeyVGwbriFuKtfOc.png",
  //     brand: "Starleks",
  //     country: "Россия",
  //     type: "nut",
  //     thread: "M12x1.25",
  //     shape: "washer",
  //     color: "silver",
  //   },
  //   {
  //     id: "8",
  //     name: "Гайка M15x1.25 конус черная",
  //     price: 160,
  //     rrc: 190,
  //     stock: 70,
  //     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sbgcZnynEkUJ5bjlfd3qmARKlbPIfm.png",
  //     brand: "Starleks",
  //     country: "Россия",
  //     type: "nut",
  //     thread: "M15x1.25",
  //     shape: "cone",
  //     color: "black",
  //   },
  // ]

  // Маппинг старых типов на категории CRM (массив для поддержки нескольких категорий)
  const categoryMap: Record<string, string[]> = {
    "nut": ["Гайки"],
    "bolt": ["Болты", "Секретки"],
    "lock-nut": ["Гайки"],
    "lock-bolt": ["Болты", "Секретки"],
  }

  // Фильтрация крепежа по категории и параметрам
  const filteredFasteners = useMemo(() => {
    const thread = searchParams.get("thread")
    const shape = searchParams.get("shape")
    const color = searchParams.get("color")
    const secretka = searchParams.get("secretka")
    const expectedCategories = categoryMap[fastenerType] || []

    console.log("=== Starting Filter ===")
    console.log("Total fasteners:", fasteners.length)
    console.log("Fastener type:", fastenerType)
    console.log("Expected categories:", expectedCategories)
    console.log("Active filters:", { thread, shape, color, secretka })

    const filtered = fasteners.filter((fastener: any) => {
      if (!fastener.category) {
        return false
      }

      // Фильтр по категории (тип: гайки/болты/секретки)
      if (!expectedCategories.includes(fastener.category.name)) {
        return false
      }

      // Фильтр по резьбе (thread)
      if (thread) {
        if (fastener.params.diameter && fastener.params.step) {
          const fastenerThread = `${fastener.params.diameter}x${fastener.params.step}`
          if (fastenerThread !== thread) return false
        } else {
          // Если нет параметров резьбы, но фильтр установлен - пропускаем товар
          return false
        }
      }

      // Фильтр по форме (shape)
      if (shape) {
        if (fastener.params.form) {
          if (fastener.params.form !== shape) return false
        } else {
          // Если нет формы, но фильтр установлен - пропускаем товар
          return false
        }
      }

      // Фильтр по цвету (color)
      if (color) {
        if (fastener.params.color) {
          if (fastener.params.color !== color) return false
        } else {
          // Если нет цвета, но фильтр установлен - пропускаем товар
          return false
        }
      }

      // Фильтр "Секретка"
      if (secretka === "true") {
        if (!fastener.title.toLowerCase().includes("секретка")) return false
      }

      return true
    })

    console.log("Filtered fasteners:", filtered.length)
    if (filtered.length > 0) {
      console.log("Sample filtered item:", filtered[0])
    }

    // Сортировка по цене
    const sorted = [...filtered].sort((a: any, b: any) => {
      const priceA = a.price || 0
      const priceB = b.price || 0
      return sortOrder === "price-desc" ? priceB - priceA : priceA - priceB
    })

    return sorted
  }, [fasteners, fastenerType, searchParams, sortOrder])

  // Track bolt button coordinates
  useEffect(() => {
    const updateCoords = () => {
      if (boltButtonRef.current) {
        const rect = boltButtonRef.current.getBoundingClientRect()
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

  // Calculate position for cart count to be centered under the bolt button
  useEffect(() => {
    const updateCartPosition = () => {
      if (containerRef.current && cartCountRef.current && boltButtonRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const boltButtonRect = boltButtonRef.current.getBoundingClientRect()
        const cartCountRect = cartCountRef.current.getBoundingClientRect()

        const containerLeft = containerRect.left
        const boltButtonCenter = boltButtonRect.left + boltButtonRect.width / 2
        const cartCountWidth = 100 // Используем новую ширину

        // Calculate the left position needed to center the element under the bolt button
        const leftPosition = boltButtonCenter - containerLeft - cartCountWidth / 2
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
  const isThreadFilterActive = searchParams.has("thread")

  // Get current thread value
  const currentThread = searchParams.get("thread") || ""

  // Count active filters
  useEffect(() => {
    let count = 0
    if (searchParams.has("thread")) count++
    if (searchParams.has("shape")) count++
    if (searchParams.has("color")) count++
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

  // Fastener type-specific styles and animations
  const getFastenerTypeStyles = () => {
    switch (fastenerType) {
      case "nut":
        return {
          buttonStyle: {
            marginTop: "-6px",
            marginBottom: "-6px",
          },
          buttonClass: "border border-[#D3D3D3] bg-[#D3D3D3]/10 text-[#1F1F1F] dark:text-white font-medium",
          animationStyle: "",
        }
      case "bolt":
        return {
          buttonStyle: {
            marginTop: "-6px",
            marginBottom: "-6px",
          },
          buttonClass: "border border-[#E5E5E5] bg-[#E5E5E5]/10 text-[#1F1F1F] dark:text-white font-medium",
          animationStyle: "",
        }
      case "lock-nut":
        return {
          buttonStyle: {
            marginTop: "-6px",
            marginBottom: "-6px",
          },
          buttonClass: "border border-[#D3D3D3] bg-[#D3D3D3]/10 text-[#1F1F1F] dark:text-white font-medium",
          animationStyle: "",
        }
      case "lock-bolt":
        return {
          buttonStyle: {
            marginTop: "-6px",
            marginBottom: "-6px",
          },
          buttonClass: "border border-[#F59E0B] bg-[#F59E0B]/10 text-[#1F1F1F] dark:text-white font-medium",
          animationStyle: "",
        }
      case "secretka":
        return {
          buttonStyle: {
            marginTop: "-6px",
            marginBottom: "-6px",
          },
          buttonClass: "border border-[#c4d402] bg-[#c4d402]/10 text-[#1F1F1F] dark:text-white font-medium",
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

  const { buttonStyle, buttonClass, animationStyle } = getFastenerTypeStyles()

  // Helper function to get button classes for each fastener type tab
  const getButtonClass = (tabFastenerType: string) => {
    const isActive = fastenerType === tabFastenerType
    const baseClass = "text-sm px-3 py-3 h-full flex items-center transition-all duration-200 ease-in-out"

    if (isActive) {
      return `${baseClass} ${tabFastenerType === fastenerType ? buttonClass : ""} rounded-xl`
    }

    switch (tabFastenerType) {
      case "nut":
        return `${baseClass} border border-transparent hover:border-[#D3D3D3] hover:bg-[#D3D3D3]/10 text-[#1F1F1F] dark:text-white rounded-xl`
      case "bolt":
        return `${baseClass} border border-transparent hover:border-[#E5E5E5] hover:bg-[#E5E5E5]/10 text-[#1F1F1F] dark:text-white rounded-xl`
      case "lock-nut":
        return `${baseClass} border border-transparent hover:border-[#D3D3D3] hover:bg-[#D3D3D3]/10 text-[#1F1F1F] dark:text-white rounded-xl`
      case "lock-bolt":
        return `${baseClass} border border-transparent hover:border-[#F59E0B] hover:bg-[#F59E0B]/10 text-[#1F1F1F] dark:text-white rounded-xl`
      case "secretka":
        return `${baseClass} border border-transparent hover:border-[#c4d402] hover:bg-[#c4d402]/10 text-[#1F1F1F] dark:text-white rounded-xl`
      default:
        return baseClass
    }
  }

  const handleBrandSelect = (brands: string[]) => {
    setSelectedBrands(brands)
    console.log("Выбранные бренды крепежа:", brands)
  }

  const handleSortChange = (sortValue: string) => {
    console.log("Применена сортировка:", sortValue)
    setSortOrder(sortValue as "price-desc" | "price-asc")
  }

  const handleCarSelect = (fastenerData: { type: string | null; thread: string | null }) => {
    console.log("Выбран автомобиль, данные крепежа:", fastenerData)

    // Переключаем тип крепежа (bolt/nut)
    if (fastenerData.type) {
      setFastenerType(fastenerData.type)
    }

    // Устанавливаем фильтр резьбы
    if (fastenerData.thread) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("thread", fastenerData.thread)
      router.push(`${pathname}?${params.toString()}`)
    }
  }

  // Определяем позицию для индикатора корзины в зависимости от наличия фильтра размеров
  const cartIndicatorTopClass = isThreadFilterActive ? "top-24" : "top-16"

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <style jsx global>
        {`
          /* Fastener Type Dynamic Island Carousel */
          .fastener-carousel-container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 34px;
            -webkit-tap-highlight-color: transparent;
          }

          .fastener-carousel-highlight {
            position: absolute;
            background: #c4d402;
            border-radius: 50px;
            height: 34px;
            width: 120px;
            min-width: 120px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
            pointer-events: none;
          }

          .fastener-carousel-track {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            z-index: 2;
          }

          .fastener-carousel-center {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 120px;
            height: 34px;
            padding: 7px 18px;
          }

          .fastener-carousel-text {
            font-size: 14px;
            font-weight: 600;
            color: #1F1F1F;
            white-space: nowrap;
          }

          .fastener-carousel-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px 10px;
            color: #B0B5BD;
            opacity: 0.7;
            transition: opacity 0.2s ease;
            -webkit-tap-highlight-color: transparent;
          }

          .fastener-carousel-arrow:hover {
            opacity: 1;
          }

          .dark .fastener-carousel-arrow {
            color: #9CA3AF;
          }

          .fastener-carousel-arrow-left {
            position: absolute;
            right: calc(50% + 60px);
          }

          .fastener-carousel-arrow-right {
            position: absolute;
            left: calc(50% + 60px);
          }

          /* Стили для кнопки корзины */
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

          .cart-button-pulse {
            animation: cartPulse 0.5s ease-in-out;
          }

          @keyframes cartPulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.15);
            }
            100% {
              transform: scale(1);
            }
          }

          .cart-icon-bounce {
            animation: iconBounce 0.5s ease-in-out;
          }

          @keyframes iconBounce {
            0% {
              transform: translateY(0);
            }
            25% {
              transform: translateY(-5px);
            }
            50% {
              transform: translateY(0);
            }
            75% {
              transform: translateY(-3px);
            }
            100% {
              transform: translateY(0);
            }
          }

          @keyframes slideIn {
            from {
              transform: scaleX(0);
              opacity: 0;
            }
            to {
              transform: scaleX(1);
              opacity: 1;
            }
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

          {/* Fastener Type Dynamic Island Style */}
          {(() => {
            const tabs = [
              { key: "nut", label: "Гайки" },
              { key: "bolt", label: "Болты" },
            ]

            const currentIndex = tabs.findIndex(t => t.key === fastenerType)
            const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1
            const nextIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1

            const navigateTo = (direction: 'prev' | 'next') => {
              const newIndex = direction === 'prev' ? prevIndex : nextIndex
              setFastenerType(tabs[newIndex].key)
            }

            return (
              <div className="fastener-carousel-container">
                {/* Yellow highlight background */}
                <div className="fastener-carousel-highlight" />

                {/* Track with arrows and center text */}
                <div className="fastener-carousel-track">
                  {/* Left arrow */}
                  <button
                    onClick={() => navigateTo('prev')}
                    className="fastener-carousel-arrow fastener-carousel-arrow-left"
                  >
                    <ChevronLeft className="w-[22px] h-[22px]" />
                  </button>

                  {/* Center text */}
                  <div className="fastener-carousel-center">
                    <span key={fastenerType} className="fastener-carousel-text">
                      {tabs[currentIndex].label}
                    </span>
                  </div>

                  {/* Right arrow */}
                  <button
                    onClick={() => navigateTo('next')}
                    className="fastener-carousel-arrow fastener-carousel-arrow-right"
                  >
                    <ChevronRight className="w-[22px] h-[22px]" />
                  </button>
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

      <div className="flex-1 p-4 space-y-6 pt-[calc(60px+env(safe-area-inset-top)+1.5rem)] pb-[200px]">
        {/* Quick Filter Container */}
        <QuickFilterButtons
          insideTireResults={true}
          onBrandSelect={handleBrandSelect}
          onSortChange={handleSortChange}
          onCarSelect={handleCarSelect}
          activeFiltersCount={selectedBrands.length}
        />

        {/* Крепеж в стиле карточек шин */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#009CFF]"></div>
            </div>
          ) : filteredFasteners.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Товары не найдены
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Попробуйте изменить параметры фильтрации
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Отдельные карточки для каждого крепежа */}
              {filteredFasteners.map((fastener) => (
                <div key={fastener.id} className="w-full">
                  <FastenerCard fastener={fastener} />
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Fixed filter at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#1F1F1F] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl">
        <FastenerSearchFilter fastenerType={fastenerType} fasteners={fasteners} />
      </div>
    </main>
  )
}
