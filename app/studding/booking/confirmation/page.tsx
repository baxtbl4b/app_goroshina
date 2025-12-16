"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import SafeAreaHeader from "@/components/safe-area-header"
import { CheckCircle, Calendar, MapPin, Phone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function StuddingBookingConfirmationPage() {
  const router = useRouter()
  const [orderData, setOrderData] = useState({
    orderNumber: "STD-" + Math.floor(100000 + Math.random() * 900000),
    date: "2025-06-01",
    time: "14:00",
    store: {
      name: 'Шинный центр "Колесо"',
      address: "ул. Автомобильная, 42",
      phone: "+7 (999) 123-45-67",
    },
    customer: {
      name: "Иван Петров",
      phone: "+7 (999) 987-65-43",
      email: "ivan@example.com",
      comment: "Шипы Nokian Hakkapeliitta",
    },
    services: {
      studding: {
        name: "Дошиповка шин",
        quantity: 4,
        price: 1200,
        total: 4800,
      },
    },
    totalPrice: 4800,
  })

  const handleGoHome = () => {
    router.push("/")
  }

  const handleViewOrders = () => {
    router.push("/account/orders")
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      <SafeAreaHeader title="Запись подтверждена" showBackButton={false} />

      <main className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Успешное подтверждение */}
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-500">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">Запись подтверждена!</h1>
              <p className="text-green-600 dark:text-green-300 mb-4">
                Ваша заявка на дошиповку шин успешно оформлена. Мы ждем вас в назначенное время.
              </p>
              <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 inline-block">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Номер заказа: {orderData.orderNumber}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card className="bg-white dark:bg-[#2A2A2A]">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-[#1F1F1F] dark:text-white mb-4">Детали записи</h2>

              <div className="space-y-4">
                {/* Service */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#c4d402] rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-[#1F1F1F]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1F1F1F] dark:text-white">Услуга</p>
                    <p className="text-gray-600 dark:text-gray-400">Дошиповка шин</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      4 шины • 205/55 R16 • Nokian Hakkapeliitta
                    </p>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#c4d402] rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-[#1F1F1F]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1F1F1F] dark:text-white">Дата и время</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(orderData.date).toLocaleDateString("ru-RU", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      в {orderData.time}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#c4d402] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-[#1F1F1F]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1F1F1F] dark:text-white">Адрес</p>
                    <p className="text-gray-600 dark:text-gray-400">{orderData.store.name}</p>
                    <p className="text-gray-600 dark:text-gray-400">{orderData.store.address}</p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#c4d402] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-[#1F1F1F]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1F1F1F] dark:text-white">Телефон</p>
                    <p className="text-gray-600 dark:text-gray-400">{orderData.store.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Услуги */}
          <div className="bg-[#2A2A2A] rounded-lg p-4">
            <h2 className="text-lg font-bold mb-4">Заказанные услуги</h2>
            <div className="space-y-3">
              {Object.entries(orderData.services).map(([key, service]: [string, any]) => (
                <div key={key} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-gray-400">
                      {service.quantity} шт. × {service.price}₽
                    </p>
                  </div>
                  <p className="font-medium">{service.total}₽</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-600 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Итого:</span>
                <span className="text-xl font-bold text-[#c4d402]">{orderData.totalPrice}₽</span>
              </div>
            </div>
          </div>

          {/* Что дальше */}
          <div className="bg-[#2A2A2A] rounded-lg p-4">
            <h2 className="text-lg font-bold mb-3">Что дальше?</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#c4d402] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black font-bold text-xs">1</span>
                </div>
                <p>Наш менеджер свяжется с вами для подтверждения записи</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-xs">2</span>
                </div>
                <p>Приезжайте в назначенное время с шинами для дошиповки</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-xs">3</span>
                </div>
                <p>Мы выполним дошиповку согласно вашим требованиям</p>
              </div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="space-y-3">
            <button
              onClick={handleViewOrders}
              className="w-full bg-[#c4d402] hover:bg-[#C4CF2E] text-black py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Посмотреть мои записи
            </button>
            <button
              onClick={handleGoHome}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              На главную
            </button>
          </div>

          {/* Contact Support */}
          <Card className="bg-gray-50 dark:bg-gray-800/50">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Есть вопросы по записи?</p>
              <Button variant="link" className="text-[#009CFF] hover:text-[#009CFF]/80 p-0 h-auto" asChild>
                <Link href="tel:+78121234567">Позвонить в службу поддержки</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
