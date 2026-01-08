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
import BottomNavigation from "@/components/bottom-navigation"
import { useParams } from "next/navigation"
import type { Disk } from "@/lib/api"
import CryptoJS from "crypto-js"
import CartQuantityButtons from "@/components/cart-quantity-buttons"
import CartButton from "@/components/cart-button"
import { getDeliveryByWarehouse, getDeliveryColorClass } from "@/lib/delivery-time"

export default function DiskProductPage() {
  const params = useParams()
  const diskId = params.id as string

  const [disk, setDisk] = useState<Disk | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [flagError, setFlagError] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState<{ location: string; stock: number } | null>(null)
  const [warehouseCartCounts, setWarehouseCartCounts] = useState<Record<string, number>>({})
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [isFavoriteAnimating, setIsFavoriteAnimating] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Load disk data from localStorage or API
  useEffect(() => {
    async function fetchDisk() {
      try {
        setLoading(true)
        setError(null)

        // First, try to load from localStorage
        const cachedDisk = localStorage.getItem(`disk_${diskId}`)

        if (cachedDisk) {
          try {
            const parsedDisk = JSON.parse(cachedDisk)
            console.log('Disk data from localStorage:', parsedDisk)
            console.log('Disk model field from localStorage:', parsedDisk.model)
            console.log('Disk brand field from localStorage:', parsedDisk.brand)

            // Проверяем, есть ли поле model - если нет, значит кеш устарел
            if (!parsedDisk.model) {
              console.warn('Cached disk data is outdated (missing model field), removing from cache')
              localStorage.removeItem(`disk_${diskId}`)
              // Continue to fetch fresh data
            } else {
              setDisk(parsedDisk)
              setLoading(false)
              return
            }
          } catch (parseError) {
            console.error("Failed to parse cached disk data:", parseError)
            // Continue to API fetch if localStorage data is invalid
          }
        }

        // If not in localStorage, try API
        console.log(`Fetching disk from API: /api/disks/${diskId}`)
        const response = await fetch(`/api/disks/${diskId}`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("API error:", response.status, errorData)
          throw new Error(errorData.error || `Товар не найден (${response.status})`)
        }

        const data = await response.json()
        console.log("Disk data from API:", data)

        if (data.disk) {
          console.log('Disk data from API:', data.disk)
          console.log('Disk model field:', data.disk.model)
          console.log('Disk brand field:', data.disk.brand)
          setDisk(data.disk)
          // Cache for future use
          localStorage.setItem(`disk_${diskId}`, JSON.stringify(data.disk))
        } else {
          throw new Error("Данные о товаре не получены")
        }
      } catch (err) {
        console.error("Error loading disk:", err)
        setError(err instanceof Error ? err.message : "Failed to load disk")
      } finally {
        setLoading(false)
      }
    }

    if (diskId) {
      fetchDisk()
    }
  }, [diskId])

  // Get product images from disk data or use placeholder
  const getDiskImage = () => {
    if (!disk) return "/placeholder.svg"

    const API_TOKEN = "KYf-JMMTweMWASr-zktunkLwnPKfzeIO"

    // Check if the disk has an image property directly (full URL)
    if (disk.image && typeof disk.image === "string" && disk.image.startsWith("http")) {
      return disk.image
    }

    // Check if the disk has a model with an image (when model is an object)
    if (disk.model && typeof disk.model === "object" && (disk.model as any).image) {
      // Form the API URL with the access token
      return `https://api.fxcode.ru/assets/${(disk.model as any).image}?access_token=${API_TOKEN}`
    }

    // If the image is an API asset ID
    if (disk.image && typeof disk.image === "string" && !disk.image.startsWith("http")) {
      return `https://api.fxcode.ru/assets/${disk.image}?access_token=${API_TOKEN}`
    }

    // Try legacy image sources
    if (disk.img) return disk.img
    if (disk.images && disk.images.length > 0) return disk.images[0]

    // Fallback to placeholder
    return "/placeholder.svg"
  }

  // Load cart count and favorite status on component mount
  useEffect(() => {
    if (!disk) return

    // Check if product is in favorites
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    setIsFavorite(favorites.some((item: any) => item.id === disk.id))
  }, [disk])

  // Update cart count when warehouse selection changes
  useEffect(() => {
    if (!disk || !selectedWarehouse) {
      setCartCount(0)
      return
    }

    // Check cart count for this product from selected warehouse
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const cartItem = cart.find((item: any) =>
      item.id === disk.id && item.warehouse === selectedWarehouse.location
    )
    setCartCount(cartItem ? cartItem.quantity : 0)
  }, [disk, selectedWarehouse])

  // Load cart counts for all warehouses
  const loadWarehouseCartCounts = () => {
    if (!disk) return
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const counts: Record<string, number> = {}
    cart.forEach((item: any) => {
      if (item.id === disk.id && item.warehouse) {
        counts[item.warehouse] = item.quantity || 0
      }
    })
    setWarehouseCartCounts(counts)
  }

  useEffect(() => {
    loadWarehouseCartCounts()
  }, [disk])

  // Add to cart for specific warehouse (disks are sold individually)
  const addToCartForWarehouse = (warehouse: { location: string; stock: number }) => {
    if (!disk) return

    const currentCount = warehouseCartCounts[warehouse.location] || 0
    if (currentCount >= warehouse.stock) return

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const cartItemKey = `${disk.id}_${warehouse.location}`
    const existingItemIndex = cart.findIndex((item: any) =>
      item.id === disk.id && item.warehouse === warehouse.location
    )

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1
    } else {
      cart.push({
        ...disk,
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

  // Remove from cart for specific warehouse (disks are removed individually)
  const removeFromCartForWarehouse = (warehouse: { location: string; stock: number }) => {
    if (!disk) return

    const currentCount = warehouseCartCounts[warehouse.location] || 0
    if (currentCount <= 0) return

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItemIndex = cart.findIndex((item: any) =>
      item.id === disk.id && item.warehouse === warehouse.location
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

  // Share function
  const handleShare = async () => {
    if (!disk) return

    const productName = disk.name || disk.title || "Диск"
    const productPrice = disk.price || ""
    const shareUrl = window.location.href
    const shareText = `${productName} - ${productPrice} ₽`

    // Try Web Share API
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

    // Fallback: show custom menu
    setShowShareMenu(true)
  }

  // Share to specific app
  const shareToApp = async (app: string) => {
    if (!disk) return

    const productName = disk.name || disk.title || "Диск"
    const productPrice = disk.price || ""
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
          // Fallback for older browsers
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

    if (!disk) return

    // Start animation
    setIsFavoriteAnimating(true)
    setTimeout(() => setIsFavoriteAnimating(false), 300)

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")

    if (isFavorite) {
      const updatedFavorites = favorites.filter((item: any) => item.id !== disk.id)
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
      setIsFavorite(false)
    } else {
      favorites.push(disk)
      localStorage.setItem("favorites", JSON.stringify(favorites))
      setIsFavorite(true)
    }

    window.dispatchEvent(new Event("favoritesUpdated"))
  }

  // Get disk properties with fallbacks
  const getDiskProperty = (property: keyof Disk, fallback: any = "—") => {
    if (!disk) return fallback

    // Direct property access
    if (disk[property]) {
      // Handle nested objects (e.g., model, brand)
      if (typeof disk[property] === "object" && disk[property] !== null) {
        // If it's a model object, try to get the name
        if (property === "model" && typeof disk[property] === "object") {
          return (disk[property] as any).name || (disk[property] as any).title || fallback
        }
        // If it's a brand object, try to get the name
        if (property === "brand" && typeof disk[property] === "object") {
          return (disk[property] as any).name || (disk[property] as any).title || fallback
        }
        return fallback
      }
      return disk[property]
    }

    return fallback
  }

  // Get mid (MD5 hash of id)
  const getMid = (): string => {
    if (!disk || !disk.id) return "—"
    return CryptoJS.MD5(disk.id).toString()
  }

  // Get stock location info from storehouse
  const getStockLocationInfo = (): Array<{ location: string; stock: number; provider?: string }> => {
    if (!disk) return [{ location: "Уточняйте наличие", stock: 0 }]

    // Use Map to group warehouses by name
    const stockMap = new Map<string, number>()

    // Check if storehouse data exists
    if (!disk.storehouse || Object.keys(disk.storehouse).length === 0) {
      // If no storehouse data, use general stock
      const stock = getDiskProperty("stock", 0) as number
      const providerLower = (disk.provider || "").toLowerCase()

      if (providerLower === "tireshop") {
        return [{ location: "В наличии", stock: stock }]
      } else {
        return [{ location: "Уточняйте наличие", stock: stock }]
      }
    }

    let otherCitiesStock = 0
    let hasDavydovo = false

    // Check if sibzapaska is among providers
    const providers = disk.providers as Record<string, { quantity?: number }> | undefined
    const sibzapaskaQuantity = providers?.sibzapaska?.quantity || 0
    const hasSibzapaska = sibzapaskaQuantity > 0

    // Parse storehouse object
    Object.entries(disk.storehouse).forEach(([location, stock]) => {
      const locationLower = location.toLowerCase()
      let normalizedLocation = ""

      // Tallinskoe highway
      if (locationLower.includes("таллинское")) {
        normalizedLocation = "Таллинское шоссе"
      }
      // Piskarevsky prospect
      else if (locationLower.includes("пискаревск")) {
        normalizedLocation = "Пискаревский проспект"
      }
      // Saint Petersburg (exact match or contains, but not OH)
      // For tireshop skip this warehouse - products already on Tallinskoe/Piskarevsky
      else if (location === "Санкт-Петербург" || (locationLower.includes("санкт-петербург") && !locationLower.includes("ох"))) {
        const providerLower = (disk.provider || "").toLowerCase()
        if (providerLower === "tireshop") {
          // Skip Saint Petersburg for tireshop
          return
        }
        normalizedLocation = "Санкт-Петербург"
      }
      // All other cities - to "On order"
      else {
        // Mark if there are products from Davydovo
        if (locationLower.includes("давыдово")) {
          hasDavydovo = true
        }
        otherCitiesStock += stock
        return
      }

      // Sum quantity for identical warehouses
      stockMap.set(normalizedLocation, (stockMap.get(normalizedLocation) || 0) + stock)
    })

    // Add "On order" if there are products in other cities
    // If there's sibzapaska - separate it
    if (otherCitiesStock > 0) {
      if (hasSibzapaska && sibzapaskaQuantity < otherCitiesStock) {
        // Both sibzapaska and other providers - separate
        const otherStock = otherCitiesStock - sibzapaskaQuantity
        if (otherStock > 0) {
          // If all other products from Davydovo - mark it
          stockMap.set(hasDavydovo ? "Под заказ (Давыдово)" : "Под заказ", otherStock)
        }
        stockMap.set("Удаленный склад", sibzapaskaQuantity)
      } else if (hasSibzapaska && sibzapaskaQuantity >= otherCitiesStock) {
        // All products from sibzapaska
        stockMap.set("Удаленный склад", otherCitiesStock)
      } else {
        // No sibzapaska - all to "On order"
        // If products from Davydovo - mark it
        stockMap.set(hasDavydovo ? "Под заказ (Давыдово)" : "Под заказ", otherCitiesStock)
      }
    }

    // Convert Map to array
    const stockLocations = Array.from(stockMap.entries()).map(([location, stock]) => ({
      location: location.replace(" (Давыдово)", ""), // Remove label from display
      stock,
      provider: location === "Удаленный склад" ? "sibzapaska" : undefined,
      fromDavydovo: location.includes("Давыдово")
    }))

    // If no data, show message
    if (stockLocations.length === 0) {
      stockLocations.push({ location: "Уточняйте наличие", stock: 0 })
    }

    return stockLocations
  }

  // Get country flag URL
  const getCountryFlag = (): string => {
    if (!disk) return "/placeholder.svg?height=16&width=24"

    const API_TOKEN = "KYf-JMMTweMWASr-zktunkLwnPKfzeIO"

    try {
      // Check for direct flag field from Tirebase API
      if (disk.flag) {
        // If flag is already a full URL, return it
        if (typeof disk.flag === "string" && disk.flag.startsWith("http")) {
          return disk.flag
        }
        // If it's an ID, form URL
        if (typeof disk.flag === "string") {
          return `https://api.fxcode.ru/assets/${disk.flag}?access_token=${API_TOKEN}`
        }
      }

      // Check for full path to flag (old format)
      if (
        disk.model &&
        typeof disk.model === "object" &&
        disk.model.brand &&
        typeof disk.model.brand === "object" &&
        disk.model.brand.country &&
        typeof disk.model.brand.country === "object" &&
        disk.model.brand.country.flag
      ) {
        // If flag is a string, use it directly
        if (typeof disk.model.brand.country.flag === "string") {
          return `https://api.fxcode.ru/assets/${disk.model.brand.country.flag}?access_token=${API_TOKEN}`
        }

        // If flag is an object, look for id
        if (typeof disk.model.brand.country.flag === "object") {
          // Check for id in flag object
          if (disk.model.brand.country.flag.id) {
            return `https://api.fxcode.ru/assets/${disk.model.brand.country.flag.id}?access_token=${API_TOKEN}`
          }
        }
      }

      // Check for country_code for direct flag access
      if (disk.country_code) {
        return `https://api.fxcode.ru/assets/flags/${disk.country_code.toLowerCase()}.png?access_token=${API_TOKEN}`
      }

      // If we have direct country field and it contains country code
      if (disk.country && typeof disk.country === "string") {
        // Try to get country code from name
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

        const countryCode = countryMap[disk.country] || disk.country.toLowerCase().substring(0, 2)
        return `https://api.fxcode.ru/assets/flags/${countryCode}.png?access_token=${API_TOKEN}`
      }

      // Check for country.id (country code)
      if (
        disk.model &&
        typeof disk.model === "object" &&
        disk.model.brand &&
        typeof disk.model.brand === "object" &&
        disk.model.brand.country &&
        typeof disk.model.brand.country === "object" &&
        disk.model.brand.country.id
      ) {
        const countryCode = disk.model.brand.country.id.toLowerCase()
        return `https://api.fxcode.ru/assets/flags/${countryCode}.png?access_token=${API_TOKEN}`
      }
    } catch (error) {
      console.error("Error getting flag:", error)
    }

    // If nothing found or error occurred, return placeholder
    return "/placeholder.svg?height=16&width=24"
  }

  // Check if country data is available
  const hasCountryData = (): boolean => {
    if (!disk) return false

    // Check for direct country property
    if (disk.country && disk.country.trim() !== "") {
      return true
    }

    // Check for nested country in model.brand.country.name
    if (
      disk.model &&
      typeof disk.model === "object" &&
      disk.model.brand &&
      typeof disk.model.brand === "object" &&
      disk.model.brand.country &&
      typeof disk.model.brand.country === "object" &&
      disk.model.brand.country.name &&
      disk.model.brand.country.name.trim() !== ""
    ) {
      return true
    }

    return false
  }

  // Get disk type (Литой, Кованый, Штампованный)
  const getDiskType = (): string => {
    if (!disk) return "—"

    let typeValue = ""

    // Check for direct type property
    if (disk.type) {
      if (typeof disk.type === "string") {
        typeValue = disk.type
      } else if (typeof disk.type === "object" && disk.type.name) {
        typeValue = disk.type.name
      }
    }

    // Check for disk_type property if type is not found
    if (!typeValue && disk.disk_type) {
      if (typeof disk.disk_type === "string") {
        typeValue = disk.disk_type
      } else if (typeof disk.disk_type === "object" && disk.disk_type.name) {
        typeValue = disk.disk_type.name
      }
    }

    if (!typeValue) return "—"

    // Преобразуем английские значения в русские
    const typeMap: Record<string, string> = {
      "cast": "Литой",
      "stamped": "Штампованный",
      "forged": "Кованый"
    }

    // Если значение на английском - преобразуем
    const lowerType = typeValue.toLowerCase()
    if (typeMap[lowerType]) {
      return typeMap[lowerType]
    }

    // Если уже на русском - возвращаем как есть
    return typeValue
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
  if (error || !disk) {
    return (
      <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212] items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <div className="text-[#1F1F1F] dark:text-white text-xl mb-2">Товар не найден</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs">
            {error || "Возможно, товар был удалён или ссылка устарела"}
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/diski">
              <Button className="bg-[#c4d402] hover:bg-[#c4d402]/80 text-[#1F1F1F] w-full">
                Перейти в каталог дисков
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

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] pr-4 flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <BackButton />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Карточка товара</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleShare} className="active:text-blue-500">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleFavorite}>
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isFavoriteAnimating
                    ? "animate-wiggle text-blue-500 fill-blue-500"
                    : isFavorite
                      ? "text-blue-500 fill-blue-500"
                      : "text-white"
                }`}
              />
            </Button>
            <CartButton />
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
                      className={`h-3 w-3 ${star <= 4 ? "fill-[#c4d402] text-[#c4d402]" : "text-gray-400"}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-white font-medium">4.0 (86)</span>
              </div>
            </div>

            {/* Country/Flag overlay - top right */}
            {hasCountryData() && (
              <div className="absolute top-2 right-2 z-[5] bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white font-medium">
                    {disk.country || (typeof disk.model === "object" && disk.model?.brand?.country?.name) || ""}
                  </span>
                  {flagError ? (
                    <div
                      className="rounded-sm w-[20px] h-[14px] bg-gray-700 flex items-center justify-center text-[7px] text-gray-400"
                    >
                      {disk.country_code || (typeof disk.model === "object" && disk.model?.brand?.country?.id) || "?"}
                    </div>
                  ) : (
                    <Image
                      src={getCountryFlag()}
                      alt={disk.country || (typeof disk.model === "object" && disk.model?.brand?.country?.name) || "Country"}
                      width={20}
                      height={14}
                      className="rounded-sm w-[20px] h-[14px]"
                      onError={() => setFlagError(true)}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Disk type overlay - bottom right */}
            {getDiskType() !== "—" && (
              <div className="absolute bottom-2 right-2 z-[5] bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white" title={getDiskType()}>
                    {getDiskType()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <div className="relative w-full max-w-[400px]" style={{ maxHeight: '400px' }}>
                <Image
                  src={getDiskImage()}
                  alt={disk.name || "Disk"}
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
          <h2 className="text-xl font-bold text-white">{disk.name || disk.title || "—"}</h2>

          {/* Price section */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs text-gray-400 line-through">
              {getDiskProperty("rrc") ? `${getDiskProperty("rrc")} ₽` : "—"}
            </span>
            <span className="text-xl font-bold text-[#009CFF]">{getDiskProperty("price")} ₽</span>
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

              // Get delivery info
              // If product from Davydovo - 5-7 days
              const deliveryInfo = (locationInfo as any).fromDavydovo
                ? { text: "Доставка 5-7 дней", type: "medium" as const }
                : getDeliveryByWarehouse(locationInfo.location, disk.provider)

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
              <span className="h-5 w-5 text-[#c4d402] font-bold text-sm flex items-center justify-center">%</span>
              <div>
                <p className="text-sm font-medium text-white">Скидка на шиномонтаж 20%</p>
                <p className="text-xs text-gray-400">При покупке комплекта дисков</p>
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
                  <span className="text-sm font-medium text-white">{getDiskProperty("brand")}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Модель</span>
                  <span className="text-sm font-medium text-white">{getDiskProperty("model")}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Диаметр</span>
                  <span className="text-sm font-medium text-white">R{getDiskProperty("diameter") || getDiskProperty("diam")}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Ширина</span>
                  <span className="text-sm font-medium text-white">{getDiskProperty("width")}J</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">PCD (разболтовка)</span>
                  <span className="text-sm font-medium text-white">{getDiskProperty("pcd")}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Вылет (ET)</span>
                  <span className="text-sm font-medium text-white">ET{getDiskProperty("et")}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Центральное отверстие (DIA)</span>
                  <span className="text-sm font-medium text-white">{getDiskProperty("dia")} мм</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Тип диска</span>
                  <span className="text-sm font-medium text-white">{getDiskType()}</span>
                </div>
                {getDiskProperty("color") !== "—" && (
                  <div className="flex justify-between py-2 border-b border-gray-600">
                    <span className="text-sm text-white">Цвет</span>
                    <span className="text-sm font-medium text-white">{getDiskProperty("color")}</span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-sm text-white">Страна производства</span>
                  <span className="text-sm font-medium text-white">{disk.country || (typeof disk.model === "object" && disk.model?.brand?.country?.name) || "—"}</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="description" className="mt-4">
              <div className="bg-[#2A2A2A] rounded-lg p-4">
                <p className="text-sm text-white leading-relaxed">
                  {disk.description ||
                    `${getDiskProperty("brand")} ${getDiskProperty("model")} — качественные ${getDiskType().toLowerCase()} диски для вашего автомобиля. Обеспечивают надежность, долговечность и привлекательный внешний вид.`}
                </p>
                {disk.description && (
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
                    <span className="font-medium text-white">Дмитрий С.</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${star <= 5 ? "fill-[#c4d402] text-[#c4d402]" : "text-gray-600"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white">
                    Отличные диски! Качество на высоте, выглядят стильно. Установил на Camry - идеально подошли.
                  </p>
                  <p className="text-xs text-gray-400">15.01.2024</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-white">Анна К.</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${star <= 4 ? "fill-[#c4d402] text-[#c4d402]" : "text-gray-600"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white">
                    Хорошие диски за свою цену. Покрытие качественное, не облезает. Рекомендую.
                  </p>
                  <p className="text-xs text-gray-400">08.01.2024</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-white">Сергей М.</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${star <= 4 ? "fill-[#c4d402] text-[#c4d402]" : "text-gray-600"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white">
                    Быстрая доставка, диски пришли в отличном состоянии. Балансировка прошла без проблем.
                  </p>
                  <p className="text-xs text-gray-400">02.01.2024</p>
                </div>
                <Button variant="outline" className="w-full border-gray-600 text-white bg-transparent">
                  Все отзывы (43)
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

      <BottomNavigation />
    </main>
  )
}
