"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import {
  CheckCircle,
  CreditCard,
  User,
  Phone,
  Truck,
  MapPin,
  Globe,
  Package,
} from "lucide-react"
import { BackButton } from "@/components/back-button"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { OrderStatusBadge, PaymentStatusBadge, DateBadge } from "@/components/status-badge"

// Типы для заказа
type OrderStatus = "На сборке" | "Забронирован" | "Готов к выдаче" | "В пути" | "Выполнен"
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

type Order = {
  orderNumber: string
  status: OrderStatus
  items: OrderItem[]
  totalAmount: number
  createdAt: string
  customer: CustomerInfo
  isPaid: boolean
  deliveryMethod: DeliveryMethod
  deliveryAddress?: string
}

export default function OrderDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params?.id as string
  const isNewOrder = searchParams?.get("new") === "true"

  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Таймер обратного отсчета для оплаты (5 минут = 300 секунд)
  const [paymentTimeLeft, setPaymentTimeLeft] = useState(300)

  // Таймер обратного отсчета
  useEffect(() => {
    if (paymentTimeLeft <= 0 || order?.isPaid) return

    const timer = setInterval(() => {
      setPaymentTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [paymentTimeLeft, order?.isPaid])

  // Форматирование времени для отображения
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Загрузка данных заказа
  useEffect(() => {
    const loadOrderDetails = () => {
      setIsLoading(true)

      try {
        // Пробуем загрузить из истории заказов
        const ordersHistory = localStorage.getItem("ordersHistory")
        if (ordersHistory) {
          const orders = JSON.parse(ordersHistory)
          const foundOrder = orders.find((o: any) => o.orderNumber === orderId)

          if (foundOrder) {
            setOrder({
              orderNumber: foundOrder.orderNumber,
              status: foundOrder.status as OrderStatus,
              items: foundOrder.items?.map((item: any) => ({
                id: item.id,
                name: item.name,
                brand: item.brand || "",
                size: item.size || "",
                quantity: item.quantity,
                price: item.price,
                image: item.image || "/images/summer-tire-new.png",
              })) || [],
              totalAmount: foundOrder.totalAmount,
              createdAt: new Date(foundOrder.createdAt).toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
              customer: foundOrder.customer || {
                name: "Не указано",
                phone: "Не указан",
                email: "Не указан",
              },
              isPaid: foundOrder.isPaid || false,
              deliveryMethod: foundOrder.deliveryMethod as DeliveryMethod,
              deliveryAddress: foundOrder.deliveryAddress || "",
            })
            setIsLoading(false)
            return
          }
        }

        // Если не нашли - показываем демо-данные
        const demoOrder: Order = {
          orderNumber: orderId || "1234",
          status: "На сборке",
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
          createdAt: new Date().toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          customer: {
            name: "Иванов Иван Иванович",
            phone: "+7 (999) 123-45-67",
            email: "ivanov@example.com",
          },
          isPaid: false,
          deliveryMethod: "Самовывоз",
          deliveryAddress: "Таллинское шоссе, 190",
        }

        setOrder(demoOrder)
      } catch (error) {
        console.error("Ошибка загрузки заказа:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrderDetails()
  }, [orderId])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#121212]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c4d402]"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#121212] px-4">
        <p className="text-gray-400 mb-4">Заказ не найден</p>
        <Button
          onClick={() => router.push("/account/orders")}
          className="bg-[#c4d402] hover:bg-[#C4CF2E] text-black font-bold rounded-xl"
        >
          К списку заказов
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] pr-4 flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <BackButton />
            <span className="text-xl font-bold text-white">Заказ № {order.orderNumber}</span>
          </div>
          <OrderStatusBadge status={order.status} />
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
                <span className="text-gray-400">Дата оформления:</span>
                <DateBadge date={order.createdAt} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Оплата:</span>
                <PaymentStatusBadge isPaid={order.isPaid} />
              </div>

              {/* Кнопка оплаты с таймером */}
              {!order.isPaid && (
                <div className="pt-3 mt-3">
                  {paymentTimeLeft > 0 && (
                    <div className="flex items-center justify-center gap-2 mb-3 p-2 bg-[#c4d402]/10 rounded-xl border border-[#c4d402]/30">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={paymentTimeLeft <= 60 ? '#ef4444' : '#c4d402'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span className={`text-sm ${paymentTimeLeft <= 60 ? 'text-red-500' : 'text-[#c4d402]'}`}>
                        Дополнительная скидка при оплате в течении <span className="font-bold">{formatTime(paymentTimeLeft)}</span>
                      </span>
                    </div>
                  )}
                  <Button
                    className="w-full py-6 text-base bg-[#c4d402] hover:bg-[#C4CF2E] text-black font-bold rounded-2xl"
                    onClick={() => router.push("/payment")}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Оплатить заказ
                  </Button>
                </div>
              )}

              {/* Товары в заказе */}
              <div className="pt-3 mt-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400">Товары:</span>
                  <span className="text-sm text-muted-foreground bg-[#3A3A3A] px-3 py-1 rounded-full">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} шт / {order.items.reduce((sum, item) => sum + item.quantity * 10, 0)} кг
                  </span>
                </div>
                <div className="space-y-3">
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
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-400">{item.quantity} шт.</span>
                          <span className="font-bold text-[#c4d402]">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Итого */}
              <div className="pt-3 mt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Сумма заказа:</span>
                  <span className="font-bold text-lg text-white">{formatPrice(order.totalAmount)}</span>
                </div>
                {/* Дополнительная скидка при оплате в течение 5 минут */}
                {!order.isPaid && paymentTimeLeft > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-green-500 text-sm">Скидка за быструю оплату:</span>
                    <span className="font-medium text-green-500">-{formatPrice(500)}</span>
                  </div>
                )}
                {!order.isPaid && paymentTimeLeft > 0 && (
                  <div className="flex justify-between items-center pt-2 border-t border-[#3A3A3A]">
                    <span className="text-white font-medium">Итого к оплате:</span>
                    <span className="font-bold text-xl text-[#c4d402]">{formatPrice(order.totalAmount - 500)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-[#3A3A3A]">
                  <span className="text-[#c4d402] text-sm">Баллы за покупку:</span>
                  <span className="font-medium text-[#c4d402]">+{formatPrice(Math.round((paymentTimeLeft > 0 && !order.isPaid ? order.totalAmount - 500 : order.totalAmount) * 0.05))}</span>
                </div>
              </div>

              {/* Способ получения */}
              <div className="pt-3 mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Способ получения:</span>
                  <span className="text-sm font-medium text-white flex items-center gap-1.5">
                    {order.deliveryMethod === "Самовывоз" && <MapPin className="w-4 h-4 text-[#c4d402]" />}
                    {order.deliveryMethod === "Доставка" && <Truck className="w-4 h-4 text-[#c4d402]" />}
                    {order.deliveryMethod === "Доставка по России" && <Globe className="w-4 h-4 text-[#c4d402]" />}
                    {order.deliveryMethod}
                  </span>
                </div>
                {order.deliveryAddress && (
                  <p className="text-sm text-gray-300 bg-[#1F1F1F] p-3 rounded-xl">
                    {order.deliveryAddress}
                  </p>
                )}
              </div>

              {/* Кнопка отмены заказа */}
              <div className="pt-3 mt-3">
                <Button
                  variant="outline"
                  className="w-full py-3 bg-transparent border border-blue-500/30 hover:bg-blue-500/10 text-blue-500 font-medium rounded-xl"
                  onClick={() => {
                    if (confirm("Вы уверены, что хотите отменить заказ?")) {
                      // Удаляем заказ из истории
                      const ordersHistory = localStorage.getItem("ordersHistory")
                      if (ordersHistory) {
                        const orders = JSON.parse(ordersHistory)
                        const updatedOrders = orders.filter((o: any) => o.orderNumber !== order.orderNumber)
                        localStorage.setItem("ordersHistory", JSON.stringify(updatedOrders))
                      }
                      router.push("/")
                    }
                  }}
                >
                  Отменить заказ
                </Button>
              </div>

              {/* Тестовая кнопка изменения статуса */}
              <div className="pt-3 mt-3">
                <select
                  className="w-full py-3 px-4 bg-[#1F1F1F] border border-[#3A3A3A] text-white rounded-xl"
                  value={order.status}
                  onChange={(e) => {
                    const newStatus = e.target.value
                    const ordersHistory = localStorage.getItem("ordersHistory")
                    if (ordersHistory) {
                      const orders = JSON.parse(ordersHistory)
                      const orderIndex = orders.findIndex((o: any) => o.orderNumber === order.orderNumber)
                      if (orderIndex !== -1) {
                        orders[orderIndex].status = newStatus
                        localStorage.setItem("ordersHistory", JSON.stringify(orders))
                        window.location.reload()
                      }
                    }
                  }}
                >
                  <option value="На сборке">На сборке</option>
                  <option value="Забронирован">Забронирован</option>
                  <option value="Готов к выдаче">Готов к выдаче</option>
                  <option value="В пути">В пути</option>
                  <option value="Выполнен">Выполнен</option>
                </select>
                <p className="text-xs text-gray-500 mt-2 text-center">Тест: изменить статус заказа</p>
              </div>
            </div>
          </div>

          {/* Данные получателя - только для доставки по России */}
          {order.deliveryMethod === "Доставка по России" && (
            <div className="bg-[#2A2A2A] rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#3A3A3A]">
                <h3 className="font-semibold text-lg text-white">Данные получателя</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Кнопки действий - закреплены внизу */}
      <div className="sticky bottom-0 px-3 sm:px-4 pt-8 py-4 pb-[calc(16px+env(safe-area-inset-bottom))]" style={{ background: 'linear-gradient(to top, rgba(18, 18, 18, 0.9) 0%, rgba(18, 18, 18, 0.6) 60%, rgba(18, 18, 18, 0) 100%)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', maskImage: 'linear-gradient(to top, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 70%, transparent 100%)' }}>
        <div className="flex rounded-lg rounded-b-[32px] overflow-hidden">
          <Button
            variant="outline"
            className="flex-1 py-8 bg-transparent border border-[#3A3A3A] border-r-0 hover:bg-[#2A2A2A] text-white font-medium rounded-none rounded-tl-lg rounded-bl-[32px]"
            onClick={() => router.push("/account/orders")}
          >
            <Package className="w-4 h-4 mr-2" />
            Мои заказы
          </Button>
          <Button
            className="flex-1 py-8 bg-[#c4d402] hover:bg-[#C4CF2E] text-black font-bold rounded-none rounded-tr-lg rounded-br-[32px]"
            onClick={() => router.push("/")}
          >
            На главную
          </Button>
        </div>
      </div>
    </div>
  )
}
