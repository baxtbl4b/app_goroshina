import { ArrowLeft, Calendar, Car, ChevronRight, Edit, PenToolIcon as Tool, Wrench, Sun, Snowflake } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CarDetailsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/account">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
              </Button>
            </Link>
          </div>
          <span className="flex-1 text-lg font-semibold text-[#1F1F1F] dark:text-white text-left">
            Информация об автомобиле
          </span>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Car className="h-6 w-6 text-[#009CFF]" />
              <h3 className="font-bold text-[#1F1F1F] dark:text-white">Toyota Camry</h3>
            </div>
            <Badge className="bg-[#D3DF3D] text-[#1F1F1F]">Основной</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Год выпуска:</span>
              <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">2019</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Гос. номер:</span>
              <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">А123БВ777</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">VIN:</span>
              <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">JTNBV58E50J012345</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Пробег:</span>
              <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">45 320 км</span>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Link href="/account/cars/1/edit">
              <Button variant="outline" size="sm" className="h-8 text-[#009CFF] border-[#009CFF]">
                <Edit className="h-4 w-4 mr-1" /> Редактировать
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Tool className="h-6 w-6 text-[#009CFF]" />
              <h3 className="font-bold text-[#1F1F1F] dark:text-white">Шины</h3>
            </div>
          </div>

          <Tabs defaultValue="summer" className="w-full">
            <TabsList className="w-full flex gap-3 mb-4 bg-transparent p-0 h-auto">
              <TabsTrigger
                value="summer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 data-[state=active]:border-[#D3DF3D] data-[state=active]:bg-[#D3DF3D]/10 dark:data-[state=active]:bg-[#D3DF3D]/20 border-[#D9D9DD] dark:border-[#3A3A3A] h-auto"
              >
                <Sun className="h-5 w-5 text-[#D3DF3D]" />
                <span className="font-medium text-[#1F1F1F] dark:text-white">Летние</span>
              </TabsTrigger>
              <TabsTrigger
                value="winter"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 data-[state=active]:border-[#009CFF] data-[state=active]:bg-[#009CFF]/10 dark:data-[state=active]:bg-[#009CFF]/20 border-[#D9D9DD] dark:border-[#3A3A3A] h-auto"
              >
                <Snowflake className="h-5 w-5 text-[#009CFF]" />
                <span className="font-medium text-[#1F1F1F] dark:text-white">Зимние</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summer" className="mt-0">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Марка:</span>
                  <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">Michelin Pilot Sport 4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Размер:</span>
                  <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">225/45 R17</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Диски:</span>
                  <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">R17 литые</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Дата установки:</span>
                  <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">15.04.2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Статус:</span>
                  <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-[#D3DF3D]/20 text-[#D3DF3D]">
                    Установлены
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Состояние:</span>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-[#D3DF3D] text-[#1F1F1F]">
                      4
                    </div>
                    <span className="text-sm font-medium text-[#1F1F1F] dark:text-white ml-2">Хорошее</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="winter" className="mt-0">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Марка:</span>
                  <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">Nokian Hakkapeliitta R3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Размер:</span>
                  <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">225/45 R17</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Диски:</span>
                  <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">R17 литые</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Статус:</span>
                  <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-[#009CFF]/20 text-[#009CFF]">
                    На хранении
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Состояние:</span>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-[#D3DF3D] text-[#1F1F1F]">
                      4
                    </div>
                    <span className="text-sm font-medium text-[#1F1F1F] dark:text-white ml-2">Хорошее</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-4 flex justify-end">
            <Link href="/account/cars/1/tires">
              <Button variant="outline" size="sm" className="h-8 text-[#009CFF] border-[#009CFF]">
                <Edit className="h-4 w-4 mr-1" /> Редактировать
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-[#009CFF]" />
              <h3 className="font-bold text-[#1F1F1F] dark:text-white">Хранение</h3>
            </div>
            <span className="text-sm font-medium px-3 py-1 bg-[#D3DF3D] text-[#1F1F1F] rounded-full">Активно</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Номер договора:</span>
              <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">ХШ-2023/0458</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Предмет хранения:</span>
              <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">Комплект зимних шин с дисками</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Период хранения:</span>
              <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">15.10.2023 - 15.04.2024</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Состояние:</span>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-[#D3DF3D] text-[#1F1F1F]">
                  4
                </div>
                <span className="text-sm font-medium text-[#1F1F1F] dark:text-white ml-2">Хорошее</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Link href="/account/cars/1/storage">
              <Button variant="outline" size="sm" className="h-8 text-[#009CFF] border-[#009CFF]">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Wrench className="h-6 w-6 text-[#009CFF]" />
              <h3 className="font-bold text-[#1F1F1F] dark:text-white">Расходы на обслуживание</h3>
            </div>
            <span className="text-lg font-bold text-[#1F1F1F] dark:text-white">78 500 ₽</span>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-[#D3DF3D] mr-2"></div>
              <span className="flex-1 text-[#1F1F1F] dark:text-gray-300">Шины и диски</span>
              <span className="font-medium text-[#1F1F1F] dark:text-white">32 600 ₽</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-[#009CFF] mr-2"></div>
              <span className="flex-1 text-[#1F1F1F] dark:text-gray-300">Техобслуживание</span>
              <span className="font-medium text-[#1F1F1F] dark:text-white">25 900 ₽</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
              <span className="flex-1 text-[#1F1F1F] dark:text-gray-300">Прочие расходы</span>
              <span className="font-medium text-[#1F1F1F] dark:text-white">20 000 ₽</span>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Link href="/account/cars/1/expenses">
              <Button variant="outline" size="sm" className="h-8 text-[#009CFF] border-[#009CFF]">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="history" className="w-full">
          <TabsList className="w-full bg-[#1F1F1F] rounded-xl p-1">
            <TabsTrigger
              value="history"
              className="rounded-lg text-white data-[state=active]:bg-[#009CFF] data-[state=active]:text-white"
            >
              История обслуживания
            </TabsTrigger>
            <TabsTrigger
              value="reminders"
              className="rounded-lg text-white data-[state=active]:bg-[#009CFF] data-[state=active]:text-white"
            >
              Напоминания
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-4 space-y-3">
            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#D3DF3D] mr-2"></div>
                  <span className="font-medium text-[#1F1F1F] dark:text-white">Замена шин</span>
                </div>
                <span className="text-sm text-[#1F1F1F] dark:text-gray-300">15.04.2023</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Пробег: 45 000 км</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#D9D9DD] dark:border-[#3A3A3A]">
                <p className="text-sm text-[#1F1F1F] dark:text-white">Замена летних шин Michelin Pilot Sport 4</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#009CFF] mr-2"></div>
                  <span className="font-medium text-[#1F1F1F] dark:text-white">ТО-2</span>
                </div>
                <span className="text-sm text-[#1F1F1F] dark:text-gray-300">10.03.2023</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Пробег: 40 000 км</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#D9D9DD] dark:border-[#3A3A3A]">
                <p className="text-sm text-[#1F1F1F] dark:text-white">Замена масла, фильтров и тормозных колодок</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                  <span className="font-medium text-[#1F1F1F] dark:text-white">Мойка и химчистка</span>
                </div>
                <span className="text-sm text-[#1F1F1F] dark:text-gray-300">05.02.2023</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Пробег: 38 500 км</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#D9D9DD] dark:border-[#3A3A3A]">
                <p className="text-sm text-[#1F1F1F] dark:text-white">Комплексная мойка и химчистка салона</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reminders" className="mt-4 space-y-3">
            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#009CFF] mr-2"></div>
                  <span className="font-medium text-[#1F1F1F] dark:text-white">ТО-3</span>
                </div>
                <span className="text-sm text-red-500">Через 2 000 км</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Рекомендуемый пробег: 60 000 км</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#D3DF3D] mr-2"></div>
                  <span className="font-medium text-[#1F1F1F] dark:text-white">Замена зимних шин</span>
                </div>
                <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Ноябрь 2023</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Сезонная замена</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
