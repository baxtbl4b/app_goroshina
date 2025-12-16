"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, X, Heart, CheckCircle, Clock, Calendar, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/api"
import CartButton from "@/components/cart-button"

// Типы данных для фильтров
type BoltPattern = "4x100" | "4x108" | "5x100" | "5x108" | "5x112" | "5x114.3" | "5x120"
type CenterBore = "56.1" | "57.1" | "60.1" | "63.3" | "65.1" | "66.6" | "67.1" | "71.5" | "72.6" | "73.1"
type Compatibility = "Audi" | "BMW" | "Mercedes" | "Toyota" | "Honda" | "Hyundai" | "Kia" | "Renault"

// Тип для статуса наличия
type StockStatusType = "today" | "oneday" | "moredays"

export default function DokatkaPage() {
  const router = useRouter()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedBoltPattern, setSelectedBoltPattern] = useState<BoltPattern | null>(null)
  const [selectedCenterBore, setSelectedCenterBore] = useState<CenterBore | null>(null)
  const [selectedCompatibility, setSelectedCompatibility] = useState<Compatibility | null>(null)
  const [cartCounts, setCartCounts] = useState<Record<number, number>>({})
  const [favorites, setFavorites] = useState<number[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [itemCount, setItemCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const cartCountRef = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cartCountPosition, setCartCountPosition] = useState(0)

  // Данные для фильтров
  const boltPatterns: BoltPattern[] = ["4x100", "4x108", "5x100", "5x108", "5x112", "5x114.3", "5x120"]
  const centerBores: CenterBore[] = ["56.1", "57.1", "60.1", "63.3", "65.1", "66.6", "67.1", "71.5", "72.6", "73.1"]
  const compatibilities: Compatibility[] = ["Audi", "BMW", "Mercedes", "Toyota", "Honda", "Hyundai", "Kia", "Renault"]

  // Примеры докаток для отображения
  const dokatki = [
    {
      id: 1,
      title: "Докатка R16 5x112",
      boltPattern: "5x112",
      centerBore: "57.1",
      price: 5900,
      rrc: 6500, // Рекомендованная розничная цена
      stock: 12, // Количество в наличии
      country: "Германия",
      country_code: "de",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dokatka-p9ER4iAPFpGuRa3gPnEFh7qm8gm4j7.png",
      description:
        "Запасное колесо для временного использования. Подходит для большинства автомобилей с разболтовкой 5x112.",
      compatibility: "Audi A4, VW Passat, Mercedes C-Class",
      partCode: "DOK-5112-16",
    },
    {
      id: 2,
      title: "Докатка R17 5x114.3",
      boltPattern: "5x114.3",
      centerBore: "67.1",
      price: 6500,
      rrc: 7200,
      stock: 5,
      country: "Япония",
      country_code: "jp",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dokatka-p9ER4iAPFpGuRa3gPnEFh7qm8gm4j7.png",
      description: "Компактное запасное колесо R17. Идеально для экономии места в багажнике.",
      compatibility: "Toyota Camry, Honda Accord, Mazda 6",
      partCode: "DOK-5114-17",
    },
    {
      id: 3,
      title: "Докатка R15 4x100",
      boltPattern: "4x100",
      centerBore: "56.1",
      price: 4900,
      rrc: 5500,
      stock: 0,
      country: "Китай",
      country_code: "cn",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dokatka-p9ER4iAPFpGuRa3gPnEFh7qm8gm4j7.png",
      description: "Легкая докатка для компактных автомобилей. Разболтовка 4x100 подходит для многих моделей.",
      compatibility: "Hyundai Solaris, Kia Rio, Renault Logan",
      partCode: "DOK-4100-15",
    },
    {
      id: 4,
      title: "Докатка R16 5x120",
      boltPattern: "5x120",
      centerBore: "72.6",
      price: 6200,
      rrc: 6800,
      stock: 8,
      country: "Германия",
      country_code: "de",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dokatka-p9ER4iAPFpGuRa3gPnEFh7qm8gm4j7.png",
      description:
        "Надежная докатка для автомобилей премиум-класса. Разболтовка 5x120 подходит для BMW и других марок.",
      compatibility: "BMW 3-Series, BMW 5-Series, Range Rover Evoque",
      partCode: "DOK-5120-16",
    },
  ]

  // Загрузка данных корзины и избранного при монтировании компонента
  useEffect(() => {
    // Загрузка данных корзины
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("dokatki_cart") || "[]")
        const newCartCounts: Record<number, number> = {}
        const count = cart.reduce((total: number, item: any) => {
          newCartCounts[item.id] = item.quantity || 0
          return total + (item.quantity || 1)
        }, 0)

        setCartCounts(newCartCounts)
        setItemCount(count)
      } catch (error) {
        console.error("Ошибка при получении данных корзины:", error)
        setCartCounts({})
        setItemCount(0)
      }
    }

    // Загрузка данных избранного
    const loadFavorites = () => {
      try {
        const favs = JSON.parse(localStorage.getItem("dokatki_favorites") || "[]")
        setFavorites(favs)
      } catch (error) {
        console.error("Ошибка при получении данных избранного:", error)
        setFavorites([])
      }
    }

    updateCartCount()
    loadFavorites()

    // Обновляем счетчик при изменении корзины
    window.addEventListener("cartUpdated", updateCartCount)
    window.addEventListener("cartItemAdded", updateCartCount)

    // Очищаем слушатель событий при размонтировании
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount)
      window.removeEventListener("cartItemAdded", updateCartCount)
    }
  }, [])

  // Фильтрация докаток
  const filteredDokatki = dokatki.filter((item) => {
    if (selectedBoltPattern && item.boltPattern !== selectedBoltPattern) return false
    if (selectedCenterBore && item.centerBore !== selectedCenterBore) return false
    if (selectedCompatibility && !item.compatibility.includes(selectedCompatibility)) return false
    if (inStockOnly && item.stock <= 0) return false
    return true
  })

  // Сброс всех фильтров
  const resetFilters = () => {
    setSelectedBoltPattern(null)
    setSelectedCenterBore(null)
    setSelectedCompatibility(null)
    setInStockOnly(false)
  }

  // Проверка, есть и активные фильтры
  const hasActiveFilters =
    selectedBoltPattern !== null || selectedCenterBore !== null || selectedCompatibility !== null || inStockOnly

  // Функция для получения статуса наличия
  const getStockStatus = (
    stock: number,
  ): { type: StockStatusType; tooltip: string; className: string; icon: React.ReactNode } => {
    if (stock > 10) {
      return {
        type: "today",
        tooltip: "Сегодня",
        className: "text-green-500",
        icon: <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />,
      }
    } else if (stock > 0) {
      return {
        type: "oneday",
        tooltip: "Доставка 1-2 дня",
        className: "text-blue-500",
        icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />,
      }
    } else {
      return {
        type: "moredays",
        tooltip: "Доставка 3 и более дня",
        className: "text-orange-500",
        icon: <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />,
      }
    }
  }

  // Функция для добавления в избранное
  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    e.stopPropagation()

    const newFavorites = [...favorites]
    const index = newFavorites.indexOf(id)

    if (index >= 0) {
      newFavorites.splice(index, 1)
    } else {
      newFavorites.push(id)
    }

    setFavorites(newFavorites)
    localStorage.setItem("dokatki_favorites", JSON.stringify(newFavorites))
  }

  // Функция для добавления в корзину
  const addToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault()
    e.stopPropagation()

    const newCartCounts = { ...cartCounts }
    newCartCounts[item.id] = (newCartCounts[item.id] || 0) + 1
    setCartCounts(newCartCounts)

    // Обновляем localStorage
    const cart = JSON.parse(localStorage.getItem("dokatki_cart") || "[]")
    const existingItemIndex = cart.findIndex((cartItem: any) => cartItem.id === item.id)

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1
    } else {
      cart.push({ ...item, quantity: 1 })
    }

    localStorage.setItem("dokatki_cart", JSON.stringify(cart))

    // Отправляем событие для обновления других компонентов
    window.dispatchEvent(new Event("cartUpdated"))
  }

  // Функция для уменьшения количества в корзине
  const removeFromCart = (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    e.stopPropagation()

    if (!cartCounts[id]) return

    const newCartCounts = { ...cartCounts }
    newCartCounts[id] = Math.max(0, (newCartCounts[id] || 0) - 1)
    setCartCounts(newCartCounts)

    // Обновляем localStorage
    const cart = JSON.parse(localStorage.getItem("dokatki_cart") || "[]")
    const existingItemIndex = cart.findIndex((item: any) => item.id === id)

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity = Math.max(0, (cart[existingItemIndex].quantity || 1) - 1)

      if (cart[existingItemIndex].quantity === 0) {
        cart.splice(existingItemIndex, 1)
      }
    }

    localStorage.setItem("dokatki_cart", JSON.stringify(cart))

    // Отправляем событие для обновления других компонентов
    window.dispatchEvent(new Event("cartUpdated"))
  }

  // Функция для перехода в корзину
  const handleCartClick = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsAnimating(false)
      router.push("/order") // Переход на страницу корзины
    }, 300)
  }

  // Функция для очистки корзины
  const handleClearCart = () => {
    // Clear the cart in localStorage
    localStorage.setItem("dokatki_cart", "[]")
    // Update cart count
    setItemCount(0)
    setCartCounts({})
    // Dispatch event to notify other components
    window.dispatchEvent(new Event("cartUpdated"))
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <style jsx global>
        {`
          /* Cart button animation */
          @keyframes cartButtonAnimation {
            0% {
              transform: scale(1);
              background-color: rgba(215, 224, 88, 0.1);
            }
            25% {
              transform: scale(1.05);
              background-color: rgba(215, 224, 88, 0.3);
            }
            50% {
              transform: scale(1);
              background-color: rgba(215, 224, 88, 0.2);
            }
            75% {
              transform: scale(1.05);
              background-color: rgba(215, 224, 88, 0.3);
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
            animation: cartButtonAnimation 3s ease-in-out infinite, borderFlash 3s ease-in-out infinite;
            position: relative;
            overflow: hidden;
          }
          
          .cart-button-animated::before {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
            transform: rotate(0deg);
            animation: rotateGradient 8s linear infinite;
            z-index: 0;
            pointer-events: none;
          }
          
          @keyframes rotateGradient {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          
          /* Cart indicator container animation */
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
        `}
      </style>

      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-[#1F1F1F] dark:text-white">
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold text-[#1F1F1F] dark:text-white">Докатки</h1>
          </div>

          {/* Cart button */}
          <CartButton className="fixed right-0 top-2 z-50" />
        </div>
      </header>

      <div className="flex-1 px-4 pt-20 pb-36">
        {/* Результаты в стиле карточек шин */}
        <div className="space-y-4">
          {filteredDokatki.map((item) => {
            const stockStatus = getStockStatus(item.stock)
            return (
              <div key={item.id} className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden shadow-sm flex">
                {/* Левая часть - Изображение */}
                <div className="relative p-2 sm:p-3 md:p-4 flex-shrink-0 w-[123px] sm:w-[161px] md:w-[197px] lg:w-[222px] overflow-hidden flex items-center justify-center bg-white rounded-l-xl" style={{ maxHeight: "209px" }}>
                  <div className="w-full h-full relative flex items-center justify-center">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-contain hover:opacity-90 transition-opacity rounded-lg"
                      style={{
                        filter: "drop-shadow(0 0 1px rgba(0,0,0,0.1))",
                      }}
                    />
                  </div>
                </div>

                {/* Правая часть - Контент */}
                <div className="p-2 sm:p-3 md:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="mt-0.5 sm:mt-1 md:mt-2 flex items-center gap-1 sm:gap-2 md:gap-3 flex-wrap">
                      <span className="text-[10px] xs:text-xs sm:text-sm md:text-base font-medium px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 bg-gray-100 dark:bg-[#3A3A3A] rounded text-[#1F1F1F] dark:text-white">
                        {item.boltPattern} | ЦО {item.centerBore}
                      </span>
                      <span className="flex-grow"></span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 ml-auto sm:ml-0"
                        onClick={(e) => toggleFavorite(e, item.id)}
                        aria-label={favorites.includes(item.id) ? "Удалить из избранного" : "Добавить в избранное"}
                      >
                        <Heart
                          className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 transition-colors ${
                            favorites.includes(item.id)
                              ? "text-red-500 fill-red-500"
                              : "text-gray-400 hover:text-red-500"
                          }`}
                        />
                      </Button>
                    </div>

                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-medium text-[#1F1F1F] dark:text-white line-clamp-2 text-xs sm:text-sm md:text-base lg:text-lg">
                        {item.title}
                      </h3>
                    </Link>

                    {/* Новые параметры */}
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Совместимость:</span>
                        <span className="text-[10px] xs:text-xs text-[#1F1F1F] dark:text-white line-clamp-1">
                          {item.compatibility}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Код запчасти:</span>
                        <span className="text-[10px] xs:text-xs text-[#1F1F1F] dark:text-white font-mono">
                          {item.partCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-0.5 sm:mt-1 flex flex-col relative pb-7 sm:pb-8 md:pb-10">
                    <div className="flex items-center justify-between w-full mb-1">
                      <div>
                        {/* Статус наличия */}
                        <div className="flex items-center gap-1">
                          <span className="flex items-center justify-center">{stockStatus.icon}</span>
                          <span
                            className={`text-xs sm:text-sm md:text-base lg:text-lg font-medium ${stockStatus.className}`}
                          >
                            {stockStatus.tooltip}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        {item.stock > 0 ? (
                          <>
                            <span
                              className={`text-base sm:text-xl md:text-2xl lg:text-3xl font-medium opacity-80 ${
                                item.stock > 10
                                  ? "text-green-500"
                                  : item.stock > 5
                                    ? "text-yellow-500"
                                    : "text-orange-500"
                              }`}
                            >
                              {item.stock} шт
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
                        <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-500 dark:text-gray-400 line-through">
                          {formatPrice(item.rrc)}
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
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center flex-1 justify-end ml-2">
                        {/* Кнопки корзины */}
                        <div className="flex h-7 sm:h-8 md:h-9 rounded-lg overflow-hidden w-full max-w-[140px] sm:max-w-[160px] md:max-w-[180px]">
                          {/* Кнопка минус */}
                          <button
                            onClick={(e) => removeFromCart(e, item.id)}
                            disabled={!cartCounts[item.id] || item.stock <= 0}
                            className="bg-gray-500/90 hover:bg-gray-600 text-white h-full flex-1 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Уменьшить количество"
                          >
                            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                          </button>

                          {/* Счетчик количества */}
                          <div className="bg-black/85 text-white h-full flex-1 flex items-center justify-center min-w-[2rem] sm:min-w-[2.5rem] md:min-w-[3rem]">
                            <span className="text-xs sm:text-sm md:text-base font-medium">
                              {cartCounts[item.id] || 0}
                            </span>
                          </div>

                          {/* Кнопка плюс */}
                          <button
                            onClick={(e) => addToCart(e, item)}
                            disabled={item.stock <= 0}
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

        {filteredDokatki.length === 0 && (
          <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-8 text-center mt-4">
            <p className="text-[#1F1F1F] dark:text-white mb-4">По вашему запросу ничего не найдено</p>
            <Button className="bg-[#c4d402] hover:bg-[#c4d402]/80 text-[#1F1F1F]" onClick={resetFilters}>
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>

      {/* Модальное окно фильтров */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center p-0">
          <div className="bg-white dark:bg-[#2A2A2A] rounded-t-xl sm:rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1F1F1F] dark:text-white">Фильтры</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4 space-y-6">
              {/* Фильтр по разболтовке */}
              <div>
                <h3 className="text-sm font-medium text-[#1F1F1F] dark:text-white mb-3">Разболтовка</h3>
                <div className="grid grid-cols-3 gap-2">
                  {boltPatterns.map((pattern) => (
                    <button
                      key={pattern}
                      className={`py-2 px-3 text-sm rounded-lg border ${
                        selectedBoltPattern === pattern
                          ? "bg-[#c4d402] border-[#c4d402] text-[#1F1F1F]"
                          : "bg-white dark:bg-[#333333] border-gray-200 dark:border-gray-700 text-[#1F1F1F] dark:text-white"
                      }`}
                      onClick={() => setSelectedBoltPattern(selectedBoltPattern === pattern ? null : pattern)}
                    >
                      {pattern}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Фильтр по центральному отверстию */}
              <div>
                <h3 className="text-sm font-medium text-[#1F1F1F] dark:text-white mb-3">Центральное отверстие</h3>
                <div className="grid grid-cols-3 gap-2">
                  {centerBores.map((bore) => (
                    <button
                      key={bore}
                      className={`py-2 px-3 text-sm rounded-lg border ${
                        selectedCenterBore === bore
                          ? "bg-[#c4d402] border-[#c4d402] text-[#1F1F1F]"
                          : "bg-white dark:bg-[#333333] border-gray-200 dark:border-gray-700 text-[#1F1F1F] dark:text-white"
                      }`}
                      onClick={() => setSelectedCenterBore(selectedCenterBore === bore ? null : bore)}
                    >
                      {bore}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Фильтр по совместимости */}
              <div>
                <h3 className="text-sm font-medium text-[#1F1F1F] dark:text-white mb-3">Совместимость</h3>
                <div className="grid grid-cols-3 gap-2">
                  {compatibilities.map((compatibility) => (
                    <button
                      key={compatibility}
                      className={`py-2 px-3 text-sm rounded-lg border ${
                        selectedCompatibility === compatibility
                          ? "bg-[#c4d402] border-[#c4d402] text-[#1F1F1F]"
                          : "bg-white dark:bg-[#333333] border-gray-200 dark:border-gray-700 text-[#1F1F1F] dark:text-white"
                      }`}
                      onClick={() =>
                        setSelectedCompatibility(selectedCompatibility === compatibility ? null : compatibility)
                      }
                    >
                      {compatibility}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t dark:border-gray-700 flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={resetFilters}>
                Сбросить
              </Button>
              <Button
                className="flex-1 bg-[#c4d402] hover:bg-[#c4d402]/80 text-[#1F1F1F]"
                onClick={() => setIsFilterOpen(false)}
              >
                Применить
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Нижний фильтр докаток в стиле фильтра шин - всегда развернутый */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#2A2A2A] shadow-lg"
        aria-label="Блок фильтра докаток"
        data-testid="dokatki-filter-container"
      >
        {/* Основные фильтры */}
        <div className="grid grid-cols-3 gap-3 p-4 relative">
          <div>
            <label htmlFor="bolt-pattern" className="text-sm text-[#1F1F1F] dark:text-gray-300 mb-1 block">
              Разболтовка
            </label>
            <select
              id="bolt-pattern"
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#333333] text-[#1F1F1F] dark:text-white"
              value={selectedBoltPattern || ""}
              onChange={(e) => setSelectedBoltPattern((e.target.value as BoltPattern) || null)}
            >
              <option value="">Все</option>
              {boltPatterns.map((pattern) => (
                <option key={pattern} value={pattern}>
                  {pattern}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="center-bore" className="text-sm text-[#1F1F1F] dark:text-gray-300 mb-1 block">
              ЦО
            </label>
            <select
              id="center-bore"
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#333333] text-[#1F1F1F] dark:text-white"
              value={selectedCenterBore || ""}
              onChange={(e) => setSelectedCenterBore((e.target.value as CenterBore) || null)}
            >
              <option value="">Все</option>
              {centerBores.map((bore) => (
                <option key={bore} value={bore}>
                  {bore}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="compatibility" className="text-sm text-[#1F1F1F] dark:text-gray-300 mb-1 block">
              Совместимость
            </label>
            <select
              id="compatibility"
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#333333] text-[#1F1F1F] dark:text-white"
              value={selectedCompatibility || ""}
              onChange={(e) => setSelectedCompatibility((e.target.value as Compatibility) || null)}
            >
              <option value="">Все</option>
              {compatibilities.map((compatibility) => (
                <option key={compatibility} value={compatibility}>
                  {compatibility}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Фильтр по наличию */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3">
            <h4 className="text-sm font-medium text-[#1F1F1F] dark:text-white">Только в наличии</h4>
            <div
              className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${
                inStockOnly ? "bg-[#c4d402]" : "bg-gray-300 dark:bg-gray-600"
              }`}
              onClick={() => setInStockOnly(!inStockOnly)}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                  inStockOnly ? "left-7" : "left-1"
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* Кнопка сброса фильтров */}
        <button
          onClick={resetFilters}
          disabled={!hasActiveFilters}
          className="absolute bottom-4 right-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-[#1F1F1F] dark:text-white rounded-md px-2 py-1.5 text-sm flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-200 dark:disabled:hover:bg-gray-700"
        >
          <span>Сбросить</span>
        </button>
      </div>
    </main>
  )
}
