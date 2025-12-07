"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, Heart, Share2, Truck, ShieldCheck, Info, Star, Plus, Minus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import BottomNavigation from "@/components/bottom-navigation"
import CartButton from "@/components/cart-button"
import { useParams, useRouter } from "next/navigation"
import type { Tire } from "@/lib/api"
import MD5 from "crypto-js/md5"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const tireId = params.id as string

  const [tire, setTire] = useState<Tire | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [flagError, setFlagError] = useState(false)

  // Load tire data from localStorage or API
  useEffect(() => {
    async function fetchTire() {
      try {
        setLoading(true)
        setError(null)

        // First, try to load from localStorage
        const cachedTire = localStorage.getItem(`tire_${tireId}`)

        if (cachedTire) {
          try {
            const parsedTire = JSON.parse(cachedTire)
            setTire(parsedTire)
            setLoading(false)
            return
          } catch (parseError) {
            console.error("Failed to parse cached tire data:", parseError)
            // Continue to API fetch if localStorage data is invalid
          }
        }

        // If not in localStorage, try API (though it likely won't work)
        const response = await fetch(`/api/tires/${tireId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch tire: ${response.status}`)
        }

        const data = await response.json()
        setTire(data.tire)
      } catch (err) {
        console.error("Error loading tire:", err)
        setError(err instanceof Error ? err.message : "Failed to load tire")
      } finally {
        setLoading(false)
      }
    }

    if (tireId) {
      fetchTire()
    }
  }, [tireId])

  // Get product images from tire data or use placeholder
  const getTireImage = () => {
    if (!tire) return "/placeholder.svg"

    const API_TOKEN = "KYf-JMMTweMWASr-zktunkLwnPKfzeIO"

    // Check if the tire has an image property directly (full URL)
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

    // Try legacy image sources
    if (tire.img) return tire.img
    if (tire.images && tire.images.length > 0) return tire.images[0]

    // Fallback to placeholder
    return "/placeholder.svg"
  }

  // Load cart count and favorite status on component mount
  useEffect(() => {
    if (!tire) return

    // Check if product is in favorites
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    setIsFavorite(favorites.some((item: any) => item.id === tire.id))

    // Check cart count for this product
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const cartItem = cart.find((item: any) => item.id === tire.id)
    setCartCount(cartItem ? cartItem.quantity : 0)
  }, [tire])

  // Listen for cart reset events
  useEffect(() => {
    const handleResetCartCounters = () => {
      setCartCount(0)
    }

    window.addEventListener("resetAllCartCounters", handleResetCartCounters)

    return () => {
      window.removeEventListener("resetAllCartCounters", handleResetCartCounters)
    }
  }, [])


  // Add to cart function
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!tire) return

    // Increase cart count
    setCartCount((prev) => prev + 1)

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex((item: any) => item.id === tire.id)

    if (existingItemIndex >= 0) {
      // If product exists, increase quantity
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1
    } else {
      // Add new product to cart
      cart.push({ ...tire, quantity: 1 })
    }

    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(cart))

    // Dispatch events for other components
    window.dispatchEvent(new Event("cartUpdated"))

    const cartUpdateEvent = new CustomEvent("cartItemAdded", {
      detail: {
        totalItems: cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0),
      },
    })
    window.dispatchEvent(cartUpdateEvent)
  }

  // Remove from cart function
  const removeFromCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!tire || cartCount <= 0) return

    // Decrease cart count
    setCartCount((prev) => Math.max(0, prev - 1))

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Find existing item
    const existingItemIndex = cart.findIndex((item: any) => item.id === tire.id)

    if (existingItemIndex >= 0) {
      // Decrease quantity
      cart[existingItemIndex].quantity = Math.max(0, (cart[existingItemIndex].quantity || 1) - 1)

      // Remove item if quantity becomes 0
      if (cart[existingItemIndex].quantity === 0) {
        cart.splice(existingItemIndex, 1)
      }
    }

    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(cart))

    // Dispatch events for other components
    window.dispatchEvent(new Event("cartUpdated"))

    const cartUpdateEvent = new CustomEvent("cartItemAdded", {
      detail: {
        totalItems: cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0),
      },
    })
    window.dispatchEvent(cartUpdateEvent)
  }

  // Toggle favorite function
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!tire) return

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")

    if (isFavorite) {
      const updatedFavorites = favorites.filter((item: any) => item.id !== tire.id)
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
      setIsFavorite(false)
    } else {
      favorites.push(tire)
      localStorage.setItem("favorites", JSON.stringify(favorites))
      setIsFavorite(true)
    }

    window.dispatchEvent(new Event("favoritesUpdated"))
  }

  // Show loading state
  if (loading) {
    return (
      <main className="flex flex-col min-h-screen bg-[#1F1F1F] items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </main>
    )
  }

  // Show error state
  if (error || !tire) {
    return (
      <main className="flex flex-col min-h-screen bg-[#1F1F1F] items-center justify-center p-4">
        <div className="text-white text-xl mb-4">Товар не найден</div>
        <Link href="/">
          <Button className="bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F]">
            Вернуться на главную
          </Button>
        </Link>
      </main>
    )
  }

  // Get tire properties with fallbacks
  const getTireProperty = (property: keyof Tire, fallback: any = "—") => {
    if (!tire) return fallback

    // Direct property access
    if (tire[property]) {
      // Handle nested objects (e.g., model, brand)
      if (typeof tire[property] === "object" && tire[property] !== null) {
        // If it's a model object, try to get the name
        if (property === "model" && typeof tire[property] === "object") {
          return (tire[property] as any).name || (tire[property] as any).title || fallback
        }
        // If it's a brand object, try to get the name
        if (property === "brand" && typeof tire[property] === "object") {
          return (tire[property] as any).name || (tire[property] as any).title || fallback
        }
        return fallback
      }
      return tire[property]
    }

    return fallback
  }

  // Get season name
  const getSeasonName = () => {
    const season = getTireProperty("season", "")
    if (season === "w") return "Зимняя"
    if (season === "s") return "Летняя"
    if (season === "a") return "Всесезонная"
    return "—"
  }

  // Get mid (MD5 hash of id)
  const getMid = (): string => {
    if (!tire || !tire.id) return "—"
    return MD5(tire.id).toString()
  }

  // Get delivery status by provider
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

  // Get stock location info from storehouse
  const getStockLocationInfo = (): Array<{ location: string; stock: number }> => {
    if (!tire) return [{ location: "Уточняйте наличие", stock: 0 }]

    const stockLocations: Array<{ location: string; stock: number }> = []

    // Проверяем наличие данных о складах
    if (!tire.storehouse || Object.keys(tire.storehouse).length === 0) {
      // Если нет данных о складах, используем общий stock
      const stock = getTireProperty("stock", 0) as number
      const deliveryStatus = getDeliveryStatusByProvider(tire.provider)

      if (deliveryStatus === "Забрать сегодня") {
        stockLocations.push({ location: "В наличии", stock: stock })
      } else {
        stockLocations.push({ location: "Уточняйте наличие", stock: stock })
      }

      return stockLocations
    }

    let otherCitiesStock = 0

    // Парсим storehouse объект
    Object.entries(tire.storehouse).forEach(([location, stock]) => {
      const locationLower = location.toLowerCase()

      // Таллинское шоссе
      if (locationLower.includes("таллинское")) {
        stockLocations.push({ location: "Таллинское шоссе", stock })
      }
      // Пискаревский проспект
      else if (locationLower.includes("пискаревск")) {
        stockLocations.push({ location: "Пискаревский проспект", stock })
      }
      // Санкт-Петербург (точное совпадение или содержит, но не ОХ)
      else if (location === "Санкт-Петербург" || (locationLower.includes("санкт-петербург") && !locationLower.includes("ох"))) {
        stockLocations.push({ location: "Санкт-Петербург", stock })
      }
      // Все остальные города - суммируем для "Под заказ"
      else {
        otherCitiesStock += stock
      }
    })

    // Добавляем "Под заказ" если есть товары в других городах
    if (otherCitiesStock > 0) {
      stockLocations.push({ location: "Под заказ", stock: otherCitiesStock })
    }

    // Если нет данных, показываем сообщение
    if (stockLocations.length === 0) {
      stockLocations.push({ location: "Уточняйте наличие", stock: 0 })
    }

    return stockLocations
  }

  // Get country flag URL
  const getCountryFlag = (): string => {
    if (!tire) return "/placeholder.svg?height=16&width=24"

    const API_TOKEN = "KYf-JMMTweMWASr-zktunkLwnPKfzeIO"

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

  return (
    <main className="flex flex-col min-h-screen bg-[#1F1F1F]">
      <header className="sticky top-0 z-10 bg-[#2A2A2A] pr-4 shadow-sm h-[60px] flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="p-2 transition-colors"
              aria-label="Назад"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Карточка товара</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CartButton />
            <Button variant="ghost" size="icon" onClick={toggleFavorite}>
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isFavorite ? "text-red-500 fill-red-500" : "text-white hover:text-red-500"
                }`}
              />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 pb-20">
        <div className="bg-white pt-2 px-4 pb-4">
          {/* Image Gallery */}
          <div className="relative">
            {/* Rating overlay - bottom left */}
            <div className="absolute bottom-2 left-2 z-10 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${star <= 4 ? "fill-[#D3DF3D] text-[#D3DF3D]" : "text-gray-400"}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-white font-medium">4.0 (86)</span>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative w-full max-w-[400px]" style={{ maxHeight: '400px' }}>
                <Image
                  src={getTireImage()}
                  alt={tire.name || "Tire"}
                  width={400}
                  height={400}
                  className="object-contain w-full h-auto"
                  style={{ maxHeight: '400px' }}
                />

              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white">{tire.name || tire.title || "—"}</h2>

            {/* Article and Flag/Country on same line */}
            <div className="flex items-center justify-between mt-1">
              <p className="text-[10px] text-gray-400">Артикул: {getMid()}</p>

              {/* Flag and Country */}
              <div className="flex items-center gap-2">
                {flagError ? (
                  <div
                    className="rounded-sm w-[24px] h-[16px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[8px] text-gray-500"
                    title={`URL флага: ${getCountryFlag()}`}
                  >
                    {tire.country_code || tire.model?.brand?.country?.id || "?"}
                  </div>
                ) : (
                  <div className="relative w-[24px] h-[16px]">
                    <Image
                      src={getCountryFlag()}
                      alt={tire.country || tire.model?.brand?.country?.name || "Country"}
                      width={24}
                      height={16}
                      className="rounded-sm w-[24px] h-[16px] border border-gray-200"
                      onError={() => setFlagError(true)}
                    />
                  </div>
                )}
                <span className="text-sm text-gray-400">
                  {tire.country || tire.model?.brand?.country?.name || "Страна не указана"}
                </span>
              </div>
            </div>

            {/* Country disclaimer */}
            <p className="text-xs text-gray-500 italic mt-1">
              Информация о происхождение бренда, страна производства может отличаться
            </p>
          </div>

          {/* Stock availability section */}
          <div className="bg-[#2A2A2A] rounded-lg p-4 mt-4">
            <h3 className="text-lg font-semibold text-white mb-3">Наличие</h3>
            <div className="space-y-2">
              {getStockLocationInfo().map((locationInfo, index) => (
                <div key={index} className="flex justify-between items-center text-white">
                  <span className="text-sm">{locationInfo.location}</span>
                  <span className={`text-sm font-medium ${locationInfo.stock > 0 ? 'text-[#D3DF3D]' : 'text-gray-500'}`}>
                    {locationInfo.stock > 0 ? `${locationInfo.stock} шт` : "0 шт"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-sm text-gray-400 line-through">
                {getTireProperty("rrc")} ₽
              </p>
              <span className="text-2xl font-bold text-[#009CFF]">{getTireProperty("price")} ₽</span>
            </div>

            {/* Cart controls matching other pages */}
            <div className="flex items-center gap-0">
              <div className="flex h-9 sm:h-10 md:h-11 lg:h-12 rounded-xl overflow-hidden">
                {/* Minus button */}
                <button
                  onClick={removeFromCart}
                  disabled={cartCount <= 0}
                  className="bg-gray-500/90 hover:bg-gray-600 text-white h-full px-3 sm:px-4 md:px-5 lg:px-6 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                  style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                  aria-label="Уменьшить количество"
                >
                  <Minus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>

                {/* Counter */}
                <div className="bg-black/85 text-white h-full px-2 sm:px-3 md:px-4 flex items-center justify-center min-w-[2.5rem] sm:min-w-[3rem] md:min-w-[3.5rem] lg:min-w-[4rem] backdrop-blur-sm">
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">{cartCount}</span>
                </div>

                {/* Plus button */}
                <button
                  onClick={addToCart}
                  className="bg-[#D3DF3D]/90 hover:bg-[#C4CF2E] text-black h-full px-3 sm:px-4 md:px-5 lg:px-6 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                  style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                  aria-label="Увеличить количество"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-3 p-3 bg-[#2A2A2A] rounded-lg">
              <Truck className="h-5 w-5 text-[#009CFF]" />
              <div>
                <p className="text-sm font-medium text-white">Бесплатная доставка</p>
                <p className="text-xs text-gray-400">При заказе от 8 000 ₽</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#2A2A2A] rounded-lg">
              <ShieldCheck className="h-5 w-5 text-[#009CFF]" />
              <div>
                <p className="text-sm font-medium text-white">Гарантия 1 год</p>
                <p className="text-xs text-gray-400">Официальная гарантия производителя</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="specs" className="w-full mt-6">
            <TabsList className="w-full bg-[#2A2A2A] rounded-xl p-1">
              <TabsTrigger
                value="specs"
                className="rounded-lg text-gray-400 data-[state=active]:bg-[#009CFF] data-[state=active]:text-white"
              >
                Характеристики
              </TabsTrigger>
              <TabsTrigger
                value="description"
                className="rounded-lg text-gray-400 data-[state=active]:bg-[#009CFF] data-[state=active]:text-white"
              >
                Описание
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-lg text-gray-400 data-[state=active]:bg-[#009CFF] data-[state=active]:text-white"
              >
                Отзывы
              </TabsTrigger>
            </TabsList>
            <TabsContent value="specs" className="mt-4 space-y-3">
              <div className="bg-[#2A2A2A] rounded-lg p-4">
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Бренд</span>
                  <span className="text-sm font-medium text-white">{getTireProperty("brand")}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Модель</span>
                  <span className="text-sm font-medium text-white">{getTireProperty("model")}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Ширина</span>
                  <span className="text-sm font-medium text-white">{getTireProperty("width")} мм</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Профиль</span>
                  <span className="text-sm font-medium text-white">{getTireProperty("height") || getTireProperty("profile")}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Диаметр</span>
                  <span className="text-sm font-medium text-white">{getTireProperty("diam") || getTireProperty("diameter")}"</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Сезон</span>
                  <span className="text-sm font-medium text-white">{getSeasonName()}</span>
                </div>
                {getTireProperty("load_index") && (
                  <div className="flex justify-between py-2 border-b border-gray-600">
                    <span className="text-sm text-white">Индекс нагрузки</span>
                    <span className="text-sm font-medium text-white">{getTireProperty("load_index")}</span>
                  </div>
                )}
                {getTireProperty("speed_index") && (
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-white">Индекс скорости</span>
                    <span className="text-sm font-medium text-white">{getTireProperty("speed_index")}</span>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="description" className="mt-4">
              <div className="bg-[#2A2A2A] rounded-lg p-4">
                <p className="text-sm text-white leading-relaxed">
                  {tire.description ||
                    `${getTireProperty("brand")} ${getTireProperty("model")} — качественные шины ${getSeasonName().toLowerCase()} для вашего автомобиля. Обеспечивают отличное сцепление с дорогой, короткий тормозной путь и точную управляемость.`}
                </p>
                {tire.description && (
                  <div className="mt-4 flex items-center gap-2">
                    <Info className="h-4 w-4 text-[#009CFF]" />
                    <p className="text-xs text-[#009CFF]">Подробнее на сайте производителя</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <div className="bg-[#2A2A2A] rounded-lg p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-white">Алексей В.</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${star <= 5 ? "fill-[#D3DF3D] text-[#D3DF3D]" : "text-gray-600"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white">
                    Отличные шины! Управляемость на высоте, шум минимальный. Рекомендую.
                  </p>
                  <p className="text-xs text-gray-400">12.03.2023</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-white">Марина К.</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${star <= 4 ? "fill-[#D3DF3D] text-[#D3DF3D]" : "text-gray-600"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white">
                    Хорошие шины, но цена высоковата. За эти деньги ожидала чуть большего.
                  </p>
                  <p className="text-xs text-gray-400">28.02.2023</p>
                </div>
                <Button variant="outline" className="w-full border-gray-600 text-white bg-transparent">
                  Все отзывы (86)
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}
