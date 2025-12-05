"use client"

import {
  ArrowLeft,
  Award,
  Check,
  ChevronRight,
  ShoppingBag,
  Car,
  PenToolIcon as Tool,
  Calendar,
  Gift,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function EarnPointsPage() {
  const [activeTab, setActiveTab] = useState("purchases")

  return (
    <main className="flex flex-col min-h-screen bg-[#F5F5F7] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] shadow-sm">
        <div className="p-4 flex items-center">
          <Link href="/" className="mr-4">
            <ArrowLeft className="h-6 w-6 text-[#1F1F1F] dark:text-white" />
          </Link>
          <h1 className="text-xl font-bold text-[#1F1F1F] dark:text-white">Как получить баллы</h1>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        {/* Overview Card */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-8 w-8 text-[#D3DF3D]" />
            <h2 className="text-lg font-bold text-[#1F1F1F] dark:text-white">Программа лояльности</h2>
          </div>
          <p className="text-sm text-[#666666] dark:text-[#BBBBBB] mb-4">
            Накапливайте баллы и обменивайте их на скидки при покупке шин, дисков и услуг. 1 балл = 1 рубль скидки.
          </p>
          <div className="bg-[#F5F5F7] dark:bg-[#333333] p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">Ваш баланс:</span>
              <span className="text-lg font-bold text-[#D3DF3D]">350 баллов</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">Статус:</span>
              <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">Серебрянный</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 scrollbar-hide">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeTab === "purchases"
                ? "bg-[#D3DF3D] text-[#1F1F1F]"
                : "bg-white dark:bg-[#2A2A2A] text-[#1F1F1F] dark:text-white"
            }`}
            onClick={() => setActiveTab("purchases")}
          >
            Покупки
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeTab === "services"
                ? "bg-[#D3DF3D] text-[#1F1F1F]"
                : "bg-white dark:bg-[#2A2A2A] text-[#1F1F1F] dark:text-white"
            }`}
            onClick={() => setActiveTab("services")}
          >
            Сервисы
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeTab === "activities"
                ? "bg-[#D3DF3D] text-[#1F1F1F]"
                : "bg-white dark:bg-[#2A2A2A] text-[#1F1F1F] dark:text-white"
            }`}
            onClick={() => setActiveTab("activities")}
          >
            Активности
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeTab === "referrals"
                ? "bg-[#D3DF3D] text-[#1F1F1F]"
                : "bg-white dark:bg-[#2A2A2A] text-[#1F1F1F] dark:text-white"
            }`}
            onClick={() => setActiveTab("referrals")}
          >
            Приглашения
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "purchases" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#1F1F1F] dark:text-white">Получайте баллы за покупки</h3>

            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="bg-[#F5F5F7] dark:bg-[#333333] p-2 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-[#D3DF3D]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#1F1F1F] dark:text-white mb-1">Покупка шин</h4>
                  <p className="text-xs text-[#666666] dark:text-[#BBBBBB] mb-2">
                    Получайте до 5% от стоимости покупки в виде баллов при покупке шин
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#D3DF3D]">+5% баллов</span>
                    <span className="text-[10px] text-[#666666] dark:text-[#BBBBBB]">от суммы покупки</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="bg-[#F5F5F7] dark:bg-[#333333] p-2 rounded-lg">
                  <Car className="h-6 w-6 text-[#D3DF3D]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#1F1F1F] dark:text-white mb-1">Покупка дисков</h4>
                  <p className="text-xs text-[#666666] dark:text-[#BBBBBB] mb-2">
                    Получайте до 3% от стоимости покупки в виде баллов при покупке дисков
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#D3DF3D]">+3% баллов</span>
                    <span className="text-[10px] text-[#666666] dark:text-[#BBBBBB]">от суммы покупки</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="bg-[#F5F5F7] dark:bg-[#333333] p-2 rounded-lg">
                  <Tool className="h-6 w-6 text-[#D3DF3D]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#1F1F1F] dark:text-white mb-1">Покупка аксессуаров</h4>
                  <p className="text-xs text-[#666666] dark:text-[#BBBBBB] mb-2">
                    Получайте до 7% от стоимости покупки в виде баллов при покупке аксессуаров
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#D3DF3D]">+7% баллов</span>
                    <span className="text-[10px] text-[#666666] dark:text-[#BBBBBB]">от суммы покупки</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#1F1F1F] dark:text-white">
              Получайте баллы за использование сервисов
            </h3>

            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icons8-%D0%BC%D0%B5%D0%B4%D0%B8%D1%86%D0%B8%D0%BD%D1%81%D0%BA%D0%B0%D1%8F-%D1%81%D1%82%D1%80%D0%B0%D1%85%D0%BE%D0%B2%D0%BA%D0%B0-64-UUmqQQtBJBW0NBUk128xDTr2Jk3xZ8.png"
                    alt="Insurance"
                    width={40}
                    height={40}
                    className="object-contain rounded-lg"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#1F1F1F] dark:text-white">Оформить каско</h4>
                    <p className="text-xs text-[#666666] dark:text-[#BBBBBB]">
                      Оформите страховку через наше приложение
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#D3DF3D]">+500</span>
                  <p className="text-[10px] text-[#666666] dark:text-[#BBBBBB]">баллов</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icons8-%D0%BF%D1%80%D0%B8%D0%B1%D0%BE%D1%80%D0%BD%D0%B0%D1%8F-%D0%BF%D0%B0%D0%BD%D0%B5%D0%BB%D1%8C-64-ikcZeVGrx32S5n3tqrl87GqQqPTtoM.png"
                    alt="Car History"
                    width={40}
                    height={40}
                    className="object-contain rounded-lg"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#1F1F1F] dark:text-white">История авто</h4>
                    <p className="text-xs text-[#666666] dark:text-[#BBBBBB]">
                      Проверьте историю автомобиля перед покупкой
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#D3DF3D]">+100</span>
                  <p className="text-[10px] text-[#666666] dark:text-[#BBBBBB]">баллов</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icons8-%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%BE%D0%B9%D0%BA%D0%B0-96-keauW6C5gO1UfiwXz7TIuDrmUqzR5V.png"
                    alt="Car Wash"
                    width={40}
                    height={40}
                    className="object-contain rounded-lg"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#1F1F1F] dark:text-white">Помыть авто</h4>
                    <p className="text-xs text-[#666666] dark:text-[#BBBBBB]">
                      Запишитесь на мойку через наше приложение
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#D3DF3D]">+150</span>
                  <p className="text-[10px] text-[#666666] dark:text-[#BBBBBB]">баллов</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activities" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#1F1F1F] dark:text-white">Получайте баллы за активности</h3>

            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="bg-[#F5F5F7] dark:bg-[#333333] p-2 rounded-lg">
                  <Calendar className="h-6 w-6 text-[#D3DF3D]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#1F1F1F] dark:text-white mb-1">Ежедневный вход</h4>
                  <p className="text-xs text-[#666666] dark:text-[#BBBBBB] mb-2">
                    Заходите в приложение каждый день и получайте баллы
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#D3DF3D]">+5 баллов</span>
                    <span className="text-[10px] text-[#666666] dark:text-[#BBBBBB]">ежедневно</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="bg-[#F5F5F7] dark:bg-[#333333] p-2 rounded-lg">
                  <Check className="h-6 w-6 text-[#D3DF3D]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#1F1F1F] dark:text-white mb-1">Оставить отзыв</h4>
                  <p className="text-xs text-[#666666] dark:text-[#BBBBBB] mb-2">
                    Оставьте отзыв о купленном товаре или услуге
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#D3DF3D]">+50 баллов</span>
                    <span className="text-[10px] text-[#666666] dark:text-[#BBBBBB]">за каждый отзыв</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="bg-[#F5F5F7] dark:bg-[#333333] p-2 rounded-lg">
                  <Gift className="h-6 w-6 text-[#D3DF3D]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#1F1F1F] dark:text-white mb-1">День рождения</h4>
                  <p className="text-xs text-[#666666] dark:text-[#BBBBBB] mb-2">
                    Получите подарок в день вашего рождения
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#D3DF3D]">+200 баллов</span>
                    <span className="text-[10px] text-[#666666] dark:text-[#BBBBBB]">ежегодно</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "referrals" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#1F1F1F] dark:text-white">Приглашайте друзей и получайте баллы</h3>

            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#F5F5F7] dark:bg-[#333333] p-2 rounded-full">
                    <span className="text-lg font-bold text-[#D3DF3D]">1</span>
                  </div>
                  <p className="text-sm text-[#1F1F1F] dark:text-white">
                    Поделитесь своим реферальным кодом с друзьями
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-[#F5F5F7] dark:bg-[#333333] p-2 rounded-full">
                    <span className="text-lg font-bold text-[#D3DF3D]">2</span>
                  </div>
                  <p className="text-sm text-[#1F1F1F] dark:text-white">Друг регистрируется по вашему коду</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-[#F5F5F7] dark:bg-[#333333] p-2 rounded-full">
                    <span className="text-lg font-bold text-[#D3DF3D]">3</span>
                  </div>
                  <p className="text-sm text-[#1F1F1F] dark:text-white">Друг совершает первую покупку</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-[#F5F5F7] dark:bg-[#333333] p-2 rounded-full">
                    <span className="text-lg font-bold text-[#D3DF3D]">4</span>
                  </div>
                  <p className="text-sm text-[#1F1F1F] dark:text-white">
                    Вы получаете 300 баллов, а ваш друг — 150 баллов
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-[#F5F5F7] dark:bg-[#333333] rounded-lg">
                <p className="text-xs text-[#666666] dark:text-[#BBBBBB] mb-2">Ваш реферальный код:</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#1F1F1F] dark:text-white">TIRE2025</span>
                  <button className="px-3 py-1 bg-[#D3DF3D] text-[#1F1F1F] text-xs font-medium rounded-lg">
                    Скопировать
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#D3DF3D]/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#1F1F1F] dark:text-white mb-1">Приглашено друзей:</h4>
                  <p className="text-xs text-[#666666] dark:text-[#BBBBBB]">Заработано баллов:</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#1F1F1F] dark:text-white">3</span>
                  <p className="text-xs font-bold text-[#D3DF3D]">900</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rules Section */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
          <h3 className="text-base font-bold text-[#1F1F1F] dark:text-white mb-3">Правила программы</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="mt-1 flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D3DF3D]"></div>
              </div>
              <p className="text-xs text-[#666666] dark:text-[#BBBBBB]">
                Баллы действительны в течение 12 месяцев с момента начисления
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D3DF3D]"></div>
              </div>
              <p className="text-xs text-[#666666] dark:text-[#BBBBBB]">
                Баллы можно использовать для оплаты до 50% стоимости товаров и услуг
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D3DF3D]"></div>
              </div>
              <p className="text-xs text-[#666666] dark:text-[#BBBBBB]">
                Баллы начисляются в течение 24 часов после совершения покупки
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D3DF3D]"></div>
              </div>
              <p className="text-xs text-[#666666] dark:text-[#BBBBBB]">
                Компания оставляет за собой право изменять условия программы лояльности
              </p>
            </li>
          </ul>

          <Link
            href="/loyalty/rules"
            className="mt-4 flex items-center justify-center w-full py-2 bg-[#F5F5F7] dark:bg-[#333333] rounded-lg text-sm text-[#1F1F1F] dark:text-white"
          >
            Подробные правила <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </main>
  )
}
