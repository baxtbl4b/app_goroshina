"use client"

import Link from "next/link"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import BottomNavigation from "@/components/bottom-navigation"

export default function PromotionsPage() {
  const router = useRouter()

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-4 relative flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5 text-gray-900 dark:text-white" />
            </Button>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Акции</span>
          </div>

          {/* No logo here */}
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        <div className="space-y-4">
          {/* Promotion 1 */}
          <div className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden shadow-sm">
            <div className="relative h-40">
              <Image src="/images/winter-tire-new.png" alt="Зимние шины со скидкой 15%" fill className="object-cover" />
              <div className="absolute top-3 left-3 bg-[#c4d402] text-[#1F1F1F] text-sm font-bold px-3 py-1 rounded-full">
                -15%
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-[#1F1F1F] dark:text-white">Зимние шины со скидкой 15%</h3>
              <p className="text-sm text-[#1F1F1F] dark:text-gray-300 mt-1">
                Подготовьтесь к зиме заранее! Скидка на все зимние шины до конца месяца.
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-[#1F1F1F] dark:text-gray-400">До 31.10.2023</span>
                <Link href="/promotions/winter-tires">
                  <Button size="sm" className="bg-[#c4d402] hover:bg-[#c4d402]/80 text-[#1F1F1F]">
                    Подробнее
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Promotion 2 */}
          <div className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden shadow-sm">
            <div className="relative h-40">
              <Image src="/images/shinomontazh.png" alt="Бесплатный шиномонтаж" fill className="object-cover" />
              <div className="absolute top-3 left-3 bg-[#009CFF] text-white text-sm font-bold px-3 py-1 rounded-full">
                Акция
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-[#1F1F1F] dark:text-white">Бесплатный шиномонтаж</h3>
              <p className="text-sm text-[#1F1F1F] dark:text-gray-300 mt-1">
                При покупке комплекта шин — шиномонтаж в подарок! Экономия до 4 000 ₽.
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-[#1F1F1F] dark:text-gray-400">До 15.11.2023</span>
                <Link href="/promotions/free-mounting">
                  <Button size="sm" className="bg-[#c4d402] hover:bg-[#c4d402]/80 text-[#1F1F1F]">
                    Подробнее
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Promotion 3 */}
          <div className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden shadow-sm">
            <div className="relative h-40">
              <Image src="/images/hranenie.png" alt="Скидка на хранение шин" fill className="object-cover" />
              <div className="absolute top-3 left-3 bg-[#c4d402] text-[#1F1F1F] text-sm font-bold px-3 py-1 rounded-full">
                -20%
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-[#1F1F1F] dark:text-white">Скидка на хранение шин</h3>
              <p className="text-sm text-[#1F1F1F] dark:text-gray-300 mt-1">
                Сезонное хранение шин со скидкой 20%. Освободите место в гараже!
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-[#1F1F1F] dark:text-gray-400">До 30.11.2023</span>
                <Link href="/promotions/storage-discount">
                  <Button size="sm" className="bg-[#c4d402] hover:bg-[#c4d402]/80 text-[#1F1F1F]">
                    Подробнее
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Promotion 4 */}
          <div className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden shadow-sm">
            <div className="relative h-40">
              <Image src="/images/diski_search.png" alt="Рассрочка на диски" fill className="object-cover" />
              <div className="absolute top-3 left-3 bg-[#009CFF] text-white text-sm font-bold px-3 py-1 rounded-full">
                0%
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-[#1F1F1F] dark:text-white">Рассрочка на диски</h3>
              <p className="text-sm text-[#1F1F1F] dark:text-gray-300 mt-1">
                Купите новые диски в рассрочку без переплаты! 0% на 6 месяцев.
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-[#1F1F1F] dark:text-gray-400">Постоянная акция</span>
                <Link href="/promotions/installment">
                  <Button size="sm" className="bg-[#c4d402] hover:bg-[#c4d402]/80 text-[#1F1F1F]">
                    Подробнее
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}
