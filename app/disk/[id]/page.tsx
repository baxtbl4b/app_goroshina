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

export default function DiskProductPage() {
  const [cartCount, setCartCount] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [totalCartItems, setTotalCartItems] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Product images array for wheels
  const productImages = [
    {
      src: "/images/carwel-wheel.png",
      alt: "Carwel Тауус - основное изображение",
    },
    {
      src: "/images/alutec-wheel-1.png",
      alt: "Alutec диск - вид спереди",
    },
    {
      src: "/images/wheel-silver-polished.png",
      alt: "Полированный серебристый диск",
    },
    {
      src: "/images/black-wheel.png",
      alt: "Черный литой диск",
    },
    {
      src: "/images/wheel-red-accents.png",
      alt: "Диск с красными акцентами",
    },
    {
      src: "/images/wheels-collection.png",
      alt: "Коллекция дисков",
    },
  ]

  // Mock wheel product data
  const product = {
    id: "carwel-tauus-black",
    name: "Carwel Тауус",
    brand: "Carwel",
    model: "Тауус",
    diameter: "17",
    width: "7.5",
    pcd: "5x114.3",
    et: "42",
    dia: "67.1",
    type: "Литой",
    color: "Черный матовый",
    material: "Алюминиевый сплав",
    price: 6200,
    stock: 10,
    country: "Россия",
  }

  // Generate full product name with wheel specifications
  const getFullProductName = () => {
    return `${product.brand} ${product.model} ${product.color} R${product.diameter} ${product.width}J ${product.pcd} ET${product.et} DIA${product.dia}`
  }

  // Load cart count and favorite status on component mount
  useEffect(() => {
    // Check if product is in favorites
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    setIsFavorite(favorites.some((item: any) => item.id === product.id))

    // Check cart count for this product (wheels are sold in sets of 4)
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

  // Add to cart function (wheels are added in sets of 4)
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Increase cart count by 4 (set of wheels)
    setCartCount((prev) => prev + 4)

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex((item: any) => item.id === product.id)

    if (existingItemIndex >= 0) {
      // If product exists, increase quantity by 4
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 4) + 4
    } else {
      // Add new product to cart with quantity 4
      cart.push({ ...product, quantity: 4 })
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

  // Remove from cart function (wheels are removed in sets of 4)
  const removeFromCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (cartCount <= 0) return

    // Decrease cart count by 4
    setCartCount((prev) => Math.max(0, prev - 4))

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Find existing item
    const existingItemIndex = cart.findIndex((item: any) => item.id === product.id)

    if (existingItemIndex >= 0) {
      // Decrease quantity by 4
      cart[existingItemIndex].quantity = Math.max(0, (cart[existingItemIndex].quantity || 4) - 4)

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
            <Link href="/diski">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5 text-white" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Карточка диска</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/order/checkout">
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
            <Badge className="bg-[#D3DF3D] text-white font-medium">Акция</Badge>
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
              <span className="text-sm text-white">4.2 (43 отзыва)</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">артикул: CW-T001</p>
          </div>

          {/* Wheel set notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-md">
            <p className="text-sm text-yellow-700 dark:text-yellow-500 font-medium">
              💡 Диски продаются комплектом из 4 штук
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-[#009CFF]">{product.price * 4} ₽</span>
              <div className="flex items-center gap-2">
                <span className="text-sm line-through text-gray-500">{Math.round(product.price * 4 * 1.1)} ₽</span>
                <Badge className="bg-[#D3DF3D] text-white">-10%</Badge>
              </div>
              <p className="text-xs text-gray-400 mt-1">за комплект (4 шт.)</p>
            </div>

            {/* Cart controls for wheel sets */}
            <div className="flex items-center gap-0">
              <div className="flex h-[31px] sm:h-[34px] md:h-[40px] overflow-hidden w-full max-w-[152px] sm:max-w-[174px] md:max-w-[195px]" style={{ border: 'none', outline: 'none', borderRadius: '20px' }}>
                {/* Minus button */}
                <button
                  onClick={removeFromCart}
                  disabled={cartCount <= 0 || product.stock <= 0}
                  className="bg-gray-500/90 hover:bg-gray-600 text-white h-full flex-1 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ border: 'none', outline: 'none', boxShadow: 'none', borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px' }}
                  aria-label="Уменьшить количество"
                >
                  <Minus className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px] md:w-[22px] md:h-[22px]" />
                </button>

                {/* Counter */}
                <div className="bg-black/85 text-white h-full flex-1 flex items-center justify-center min-w-[2.2rem] sm:min-w-[2.75rem] md:min-w-[3.3rem]">
                  <span className="text-[15px] sm:text-[18px] md:text-[22px] font-medium">{cartCount}</span>
                </div>

                {/* Plus button */}
                <button
                  onClick={addToCart}
                  disabled={product.stock <= 0}
                  className="bg-[#D3DF3D]/90 hover:bg-[#C4CF2E] text-black h-full flex-1 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ border: 'none', outline: 'none', boxShadow: 'none', borderTopRightRadius: '20px', borderBottomRightRadius: '20px' }}
                  aria-label="Увеличить количество"
                >
                  <Plus className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px] md:w-[22px] md:h-[22px]" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-3 p-3 bg-[#2A2A2A] rounded-lg">
              <Truck className="h-5 w-5 text-[#009CFF]" />
              <div>
                <p className="text-sm font-medium text-white">Бесплатная доставка</p>
                <p className="text-xs text-gray-400">При заказе от 15 000 ₽</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#2A2A2A] rounded-lg">
              <ShieldCheck className="h-5 w-5 text-[#009CFF]" />
              <div>
                <p className="text-sm font-medium text-white">Гарантия 2 года</p>
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
                  <span className="text-sm text-white">Диаметр</span>
                  <span className="text-sm font-medium text-white">R{product.diameter}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Ширина</span>
                  <span className="text-sm font-medium text-white">{product.width}J</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">PCD (разболтовка)</span>
                  <span className="text-sm font-medium text-white">{product.pcd}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Вылет (ET)</span>
                  <span className="text-sm font-medium text-white">ET{product.et}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Центральное отверстие (DIA)</span>
                  <span className="text-sm font-medium text-white">{product.dia} мм</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Тип диска</span>
                  <span className="text-sm font-medium text-white">{product.type}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Материал</span>
                  <span className="text-sm font-medium text-white">{product.material}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-sm text-white">Цвет</span>
                  <span className="text-sm font-medium text-white">{product.color}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-white">Страна производства</span>
                  <span className="text-sm font-medium text-white">{product.country}</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="description" className="mt-4">
              <div className="bg-[#2A2A2A] rounded-lg p-4">
                <p className="text-sm text-white leading-relaxed">
                  Carwel Тауус — стильные литые диски из высококачественного алюминиевого сплава. Современный дизайн с
                  матовым черным покрытием придает автомобилю спортивный и элегантный вид. Диски отличаются высокой
                  прочностью, устойчивостью к коррозии и небольшим весом, что положительно влияет на управляемость и
                  топливную экономичность.
                </p>
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-white">Особенности:</h4>
                  <ul className="text-xs text-gray-300 space-y-1 ml-4">
                    <li>• Современный спортивный дизайн</li>
                    <li>• Матовое черное покрытие</li>
                    <li>• Высокая прочность и долговечность</li>
                    <li>• Устойчивость к коррозии</li>
                    <li>• Оптимальный вес для лучшей управляемости</li>
                  </ul>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Info className="h-4 w-4 text-[#009CFF]" />
                  <p className="text-xs text-[#009CFF]">Подходит для большинства автомобилей с разболтовкой 5x114.3</p>
                </div>
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
                          className={`h-3 w-3 ${star <= 5 ? "fill-[#D3DF3D] text-[#D3DF3D]" : "text-gray-600"}`}
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
                          className={`h-3 w-3 ${star <= 4 ? "fill-[#D3DF3D] text-[#D3DF3D]" : "text-gray-600"}`}
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
                          className={`h-3 w-3 ${star <= 4 ? "fill-[#D3DF3D] text-[#D3DF3D]" : "text-gray-600"}`}
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

      <BottomNavigation />
    </main>
  )
}
