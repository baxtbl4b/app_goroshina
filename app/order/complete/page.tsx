"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
  ReceiptText,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice, cn } from "@/lib/utils" // Import cn
import BottomNavigation from "@/components/bottom-navigation"

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
  // Export this type for reuse
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
  initialOrderData?: Order // Optional prop to pass initial order data
}

// Функция для генерации случайного номера заказа
const generateOrderNumber = () => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000)
  return `P${randomDigits}`
}

// Функция для генерации статуса заказа (всегда "зарезервировано")
const getRandomStatus = (): OrderStatus => {
  return "зарезервировано"
}

// Компонент статуса заказа
const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  switch (status) {
    case "оплачено":
      return (
        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
          <CheckCircle className="w-3 h-3 mr-1" /> Оплачено
        </Badge>
      )
    case "на сборке":
      return (
        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          <Clock className="w-3 h-3 mr-1" /> На сборке
        </Badge>
      )
    case "зарезервировано":
      return (
        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
          <AlertCircle className="w-3 h-3 mr-1" /> Зарезервировано
        </Badge>
      )
    default:
      return null
  }
}

// Компонент иконки способа доставки
const DeliveryMethodIcon = ({ method }: { method: DeliveryMethod }) => {
  switch (method) {
    case "Самовывоз":
      return <MapPin className="w-4 h-4 text-[#D3DF3D]" />
    case "Доставка":
      return <Truck className="w-4 h-4 text-[#D3DF3D]" />
    case "Доставка по России":
      return <Globe className="w-4 h-4 text-[#D3DF3D]" />
    default:
      return null
  }
}

// Компонент статуса оплаты
const OrderPaymentStatusBadge = ({ isPaid }: { isPaid: boolean }) => {
  if (isPaid) {
    return (
      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
        <CheckCircle className="w-3 h-3 mr-1" /> Оплачено
      </Badge>
    )
  }

  return (
    <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
      <AlertCircle className="w-3 h-3 mr-1" /> Не оплачено
    </Badge>
  )
}

export default function OrderCompletePage({ initialOrderData }: OrderCompletePageProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [showCustomerData, setShowCustomerData] = useState(true) // Всегда развернуты

  // Генерация демо-данных при загрузке страницы
  useEffect(() => {
    if (initialOrderData) {
      setOrder(initialOrderData)
      return
    }

    // Randomly select a delivery method for the default page
    const deliveryMethods: DeliveryMethod[] = ["Самовывоз", "Доставка", "Доставка по России"]
    const randomDeliveryMethod = deliveryMethods[Math.floor(Math.random() * deliveryMethods.length)]

    let deliveryAddress = "ул. Шинная, 15, Москва" // Default for Самовывоз
    if (randomDeliveryMethod === "Доставка") {
      deliveryAddress = "г. Москва, ул. Ленина, д. 10, кв. 5"
    } else if (randomDeliveryMethod === "Доставка по России") {
      deliveryAddress = "г. Санкт-Петербург, Невский пр-т, д. 25"
    }

    // Демо-данные для заказа
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
      totalAmount: 0, // Будет рассчитано ниже
      createdAt: new Date(),
      customer: {
        name: "Иванов Иван Иванович",
        phone: "+7 (999) 123-45-67",
        email: "ivanov@example.com",
      },
      isPaid: true, // Устанавливаем статус "Оплачено" для демонстрации
      deliveryMethod: randomDeliveryMethod,
      deliveryAddress: deliveryAddress,
    }

    // Расчет общей суммы
    demoOrder.totalAmount = demoOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    setOrder(demoOrder)
  }, [initialOrderData]) // Depend on initialOrderData

  if (!order) {
    return <div className="flex justify-center items-center min-h-screen">Загрузка...</div>
  }

  return (
    <div className="min-h-screen bg-[#D9D9DD] dark:bg-[#121212] pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1F1F1F] py-2 shadow-sm">
        <div className="flex items-center justify-start h-12 pl-4">
          <Link
            href="/order"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-3"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Link>
          <h1 className="text-xl font-bold text-[#1F1F1F] dark:text-white">Заказ оформлен</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 pt-6 pb-6 sm:px-6 lg:px-8 mt-0">
        <div className="space-y-4 w-full mx-auto">
          {/* Информация о заказе */}
          <Card className="w-full border border-border/40 dark:border-border/20 shadow-sm bg-card dark:bg-[#2A2A2A] md:row-span-3 h-auto">
            <CardHeader className="pb-2 pt-3 sm:pt-4 md:pt-5">
              <CardTitle className="text-base sm:text-lg md:text-xl font-medium">Информация о заказе</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 md:space-y-4 pt-0 pb-3 sm:pb-4 md:pb-5 text-sm sm:text-base">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Номер заказа:</span>
                <span className="font-medium">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Дата оформления:</span>
                <span>
                  {order.createdAt.toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Статус:</span>
                <OrderStatusBadge status={order.status} />
              </div>

              {/* Способ получения - только информация */}
              <div className="pt-2 mt-1 border-t border-border/30 dark:border-border/20">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Способ получения:</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "flex items-center gap-1 bg-[#D3DF3D]/10 border-[#D3DF3D]/20",
                      order.deliveryMethod === "Доставка по России" ? "text-white" : "text-[#D3DF3D]",
                    )}
                  >
                    <DeliveryMethodIcon method={order.deliveryMethod} />
                    <span>{order.deliveryMethod}</span>
                  </Badge>
                </div>
                <div className="mt-2">
                  {order.deliveryMethod === "Самовывоз" && (
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
                      <span>Самовывоз из магазина по адресу: {order.deliveryAddress}</span>
                    </div>
                  )}
                  {order.deliveryMethod === "Доставка" && (
                    <div className="flex items-start">
                      <Truck className="w-4 h-4 text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
                      <span>Доставка по адресу: {order.deliveryAddress}. Ожидаемая дата доставки: 1-2 дня</span>
                    </div>
                  )}
                  {order.deliveryMethod === "Доставка по России" && (
                    <div className="flex items-start">
                      <Globe className="w-4 h-4 text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
                      <span>Доставка по адресу: {order.deliveryAddress}. Ожидаемая дата доставки: 3-7 дней</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Оплата */}
          <Card className="border border-border/40 dark:border-border/20 shadow-sm bg-card dark:bg-[#2A2A2A] h-auto">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-base font-medium">Оплата</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-3 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Статус оплаты:</span>
                <OrderPaymentStatusBadge isPaid={order.isPaid} />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Способ оплаты:</span>
                <span className="text-sm font-medium">Банковская карта</span>
              </div>

              {!order.isPaid ? (
                <div className="space-y-3 pt-1">
                  <div className="p-3 bg-[#2F2F2F] rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Сумма к оплате:</span>
                      <span className="text-base font-bold">{formatPrice(order.totalAmount)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Оплатите заказ в течение 24 часов, чтобы зарезервировать товары
                    </p>
                    <Button
                      className="w-full flex items-center justify-center bg-[#D3DF3D]/80 hover:bg-[#C4CF2E]/90 text-black font-medium border border-[#D3DF3D]/30 py-2 px-4 h-10 text-sm backdrop-blur-sm"
                      onClick={() => (window.location.href = "/payment")}
                    >
                      <CreditCard className="w-4 h-4 mr-2 text-black" />
                      <span>Оплатить</span>
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="w-3 h-3 text-[#D3DF3D]" />
                    <span>Безопасная оплата</span>
                  </div>

                  {/* Удален блок с другими способами оплаты */}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">Заказ успешно оплачен</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Оплата прошла успешно. Номер транзакции: {Math.floor(100000000 + Math.random() * 900000000)}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Дата оплаты:</span>
                    <span className="text-sm">
                      {new Date().toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Сумma:</span>
                    <span className="text-base font-medium">{formatPrice(order.totalAmount)}</span>
                  </div>

                  {/* Кнопка для просмотра кассового чека */}
                  <Button
                    className="w-full flex items-center justify-center bg-[#D3DF3D]/80 hover:bg-[#C4CF2E]/90 text-black font-medium border border-[#D3DF3D]/30 py-2 px-4 h-10 text-sm backdrop-blur-sm mt-4"
                    onClick={() => alert("Функционал просмотра кассового чека будет реализован позже.")}
                  >
                    <ReceiptText className="w-4 h-4 mr-2 text-black" />
                    <span>Просмотреть кассовый чек</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Блок данных покупателя (всегда развернут) */}
          <Card className="border border-border/40 dark:border-border/20 shadow-sm bg-card dark:bg-[#2A2A2A] h-auto">
            <CardHeader className="pb-2 pt-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">Данные покупателя</CardTitle>
                {/* Кнопка скрытия удалена, так как данные всегда развернуты */}
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 pb-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                <div className="flex items-center">
                  <div className="w-7 h-7 flex items-center justify-center rounded-full mr-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ФИО</p>
                    <p className="text-base font-medium">{order.customer.name}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-7 h-7 flex items-center justify-center rounded-full mr-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Телефон</p>
                    <p className="text-base font-medium">{order.customer.phone}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-7 h-7 flex items-center justify-center rounded-full mr-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-base font-medium">{order.customer.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Товары в заказе */}
          <Card className="border border-border/40 dark:border-border/20 shadow-sm bg-card dark:bg-[#2A2A2A] h-auto">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-base font-medium">Товары в заказе</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 overflow-auto max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-150px)]">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-2 pb-2 border-b border-border/30 last:border-0 last:pb-0 group"
                >
                  <div className="w-14 h-14 relative flex-shrink-0 bg-background dark:bg-[#1F1F1F] rounded-md overflow-hidden">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.brand}, {item.size}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-muted-foreground">{item.quantity} шт.</span>
                      <span className="font-medium text-sm">{formatPrice(item.price)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Добавляем разделитель и информацию о сумме и кешбеке */}
              <div className="pt-1 mt-1 border-t border-border/30 dark:border-border/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Общая сумма:</span>
                  <span className="font-medium text-base">{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center">
                    <Image src="/images/coin.png" width={12} height={12} alt="Кешбек" className="mr-1" />
                    <span className="text-sm text-[#D3DF3D]">Баллы за заказ:</span>
                  </div>
                  <span className="font-medium text-sm text-[#D3DF3D]">
                    +{formatPrice(Math.round(order.totalAmount * 0.05))}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-bold text-[#D3DF3D]">5%</span> от суммы заказа будет начислено на ваш бонусный
                  счет
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Кнопки действий - новый дизайн */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="bg-transparent border border-red-500/30 hover:bg-red-500/10 text-red-500 font-medium text-sm h-11 rounded-lg flex items-center justify-center transition-all duration-200"
              onClick={() => confirm("Вы уверены, что хотите отменить заказ?")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              Отменить заказ
            </Button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
