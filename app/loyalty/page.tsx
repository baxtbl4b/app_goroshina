"use client"

import { ArrowLeft, Gift, Award, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BottomNavigation from "@/components/bottom-navigation"

export default function LoyaltyPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-4 relative flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
              </Button>
            </Link>
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Программа лояльности</span>
          </div>

          {/* No logo here */}

          <div className="flex items-center gap-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="text-[#1F1F1F] dark:text-white relative">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-[#c4d402] text-[#1F1F1F] text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  2
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-[#1F1F1F] dark:text-white">Ваш статус</h2>
            <span className="text-lg font-bold text-[#c4d402]">350 горошинов</span>
          </div>

          <div className="mt-6 relative">
            <Progress
              value={35}
              className="h-3 bg-[#D9D9DD] dark:bg-[#3A3A3A]"
              indicatorClassName="bg-gradient-to-r from-[#c4d402] to-[#009CFF]"
            />

            <div className="flex justify-between mt-2">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#c4d402] flex items-center justify-center">
                  <Award className="w-4 h-4 text-[#1F1F1F]" />
                </div>
                <span className="text-xs font-medium mt-1 text-[#1F1F1F] dark:text-white">Бронза</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">0</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#c4d402] flex items-center justify-center">
                  <Award className="w-4 h-4 text-[#1F1F1F]" />
                </div>
                <span className="text-xs font-medium mt-1 text-[#1F1F1F] dark:text-white">Серебро</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">300</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#D9D9DD] dark:bg-[#3A3A3A] flex items-center justify-center">
                  <Award className="w-4 h-4 text-[#1F1F1F] dark:text-white" />
                </div>
                <span className="text-xs font-medium mt-1 text-[#1F1F1F] dark:text-white">Золото</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">1000</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#D9D9DD] dark:bg-[#3A3A3A] flex items-center justify-center">
                  <Award className="w-4 h-4 text-[#1F1F1F] dark:text-white" />
                </div>
                <span className="text-xs font-medium mt-1 text-[#1F1F1F] dark:text-white">Платина</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">2500</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 bg-[#1F1F1F] dark:bg-[#333333] rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#c4d402] flex items-center justify-center">
                <Award className="w-6 h-6 text-[#1F1F1F]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Серебряный статус</h3>
                <p className="text-xs text-gray-300">Кешбэк 3% баллами</p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-300">Бесплатная доставка</span>
                <span className="text-xs text-[#c4d402]">Доступно</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-300">Скидка на шиномонтаж</span>
                <span className="text-xs text-[#c4d402]">5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-300">Доступ к акциям</span>
                <span className="text-xs text-[#c4d402]">Базовый</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-[#1F1F1F] dark:text-white">
              До золотого статуса осталось <span className="font-bold text-[#c4d402]">650 горошинов</span>
            </p>
          </div>
        </div>

        <Tabs defaultValue="rewards" className="w-full">
          <TabsList className="w-full bg-[#1F1F1F] rounded-xl p-1">
            <TabsTrigger
              value="rewards"
              className="rounded-lg text-white data-[state=active]:bg-[#009CFF] data-[state=active]:text-white"
            >
              Призы
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-lg text-white data-[state=active]:bg-[#009CFF] data-[state=active]:text-white"
            >
              История
            </TabsTrigger>
            <TabsTrigger
              value="rules"
              className="rounded-lg text-white data-[state=active]:bg-[#009CFF] data-[state=active]:text-white"
            >
              Правила
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rewards" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-3 shadow-sm">
                <div className="flex justify-center mb-3">
                  <div className="relative w-20 h-20">
                    <Image
                      src="/placeholder.svg?height=80&width=80"
                      alt="Скидка 500₽"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                    <div className="absolute -top-2 -right-2 bg-[#c4d402] text-[#1F1F1F] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      <Gift className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                <h3 className="font-medium text-center text-[#1F1F1F] dark:text-white">Скидка 500₽</h3>
                <div className="flex justify-center mt-2">
                  <Button className="bg-[#c4d402] hover:bg-[#c4d402]/80 text-[#1F1F1F] text-xs font-semibold px-3 py-1 h-auto">
                    200 горошинов
                  </Button>
                </div>
              </div>

              <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-3 shadow-sm">
                <div className="flex justify-center mb-3">
                  <div className="relative w-20 h-20">
                    <Image
                      src="/placeholder.svg?height=80&width=80"
                      alt="Бесплатный шиномонтаж"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                    <div className="absolute -top-2 -right-2 bg-[#c4d402] text-[#1F1F1F] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      <Gift className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                <h3 className="font-medium text-center text-[#1F1F1F] dark:text-white">Бесплатный шиномонтаж</h3>
                <div className="flex justify-center mt-2">
                  <Button className="bg-[#c4d402] hover:bg-[#c4d402]/80 text-[#1F1F1F] text-xs font-semibold px-3 py-1 h-auto">
                    500 горошинов
                  </Button>
                </div>
              </div>

              <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-3 shadow-sm">
                <div className="flex justify-center mb-3">
                  <div className="relative w-20 h-20">
                    <Image
                      src="/placeholder.svg?height=80&width=80"
                      alt="Скидка 15%"
                      width={80}
                      height={80}
                      className="object-contain opacity-50"
                    />
                    <div className="absolute -top-2 -right-2 bg-[#D9D9DD] dark:bg-[#3A3A3A] text-[#1F1F1F] dark:text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      <Gift className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                <h3 className="font-medium text-center text-[#1F1F1F] dark:text-white opacity-50">Скидка 15%</h3>
                <div className="flex justify-center mt-2">
                  <Button disabled className="bg-[#D9D9DD] text-[#1F1F1F] text-xs font-semibold px-3 py-1 h-auto">
                    1000 горошинов
                  </Button>
                </div>
              </div>

              <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-3 shadow-sm">
                <div className="flex justify-center mb-3">
                  <div className="relative w-20 h-20">
                    <Image
                      src="/placeholder.svg?height=80&width=80"
                      alt="Комплект дисков"
                      width={80}
                      height={80}
                      className="object-contain opacity-50"
                    />
                    <div className="absolute -top-2 -right-2 bg-[#D9D9DD] dark:bg-[#3A3A3A] text-[#1F1F1F] dark:text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      <Gift className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                <h3 className="font-medium text-center text-[#1F1F1F] dark:text-white opacity-50">Комплект дисков</h3>
                <div className="flex justify-center mt-2">
                  <Button disabled className="bg-[#D9D9DD] text-[#1F1F1F] text-xs font-semibold px-3 py-1 h-auto">
                    2500 горошинов
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-[#D9D9DD] dark:border-[#3A3A3A]">
                  <div>
                    <p className="font-medium text-[#1F1F1F] dark:text-white">Начисление за заказ</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">15.04.2023</p>
                  </div>
                  <span className="text-[#c4d402] font-bold">+125 горошинов</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#D9D9DD] dark:border-[#3A3A3A]">
                  <div>
                    <p className="font-medium text-[#1F1F1F] dark:text-white">Списание на скидку</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">10.03.2023</p>
                  </div>
                  <span className="text-[#1F1F1F] dark:text-white font-bold">-200 горошинов</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#D9D9DD] dark:border-[#3A3A3A]">
                  <div>
                    <p className="font-medium text-[#1F1F1F] dark:text-white">Начисление за заказ</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">03.03.2023</p>
                  </div>
                  <span className="text-[#c4d402] font-bold">+250 горошинов</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-[#1F1F1F] dark:text-white">Приветственный бонус</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">15.01.2023</p>
                  </div>
                  <span className="text-[#c4d402] font-bold">+100 горошинов</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="mt-4">
            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4">
              <h3 className="font-bold text-[#1F1F1F] dark:text-white mb-3">Правила программы лояльности</h3>
              <div className="space-y-3 text-sm text-[#1F1F1F] dark:text-gray-300">
                <p>1. За каждые потраченные 1000 ₽ вы получаете баллы в зависимости от вашего статуса:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Бронзовый: 2% (20 баллов)</li>
                  <li>Серебряный: 3% (30 баллов)</li>
                  <li>Золотой: 5% (50 баллов)</li>
                  <li>Платиновый: 7% (70 баллов)</li>
                </ul>
                <p>2. Баллы можно использовать для получения скидок и подарков из каталога призов.</p>
                <p>3. 1 горошин = 1 рубль при использовании для скидки.</p>
                <p>4. Горошины действуют в течение 12 месяцев с момента начисления.</p>
                <p>5. Статус присваивается на основании суммы покупок за последние 12 месяцев:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Бронзовый: 0 - 29 999 ₽</li>
                  <li>Серебряный: 30 000 - 99 999 ₽</li>
                  <li>Золотой: 100 000 - 249 999 ₽</li>
                  <li>Платиновый: от 250 000 ₽</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </main>
  )
}
