"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { User, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SafeAreaHeader from "@/components/safe-area-header"
import { useRouter } from "next/navigation"
import Link from "next/link"
// import { Calendar as CalendarComponent } from "@/components/ui/calendar"

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
]

export default function StuddingBookingPage() {
  const router = useRouter()

  // Mock user data from personal account
  const userData = {
    name: "Иван Петров",
    phone: "+7 (921) 123-45-67",
  }

  const [name, setName] = useState(userData.name)
  const [phone, setPhone] = useState(userData.phone)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [selectedShop, setSelectedShop] = useState<string | null>(null)
  const [showAllStores, setShowAllStores] = useState(true)

  const [userCars, setUserCars] = useState<any[]>([])
  const [selectedCar, setSelectedCar] = useState("")
  const [isLoadingCars, setIsLoadingCars] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedQuickDate, setSelectedQuickDate] = useState<string>("")

  const dateTimeRef = useRef<HTMLDivElement>(null)

  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Функции для календаря
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1 // Понедельник = 0
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isSelectedDate = (date: Date) => {
    if (!selectedDate) return false
    const selected = new Date(selectedDate)
    return date.toDateString() === selected.toDateString()
  }

  const handleDateSelect = (date: Date) => {
    if (isPastDate(date)) return
    // Формируем дату в формате YYYY-MM-DD без учета часовых поясов
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    setSelectedDate(date)
    setDate(`${year}-${month}-${day}`)
    setSelectedQuickDate("")
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    // Пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>)
    }

    // Дни текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isPast = isPastDate(date)
      const isSelected = isSelectedDate(date)
      const isTodayDate = isToday(date)

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(date)}
          disabled={isPast}
          className={`h-10 w-full rounded-md text-sm font-medium transition-all ${
            isSelected
              ? "bg-[#c4d402] text-[#1F1F1F]"
              : isTodayDate
                ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                : isPast
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-[#1F1F1F] dark:text-white"
          }`}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ]

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]

  // Функция загрузки автомобилей
  const loadCars = () => {
    try {
      // Проверяем localStorage на наличие автомобилей
      const localStorageCars = localStorage.getItem("userCars")
      let storedCars = []

      if (localStorageCars) {
        // Если есть автомобили в localStorage, используем их
        storedCars = JSON.parse(localStorageCars)
      } else {
        // Если нет, используем дефолтные данные
        storedCars = [
          {
            id: "1",
            brand: "Toyota",
            model: "Camry",
            year: "2019",
            plateNumber: "А123БВ777",
            engineVolume: "2.5",
            transmission: "Автомат",
            isPrimary: true,
          },
          {
            id: "2",
            brand: "Volkswagen",
            model: "Tiguan",
            year: "2020",
            plateNumber: "Е456ЖЗ777",
            engineVolume: "2.0",
            transmission: "Автомат",
            isPrimary: false,
          },
        ]
        // Сохраняем дефолтные данные в localStorage
        localStorage.setItem("userCars", JSON.stringify(storedCars))
      }

      setUserCars(storedCars)

      // Автоматически выбираем основной автомобиль
      const primaryCar = storedCars.find((car: any) => car.isPrimary)
      if (primaryCar) {
        setSelectedCar(primaryCar.id)
      } else if (storedCars.length > 0) {
        setSelectedCar(storedCars[0].id)
      }
    } catch (error) {
      console.error("Ошибка при загрузке автомобилей:", error)
    } finally {
      setIsLoadingCars(false)
    }
  }

  const scrollToDateTime = () => {
    if (dateTimeRef.current) {
      dateTimeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }

  useEffect(() => {
    loadCars()

    // Загружаем сохраненный магазин из localStorage
    const savedStore = localStorage.getItem("selectedStore")
    if (savedStore) {
      setSelectedShop(savedStore)
      setShowAllStores(false) // Показываем только выбранный магазин
    }

    // Устанавливаем сегодняшнюю дату по умолчанию
    const today = new Date()
    setSelectedDate(today)
    setDate(today.toISOString().split("T")[0])
    setSelectedQuickDate("today")

    // Добавляем обработчик события focus, чтобы обновлять список автомобилей
    // когда пользователь возвращается на страницу (например, после добавления нового автомобиля)
    const handleFocus = () => {
      loadCars()
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("focus", handleFocus)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedShop) {
      // You can add a toast notification here if needed
      return
    }
    // In a real app, you would send this data to your backend
    console.log({ name, phone, selectedCar, date, time, selectedShop })
    router.push("/studding/booking/confirmation")
  }

  const isFormValid = name && phone && date && time && selectedShop && selectedCar

  return (
    <div className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <SafeAreaHeader
        title="Запись на дошиповку"
        showBackButton
        backUrl="/studding"
        className="bg-white dark:bg-[#1F1F1F]"
      />

      <main className="flex-1 p-4 pb-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-white dark:bg-[#2A2A2A] border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-[#1F1F1F] dark:text-white flex items-center gap-2">
                <User className="h-5 w-5 text-[#c4d402]" />
                Контактная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#1F1F1F] dark:text-white">
                  Имя
                </Label>
                <Input
                  id="name"
                  placeholder="Данные из личного кабинета"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#F5F5F5] dark:bg-[#333333] border-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#1F1F1F] dark:text-white">
                  Телефон
                </Label>
                <Input
                  id="phone"
                  placeholder="Данные из личного кабинета"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-[#F5F5F5] dark:bg-[#333333] border-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="car" className="text-[#1F1F1F] dark:text-white">
                  Автомобиль
                </Label>
                <div className="space-y-2">
                  <Label className="text-[#1F1F1F] dark:text-white text-lg font-semibold">Мой Гараж</Label>
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
                                {car.year} • {car.plateNumber || car.plate}
                              </div>
                            </div>
                            {car.isPrimary && (
                              <span className="text-xs bg-[#c4d402] text-[#1F1F1F] px-2 py-1 rounded">Основной</span>
                            )}
                          </div>
                        </div>
                      ))}
                      <Link href="/account/cars/add">
                        <div className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-[#F5F5F5] dark:bg-[#333333] cursor-pointer hover:border-[#c4d402] transition-colors">
                          <div className="text-center text-[#009CFF] font-medium">+ Добавить автомобиль</div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store Selection */}
          <Card className="bg-white dark:bg-[#2A2A2A] border-none shadow-sm">
            <CardContent className="p-4">
              <div className="bg-[#2A2A2A] rounded-lg p-4">
                <h2 className="text-lg font-bold mb-4 text-white">Выберите магазин</h2>
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
                    .filter((store) => showAllStores || selectedShop === store.id)
                    .map((store) => (
                      <div key={store.id} className="border border-gray-600 rounded-lg p-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="store"
                            value={store.id}
                            checked={selectedShop === store.id}
                            onChange={(e) => {
                              const storeId = e.target.value
                              setSelectedShop(storeId)
                              setShowAllStores(false)
                              // Сохраняем выбранный магазин в localStorage
                              localStorage.setItem("selectedStore", storeId)
                              // Прокручиваем к блоку "Дата и время"
                              setTimeout(() => scrollToDateTime(), 300)
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-white">{store.name}</div>
                            <div className="text-sm text-gray-400">{store.address}</div>
                            <div className="text-sm text-gray-400">{store.phone}</div>

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

                  {!showAllStores && selectedShop && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAllStores(true)}
                      className="w-full mt-4 text-white border-gray-600 hover:bg-gray-700"
                    >
                      Показать все магазины
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card ref={dateTimeRef} className="bg-white dark:bg-[#2A2A2A] border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-[#1F1F1F] dark:text-white flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-calendar h-5 w-5 text-[#c4d402]"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                Дата и время
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-[#1F1F1F] dark:text-white">Дата и время записи *</Label>
                <div className="mt-1 flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-3 justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          const today = new Date()
                          setSelectedDate(today)
                          setDate(today.toISOString().split("T")[0])
                          setSelectedQuickDate("today")
                        }}
                        className={`flex-1 px-3 py-2 text-sm rounded-md border transition-all duration-300 transform hover:scale-105 ${
                          selectedQuickDate === "today"
                            ? "bg-[#c4d402] border-[#c4d402] text-[#1F1F1F] shadow-lg"
                            : "bg-[#F5F5F5] dark:bg-[#333333] border-gray-300 dark:border-gray-600 text-[#1F1F1F] dark:text-white hover:border-[#c4d402] hover:shadow-md"
                        }`}
                      >
                        Сегодня
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const tomorrow = new Date()
                          tomorrow.setDate(tomorrow.getDate() + 1)
                          setSelectedDate(tomorrow)
                          setDate(tomorrow.toISOString().split("T")[0])
                          setSelectedQuickDate("tomorrow")
                        }}
                        className={`flex-1 px-3 py-2 text-sm rounded-md border transition-all duration-300 transform hover:scale-105 ${
                          selectedQuickDate === "tomorrow"
                            ? "bg-[#c4d402] border-[#c4d402] text-[#1F1F1F] shadow-lg"
                            : "bg-[#F5F5F5] dark:bg-[#333333] border-gray-300 dark:border-gray-600 text-[#1F1F1F] dark:text-white hover:border-[#c4d402] hover:shadow-md"
                        }`}
                      >
                        Завтра
                      </button>
                    </div>
                    <div className="w-full bg-[#F5F5F5] dark:bg-[#333333] rounded-lg p-4">
                      {/* Заголовок календаря */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                          }
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                        >
                          <ChevronLeft className="h-4 w-4 text-[#1F1F1F] dark:text-white" />
                        </button>
                        <h3 className="text-lg font-semibold text-[#1F1F1F] dark:text-white">
                          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h3>
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                          }
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                        >
                          <ChevronRight className="h-4 w-4 text-[#1F1F1F] dark:text-white" />
                        </button>
                      </div>

                      {/* Дни недели */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map((day) => (
                          <div
                            key={day}
                            className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Календарная сетка */}
                      <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-[#1F1F1F] dark:text-white mb-2 block">Время</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((timeSlot) => (
                        <button
                          key={timeSlot}
                          type="button"
                          onClick={() => {
                            setTime(timeSlot)
                            // Прокрутка страницы вниз после выбора времени
                            setTimeout(() => {
                              window.scrollTo({
                                top: document.body.scrollHeight,
                                behavior: "smooth",
                              })
                            }, 100)
                          }}
                          className={`p-2 text-sm rounded-md border transition-all ${
                            time === timeSlot
                              ? "bg-[#c4d402] border-[#c4d402] text-[#1F1F1F]"
                              : "bg-[#F5F5F5] dark:bg-[#333333] border-gray-300 dark:border-gray-600 text-[#1F1F1F] dark:text-white hover:border-[#c4d402]"
                          }`}
                        >
                          {timeSlot}
                        </button>
                      ))}
                    </div>
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
              disabled={!isFormValid}
              className="flex-1 bg-[#c4d402] hover:bg-[#c5d135] disabled:bg-gray-600 disabled:cursor-not-allowed text-black py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Записаться
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-3">
            Нажимая "Записаться", вы соглашаетесь с{" "}
            <Link href="/settings/terms" className="text-blue-400 hover:text-blue-300 underline">
              условиями
            </Link>{" "}
            предоставления услуг
          </p>
        </form>
      </main>
    </div>
  )
}
