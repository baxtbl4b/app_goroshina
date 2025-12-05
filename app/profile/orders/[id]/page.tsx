"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Package, Truck, CheckCircle, XCircle, Clock, User, Phone, Mail, UserPlus } from "lucide-react" // Added UserPlus
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"

// Типы для заказа и товаров
type OrderStatus = "в обработке" | "подтвержден" | "доставляется" | "выполнен" | "отменен" | "оплачено"

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
  customer: CustomerInfo
  deliveryMethod: string
  transactionId?: string
  paymentDate?: string
  // Добавляем новые поля для покраски
  paintingDetails?: {
    diameter?: string
    paintingType?: string
    selectedColor?: string
    selectedFinish?: string
  }
  appointmentTime?: string
  store?: {
    id: string
    name: string
    address: string
    phone: string
    hours: string
  }
}

export default function OrderDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params?.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCustomerData, setShowCustomerData] = useState(false)

  // Загрузка данных заказа (имитация)
  useEffect(() => {
    // Имитация загрузки данных с сервера
    const loadOrderDetails = () => {
      setIsLoading(true)

      // Демо-данные для заказа
      const demoOrder: Order = {
        id: orderId || "1",
        orderNumber: "P123456",
        status: "оплачено",
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
        customer: {
          name: "Иванов Иван Иванович",
          phone: "+7 (999) 123-45-67",
          email: "ivanov@example.com",
        },
        deliveryMethod: "Доставка",
        transactionId: "TX" + Math.floor(100000000 + Math.random() * 900000000),
        paymentDate: "21.04.2025, 10:15",
      }

      // Проверяем, есть ли данные заказа покраски в localStorage
      const paintingOrderData = localStorage.getItem("paintingOrderData")
      if (paintingOrderData && orderId.startsWith("PNT")) {
        try {
          const paintingOrder = JSON.parse(paintingOrderData)

          // Создаем заказ на основе данных покраски
          const paintingDemoOrder: Order = {
            id: orderId || "1",
            orderNumber: paintingOrder.orderNumber || `PNT${Date.now()}`,
            status: "в обработке",
            items: Object.entries(paintingOrder.services || {}).map(([key, service]: [string, any]) => ({
              id: key,
              name: service.name,
              brand: "Покраска дисков",
              size: paintingOrder.diameter || "R16",
              quantity: service.quantity,
              price: service.price,
              image: "/images/pokraska4.png",
            })),
            totalTotalAmount: paintingOrder.totalPrice || 0,
            createdAt: new Date(paintingOrder.createdAt).toLocaleString("ru-RU") || "Сегодня",
            deliveryAddress: paintingOrder.store?.address || "Самовывоз",
            deliveryDate: paintingOrder.date || "Не указана",
            paymentMethod: "Банковская карта",
            paymentStatus: "не оплачено",
            customer: paintingOrder.customer || {
              name: "Иван Иванов",
              phone: "+7 (999) 123-45-67",
              email: "ivanov@example.com",
            },
            deliveryMethod: "Самовывоз",
            // Добавляем специфичные для покраски данные
            paintingDetails: {
              diameter: paintingOrder.diameter,
              paintingType: paintingOrder.paintingType,
              selectedColor: paintingOrder.selectedColor,
              selectedFinish: paintingOrder.selectedFinish,
            },
            appointmentTime: paintingOrder.time,
            store: paintingOrder.store,
          }

          setOrder(paintingDemoOrder)
          setIsLoading(false)
          return
        } catch (error) {
          console.error("Ошибка при загрузке данных заказа покраски:", error)
        }
      }

      // Имитация задержки загрузки
      setTimeout(() => {
        setOrder(demoOrder)
        setIsLoading(false)
      }, 800)
    }

    loadOrderDetails()
  }, [orderId])

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
      case "оплачено":
        return <CheckCircle className="w-5 h-5 text-green-500" />
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
      case "оплачено":
        return "Заказ оплачен"
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
      case "оплачено":
        return "text-green-500"
    }
  }

  // Ф��нкция для отображения скелетона загрузки
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1F1F1F] py-2 shadow-sm">
        <div className="flex items-center justify-start h-12 pl-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-3"
            aria-label="Вернуться назад"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-[#1F1F1F] dark:text-white">Детали заказа</h1>
        </div>
      </header>

      <main className="px-4 pt-6 pb-6 sm:px-6 lg:px-8 mt-12">
        {isLoading ? (
          renderSkeleton()
        ) : order ? (
          <div className="space-y-6 w-full mx-auto">
            {/* Информация о заказе */}
            <Card className="border border-border/40 dark:border-border/20 shadow-sm bg-card dark:bg-[#2A2A2A] h-auto">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-base font-medium">Информация о заказе</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 pb-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Номер заказа:</span>
                  <span className="text-base font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Дата оформления:</span>
                  <span className="text-base">{order.createdAt}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Статус:</span>
                  <Badge className={`bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1`}>
                    <CheckCircle className="w-3 h-3" />
                    <span>Оплачено</span>
                  </Badge>
                </div>

                {/* Способ получения */}
                <div className="pt-2 mt-1 border-t border-border/30 dark:border-border/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Способ получения:</span>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-[#D3DF3D]/10 text-[#D3DF3D] border-[#D3DF3D]/20"
                    >
                      <Truck className="w-4 h-4" />
                      <span>{order.deliveryMethod}</span>
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm">
                    <div className="flex items-start">
                      <Truck className="w-4 h-4 text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
                      <span>
                        Доставка по адресу: {order.deliveryAddress}. Ожидаемая дата доставки: {order.deliveryDate}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Информация об оплате */}
            <Card className="border border-border/40 dark:border-border/20 shadow-sm bg-card dark:bg-[#2A2A2A] h-auto">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-base font-medium">Оплата</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Статус оплаты:</span>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    <CheckCircle className="w-3 h-3 mr-1" /> Оплачено
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Способ оплаты:</span>
                  <span className="text-sm font-medium">Банковская карта</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">Заказ успешно оплачен</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Оплата прошла успешно. Номер транзакции: {order.transactionId}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Дата оплаты:</span>
                    <span className="text-sm">{order.paymentDate}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Сумма:</span>
                    <span className="text-base font-medium">{formatPrice(order.totalAmount)}</span>
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
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
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
                    <span className="text-sm text-muted-foreground">Общ��я сумма:</span>
                    <span className="font-medium text-base">{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center">
                      <Image src="/images/coin.png" width={12} height={12} alt="Кешбек" className="mr-1" />
                      <span className="text-sm text-[#D3DF3D]">Кешбек:</span>
                    </div>
                    <span className="font-medium text-sm text-[#D3DF3D]">
                      +{formatPrice(Math.round(order.totalAmount * 0.05))}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    5% от суммы заказа начислено на ваш бонусный счет
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Детали покраски (если это заказ покраски) */}
            {order.paintingDetails && (
              <Card className="border border-border/40 dark:border-border/20 shadow-sm bg-card dark:bg-[#2A2A2A] h-auto">
                <CardHeader className="pb-2 pt-3">
                  <CardTitle className="text-base font-medium">Детали покраски</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0 pb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Диаметр диска:</span>
                    <span className="text-base font-medium">{order.paintingDetails.diameter?.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Тип покраски:</span>
                    <span className="text-base">
                      {order.paintingDetails.paintingType === "powder" && "Порошковая покраска"}
                      {order.paintingDetails.paintingType === "acrylic" && "Акриловая покраска"}
                      {order.paintingDetails.paintingType === "powder-machining" && "Порошковая с проточкой"}
                      {order.paintingDetails.paintingType === "acrylic-machining" && "Акриловая с проточкой"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Цвет покраски:</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border border-gray-600"
                        style={{ backgroundColor: order.paintingDetails.selectedColor }}
                      ></div>
                      <span className="text-base">{order.paintingDetails.selectedColor}</span>
                    </div>
                  </div>
                  {order.paintingDetails.selectedFinish && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Тип лака:</span>
                      <span className="text-base">
                        {order.paintingDetails.selectedFinish === "matte" ? "Матовый" : "Глянцевый"}
                      </span>
                    </div>
                  )}
                  {order.appointmentTime && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Время записи:</span>
                      <span className="text-base">{order.appointmentTime}</span>
                    </div>
                  )}
                  {order.store && (
                    <div className="pt-2 mt-2 border-t border-border/30 dark:border-border/20">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Сервис:</span>
                        <span className="text-base font-medium">{order.store.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{order.store.address}</p>
                      <p className="text-sm text-muted-foreground">{order.store.phone}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Кнопка для отображения данных покупателя */}
            {!showCustomerData ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomerData(true)}
                className="flex items-center justify-center gap-2 h-10 text-sm w-full"
              >
                <UserPlus className="h-4 w-4" />
                <span>Показать данные покупателя</span>
              </Button>
            ) : (
              <Card className="border border-border/40 dark:border-border/20 shadow-sm bg-card dark:bg-[#2A2A2A] h-auto">
                <CardHeader className="pb-2 pt-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-medium">Данные покупателя</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCustomerData(false)}
                      className="h-8 w-8 p-0"
                      aria-label="Скрыть данные"
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
                        className="lucide lucide-x"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </Button>
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
            )}

            {/* Кнопки действий */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => router.push("/account/orders")}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Вернуться к списку заказов</span>
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
