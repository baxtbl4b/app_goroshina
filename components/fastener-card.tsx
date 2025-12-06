"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Plus, Minus, CheckCircle, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Тип для крепежа
interface Fastener {
  id: string
  name: string
  price: number
  rrc: number // Рекомендованная розничная цена
  stock: number
  image: string
  brand: string
  country: string
  type: "nut" | "bolt" | "lock-nut" | "lock-bolt"
  thread: string
  shape: "cone" | "sphere" | "washer"
  color: "silver" | "black"
}

interface FastenerCardProps {
  fastener: Fastener
}

// Функция для форматирования цены
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Функция для получения URL флага страны
function getCountryFlag(country: string): string {
  const countryMap: Record<string, string> = {
    Китай: "/images/flags/china.png",
    Россия: "/images/flags/russia.png",
    Япония: "/images/flags/japan.png",
    Германия: "/images/flags/germany.png",
    Италия: "/images/flags/italy.png",
    Франция: "/images/flags/france.png",
    США: "/placeholder.svg?height=16&width=24",
    Корея: "/placeholder.svg?height=16&width=24",
  }

  return countryMap[country] || "/placeholder.svg?height=16&width=24"
}

export function FastenerCard({ fastener }: FastenerCardProps) {
  // Состояния
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [flagError, setFlagError] = useState(false)
  const [isButtonPulsing, setIsButtonPulsing] = useState(false)

  // При монтировании компонента проверяем, есть ли товар в избранном и корзине
  useEffect(() => {
    // Получаем список избранного из localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    // Проверяем, есть ли текущий товар в избранном
    setIsFavorite(favorites.some((favFastener: Fastener) => favFastener.id === fastener.id))

    // Проверяем, есть ли товар в корзине и сколько его там
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const cartItem = cart.find((item: any) => item.id === fastener.id)
    setCartCount(cartItem ? cartItem.quantity : 0)
  }, [fastener.id])

  // Слушаем событие сброса счетчиков корзины
  useEffect(() => {
    const handleResetCartCounters = () => {
      setCartCount(0)
    }

    window.addEventListener("resetAllCartCounters", handleResetCartCounters)

    return () => {
      window.removeEventListener("resetAllCartCounters", handleResetCartCounters)
    }
  }, [])

  // Функция дл�� добавления/удаления из избранного
  const toggleFavorite = (e: React.MouseEvent) => {
    // Предотвращаем переход по ссылке при клике на кнопку
    e.preventDefault()
    e.stopPropagation()

    // Получаем текущий список избранного
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")

    // Если товар уже в избранном - удаляем его
    if (isFavorite) {
      const updatedFavorites = favorites.filter((favFastener: Fastener) => favFastener.id !== fastener.id)
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
      setIsFavorite(false)
    }
    // Иначе добавляем товар в избранное
    else {
      favorites.push(fastener)
      localStorage.setItem("favorites", JSON.stringify(favorites))
      setIsFavorite(true)
    }

    // Отправляем событие для обновления других компонентов
    window.dispatchEvent(new Event("favoritesUpdated"))
  }

  // Функция для добавления товара в корзину
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Запускаем анимацию пульсации
    setIsButtonPulsing(true)
    setTimeout(() => setIsButtonPulsing(false), 1000)

    // Увеличиваем счетчик товаров в корзине на 1
    setCartCount((prev) => prev + 1)

    // Получаем текущую корзину из localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Проверяем, есть ли уже этот товар в корзине
    const existingItemIndex = cart.findIndex((item: any) => item.id === fastener.id)

    if (existingItemIndex >= 0) {
      // Если товар уже в корзине, увеличиваем количество на 1
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 0) + 1
    } else {
      // Иначе добавляем новый товар с количеством 1
      cart.push({ ...fastener, quantity: 1 })
    }

    // Сохраняем обновленную корзину
    localStorage.setItem("cart", JSON.stringify(cart))

    // Отправляем событие для обновления других компонентов
    window.dispatchEvent(new Event("cartUpdated"))

    // Обновляем счетчик корзины в футере с помощью кастомного события с данными
    const cartUpdateEvent = new CustomEvent("cartItemAdded", {
      detail: {
        totalItems: cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0),
      },
    })
    window.dispatchEvent(cartUpdateEvent)
  }

  // Функция для уменьшения количества товара в корзине
  const removeFromCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Если товара нет в корзине, ничего не делаем
    if (cartCount <= 0) return

    // Уменьшаем счетчик товаров в корзине на 1
    setCartCount((prev) => Math.max(0, prev - 1))

    // Получаем текущую корзину из localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Проверяем, есть ли уже этот товар в корзине
    const existingItemIndex = cart.findIndex((item: any) => item.id === fastener.id)

    if (existingItemIndex >= 0) {
      // Если товар уже в корзине, уменьшаем количество на 1
      cart[existingItemIndex].quantity = Math.max(0, (cart[existingItemIndex].quantity || 0) - 1)

      // Если количество стало 0, удаляем товар из корзины
      if (cart[existingItemIndex].quantity === 0) {
        cart.splice(existingItemIndex, 1)
      }
    }

    // Сохраняем обновленную корзину
    localStorage.setItem("cart", JSON.stringify(cart))

    // Отправляем событие для обновления других компонентов
    window.dispatchEvent(new Event("cartUpdated"))

    // Обновляем счетчик корзины в футере с помощью кастомного события с данными
    const cartUpdateEvent = new CustomEvent("cartItemAdded", {
      detail: {
        totalItems: cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0),
      },
    })
    window.dispatchEvent(cartUpdateEvent)
  }

  // Функция для определения статуса наличия
  const getStockStatus = () => {
    if (fastener.stock > 10) {
      return {
        tooltip: "Сегодня",
        className: "text-green-500",
        icon: <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />,
      }
    } else if (fastener.stock > 0) {
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

  const stockStatus = getStockStatus()

  // Получаем изображение крепежа
  const getImageUrl = (): string => {
    // For bolt type products, use the new image
    if (fastener.type === "bolt" || fastener.type === "lock-bolt") {
      return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20%D0%BC%D0%B0%D1%8F%202025%20%D0%B3.%2C%2003_06_02-JQXWLyDnrWbi2jAGhpu2uajlH33vnG.png"
    }
    // For other products, use the existing image
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1600%20%282%29.jpg-pqOwuWzvhZM5gRA1dDLq9SEk1fowZ0.jpeg"
  }

  // Получаем флаг страны
  const flagUrl = getCountryFlag(fastener.country)

  return (
    <div className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden shadow-sm flex">
      {/* Левая часть - Изображение */}
      <div
        className="relative p-2 sm:p-3 md:p-4 flex-shrink-0 w-[123px] sm:w-[161px] md:w-[197px] lg:w-[222px] overflow-hidden flex items-center justify-center bg-white rounded-l-xl"
        style={{ maxHeight: "209px" }}
      >
        <div
          className="flex justify-center items-center h-full w-full relative overflow-hidden bg-transparent"
          style={{ zIndex: 1 }}
        >
          <img
            src={getImageUrl() || "/placeholder.svg"}
            alt={fastener.name || "Крепеж"}
            className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setImageModalOpen(true)
            }}
            onError={() => setImageError(true)}
            style={{
              filter: "drop-shadow(0 0 1px rgba(0,0,0,0.1))",
              backgroundColor: "transparent",
            }}
          />
        </div>

        <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
          <DialogContent className="sm:max-w-[600px] flex items-center justify-center p-1" style={{ zIndex: 50 }}>
            <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-[#2a2a2a] dark:to-[#1a1a1a] rounded-lg">
              <img
                src={getImageUrl() || "/placeholder.svg"}
                alt={fastener.name || "Крепеж"}
                className="object-contain max-h-[80vh]"
                onError={() => setImageError(true)}
                style={{
                  filter: "drop-shadow(0 0 1px rgba(0,0,0,0.1))",
                  backgroundColor: "transparent",
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Правая часть - Контент */}
      <div className="p-2 sm:p-3 md:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="mt-0.5 sm:mt-1 md:mt-2 flex items-center gap-1 sm:gap-2 md:gap-3 flex-wrap">
            <span className="text-[10px] xs:text-xs sm:text-sm md:text-base font-medium px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 bg-gray-100 dark:bg-[#3A3A3A] rounded text-[#1F1F1F] dark:text-white">
              {fastener.thread}
            </span>

            {/* Форма крепежа */}
            <span className="text-[10px] xs:text-xs sm:text-sm md:text-base font-medium px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 bg-gray-100 dark:bg-[#3A3A3A] rounded text-[#1F1F1F] dark:text-white">
              {fastener.shape === "cone" ? "Конус" : fastener.shape === "sphere" ? "Сфера" : "Шайба"}
            </span>

            {/* Цвет крепежа */}
            <span className="text-[10px] xs:text-xs sm:text-sm md:text-base font-medium px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 bg-gray-100 dark:bg-[#3A3A3A] rounded text-[#1F1F1F] dark:text-white">
              {fastener.color === "silver" ? "Серебро" : "Черный"}
            </span>

            <span className="flex-grow"></span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 ml-auto sm:ml-0"
              onClick={toggleFavorite}
              aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
            >
              <Heart
                className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 transition-colors ${
                  isFavorite ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-500"
                }`}
              />
            </Button>
          </div>

          <Link href={`/krepezh/${fastener.id}`}>
            <h3 className="font-medium text-[#1F1F1F] dark:text-white line-clamp-2 text-xs sm:text-sm md:text-base lg:text-lg">
              {fastener.name}
            </h3>
          </Link>

          <div className="mt-0.5 sm:mt-1 md:mt-2 flex items-center gap-1 sm:gap-2 md:gap-3">
            {flagError ? (
              <div
                className="rounded-sm w-[20px] h-[14px] sm:w-[24px] sm:h-[16px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[8px] text-gray-500"
                title={`Страна: ${fastener.country}`}
              >
                {fastener.country.substring(0, 2)}
              </div>
            ) : (
              <img
                src={flagUrl || "/placeholder.svg"}
                alt={fastener.country}
                width={20}
                height={14}
                className="rounded-sm w-[20px] h-[14px] sm:w-[24px] sm:h-[16px] border border-gray-200"
                title={`Страна: ${fastener.country}`}
                onError={() => setFlagError(true)}
              />
            )}
            <span className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-500 dark:text-gray-400">
              {fastener.country}
            </span>
          </div>
        </div>

        <div className="mt-0.5 sm:mt-1 flex flex-col relative pb-7 sm:pb-8 md:pb-10">
          <div className="flex items-center justify-between w-full mb-1">
            <div>
              {/* Статус наличия */}
              <div className="flex items-center gap-1">
                <span className="flex items-center justify-center">
                  {React.cloneElement(stockStatus.icon as React.ReactElement, {
                    className: `h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 ${
                      (stockStatus.icon as React.ReactElement).props.className
                    }`,
                  })}
                </span>
                <span className={`text-xs sm:text-sm md:text-base lg:text-lg font-medium ${stockStatus.className}`}>
                  {stockStatus.tooltip}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {fastener.stock > 0 ? (
                <>
                  <span
                    className={`text-base sm:text-xl md:text-2xl lg:text-3xl font-medium opacity-80 ${
                      fastener.stock > 10
                        ? "text-green-500"
                        : fastener.stock > 5
                          ? "text-yellow-500"
                          : "text-orange-500"
                    }`}
                  >
                    {fastener.stock} шт
                  </span>
                  <span className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-500 dark:text-gray-400">
                    Количество:
                  </span>
                </>
              ) : (
                <span className="text-base sm:text-xl font-medium opacity-80 text-red-500">Нет в наличии</span>
              )}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center mt-2 sm:mt-0 px-0">
            <div>
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(fastener.rrc)}
              </p>
              <p
                className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#1F1F1F] dark:text-white relative"
                style={{
                  textShadow: "1px 1px 0 rgba(0,0,0,0.1), 2px 2px 0 rgba(0,0,0,0.05), 3px 3px 5px rgba(0,0,0,0.1)",
                  transform: "translateZ(0)",
                  perspective: "1000px",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateZ(10px) scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateZ(0)")}
              >
                {formatPrice(fastener.price)}
              </p>
            </div>
            <div className="flex items-center flex-1 justify-end ml-2">
              {/* Кнопки корзины */}
              <div className="flex h-7 sm:h-8 md:h-9 rounded-lg overflow-hidden w-full max-w-[140px] sm:max-w-[160px] md:max-w-[180px]">
                {/* Кнопка минус */}
                <button
                  onClick={removeFromCart}
                  disabled={cartCount <= 0 || fastener.stock <= 0}
                  className="bg-gray-500/90 hover:bg-gray-600 text-white h-full flex-1 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Уменьшить количество"
                >
                  <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </button>

                {/* Счетчик количества */}
                <div className="bg-black/85 text-white h-full flex-1 flex items-center justify-center min-w-[2rem] sm:min-w-[2.5rem] md:min-w-[3rem]">
                  <span className="text-xs sm:text-sm md:text-base font-medium">{cartCount}</span>
                </div>

                {/* Кнопка плюс */}
                <button
                  onClick={addToCart}
                  disabled={fastener.stock <= 0}
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
}
