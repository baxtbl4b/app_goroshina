"use client"

import { CheckCircle, Calendar, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import SafeAreaHeader from "@/components/safe-area-header"
import Link from "next/link"

export default function SoundproofingConfirmationPage() {
  // In a real app, you would get this data from the booking state or API
  const bookingDetails = {
    service: "Шумоизоляция шин",
    shop: "Шинный центр на Таллинском шоссе",
    address: "Таллинское шоссе, 190",
    phone: "+7 (812) 123-45-67",
    date: new Date().toLocaleDateString("ru-RU"),
    time: "14:00",
    orderNumber: "SP-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    carInfo: "BMW X5 2020",
    tireSize: "225/55 R17",
    quantity: "4 шины",
    estimatedPrice: "5600 ₽",
    estimatedDuration: "3-4 часа",
  }

  // Add these handler functions at the top of the component, after the bookingDetails object
  const handleViewOrders = () => {
    // Navigate to orders page - you can implement this with router.push if needed
    window.location.href = "/account/orders"
  }

  const handleGoHome = () => {
    // Navigate to home page
    window.location.href = "/"
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <SafeAreaHeader
        title="Подтверждение записи"
        showBackButton
        backUrl="/soundproofing/booking"
        className="bg-gray-200"
      />

      <main className="flex-1 p-4 pb-4 space-y-6">
        {/* Success Message */}
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-500">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">Запись подтверждена!</h1>
            <p className="text-green-600 dark:text-green-300 mb-4">
              Ваша заявка на шумоизоляцию шин успешно оформлена. Мы ждем вас в назначенное время.
            </p>
            <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 inline-block">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Номер заказа: {bookingDetails.orderNumber}
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
                  <p className="text-gray-600 dark:text-gray-400">{bookingDetails.service}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {bookingDetails.carInfo} • {bookingDetails.tireSize} • {bookingDetails.quantity}
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
                    {bookingDetails.date} в {bookingDetails.time}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Время выполнения: {bookingDetails.estimatedDuration}
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
                  <p className="text-gray-600 dark:text-gray-400">{bookingDetails.shop}</p>
                  <p className="text-gray-600 dark:text-gray-400">{bookingDetails.address}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#c4d402] rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-[#1F1F1F]" />
                </div>
                <div>
                  <p className="font-medium text-[#1F1F1F] dark:text-white">Телефон</p>
                  <p className="text-gray-600 dark:text-gray-400">{bookingDetails.phone}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mt-4 p-4 bg-[#F5F5F5] dark:bg-[#333333] rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#1F1F1F] dark:text-white">Предварительная стоимость:</span>
                  <span className="text-xl font-bold text-[#c4d402]">{bookingDetails.estimatedPrice}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Окончательная стоимость может отличаться в зависимости от состояния шин
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-500">
          <CardContent className="p-4">
            <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2">Важная информация</h3>
            <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
              <li>• Пожалуйста, приезжайте за 10 минут до назначенного времени</li>
              <li>• В случае опоздания более чем на 15 минут, запись может быть отменена</li>
              <li>• Для изменения или отмены записи звоните по указанному телефону</li>
            </ul>
          </CardContent>
        </Card>

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
      </main>
    </div>
  )
}
