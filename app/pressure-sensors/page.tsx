"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Plus, Minus, ChevronLeft, CheckCircle, Clock, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import BottomNavigation from "@/components/bottom-navigation"
import { Badge } from "@/components/ui/badge"
import CartButton from "@/components/cart-button"

// Define the pressure sensor type
interface PressureSensor {
  id: string
  name: string
  brand: string
  price: number
  rrc?: number // Recommended retail price
  image: string
  compatibility: string[]
  description: string
  stock: number
}

// Sample data for pressure sensors - HUF and Sulit products
const pressureSensors: PressureSensor[] = [
  {
    id: "ps1",
    name: "Датчик давления HUF IntelliSens ECS1420 (серебристый)",
    brand: "HUF",
    price: 1500,
    rrc: 1800,
    image: "/images/huf.png",
    compatibility: ["BMW", "Mercedes", "Audi", "Volkswagen", "Porsche"],
    description:
      "Премиальный датчик HUF IntelliSens ECS1420 серебристого цвета для европейских автомобилей премиум-класса. Высокая точность и надежность. Произведено в Германии.",
    stock: 15,
  },
  {
    id: "ps2",
    name: "Датчик давления HUF IntelliSens ECS1420 (черный)",
    brand: "HUF",
    price: 1650,
    rrc: 1950,
    image: "/images/huff2.png",
    compatibility: ["BMW", "Mercedes", "Audi", "Volkswagen", "Porsche"],
    description:
      "Премиальный датчик HUF IntelliSens ECS1420 черного цвета для европейских автомобилей премиум-класса. Улучшенная версия с повышенной устойчивостью к коррозии. Произведено в Германии.",
    stock: 8,
  },
  {
    id: "ps3",
    name: "Датчик давления Sulit TS-100 (серебристый)",
    brand: "Sulit",
    price: 1200,
    rrc: 1400,
    image: "/images/sulit_sensor_silver.png",
    compatibility: ["Toyota", "Nissan", "Honda", "Mazda", "Mitsubishi"],
    description:
      "Надежный датчик давления Sulit TS-100 серебристого цвета для японских автомобилей. Оптимальное соотношение цены и качества. Высокая точность измерений и длительный срок службы.",
    stock: 20,
  },
  {
    id: "ps4",
    name: "Датчик давления Sulit TS-100 (черный)",
    brand: "Sulit",
    price: 1350,
    rrc: 1550,
    image: "/images/sulit_sensor_black.png",
    compatibility: ["Toyota", "Nissan", "Honda", "Mazda", "Mitsubishi"],
    description:
      "Надежный датчик давления Sulit TS-100 черного цвета для японских автомобилей. Премиальная версия с улучшенной защитой от внешних воздействий. Идеально подходит для экстремальных условий эксплуатации.",
    stock: 5,
  },
]

export default function PressureSensorsPage() {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCompatibility, setSelectedCompatibility] = useState<string>("")
  const [cartCounts, setCartCounts] = useState<Record<string, number>>({})
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isCartButtonAnimating, setIsCartButtonAnimating] = useState(false)
  const router = useRouter()

  // Initialize cart counts from localStorage on component mount
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const counts: Record<string, number> = {}

    cart.forEach((item: any) => {
      if (item.id.startsWith("ps")) {
        counts[item.id] = item.quantity || 0
      }
    })

    setCartCounts(counts)
  }, [])

  // Get cart item count
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        const newCount = cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0)
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
  }, [])

  // Function to handle cart button click
  const handleCartClick = () => {
    setIsCartButtonAnimating(true)
    setTimeout(() => {
      setIsCartButtonAnimating(false)
      router.push("/order")
    }, 300)
  }

  // Function to add a sensor to the cart
  const addToCart = (sensor: PressureSensor, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Update local state
    setCartCounts((prev) => ({
      ...prev,
      [sensor.id]: (prev[sensor.id] || 0) + 1,
    }))

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex((item: any) => item.id === sensor.id)

    if (existingItemIndex >= 0) {
      // If item exists, increase quantity
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1
    } else {
      // Otherwise add new item
      cart.push({ ...sensor, quantity: 1 })
    }

    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(cart))

    // Dispatch event to update other components
    window.dispatchEvent(new Event("cartUpdated"))

    // Update cart counter in footer
    const cartUpdateEvent = new CustomEvent("cartItemAdded", {
      detail: {
        totalItems: cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0),
      },
    })
    window.dispatchEvent(cartUpdateEvent)
  }

  // Function to remove a sensor from the cart
  const removeFromCart = (sensor: PressureSensor, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // If item not in cart, do nothing
    if (!cartCounts[sensor.id] || cartCounts[sensor.id] <= 0) return

    // Update local state
    setCartCounts((prev) => ({
      ...prev,
      [sensor.id]: Math.max(0, (prev[sensor.id] || 0) - 1),
    }))

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Find item in cart
    const existingItemIndex = cart.findIndex((item: any) => item.id === sensor.id)

    if (existingItemIndex >= 0) {
      // Decrease quantity
      cart[existingItemIndex].quantity = Math.max(0, (cart[existingItemIndex].quantity || 1) - 1)

      // If quantity is 0, remove item from cart
      if (cart[existingItemIndex].quantity === 0) {
        cart.splice(existingItemIndex, 1)
      }
    }

    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(cart))

    // Dispatch event to update other components
    window.dispatchEvent(new Event("cartUpdated"))

    // Update cart counter in footer
    const cartUpdateEvent = new CustomEvent("cartItemAdded", {
      detail: {
        totalItems: cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0),
      },
    })
    window.dispatchEvent(cartUpdateEvent)
  }

  // Get unique compatibility options from all sensors
  const allCompatibilityOptions = Array.from(new Set(pressureSensors.flatMap((sensor) => sensor.compatibility))).sort()

  // Filter sensors based on selected compatibility and brand
  const filteredSensors = pressureSensors.filter((sensor) => {
    if (selectedCompatibility && !sensor.compatibility.includes(selectedCompatibility)) {
      return false
    }
    if (selectedBrand && sensor.brand !== selectedBrand) {
      return false
    }
    return true
  })


  // Function to format price
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Function to determine stock status
  const getStockStatus = (stock: number) => {
    if (stock > 10) {
      return {
        tooltip: "Сегодня",
        className: "text-green-500",
        icon: <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />,
      }
    } else if (stock > 0) {
      return {
        tooltip: "Доставка 1-2 дня",
        className: "text-blue-500",
        icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />,
      }
    } else {
      return {
        tooltip: "Доставка 3 и более дня",
        className: "text-orange-500",
        icon: <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />,
      }
    }
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <style jsx global>{`
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
`}</style>

      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1F1F1F] shadow-sm flex flex-col items-center h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] overflow-visible"
        style={{ "--header-height": "60px" } as React.CSSProperties}
      >
        <div className="container max-w-md flex items-center justify-center h-full relative overflow-visible">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-50">
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-tr-md rounded-br-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-[#1F1F1F]"
              aria-label="На главную"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Brand selector tabs */}
          <div className="flex items-center justify-center w-full px-16">
            <div className="relative flex items-center gap-6">
              {[
                { key: "HUF", label: "HUF" },
                { key: "Sulit", label: "Sulit" },
              ].map((tab) => {
                const isActive = selectedBrand === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedBrand(selectedBrand === tab.key ? "" : tab.key)}
                    className={`
                      relative text-base font-medium transition-all duration-200
                      ${
                        isActive
                          ? "text-[#1F1F1F] dark:text-white scale-105"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }
                    `}
                    style={{
                      fontSize: isActive ? "1.1rem" : "1rem",
                      fontWeight: isActive ? 600 : 500,
                    }}
                  >
                    {tab.label}
                    {isActive && (
                      <span
                        className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#c4d402] rounded-full"
                        style={{
                          animation: "slideIn 0.3s ease-out",
                        }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Global cart button - outside container */}
        <div style={{ position: "fixed", right: "16px", top: "30px", transform: "translateY(-50%)", zIndex: 100 }}>
          <CartButton />
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pt-[calc(60px+env(safe-area-inset-top)+1.5rem)] pb-[200px]">
        <div className="space-y-4">
          {filteredSensors.map((sensor) => {
            const stockStatus = getStockStatus(sensor.stock)
            return (
              <div key={sensor.id} className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden shadow-sm flex">
                {/* Left part - Image */}
                <div
                  className="relative p-2 sm:p-3 md:p-4 flex-shrink-0 w-[123px] sm:w-[161px] md:w-[197px] lg:w-[222px] overflow-hidden flex items-center justify-center bg-white rounded-l-xl"
                  style={{ maxHeight: "209px" }}
                >
                  <div
                    className="flex justify-center items-center h-full w-full relative overflow-hidden bg-transparent"
                    style={{ zIndex: 1 }}
                  >
                    <img
                      src={sensor.image || "/placeholder.svg"}
                      alt={sensor.name || "Датчик"}
                      className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
                      onClick={(e) => {
                        e.preventDefault()
                        // Handle image click if needed
                      }}
                      onError={(e) => {
                        console.error(`Failed to load image for ${sensor.name}`)
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                      style={{
                        filter: "drop-shadow(0 0 1px rgba(0,0,0,0.1))",
                        backgroundColor: "transparent",
                      }}
                    />
                  </div>
                </div>

                {/* Right part - Content */}
                <div className="p-2 sm:p-3 md:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="mt-0.5 sm:mt-1 md:mt-2 flex items-center gap-1 sm:gap-2 md:gap-3 flex-wrap">
                      <span className="text-[10px] xs:text-xs sm:text-sm md:text-base font-medium px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 bg-gray-100 dark:bg-[#3A3A3A] rounded text-[#1F1F1F] dark:text-white">
                        {sensor.brand}
                      </span>

                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          sensor.brand === "HUF"
                            ? "bg-blue-100/80 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800"
                            : "bg-red-100/80 dark:bg-red-900/50 border-red-200 dark:border-red-800"
                        }`}
                      >
                        {sensor.compatibility.slice(0, 2).join(", ")}
                        {sensor.compatibility.length > 2 ? "..." : ""}
                      </Badge>
                    </div>

                    <h3 className="font-medium text-[#1F1F1F] dark:text-white line-clamp-2 text-xs sm:text-sm md:text-base lg:text-lg mt-1">
                      {sensor.name}
                    </h3>

                    <p className="text-xs text-[#1F1F1F]/70 dark:text-white/70 mt-1 line-clamp-2 break-words">
                      {sensor.description}
                    </p>
                  </div>

                  <div className="mt-0.5 sm:mt-1 flex flex-col relative pb-7 sm:pb-8 md:pb-10">
                    <div className="flex items-center justify-between w-full mb-1">
                      <div>
                        {/* Stock status */}
                        <div className="flex items-center gap-1">
                          <span className="flex items-center justify-center">
                            {React.cloneElement(stockStatus.icon as React.ReactElement, {
                              className: `h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 ${
                                (stockStatus.icon as React.ReactElement).props.className
                              }`,
                            })}
                          </span>
                          <span
                            className={`text-xs sm:text-sm md:text-base lg:text-lg font-medium ${stockStatus.className}`}
                          >
                            {stockStatus.tooltip}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        {sensor.stock > 0 ? (
                          <>
                            <span
                              className={`text-base sm:text-xl md:text-2xl lg:text-3xl font-medium opacity-80 ${
                                sensor.stock > 10
                                  ? "text-green-500"
                                  : sensor.stock > 5
                                    ? "text-yellow-500"
                                    : "text-orange-500"
                              }`}
                            >
                              {sensor.stock} шт
                            </span>
                            <span className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-500 dark:text-gray-400">
                              В наличии:
                            </span>
                          </>
                        ) : (
                          <span className="text-base sm:text-xl font-medium opacity-80 text-red-500">
                            Нет в наличии
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center mt-2 sm:mt-0 px-0">
                      <div>
                        {sensor.rrc && (
                          <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-500 dark:text-gray-400 line-through">
                            {formatPrice(sensor.rrc)}
                          </p>
                        )}
                        <p
                          className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#1F1F1F] dark:text-white relative"
                          style={{
                            textShadow:
                              "1px 1px 0 rgba(0,0,0,0.1), 2px 2px 0 rgba(0,0,0,0.05), 3px 3px 5px rgba(0,0,0,0.1)",
                            transform: "translateZ(0)",
                            perspective: "1000px",
                            transition: "transform 0.3s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateZ(10px) scale(1.02)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateZ(0)")}
                        >
                          {formatPrice(sensor.price)}
                        </p>
                      </div>
                      <div className="flex items-center flex-1 justify-end ml-2">
                        <div className="flex h-7 sm:h-8 md:h-9 rounded-lg overflow-hidden w-full max-w-[140px] sm:max-w-[160px] md:max-w-[180px]">
                          {/* Minus button */}
                          <button
                            onClick={(e) => removeFromCart(sensor, e)}
                            disabled={!cartCounts[sensor.id] || cartCounts[sensor.id] <= 0 || sensor.stock <= 0}
                            className="bg-gray-500/90 hover:bg-gray-600 text-white h-full flex-1 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Уменьшить количество"
                          >
                            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                          </button>

                          {/* Counter */}
                          <div className="bg-black/85 text-white h-full flex-1 flex items-center justify-center min-w-[2rem] sm:min-w-[2.5rem] md:min-w-[3rem]">
                            <span className="text-xs sm:text-sm md:text-base font-medium">
                              {cartCounts[sensor.id] || 0}
                            </span>
                          </div>

                          {/* Plus button */}
                          <button
                            onClick={(e) => addToCart(sensor, e)}
                            disabled={sensor.stock <= 0}
                            className="bg-[#c4d402]/90 hover:bg-[#C4CF2E] text-black h-full flex-1 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Увеличить количество"
                          >
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}
