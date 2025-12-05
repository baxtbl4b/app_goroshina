"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Heart, Share2, Truck, ShieldCheck, Info, Star, Plus, Minus, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import BottomNavigation from "@/components/bottom-navigation"

export default function ProductPage() {
  const [cartCount, setCartCount] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [totalCartItems, setTotalCartItems] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Product images array
  const productImages = [
    {
      src: "/images/michelin-pilot-sport-4-product.png",
      alt: "Michelin Pilot Sport 4 - основное изображение",
    },
    {
      src: "/images/michelin-tires-display.jpeg",
      alt: "Michelin шины в магазине",
    },
    {
      src: "/images/michelin-tire-tread-1.jpeg",
      alt: "Протектор шины Michelin",
    },
    {
      src: "/images/michelin-tire-sidewall-sport.jpeg",
      alt: "Боковина шины Pilot Sport 4 S",
    },
    {
      src: "/images/michelin-tire-tread-2.jpeg",
      alt: "Детальный вид протектора",
    },
    {
      src: "/images/michelin-tire-sidewall-logo.jpeg",
      alt: "Логотип Michelin на боковине",
    },
  ]

  // Mock product data - in real app this would come from props or API
  const product = {
    id: "michelin-pilot-sport-4",
    name: "Michelin Pilot Sport 4",
    brand: "Michelin",
    model: "Pilot Sport 4",
    width: "225",
    profile: "45",
    diameter: "17",
    loadIndex: "94",
    speedIndex: "Y",
    season: "Летняя",
    price: 12500,
    stock: 15,
  }

  // Generate full product name with tire specifications
  const getFullProductName = () => {
    return `${product.brand} ${product.model} ${product.width}/${product.profile} R${product.diameter} ${product.loadIndex}${product.speedIndex}`
  }

  // Load cart count and favorite status on component mount
  useEffect(() => {
    // Check if product is in favorites
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    setIsFavorite(favorites.some((item: any) => item.id === product.id))

    // Check cart count for this product
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const cartItem = cart.find((item: any) => item.id === product.id)
    setCartCount(cartItem ? cartItem.quantity : 0)
  }, [product.id])

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

  // Function to update total cart items
  const updateTotalCartItems = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const total = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
    setTotalCartItems(total)
  }

  // Update total cart items on mount
  useEffect(() => {
    updateTotalCartItems()
  }, [])

  // Listen for cart updates to update total
  useEffect(() => {
    const handleCartUpdate = () => {
      updateTotalCartItems()
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    window.addEventListener("cartItemAdded", handleCartUpdate)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
      window.removeEventListener("cartItemAdded", handleCartUpdate)
    }
  }, [])

  // Add to cart function
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Increase cart count
    setCartCount((prev) => prev + 1)

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex((item: any) => item.id === product.id)

    if (existingItemIndex >= 0) {
      // If product exists, increase quantity
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1
    } else {
      // Add new product to cart
      cart.push({ ...product, quantity: 1 })
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

    // Update total cart items
    updateTotalCartItems()
  }

  // Remove from cart function
  const removeFromCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (cartCount <= 0) return

    // Decrease cart count
    setCartCount((prev) => Math.max(0, prev - 1))

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Find existing item
    const existingItemIndex = cart.findIndex((item: any) => item.id === product.id)

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

    // Update total cart items
    updateTotalCartItems()
  }

  // Toggle favorite function
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")

    if (isFavorite) {
      const updatedFavorites = favorites.filter((item: any) => item.id !== product.id)
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
      setIsFavorite(false)
    } else {
      favorites.push(product)
      localStorage.setItem("favorites", JSON.stringify(favorites))
      setIsFavorite(true)
    }

    window.dispatchEvent(new Event("favoritesUpdated"))
  }

  // Handle image navigation
  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#1F1F1F]">
      <header className="sticky top-0 z-10 bg-[#2A2A2A] p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5 text-white" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Карточка товара</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/cart">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-[#D3DF3D] text-black hover:bg-[#D3DF3D]/80 border-none"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="font-medium">Корзина</span>
                {totalCartItems > 0 && (
                  <span className="bg-[#1F1F1F] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalCartItems}
                  </span>
                )}
              </Button>
            </Link>
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
        <div className="bg-[#2A2A2A] p-4">
          <div className="flex justify-center mb-4">
            <Badge className="bg-[#D3DF3D] text-white font-medium">Бестселлер</Badge>
          </div>

          {/* Image Gallery */}
          <div className="relative">
            <div className="flex justify-center">
              <div className="relative w-[400px] h-[400px]">
                <Image
                  src={productImages[currentImageIndex].src || "/placeholder.svg"}
                  alt={productImages[currentImageIndex].alt}
                  width={400}
                  height={400}
                  className="object-contain"
                />

                {/* Navigation arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                  aria-label="Предыдущее изображение"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                  aria-label="Следующее изображение"
                >
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>

            {/* Image indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-[#D3DF3D]" : "bg-gray-600"
                  }`}
                  aria-label={`Перейти к изображению ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white">{getFullProductName()}</h2>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= 4 ? "fill-[#D3DF3D] text-[#D3DF3D]" : "text-gray-600"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-white">4.0 (86 отзывов)</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">артикул: S00123</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-[#009CFF]">{product.price} ₽</span>
              <div className="flex items-center gap-2">
                <span className="text-sm line-through text-gray-500">14 900 ₽</span>
                <Badge className="bg-[#D3DF3D] text-white">-16%</Badge>
              </div>
            </div>

            {/* Cart controls matching other pages */}
            <div className="flex items-center gap-0">
              <div className="flex h-9 sm:h-10 md:h-11 lg:h-12 rounded-xl overflow-hidden border border-white/20">
                {/* Minus button */}
                <button
                  onClick={removeFromCart}
                  disabled={cartCount <= 0 || product.stock <= 0}
                  className="bg-gray-500/90 hover:bg-gray-600 text-white h-full px-3 sm:px-4 md:px-5 lg:px-6 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
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
                  disabled={product.stock <= 0}
                  className="bg-[#D3DF3D]/90 hover:bg-[#C4CF2E] text-black h-full px-3 sm:px-4 md:px-5 lg:px-6 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
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
                  <span className="text-sm text-white">Ширина</span>
                  <span className="text-sm font-medium text-white">225 мм</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Профиль</span>
                  <span className="text-sm font-medium text-white">45</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Диаметр</span>
                  <span className="text-sm font-medium text-white">17"</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Сезон</span>
                  <span className="text-sm font-medium text-white">Летняя</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-white">Индекс скорости</span>
                  <span className="text-sm font-medium text-white">Y (до 300 км/ч)</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="description" className="mt-4">
              <div className="bg-[#2A2A2A] rounded-lg p-4">
                <p className="text-sm text-white leading-relaxed">
                  Michelin Pilot Sport 4 — спортивные шины для легковых автомобилей. Обеспечивают отличное сцепление с
                  дорогой в любых погодных условиях, короткий тормозной путь и точную управляемость. Инновационный
                  состав резиновой смеси с использованием функциональных эластомеров и силики обеспечивает идеальный
                  баланс между управляемостью и комфортом.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Info className="h-4 w-4 text-[#009CFF]" />
                  <p className="text-xs text-[#009CFF]">Подробнее на сайте производителя</p>
                </div>
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
