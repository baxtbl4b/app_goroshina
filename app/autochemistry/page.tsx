"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Minus, ChevronLeft, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import BottomNavigation from "@/components/bottom-navigation"
import { Badge } from "@/components/ui/badge"
import CartButton from "@/components/cart-button"
import Link from "next/link"

// Define the chemical product type
interface ChemicalProduct {
  id: string
  name: string
  brand: string
  price: number
  image: string
  compatibility: string[]
  description: string
}

// Sample data for chemical products
const chemicalProducts: ChemicalProduct[] = [
  {
    id: "chem1",
    name: "Чернитель шин AXIOM пенный 800 мл. Спрей",
    brand: "AXIOM",
    price: 450,
    image: "/images/axiom-tire-blackener.png",
    compatibility: ["Все типы шин", "Резиновые поверхности"],
    description:
      "Пенный чернитель шин AXIOM восстанавливает первоначальный цвет и блеск резины. Защищает от растрескивания, старения и воздействия ультрафиолета. Легко наносится и быстро впитывается.",
  },
  {
    id: "chem2",
    name: "Аварийный герметик для колес",
    brand: "AXIOM",
    price: 650,
    image: "/images/emergency-tire-sealant.png",
    compatibility: ["Все типы шин", "Легковые автомобили", "Внедорожники"],
    description:
      "Аварийный герметик для быстрого ремонта проколотых шин. Позволяет продолжить движение до ближайшего шиномонтажа. Герметизирует проколы диаметром до 6 мм. Не повреждает датчики давления в шинах.",
  },
  {
    id: "chem3",
    name: "Очиститель кондиционера LIQUI MOLY 4087",
    brand: "LIQUI MOLY",
    price: 850,
    image: "/images/liquimoly-cleaner.png",
    compatibility: ["Все типы автомобильных кондиционеров"],
    description:
      "Профессиональный очиститель кондиционера LIQUI MOLY 4087 эффективно удаляет бактерии и грибки из системы кондиционирования. Устраняет неприятные запахи и предотвращает аллергические реакции. Простое применение без разборки системы.",
  },
  {
    id: "chem4",
    name: "AXIOM медная смазка высокотемпературная 140 мл. А9622s",
    brand: "AXIOM",
    price: 380,
    image: "/images/axiom-copper-grease.png",
    compatibility: ["Тормозные системы", "Резьбовые соединения", "Высокотемпературные узлы"],
    description:
      "Медная высокотемпературная смазка AXIOM для защиты резьбовых соединений от прикипания и коррозии. Выдерживает температуры до +1100°C. Идеальна для тормозных систем, выхлопных систем и других высокотемпературных узлов.",
  },
  {
    id: "chem5",
    name: "AXIOM аллюминиевая смазка высокотемпературная 140 мл. А9622s",
    brand: "AXIOM",
    price: 380,
    image: "/images/axiom-aluminum-grease.png",
    compatibility: ["Тормозные системы", "Резьбовые соединения", "Высокотемпературные узлы"],
    description:
      "Алюминиевая высокотемпературная смазка AXIOM для защиты деталей от прикипания и коррозии. Выдерживает температуры до +900°C. Обеспечивает надежную защиту и смазку деталей, работающих в экстремальных условиях.",
  },
]

export default function AutochemistryPage() {
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
      if (item.id.startsWith("chem")) {
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

  // Function to add a product to the cart
  const addToCart = (product: ChemicalProduct, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Update local state
    setCartCounts((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }))

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex((item: any) => item.id === product.id)

    if (existingItemIndex >= 0) {
      // If item exists, increase quantity
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1
    } else {
      // Otherwise add new item
      cart.push({ ...product, quantity: 1 })
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

  // Function to remove a product from the cart
  const removeFromCart = (product: ChemicalProduct, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // If item not in cart, do nothing
    if (!cartCounts[product.id] || cartCounts[product.id] <= 0) return

    // Update local state
    setCartCounts((prev) => ({
      ...prev,
      [product.id]: Math.max(0, (prev[product.id] || 0) - 1),
    }))

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Find item in cart
    const existingItemIndex = cart.findIndex((item: any) => item.id === product.id)

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

  // Get unique compatibility options from all products
  const allCompatibilityOptions = Array.from(
    new Set(chemicalProducts.flatMap((product) => product.compatibility)),
  ).sort()

  // Filter products based on selected compatibility and brand
  const filteredProducts = chemicalProducts.filter((product) => {
    if (selectedCompatibility && !product.compatibility.includes(selectedCompatibility)) {
      return false
    }
    if (selectedBrand && product.brand !== selectedBrand) {
      return false
    }
    return true
  })

  // Get brand-specific styles
  const getBrandStyles = (brand: string) => {
    switch (brand) {
      case "AXIOM":
        return {
          baseClass:
            "relative bg-[#3D8DDF]/10 border border-[#3D8DDF] text-[#1F1F1F] dark:text-white font-medium axiom-button-animation",
          animationStyle: `
          @keyframes axiomPulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(61, 141, 223, 0.4);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 10px 5px rgba(61, 141, 223, 0.6);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(61, 141, 223, 0.4);
            }
          }

          @keyframes axiomBorderFlow {
            0% {
              border-color: rgba(61, 141, 223, 0.6);
              background-color: rgba(61, 141, 223, 0.1);
            }
            50% {
              border-color: rgba(61, 141, 223, 1);
              background-color: rgba(61, 141, 223, 0.2);
            }
            100% {
              border-color: rgba(61, 141, 223, 0.6);
              background-color: rgba(61, 141, 223, 0.1);
            }
          }

          .axiom-button-animation {
            animation: axiomBorderFlow 2s ease-in-out infinite;
            position: relative;
            overflow: hidden;
          }

          .axiom-button-animation::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(61, 141, 223, 0.2), transparent);
            animation: axiomShine 2s infinite;
          }

          @keyframes axiomShine {
            0% {
              left: -100%;
            }
            50% {
              left: 100%;
            }
            100% {
              left: 100%;
            }
          }
        `,
        }
      case "LIQUI MOLY":
        return {
          baseClass:
            "relative bg-[#E84C3D]/10 border border-[#E84C3D] text-[#1F1F1F] dark:text-white font-medium liquimoly-button-animation",
          animationStyle: `
          @keyframes liquimolyPulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(232, 76, 61, 0.4);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 10px 5px rgba(232, 76, 61, 0.6);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(232, 76, 61, 0.4);
            }
          }

          @keyframes liquimolyBorderFlow {
            0% {
              border-color: rgba(232, 76, 61, 0.6);
              background-color: rgba(232, 76, 61, 0.1);
            }
            50% {
              border-color: rgba(232, 76, 61, 1);
              background-color: rgba(232, 76, 61, 0.2);
            }
            100% {
              border-color: rgba(232, 76, 61, 0.6);
              background-color: rgba(232, 76, 61, 0.1);
            }
          }

          .liquimoly-button-animation {
            animation: liquimolyBorderFlow 2s ease-in-out infinite;
            position: relative;
            overflow: hidden;
          }

          .liquimoly-button-animation::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(232, 76, 61, 0.2), transparent);
            animation: liquimolyShine 2s infinite;
          }

          @keyframes liquimolyShine {
            0% {
              left: -100%;
            }
            50% {
              left: 100%;
            }
            100% {
              left: 100%;
            }
          }
        `,
        }
      default:
        return {
          baseClass:
            "bg-white/90 dark:bg-[#2A2A2A] text-[#1F1F1F] dark:text-white border border-gray-200 dark:border-gray-700",
          animationStyle: "",
        }
    }
  }

  // Get button class based on selected brand
  const getButtonClass = (brand: string) => {
    const isActive = selectedBrand === brand
    const { baseClass } = getBrandStyles(brand)

    if (isActive) {
      return `px-4 h-full flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 ${baseClass}`
    }

    return `px-4 h-full flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 bg-white/90 dark:bg-[#2A2A2A] text-[#1F1F1F] dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800`
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <style jsx global>{`
        ${getBrandStyles("AXIOM").animationStyle}
        ${getBrandStyles("LIQUI MOLY").animationStyle}
        
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
      `}</style>
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-[#1F1F1F] shadow-sm">
        <div className="p-2 px-4 flex items-center justify-between w-full h-[60px]">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-[#1F1F1F] dark:text-white">
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold text-[#1F1F1F] dark:text-white">Автохимия</h1>
          </div>

          <div className="flex items-center space-x-2 h-full">
            <button
              onClick={() => setSelectedBrand(selectedBrand === "AXIOM" ? "" : "AXIOM")}
              className={getButtonClass("AXIOM")}
              style={{ transform: "translateZ(0)" }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "translateZ(0) scale(0.95)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "translateZ(0) scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateZ(0) scale(1)")}
            >
              <span className="relative z-10">AXIOM</span>
            </button>
            <button
              onClick={() => setSelectedBrand(selectedBrand === "LIQUI MOLY" ? "" : "LIQUI MOLY")}
              className={getButtonClass("LIQUI MOLY")}
              style={{ transform: "translateZ(0)" }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "translateZ(0) scale(0.95)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "translateZ(0) scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateZ(0) scale(1)")}
            >
              <span className="relative z-10">LIQUI MOLY</span>
            </button>
          </div>

          {/* Cart button positioned at the right */}
          {/* Cart button */}
          <CartButton className="fixed right-0 top-2 z-50" />
        </div>
      </header>

      <div className="flex-1 px-4 pt-20 pb-20">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden shadow-sm flex">
                {/* Левая часть - Изображение */}
                <div
                  className="relative p-2 sm:p-3 md:p-4 flex-shrink-0 w-[123px] sm:w-[161px] md:w-[197px] lg:w-[222px] overflow-hidden flex items-center justify-center bg-white rounded-l-xl"
                  style={{ maxHeight: "209px" }}
                >
                  {product.brand === "AXIOM" && (
                    <Badge className="absolute left-2 top-2 z-10 bg-[#3D8DDF] text-white">AXIOM</Badge>
                  )}
                  {product.brand === "LIQUI MOLY" && (
                    <Badge className="absolute left-2 top-2 z-10 bg-[#E84C3D] text-white">LIQUI MOLY</Badge>
                  )}
                  <div
                    className="flex justify-center items-center h-full w-full relative overflow-hidden bg-transparent"
                    style={{ zIndex: 1 }}
                  >
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
                      style={{
                        filter: "drop-shadow(0 0 1px rgba(0,0,0,0.1))",
                        backgroundColor: "transparent",
                      }}
                    />
                  </div>
                </div>

                {/* Правая часть - Контент */}
                <div className="p-2 sm:p-3 md:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="mt-0.5 sm:mt-1 md:mt-2 flex items-center gap-1 sm:gap-2 md:gap-3 flex-wrap">
                      <span className="text-[10px] xs:text-xs sm:text-sm md:text-base font-medium px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 bg-gray-100 dark:bg-[#3A3A3A] rounded text-[#1F1F1F] dark:text-white">
                        {product.compatibility[0] || "Автохимия"}
                      </span>

                      {product.compatibility.length > 1 && (
                        <span className="text-[10px] xs:text-xs sm:text-sm md:text-base font-medium px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 bg-gray-100 dark:bg-[#3A3A3A] rounded text-[#1F1F1F] dark:text-white">
                          {product.compatibility[1]}
                        </span>
                      )}
                    </div>

                    <h3 className="font-medium text-[#1F1F1F] dark:text-white line-clamp-2 text-xs sm:text-sm md:text-base lg:text-lg mt-1">
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#1F1F1F]/70 dark:text-white/70 mt-1 line-clamp-2 break-words">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-0.5 sm:mt-1 flex flex-col relative pb-7 sm:pb-8 md:pb-10">
                    <div className="flex items-center justify-between w-full mb-1">
                      <div>
                        {/* Статус наличия - всегда показываем "Сегодня" для автохимии */}
                        <div className="flex items-center gap-1">
                          <span className="flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-green-500" />
                          </span>
                          <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-green-500">
                            Сегодня
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-medium opacity-80 text-green-500">
                          В наличии
                        </span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center mt-2 sm:mt-0 px-0">
                      <div>
                        <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-500 dark:text-gray-400 line-through">
                          {Math.round(product.price * 1.15)} ₽
                        </p>
                        <p
                          className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#1F1F1F] dark:text-white relative"
                          style={{
                            textShadow:
                              "1px 1px 0 rgba(0,0,0,0.1), 2px 2px 0 rgba(0,0,0,0.05), 3px 3px 5px rgba(0,0,0,0.1)",
                            transform: "translateZ(0)",
                            perspective: "1000px",
                            transition: "transform 0.3s ease",
                          }}
                        >
                          {product.price} ₽
                        </p>
                      </div>
                      <div className="flex items-center flex-1 justify-end ml-2">
                        {/* Кнопки корзины */}
                        <div className="flex h-7 sm:h-8 md:h-9 rounded-lg overflow-hidden w-full max-w-[140px] sm:max-w-[160px] md:max-w-[180px]">
                          {/* Кнопка минус */}
                          <button
                            onClick={(e) => removeFromCart(product, e)}
                            disabled={!cartCounts[product.id] || cartCounts[product.id] <= 0}
                            className="bg-gray-500/90 hover:bg-gray-600 text-white h-full flex-1 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Уменьшить количество"
                          >
                            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                          </button>

                          {/* Счетчик количества */}
                          <div className="bg-black/85 text-white h-full flex-1 flex items-center justify-center min-w-[2rem] sm:min-w-[2.5rem] md:min-w-[3rem]">
                            <span className="text-xs sm:text-sm md:text-base font-medium">
                              {cartCounts[product.id] || 0}
                            </span>
                          </div>

                          {/* Кнопка плюс */}
                          <button
                            onClick={(e) => addToCart(product, e)}
                            className="bg-[#D3DF3D]/90 hover:bg-[#C4CF2E] text-black h-full flex-1 flex items-center justify-center transition-colors"
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
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}
