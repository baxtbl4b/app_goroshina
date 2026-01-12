"use client"

import React, { useState, useEffect, useRef, memo } from "react"
import { useRouter } from "next/navigation"
import { Heart, Plus, Minus, CheckCircle, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import CartQuantityButtons from "@/components/cart-quantity-buttons"
import { getDeliveryForCategory, getDeliveryColorClass } from "@/lib/delivery-time"
import type { Disk } from "@/lib/api"

interface DiskCardProps {
  disk: Disk
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

const DiskCard = memo(function DiskCard({ disk }: DiskCardProps) {
  const router = useRouter()

  // Состояния
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [imageError, setImageError] = useState(false)

  // При монтировании компонента проверяем, есть ли товар в избранном и корзине
  useEffect(() => {
    // Получаем список избранного из localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    // Проверяем, есть ли текущий товар в избранном
    setIsFavorite(favorites.some((favDisk: Disk) => favDisk.id === disk.id))

    // Проверяем, есть ли товар в корзине и сколько его там
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const cartItem = cart.find((item: any) => item.id === disk.id)
    setCartCount(cartItem ? cartItem.quantity : 0)
  }, [disk.id])

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

  // Функция для добавления/удаления из избранного
  const toggleFavorite = (e: React.MouseEvent) => {
    // Предотвращаем переход по ссылке при клике на кнопку
    e.preventDefault()
    e.stopPropagation()

    // Получаем текущий список избранного
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")

    // Если товар уже в избранном - удаляем его
    if (isFavorite) {
      const updatedFavorites = favorites.filter((favDisk: Disk) => favDisk.id !== disk.id)
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
      setIsFavorite(false)
    }
    // Иначе добавляем товар в избранное
    else {
      favorites.push(disk)
      localStorage.setItem("favorites", JSON.stringify(favorites))
      setIsFavorite(true)
    }

    // Отправляем событие для обновления других компонентов
    window.dispatchEvent(new Event("favoritesUpdated"))
  }

  // Функция для добавления товара в корзину (по 1шт)
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Проверяем, не превышен ли лимит доступного товара
    if (cartCount >= disk.stock) {
      return
    }

    // Увеличиваем счетчик товаров в корзине на 1
    setCartCount((prev) => prev + 1)

    // Получаем текущую корзину из localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Проверяем, есть ли уже этот товар в корзине
    const existingItemIndex = cart.findIndex((item: any) => item.id === disk.id)

    if (existingItemIndex >= 0) {
      // Если товар уже в корзине, увеличиваем количество на 1
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 0) + 1
    } else {
      // Иначе добавляем новый товар с количеством 1
      cart.push({ ...disk, quantity: 1 })
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

  // Функция для уменьшения количества товара в корзине (по 1шт)
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
    const existingItemIndex = cart.findIndex((item: any) => item.id === disk.id)

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

  // Получаем информацию о доставке из утилиты (с учётом складов и провайдера)
  const deliveryInfo = getDeliveryForCategory(disk.provider, disk.storehouse)

  // Функция для сохранения диска в localStorage при клике и навигации
  const handleDiskClick = () => {
    // Логируем данные диска перед сохранением
    console.log('Saving disk to localStorage:', disk)
    console.log('Disk has model field:', disk.model)

    // Сохраняем диск в localStorage для страницы карточки товара
    localStorage.setItem(`disk_${disk.id}`, JSON.stringify(disk))
    // Переходим на страницу карточки товара
    router.push(`/disk/${disk.id}`)
  }

  // Функция для определения статуса наличия
  const getStockStatus = () => {
    const colorClass = getDeliveryColorClass(deliveryInfo.type)

    if (deliveryInfo.type === "today") {
      return {
        tooltip: deliveryInfo.text,
        className: colorClass,
        icon: <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />,
      }
    } else if (deliveryInfo.type === "fast") {
      return {
        tooltip: deliveryInfo.text,
        className: colorClass,
        icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />,
      }
    } else {
      return {
        tooltip: deliveryInfo.text,
        className: "text-orange-500",
        icon: <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />,
      }
    }
  }

  const stockStatus = getStockStatus()

  // Получаем изображение диска
  const getImageUrl = (): string => {
    if (imageError) {
      return ""
    }
    return disk.image || ""
  }

  // Проверяем, есть ли изображение
  const hasImage = !imageError && disk.image && disk.image.trim() !== ""

  return (
    <div
      className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden shadow-sm flex hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleDiskClick}
    >
      {/* Левая часть - Изображение */}
      <div className="relative p-2 sm:p-3 md:p-4 flex-shrink-0 w-[145px] sm:w-[190px] md:w-[234px] lg:w-[263px] overflow-hidden flex items-center justify-center bg-white rounded-l-xl" style={{ maxHeight: "248px" }}>
          {disk.isPromotional && <Badge className="absolute left-2 top-2 z-10 bg-[#c4d402] text-[#1F1F1F]">Акция</Badge>}
          <div
            className="flex justify-center items-center h-full w-full relative overflow-hidden bg-transparent"
            style={{ zIndex: 1 }}
          >
            {hasImage ? (
              <img
                src={getImageUrl()}
                alt={disk.name || "Диск"}
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
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400 dark:text-gray-500 text-center px-4">
                <span className="text-xs sm:text-sm">Изображение отсутствует</span>
              </div>
            )}
          </div>

        {hasImage && (
          <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
            <DialogContent
              className="sm:max-w-[600px] flex items-center justify-center p-1 border-0 shadow-none bg-transparent"
              style={{ zIndex: 50 }}
              hideCloseButton={true}
            >
              <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-[#2a2a2a] dark:to-[#1a1a1a] rounded-lg">
                <img
                  src={getImageUrl()}
                  alt={disk.name || "Диск"}
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
        )}
      </div>

      {/* Правая часть - Контент */}
      <div className="p-3 sm:p-3 md:p-4 flex-1 flex flex-col justify-between min-h-0">
        <div className="flex flex-col gap-[8.8px]">
          <div className="flex items-center gap-[4.4px] sm:gap-[8.8px] md:gap-[13.2px] flex-wrap">
            {/* Срок доставки */}
            <div className="flex items-center gap-[4.4px] sm:gap-[6.6px] px-[6.6px] sm:px-[8.8px] md:px-[11px] py-[4.4px] bg-gray-100 dark:bg-[#3A3A3A] rounded-full">
              <span className="flex items-center justify-center">
                {React.cloneElement(stockStatus.icon as React.ReactElement, {
                  className: `h-[13.2px] w-[13.2px] sm:h-[17.6px] sm:w-[17.6px] md:h-[19.8px] md:w-[19.8px] ${
                    (stockStatus.icon as React.ReactElement).props.className
                  }`,
                })}
              </span>
              <span className={`text-[9px] sm:text-[11px] md:text-[13px] font-medium whitespace-nowrap ${stockStatus.className}`}>
                {stockStatus.tooltip}
              </span>
            </div>

            <span className="flex-grow"></span>

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

          <h3 className="font-medium text-[#1F1F1F] dark:text-white line-clamp-3 text-sm sm:text-sm md:text-base lg:text-lg leading-tight">
            {disk.name}
          </h3>
        </div>

        <div className="flex flex-col relative pb-8 sm:pb-9 md:pb-11 mt-3">
          <div className="flex items-center justify-end w-full mb-3 sm:mb-4">
            <div className="flex flex-row items-end gap-2">
              <p className="text-[11px] sm:text-[14.3px] md:text-[16.5px] text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(disk.rrc)}
              </p>
              <p className="text-[16.5px] sm:text-[18.7px] md:text-[23.1px] font-bold text-[#1F1F1F] dark:text-white">
                {formatPrice(disk.price)}
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {(() => {
                const availableStock = disk.stock - cartCount;
                if (availableStock > 0) {
                  return (
                    <>
                      <span
                        className={`h-[31px] sm:h-[34px] md:h-[40px] flex items-center text-[12px] sm:text-[14px] md:text-[16px] font-medium px-3 rounded-full ${
                          availableStock > 10 ? "bg-green-500/20 text-green-600 dark:text-green-400" :
                          availableStock > 5 ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" :
                          "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                        }`}
                      >
                        {availableStock > 20 ? ">20 шт" : `${availableStock} шт`}
                      </span>
                    </>
                  );
                } else {
                  return (
                    <span className="h-[31px] sm:h-[34px] md:h-[40px] flex items-center text-[12px] sm:text-[14px] md:text-[16px] font-medium px-3 rounded-full bg-red-500/20 text-red-600 dark:text-red-400">Нет в наличии</span>
                  );
                }
              })()}
            </div>
            <CartQuantityButtons
              count={cartCount}
              maxStock={disk.stock}
              onAdd={addToCart}
              onRemove={removeFromCart}
            />
          </div>
        </div>
      </div>
    </div>
  )
})

export default DiskCard
