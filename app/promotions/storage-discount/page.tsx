"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import BottomNavigation from "@/components/bottom-navigation"

export default function StorageDiscountPromotionPage() {
  const router = useRouter()

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] p-4 shadow-sm">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
            </Button>
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Скидка на хранение шин</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20 text-[#1F1F1F] dark:text-white">
        <h2 className="text-2xl font-bold">Правила участия в акции</h2>
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Акция действует с 01.10.2023 по 30.11.2023.</li>
            <li>Скидка 20% предоставляется на сезонное хранение комплекта (4 шт.) шин.</li>
            <li>Акция распространяется на новые и постоянные клиенты.</li>
            <li>Для получения скидки необходимо оформить договор на хранение в период действия акции.</li>
            <li>Скидка не суммируется с другими акциями и специальными предложениями.</li>
            <li>Организатор оставляет за собой право изменять условия акции без предварительного уведомления.</li>
          </ul>
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}
