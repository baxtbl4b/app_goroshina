"use client"

import Link from "next/link"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import SafeAreaHeader from "@/components/safe-area-header"
import { useToast } from "@/hooks/use-toast"
import { CollapsibleCard } from "@/components/collapsible-card" // Import the new component

interface TimeSlot {
  time: string
  available: boolean
  id: string
}

export default function BookOnlinePage() {
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [isBooking, setIsBooking] = useState(false)
  const [bookedSlot, setBookedSlot] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>("quick-booking")
  const [selectedShop, setSelectedShop] = useState<string | null>(null)
  const [showAllStores, setShowAllStores] = useState(true)
  const [selectedQuickDate, setSelectedQuickDate] = useState<string>("")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [date, setDate] = useState<Date | undefined>(new Date())

  const router = useRouter()

  const shopSectionRef = useRef<HTMLDivElement>(null)
  const timeSlotsRef = useRef<HTMLDivElement>(null)
  const bookingButtonRef = useRef<HTMLButtonElement>(null)
  const dateTimeRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    name: "Иван Петров",
    phone: "+7 (812) 555-12-34",
  })
  const [selectedCar, setSelectedCar] = useState<string | null>(null)
  const [isLoadingCars, setIsLoadingCars] = useState(false)
  const [userCars, setUserCars] = useState([
    {
      id: "1",
      brand: "BMW",
      model: "X5",
      year: "2020",
      plateNumber: "А123БВ78",
      isPrimary: true,
    },
    {
      id: "2",
      brand: "Mercedes",
      model: "C-Class",
      year: "2019",
      plate: "В456ГД78",
      isPrimary: false,
    },
  ])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleBooking()
  }

  // Generate time slots for the selected date
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    const currentHour = today.getHours()

    // Generate slots from 9 AM to 6 PM
    for (let hour = 9; hour <= 18; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`
      const timeSlot30 = `${hour.toString().padStart(2, "0")}:30`

      // For today, only show future time slots
      const isAvailable = !isToday || hour > currentHour

      // Make more slots available for demo (reduce random unavailability)
      const randomUnavailable = Math.random() > 0.9

      slots.push({
        time,
        available: isAvailable && !randomUnavailable,
        id: `${date.toISOString().split("T")[0]}-${time}`,
      })

      if (hour < 18) {
        slots.push({
          time: timeSlot30,
          available: isAvailable && !randomUnavailable,
          id: `${date.toISOString().split("T")[0]}-${timeSlot30}`,
        })
      }
    }

    return slots
  }

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  useEffect(() => {
    setTimeSlots(generateTimeSlots(selectedDate))
    setSelectedTimeSlot(null)
  }, [selectedDate])

  const formatDate = (date: Date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Сегодня"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Завтра"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Вчера"
    } else {
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        weekday: "short",
      })
    }
  }

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
  }

  const goToNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDate(newDate)
  }

  const handleTimeSlotSelect = (slotId: string) => {
    if (bookedSlot === slotId) return
    setSelectedTimeSlot(slotId)
  }

  const handleBooking = async () => {
    if (!selectedShop) {
      toast({
        title: "Выберите магазин",
        description: "Пожалуйста, выберите удобный для вас магазин",
        variant: "destructive",
      })
      return
    }

    if (!selectedTimeSlot) {
      toast({
        title: "Выберите время",
        description: "Пожалуйста, выберите удобное время для записи",
        variant: "destructive",
      })
      return
    }

    setIsBooking(true)

    // Simulate booking process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to confirmation page instead of showing success state
    router.push("/book-online/confirmation")
  }

  const availableSlots = timeSlots.filter((slot) => slot.available)

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
    return date.toDateString() === selectedDate.toDateString()
  }

  const handleDateSelect = (date: Date) => {
    if (isPastDate(date)) return
    setSelectedDate(date)
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
          onClick={() => {
            handleDateSelect(date)
            // Force re-generation of time slots after date selection
            setTimeout(() => {
              setTimeSlots(generateTimeSlots(date))
            }, 100)
          }}
          disabled={isPast}
          className={`h-10 w-full rounded-md text-sm font-medium transition-all ${
            isSelected
              ? "bg-[#c4d402] text-gray-900"
              : isTodayDate
                ? "bg-blue-100 text-blue-600"
                : isPast
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100 text-gray-900"
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
    <div className="flex flex-col min-h-screen bg-[#d9d9dd]">
      <SafeAreaHeader title="Онлайн запись" showBackButton backUrl="/" className="bg-white" />

      <main className="flex-1 p-4 pb-20 pt-[calc(60px+env(safe-area-inset-top))]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <CollapsibleCard
            title="Контактная информация"
            className="bg-white border-none shadow-sm"
            defaultOpen={true} // Set to true to have it open by default
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-900">
                  Имя
                </Label>
                <Input
                  id="name"
                  placeholder="Данные из личного кабинета"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-900">
                  Телефон
                </Label>
                <Input
                  id="phone"
                  placeholder="Данные из личного кабинета"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="car" className="text-gray-900">
                  Автомобили
                </Label>
                <div className="space-y-2">
                  <Label className="text-gray-900 text-lg font-semibold">
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
                              : "border-gray-300 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-gray-900">
                                {car.brand} {car.model}
                              </div>
                              <div className="text-sm text-gray-500">
                                {car.year} • {car.plateNumber || car.plate}
                              </div>
                            </div>
                            {car.isPrimary && (
                              <span className="text-xs bg-[#c4d402] text-gray-900 px-2 py-1 rounded">Основной</span>
                            )}
                          </div>
                        </div>
                      ))}
                      <Link href="/account/cars/add">
                        <div className="p-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:border-[#c4d402] transition-colors">
                          <div className="text-center text-[#009CFF] font-medium">+ Добавить автомобиль</div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleCard>

          {/* Shop Selection */}
          <Card className="bg-white" ref={shopSectionRef}>
            <CardContent className="p-4">
              {/* Store Selection */}
              <div className="bg-white rounded-lg p-4">
                <h2 className="text-lg font-bold mb-4 text-gray-900">Выберите магазин</h2>
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
                      <div key={store.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="store"
                            value={store.id}
                            checked={selectedShop === store.id}
                            onChange={(e) => {
                              setSelectedShop(e.target.value)
                              setShowAllStores(false)
                              // Scroll to date and time section after store selection
                              setTimeout(() => {
                                if (dateTimeRef.current) {
                                  dateTimeRef.current.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  })
                                }
                              }, 100)
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{store.name}</div>
                            <div className="text-sm text-gray-600">{store.address}</div>
                            <div className="text-sm text-gray-600">{store.phone}</div>

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
                      variant="outline"
                      onClick={() => setShowAllStores(true)}
                      className="w-full mt-4 text-gray-900 border-gray-300 hover:bg-gray-100"
                    >
                      Показать все магазины
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date and Time Selection */}
          <Card ref={dateTimeRef} className="bg-white border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
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
              <CollapsibleCard title="Запись на услуги" description="Выберите услугу, дату и время" defaultOpen={true}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="service" className="text-gray-900">Услуга</Label>
                    <Select>
                      <SelectTrigger id="service" className="bg-gray-50 border-gray-200 text-gray-900">
                        <SelectValue placeholder="Выберите услугу" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tire-mounting">Шиномонтаж</SelectItem>
                        <SelectItem value="tire-storage">Хранение шин</SelectItem>
                        <SelectItem value="painting">Покраска дисков</SelectItem>
                        <SelectItem value="studding">Дошиповка</SelectItem>
                        <SelectItem value="soundproofing">Шумоизоляция</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date" className="text-gray-900">Дата</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn("w-full justify-start text-left font-normal bg-gray-50 border-gray-200 text-gray-900", !date && "text-gray-500")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Выберите дату</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time" className="text-gray-900">Время</Label>
                    <Input id="time" type="time" defaultValue="10:00" className="bg-gray-50 border-gray-200 text-gray-900" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="comment" className="text-gray-900">Комментарий</Label>
                    <Textarea id="comment" placeholder="Дополнительная информация" className="bg-gray-50 border-gray-200 text-gray-900" />
                  </div>
                </div>
                <CardFooter className="mt-6 p-0">
                  <Button className="w-full bg-[#c4d402] hover:bg-[#c4d402]/90 text-gray-900">Записаться</Button>
                </CardFooter>
              </CollapsibleCard>
            </CardContent>
          </Card>

          {/* Booking Information */}
          {selectedTimeSlot && selectedShop && !bookedSlot && (
            <Card className="bg-blue-50 border-blue-300">
              <CardContent className="p-4">
                <h4 className="font-bold text-gray-900 mb-2">Детали записи</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Услуга:</span>
                    <span className="font-medium text-gray-900">Быстрая запись</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Магазин:</span>
                    <span className="font-medium text-gray-900">
                      {
                        [
                          { id: "tallinn", name: "Шинный центр на Таллинском шоссе" },
                          { id: "piskarevsky", name: "Шинный центр на Пискаревском" },
                          { id: "moskovsky", name: "Шиномонтаж 24 (Московский пр.)" },
                          { id: "vasilievsky", name: "Шиномонтаж 24 (Васильевский о.)" },
                        ].find((shop) => shop.id === selectedShop)?.name
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Дата:</span>
                    <span className="font-medium text-gray-900">
                      {selectedDate.toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Время:</span>
                    <span className="font-medium text-gray-900">
                      {timeSlots.find((slot) => slot.id === selectedTimeSlot)?.time}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Booking Button - Always at bottom */}
          <Button
            ref={bookingButtonRef}
            onClick={handleBooking}
            disabled={isBooking || !selectedTimeSlot || !selectedShop}
            className="w-full h-12 bg-[#c4d402] hover:bg-[#c4d402]/90 text-gray-900 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBooking ? "Оформляем запись..." : "Подтвердить запись"}
          </Button>
        </form>
      </main>
    </div>
  )
}
