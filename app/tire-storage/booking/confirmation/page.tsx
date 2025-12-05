"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import SafeAreaHeader from "@/components/safe-area-header"

export default function TireStorageBookingConfirmationPage() {
  const router = useRouter()

  // In a real app, you would get this data from your backend or state management
  const bookingDetails = {
    service: "Хранение шин",
    date: "30 мая 2025",
    time: "14:00",
    shop: "Шинный центр на Шинной",
    address: "ул. Шинная, 42",
    phone: "+7 (495) 123-45-67",
    duration: "6 месяцев",
    tireCount: "4 шины",
    totalPrice: "14 400 ₽",
    orderNumber: `#TS-2024-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`,
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <SafeAreaHeader title="Бронирование подтверждено" showBackButton backUrl="/" className="bg-gray-200" />

      <main className="flex-1 p-4 space-y-6 pb-8">
        {/* Success Message */}
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-500 shadow-sm">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">Запись подтверждена!</h1>
            <p className="text-green-600 dark:text-green-300 mb-4">
              Ваша заявка успешно оформлена. Мы ждем вас в назначенное время.
            </p>
            <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 inline-block">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Номер заказа: {bookingDetails.orderNumber}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Booking Details */}
        <Card className="bg-white dark:bg-[#2A2A2A] shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-[#1F1F1F] dark:text-white mb-4">Детали записи</h2>

            <div className="space-y-4">
              {/* Service */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#D3DF3D] rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-[#1F1F1F]" />
                </div>
                <div>
                  <p className="font-medium text-[#1F1F1F] dark:text-white">Услуга</p>
                  <p className="text-gray-600 dark:text-gray-400">{bookingDetails.service}</p>
                </div>
              </div>

              {/* Date and Time */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#D3DF3D] rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-4 w-4 text-[#1F1F1F]" />
                </div>
                <div>
                  <p className="font-medium text-[#1F1F1F] dark:text-white">Дата и время</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {bookingDetails.date} в {bookingDetails.time}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#D3DF3D] rounded-full flex items-center justify-center flex-shrink-0">
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
                <div className="w-8 h-8 bg-[#D3DF3D] rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-[#1F1F1F]" />
                </div>
                <div>
                  <p className="font-medium text-[#1F1F1F] dark:text-white">Телефон</p>
                  <p className="text-gray-600 dark:text-gray-400">{bookingDetails.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="space-y-3">
          <Button asChild className="w-full h-12 bg-[#D3DF3D] hover:bg-[#D3DF3D]/90 text-[#1F1F1F] font-bold">
            <Link href="/account/orders">Посмотреть мои записи</Link>
          </Button>

          <Button
            asChild
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            <Link href="/">На главную</Link>
          </Button>
        </div>
        {/* Contact Support */}
        <Card className="bg-white dark:bg-[#2A2A2A] shadow-sm border">
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
