"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

// Типы для заказа и товаров
type OrderStatus = "в обработке" | "подтвержден" | "доставляется" | "выполнен" | "отменен"

type OrderItem = {
  id: string
  name: string
  brand: string
  size: string
  quantity: number
  price: number
  image: string
}

type Order = {
  id: string
  orderNumber: string
  status: OrderStatus
  items: OrderItem[]
  totalAmount: number
  createdAt: string
  deliveryAddress?: string
  deliveryDate?: string
  paymentMethod: string
  paymentStatus: "оплачено" | "не оплачено" | "ожидает оплаты"
}

export default function OrderDetailsPage() {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Загрузка данных заказа (имитация)
  useEffect(() => {
    // Имитация загрузки данных с сервера
    const loadOrderDetails = () => {
      setIsLoading(true)

      // Демо-данные для заказа
      const demoOrder: Order = {
        id: "1",
        orderNumber: "P123456",
        status: "доставляется",
        items: [
          {
            id: "1",
            name: "Continental PremiumContact 6",
            brand: "Continental",
            size: "205/55 R16",
            quantity: 4,
            price: 7500,
            image: "/images/continental-premiumcontact-6.png",
          },
          {
            id: "2",
            name: "Диски литые",
            brand: "СКАД",
            size: "R16",
            quantity: 4,
            price: 5200,
            image: "/images/black-wheel.png",
          },
        ],
        totalAmount: 50800,
        createdAt: "20.04.2025, 14:30",
        deliveryAddress: "г. Москва, ул. Примерная, д. 123, кв. 45",
        deliveryDate: "25.04.2025",
        paymentMethod: "Банковская карта",
        paymentStatus: "оплачено",
      }

      // Имитация задержки загрузки
      setTimeout(() => {
        setOrder(demoOrder)
        setIsLoading(false)
      }, 800)
    }

    loadOrderDetails()
  }, [])

  // Функция для форматирования цены
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Функция для отображения иконки статуса заказа
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "в обработке":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "подтвержден":
        return <Package className="w-5 h-5 text-blue-500" />
      case "доставляется":
        return <Truck className="w-5 h-5 text-blue-500" />
      case "выполнен":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "отменен":
        return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  // Функция для отображения текста статуса заказа
  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "в обработке":
        return "Заказ в обработке"
      case "подтвержден":
        return "Заказ подтвержден"
      case "доставляется":
        return "Заказ в пути"
      case "выполнен":
        return "Заказ выполнен"
      case "отменен":
        return "Заказ отменен"
    }
  }

  // Функция для отображения цвета статуса заказа
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "в обработке":
        return "text-yellow-500"
      case "подтвержден":
        return "text-blue-500"
      case "доставляется":
        return "text-blue-500"
      case "выполнен":
        return "text-green-500"
      case "отменен":
        return "text-red-500"
    }
  }

  // Функция для отображения скелетона загрузки
  const renderSkeleton = () => {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>

        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>

        <div className="space-y-4 mb-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        </div>

        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6"></div>

        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#D9D9DD] dark:bg-[#121212] pb-20">
      {/* Заголовок */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#1F1F1F] py-4 shadow-sm">
        <div className="container max-w-md mx-auto flex items-center justify-center relative">
          <button
            onClick={() => router.back()}
            className="absolute left-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Вернуться назад"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-center text-[#1F1F1F] dark:text-white">Детали заказа</h1>
        </div>
      </header>

      <main className="container max-w-md mx-auto px-4 py-6">
        {isLoading ? (
          renderSkeleton()
        ) : order ? (
          <div className="space-y-6">
            {/* Информация о заказе */}
            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-xl font-bold text-[#1F1F1F] dark:text-white">Заказ {order.orderNumber}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">от {order.createdAt}</p>
                </div>
                <div className={`flex items-center ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 font-medium">{getStatusText(order.status)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Статус оплаты */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 dark:text-gray-300">Статус оплаты:</span>
                <span
                  className={
                    order.paymentStatus === "оплачено" ? "text-green-500 font-medium" : "text-yellow-500 font-medium"
                  }
                >
                  {order.paymentStatus}
                </span>
              </div>

              {/* Способ оплаты */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Способ оплаты:</span>
                <span className="text-[#1F1F1F] dark:text-white">{order.paymentMethod}</span>
              </div>
            </div>

            {/* Товары в заказе */}
            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-[#1F1F1F] dark:text-white mb-4">Товары в заказе</h3>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-2 border-b last:border-0 dark:border-gray-700">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[#1F1F1F] dark:text-white">{item.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.brand}, {item.size}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{item.quantity} шт.</span>
                        <span className="font-medium text-[#1F1F1F] dark:text-white">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-gray-700">
                <span className="font-bold text-[#1F1F1F] dark:text-white">Итого:</span>
                <span className="font-bold text-xl text-[#1F1F1F] dark:text-white">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>

            {/* Информация о доставке */}
            {order.deliveryAddress && (
              <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-5 shadow-sm">
                <h3 className="text-lg font-bold text-[#1F1F1F] dark:text-white mb-4">Информация о доставке</h3>

                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 dark:text-gray-300 block mb-1">А��рес доставки:</span>
                    <span className="text-[#1F1F1F] dark:text-white">{order.deliveryAddress}</span>
                  </div>

                  {order.deliveryDate && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-300 block mb-1">Дата доставки:</span>
                      <span className="text-[#1F1F1F] dark:text-white">{order.deliveryDate}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Кнопки действий */}
            <div className="space-y-3">
              {order.status !== "отменен" && order.status !== "выполнен" && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => alert("Функция отмены заказа будет доступна в следующем обновлении")}
                >
                  Отменить заказ
                </Button>
              )}

              <Button variant="outline" className="w-full" onClick={() => router.push("/account/orders")}>
                Вернуться к списку заказов
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">Заказ не найден</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push("/account/orders")}>
              Вернуться к списку заказов
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
