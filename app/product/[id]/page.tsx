"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Heart, Truck, ShieldCheck, Info, Star } from "lucide-react"
import Link from "next/link"
import { BackButton } from "@/components/back-button"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import CartButton from "@/components/cart-button"
import { useParams, useRouter } from "next/navigation"
import type { Tire } from "@/lib/api"
import CryptoJS from "crypto-js"
import CartQuantityButtons from "@/components/cart-quantity-buttons"
import { getDeliveryByWarehouse, getDeliveryColorClass } from "@/lib/delivery-time"

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
  const [selectedWarehouse, setSelectedWarehouse] = useState<{ location: string; stock: number } | null>(null)
  const [warehouseCartCounts, setWarehouseCartCounts] = useState<Record<string, number>>({})
  const [showShareMenu, setShowShareMenu] = useState(false)

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

        // If not in localStorage, try API
        console.log(`Fetching tire from API: /api/tires/${tireId}`)
        const response = await fetch(`/api/tires/${tireId}`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("API error:", response.status, errorData)
          throw new Error(errorData.error || `Товар не найден (${response.status})`)
        }

        const data = await response.json()
        console.log("Tire data from API:", data)

        if (data.tire) {
          setTire(data.tire)
          // Cache for future use
          localStorage.setItem(`tire_${tireId}`, JSON.stringify(data.tire))
        } else {
          throw new Error("Данные о товаре не получены")
        }
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
  }, [tire])

  // Update cart count when warehouse selection changes
  useEffect(() => {
    if (!tire || !selectedWarehouse) {
      setCartCount(0)
      return
    }

    // Check cart count for this product from selected warehouse
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const cartItem = cart.find((item: any) =>
      item.id === tire.id && item.warehouse === selectedWarehouse.location
    )
    setCartCount(cartItem ? cartItem.quantity : 0)
  }, [tire, selectedWarehouse])

  // Load cart counts for all warehouses
  const loadWarehouseCartCounts = () => {
    if (!tire) return
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const counts: Record<string, number> = {}
    cart.forEach((item: any) => {
      if (item.id === tire.id && item.warehouse) {
        counts[item.warehouse] = item.quantity || 0
      }
    })
    setWarehouseCartCounts(counts)
  }

  useEffect(() => {
    loadWarehouseCartCounts()
  }, [tire])

  // Add to cart for specific warehouse
  const addToCartForWarehouse = (warehouse: { location: string; stock: number }) => {
    if (!tire) return

    const currentCount = warehouseCartCounts[warehouse.location] || 0
    if (currentCount >= warehouse.stock) return

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const cartItemKey = `${tire.id}_${warehouse.location}`
    const existingItemIndex = cart.findIndex((item: any) =>
      item.id === tire.id && item.warehouse === warehouse.location
    )

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1
    } else {
      cart.push({
        ...tire,
        quantity: 1,
        warehouse: warehouse.location,
        warehouseStock: warehouse.stock,
        cartItemKey
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    loadWarehouseCartCounts()

    // Update selected warehouse cart count if it matches
    if (selectedWarehouse?.location === warehouse.location) {
      setCartCount(prev => prev + 1)
    }

    window.dispatchEvent(new Event("cartUpdated"))
    window.dispatchEvent(new CustomEvent("cartItemAdded", {
      detail: { totalItems: cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0) }
    }))
  }

  // Remove from cart for specific warehouse
  const removeFromCartForWarehouse = (warehouse: { location: string; stock: number }) => {
    if (!tire) return

    const currentCount = warehouseCartCounts[warehouse.location] || 0
    if (currentCount <= 0) return

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItemIndex = cart.findIndex((item: any) =>
      item.id === tire.id && item.warehouse === warehouse.location
    )

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity = Math.max(0, (cart[existingItemIndex].quantity || 1) - 1)
      if (cart[existingItemIndex].quantity === 0) {
        cart.splice(existingItemIndex, 1)
      }
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    loadWarehouseCartCounts()

    // Update selected warehouse cart count if it matches
    if (selectedWarehouse?.location === warehouse.location) {
      setCartCount(prev => Math.max(0, prev - 1))
    }

    window.dispatchEvent(new Event("cartUpdated"))
    window.dispatchEvent(new CustomEvent("cartItemAdded", {
      detail: { totalItems: cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0) }
    }))
  }

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

    if (!tire || !selectedWarehouse) return

    // Проверяем, не превышен ли лимит доступного товара на выбранном складе
    const stock = selectedWarehouse.stock || 0
    if (cartCount >= stock) {
      return
    }

    // Increase cart count
    setCartCount((prev) => prev + 1)

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Уникальный ключ для товара с учетом склада
    const cartItemKey = `${tire.id}_${selectedWarehouse.location}`

    // Check if product already exists in cart (с учетом склада)
    const existingItemIndex = cart.findIndex((item: any) =>
      item.id === tire.id && item.warehouse === selectedWarehouse.location
    )

    if (existingItemIndex >= 0) {
      // If product exists, increase quantity
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1
    } else {
      // Add new product to cart with warehouse info
      cart.push({
        ...tire,
        quantity: 1,
        warehouse: selectedWarehouse.location,
        warehouseStock: selectedWarehouse.stock,
        cartItemKey
      })
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

    if (!tire || !selectedWarehouse || cartCount <= 0) return

    // Decrease cart count
    setCartCount((prev) => Math.max(0, prev - 1))

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Find existing item (с учетом склада)
    const existingItemIndex = cart.findIndex((item: any) =>
      item.id === tire.id && item.warehouse === selectedWarehouse.location
    )

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

  // Share function
  const handleShare = async () => {
    if (!tire) return

    const productName = tire.name || tire.title || "Шина"
    const productPrice = tire.price || ""
    const shareUrl = window.location.href
    const shareText = `${productName} - ${productPrice} ₽`

    // Пробуем Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: shareText,
          url: shareUrl
        })
        return
      } catch (err) {
        if ((err as Error).name === "AbortError") return
      }
    }

    // Fallback: показываем кастомное меню
    setShowShareMenu(true)
  }

  // Функция для шаринга в конкретное приложение
  const shareToApp = async (app: string) => {
    if (!tire) return

    const productName = tire.name || tire.title || "Шина"
    const productPrice = tire.price || ""
    const shareUrl = window.location.href
    const shareText = `${productName} - ${productPrice} ₽`
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedText = encodeURIComponent(`${shareText}\n${shareUrl}`)

    switch (app) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodedText}`, "_blank")
        break
      case "telegram":
        window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareText)}`, "_blank")
        break
      case "viber":
        window.open(`viber://forward?text=${encodedText}`, "_blank")
        break
      case "sms":
        window.open(`sms:&body=${encodedText}`, "_blank")
        break
      case "email":
        window.open(`mailto:?subject=${encodeURIComponent(productName)}&body=${encodedText}`, "_blank")
        break
      case "copy":
        try {
          await navigator.clipboard.writeText(shareUrl)
        } catch {
          // Fallback для старых браузеров
          const textArea = document.createElement("textarea")
          textArea.value = shareUrl
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand("copy")
          document.body.removeChild(textArea)
        }
        break
    }
    setShowShareMenu(false)
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
      <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212] items-center justify-center">
        <div className="text-[#1F1F1F] dark:text-white text-xl">Загрузка...</div>
      </main>
    )
  }

  // Show error state
  if (error || !tire) {
    return (
      <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212] items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <div className="text-[#1F1F1F] dark:text-white text-xl mb-2">Товар не найден</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs">
            {error || "Возможно, товар был удалён или ссылка устарела"}
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/category/tires">
              <Button className="bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F] w-full">
                Перейти в каталог шин
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-gray-600 text-white bg-transparent w-full">
                На главную
              </Button>
            </Link>
          </div>
        </div>
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
    return CryptoJS.MD5(tire.id).toString()
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
  const getStockLocationInfo = (): Array<{ location: string; stock: number; provider?: string }> => {
    if (!tire) return [{ location: "Уточняйте наличие", stock: 0 }]

    // Используем Map для группировки складов по названию
    const stockMap = new Map<string, number>()

    // Проверяем наличие данных о складах
    if (!tire.storehouse || Object.keys(tire.storehouse).length === 0) {
      // Если нет данных о складах, используем общий stock
      const stock = getTireProperty("stock", 0) as number
      const providerLower = (tire.provider || "").toLowerCase()

      if (providerLower === "tireshop") {
        return [{ location: "В наличии", stock: stock }]
      } else {
        return [{ location: "Уточняйте наличие", stock: stock }]
      }
    }

    let otherCitiesStock = 0
    let hasDavydovo = false

    // Проверяем, есть ли sibzapaska среди провайдеров
    const providers = tire.providers as Record<string, { quantity?: number }> | undefined
    const sibzapaskaQuantity = providers?.sibzapaska?.quantity || 0
    const hasSibzapaska = sibzapaskaQuantity > 0

    // Парсим storehouse объект
    Object.entries(tire.storehouse).forEach(([location, stock]) => {
      const locationLower = location.toLowerCase()
      let normalizedLocation = ""

      // Таллинское шоссе
      if (locationLower.includes("таллинское")) {
        normalizedLocation = "Таллинское шоссе"
      }
      // Пискаревский проспект
      else if (locationLower.includes("пискаревск")) {
        normalizedLocation = "Пискаревский проспект"
      }
      // Санкт-Петербург (точное совпадение или содержит, но не ОХ)
      // Для tireshop пропускаем этот склад - товары уже есть на Таллинское/Пискаревский
      else if (location === "Санкт-Петербург" || (locationLower.includes("санкт-петербург") && !locationLower.includes("ох"))) {
        const providerLower = (tire.provider || "").toLowerCase()
        if (providerLower === "tireshop") {
          // Пропускаем Санкт-Петербург для tireshop
          return
        }
        normalizedLocation = "Санкт-Петербург"
      }
      // Все остальные города - в "Под заказ"
      else {
        // Отмечаем если есть товары из Давыдово
        if (locationLower.includes("давыдово")) {
          hasDavydovo = true
        }
        otherCitiesStock += stock
        return
      }

      // Суммируем количество для одинаковых складов
      stockMap.set(normalizedLocation, (stockMap.get(normalizedLocation) || 0) + stock)
    })

    // Добавляем "Под заказ" если есть товары в других городах
    // Если есть sibzapaska - выделяем его отдельно
    if (otherCitiesStock > 0) {
      if (hasSibzapaska && sibzapaskaQuantity < otherCitiesStock) {
        // Есть и sibzapaska и другие провайдеры - разделяем
        const otherStock = otherCitiesStock - sibzapaskaQuantity
        if (otherStock > 0) {
          // Если все остальные товары из Давыдово - помечаем
          stockMap.set(hasDavydovo ? "Под заказ (Давыдово)" : "Под заказ", otherStock)
        }
        stockMap.set("Удаленный склад", sibzapaskaQuantity)
      } else if (hasSibzapaska && sibzapaskaQuantity >= otherCitiesStock) {
        // Все товары от sibzapaska
        stockMap.set("Удаленный склад", otherCitiesStock)
      } else {
        // Нет sibzapaska - всё в "Под заказ"
        // Если товары из Давыдово - помечаем
        stockMap.set(hasDavydovo ? "Под заказ (Давыдово)" : "Под заказ", otherCitiesStock)
      }
    }

    // Преобразуем Map в массив
    const stockLocations = Array.from(stockMap.entries()).map(([location, stock]) => ({
      location: location.replace(" (Давыдово)", ""), // Убираем метку из отображения
      stock,
      provider: location === "Удаленный склад" ? "sibzapaska" : undefined,
      fromDavydovo: location.includes("Давыдово")
    }))

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
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] pr-4 shadow-sm h-[60px] flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <BackButton />
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
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 pb-20">
        <div className="bg-white pt-2 px-4 pb-4">
          {/* Image Gallery */}
          <div className="relative">
            {/* Rating overlay - bottom left */}
            <div className="absolute bottom-2 left-2 z-[5] bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
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

            {/* Country/Flag overlay - top right */}
            <div className="absolute top-2 right-2 z-[5] bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white font-medium">
                  {tire.country || tire.model?.brand?.country?.name || ""}
                </span>
                {flagError ? (
                  <div
                    className="rounded-sm w-[20px] h-[14px] bg-gray-700 flex items-center justify-center text-[7px] text-gray-400"
                  >
                    {tire.country_code || tire.model?.brand?.country?.id || "?"}
                  </div>
                ) : (
                  <Image
                    src={getCountryFlag()}
                    alt={tire.country || tire.model?.brand?.country?.name || "Country"}
                    width={20}
                    height={14}
                    className="rounded-sm w-[20px] h-[14px]"
                    onError={() => setFlagError(true)}
                  />
                )}
              </div>
            </div>

            {/* Icons overlay - bottom right (spike, runflat, cargo) */}
            {(tire.spike || tire.runflat || tire.cargo) && (
              <div className="absolute bottom-2 right-2 z-[5] bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  {/* Spike icon */}
                  {tire.spike && (
                    <Image
                      src="/images/bykvaSH.png"
                      alt="Шипы"
                      width={20}
                      height={20}
                      className="h-5 w-5"
                      title="Шипованная шина"
                    />
                  )}
                  {/* RunFlat icon */}
                  {(tire.runflat === true || tire.runflat === 1 || tire.runflat === "true" || tire.runflat === "1") && (
                    <span className="text-xs font-bold text-white" title="RunFlat Technology">
                      RFT
                    </span>
                  )}
                  {/* Cargo icon */}
                  {(tire.cargo === true || tire.cargo === 1 || tire.cargo === "true" || tire.cargo === "1") && (
                    <Image
                      src="/images/cargo-truck-new.png"
                      alt="Грузовая"
                      width={20}
                      height={20}
                      className="h-5 w-5"
                      title="Грузовая шина"
                    />
                  )}
                </div>
              </div>
            )}

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

        <div className="p-4 space-y-1 -mt-2">
          <h2 className="text-xl font-bold text-white">{tire.name || tire.title || "—"}</h2>

          {/* Price section */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs text-gray-400 line-through">
              {getTireProperty("rrc")} ₽
            </span>
            <span className="text-xl font-bold text-[#009CFF]">{getTireProperty("price")} ₽</span>
          </div>
        </div>

        {/* Stock availability section - Full width */}
        <div className="px-4 py-4 -mt-[30px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getStockLocationInfo().map((locationInfo, index) => {
              const warehouseCartCount = warehouseCartCounts[locationInfo.location] || 0
              const availableStock = locationInfo.stock - warehouseCartCount
              const stockColor = availableStock > 10
                ? 'text-green-400'
                : availableStock > 5
                  ? 'text-yellow-400'
                  : availableStock > 0
                    ? 'text-orange-400'
                    : 'text-red-400'

              // Получаем информацию о доставке
              // Если товар из Давыдово - 5-7 дней
              const deliveryInfo = (locationInfo as any).fromDavydovo
                ? { text: "Доставка 5-7 дней", type: "medium" as const }
                : getDeliveryByWarehouse(locationInfo.location, tire.provider)

              return (
                <div
                  key={index}
                  className={`flex justify-between items-center p-4 rounded-xl transition-all ${
                    locationInfo.stock > 0
                      ? 'bg-[#2A2A2A]'
                      : 'bg-[#2A2A2A] opacity-50'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {locationInfo.location}
                    </span>
                    <span className={`text-[10px] ${getDeliveryColorClass(deliveryInfo.type)}`}>
                      {deliveryInfo.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${stockColor} w-[70px] text-right`}>
                      {availableStock > 20 ? ">20 шт" : availableStock > 0 ? `${availableStock} шт` : "Нет"}
                    </span>
                    <CartQuantityButtons
                      count={warehouseCartCount}
                      maxStock={locationInfo.stock}
                      onAdd={(e) => {
                        e.stopPropagation()
                        addToCartForWarehouse(locationInfo)
                      }}
                      onRemove={(e) => {
                        e.stopPropagation()
                        removeFromCartForWarehouse(locationInfo)
                      }}
                      showBorder
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-3 bg-[#2A2A2A] rounded-lg">
              <Truck className="h-5 w-5 text-[#009CFF]" />
              <div>
                <p className="text-sm font-medium text-white">Бесплатная доставка</p>
                <p className="text-xs text-gray-400">При оплате сейчас</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#2A2A2A] rounded-lg">
              <ShieldCheck className="h-5 w-5 text-[#009CFF]" />
              <div>
                <p className="text-sm font-medium text-white">Гарантия 1 год</p>
                <p className="text-xs text-gray-400">Официальная гарантия производителя</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#2A2A2A] rounded-lg">
              <span className="h-5 w-5 text-[#D3DF3D] font-bold text-sm flex items-center justify-center">%</span>
              <div>
                <p className="text-sm font-medium text-white">Скидка на шиномонтаж 20%</p>
                <p className="text-xs text-gray-400">При покупке от 4 шин</p>
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
                  <span className="text-sm text-white">Артикул</span>
                  <span className="text-sm font-medium text-white">{getMid()}</span>
                </div>
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

      {/* Share Menu Modal */}
      {showShareMenu && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 z-[100] flex items-end justify-center"
          onClick={() => setShowShareMenu(false)}
        >
          {/* Backdrop */}
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50" />

          {/* Share Sheet */}
          <div
            className="relative w-full max-w-lg bg-[#2A2A2A] rounded-t-3xl p-4 pb-8 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-gray-500 rounded-full mx-auto mb-4" />

            <h3 className="text-lg font-semibold text-white text-center mb-4">Поделиться</h3>

            {/* Share Options Grid */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <button
                onClick={() => shareToApp("whatsapp")}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 bg-[#25D366] rounded-2xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="text-xs text-white">WhatsApp</span>
              </button>

              <button
                onClick={() => shareToApp("telegram")}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 bg-[#0088cc] rounded-2xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <span className="text-xs text-white">Telegram</span>
              </button>

              <button
                onClick={() => shareToApp("sms")}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 bg-[#34C759] rounded-2xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
                  </svg>
                </div>
                <span className="text-xs text-white">SMS</span>
              </button>

              <button
                onClick={() => shareToApp("email")}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 bg-[#007AFF] rounded-2xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <span className="text-xs text-white">Почта</span>
              </button>
            </div>

            {/* Copy Link Button */}
            <button
              onClick={() => shareToApp("copy")}
              className="w-full py-3 bg-[#3A3A3A] rounded-xl text-white font-medium flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
              Скопировать ссылку
            </button>

          </div>
        </div>
      )}
    </main>
  )
}
