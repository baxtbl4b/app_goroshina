"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SafeAreaHeader from "@/components/safe-area-header"
import { toast } from "@/components/ui/use-toast"

export default function TireStorageBookingPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isLoadingUserData, setIsLoadingUserData] = useState(true)
  const [selectedCar, setSelectedCar] = useState("")
  const [userCars, setUserCars] = useState([])
  const [isLoadingCars, setIsLoadingCars] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isLoadingDates, setIsLoadingDates] = useState(true)
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [showAllStores, setShowAllStores] = useState(true)

  useEffect(() => {
    // Simulate loading user data from personal account
    const loadUserData = async () => {
      try {
        // In a real app, this would be an API call to get user profile data
        const userData = {
          name: "Иван Петров",
          phone: "+7 (999) 123-45-67",
        }

        // Load user's cars from garage
        const loadCars = () => {
          try {
            const storedCars = JSON.parse(localStorage.getItem("userCars") || "[]")

            // Если нет сохраненных автомобилей, используем начальные данные
            if (storedCars.length === 0) {
              const defaultCars = [
                { id: "1", brand: "Toyota", model: "Camry", year: "2019", plateNumber: "А123БВ777" },
                { id: "2", brand: "Volkswagen", model: "Tiguan", year: "2020", plateNumber: "Е456ЖЗ777" },
              ]
              localStorage.setItem("userCars", JSON.stringify(defaultCars))
              setUserCars(defaultCars)
            } else {
              setUserCars(storedCars)
            }
          } catch (error) {
            console.error("Ошибка при загрузке автомобилей:", error)
            setUserCars([])
          }
        }

        loadCars()

        // Get storage data from previous page (in real app this would come from URL params or state)
        const storageData = {
          startDate: new Date().toISOString().split("T")[0], // Сегодняшняя дата
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split("T")[0], // +6 месяцев
        }

        setName(userData.name)
        setPhone(userData.phone)
        if (userCars.length > 0) {
          setSelectedCar(userCars[0].id)
        }
        setStartDate(storageData.startDate)
        setEndDate(storageData.endDate)
      } catch (error) {
        console.error("Failed to load user data:", error)
      } finally {
        setIsLoadingUserData(false)
        setIsLoadingCars(false)
        setIsLoadingDates(false)
      }
    }

    loadUserData()

    // Обновляем список при фокусе на окне (когда пользователь возвращается)
    const handleFocus = () => {
      const loadCars = () => {
        try {
          const storedCars = JSON.parse(localStorage.getItem("userCars") || "[]")

          // Если нет сохраненных автомобилей, используем начальные данные
          if (storedCars.length === 0) {
            const defaultCars = [
              { id: "1", brand: "Toyota", model: "Camry", year: "2019", plateNumber: "А123БВ777" },
              { id: "2", brand: "Volkswagen", model: "Tiguan", year: "2020", plateNumber: "Е456ЖЗ777" },
            ]
            localStorage.setItem("userCars", JSON.stringify(defaultCars))
            setUserCars(defaultCars)
          } else {
            setUserCars(storedCars)
          }
        } catch (error) {
          console.error("Ошибка при загрузке автомобилей:", error)
          setUserCars([])
        }
      }
      loadCars()
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("focus", handleFocus)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if store is selected
    if (!selectedStore) {
      toast({
        title: "Выберите магазин",
        description: "Пожалуйста, выберите удобный для вас магазин",
        variant: "destructive",
      })
      return
    }

    // Here you would typically send the booking data to your backend
    router.push("/tire-storage/booking/confirmation")
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F7] dark:bg-[#121212]">
      <SafeAreaHeader
        title="Бронирование хранения"
        showBackButton
        backUrl="/tire-storage"
        className="bg-white dark:bg-[#1F1F1F]"
      />

      <main className="flex-1 p-4 space-y-6 pb-24">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <Card className="bg-white dark:bg-[#2A2A2A] border-none shadow-sm">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1F1F1F] dark:text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-[#c4d402]" />
                  Контактная информация
                </h2>
                {isLoadingUserData && <span className="text-sm text-gray-500">Загружаем данные...</span>}
                {!isLoadingUserData && <span className="text-sm text-[#c4d402]">Из личного кабинета</span>}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-[#1F1F1F] dark:text-white">
                    Имя
                  </Label>
                  <Input
                    id="name"
                    placeholder="Данные из личного кабинета"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoadingUserData}
                    className="bg-[#F5F5F5] dark:bg-[#333333] border-none disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-[#1F1F1F] dark:text-white">
                    Телефон
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Данные из личного кабинета"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    disabled={isLoadingUserData}
                    className="bg-[#F5F5F5] dark:bg-[#333333] border-none disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#1F1F1F] dark:text-white text-lg font-semibold">Автомобили</Label>
                  <div className="space-y-2">
                    <Label className="text-[#1F1F1F] dark:text-white text-lg font-semibold">
                      Данные из личного кабинета
                    </Label>
                    {isLoadingCars ? (
                      <div className="text-sm text-gray-500">Загружаем автомобили...</div>
                    ) : (
                      <div className="space-y-3">
                        {userCars.map((car) => (
                          <div
                            key={car.id}
                            onClick={() => setSelectedCar(car.id)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedCar === car.id
                                ? "border-[#c4d402] bg-[#c4d402]/10"
                                : "border-gray-300 dark:border-gray-600 bg-[#F5F5F5] dark:bg-[#333333]"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-[#1F1F1F] dark:text-white">
                                  {car.brand} {car.model}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {car.year} • {car.plateNumber}
                                </div>
                              </div>
                              {car.isPrimary && (
                                <span className="text-xs bg-[#c4d402] text-[#1F1F1F] px-2 py-1 rounded">Основной</span>
                              )}
                            </div>
                          </div>
                        ))}
                        <div
                          onClick={() => router.push("/account/cars/add")}
                          className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-[#F5F5F5] dark:bg-[#333333] cursor-pointer hover:border-[#c4d402] transition-colors"
                        >
                          <div className="text-center text-[#009CFF] font-medium">+ Добавить автомобиль</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store Selection */}
          <Card className="bg-white dark:bg-[#2A2A2A] border-none shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1F1F1F] dark:text-white">Выберите магазин</h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    id: "tallinn",
                    name: "Шинный центр на Таллинском шоссе",
                    address: "Таллинское шоссе, 190",
                    phone: "+7 (812) 123-45-67",
                    coordinates: "30.170433,59.810394",
                  },
                  {
                    id: "piskarevsky",
                    name: "Шинный центр на Пискаревском",
                    address: "Пискаревский проспект, 144АК",
                    phone: "+7 (812) 234-56-78",
                    coordinates: "30.451277,60.008981",
                  },
                  {
                    id: "moskovsky",
                    name: "Шиномонтаж 24",
                    address: "Московский проспект, 83АД",
                    phone: "+7 (812) 345-67-89",
                    coordinates: "30.258133,59.937477",
                  },
                  {
                    id: "vasilievsky",
                    name: "Шиномонтаж 24",
                    address: "Средний проспект Васильевского острова, 74Ш",
                    phone: "+7 (812) 456-78-90",
                    coordinates: "30.31596,59.902436",
                  },
                ]
                  .filter((store) => showAllStores || selectedStore === store.id)
                  .map((store) => (
                    <div key={store.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="store"
                          value={store.id}
                          checked={selectedStore === store.id}
                          onChange={(e) => {
                            setSelectedStore(e.target.value)
                            setShowAllStores(false)
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-[#1F1F1F] dark:text-white">{store.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{store.address}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{store.phone}</div>

                          {/* Яндекс карта */}
                          <div className="mt-3">
                            <iframe
                              src={`https://yandex.ru/map-widget/v1/?ll=${store.coordinates}&z=16&pt=${store.coordinates},pm2rdm`}
                              width="100%"
                              height="200"
                              frameBorder="0"
                              className="rounded-lg"
                              title={`Карта ${store.name}`}
                            />
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}

                {!showAllStores && selectedStore && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAllStores(true)}
                    className="w-full mt-4 border-[#c4d402] text-[#c4d402] hover:bg-[#c4d402]/10"
                  >
                    Показать все магазины
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Date and Time */}
          <Card className="bg-white dark:bg-[#2A2A2A] border-none shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1F1F1F] dark:text-white">Период хранения</h2>
                <span className="text-sm text-[#c4d402]">Из калькулятора</span>
              </div>

              <div className="space-y-4">
                {isLoadingDates ? (
                  <div className="bg-[#F5F5F7] dark:bg-[#333333] rounded-md p-3">
                    <span className="text-gray-500">Загружаем данные периода...</span>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label
                        htmlFor="startDate"
                        className="text-sm font-medium text-[#1F1F1F] dark:text-white flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4 text-[#c4d402]" />
                        Дата начала хранения
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        readOnly
                        className="bg-gray-100 dark:bg-[#1F1F1F] border-none cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="endDate"
                        className="text-sm font-medium text-[#1F1F1F] dark:text-white flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4 text-[#c4d402]" />
                        Дата окончания хранения
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        readOnly
                        className="bg-gray-100 dark:bg-[#1F1F1F] border-none cursor-not-allowed"
                      />
                    </div>
                  </>
                )}

                <div className="p-3 bg-gray-50 dark:bg-[#1F1F1F] rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Период хранения:{" "}
                    {startDate && endDate && new Date(endDate) > new Date(startDate)
                      ? Math.round(
                          (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44),
                        )
                      : 0}{" "}
                    месяцев
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg text-base font-medium transition-colors"
            >
              Назад
            </button>
            <button
              type="submit"
              disabled={!selectedStore}
              className="flex-1 bg-[#c4d402] hover:bg-[#c5d135] disabled:bg-gray-600 disabled:cursor-not-allowed text-black py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Записаться
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-3">
            Нажимая "Записаться", вы соглашаетесь с{" "}
            <a href="/settings/terms" className="text-blue-400 hover:text-blue-300 underline">
              условиями
            </a>{" "}
            предоставления услуг
          </p>
        </form>
      </main>
    </div>
  )
}
