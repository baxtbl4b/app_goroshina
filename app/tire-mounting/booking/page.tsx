"use client"
import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import SafeAreaHeader from "@/components/safe-area-header"
import BottomNavigation from "@/components/bottom-navigation"
import Link from "next/link"
import { Calendar, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function TireMountingBookingPage() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState(null)
  const [selectedStore, setSelectedStore] = useState("")
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })
  const [selectedTime, setSelectedTime] = useState("")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    comment: "",
  })

  const [selectedCar, setSelectedCar] = useState("1")
  const [carInfo, setCarInfo] = useState({
    brand: "Toyota Camry",
    model: "Camry",
    year: "2019",
    plate: "А123БВ777",
  })

  const [selectedQuickDate, setSelectedQuickDate] = useState<string>("today")
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Ref for date/time section
  const dateTimeRef = useRef<HTMLDivElement>(null)
  // Ref for store selection section
  const storeSelectionRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to date/time section when store is selected
  useEffect(() => {
    if (selectedStore && dateTimeRef.current) {
      setTimeout(() => {
        dateTimeRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }, 300) // Small delay to allow UI to update
    }
  }, [selectedStore])

  // Загружаем данные пользователя из localStorage или API
  useEffect(() => {
    // Check for selected car from tire-mounting page
    try {
      const tireMountingData = localStorage.getItem("tireMountingBookingData")
      if (tireMountingData) {
        const data = JSON.parse(tireMountingData)
        if (data.selectedCarId) {
          setSelectedCar(data.selectedCarId)
          // Update car info based on selected car
          if (data.selectedCarId === "1") {
            setCarInfo({
              brand: "Toyota Camry",
              model: "Camry",
              year: "2019",
              plate: "А123БВ777",
            })
          } else if (data.selectedCarId === "2") {
            setCarInfo({
              brand: "Volkswagen Tiguan",
              model: "Tiguan",
              year: "2020",
              plate: "В456ГД777",
            })
          }
        }
      }
    } catch (error) {
      console.error("Error parsing tire mounting data:", error)
    }

    // Попробуем загрузить данные из разных возможных источников
    const userData =
      localStorage.getItem("userData") || localStorage.getItem("userProfile") || localStorage.getItem("user")

    if (userData) {
      try {
        const user = JSON.parse(userData)
        console.log("Загруженные данные пользователя:", user) // Для отладки
        setCustomerInfo((prev) => ({
          ...prev,
          name: user.name || user.firstName || user.fullName || "Иван Иванов", // Тестовые данные
          phone: user.phone || user.phoneNumber || user.mobile || "+7 (999) 123-45-67", // Тестовые данные
        }))

        // Загружаем данные автомобилей из гаража
        const carsData =
          localStorage.getItem("userCars") || localStorage.getItem("cars") || localStorage.getItem("garage")
        if (carsData) {
          try {
            const cars = JSON.parse(carsData)
            if (cars && cars.length > 0) {
              // Выбираем первый автомобиль или основной
              const primaryCar = cars.find((car) => car.isPrimary || car.isDefault) || cars[0]
              setSelectedCar(primaryCar.id)
              setCarInfo({
                brand: `${primaryCar.brand || ""} ${primaryCar.model || ""}`.trim(),
                model: primaryCar.model || "",
                year: primaryCar.year || "",
                plate: primaryCar.licensePlate || "",
              })
            }
          } catch (error) {
            console.error("Ошибка при загрузке данных автомобилей:", error)
            // Устанавливаем тестовые данные при ошибке
            setCarInfo({
              brand: "Toyota Camry",
              model: "Camry",
              year: "2019",
              plate: "А123БВ777",
            })
          }
        } else {
          // Если данных нет, устанавливаем тестовые данные
          console.log("Данные автомобилей не найдены, устанавливаем тестовые данные")
          setCarInfo({
            brand: "Toyota Camry",
            model: "Camry",
            year: "2019",
            plate: "А123БВ777",
          })
        }
      } catch (error) {
        console.error("Ошибка при парсинге данных пользователя:", error)
        // Устанавливаем тестовые данные при ошибке
        setCustomerInfo((prev) => ({
          ...prev,
          name: "Иван Иванов",
          phone: "+7 (999) 123-45-67",
        }))
      }
    } else {
      console.log("Данные пользователя не найдены в localStorage, устанавливаем тестовые данные")
      // Если данных нет, устанавливаем тестовые данные
      setCustomerInfo((prev) => ({
        ...prev,
        name: "Иван Иванов",
        phone: "+7 (999) 123-45-67",
      }))
    }
  }, [])

  // ����анные магазинов
  const stores = [
    {
      id: "1",
      name: "Шинный центр на Таллинском шоссе 190",
      address: "Таллинское шоссе, 190",
      phone: "+7 (901) 634-71-58",
      hours: "Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00",
      coordinates: "30.170433,59.810394",
    },
    {
      id: "2",
      name: "Шинный центр на Пискаревском",
      address: "Пискаревский проспект, 144АК",
      phone: "+7 (901) 634-71-59",
      hours: "Пн-Пт: 8:00-19:00, Сб-Вс: 9:00-17:00",
      coordinates: "30.451277,60.008981",
    },
    {
      id: "3",
      name: "Шиномонтаж 24",
      address: "Московский проспект, 83АД",
      phone: "+7 (969) 967-71-11",
      hours: "Пн-Пт: 9:00-21:00, Сб-Вс: 10:00-19:00",
      coordinates: "30.258133,59.937477",
    },
    {
      id: "4",
      name: "Шиномонтаж 24",
      address: "Средний проспект Васильевского острова, 74Ш",
      phone: "+7 (969) 967-71-11",
      hours: "Пн-Пт: 9:00-21:00, Сб-Вс: 10:00-19:00",
      coordinates: "30.2656,59.9386",
    },
  ]

  // Доступные временные слоты
  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

  // Загружаем данные из localStorage при монтировании компонента
  useEffect(() => {
    const savedData = localStorage.getItem("tireMountingBookingData")
    if (savedData) {
      setBookingData(JSON.parse(savedData))
    } else {
      // Если данных нет, перенаправляем обратно на страницу шиномонтажа
      router.push("/tire-mounting")
    }
  }, [router])

  // Обработчик изменения данных клиента
  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Обработчик изменения данных автомобиля
  const handleCarInfoChange = (field: string, value: string) => {
    setCarInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
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
    // Формируем д��ту в формате YYYY-MM-DD без учета часовых поясов
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    setSelectedDate(`${year}-${month}-${day}`)
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

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const selectedStoreData = stores.find((store) => store.id === selectedStore)

    const orderData = {
      services: bookingData?.selectedServices || {},
      totalPrice: bookingData?.totalPrice || 0,
      diameter: bookingData?.diameter,
      carType: bookingData?.carType,
      car: carInfo,
      store: selectedStoreData,
      date: new Date().toISOString(), // Сохраняем текущую дату как дату создания заказа
      appointmentDate: selectedDate, // Сохраняем выбранную дату записи отдельно
      time: selectedTime,
      customer: customerInfo,
      orderNumber: `TM${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    try {
      console.log("Отправка заказа:", orderData)

      // Сохраняем данные заказа для страницы подтверждения и для страницы "Мои заказы"
      localStorage.setItem("tireMountingOrderData", JSON.stringify(orderData))

      // Добавляем отладочную информацию
      console.log("Данные сохранены в localStorage:", localStorage.getItem("tireMountingOrderData"))

      // Принудительно обновляем страницу заказов, если она открыта
      window.dispatchEvent(new Event("storage"))

      // Показываем уведомление об успешном создании заказа
      alert(`Заказ ${orderData.orderNumber} успешно создан! Проверьте страницу "Мои заказы".`)

      // Очищаем данные записи
      localStorage.removeItem("tireMountingBookingData")

      // Перенаправляем на страницу подтверждения
      router.push("/tire-mounting/booking/confirmation")
    } catch (error) {
      console.error("Ошибка при создании заказа:", error)
      alert("Произошла ошибка при создании заказа. Попробуйте е��е раз.")
    }
  }

  if (!bookingData) {
    return (
      <div className="flex flex-col min-h-screen bg-[#121212] text-white">
        <SafeAreaHeader title="Запись на шиномонтаж" showBackButton backUrl="/tire-mounting" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D3DF3D] mx-auto mb-4"></div>
            <p>Загрузка данных...</p>
          </div>
        </main>
      </div>
    )
  }

  const selectedStoreData = stores.find((store) => store.id === selectedStore)

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      <SafeAreaHeader title="Запись на шиномонтаж" showBackButton backUrl="/tire-mounting" />

      <main className="flex-1 px-4 py-6">
        <form onSubmit={(e) => e.preventDefault()} className="max-w-2xl mx-auto space-y-6">
          {/* Контактная информация */}
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
                  value={customerInfo.name}
                  onChange={(e) => handleCustomerInfoChange("name", e.target.value)}
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
                  value={customerInfo.phone}
                  onChange={(e) => handleCustomerInfoChange("phone", e.target.value)}
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
                  <div className="space-y-3">
                    <div
                      onClick={() => {
                        setSelectedCar("1")
                        // Save selection back to tire-mounting data
                        try {
                          const tireMountingData = localStorage.getItem("tireMountingBookingData")
                          if (tireMountingData) {
                            const data = JSON.parse(tireMountingData)
                            data.selectedCarId = "1"
                            localStorage.setItem("tireMountingBookingData", JSON.stringify(data))
                          }
                        } catch (error) {
                          console.error("Error saving car selection:", error)
                        }
                      }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCar === "1"
                          ? "border-[#D3DF3D] bg-[#D3DF3D]/10"
                          : "border-gray-300 dark:border-gray-600 bg-[#F5F5F5] dark:bg-[#333333]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-[#1F1F1F] dark:text-white">Toyota Camry</div>
                          <div className="text-sm text-gray-500">2019 • А123БВ777</div>
                        </div>
                        <span className="text-xs bg-[#D3DF3D] text-[#1F1F1F] px-2 py-1 rounded">Основной</span>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setSelectedCar("2")
                        // Save selection back to tire-mounting data
                        try {
                          const tireMountingData = localStorage.getItem("tireMountingBookingData")
                          if (tireMountingData) {
                            const data = JSON.parse(tireMountingData)
                            data.selectedCarId = "2"
                            localStorage.setItem("tireMountingBookingData", JSON.stringify(data))
                          }
                        } catch (error) {
                          console.error("Error saving car selection:", error)
                        }
                      }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCar === "2"
                          ? "border-[#D3DF3D] bg-[#D3DF3D]/10"
                          : "border-gray-300 dark:border-gray-600 bg-[#F5F5F5] dark:bg-[#333333]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-[#1F1F1F] dark:text-white">Volkswagen Tiguan</div>
                          <div className="text-sm text-gray-500">2020 • В456ГД777</div>
                        </div>
                      </div>
                    </div>
                    <Link href="/account/cars/add">
                      <div className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-[#F5F5F5] dark:bg-[#333333] cursor-pointer hover:border-[#D3DF3D] transition-colors">
                        <div className="text-center text-[#009CFF] font-medium">+ Добавить автомобиль</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment" className="text-[#1F1F1F] dark:text-white">
                  Комментарий
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Дополнительные пожелания или коммента��ии"
                  value={customerInfo.comment}
                  onChange={(e) => handleCustomerInfoChange("comment", e.target.value)}
                  className="bg-[#F5F5F5] dark:bg-[#333333] border-none resize-none"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Сводка по услугам */}
          <div className="bg-[#2A2A2A] rounded-lg p-4">
            <h2 className="text-lg font-bold mb-3">Выбранные услуги</h2>
            <div className="space-y-2">
              {Object.entries(bookingData.selectedServices).map(([key, service]: [string, any]) => (
                <div key={key} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">{service.name}</span>
                  <span className="text-white">
                    {service.quantity}x {service.price}₽ = {service.total}₽
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-600 mt-3 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Общая стоимость:</span>
                <span className="text-xl font-bold text-[#D3DF3D]">{bookingData.totalPrice} ₽</span>
              </div>
            </div>

            {/* Дополнительная информация */}
            <div className="mt-4 pt-3 border-t border-gray-600 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Диаметр шины:</span>
                <span>{bookingData.diameter?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Тип автомобиля:</span>
                <span>
                  {bookingData.carType === "passenger" && "Легковой автомобиль"}
                  {bookingData.carType === "crossover" && "Кроссовер"}
                  {bookingData.carType === "jeep" && "Джип"}
                  {bookingData.carType === "commercial" && "Коммерческий транспорт"}
                  {bookingData.carType === "gazel" && "Газель"}
                </span>
              </div>
            </div>
          </div>

          {/* Выбор магазина */}
          <Card ref={storeSelectionRef} className="bg-[#2A2A2A] rounded-lg p-4">
            <h2 className="text-lg font-bold mb-3">Выберите сервис</h2>
            <div className="space-y-3">
              {selectedStore ? (
                <>
                  {stores
                    .filter((store) => store.id === selectedStore)
                    .map((store) => (
                      <div key={store.id} className="border border-gray-600 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <input type="radio" name="store" value={store.id} checked={true} className="mt-1" readOnly />
                          <div className="flex-1">
                            <div className="font-medium">{store.name}</div>
                            <p className="text-sm text-gray-400 mt-1">{store.address}</p>
                            <p className="text-sm text-gray-400">{store.phone}</p>
                            <p className="text-xs text-gray-500 mt-1">{store.hours}</p>

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
                          <div className="w-5 h-5 rounded-full bg-[#D3DF3D] flex items-center justify-center">
                            <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStore("")
                            // Прокрутка к календарю после сброса выбора магазина
                            setTimeout(() => {
                              dateTimeRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              })
                            }, 100)
                          }}
                          className="mt-4 text-sm text-blue-400 hover:text-blue-300"
                        >
                          Выбрать другой сервис
                        </button>
                      </div>
                    ))}
                </>
              ) : (
                <>
                  {stores.map((store) => (
                    <div key={store.id} className="border border-gray-600 rounded-lg p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="store"
                          value={store.id}
                          checked={selectedStore === store.id}
                          onChange={(e) => {
                            setSelectedStore(e.target.value)
                            // Прокрутка к календарю после выбора магазина
                            setTimeout(() => {
                              dateTimeRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              })
                            }, 300)
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{store.name}</div>
                          <p className="text-sm text-gray-400 mt-1">{store.address}</p>
                          <p className="text-sm text-gray-400">{store.phone}</p>
                          <p className="text-xs text-gray-500 mt-1">{store.hours}</p>

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
                        {selectedStore === store.id && (
                          <div className="w-5 h-5 rounded-full bg-[#D3DF3D] flex items-center justify-center">
                            <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </label>
                    </div>
                  ))}
                </>
              )}
            </div>
          </Card>

          {/* Выбор даты и времени */}
          <Card ref={dateTimeRef} className="bg-white dark:bg-[#2A2A2A] border-none shadow-sm">
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
                          setSelectedDate(today.toISOString().split("T")[0])
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
                          setSelectedDate(tomorrow.toISOString().split("T")[0])
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
                            setSelectedTime(time)
                            // Прокрутка в самый низ страницы после выбора времени
                            setTimeout(() => {
                              window.scrollTo({
                                top: document.body.scrollHeight,
                                behavior: "smooth",
                              })
                            }, 100)
                          }}
                          className={`p-2 text-sm rounded-md border transition-all ${
                            selectedTime === time
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

          {/* Кнопки дейс��вий */}
          {/* Добавляем отступ внизу формы, чтобы контент не перекрывался фиксированными кнопками */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg text-base font-medium transition-colors"
            >
              Назад
            </button>
            <button
              type="button"
              onClick={() => {
                if (
                  selectedStore &&
                  selectedDate &&
                  selectedTime &&
                  customerInfo.name &&
                  customerInfo.phone &&
                  selectedCar
                ) {
                  const selectedStoreData = stores.find((store) => store.id === selectedStore)

                  const orderData = {
                    services: bookingData?.selectedServices || {},
                    totalPrice: bookingData?.totalPrice || 0,
                    diameter: bookingData?.diameter,
                    carType: bookingData?.carType,
                    car: carInfo,
                    store: selectedStoreData,
                    date: new Date().toISOString(),
                    appointmentDate: selectedDate,
                    time: selectedTime,
                    customer: customerInfo,
                    orderNumber: `TM${Date.now()}`,
                    createdAt: new Date().toISOString(),
                  }

                  // Сохраняем данные заказа
                  localStorage.setItem("tireMountingOrderData", JSON.stringify(orderData))

                  // Очищаем данные записи
                  localStorage.removeItem("tireMountingBookingData")

                  // Перенаправляем на страницу подтверждения без показа алерта
                  router.push("/tire-mounting/booking/confirmation")
                }
              }}
              disabled={
                !selectedStore ||
                !selectedDate ||
                !selectedTime ||
                !customerInfo.name ||
                !customerInfo.phone ||
                !selectedCar
              }
              className="flex-1 bg-[#D3DF3D] hover:bg-[#C4CF2E] disabled:opacity-50 disabled:cursor-not-allowed text-black py-3 px-4 rounded-lg text-base font-medium transition-colors"
            >
              Записаться
            </button>
          </div>

          {/* Согласие с условиями */}
          <p className="text-xs text-gray-400 text-center mt-4">
            Нажимая "Записаться", вы соглашаетесь с{" "}
            <Link href="/settings/terms" className="text-[#D3DF3D] hover:underline">
              условиями
            </Link>{" "}
            предоставления услуг
          </p>
        </form>
      </main>

      <BottomNavigation />
    </div>
  )
}
