"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Search, Package, CheckCircle, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import OrderHistoryItem from "@/components/order-history-item"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BottomNavigation from "@/components/bottom-navigation"
import { Input } from "@/components/ui/input"

// Типы для заказов
type OrderStatus = "На сборке" | "Забронирован" | "Готов к выдаче" | "В пути" | "Выполнен"

interface Order {
  id: string
  orderNumber: string
  date: string
  status: OrderStatus
  items: number
  total: string
  products: Array<{
    name: string
    quantity: number
    image?: string
  }>
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Загрузка заказов
  useEffect(() => {
    const loadOrders = () => {
      setIsLoading(true)

      try {
        const allOrders: Order[] = []

        // Загружаем заказы из истории (оформленные через корзину)
        const ordersHistory = localStorage.getItem("ordersHistory")
        if (ordersHistory) {
          const historyOrders = JSON.parse(ordersHistory)
          historyOrders.forEach((order: any) => {
            // Определяем статус
            let status: OrderStatus = "На сборке"
            if (order.status === "зарезервировано" || order.status === "забронирован" || order.status === "Забронирован") status = "Забронирован"
            if (order.status === "готов к выдаче" || order.status === "Готов к выдаче") status = "Готов к выдаче"
            if (order.status === "в пути" || order.status === "В пути") status = "В пути"
            if (order.isPaid || order.status === "выполнен" || order.status === "Выполнен") status = "Выполнен"

            allOrders.push({
              id: order.orderNumber,
              orderNumber: order.orderNumber,
              date: new Date(order.createdAt).toLocaleDateString("ru-RU"),
              status,
              items: order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0,
              total: `${order.totalAmount?.toLocaleString("ru-RU") || 0} ₽`,
              products: order.items?.map((item: any) => ({
                name: item.name,
                quantity: item.quantity,
                image: item.image || "/images/summer-tire-new.png",
              })) || [],
            })
          })
        }

        // Загружаем заказы покраски
        const paintingOrder = localStorage.getItem("paintingOrderData")
        if (paintingOrder) {
          const order = JSON.parse(paintingOrder)
          allOrders.push({
            id: order.orderNumber || `P${Date.now()}`,
            orderNumber: order.orderNumber || `P${Date.now()}`,
            date: new Date(order.date).toLocaleDateString("ru-RU") || new Date().toLocaleDateString("ru-RU"),
            status: "Забронирован",
            items: Object.keys(order.services || {}).length + Object.keys(order.tireMountingServices || {}).length,
            total: `${order.totalPrice || 0} ₽`,
            products: [
              { name: "Покраска дисков", quantity: 1, image: "/images/pokraska4.png" },
              ...(order.tireMountingServices
                ? [{ name: "Шиномонтаж", quantity: 1, image: "/images/shinomontazh-new.png" }]
                : []),
            ],
          })
        }

        // Загружаем заказы шиномонтажа
        const tireMountingOrder = localStorage.getItem("tireMountingOrderData")
        if (tireMountingOrder) {
          const order = JSON.parse(tireMountingOrder)
          allOrders.push({
            id: order.orderNumber || `TM${Date.now()}`,
            orderNumber: order.orderNumber || `TM${Date.now()}`,
            date: new Date().toLocaleDateString("ru-RU"),
            status: "Забронирован",
            items: Object.keys(order.services || {}).length || 1,
            total: `${order.totalPrice || 0} ₽`,
            products: [{ name: "Шиномонтаж", quantity: 1, image: "/images/shinomontazh-new.png" }],
          })
        }

        // Загружаем заказы дошиповки
        const studdingOrder = localStorage.getItem("studdingOrderData")
        if (studdingOrder) {
          const order = JSON.parse(studdingOrder)
          allOrders.push({
            id: order.orderNumber || `ST${Date.now()}`,
            orderNumber: order.orderNumber || `ST${Date.now()}`,
            date: new Date(order.date).toLocaleDateString("ru-RU") || new Date().toLocaleDateString("ru-RU"),
            status: "На сборке",
            items: 1,
            total: `${order.totalPrice || 0} ₽`,
            products: [{ name: "Дошиповка шин", quantity: 1, image: "/images/stupinators.png" }],
          })
        }

        // Загружаем заказы хранения шин
        const tireStorageOrder = localStorage.getItem("tireStorageOrderData")
        if (tireStorageOrder) {
          const order = JSON.parse(tireStorageOrder)
          allOrders.push({
            id: order.orderNumber || `TS${Date.now()}`,
            orderNumber: order.orderNumber || `TS${Date.now()}`,
            date: new Date(order.date).toLocaleDateString("ru-RU") || new Date().toLocaleDateString("ru-RU"),
            status: "Забронирован",
            items: 1,
            total: `${order.totalPrice || 0} ₽`,
            products: [{ name: "Хранение шин", quantity: 1, image: "/images/tire-storage-bags.png" }],
          })
        }

        // Сортируем заказы по дате (новые сначала)
        allOrders.sort((a, b) => {
          const dateA = a.date.split('.').reverse().join('-')
          const dateB = b.date.split('.').reverse().join('-')
          return new Date(dateB).getTime() - new Date(dateA).getTime()
        })

        setOrders(allOrders)
      } catch (error) {
        console.error("Ошибка при загрузке заказов:", error)
        setOrders([])
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 500)
      }
    }

    loadOrders()
  }, [])

  // Функция для очистки всех заказов (для тестирования)
  const clearAllOrders = () => {
    localStorage.removeItem("paintingOrderData")
    localStorage.removeItem("tireMountingOrderData")
    localStorage.removeItem("studdingOrderData")
    localStorage.removeItem("tireStorageOrderData")
    localStorage.removeItem("ordersHistory")
    localStorage.removeItem("currentOrder")
    window.location.reload()
  }

  // Очистка всех заказов при первой загрузке (УДАЛИТЬ ПОСЛЕ ТЕСТИРОВАНИЯ)
  useEffect(() => {
    const cleared = sessionStorage.getItem("ordersCleared")
    if (!cleared) {
      localStorage.removeItem("paintingOrderData")
      localStorage.removeItem("tireMountingOrderData")
      localStorage.removeItem("studdingOrderData")
      localStorage.removeItem("tireStorageOrderData")
      localStorage.removeItem("ordersHistory")
      localStorage.removeItem("currentOrder")
      sessionStorage.setItem("ordersCleared", "true")
    }
  }, [])

  // Фильтрация заказов по статусу и поиску
  const filteredOrders = orders.filter((order) => order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()))

  const activeOrders = filteredOrders.filter((order) =>
    ["На сборке", "Забронирован", "Готов к выдаче", "В пути"].includes(order.status),
  )
  const completedOrders = filteredOrders.filter((order) => order.status === "Выполнен")

  // Функция для отображения скелетона загрузки
  const renderSkeletons = () => {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="bg-white dark:bg-[#1F1F1F] rounded-2xl p-5 animate-pulse">
          <div className="flex justify-between items-center mb-3">
            <div className="h-5 bg-gray-200 dark:bg-[#2A2A2A] rounded-xl w-1/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-[#2A2A2A] rounded-xl w-1/5"></div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="h-4 bg-gray-200 dark:bg-[#2A2A2A] rounded-xl w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 dark:bg-[#2A2A2A] rounded-xl w-1/3"></div>
            </div>
            <div className="h-6 w-6 bg-gray-200 dark:bg-[#2A2A2A] rounded-full"></div>
          </div>
        </div>
      ))
  }

  // Функция для получения иконки статуса
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "На сборке":
        return <Clock className="h-4 w-4 text-blue-400" />
      case "Забронирован":
        return <CheckCircle className="h-4 w-4 text-orange-400" />
      case "Готов к выдаче":
        return <Package className="h-4 w-4 text-green-400" />
      case "В пути":
        return <Package className="h-4 w-4 text-emerald-300" />
      case "Выполнен":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      {/* Заголовок */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full flex items-center justify-start pl-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors mr-3"
            aria-label="Вернуться назад"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Мои заказы</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Поиск и фильтры */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск по номеру заказа"
              className="pl-11 pr-4 py-3 w-full bg-white dark:bg-[#1F1F1F] border border-gray-300 dark:border-none rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#c4d402] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Вкладки для фильтрации заказов */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-gray-200 dark:bg-[#1F1F1F] p-1.5 rounded-2xl shadow-sm h-auto">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-[#c4d402] data-[state=active]:text-black text-gray-600 dark:text-gray-400 py-2.5 rounded-xl font-medium transition-all duration-200"
            >
              Все
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-[#c4d402] data-[state=active]:text-black text-gray-600 dark:text-gray-400 py-2.5 rounded-xl font-medium transition-all duration-200"
            >
              Активные
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-[#c4d402] data-[state=active]:text-black text-gray-600 dark:text-gray-400 py-2.5 rounded-xl font-medium transition-all duration-200"
            >
              Выполнены
            </TabsTrigger>
          </TabsList>

          {/* Все заказы */}
          <TabsContent value="all" className="space-y-4 animate-in fade-in-50 duration-300">
            {isLoading ? (
              renderSkeletons()
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="transform transition-all duration-200 hover:scale-[1.02]">
                    <OrderHistoryItem
                      id={order.id}
                      orderNumber={order.orderNumber}
                      date={order.date}
                      status={order.status}
                      items={order.items}
                      total={order.total}
                      products={order.products}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white dark:bg-[#1F1F1F] rounded-2xl p-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-[#2A2A2A] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">У вас пока нет заказов</h3>
                <p className="text-gray-600 dark:text-gray-500 mb-5">Здесь будет отображаться история ваших заказов</p>
                <button
                  onClick={() => router.push("/")}
                  className="px-6 py-3 bg-[#c4d402] text-black font-semibold rounded-2xl hover:bg-[#c5d136] transition-colors"
                >
                  Перейти к покупкам
                </button>
              </div>
            )}
          </TabsContent>

          {/* Активные заказы */}
          <TabsContent value="active" className="space-y-4 animate-in fade-in-50 duration-300">
            {isLoading ? (
              renderSkeletons()
            ) : activeOrders.length > 0 ? (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="transform transition-all duration-200 hover:scale-[1.02]">
                    <OrderHistoryItem
                      id={order.id}
                      orderNumber={order.orderNumber}
                      date={order.date}
                      status={order.status}
                      items={order.items}
                      total={order.total}
                      products={order.products}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white dark:bg-[#1F1F1F] rounded-2xl p-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-[#2A2A2A] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">У вас нет активных заказов</h3>
                <p className="text-gray-600 dark:text-gray-500">Активные заказы будут отображаться здесь</p>
              </div>
            )}
          </TabsContent>

          {/* Выполненные заказы */}
          <TabsContent value="completed" className="space-y-4 animate-in fade-in-50 duration-300">
            {isLoading ? (
              renderSkeletons()
            ) : completedOrders.length > 0 ? (
              <div className="space-y-4">
                {completedOrders.map((order) => (
                  <div key={order.id} className="transform transition-all duration-200 hover:scale-[1.02]">
                    <OrderHistoryItem
                      id={order.id}
                      orderNumber={order.orderNumber}
                      date={order.date}
                      status={order.status}
                      items={order.items}
                      total={order.total}
                      products={order.products}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white dark:bg-[#1F1F1F] rounded-2xl p-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-[#2A2A2A] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  У вас нет выполненных заказов
                </h3>
                <p className="text-gray-600 dark:text-gray-500">Выполненные заказы будут отображаться здесь</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <div className="pb-20"></div>
      <BottomNavigation />
    </div>
  )
}
