"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import SafeAreaHeader from "@/components/safe-area-header"
import { useRouter } from "next/navigation"
import Link from "next/link"

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

const carBrands = [
  "Audi",
  "BMW",
  "Mercedes-Benz",
  "Volkswagen",
  "Toyota",
  "Honda",
  "Nissan",
  "Hyundai",
  "Kia",
  "Ford",
  "Chevrolet",
  "Renault",
  "Peugeot",
  "Skoda",
  "Другое",
]

const stores = [
  {
    id: "store1",
    name: "Шинный центр на Таллинском шоссе 190",
    address: "Таллинское шоссе, 190",
    phone: "+7 (901) 634-71-58",
    coordinates: "30.170433,59.810394",
  },
  {
    id: "store2",
    name: "Шинный центр на Пискаревском",
    address: "Пискаревский проспект, 144АК",
    phone: "+7(901) 634-71-59",
    coordinates: "30.451277,60.008981",
  },
  {
    id: "store3",
    name: "Шиномонтаж 24",
    address: "Московский проспект, 83АД",
    phone: "+7 (969) 967-71-11",
    coordinates: "30.258133,59.937477",
  },
  {
    id: "store4",
    name: "Шиномонтаж 24",
    address: "Средний проспект Васильевского острова, 74Ш",
    phone: "+7 (969) 967-71-11",
    coordinates: "30.2656,59.9386",
  },
]

export default function SoundproofingBookingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    carBrand: "",
    carModel: "",
    carYear: "",
    tireSize: "",
    quantity: "4",
    date: "",
    time: "",
    notes: "",
    selectedStore: "",
  })

  const [selectedStore, setSelectedStore] = useState("")

  const [userCars, setUserCars] = useState([])
  const [isLoadingCars, setIsLoadingCars] = useState(true)
  const [selectedCar, setSelectedCar] = useState(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedQuickDate, setSelectedQuickDate] = useState<string>("today")
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    // Load car data from localStorage
    try {
      // Set hardcoded car data from /account page
      const accountCars = [
        {
          id: 1,
          brand: "Toyota",
          model: "Camry",
          year: "2019",
          plateNumber: "А123БВ777",
          isPrimary: true,
        },
        {
          id: 2,
          brand: "Volkswagen",
          model: "Tiguan",
          year: "2020",
          plateNumber: "В456ГД777",
          isPrimary: false,
        },
      ]

      setUserCars(accountCars)
      setIsLoadingCars(false)

      if (accountCars.length > 0) {
        // Find primary car or use first car
        const primaryCar = accountCars.find((car: any) => car.isPrimary) || accountCars[0]
        setSelectedCar(primaryCar.id)

        // Auto-fill form with primary car data
        setFormData((prev) => ({
          ...prev,
          carBrand: primaryCar.brand || "",
          carModel: primaryCar.model || "",
          carYear: primaryCar.year || "",
        }))
      }

      // Load user profile data
      setFormData((prev) => ({
        ...prev,
        name: "Александр Петров",
        phone: "+7 (999) 123-45-67",
      }))

      // Set today as default selected date
      const today = new Date()
      setSelectedDate(today)
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const day = String(today.getDate()).padStart(2, "0")
      handleInputChange("date", `${year}-${month}-${day}`)
    } catch (error) {
      console.error("Ошибка при загрузке данных автомобилей:", error)
      setIsLoadingCars(false)
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Booking data:", formData)
    router.push("/soundproofing/booking/confirmation")
  }

  const isFormValid = formData.name && formData.phone && formData.date && formData.time && formData.selectedStore

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("ru-RU", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
      })
    }
    return dates
  }

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
    handleInputChange("date", `${year}-${month}-${day}`)
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
              ? "bg-[#D3DF3D] text-[#1F1F1F]"
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

  return (
    <div className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <SafeAreaHeader
        title="Запись на шумоизоляцию"
        showBackButton
        backUrl="/soundproofing"
        className="bg-white dark:bg-[#1F1F1F]"
      />

      <main className="flex-1 p-4 pb-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card className="bg-white dark:bg-[#2A2A2A] border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-[#1F1F1F] dark:text-white flex items-center gap-2">
                <User className="h-5 w-5 text-[#D3DF3D]" />
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
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
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
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-[#F5F5F5] dark:bg-[#333333] border-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="car" className="text-[#1F1F1F] dark:text-white">
                  Автомобили
                </Label>
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
                              ? "border-[#D3DF3D] bg-[#D3DF3D]/10"
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
                              <span className="text-xs bg-[#D3DF3D] text-[#1F1F1F] px-2 py-1 rounded">Основной</span>
                            )}
                          </div>
                        </div>
                      ))}
                      <Link href="/account/cars/add">
                        <div className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-[#F5F5F5] dark:bg-[#333333] cursor-pointer hover:border-[#D3DF3D] transition-colors">
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
          <div className="bg-white dark:bg-[#2A2A2A] rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-[#1F1F1F] dark:text-white">Выберите магазин</h2>
            <div className="space-y-4">
              {selectedStore ? (
                <>
                  {stores
                    .filter((store) => store.id === selectedStore)
                    .map((store) => (
                      <div key={store.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <input type="radio" name="store" value={store.id} checked={true} className="mt-1" readOnly />
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
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStore("")
                            handleInputChange("selectedStore", "")
                          }}
                          className="mt-4 text-sm text-[#009CFF] hover:underline"
                        >
                          Выбрать другой магазин
                        </button>
                      </div>
                    ))}
                </>
              ) : (
                <>
                  {stores.map((store) => (
                    <div key={store.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="store"
                          value={store.id}
                          checked={formData.selectedStore === store.id}
                          onChange={(e) => {
                            setSelectedStore(e.target.value)
                            handleInputChange("selectedStore", e.target.value)
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
                </>
              )}
            </div>
          </div>

          {/* Date and Time */}
          <Card className="bg-white dark:bg-[#2A2A2A] border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-[#1F1F1F] dark:text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#D3DF3D]" />
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
                          handleInputChange("date", today.toISOString().split("T")[0])
                          setSelectedQuickDate("today")
                        }}
                        className={`flex-1 px-3 py-2 text-sm rounded-md border transition-all duration-300 transform hover:scale-105 ${
                          selectedQuickDate === "today"
                            ? "bg-[#D3DF3D] border-[#D3DF3D] text-[#1F1F1F] shadow-lg"
                            : "bg-[#F5F5F5] dark:bg-[#333333] border-gray-300 dark:border-gray-600 text-[#1F1F1F] dark:text-white hover:border-[#D3DF3D] hover:shadow-md"
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
                          handleInputChange("date", tomorrow.toISOString().split("T")[0])
                          setSelectedQuickDate("tomorrow")
                        }}
                        className={`flex-1 px-3 py-2 text-sm rounded-md border transition-all duration-300 transform hover:scale-105 ${
                          selectedQuickDate === "tomorrow"
                            ? "bg-[#D3DF3D] border-[#D3DF3D] text-[#1F1F1F] shadow-lg"
                            : "bg-[#F5F5F5] dark:bg-[#333333] border-gray-300 dark:border-gray-600 text-[#1F1F1F] dark:text-white hover:border-[#D3DF3D] hover:shadow-md"
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
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            handleInputChange("time", time)
                            // Scroll to the bottom of the page after selecting time
                            setTimeout(() => {
                              window.scrollTo({
                                top: document.documentElement.scrollHeight,
                                behavior: "smooth",
                              })
                            }, 100)
                          }}
                          className={`p-2 text-sm rounded-md border transition-all ${
                            formData.time === time
                              ? "bg-[#D3DF3D] border-[#D3DF3D] text-[#1F1F1F]"
                              : "bg-[#F5F5F5] dark:bg-[#333333] border-gray-300 dark:border-gray-600 text-[#1F1F1F] dark:text-white hover:border-[#D3DF3D]"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card className="bg-white dark:bg-[#2A2A2A] border-none shadow-sm">
            <CardContent className="pt-6">
              <div>
                <Label htmlFor="notes" className="text-sm font-medium text-[#1F1F1F] dark:text-white">
                  Дополнительные пожелания
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="mt-1 bg-[#F5F5F5] dark:bg-[#333333] border-none"
                  placeholder="Укажите особые пожелания или требования..."
                  rows={3}
                />
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
              className="flex-1 bg-[#d3df3d] hover:bg-[#c5d135] disabled:bg-gray-600 disabled:cursor-not-allowed text-black py-3 px-4 rounded-lg font-medium transition-colors"
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
