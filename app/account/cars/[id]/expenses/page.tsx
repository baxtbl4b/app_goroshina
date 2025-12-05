"use client"

import { ArrowLeft, Calendar, Car, Plus, PenToolIcon as Tool, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

// Mock data for yearly expenses chart
const monthlyExpenses = [
  { month: "Янв", amount: 5200 },
  { month: "Фев", amount: 6500 },
  { month: "Мар", amount: 25900 },
  { month: "Апр", amount: 32600 },
  { month: "Май", amount: 3200 },
  { month: "Июн", amount: 4800 },
  { month: "Июл", amount: 2100 },
  { month: "Авг", amount: 7300 },
  { month: "Сен", amount: 1900 },
  { month: "Окт", amount: 8400 },
  { month: "Ноя", amount: 5600 },
  { month: "Дек", amount: 12800 },
]

const maxAmount = Math.max(...monthlyExpenses.map((item) => item.amount))

function ExpenseChart() {
  return (
    <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-[#009CFF]" />
        <h3 className="font-bold text-[#1F1F1F] dark:text-white">Расходы за год</h3>
      </div>

      <div className="space-y-3">
        {monthlyExpenses.map((item, index) => {
          const percentage = (item.amount / maxAmount) * 100
          const isHighExpense = item.amount > 15000

          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-8 text-xs text-[#1F1F1F] dark:text-gray-300 font-medium">{item.month}</div>
              <div className="flex-1 relative">
                <div className="w-full bg-[#D9D9DD] dark:bg-[#3a3a3a] rounded-full h-6 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isHighExpense ? "bg-[#D3DF3D]" : "bg-[#009CFF]"
                    }`}
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-end pr-2">
                    <span className="text-xs font-medium text-[#1F1F1F] dark:text-white">
                      {item.amount.toLocaleString()} ₽
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-[#D9D9DD] dark:border-[#3a3a3a]">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Среднемесячные расходы:</span>
          <span className="font-bold text-[#1F1F1F] dark:text-white">
            {Math.round(monthlyExpenses.reduce((sum, item) => sum + item.amount, 0) / 12).toLocaleString()} ₽
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Максимальные расходы:</span>
          <span className="font-bold text-[#D3DF3D]">{maxAmount.toLocaleString()} ₽</span>
        </div>
      </div>
    </div>
  )
}

export default function CarExpensesPage() {
  const router = useRouter()
  return (
    <main className="flex flex-col min-h-screen bg-[#121212] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-[#1f1f1f] dark:bg-[#1f1f1f] p-4 shadow-sm">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5 text-[#1F1F1F] text-white" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Расходы на автомобиль</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Car className="h-6 w-6 text-[#009CFF]" />
            <h3 className="font-bold text-[#1F1F1F] dark:text-white">Toyota Camry • А123БВ777</h3>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">
                Пробег на начало пользования приложением:
              </span>
              <span className="font-medium text-[#1F1F1F] dark:text-white">45 000 км</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Текущий пробег:</span>
              <span className="font-medium text-[#1F1F1F] dark:text-white">52 300 км</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Средняя стоимость за 1км пути:</span>
              <span className="font-medium text-[#1F1F1F] bg-[#d3df3d] px-2 py-1 rounded">10.75 ₽/км</span>
            </div>
          </div>

          <div className="border-t border-[#D9D9DD] dark:border-[#3a3a3a] pt-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Tool className="h-5 w-5 text-[#D3DF3D] mr-2" />
                <span className="text-sm font-medium text-[#1F1F1F] dark:text-gray-300">Общие расходы:</span>
              </div>
              <span className="text-lg font-bold text-[#1F1F1F] dark:text-white">78 500 ₽</span>
            </div>
          </div>
        </div>

        {/* Expense Chart */}
        <ExpenseChart />

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full bg-[#1F1F1F] rounded-xl p-1">
            <TabsTrigger
              value="all"
              className="rounded-lg text-white data-[state=active]:bg-[#009CFF] data-[state=active]:text-white"
            >
              Все
            </TabsTrigger>
            <TabsTrigger
              value="tires"
              className="rounded-lg text-white data-[state=active]:bg-[#009CFF] data-[state=active]:text-white"
            >
              Шины и диски
            </TabsTrigger>
            <TabsTrigger
              value="service"
              className="rounded-lg text-white data-[state=active]:bg-[#009CFF] data-[state=active]:text-white"
            >
              Техобслуживание
            </TabsTrigger>
            <TabsTrigger
              value="other"
              className="rounded-lg text-white data-[state=active]:bg-[#009CFF] data-[state=active]:text-white"
            >
              Прочее
            </TabsTrigger>
            <TabsTrigger
              value="fuel"
              className="rounded-lg text-white data-[state=active]:bg-[#009CFF] data-[state=active]:text-white"
            >
              Заправка
            </TabsTrigger>
            <TabsTrigger
              value="insurance"
              className="rounded-lg text-white data-[state=active]:bg-[#009CFF] data-[state=active]:text-white"
            >
              Страховка и налоги
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-3">
            {/* Expense 1 */}
            <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#D3DF3D] mr-2"></div>
                  <span className="font-medium text-[#1F1F1F] dark:text-white">Замена шин</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">15.04.2023</span>
                  <Link href="/account/cars/1/expenses/add?type=tires&name=Замена шин">
                    <Button size="sm" className="h-6 px-2 bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F] text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Добавить
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Шинный центр на ул. Автомобильная, 23А</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#D9D9DD] dark:border-[#3a3a3a]">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Michelin Pilot Sport 4 (комплект)</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">28 600 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Шиномонтаж</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">4 000 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-medium text-[#1F1F1F] dark:text-gray-300">Итого:</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">32 600 ₽</span>
                </div>
              </div>
            </div>

            {/* Expense 2 */}
            <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#009CFF] mr-2"></div>
                  <span className="font-medium text-[#1F1F1F] dark:text-white">ТО-2</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">10.03.2023</span>
                  <Link href="/account/cars/1/expenses/add?type=service&name=ТО-2">
                    <Button size="sm" className="h-6 px-2 bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F] text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Добавить
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Официальный дилер Toyota</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#D9D9DD] dark:border-[#3a3a3a]">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Замена масла и фильтров</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">8 500 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Диагностика</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">3 000 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Замена тормозных колодок</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">14 400 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-medium text-[#1F1F1F] dark:text-gray-300">Итого:</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">25 900 ₽</span>
                </div>
              </div>
            </div>

            {/* Expense 3 */}
            <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                  <span className="font-medium text-[#1F1F1F] dark:text-white">Мойка и химчистка</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">05.02.2023</span>
                  <Link href="/account/cars/1/expenses/add?type=other&name=Мойка и химчистка">
                    <Button size="sm" className="h-6 px-2 bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F] text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Добавить
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Автомойка "Чистый автомобиль"</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#D9D9DD] dark:border-[#3a3a3a]">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Комплексная мойка</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">1 500 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Химчистка салона</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">5 000 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-medium text-[#1F1F1F] dark:text-gray-300">Итого:</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">6 500 ₽</span>
                </div>
              </div>
            </div>

            {/* Fuel expense in all tab */}
            <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="font-medium text-[#1F1F1F] dark:text-white">Заправка</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">20.04.2023</span>
                  <Link href="/account/cars/1/expenses/add?type=fuel&name=Заправка">
                    <Button size="sm" className="h-6 px-2 bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F] text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Добавить
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">АЗС Лукойл</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#D9D9DD] dark:border-[#3a3a3a]">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Бензин АИ-95 (45 л)</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">2 250 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-medium text-[#1F1F1F] dark:text-gray-300">Итого:</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">2 250 ₽</span>
                </div>
              </div>
            </div>

            {/* Insurance expense in all tab */}
            <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span className="font-medium text-[#1F1F1F] dark:text-white">ОСАГО</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">01.01.2023</span>
                  <Link href="/account/cars/1/expenses/add?type=insurance&name=ОСАГО">
                    <Button size="sm" className="h-6 px-2 bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F] text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Добавить
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Страховая компания "Ингосстрах"</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#D9D9DD] dark:border-[#3a3a3a]">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">ОСАГО на 1 год</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">8 500 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Транспортный налог</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">3 200 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-medium text-[#1F1F1F] dark:text-gray-300">Итого:</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">11 700 ₽</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tires" className="mt-4 space-y-3">
            {/* Tire expense */}
            <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#D3DF3D] mr-2"></div>
                  <span className="font-medium text-[#1F1F1F] dark:text-white">Замена шин</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">15.04.2023</span>
                  <Link href="/account/cars/1/expenses/add?type=tires&name=Замена шин">
                    <Button size="sm" className="h-6 px-2 bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F] text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Добавить
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Шинный центр на ул. Автомобильная, 23А</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#D9D9DD] dark:border-[#3a3a3a]">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Michelin Pilot Sport 4 (комплект)</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">28 600 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Шиномонтаж</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">4 000 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-medium text-[#1F1F1F] dark:text-gray-300">Итого:</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">32 600 ₽</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="service" className="mt-4 space-y-3">
            {/* Service expense */}
            <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#009CFF] mr-2"></div>
                  <span className="font-medium text-[#1F1F1F] dark:text-white">ТО-2</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">10.03.2023</span>
                  <Link href="/account/cars/1/expenses/add?type=service&name=ТО-2">
                    <Button size="sm" className="h-6 px-2 bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F] text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Добавить
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Официальный дилер Toyota</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#D9D9DD] dark:border-[#3a3a3a]">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Замена масла и фильтров</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">8 500 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Диагностика</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">3 000 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Замена тормозных колодок</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">14 400 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-medium text-[#1F1F1F] dark:text-gray-300">Итого:</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">25 900 ₽</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="other" className="mt-4 space-y-3">
            {/* Other expense */}
            <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                  <span className="font-medium text-[#1F1F1F] dark:text-white">Мойка и химчистка</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">05.02.2023</span>
                  <Link href="/account/cars/1/expenses/add?type=other&name=Мойка и химчистка">
                    <Button size="sm" className="h-6 px-2 bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F] text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Добавить
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Автомойка "Чистый автомобиль"</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#D9D9DD] dark:border-[#3a3a3a]">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Комплексная мойка</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">1 500 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Химчистка салона</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">5 000 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-medium text-[#1F1F1F] dark:text-gray-300">Итого:</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">6 500 ₽</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fuel" className="mt-4 space-y-3">
            {/* Fuel expense */}
            <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="font-medium text-[#1F1F1F] dark:text-white">Заправка</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">20.04.2023</span>
                  <Link href="/account/cars/1/expenses/add?type=fuel&name=Заправка">
                    <Button size="sm" className="h-6 px-2 bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F] text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Добавить
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">АЗС Лукойл</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#D9D9DD] dark:border-[#3a3a3a]">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Бензин АИ-95 (45 л)</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">2 250 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-medium text-[#1F1F1F] dark:text-gray-300">Итого:</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">2 250 ₽</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insurance" className="mt-4 space-y-3">
            {/* Insurance expense */}
            <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span className="font-medium text-[#1F1F1F] dark:text-white">ОСАГО</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">01.01.2023</span>
                  <Link href="/account/cars/1/expenses/add?type=insurance&name=ОСАГО">
                    <Button size="sm" className="h-6 px-2 bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F] text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Добавить
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Страховая компания "Ингосстрах"</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#D9D9DD] dark:border-[#3a3a3a]">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">ОСАГО на 1 год</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">8 500 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Транспортный налог</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">3 200 ₽</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-medium text-[#1F1F1F] dark:text-gray-300">Итого:</span>
                  <span className="font-bold text-[#1F1F1F] dark:text-white">11 700 ₽</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
