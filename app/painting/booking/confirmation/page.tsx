"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import SafeAreaHeader from "@/components/safe-area-header"
import { CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import LoadingSpinner from "@/components/loading-spinner"

export default function PaintingBookingConfirmationPage() {
  const router = useRouter()
  const [orderData, setOrderData] = useState(null)

  useEffect(() => {
    const savedOrderData = localStorage.getItem("paintingOrderData")
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData))
    } else {
      // Если данных нет, перенаправляем на главную страницу покраски
      router.push("/painting")
    }
  }, [router])

  const handleGoHome = () => {
    // Очищаем данные заказа
    localStorage.removeItem("paintingOrderData")
    router.back() // Изменено с router.push("/")
  }

  const handleViewOrders = () => {
    // Очищаем данные заказа
    localStorage.removeItem("paintingOrderData")
    router.push("/account/orders")
  }

  if (!orderData) {
    return (
      <div className="flex flex-col min-h-screen bg-[#121212] text-white">
        <SafeAreaHeader title="Подтверждение записи" showBackButton={false} />
        <main className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#009CFF]"></div>
        </main>
      </div>
    )
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
                Ваша заявка успешно оформлена. Мы ждем вас в назначенное время.
              </p>
              <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 inline-block">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Номер заказа: {orderData.orderNumber}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Детали записи */}
          <Card className="bg-white dark:bg-[#2A2A2A]">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-[#1F1F1F] dark:text-white mb-4">Детали записи</h2>

              <div className="space-y-4">
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

                {/* Customer Info */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#c4d402] rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-[#1F1F1F]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1F1F1F] dark:text-white">Контактная информация</p>
                    <p className="text-gray-600 dark:text-gray-400">{orderData.customer.name}</p>
                    <p className="text-gray-600 dark:text-gray-400">{orderData.customer.phone}</p>
                    {orderData.customer.email && (
                      <p className="text-gray-600 dark:text-gray-400">{orderData.customer.email}</p>
                    )}
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
                <p>Наш менеджер свяжется с вами если в этом будет необходимость</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-xs">2</span>
                </div>
                <p>Приезжайте в назначенное время с дисками для покраски</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-xs">3</span>
                </div>
                <p>Мы выполним покраску согласно вашим требованиям</p>
              </div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="space-y-3">
            <Button
              onClick={handleViewOrders}
              className="w-full bg-[#c4d402] hover:bg-[#C4CF2E] text-black py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Посмотреть мои записи
            </Button>
            <Button
              onClick={handleGoHome}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              На главную
            </Button>
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
