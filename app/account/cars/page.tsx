"use client"

import { Car, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BackButton } from "@/components/back-button"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function CarsListPage() {
  const router = useRouter()
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [carToDelete, setCarToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const loadCars = () => {
      try {
        const storedCars = JSON.parse(localStorage.getItem("userCars") || "[]")
        setCars(storedCars)
      } catch (error) {
        console.error("Ошибка при загрузке автомобилей:", error)
        setCars([])
      } finally {
        setLoading(false)
      }
    }

    loadCars()

    // Обновляем список при фокусе на окне (когда пользователь возвращается)
    const handleFocus = () => {
      loadCars()
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("focus", handleFocus)
    }
  }, [])

  const handleDeleteCar = (id: string) => {
    setCarToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (carToDelete) {
      const updatedCars = cars.filter((car) => car.id !== carToDelete)
      setCars(updatedCars)
      localStorage.setItem("userCars", JSON.stringify(updatedCars))
      window.dispatchEvent(new CustomEvent("userCarsUpdated"))
      setCarToDelete(null)
    }
    setIsDeleteDialogOpen(false)
  }

  const handleSetPrimary = (carId: string) => {
    const updatedCars = cars.map((car) => ({
      ...car,
      isPrimary: car.id === carId,
    }))
    setCars(updatedCars)
    localStorage.setItem("userCars", JSON.stringify(updatedCars))
  }

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen bg-[#121212]">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-white">Загрузка автомобилей...</div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#121212]">
      <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-2 flex items-center justify-between">
          <div className="flex items-center">
            <BackButton />
            <span className="text-xl font-bold text-white">Мои автомобили</span>
          </div>

          <Link href="/account/cars/add">
            <button className="p-2 transition-colors" aria-label="Добавить">
              <Plus className="h-5 w-5 text-white" />
            </button>
          </Link>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        <div className="space-y-4">
          {cars.length > 0 ? (
            cars.map((car) => (
              <div key={car.id} className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Car className={`h-6 w-6 ${car.isPrimary ? "text-[#009CFF]" : "text-[#1F1F1F] dark:text-white"}`} />
                    <div className="flex-1">
                      <h3 className="font-bold text-[#1F1F1F] dark:text-white">
                        {car.brand} {car.model}
                      </h3>
                      {car.isPrimary && <span className="text-xs text-[#009CFF] font-medium">Основной автомобиль</span>}
                    </div>
                    {!car.isPrimary && (
                      <Button
                        size="sm"
                        className="h-8 bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F] text-xs"
                        onClick={() => handleSetPrimary(car.id)}
                      >
                        Сделать основным
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {car.hasStorage && (
                      <Link href={`/account/cars/${car.id}/storage`}>
                        <Button size="sm" className="h-8 bg-[#009CFF] hover:bg-[#009CFF]/80 text-white">
                          Хранение
                        </Button>
                      </Link>
                    )}
                    <Button size="sm" variant="destructive" className="h-8" onClick={() => handleDeleteCar(car.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Link href={`/account/cars/${car.id}`} className="block">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Год выпуска:</span>
                      <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">{car.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Гос. номер:</span>
                      <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">{car.plate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Пробег:</span>
                      <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">{car.mileage}</span>
                    </div>
                    <div className="space-y-1">
                      {car.summerTires && car.summerTires !== "Не указано" && (
                        <div className="flex justify-between">
                          <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Летние:</span>
                          <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">
                            {car.summerTires}
                          </span>
                        </div>
                      )}
                      {car.winterTires && car.winterTires !== "Не указано" && (
                        <div className="flex justify-between">
                          <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Зимние:</span>
                          <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">
                            {car.winterTires}
                          </span>
                        </div>
                      )}
                      {/* Fallback для старых автомобилей без сезонных данных */}
                      {!car.summerTires && !car.winterTires && car.tires && (
                        <div className="flex justify-between">
                          <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Шины:</span>
                          <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">
                            {car.tires} {car.tireSeason && `(${car.tireSeason})`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-6 shadow-sm text-center">
              <Car className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-[#1F1F1F] dark:text-white mb-2 font-semibold">У вас пока нет автомобилей</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Добавьте свой первый автомобиль</p>
              <Link href="/account/cars/add">
                <Button className="bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F]">
                  <Plus className="h-4 w-4 mr-2" /> Добавить автомобиль
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удаление автомобиля</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить этот автомобиль? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
