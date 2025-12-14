"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  ChevronLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  User,
  Phone,
  Mail,
  Truck,
  MapPin,
  Globe,
  Package,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

// Типы для заказа и товаров
type OrderStatus = "на сборке" | "оплачено" | "зарезервировано"
type DeliveryMethod = "Самовывоз" | "Доставка" | "Доставка по России"

type OrderItem = {
  id: string
  name: string
  brand: string
  size: string
  quantity: number
  price: number
  image: string
}

type CustomerInfo = {
  name: string
  phone: string
  email: string
}

export type Order = {
  orderNumber: string
  status: OrderStatus
  items: OrderItem[]
  totalAmount: number
  createdAt: Date
  customer: CustomerInfo
  isPaid: boolean
  deliveryMethod: DeliveryMethod
  deliveryAddress?: string
}

// Props for the OrderCompletePage component
interface OrderCompletePageProps {
  initialOrderData?: Order
}

// Функция для генерации случайного номера заказа
const generateOrderNumber = () => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000)
  return `P${randomDigits}`
}

// Функция для генерации статуса заказа
const getRandomStatus = (): OrderStatus => {
  return "зарезервировано"
}

export default function OrderCompletePage({ initialOrderData }: OrderCompletePageProps) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)

  // Загрузка данных заказа при загрузке страницы
  useEffect(() => {
    if (initialOrderData) {
      setOrder(initialOrderData)
      return
    }

    // Загружаем заказ из localStorage
    try {
      const savedOrder = localStorage.getItem("currentOrder")
      if (savedOrder) {
        const orderData = JSON.parse(savedOrder)

        const loadedOrder: Order = {
          orderNumber: orderData.orderNumber,
          status: orderData.status as OrderStatus,
          items: orderData.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            brand: item.brand || "",
            size: item.size || "",
            quantity: item.quantity,
            price: item.price,
            image: item.image || "/images/summer-tire-new.png",
          })),
          totalAmount: orderData.totalAmount,
          createdAt: new Date(orderData.createdAt),
          customer: {
            name: orderData.customer?.name || "Не указано",
            phone: orderData.customer?.phone || "Не указан",
            email: orderData.customer?.email || "Не указан",
          },
          isPaid: orderData.isPaid || false,
          deliveryMethod: orderData.deliveryMethod as DeliveryMethod,
          deliveryAddress: orderData.deliveryAddress || "",
        }

        setOrder(loadedOrder)
        return
      }
    } catch (error) {
      console.error("Ошибка загрузки заказа:", error)
    }

    // Если нет сохраненного заказа, показываем демо-данные
    const demoOrder: Order = {
      orderNumber: generateOrderNumber(),
      status: getRandomStatus(),
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
      ],
      totalAmount: 30000,
      createdAt: new Date(),
      customer: {
        name: "Не указано",
        phone: "Не указан",
        email: "Не указан",
      },
      isPaid: false,
      deliveryMethod: "Самовывоз",
      deliveryAddress: "Таллинское шоссе, 190",
    }

    setOrder(demoOrder)
  }, [initialOrderData])

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#121212]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D3DF3D]"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1F1F1F] pr-4 shadow-sm h-[60px] flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <button
              onClick={() => router.push("/")}
              className="p-2 transition-colors"
              aria-label="На главную"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <span className="text-xl font-bold text-white">Заказ оформлен</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-3 sm:px-4 pt-4 pb-6">
        <div className="flex flex-col gap-4">

          {/* Информация о заказе */}
          <div className="bg-[#2A2A2A] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#3A3A3A]">
              <h3 className="font-semibold text-lg text-white">Информация о заказе</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Номер заказа:</span>
                <span className="text-[#D3DF3D] font-bold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Дата оформления:</span>
                <span className="text-white">
                  {order.createdAt.toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Статус:</span>
                <span className="text-sm font-medium text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Зарезервировано
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Оплата:</span>
                {order.isPaid ? (
                  <span className="text-sm font-medium text-green-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    Оплачено
                  </span>
                ) : (
                  <span className="text-sm font-medium text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    Не оплачено
                  </span>
                )}
              </div>

              {/* Способ получения */}
              <div className="pt-3 mt-3 border-t border-[#3A3A3A]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Способ получения:</span>
                  <span className="text-sm font-medium text-white flex items-center gap-1.5">
                    {order.deliveryMethod === "Самовывоз" && <MapPin className="w-4 h-4 text-[#D3DF3D]" />}
                    {order.deliveryMethod === "Доставка" && <Truck className="w-4 h-4 text-[#D3DF3D]" />}
                    {order.deliveryMethod === "Доставка по России" && <Globe className="w-4 h-4 text-[#D3DF3D]" />}
                    {order.deliveryMethod}
                  </span>
                </div>
                {order.deliveryAddress && (
                  <p className="text-sm text-gray-300 bg-[#1F1F1F] p-3 rounded-xl">
                    {order.deliveryAddress}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Товары в заказе */}
          <div className="bg-[#2A2A2A] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#3A3A3A] flex items-center justify-between">
              <h3 className="font-semibold text-lg text-white">Товары в заказе</h3>
              <span className="text-sm text-gray-400">
                {order.items.reduce((sum, item) => sum + item.quantity, 0)} шт.
              </span>
            </div>
            <div className="p-4 space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 bg-[#1F1F1F] rounded-xl"
                >
                  <div className="w-16 h-16 relative flex-shrink-0 bg-white rounded-xl overflow-hidden">
                    <Image
                      src={item.image || "/images/summer-tire-new.png"}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-white leading-tight">{item.name}</h4>
                    {item.size && (
                      <p className="text-xs text-gray-400 mt-0.5">{item.size}</p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">{item.quantity} шт.</span>
                      <span className="font-bold text-[#D3DF3D]">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Итого */}
              <div className="pt-3 mt-3 border-t border-[#3A3A3A] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Сумма заказа:</span>
                  <span className="font-bold text-lg text-white">{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#D3DF3D] text-sm">Баллы за покупку:</span>
                  <span className="font-medium text-[#D3DF3D]">+{formatPrice(Math.round(order.totalAmount * 0.05))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Оплата */}
          {!order.isPaid && (
          <div className="bg-[#2A2A2A] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#3A3A3A]">
              <h3 className="font-semibold text-lg text-white">Оплата</h3>
            </div>
            <div className="p-4">
              <div className="bg-[#1F1F1F] rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-400">Сумма к оплате:</span>
                    <span className="text-lg font-bold text-white">{formatPrice(order.totalAmount)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    Оплатите заказ в течение 24 часов, чтобы зарезервировать товары
                  </p>
                  <Button
                    className="w-full py-4 text-base bg-[#D3DF3D] hover:bg-[#C4CF2E] text-black font-bold rounded-xl"
                    onClick={() => router.push("/payment")}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Оплатить заказ
                  </Button>
              </div>
            </div>
          </div>
          )}

          {/* Данные покупателя */}
          <div className="bg-[#2A2A2A] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#3A3A3A]">
              <h3 className="font-semibold text-lg text-white">Данные покупателя</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 bg-[#1F1F1F] rounded-xl p-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#2A2A2A]">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ФИО</p>
                    <p className="text-sm font-medium text-white">{order.customer.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#1F1F1F] rounded-xl p-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#2A2A2A]">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Телефон</p>
                    <p className="text-sm font-medium text-white">{order.customer.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#1F1F1F] rounded-xl p-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#2A2A2A]">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-white">{order.customer.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            <Button
              variant="outline"
              className="py-4 bg-transparent border border-[#3A3A3A] hover:bg-[#2A2A2A] text-white font-medium rounded-xl"
              onClick={() => router.push("/account/orders")}
            >
              <Package className="w-4 h-4 mr-2" />
              Мои заказы
            </Button>
            <Button
              className="py-4 bg-[#D3DF3D] hover:bg-[#C4CF2E] text-black font-bold rounded-xl"
              onClick={() => router.push("/")}
            >
              На главную
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
