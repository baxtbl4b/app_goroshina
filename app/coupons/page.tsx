"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import BottomNavigation from "@/components/bottom-navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function CouponsPage() {
  const { toast } = useToast()
  const [isStorageCouponActive, setIsStorageCouponActive] = useState(false)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Купон скопирован!",
      description: `Код "${code}" добавлен в буфер обмена.`,
    })
  }

  const activeCoupons = [
    {
      id: "1",
      title: "Скидка 15% на шиномонтаж",
      description: "Скидка на все услуги шиномонтажа при заказе комплекта шин",
      expires: "30.07.2025",
      code: "SHINOMONTAZH15",
      status: "active",
    },
    {
      id: "2",
      title: "500 бонусных баллов",
      description: "Дополнительные баллы при покупке от 15 000 ₽",
      expires: "15.08.2025",
      code: "BONUS500",
      status: "active",
    },
  ]

  const availableCoupons = [
    {
      id: "3",
      title: "Бесплатное хранение шин",
      description: "1 месяц бесплатного хранения при покупке комплекта зимних шин",
      expires: "01.10.2025",
      code: "STORAGEFREE",
      status: "available",
    },
  ]

  const usedCoupons = [
    {
      id: "4",
      title: "Скидка 10% на аксессуары",
      description: "Скидка на все аксессуары при покупке от 5 000 ₽",
      usedDate: "15.05.2025",
      code: "ACCESSORY10",
      status: "used",
    },
  ]

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
              </Button>
            </Link>
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Купоны</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        {/* Active Coupons */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#D9D9DD] dark:border-[#3A3A3A]">
            <h3 className="font-bold text-[#1F1F1F] dark:text-white">Активные купоны</h3>
          </div>

          <div className="divide-y divide-[#D9D9DD] dark:divide-[#3A3A3A]">
            {activeCoupons.map((coupon) => (
              <div key={coupon.id} className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-[#1F1F1F] dark:text-white">{coupon.title}</h4>
                  <span className="bg-[#c4d402] text-[#1F1F1F] text-xs font-bold px-2 py-1 rounded-full">Активен</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{coupon.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-500">Действует до: {coupon.expires}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[#009CFF] border-[#009CFF] bg-transparent font-mono"
                    onClick={() => handleCopy(coupon.code)}
                  >
                    {coupon.code}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Coupons */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#D9D9DD] dark:border-[#3A3A3A]">
            <h3 className="font-bold text-[#1F1F1F] dark:text-white">Доступные купоны</h3>
          </div>

          <div className="divide-y divide-[#D9D9DD] dark:divide-[#3A3A3A]">
            {availableCoupons.map((coupon) => (
              <div key={coupon.id} className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-[#1F1F1F] dark:text-white">{coupon.title}</h4>
                  {isStorageCouponActive ? (
                    <span className="bg-[#c4d402] text-[#1F1F1F] text-xs font-bold px-2 py-1 rounded-full">
                      Активен
                    </span>
                  ) : (
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-bold px-2 py-1 rounded-full">
                      Получить
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{coupon.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-500">Доступен до: {coupon.expires}</span>
                  {isStorageCouponActive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[#009CFF] border-[#009CFF] bg-transparent font-mono"
                      onClick={() => handleCopy(coupon.code)}
                    >
                      {coupon.code}
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setIsStorageCouponActive(true)}>
                      Активировать
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Used Coupons */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#D9D9DD] dark:border-[#3A3A3A]">
            <h3 className="font-bold text-[#1F1F1F] dark:text-white">Использованные купоны</h3>
          </div>

          <div className="divide-y divide-[#D9D9DD] dark:divide-[#3A3A3A]">
            {usedCoupons.map((coupon) => (
              <div key={coupon.id} className="p-4 opacity-70">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-[#1F1F1F] dark:text-white">{coupon.title}</h4>
                  <span className="bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 text-xs font-bold px-2 py-1 rounded-full">
                    Использован
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{coupon.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-500">Использован: {coupon.usedDate}</span>
                  <span className="text-sm font-mono text-gray-500 dark:text-gray-400">{coupon.code}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}
