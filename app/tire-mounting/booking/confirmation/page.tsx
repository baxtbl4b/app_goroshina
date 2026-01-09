"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Calendar, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import SafeAreaHeader from "@/components/safe-area-header"
import Link from "next/link"
import LoadingSpinner from "@/components/loading-spinner"

export default function TireMountingBookingConfirmationPage() {
  const router = useRouter()
  const [orderData, setOrderData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [selectedStore, setSelectedStore] = useState(null)

  useEffect(() => {
    const savedOrderData = localStorage.getItem("tireMountingOrderData")
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData))
    } else {
      // Если данных нет, перенаправляем на главную страницу шиномонтажа
      router.push("/tire-mounting")
    }
  }, [router])

  const handleGoHome = () => {
    // Очищаем данные заказа
    localStorage.removeItem("tireMountingOrderData")
    router.push("/")
  }

  const handleViewOrders = () => {
    // Очищаем данные заказа
    localStorage.removeItem("tireMountingOrderData")
    router.push("/account/orders")
  }

  if (!orderData) {
    return (
      <div className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
        <SafeAreaHeader title="Подтверждение записи" showBackButton={false} className="bg-gray-200" />
        <main className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#009CFF]"></div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <SafeAreaHeader title="Запись подтверждена" showBackButton={false} className="bg-gray-200" />

      <main className="flex-1 p-4 pb-4 space-y-6">
        {/* Success Message */}
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-500">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">Запись подтверждена!</h1>
            <p className="text-green-600 dark:text-green-300 mb-4">
              Ваша заявка на шиномонтаж принята и обрабатывается
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

        {/* Services */}
        <Card className="bg-white dark:bg-[#2A2A2A]">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-[#1F1F1F] dark:text-white mb-4">Заказанные услуги</h2>
            <div className="space-y-3">
              {Object.entries(orderData.services).map(([key, service]: [string, any]) => (
                <div key={key} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-[#1F1F1F] dark:text-white">{service.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {service.quantity} шт. × {service.price}₽
                    </p>
                  </div>
                  <p className="font-medium text-[#1F1F1F] dark:text-white">{service.total}₽</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-300 dark:border-gray-600 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#1F1F1F] dark:text-white">Итого:</span>
                <span className="text-xl font-bold text-[#c4d402]">{orderData.totalPrice}₽</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-500">
          <CardContent className="p-4">
            <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2">Что дальше?</h3>
            <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
              <li>• Ваша запись автоматически подтверждена</li>
              <li>• Приезжайте в назначенное время для шиномонтажа</li>
              <li>• Мы выполним все выбранные услуги качественно и в срок</li>
              <li>• При необходимости мы свяжемся с вами</li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
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

        <p className="text-xs text-gray-400 text-center mt-3">
          Нажимая "Оформить заказ", вы соглашаетесь с{" "}
          <Link href="/settings/terms" className="text-blue-400 hover:text-blue-300 underline">
            условиями
          </Link>{" "}
          предоставления услуг
        </p>

        {/* Contact Support */}
        <Card className="bg-gray-50 dark:bg-gray-800/50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Есть вопросы по записи?</p>
            <Button variant="link" className="text-[#009CFF] hover:text-[#009CFF]/80 p-0 h-auto" asChild>
              <Link href={`tel:${orderData.store.phone}`}>Позвонить в службу поддержки</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
