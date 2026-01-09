"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Calendar, Car, ChevronRight, Edit, PenToolIcon as Tool, Wrench, Sun, Snowflake, Trash2 } from "lucide-react"
import Link from "next/link"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingSpinner from "@/components/loading-spinner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CarData {
  id: string
  name: string
  brand: string
  brandSlug?: string
  model: string
  modelSlug?: string
  trim?: string
  trimSlug?: string
  year: string
  plate: string
  mileage: string
  isPrimary: boolean
  hasStorage: boolean
  createdAt: string
  // Летние шины
  summerTires?: string
  summerTireWidth?: string
  summerTireProfile?: string
  summerTireDiameter?: string
  summerRearTireWidth?: string
  summerRearTireProfile?: string
  summerRearTireDiameter?: string
  summerHasStaggered?: boolean
  // Зимние шины
  winterTires?: string
  winterTireWidth?: string
  winterTireProfile?: string
  winterTireDiameter?: string
  winterRearTireWidth?: string
  winterRearTireProfile?: string
  winterRearTireDiameter?: string
  winterHasStaggered?: boolean
}

export default function CarDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const carId = params.id as string

  const [car, setCar] = useState<CarData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCar = () => {
      try {
        const storedCars = JSON.parse(localStorage.getItem("userCars") || "[]")
        const foundCar = storedCars.find((c: CarData) => c.id === carId)
        setCar(foundCar || null)
      } catch (error) {
        console.error("Ошибка при загрузке автомобиля:", error)
      } finally {
        setLoading(false)
      }
    }
    loadCar()
  }, [carId])

  const handleDelete = () => {
    try {
      const storedCars = JSON.parse(localStorage.getItem("userCars") || "[]")
      const updatedCars = storedCars.filter((c: CarData) => c.id !== carId)
      localStorage.setItem("userCars", JSON.stringify(updatedCars))
      window.dispatchEvent(new CustomEvent("userCarsUpdated"))
      router.push("/account/cars")
    } catch (error) {
      console.error("Ошибка при удалении автомобиля:", error)
    }
  }

  const handleSetPrimary = () => {
    try {
      const storedCars = JSON.parse(localStorage.getItem("userCars") || "[]")
      const updatedCars = storedCars.map((c: CarData) => ({
        ...c,
        isPrimary: c.id === carId
      }))
      localStorage.setItem("userCars", JSON.stringify(updatedCars))
      setCar(prev => prev ? { ...prev, isPrimary: true } : null)
    } catch (error) {
      console.error("Ошибка при установке основного автомобиля:", error)
    }
  }

  // Форматирование размера шин
  const formatTireSize = (width?: string, profile?: string, diameter?: string) => {
    if (!width || !profile || !diameter) return "Не указано"
    return `${width}/${profile} R${diameter}`
  }

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen bg-[#121212]">
        <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
          <div className="h-full px-2 flex items-center">
            <BackButton />
            <span className="text-lg font-semibold text-white">Загрузка...</span>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#009CFF]"></div>
        </div>
      </main>
    )
  }

  if (!car) {
    return (
      <main className="flex flex-col min-h-screen bg-[#121212]">
        <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
          <div className="h-full px-2 flex items-center">
            <BackButton />
            <span className="text-lg font-semibold text-white">Автомобиль не найден</span>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Car className="w-16 h-16 text-gray-600 mb-4" />
          <p className="text-gray-400 text-center mb-4">Автомобиль не найден или был удалён</p>
          <Link href="/account/cars">
            <Button className="bg-[#c4d402] text-[#1F1F1F] hover:bg-[#c4d402]/90 rounded-xl">
              Вернуться к списку
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  const hasSummerTires = car.summerTireWidth && car.summerTireProfile && car.summerTireDiameter
  const hasWinterTires = car.winterTireWidth && car.winterTireProfile && car.winterTireDiameter

  return (
    <main className="flex flex-col min-h-screen bg-[#121212]">
      <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-2 flex items-center justify-between">
          <div className="flex items-center">
            <BackButton />
            <span className="text-lg font-semibold text-white truncate">
              {car.brand} {car.model}
            </span>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/10">
                <Trash2 className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#2A2A2A] border-gray-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Удалить автомобиль?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  Вы уверены, что хотите удалить {car.brand} {car.model}? Это действие нельзя отменить.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-[#1F1F1F] text-white border-gray-700 hover:bg-[#333]">
                  Отмена
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Удалить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-4 pb-20">
        {/* Car Info Card */}
        <div className="bg-[#2A2A2A] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#009CFF]/20 to-[#c4d402]/20 flex items-center justify-center">
                <Car className="h-6 w-6 text-[#009CFF]" />
              </div>
              <div>
                <h3 className="font-bold text-white">{car.brand} {car.model}</h3>
                {car.trim && <p className="text-sm text-gray-400">{car.trim}</p>}
              </div>
            </div>
            {car.isPrimary && (
              <Badge className="bg-[#c4d402]/20 text-[#c4d402]">Основной</Badge>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Год выпуска</span>
              <span className="text-sm font-medium text-white">{car.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Гос. номер</span>
              <span className="text-sm font-medium text-white">{car.plate || "Не указан"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Пробег</span>
              <span className="text-sm font-medium text-white">{car.mileage || "Не указан"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Добавлен</span>
              <span className="text-sm font-medium text-white">
                {car.createdAt ? new Date(car.createdAt).toLocaleDateString("ru-RU") : "—"}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
            {!car.isPrimary && (
              <Button
                onClick={handleSetPrimary}
                variant="outline"
                size="sm"
                className="flex-1 h-10 text-[#c4d402] border-[#c4d402]/30 hover:bg-[#c4d402]/10 rounded-xl"
              >
                Сделать основным
              </Button>
            )}
            <Link href={`/account/cars/${car.id}/edit`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full h-10 text-[#009CFF] border-[#009CFF]/30 hover:bg-[#009CFF]/10 rounded-xl">
                <Edit className="h-4 w-4 mr-2" /> Редактировать
              </Button>
            </Link>
          </div>
        </div>

        {/* Tires Info Card */}
        <div className="bg-[#2A2A2A] rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#009CFF]/20 flex items-center justify-center">
              <Tool className="h-5 w-5 text-[#009CFF]" />
            </div>
            <h3 className="font-bold text-white">Шины</h3>
          </div>

          {(hasSummerTires || hasWinterTires) ? (
            <Tabs defaultValue={hasSummerTires ? "summer" : "winter"} className="w-full">
              <TabsList className="w-full flex gap-3 mb-4 bg-transparent p-0 h-auto">
                <TabsTrigger
                  value="summer"
                  disabled={!hasSummerTires}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 data-[state=active]:border-[#c4d402] data-[state=active]:bg-[#c4d402]/10 border-gray-700 disabled:opacity-50 h-auto"
                >
                  <Sun className="h-5 w-5 text-[#c4d402]" />
                  <span className="font-medium text-white">Летние</span>
                </TabsTrigger>
                <TabsTrigger
                  value="winter"
                  disabled={!hasWinterTires}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 data-[state=active]:border-[#009CFF] data-[state=active]:bg-[#009CFF]/10 border-gray-700 disabled:opacity-50 h-auto"
                >
                  <Snowflake className="h-5 w-5 text-[#009CFF]" />
                  <span className="font-medium text-white">Зимние</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summer" className="mt-0 space-y-3">
                {car.summerHasStaggered ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Передняя ось</span>
                      <span className="text-sm font-medium text-white">
                        {formatTireSize(car.summerTireWidth, car.summerTireProfile, car.summerTireDiameter)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Задняя ось</span>
                      <span className="text-sm font-medium text-white">
                        {formatTireSize(car.summerRearTireWidth, car.summerRearTireProfile, car.summerRearTireDiameter)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Размер</span>
                    <span className="text-sm font-medium text-white">
                      {formatTireSize(car.summerTireWidth, car.summerTireProfile, car.summerTireDiameter)}
                    </span>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="winter" className="mt-0 space-y-3">
                {car.winterHasStaggered ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Передняя ось</span>
                      <span className="text-sm font-medium text-white">
                        {formatTireSize(car.winterTireWidth, car.winterTireProfile, car.winterTireDiameter)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Задняя ось</span>
                      <span className="text-sm font-medium text-white">
                        {formatTireSize(car.winterRearTireWidth, car.winterRearTireProfile, car.winterRearTireDiameter)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Размер</span>
                    <span className="text-sm font-medium text-white">
                      {formatTireSize(car.winterTireWidth, car.winterTireProfile, car.winterTireDiameter)}
                    </span>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400 mb-4">Информация о шинах не указана</p>
              <Link href={`/account/cars/${car.id}/edit`}>
                <Button className="bg-[#009CFF] text-white hover:bg-[#009CFF]/90 rounded-xl">
                  Добавить информацию
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Storage Card */}
        <div className="bg-[#2A2A2A] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c4d402]/20 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-[#c4d402]" />
              </div>
              <h3 className="font-bold text-white">Хранение шин</h3>
            </div>
            {car.hasStorage ? (
              <Badge className="bg-[#c4d402]/20 text-[#c4d402]">Активно</Badge>
            ) : (
              <Badge className="bg-gray-700 text-gray-400">Нет</Badge>
            )}
          </div>

          {car.hasStorage ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Статус</span>
                <span className="text-sm font-medium text-[#c4d402]">На хранении</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm mb-3">Услуга хранения не активна</p>
              <Link href="/tire-storage">
                <Button size="sm" className="bg-[#c4d402] text-[#1F1F1F] hover:bg-[#c4d402]/90 rounded-xl">
                  Оформить хранение
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Expenses Card */}
        <div className="bg-[#2A2A2A] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#009CFF]/20 flex items-center justify-center">
                <Wrench className="h-5 w-5 text-[#009CFF]" />
              </div>
              <h3 className="font-bold text-white">Расходы на обслуживание</h3>
            </div>
            <span className="text-lg font-bold text-white">78 500 ₽</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-[#c4d402] mr-2"></div>
              <span className="flex-1 text-gray-400">Шины и диски</span>
              <span className="font-medium text-white">32 600 ₽</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-[#009CFF] mr-2"></div>
              <span className="flex-1 text-gray-400">Техобслуживание</span>
              <span className="font-medium text-white">25 900 ₽</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
              <span className="flex-1 text-gray-400">Прочие расходы</span>
              <span className="font-medium text-white">20 000 ₽</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <Link href={`/account/cars/${car.id}/expenses`}>
              <Button variant="outline" size="sm" className="w-full h-10 text-[#009CFF] border-[#009CFF]/30 hover:bg-[#009CFF]/10 rounded-xl">
                Подробнее <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Service History & Reminders Tabs */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="w-full bg-[#1F1F1F] rounded-xl p-1 h-auto">
            <TabsTrigger
              value="history"
              className="flex-1 rounded-lg text-white py-2.5 data-[state=active]:bg-[#009CFF] data-[state=active]:text-white"
            >
              История обслуживания
            </TabsTrigger>
            <TabsTrigger
              value="reminders"
              className="flex-1 rounded-lg text-white py-2.5 data-[state=active]:bg-[#009CFF] data-[state=active]:text-white"
            >
              Напоминания
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-4 space-y-3">
            <div className="bg-[#2A2A2A] rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#c4d402] mr-2"></div>
                  <span className="font-medium text-white">Замена шин</span>
                </div>
                <span className="text-sm text-gray-400">15.04.2023</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Пробег: 45 000 км</span>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-sm text-gray-300">Замена летних шин Michelin Pilot Sport 4</p>
              </div>
            </div>

            <div className="bg-[#2A2A2A] rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#009CFF] mr-2"></div>
                  <span className="font-medium text-white">ТО-2</span>
                </div>
                <span className="text-sm text-gray-400">10.03.2023</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Пробег: 40 000 км</span>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-sm text-gray-300">Замена масла, фильтров и тормозных колодок</p>
              </div>
            </div>

            <div className="bg-[#2A2A2A] rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                  <span className="font-medium text-white">Мойка и химчистка</span>
                </div>
                <span className="text-sm text-gray-400">05.02.2023</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Пробег: 38 500 км</span>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-sm text-gray-300">Комплексная мойка и химчистка салона</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reminders" className="mt-4 space-y-3">
            <div className="bg-[#2A2A2A] rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#009CFF] mr-2"></div>
                  <span className="font-medium text-white">ТО-3</span>
                </div>
                <span className="text-sm text-red-400">Через 2 000 км</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Рекомендуемый пробег: 60 000 км</span>
              </div>
            </div>

            <div className="bg-[#2A2A2A] rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#c4d402] mr-2"></div>
                  <span className="font-medium text-white">Замена зимних шин</span>
                </div>
                <span className="text-sm text-gray-400">Ноябрь 2023</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Сезонная замена</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/tire-mounting/booking" className="block">
            <div className="bg-[#2A2A2A] rounded-2xl p-4 hover:bg-[#333] transition-colors active:scale-[0.98]">
              <Wrench className="h-6 w-6 text-[#009CFF] mb-2" />
              <p className="font-medium text-white text-sm">Записаться на шиномонтаж</p>
            </div>
          </Link>
          <Link href="/tire-storage/booking" className="block">
            <div className="bg-[#2A2A2A] rounded-2xl p-4 hover:bg-[#333] transition-colors active:scale-[0.98]">
              <Calendar className="h-6 w-6 text-[#c4d402] mb-2" />
              <p className="font-medium text-white text-sm">Оформить хранение</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}
