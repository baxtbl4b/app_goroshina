"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
import { FastenerSearchFilter } from "./fastener-search-filter"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import QuickFilterButtons from "@/components/quick-filter-buttons"
import { FastenerCard } from "@/components/fastener-card"
import CartButton from "@/components/cart-button"

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
  const [isLoading, setIsLoading] = useState(false)
  const [fasteners, setFasteners] = useState([])

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

  // Фильтрация крепежа по типу
  const filteredFasteners = fasteners.filter((fastener) => fastener.type === fastenerType)

  // Inspector mode state
  const [inspectorMode, setInspectorMode] = useState(false)
  const [hoveredElement, setHoveredElement] = useState<{ name: string; x: number; y: number } | null>(null)

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
    // Здесь можно добавить логику сортировки
  }

  // Определяем позицию для индикатора корзины в зависимости от наличия фильтра размеров
  const cartIndicatorTopClass = isThreadFilterActive ? "top-24" : "top-16"

  // Add secretka to the parameters passed to getFasteners
  const secretka = searchParams.get("secretka") || undefined

  // Update the useEffect that fetches fasteners
  useEffect(() => {
    const fetchFasteners = async () => {
      setIsLoading(true)
      try {
        const data = await getFasteners({
          thread: searchParams.get("thread") || undefined,
          shape: searchParams.get("shape") || undefined,
          color: searchParams.get("color") || undefined,
          type: fastenerType,
          brand: selectedBrands,
          minPrice: searchParams.get("minPrice") || undefined,
          maxPrice: searchParams.get("maxPrice") || undefined,
          inStock: searchParams.get("stock") === "true",
          secretka,
        })
        setFasteners(data)
      } catch (error) {
        console.error("Error fetching fasteners:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFasteners()
  }, [searchParams, fastenerType, selectedBrands, secretka])

  // Mock getFasteners function
  async function getFasteners(params: any) {
    // Simulate an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = [
          {
            id: "1",
            name: "Гайка M12x1.5 конус серебро",
            price: 120,
            rrc: 150,
            stock: 100,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-M3bygLp1Pk3gtK3mjtQlVLwX4nsxco.png",
            brand: "Starleks",
            country: "Россия",
            type: "nut",
            thread: "M12x1.5",
            shape: "cone",
            color: "silver",
          },
          {
            id: "2",
            name: "Гайка M14x1.5 конус черная",
            price: 150,
            rrc: 180,
            stock: 80,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sbgcZnynEkUJ5bjlfd3qmARKlbPIfm.png",
            brand: "Starleks",
            country: "Россия",
            type: "nut",
            thread: "M14x1.5",
            shape: "cone",
            color: "black",
          },
          {
            id: "3",
            name: "Болт M12x1.25 конус серебро",
            price: 180,
            rrc: 220,
            stock: 60,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EHCgdNXeCUnS29e8FP2pvTZd1VeHAj.png",
            brand: "Starleks",
            country: "Россия",
            type: "bolt",
            thread: "M12x1.25",
            shape: "cone",
            color: "silver",
          },
          {
            id: "4",
            name: "Болт M14x1.5 конус черный",
            price: 200,
            rrc: 240,
            stock: 40,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2wGMSLx8KSJNV2fQE43bkVEjiXPtA9.png",
            brand: "Starleks",
            country: "Россия",
            type: "bolt",
            thread: "M14x1.5",
            shape: "cone",
            color: "black",
          },
          {
            id: "5",
            name: "Гайка секретка M12x1.5 сфера серебро",
            price: 1200,
            rrc: 1500,
            stock: 20,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ggjwN8Pz83v1B1VKooTLHDrGxWwU9M.png",
            brand: "McGard",
            country: "США",
            type: "lock-nut",
            thread: "M12x1.5",
            shape: "sphere",
            color: "silver",
          },
          {
            id: "6",
            name: "Болт секретка M14x1.5 конус черный",
            price: 1500,
            rrc: 1800,
            stock: 15,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2wGMSLx8KSJNV2fQE43bkVEjiXPtA9.png",
            brand: "McGard",
            country: "США",
            type: "lock-bolt",
            thread: "M14x1.5",
            shape: "cone",
            color: "black",
          },
          {
            id: "7",
            name: "Гайка M12x1.25 шайба серебро",
            price: 130,
            rrc: 160,
            stock: 90,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GoLdlJLff3k6zlMeyVGwbriFuKtfOc.png",
            brand: "Starleks",
            country: "Россия",
            type: "nut",
            thread: "M12x1.25",
            shape: "washer",
            color: "silver",
          },
          {
            id: "8",
            name: "Гайка M15x1.25 конус черная",
            price: 160,
            rrc: 190,
            stock: 70,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sbgcZnynEkUJ5bjlfd3qmARKlbPIfm.png",
            brand: "Starleks",
            country: "Россия",
            type: "nut",
            thread: "M15x1.25",
            shape: "cone",
            color: "black",
          },
        ]

        // Apply filters based on params
        let filteredData = mockData

        if (params.thread) {
          filteredData = filteredData.filter((item) => item.thread === params.thread)
        }

        if (params.shape) {
          filteredData = filteredData.filter((item) => item.shape === params.shape)
        }

        if (params.color) {
          filteredData = filteredData.filter((item) => item.color === params.color)
        }

        if (params.type) {
          filteredData = filteredData.filter((item) => item.type === params.type)
        }

        if (params.brand && params.brand.length > 0) {
          filteredData = filteredData.filter((item) => params.brand.includes(item.brand))
        }

        if (params.minPrice) {
          filteredData = filteredData.filter((item) => item.price >= params.minPrice)
        }

        if (params.maxPrice) {
          filteredData = filteredData.filter((item) => item.price <= params.maxPrice)
        }

        if (params.inStock) {
          filteredData = filteredData.filter((item) => item.stock > 0)
        }

        if (params.secretka) {
          filteredData = filteredData.filter((item) => item.name.toLowerCase().includes("секретка"))
        }

        resolve(filteredData)
      }, 500)
    })
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <style jsx global>
        {`
          /* Element inspector styles */
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
        style={{ height: "51px" }}
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
            <button
              onClick={() => setFastenerType("nut")}
              className={getButtonClass("nut")}
              style={{
                ...(fastenerType === "nut" ? buttonStyle : { marginTop: "-6px", marginBottom: "-6px" }),
                borderRadius: "6px",
              }}
            >
              <span className="relative z-10">ГАЙКИ</span>
            </button>
            <button
              ref={boltButtonRef}
              onClick={() => setFastenerType("bolt")}
              className={getButtonClass("bolt")}
              style={{
                ...(fastenerType === "bolt" ? buttonStyle : { marginTop: "-6px", marginBottom: "-6px" }),
                borderRadius: "6px",
              }}
            >
              <span className="relative z-10">БОЛТЫ</span>
            </button>
          </div>

          {/* Cart button */}
          <CartButton className="fixed right-0 top-2 z-50" />
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pt-[calc(60px+env(safe-area-inset-top)+2rem)] pb-[200px]">
        {/* Quick Filter Container */}
        <QuickFilterButtons
          insideTireResults={true}
          onBrandSelect={handleBrandSelect}
          onSortChange={handleSortChange}
          activeFiltersCount={selectedBrands.length}
        />

        {/* Крепеж в стиле карточек шин */}
        <div className="space-y-4">
          {/* Отдельные карточки для каждого крепежа */}
          {filteredFasteners.map((fastener) => (
            <div key={fastener.id} className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
              <FastenerCard fastener={fastener} />
            </div>
          ))}
        </div>
      </div>

      {/* Fixed filter at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#1F1F1F] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl">
        <FastenerSearchFilter fastenerType={fastenerType} />
      </div>
    </main>
  )
}
