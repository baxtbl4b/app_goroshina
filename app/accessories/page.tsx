"use client"

import React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, Plus, Minus, Check, Clock, Calendar, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import BottomNavigation from "@/components/bottom-navigation"
import FixedCartButton from "@/components/fixed-cart-button"
import CartButton from "@/components/cart-button"
import Link from "next/link"

// Define the accessory type
interface Accessory {
  id: number
  name: string
  brand: string
  image: string
  price: number
  oldPrice?: number
  description: string
  compatibility: string
  category: string
  stock?: number // Added stock property
}

// Sample data for accessories
const accessories: Accessory[] = [
  {
    id: 1,
    name: "Вентиль бескамерной покрышки",
    brand: "Standard",
    image: "/images/valve-standard.jpeg",
    price: 150,
    description: "Стандартный вентиль для бескамерных шин легковых автомобилей. Обеспечивает надежную герметизацию.",
    compatibility: "Подходит для большинства легковых автомобилей",
    category: "Вентили",
    stock: 15,
  },
  {
    id: 2,
    name: "Вентиль TR33E-br",
    brand: "Standard",
    image: "/images/valve-tr33e.jpeg",
    price: 180,
    description: "Вентиль TR33E-br для бескамерных шин. Усиленная конструкция для повышенной надежности.",
    compatibility: "Совместим с дисками большинства легковых автомобилей",
    category: "Вентили",
    stock: 8,
  },
  {
    id: 3,
    name: "Вентиль Тюнинг Michelin",
    brand: "Michelin",
    image: "/images/valve-ms525-al.webp",
    price: 450,
    oldPrice: 550,
    description: "Фирменный вентиль Michelin с логотипом. Премиальное качество и стильный внешний вид.",
    compatibility: "Для дисков Michelin и других совместимых дисков",
    category: "Вентили",
    stock: 5,
  },
  {
    id: 4,
    name: "Вентиль угловой",
    brand: "Standard",
    image: "/images/valve-angle.jpeg",
    price: 220,
    description: "Угловой вентиль для удобного доступа к ниппелю в случаях, когда прямой доступ затруднен.",
    compatibility: "Универсальный, для большинства дисков",
    category: "Вентили",
    stock: 12,
  },
  {
    id: 5,
    name: "Вентиль длинный",
    brand: "Standard",
    image: "/images/valve-long.jpeg",
    price: 250,
    description: "Удлиненный вентиль для дисков с глубокой посадкой. Обеспечивает удобный доступ к иппелю.",
    compatibility: "Для дисков с глубокой посадкой",
    category: "Вентили",
    stock: 7,
  },
  {
    id: 6,
    name: "Металлический угловой вентиль",
    brand: "Premium",
    image: "/images/valve-angle.jpeg",
    price: 350,
    description: "Металлический угловой вентиль повышенной прочности. Устойчив к механическим повреждениям.",
    compatibility: "Универсальный, для большинства дисков",
    category: "Вентили",
    stock: 3,
  },
  {
    id: 7,
    name: "Металлический вентиль",
    brand: "Premium",
    image: "/images/valve-metal.webp",
    price: 320,
    description: "Металлический вентиль стандартной формы. Повышенная прочность и долговечность.",
    compatibility: "Универсальный, для большинства дисков",
    category: "Вентили",
    stock: 9,
  },
  {
    id: 8,
    name: "Вентиль стандартный",
    brand: "Standard",
    image: "/images/valve-standard.jpeg",
    price: 120,
    oldPrice: 150,
    description: "Базовый резиновый вентиль для бескамерных шин. Экономичное и надежное решение.",
    compatibility: "Подходит для большинства легковых автомобилей",
    category: "Вентили",
    stock: 20,
  },
  {
    id: 9,
    name: "Колпачок на вентиль Audi",
    brand: "Audi",
    image: "/images/valve-cap-audi.png",
    price: 550,
    description: "Оригинальный колпачок на вентиль с логотипом Audi. Защищает вентиль от грязи и влаги.",
    compatibility: "Для автомобилей Audi и других с стандартным вентилем",
    category: "Колпачки",
    stock: 4,
  },
  {
    id: 10,
    name: "Вентиль MS525 AL",
    brand: "Standard",
    image: "/images/valve-ms525-al.webp",
    price: 280,
    description: "Алюминиевый вентиль MS525 для бескамерных шин. Легкий и прочный.",
    compatibility: "Универсальный, для большинства дисков",
    category: "Вентили",
    stock: 11,
  },
  {
    id: 11,
    name: "Вентиль MS525-zn",
    brand: "Standard",
    image: "/images/valve-ms525-al.webp",
    price: 260,
    description: "Цинковый вентиль MS525 для бескамерных шин. Устойчив к коррозии.",
    compatibility: "Универсальный, для большинства дисков",
    category: "Вентили",
    stock: 6,
  },
  {
    id: 12,
    name: "Вентиль TR43E-zn",
    brand: "Standard",
    image: "/images/valve-tr43e-zn.webp",
    price: 270,
    description: "Цинковый вентиль TR43E для бескамерных шин грузовых автомобилей.",
    compatibility: "Для грузовых автомобилей и внедорожников",
    category: "Вентили",
    stock: 0,
  },
  {
    id: 13,
    name: "Вентиль 525MS AL",
    brand: "Standard",
    image: "/images/valve-ms525-al.webp",
    price: 290,
    description: "Алюминиевый вентиль 525MS для бескамерных шин. Высокая прочность и малый вес.",
    compatibility: "Универсальный, для большинства дисков",
    category: "Вентили",
    stock: 2,
  },
  {
    id: 14,
    name: "Ступинаторы в ассортименте",
    brand: "Various",
    image: "/images/stupinators.png",
    price: 450,
    oldPrice: 550,
    description: "Набор ступинаторов различных размеров для центровки дисков. Высокая точность изготовления.",
    compatibility: "Различные модели автомобилей",
    category: "Инструменты",
    stock: 8,
  },
  {
    id: 15,
    name: "Ремкомплект для датчика давления",
    brand: "TPMS",
    image: "/images/tpms-repair-kit.png",
    price: 850,
    description: "Комплект для ремонта датчиков давления в шинах. Включает все необходимые компоненты.",
    compatibility: "Для большинства систем TPMS",
    category: "Ремкомплекты",
    stock: 5,
  },
  {
    id: 16,
    name: "Ключ AST171970",
    brand: "Professional",
    image: "/images/key-ast171970.png",
    price: 1200,
    description: "Профессиональный ключ для работы с вентилями и датчиками давления. Высококачественная сталь.",
    compatibility: "Универсальный инструмент для шиномонтажа",
    category: "Инструменты",
    stock: 3,
  },
]

// Direct URLs for valve images to ensure they load properly
const valveImageUrls = {
  "Вентиль бескамерной покрышки":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fd9633bec1c4e9554e41fc3cbc71cdca4df3ba9e_original-plSbAg9orZrfQ6Ie0lcrXTdU8gYTyu.jpeg",
  "Вентиль TR33E-br":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6373611178.jpg-Tz4kase1gFJdYcTZ9usANcKH5cB43E.jpeg",
  "Вентиль Тюнинг Michelin":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%281%29-NF1LHp0cTZzeu1nGoalj5g0HnqhoUt.webp",
  "Вентиль угловой":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6647282118.jpg-hGNhXad7lO8nlUTdp2EIG964PuKSSv.jpeg",
  "Вентиль длинный":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9b14eda4-6210-4e46-8716-54f04de40eee-dqJ2KB6w1cKnwSPUJLBGymh3qREmkX.jpeg",
  "Металлический угловой вентиль":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6647282118.jpg-hGNhXad7lO8nlUTdp2EIG964PuKSSv.jpeg",
  "Металлический вентиль":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%282%29-YoV93iTeeI4F8Hu1Xv5IP9hNsZGHtT.webp",
  "Вентиль стандартный":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fd9633bec1c4e9554e41fc3cbc71cdca4df3ba9e_original-plSbAg9orZrfQ6Ie0lcrXTdU8gYTyu.jpeg",
  "Вентиль MS525 AL":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%281%29-NF1LHp0cTZzeu1nGoalj5g0HnqhoUt.webp",
  "Вентиль MS525-zn":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%281%29-NF1LHp0cTZzeu1nGoalj5g0HnqhoUt.webp",
  "Вентиль TR43E-zn":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/orig%20%282%29-iltRq0UbyzmLuXRf08w4lTN2NyfCVx.webp",
  "Вентиль 525MS AL":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%281%29-NF1LHp0cTZzeu1nGoalj5g0HnqhoUt.webp",
}

export default function AccessoriesPage() {
  const router = useRouter()
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [cartItems, setCartItems] = useState<{ id: number; quantity: number }[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [cartAnimation, setCartAnimation] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({})

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("accessoriesCart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("accessoriesCart", JSON.stringify(cartItems))
  }, [cartItems])

  // Get all unique brands
  const brands = Array.from(new Set(accessories.map((item) => item.brand)))

  // Get all unique categories
  const categories = Array.from(new Set(accessories.map((item) => item.category)))

  // Filter accessories based on selected brands and categories
  const filteredAccessories = accessories.filter((accessory) => {
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(accessory.brand)
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(accessory.category)
    return brandMatch && categoryMatch
  })

  // Toggle brand selection
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Add item to cart
  const addToCart = (id: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === id)
      if (existingItem) {
        return prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prev, { id, quantity: 1 }]
      }
    })

    // Trigger cart animation
    setCartAnimation(true)
    setTimeout(() => setCartAnimation(false), 1000)
  }

  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === id)
      if (existingItem && existingItem.quantity > 1) {
        return prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
      } else {
        return prev.filter((item) => item.id !== id)
      }
    })
  }

  // Get quantity of item in cart
  const getCartQuantity = (id: number) => {
    const item = cartItems.find((item) => item.id === id)
    return item ? item.quantity : 0
  }

  // Calculate total items in cart
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Clear all filters
  const clearFilters = () => {
    setSelectedBrands([])
    setSelectedCategories([])
  }

  // Get background color based on category
  const getCategoryBackground = (category: string) => {
    if (category === "Вентили") {
      return "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
    }
    return ""
  }

  // Handle image load
  const handleImageLoad = (name: string) => {
    setImagesLoaded((prev) => ({ ...prev, [name]: true }))
  }

  // Handle image error
  const handleImageError = (name: string) => {
    console.error(`Failed to load image for ${name}`)
  }

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
  const getStockStatus = (stock = 0) => {
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
    <main className="flex flex-col min-h-screen bg-[#F5F5F5] dark:bg-[#121212]">
      <header
        className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-[#1F1F1F] shadow-sm"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="p-2 px-4 flex items-center justify-between w-full h-[60px]">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-[#1F1F1F] dark:text-white">
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-lg font-semibold text-[#1F1F1F] dark:text-white">Вентиля</h1>
          </div>

          {/* Cart button */}
          <CartButton className="fixed right-0 top-2 z-50" />
        </div>
      </header>

      <div className="flex-1 p-4 pb-20 pt-20">
        {/* Filter panel */}
        {isFilterOpen && (
          <div className="bg-white dark:bg-[#1F1F1F] rounded-xl p-4 mb-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Фильтры</h2>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm">
                Сбросить
              </Button>
            </div>

            <div className="space-y-4">
              {/* Brand filters */}
              <div>
                <h3 className="font-medium mb-2">Бренд</h3>
                <div className="flex flex-wrap gap-2">
                  {brands.map((brand) => (
                    <Badge
                      key={brand}
                      variant="outline"
                      className={`cursor-pointer ${
                        selectedBrands.includes(brand) ? getBrandStyle(brand).selected : getBrandStyle(brand).default
                      }`}
                      onClick={() => toggleBrand(brand)}
                    >
                      {brand}
                      {selectedBrands.includes(brand) && <Check className="ml-1 h-3 w-3" />}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Category filters */}
              <div>
                <h3 className="font-medium mb-2">Категория</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant="outline"
                      className={`cursor-pointer ${
                        selectedCategories.includes(category)
                          ? "bg-[#D3DF3D] text-[#1F1F1F] hover:bg-[#D3DF3D]/80"
                          : "bg-white dark:bg-[#333333] hover:bg-gray-100 dark:hover:bg-[#444444]"
                      }`}
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                      {selectedCategories.includes(category) && <Check className="ml-1 h-3 w-3" />}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Найдено: {filteredAccessories.length} товаров</p>
        </div>

        {/* Accessories grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredAccessories.map((accessory) => {
            const stockStatus = getStockStatus(accessory.stock)
            return (
              <div key={accessory.id} className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden shadow-sm flex">
                {/* Left part - Image */}
                <div
                  className="relative p-2 sm:p-3 md:p-4 flex-shrink-0 w-[123px] sm:w-[161px] md:w-[197px] lg:w-[222px] overflow-hidden flex items-center justify-center bg-white rounded-l-xl"
                  style={{ maxHeight: "209px" }}
                >
                  {accessory.oldPrice && (
                    <Badge className="absolute left-2 top-2 z-10 bg-[#D3DF3D] text-[#1F1F1F]">Акция</Badge>
                  )}
                  <div
                    className="flex justify-center items-center h-full w-full relative overflow-hidden bg-transparent"
                    style={{ zIndex: 1 }}
                  >
                    <img
                      src={valveImageUrls[accessory.name] || accessory.image || "/placeholder.svg"}
                      alt={accessory.name || "Аксессуар"}
                      className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
                      onLoad={() => handleImageLoad(accessory.name)}
                      onError={() => handleImageError(accessory.name)}
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
                        {accessory.category}
                      </span>
                      <span className="text-[10px] xs:text-xs sm:text-sm md:text-base font-medium px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 bg-gray-100 dark:bg-[#3A3A3A] rounded text-[#1F1F1F] dark:text-white">
                        {accessory.brand}
                      </span>
                      <span className="flex-grow"></span>
                    </div>

                    <h3 className="font-medium text-[#1F1F1F] dark:text-white line-clamp-2 text-xs sm:text-sm md:text-base lg:text-lg">
                      {accessory.name}
                    </h3>

                    <div className="mt-0.5 sm:mt-1 md:mt-2 flex items-center gap-1 sm:gap-2 md:gap-3">
                      <span className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-500 dark:text-gray-400">
                        {accessory.compatibility}
                      </span>
                    </div>
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
                        {accessory.stock !== undefined && accessory.stock > 0 ? (
                          <>
                            <span
                              className={`text-base sm:text-xl md:text-2xl lg:text-3xl font-medium opacity-80 ${
                                accessory.stock > 10
                                  ? "text-green-500"
                                  : accessory.stock > 5
                                    ? "text-yellow-500"
                                    : "text-orange-500"
                              }`}
                            >
                              {accessory.stock} шт
                            </span>
                            <span className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-500 dark:text-gray-400">
                              Количество:
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
                        {accessory.oldPrice && (
                          <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-500 dark:text-gray-400 line-through">
                            {formatPrice(accessory.oldPrice)}
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
                          {formatPrice(accessory.price)}
                        </p>
                      </div>
                      <div className="flex items-center flex-1 justify-end ml-2">
                        {/* Cart buttons */}
                        <div className="flex h-7 sm:h-8 md:h-9 rounded-lg overflow-hidden w-full max-w-[140px] sm:max-w-[160px] md:max-w-[180px]">
                          {/* Minus button */}
                          <button
                            onClick={() => removeFromCart(accessory.id)}
                            disabled={
                              getCartQuantity(accessory.id) <= 0 ||
                              (accessory.stock !== undefined && accessory.stock <= 0)
                            }
                            className="bg-gray-500/90 hover:bg-gray-600 text-white h-full flex-1 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Уменьшить количество"
                          >
                            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                          </button>

                          {/* Counter */}
                          <div className="bg-black/85 text-white h-full flex-1 flex items-center justify-center min-w-[2rem] sm:min-w-[2.5rem] md:min-w-[3rem]">
                            <span className="text-xs sm:text-sm md:text-base font-medium">
                              {getCartQuantity(accessory.id)}
                            </span>
                          </div>

                          {/* Plus button */}
                          <button
                            onClick={() => addToCart(accessory.id)}
                            disabled={accessory.stock !== undefined && accessory.stock <= 0}
                            className="bg-[#D3DF3D]/90 hover:bg-[#C4CF2E] text-black h-full flex-1 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Empty state */}
        {filteredAccessories.length === 0 && (
          <div className="bg-white dark:bg-[#1F1F1F] rounded-xl p-8 text-center">
            <p className="text-[#1F1F1F] dark:text-white mb-4">По вашему запросу ничего не найдено</p>
            <Button onClick={clearFilters} className="bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F]">
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>

      {/* Fixed cart button */}
      {totalCartItems > 0 && (
        <FixedCartButton
          itemCount={totalCartItems}
          totalPrice={cartItems.reduce(
            (sum, item) => sum + (accessories.find((a) => a.id === item.id)?.price || 0) * item.quantity,
            0,
          )}
        />
      )}

      <BottomNavigation />
    </main>
  )
}

// Helper function to get brand-specific styling
function getBrandStyle(brand: string) {
  switch (brand) {
    case "Michelin":
      return {
        default: "border-blue-300 text-blue-700 dark:text-blue-300",
        selected: "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        badge: "border-blue-300 text-blue-700 dark:text-blue-300",
      }
    case "Audi":
      return {
        default: "border-red-300 text-red-700 dark:text-red-300",
        selected: "bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        badge: "border-red-300 text-red-700 dark:text-red-300",
      }
    case "Premium":
      return {
        default: "border-purple-300 text-purple-700 dark:text-purple-300",
        selected: "bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
        badge: "border-purple-300 text-purple-700 dark:text-purple-300",
      }
    case "Professional":
      return {
        default: "border-green-300 text-green-700 dark:text-green-300",
        selected: "bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        badge: "border-green-300 text-green-700 dark:text-green-300",
      }
    case "TPMS":
      return {
        default: "border-orange-300 text-orange-700 dark:text-orange-300",
        selected: "bg-orange-100 border-orange-500 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
        badge: "border-orange-300 text-orange-700 dark:text-orange-300",
      }
    default:
      return {
        default: "border-gray-300 text-gray-700 dark:text-gray-300",
        selected: "bg-gray-100 border-gray-500 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
        badge: "border-gray-300 text-gray-700 dark:text-gray-300",
      }
  }
}
