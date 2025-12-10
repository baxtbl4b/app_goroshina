"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
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
  const [imageRetryCount, setImageRetryCount] = useState(0)
  const [imageKey, setImageKey] = useState(0) // Ключ для принудительной перезагрузки изображения
  const [flagError, setFlagError] = useState(false)
  const [isButtonPulsing, setIsButtonPulsing] = useState(false)
  const [floatingNumber, setFloatingNumber] = useState<{ x: number; y: number; count: number } | null>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

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

  // Сбрасываем состояние ошибки изображения при изменении товара
  useEffect(() => {
    setImageError(false)
    setImageRetryCount(0)
    setImageKey(prev => prev + 1)
    setFlagError(false)
  }, [tire.id])

  // Функция для повторной попытки загрузки изображения
  const handleImageError = () => {
    const maxRetries = 3
    if (imageRetryCount < maxRetries) {
      // Добавляем небольшую задержку перед повторной попыткой
      setTimeout(() => {
        setImageRetryCount(prev => prev + 1)
        setImageKey(prev => prev + 1) // Меняем ключ для перезагрузки изображения
      }, 500 * (imageRetryCount + 1)) // Увеличиваем задержку с каждой попыткой
    } else {
      console.log(`Image failed to load after ${maxRetries} retries: ${imageUrl}, falling back to default image`)
      setImageError(true)
    }
  }

  // IntersectionObserver для повторной загрузки изображений при возвращении в область видимости
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imageError) {
            // Если карточка вернулась в область видимости и изображение было с ошибкой, пробуем снова
            setImageError(false)
            setImageRetryCount(0)
            setImageKey(prev => prev + 1)
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [imageError])

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

    // Проверяем, не превышен ли лимит доступного товара
    if (cartCount >= tire.stock) {
      return
    }

    // Добавляем пульсацию корзине
    const cartButton = document.querySelector('.global-cart-button')
    if (cartButton) {
      cartButton.classList.add('cart-pulse-effect')
      setTimeout(() => cartButton.classList.remove('cart-pulse-effect'), 600)
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
    // Просто возвращаем оригинальный URL без дополнительных параметров
    return originalUrl
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
    <div ref={cardRef} id={`tire-card-${tire.id}`} className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden shadow-sm flex">
      {/* Left side - Image */}
      <div className="relative p-2 sm:p-3 md:p-4 flex-shrink-0 w-[132px] sm:w-[173px] md:w-[213px] lg:w-[239px] overflow-hidden bg-white rounded-l-xl" style={{ maxHeight: "225px" }}>
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
                <Image
                  src="/images/tire-closeup.jpg"
                  alt={tire.name || "Tire"}
                  fill
                  sizes="(max-width: 640px) 135px, (max-width: 768px) 177px, (max-width: 1024px) 217px, 244px"
                  className="object-contain cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setImageModalOpen(true)
                  }}
                  priority
                />
              </div>
            </div>
          ) : (
            // Try to load the image from the API first
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-full h-0 pb-[100%] relative">
                <Image
                  key={`tire-image-${tire.id}-${imageKey}`}
                  src={`${getProcessedImageUrl(imageUrl) || "/placeholder.svg"}${imageRetryCount > 0 ? `&_retry=${imageRetryCount}` : ''}`}
                  alt={tire.name || "Tire"}
                  fill
                  sizes="(max-width: 640px) 135px, (max-width: 768px) 177px, (max-width: 1024px) 217px, 244px"
                  className="object-contain cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setImageModalOpen(true)
                  }}
                  onError={handleImageError}
                  style={{
                    filter: "drop-shadow(0 0 1px rgba(0,0,0,0.1))",
                    backgroundColor: "transparent",
                  }}
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>

        <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
          <DialogContent className="max-w-fit max-h-fit p-0 border-0 bg-transparent shadow-none [&>button]:hidden">
            <div className="relative flex items-center justify-center">
              {imageError ? (
                <div className="relative w-auto h-auto max-w-[90vw] max-h-[90vh]">
                  <Image
                    src="/images/tire-closeup.jpg"
                    alt={tire.name || "Tire"}
                    width={600}
                    height={600}
                    className="object-contain w-auto h-auto max-w-[90vw] max-h-[90vh]"
                  />
                </div>
              ) : (
                <div className="relative w-auto h-auto max-w-[90vw] max-h-[90vh]">
                  <Image
                    key={`tire-modal-image-${tire.id}-${imageKey}`}
                    src={`${getProcessedImageUrl(imageUrl) || "/placeholder.svg"}${imageRetryCount > 0 ? `&_retry=${imageRetryCount}` : ''}`}
                    alt={tire.name || "Tire"}
                    width={600}
                    height={600}
                    className="object-contain w-auto h-auto max-w-[90vw] max-h-[90vh]"
                    onError={handleImageError}
                    style={{
                      filter: "drop-shadow(0 0 1px rgba(0,0,0,0.1))",
                      backgroundColor: "transparent",
                    }}
                  />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Right side - Content */}
      <div className="p-[11px] sm:p-[15.4px] md:p-[22px] flex-1 flex flex-col justify-between gap-[11px] sm:gap-[15.4px]">
        {/* Debug API Response */}
        {/* API Response section hidden as requested */}
        <div className="flex flex-col gap-[8.8px]">
          <div className="flex items-center gap-[4.4px] sm:gap-[8.8px] md:gap-[13.2px] flex-wrap">
            {/* Срок доставки вместо размера шины */}
            <div className="flex items-center gap-[4.4px] sm:gap-[6.6px] px-[6.6px] sm:px-[8.8px] md:px-[11px] py-[4.4px] bg-gray-100 dark:bg-[#3A3A3A] rounded-full">
              <span className="flex items-center justify-center">
                {React.cloneElement(stockStatus.icon as React.ReactElement, {
                  className: `h-[13.2px] w-[13.2px] sm:h-[17.6px] sm:w-[17.6px] md:h-[19.8px] md:w-[19.8px] ${
                    (stockStatus.icon as React.ReactElement).props.className
                  }`,
                })}
              </span>
              <span className={`text-[11px] sm:text-[15.4px] md:text-[17.6px] font-medium whitespace-nowrap ${stockStatus.className}`}>
                {stockStatus.tooltip}
              </span>
            </div>

            {/* RunFlat badge - only shown for tires with runflat: true */}
            {(actualRunflat === true ||
              actualRunflat === 1 ||
              actualRunflat === "true" ||
              actualRunflat === "1" ||
              isKnownRunflatTire) && (
              <div className="flex items-center justify-center">
                <span className="text-sm font-bold text-[#1F1F1F] dark:text-white" title="RunFlat Technology">
                  RFT
                </span>
              </div>
            )}

            {/* Cargo icon - only shown for tires with cargo: true */}
            {(tire.cargo === true || tire.cargo === 1 || tire.cargo === "true" || tire.cargo === "1") && (
              <div className="flex items-center justify-center relative h-[25.3px] w-[25.3px] sm:h-[30.8px] sm:w-[30.8px] md:h-[36.3px] md:w-[36.3px]">
                <Image
                  src="/images/cargo-truck-new.png"
                  alt="Cargo"
                  width={36.3}
                  height={36.3}
                  className="h-[25.3px] w-[25.3px] sm:h-[30.8px] sm:w-[30.8px] md:h-[36.3px] md:w-[36.3px]"
                  title="Грузовая шина"
                />
              </div>
            )}

            {/* Проверка для отображения шипов, работает с булевыми значениями true/false */}
            {tire.spike && (
              <span className="flex items-center justify-center relative h-[23.1px] w-[23.1px] sm:h-[27.5px] sm:w-[27.5px] md:h-[33px] md:w-[33px]" title="Шипованная шина">
                <Image src="/images/bykvaSH.png" alt="Шипы" width={33} height={33} className="h-[23.1px] w-[23.1px] sm:h-[27.5px] sm:w-[27.5px] md:h-[33px] md:w-[33px]" />
              </span>
            )}
            <span className="flex-grow"></span>

            {/* Flag and Country */}
            <div className="flex items-center gap-1.5">
              {flagError ? (
                <div
                  className="rounded-sm w-[18px] h-[13px] sm:w-[23px] sm:h-[16px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[7px] sm:text-[9px] text-gray-500"
                  title={`URL флага: ${flagUrl}`}
                >
                  {tire.country_code || tire.model?.brand?.country?.id || "?"}
                </div>
              ) : (
                <div className="relative w-[18px] h-[13px] sm:w-[23px] sm:h-[16px]">
                  <Image
                    src={flagUrl || "/placeholder.svg"}
                    alt={tire.country || tire.model?.brand?.country?.name || "Country"}
                    width={23}
                    height={16}
                    className="rounded-sm w-[18px] h-[13px] sm:w-[23px] sm:h-[16px] border border-gray-200"
                    onError={() => setFlagError(true)}
                  />
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 p-0"
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

          <Link
            href={`/product/${tire.id}`}
            onClick={() => {
              // Store tire data in localStorage for product page
              localStorage.setItem(`tire_${tire.id}`, JSON.stringify(tire))
            }}
          >
            <h3 className="font-medium text-[#1F1F1F] dark:text-white line-clamp-2 text-[14.3px] sm:text-[16.5px] md:text-[18.7px] lg:text-[22px] leading-tight">
              {tire.name}
            </h3>
          </Link>

          {/* Add article number display - временно скрыто */}
          {/* <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">артикул: {article}</p> */}
        </div>

        <div className="flex flex-col relative pb-8 sm:pb-9 md:pb-11 -mt-[10px]">
          <div className="flex items-center justify-end w-full mb-1 sm:mb-1.5">
            <div className="flex flex-row items-end gap-2">
              <p className="text-[11px] sm:text-[14.3px] md:text-[16.5px] text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(tire.rrc)}
              </p>
              <p className="text-[16.5px] sm:text-[18.7px] md:text-[23.1px] font-bold text-[#1F1F1F] dark:text-white">
                {formatPrice(tire.price)}
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center">
            <div className="flex flex-col items-start">
              {tire.stock > 0 ? (
                <>
                  <span
                    className={`h-[31px] sm:h-[34px] md:h-[40px] flex items-center text-[17.6px] sm:text-[19.8px] md:text-[22px] font-medium px-3 rounded-full ${
                      tire.stock > 10 ? "bg-green-500/20 text-green-600 dark:text-green-400" :
                      tire.stock > 5 ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" :
                      "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                    }`}
                  >
                    {tire.stock > 20 ? ">20 шт" : `${tire.stock} шт`}
                  </span>
                </>
              ) : (
                <span className="h-[31px] sm:h-[34px] md:h-[40px] flex items-center text-[15.4px] sm:text-[17.6px] font-medium px-3 rounded-full bg-red-500/20 text-red-600 dark:text-red-400">Нет в наличии</span>
              )}
            </div>
            <div className="flex items-center flex-1 justify-end ml-2">
              {/* Новая кнопка корзины в стиле из изображения */}
              <div className="flex h-[31px] sm:h-[34px] md:h-[40px] overflow-hidden w-full max-w-[152px] sm:max-w-[174px] md:max-w-[195px]" style={{ border: 'none', outline: 'none', borderRadius: '20px' }}>
                {/* Кнопка минус */}
                <button
                  onClick={removeFromCart}
                  disabled={cartCount <= 0 || tire.stock <= 0}
                  className="bg-gray-500/90 hover:bg-gray-600 text-white h-full flex-1 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ border: 'none', outline: 'none', boxShadow: 'none', borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px' }}
                  aria-label="Уменьшить количество"
                >
                  <Minus className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px] md:w-[22px] md:h-[22px]" />
                </button>

                {/* Счетчик количества */}
                <div className="bg-black/85 text-white h-full flex-1 flex items-center justify-center min-w-[2.2rem] sm:min-w-[2.75rem] md:min-w-[3.3rem]">
                  <span className="text-[13px] sm:text-[15px] md:text-[18px] font-medium">{cartCount}</span>
                </div>

                {/* Кнопка плюс */}
                <button
                  ref={addButtonRef}
                  onClick={addToCart}
                  disabled={tire.stock <= 0 || cartCount >= tire.stock}
                  className="bg-[#D3DF3D]/90 hover:bg-[#C4CF2E] text-black h-full flex-1 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ border: 'none', outline: 'none', boxShadow: 'none', borderTopRightRadius: '20px', borderBottomRightRadius: '20px' }}
                  aria-label="Увеличить количество"
                >
                  <Plus className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px] md:w-[22px] md:h-[22px]" />
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

    </div>
  )
}
