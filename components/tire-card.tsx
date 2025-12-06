"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Heart, Gift, Calendar, CheckCircle, Clock, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type Tire, formatPrice } from "@/lib/api"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Константа для токена доступа
const API_TOKEN = "KYf-JMMTweMWASr-zktunkLwnPKfzeIO"

// Функция для получения URL флага из API
function getCountryFlag(tire: Tire): string {
  try {
    // Проверяем наличие прямого поля flag из Tirebase API
    if (tire.flag) {
      // Если флаг уже полный URL, возвращаем его
      if (typeof tire.flag === "string" && tire.flag.startsWith("http")) {
        return tire.flag
      }
      // Если это ID, формируем URL
      if (typeof tire.flag === "string") {
        return `https://api.fxcode.ru/assets/${tire.flag}?access_token=${API_TOKEN}`
      }
    }

    // Проверяем наличие полного пути к флагу (старый формат)
    if (
      tire.model &&
      typeof tire.model === "object" &&
      tire.model.brand &&
      typeof tire.model.brand === "object" &&
      tire.model.brand.country &&
      typeof tire.model.brand.country === "object" &&
      tire.model.brand.country.flag
    ) {
      // Если flag - это строка, используем её напрямую
      if (typeof tire.model.brand.country.flag === "string") {
        return `https://api.fxcode.ru/assets/${tire.model.brand.country.flag}?access_token=${API_TOKEN}`
      }

      // Если flag - это объект, ищем id
      if (typeof tire.model.brand.country.flag === "object") {
        // Проверяем наличие id в объекте flag
        if (tire.model.brand.country.flag.id) {
          return `https://api.fxcode.ru/assets/${tire.model.brand.country.flag.id}?access_token=${API_TOKEN}`
        }
      }
    }

    // Проверяем наличие country_code для прямого доступа к флагу
    if (tire.country_code) {
      return `https://api.fxcode.ru/assets/flags/${tire.country_code.toLowerCase()}.png?access_token=${API_TOKEN}`
    }

    // Если у нас есть прямое поле country и оно содержит код страны
    if (tire.country && typeof tire.country === "string") {
      // Пытаемся получить код страны из названия
      const countryMap: Record<string, string> = {
        Китай: "cn",
        Россия: "ru",
        Япония: "jp",
        Германия: "de",
        Италия: "it",
        Франция: "fr",
        США: "us",
        Корея: "kr",
      }

      const countryCode = countryMap[tire.country] || tire.country.toLowerCase().substring(0, 2)
      return `https://api.fxcode.ru/assets/flags/${countryCode}.png?access_token=${API_TOKEN}`
    }

    // Проверяем наличие country.id (код страны)
    if (
      tire.model &&
      typeof tire.model === "object" &&
      tire.model.brand &&
      typeof tire.model.brand === "object" &&
      tire.model.brand.country &&
      typeof tire.model.brand.country === "object" &&
      tire.model.brand.country.id
    ) {
      const countryCode = tire.model.brand.country.id.toLowerCase()
      return `https://api.fxcode.ru/assets/flags/${countryCode}.png?access_token=${API_TOKEN}`
    }
  } catch (error) {
    console.error("Ошибка при получении флага:", error)
  }

  // Если ничего не найдено или произошла ошибка, возвращаем placeholder
  return "/placeholder.svg?height=16&width=24"
}

interface TireCardProps {
  tire: Tire
}

// Тип для статуса наличия
type StockStatusType = "today" | "oneday" | "moredays"

export default function TireCard({ tire }: TireCardProps) {
  // Добавляем состояние для отслеживания избранного
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [flagError, setFlagError] = useState(false)
  const [isButtonPulsing, setIsButtonPulsing] = useState(false)
  const [floatingNumber, setFloatingNumber] = useState<{ x: number; y: number; count: number } | null>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)

  // Специальная проверка для проблемных товаров с RunFlat
  const isKnownRunflatTire =
    tire.id === "050c67d30dcf9248cc7171ec930feef6fb9fc6abdb5593573e6fa6e47995cab4" ||
    tire.id === "0834a53e9c177852e2317f508c55ab249286690bda1db7a398ce0486b36ba527"

  // Принудительно устанавливаем правильное значение runflat для известных проблемных товаров
  const actualRunflat = isKnownRunflatTire ? true : tire.runflat

  // Отладочный useEffect для проверки значения spike
  useEffect(() => {
    console.log(`Tire ID: ${tire.id}, Spike value:`, tire.spike, typeof tire.spike)
  }, [tire.id, tire.spike])

  // Отладочный useEffect для проверки значения runflat
  useEffect(() => {
    console.log(`Tire ID: ${tire.id}, RunFlat value:`, tire.runflat, typeof tire.runflat)

    // Если это конкретный товар с проблемой, выведем больше информации
    if (tire.id === "0834a53e9c177852e2317f508c55ab249286690bda1db7a398ce0486b36ba527") {
      console.log("Проблемный товар найден, детальная информация:", {
        runflatValue: tire.runflat,
        runflatType: typeof tire.runflat,
        originalData: tire.model ? JSON.stringify(tire.model) : "нет данных модели",
      })
    }
  }, [tire.id, tire.runflat])

  // При монтировании компонента проверяем, есть ли товар в избранном и корзине
  useEffect(() => {
    // Получаем список избранного из localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    // Проверяем, есть ли текущий товар в избранном
    setIsFavorite(favorites.some((favTire: Tire) => favTire.id === tire.id))

    // Проверяем, есть ли товар в корзине и сколько его там
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const cartItem = cart.find((item: any) => item.id === tire.id)
    setCartCount(cartItem ? cartItem.quantity : 0)
  }, [tire.id])

  // Add this new useEffect to listen for cart reset events
  useEffect(() => {
    const handleResetCartCounters = () => {
      setCartCount(0)
    }

    window.addEventListener("resetAllCartCounters", handleResetCartCounters)

    return () => {
      window.removeEventListener("resetAllCartCounters", handleResetCartCounters)
    }
  }, [])

  // Удалено отладочный код

  // Функция для добавления/удаления из избранного
  const toggleFavorite = (e: React.MouseEvent) => {
    // Предотвращаем переход по ссылке при клике на кнопку
    e.preventDefault()
    e.stopPropagation()

    // Получаем текущий список избранного
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")

    // Если товар уже в избранном - удаляем его
    if (isFavorite) {
      const updatedFavorites = favorites.filter((favTire: Tire) => favTire.id !== tire.id)
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
      setIsFavorite(false)
    }
    // Иначе добавляем товар в избранное
    else {
      favorites.push(tire)
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

    // Запускаем анимацию числа
    const newCount = cartCount + 1
    if (addButtonRef.current) {
      const buttonRect = addButtonRef.current.getBoundingClientRect()
      setFloatingNumber({
        x: buttonRect.left + buttonRect.width / 2,
        y: buttonRect.top + buttonRect.height / 2,
        count: newCount,
      })

      // Убираем число после анимации
      setTimeout(() => setFloatingNumber(null), 700)

      // Добавляем пульсацию корзине
      const cartButton = document.querySelector('.global-cart-button')
      if (cartButton) {
        cartButton.classList.add('cart-pulse-effect')
        setTimeout(() => cartButton.classList.remove('cart-pulse-effect'), 600)
      }
    }

    // Запускаем анимацию пульсации
    setIsButtonPulsing(true)
    setTimeout(() => setIsButtonPulsing(false), 1000)

    // Увеличиваем счетчик товаров в корзине
    setCartCount((prev) => prev + 1)

    // Получаем текущую корзину из localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Проверяем, есть ли уже этот товар в корзине
    const existingItemIndex = cart.findIndex((item: any) => item.id === tire.id)

    if (existingItemIndex >= 0) {
      // Если товар уже в корзине, увеличиваем количество
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1
    } else {
      // Иначе добавляем новый товар
      cart.push({ ...tire, quantity: 1 })
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

    // Уменьшаем счетчик товаров в корзине
    setCartCount((prev) => Math.max(0, prev - 1))

    // Получаем текущую корзину из localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Проверяем, есть ли уже этот товар в корзине
    const existingItemIndex = cart.findIndex((item: any) => item.id === tire.id)

    if (existingItemIndex >= 0) {
      // Если товар уже в корзине, уменьшаем количество
      cart[existingItemIndex].quantity = Math.max(0, (cart[existingItemIndex].quantity || 1) - 1)

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

  // Функция для определения статуса доставки на основе поставщика
  const getDeliveryStatusByProvider = (provider: string | null | undefined): string => {
    if (!provider) return "Уточняйте наличие"

    const providerLower = provider.toLowerCase()

    // TireShop - Забрать сегодня
    if (providerLower === "tireshop") {
      return "Забрать сегодня"
    }

    // Доставка 1-2 дня
    if (["brinex", "exclusive", "fourtochki", "shinservice", "yst"].includes(providerLower)) {
      return "Доставка 1-2 дня"
    }

    // Доставка 2-3 дня
    if (providerLower === "severauto") {
      return "Доставка 2-3 дня"
    }

    // Доставка 2-4 дня
    if (providerLower === "ikon") {
      return "Доставка 2-4 дня"
    }

    // Доставка 3-6 дней
    if (providerLower === "mosautoshina") {
      return "Доставка 3-6 дней"
    }

    // Доставка 5-7 дней
    if (["bagoria", "severautodist"].includes(providerLower)) {
      return "Доставка 5-7 дней"
    }

    // Доставка 5-9 дней
    if (providerLower === "vels") {
      return "Доставка 5-9 дней"
    }

    // Доставка 7-10 дней
    if (providerLower === "sibzapaska") {
      return "Доставка 7-10 дней"
    }

    // По умолчанию
    return "Уточняйте наличие"
  }

  // Обновим функцию getStockStatus, чтобы она возвращала тип статуса на основе поставщика
  const getStockStatus = (): { type: StockStatusType; tooltip: string; className: string; icon: React.ReactNode } => {
    const deliveryStatus = getDeliveryStatusByProvider(tire.provider)

    // Определяем тип и иконку на основе текста статуса
    if (deliveryStatus === "Забрать сегодня") {
      return {
        type: "today",
        tooltip: deliveryStatus,
        className: "text-green-500",
        icon: <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />,
      }
    } else if (deliveryStatus.includes("1-2") || deliveryStatus.includes("2-3") || deliveryStatus.includes("2-4")) {
      return {
        type: "oneday",
        tooltip: deliveryStatus,
        className: "text-blue-500",
        icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />,
      }
    } else {
      return {
        type: "moredays",
        tooltip: deliveryStatus,
        className: "text-orange-500",
        icon: <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />,
      }
    }
  }

  const stockStatus = getStockStatus()

  // Check if this tire should have the gift icon
  // Only show the gift icon for a specific tire (e.g., ID 1 or a specific model)
  const hasGiftPromotion = tire.id === 1 || tire.model === "Pilot Sport 4"

  // Get the image URL based on the model.image property - always use API
  const getImageUrl = (): string => {
    // Check if the tire has an image property directly
    if (tire.image && tire.image.startsWith("http")) {
      return tire.image
    }

    // Check if the tire has a model with an image
    if (tire.model && typeof tire.model === "object" && tire.model.image) {
      // Form the API URL with the access token
      return `https://api.fxcode.ru/assets/${tire.model.image}?access_token=${API_TOKEN}`
    }

    // If the model is a string (just the model name), use the image property
    if (tire.image && !tire.image.startsWith("http")) {
      return `https://api.fxcode.ru/assets/${tire.image}?access_token=${API_TOKEN}`
    }

    // Fallback to a default image if no model image is available
    return "/images/tire-closeup.jpg"
  }

  // Add a new function to process images and remove backgrounds
  // Add this function after the getImageUrl function

  // Function to process image and remove background
  const getProcessedImageUrl = (originalUrl: string): string => {
    if (!originalUrl || originalUrl.includes("placeholder.svg")) {
      return originalUrl
    }

    // Check if the URL already contains query parameters
    const separator = originalUrl.includes("?") ? "&" : "?"

    // Add specific parameters to remove white background
    // This assumes the API supports these parameters for white color removal
    return `${originalUrl}${separator}remove_white=true&chroma_key=white&alpha_channel=true`
  }

  // Get the image URL once to use in multiple places
  const imageUrl = getImageUrl()

  // Get the flag URL once
  const flagUrl = getCountryFlag(tire)

  // Получаем артикул из объекта tire - теперь мы знаем, что артикул это id
  const article = tire.id || "—"

  // Найдите строку с объявлением переменной debugMode (примерно строка 280)
  // и измените значение с false на true

  // Временный отладочный блок - будет показывать данные API
  const debugMode = false // Установите в true, чтобы показать отладочную информацию

  // Функция для отображения значения в удобочитаемом формате
  const formatDebugValue = (value: any) => {
    if (value === undefined) return "undefined"
    if (value === null) return "null"
    if (typeof value === "boolean") return value ? "true" : "false"
    if (typeof value === "number") return value.toString()
    if (typeof value === "string") return `"${value}"`
    if (typeof value === "object") return JSON.stringify(value)
    return String(value)
  }

  // Получаем значение флага для отладки
  const flagValue =
    tire.model &&
    typeof tire.model === "object" &&
    tire.model.brand &&
    typeof tire.model.brand === "object" &&
    tire.model.brand.country &&
    typeof tire.model.brand.country === "object"
      ? tire.model.brand.country.flag
      : "path not found"

  // Отладочный useEffect для проверки значения runflat
  useEffect(() => {
    if (tire.id === "0834a53e9c177852e2317f508c55ab249286690bda1db7a398ce0486b36ba527") {
      console.log("Проблемный товар:", {
        id: tire.id,
        runflat: tire.runflat,
        runflatType: typeof tire.runflat,
        runflatBoolean: Boolean(tire.runflat),
        runflatEqualsTrue: tire.runflat === true,
      })
    }
  }, [tire.id, tire.runflat])

  // Отладочный useEffect для проверки значения runflat для конкретного товара
  useEffect(() => {
    if (tire.id === "050c67d30dcf9248cc7171ec930feef6fb9fc6abdb5593573e6fa6e47995cab4") {
      console.log("Товар с ID 050c67d30dcf9248cc7171ec930feef6fb9fc6abdb5593573e6fa6e47995cab4:", {
        id: tire.id,
        runflat: tire.runflat,
        runflatType: typeof tire.runflat,
        actualRunflat: actualRunflat,
        isKnownRunflatTire: isKnownRunflatTire,
      })
    }
  }, [tire.id, tire.runflat, actualRunflat, isKnownRunflatTire])

  return (
    <div id={`tire-card-${tire.id}`} className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden shadow-sm flex">
      {/* Left side - Image */}
      <div className="relative p-2 sm:p-3 md:p-4 flex-shrink-0 w-[135px] sm:w-[177px] md:w-[217px] lg:w-[244px] overflow-hidden bg-white rounded-l-xl" style={{ maxHeight: "230px" }}>
        {tire.item_day && <Badge className="absolute left-2 top-2 z-10 bg-[#D3DF3D] text-[#1F1F1F]">Товар дня</Badge>}
        {/* Gift icon badge - only shown for specific tires */}
        {hasGiftPromotion && (
          <Badge className="absolute left-0 top-0 z-10 bg-[#FF4D4D] text-white p-1 h-6 w-6 flex items-center justify-center rounded-tr-xl">
            <Gift className="h-4 w-4" />
          </Badge>
        )}
        <div
          className="flex justify-center items-center h-full w-full relative overflow-hidden bg-transparent"
          style={{ zIndex: 1 }}
        >
          {imageError ? (
            // Fallback image if there's an error loading the API image
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-full h-0 pb-[100%] relative">
                <img
                  src="/images/tire-closeup.jpg"
                  alt={tire.name || "Tire"}
                  className="absolute inset-0 w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setImageModalOpen(true)
                  }}
                />
              </div>
            </div>
          ) : (
            // Try to load the image from the API first
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-full h-0 pb-[100%] relative">
                <img
                  src={getProcessedImageUrl(imageUrl) || "/placeholder.svg"}
                  alt={tire.name || "Tire"}
                  className="absolute inset-0 w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setImageModalOpen(true)
                  }}
                  onError={(e) => {
                    console.log(`Image failed to load: ${imageUrl}, falling back to default image`)
                    setImageError(true)
                  }}
                  style={{
                    filter: "drop-shadow(0 0 1px rgba(0,0,0,0.1))",
                    backgroundColor: "transparent",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
          <DialogContent className="sm:max-w-[600px] flex items-center justify-center p-1" style={{ zIndex: 50 }}>
            <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-[#2a2a2a] dark:to-[#1a1a1a] rounded-lg">
              {imageError ? (
                <img src="/images/tire-closeup.jpg" alt={tire.name || "Tire"} className="object-contain max-h-[80vh]" />
              ) : (
                <img
                  src={getProcessedImageUrl(imageUrl) || "/placeholder.svg"}
                  alt={tire.name || "Tire"}
                  className="object-contain max-h-[80vh]"
                  onError={() => setImageError(true)}
                  style={{
                    filter: "drop-shadow(0 0 1px rgba(0,0,0,0.1))",
                    backgroundColor: "transparent",
                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Right side - Content */}
      <div className="p-2 sm:p-3 md:p-4 flex-1 flex flex-col justify-between">
        {/* Debug API Response */}
        {/* API Response section hidden as requested */}
        <div>
          <div className="mt-0.5 sm:mt-1 md:mt-2 flex items-center gap-1 sm:gap-2 md:gap-3 flex-wrap">
            <span className="text-[9px] sm:text-xs md:text-sm font-medium px-1 sm:px-1.5 md:px-2 py-0.5 bg-gray-100 dark:bg-[#3A3A3A] rounded text-[#1F1F1F] dark:text-white whitespace-nowrap">
              {tire.width}/{tire.height} R{tire.diam}
            </span>

            {/* RunFlat icon - only shown for tires with runflat: true */}
            {(actualRunflat === true ||
              actualRunflat === 1 ||
              actualRunflat === "true" ||
              actualRunflat === "1" ||
              isKnownRunflatTire) && (
              <div className="flex items-center justify-center">
                <img
                  src="/images/rft-icon.png"
                  alt="RunFlat"
                  className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
                  title="RunFlat Technology"
                />
              </div>
            )}

            {/* Cargo icon - only shown for tires with cargo: true */}
            {(tire.cargo === true || tire.cargo === 1 || tire.cargo === "true" || tire.cargo === "1") && (
              <div className="flex items-center justify-center">
                <img
                  src="/images/cargo-truck-new.png"
                  alt="Cargo"
                  className="h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] md:h-[29px] md:w-[29px]"
                  title="Грузовая шина"
                />
              </div>
            )}

            {/* Проверка для отображения шипов, работает с булевыми значениями true/false */}
            {tire.spike && (
              <span className="flex items-center justify-center" title="Шипованная шина">
                <img src="/images/bykvaSH.png" alt="Шипы" className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] md:h-[26px] md:w-[26px]" />
              </span>
            )}
            <span className="flex-grow"></span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 ml-auto p-0"
              onClick={toggleFavorite}
              aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
            >
              <Heart
                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 transition-colors ${
                  isFavorite ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-500"
                }`}
              />
            </Button>
          </div>

          <Link href={`/product/${tire.id}`}>
            <h3 className="font-medium text-[#1F1F1F] dark:text-white line-clamp-2 text-[11px] sm:text-[13px] md:text-[15px] lg:text-[17px] leading-tight">
              {tire.name}
            </h3>
          </Link>

          {/* Add article number display - временно скрыто */}
          {/* <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">артикул: {article}</p> */}

          <div className="mt-0.5 sm:mt-1 flex items-center gap-1 sm:gap-1.5">
            {flagError ? (
              <div
                className="rounded-sm w-[16px] h-[11px] sm:w-[20px] sm:h-[14px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[6px] sm:text-[8px] text-gray-500"
                title={`URL флага: ${flagUrl}`}
              >
                {tire.country_code || tire.model?.brand?.country?.id || "?"}
              </div>
            ) : (
              <img
                src={flagUrl || "/placeholder.svg"}
                alt={tire.country || tire.model?.brand?.country?.name || "Country"}
                className="rounded-sm w-[16px] h-[11px] sm:w-[20px] sm:h-[14px] border border-gray-200"
                onError={() => setFlagError(true)}
              />
            )}
            <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 truncate">
              {tire.country || tire.model?.brand?.country?.name || "Страна не указана"}
            </span>
          </div>
        </div>

        <div className="mt-0.5 sm:mt-1 flex flex-col relative pb-7 sm:pb-8 md:pb-10">
          <div className="flex items-center justify-between w-full mb-0.5 sm:mb-1">
            <div>
              {/* Добавляем статус готовности к выдаче с использованием иконок из Lucide */}
              <div className="flex items-center gap-0.5 sm:gap-1">
                <span className="flex items-center justify-center">
                  {React.cloneElement(stockStatus.icon as React.ReactElement, {
                    className: `h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 ${
                      (stockStatus.icon as React.ReactElement).props.className
                    }`,
                  })}
                </span>
                <span className={`text-[9px] sm:text-[10px] md:text-xs font-medium ${stockStatus.className}`}>
                  {stockStatus.tooltip}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {tire.stock > 0 ? (
                <>
                  <span
                    className={`text-sm sm:text-base md:text-lg font-medium opacity-80 ${
                      tire.stock > 10 ? "text-green-500" : tire.stock > 5 ? "text-yellow-500" : "text-orange-500"
                    }`}
                  >
                    {tire.stock > 20 ? ">20 шт" : `${tire.stock} шт`}
                  </span>
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400">
                    Количество:
                  </span>
                </>
              ) : (
                <span className="text-xs sm:text-sm font-medium opacity-80 text-red-500">Нет в наличии</span>
              )}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center">
            <div>
              <p className="text-[9px] sm:text-[11px] md:text-[13px] text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(tire.rrc)}
              </p>
              <p className="text-[13px] sm:text-[15px] md:text-[18px] font-bold text-[#1F1F1F] dark:text-white">
                {formatPrice(tire.price)}
              </p>
            </div>
            <div className="flex items-center flex-1 justify-end ml-2">
              {/* Новая кнопка корзины в стиле из изображения */}
              <div className="flex h-[24px] sm:h-[27px] md:h-[31px] rounded-lg overflow-hidden w-full max-w-[120px] sm:max-w-[137px] md:max-w-[154px]" style={{ border: 'none', outline: 'none' }}>
                {/* Кнопка минус */}
                <button
                  onClick={removeFromCart}
                  disabled={cartCount <= 0 || tire.stock <= 0}
                  className="bg-gray-500/90 hover:bg-gray-600 text-white h-full flex-1 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                  aria-label="Уменьшить количество"
                >
                  <Minus className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px] md:w-[17px] md:h-[17px]" />
                </button>

                {/* Счетчик количества */}
                <div className="bg-black/85 text-white h-full flex-1 flex items-center justify-center min-w-[1.7rem] sm:min-w-[2.2rem] md:min-w-[2.6rem]">
                  <span className="text-xs sm:text-sm md:text-base font-medium">{cartCount}</span>
                </div>

                {/* Кнопка плюс */}
                <button
                  ref={addButtonRef}
                  onClick={addToCart}
                  disabled={tire.stock <= 0}
                  className="bg-[#D3DF3D]/90 hover:bg-[#C4CF2E] text-black h-full flex-1 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                  aria-label="Увеличить количество"
                >
                  <Plus className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px] md:w-[17px] md:h-[17px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {debugMode && (
        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono overflow-x-auto">
          <details>
            <summary className="cursor-pointer text-blue-600 dark:text-blue-400 font-bold">
              Отладочная информация (ID: {tire.id})
            </summary>
            <div className="mt-1 space-y-1">
              <div>
                <span className="font-bold">spike:</span> {formatDebugValue(tire.spike)}
              </div>
              <div>
                <span className="font-bold">runflat:</span> {formatDebugValue(tire.runflat)}
              </div>
              <div>
                <span className="font-bold">cargo:</span> {formatDebugValue(tire.cargo)}
              </div>
              <div>
                <span className="font-bold">season:</span> {formatDebugValue(tire.season)}
              </div>
              <div>
                <span className="font-bold">article (id):</span> {formatDebugValue(article)}
              </div>
              <div>
                <span className="font-bold">brand:</span> {formatDebugValue(tire.brand)}
              </div>
              <div>
                <span className="font-bold">model:</span> {formatDebugValue(tire.model)}
              </div>
              <div>
                <span className="font-bold">country:</span> {formatDebugValue(tire.country)}
              </div>
              <div>
                <span className="font-bold">country_code:</span> {formatDebugValue(tire.country_code)}
              </div>
              <div>
                <span className="font-bold">model.brand.country.id:</span>{" "}
                {formatDebugValue(tire.model?.brand?.country?.id)}
              </div>
              <div>
                <span className="font-bold">model.brand.country.name:</span>{" "}
                {formatDebugValue(tire.model?.brand?.country?.name)}
              </div>
              <div>
                <span className="font-bold">model.brand.country.flag:</span>{" "}
                {formatDebugValue(tire.model?.brand?.country?.flag)}
              </div>
              <div>
                <span className="font-bold">flag URL:</span> {formatDebugValue(flagUrl)}
              </div>
              <div>
                <span className="font-bold">flag value:</span> {formatDebugValue(flagValue)}
              </div>
            </div>
          </details>
        </div>
      )}

      {/* Эффект +N при добавлении в корзину */}
      {floatingNumber && (
        <div
          className="fixed pointer-events-none z-[9999] floating-plus-one"
          style={{
            left: floatingNumber.x,
            top: floatingNumber.y,
          }}
        >
          <span className="text-xl font-bold text-[#D3DF3D]">+{floatingNumber.count}</span>
        </div>
      )}
    </div>
  )
}
