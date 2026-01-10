"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Minus, Plus, CalendarDays, CheckCircle, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SafeAreaHeader from "@/components/safe-area-header"

export default function TireStoragePage() {
  const router = useRouter()
  const [months, setMonths] = useState(6) // Default 6 months
  const [tireCount, setTireCount] = useState(4) // Default 4 tires
  const pricePerMonth = 150 // 150 rubles per month
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedQuickDate, setSelectedQuickDate] = useState<string>("today")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const totalPrice = months * tireCount * pricePerMonth

  const handleBookNow = () => {
    router.push("/tire-storage/booking")
  }

  const incrementTireCount = () => {
    if (tireCount < 20) {
      setTireCount(tireCount + 1)
    }
  }

  const decrementTireCount = () => {
    if (tireCount > 1) {
      setTireCount(tireCount - 1)
    }
  }

  const calculateEndDate = (start: string, monthsToAdd: number) => {
    if (!start) return ""
    const startDateObj = new Date(start)
    const endDateObj = new Date(startDateObj.setMonth(startDateObj.getMonth() + monthsToAdd))
    return endDateObj.toISOString().split("T")[0]
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
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    setSelectedDate(date)
    setStartDate(`${year}-${month}-${day}`)
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
                ? "bg-blue-100 text-blue-600"
                : isPast
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100 text-[#1F1F1F]"
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
      <SafeAreaHeader title="Хранение шин" showBackButton backUrl="/" className="bg-white" />

      <main className="flex-1 p-4 space-y-6 pb-24 pt-[calc(60px+env(safe-area-inset-top)+1rem)]">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden h-48 mb-6">
          <Image src="/images/tire-storage-bags.png" alt="Хранение шин" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-4 text-white">
              <h1 className="text-2xl font-bold">Хранение шин</h1>
              <p className="text-sm opacity-90">Профессиональное хранение шин в специализированном помещении</p>
            </div>
          </div>
        </div>

        {/* Price Calculator */}
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-[#1F1F1F] mb-4">Рассчитать стоимость</h2>

            {/* Date Selection */}
            <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1F1F1F]">Дата начала хранения</label>
                <div className="flex gap-2 mb-3 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date()
                      setSelectedDate(today)
                      setStartDate(today.toISOString().split("T")[0])
                      setSelectedQuickDate("today")
                    }}
                    className={`flex-1 px-3 py-2 text-sm rounded-md border transition-all duration-300 transform hover:scale-105 ${
                      selectedQuickDate === "today"
                        ? "bg-[#c4d402] border-[#c4d402] text-[#1F1F1F] shadow-lg"
                        : "bg-[#F5F5F5] border-gray-300 text-[#1F1F1F] hover:border-[#c4d402] hover:shadow-md"
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
                      setStartDate(tomorrow.toISOString().split("T")[0])
                      setSelectedQuickDate("tomorrow")
                    }}
                    className={`flex-1 px-3 py-2 text-sm rounded-md border transition-all duration-300 transform hover:scale-105 ${
                      selectedQuickDate === "tomorrow"
                        ? "bg-[#c4d402] border-[#c4d402] text-[#1F1F1F] shadow-lg"
                        : "bg-[#F5F5F5] border-gray-300 text-[#1F1F1F] hover:border-[#c4d402] hover:shadow-md"
                    }`}
                  >
                    Завтра
                  </button>
                </div>
                <div className="w-full bg-[#F5F5F5] rounded-lg p-4">
                  {/* Заголовок календаря */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="p-2 hover:bg-gray-200 rounded-md"
                    >
                      <ChevronLeft className="h-4 w-4 text-[#1F1F1F]" />
                    </button>
                    <h3 className="text-lg font-semibold text-[#1F1F1F]">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="p-2 hover:bg-gray-200 rounded-md"
                    >
                      <ChevronRight className="h-4 w-4 text-[#1F1F1F]" />
                    </button>
                  </div>

                  {/* Дни недели */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map((day) => (
                      <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Календарная сетка */}
                  <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1F1F1F]">ата окончания хранения</label>
                <input
                  type="date"
                  value={calculateEndDate(startDate, months)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-[#1F1F1F] cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Months Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-[#1F1F1F]">
                    Срок хранения: <span className="font-bold">{months} мес.</span>
                  </label>
                  <div className="text-right">
                    <span className="text-sm font-medium text-[#1F1F1F]">{pricePerMonth} ₽/мес</span>
                    <p className="text-xs text-gray-500">цена за одно колесо</p>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setMonths(Math.max(1, months - 1))}
                    disabled={months <= 1}
                    className="h-10 w-10 rounded-full border-gray-300"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="mx-4 w-20">
                    <span className="w-full text-center text-xl font-bold text-[#1F1F1F] block">
                      {months}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setMonths(Math.min(12, months + 1))}
                    disabled={months >= 12}
                    className="h-10 w-10 rounded-full border-gray-300"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tire Count */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1F1F1F]">Количество шин</label>
                <div className="flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementTireCount}
                    disabled={tireCount <= 1}
                    className="h-10 w-10 rounded-full border-gray-300 bg-transparent"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="mx-4 w-20">
                    <span className="w-full text-center text-xl font-bold text-[#1F1F1F] block">
                      {tireCount}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementTireCount}
                    disabled={tireCount >= 20}
                    className="h-10 w-10 rounded-full border-gray-300"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Total Price */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-[#1F1F1F]">Итого:</span>
                  <span className="text-xl font-bold text-[#1F1F1F]">{totalPrice} ₽</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {tireCount} шин × {months} мес × {pricePerMonth} ₽
                </div>
              </div>

              <Button className="w-full bg-[#c4d402] hover:bg-[#c4d402]/90 text-[#1F1F1F]" onClick={handleBookNow}>
                Забронировать
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Service Info Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full bg-gray-200 rounded-xl p-1">
            <TabsTrigger
              value="about"
              className="rounded-lg text-gray-900 transition-all duration-300 ease-in-out data-[state=active]:bg-[#c4d402] data-[state=active]:text-gray-900"
            >
              О услуге
            </TabsTrigger>
            <TabsTrigger
              value="conditions"
              className="rounded-lg text-gray-900 transition-all duration-300 ease-in-out data-[state=active]:bg-[#c4d402] data-[state=active]:text-gray-900"
            >
              Условия
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="rounded-lg text-gray-900 transition-all duration-300 ease-in-out data-[state=active]:bg-[#c4d402] data-[state=active]:text-gray-900"
            >
              FAQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-4">
            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#1F1F1F]">Профессиональное хранение шин</h3>
                <p className="text-sm text-gray-700">
                  Мы предлагаем профессиональное хранение шин в специализированном помещении с контролируемой
                  температурой и влажностью. Это позволяет сохранить качество и продлить срок службы ваших шин.
                </p>

                <div className="space-y-3 mt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#c4d402] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[#1F1F1F]">Контроль температуры</h4>
                      <p className="text-xs text-gray-700">
                        Хранение при оптимальной температуре от +5°C до +25°C предотвращает старение резины.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#c4d402] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[#1F1F1F]">Контроль влажности</h4>
                      <p className="text-xs text-gray-700">
                        Поддержание оптимального уровня влажности защищает шины от растрескивания и деформации.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#c4d402] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[#1F1F1F]">Защита от УФ-излучения</h4>
                      <p className="text-xs text-gray-700">
                        Хранение в темном помещении защищает резину от вредного воздействия ультрафиолета.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#c4d402] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[#1F1F1F]">Экономия места</h4>
                      <p className="text-xs text-gray-700">
                        Освободите место в гараже или на балконе, доверив хранение шин профессионалам.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conditions" className="mt-4">
            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#1F1F1F]">Условия хранения</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#c4d402]/20 p-2 rounded-full">
                      <CalendarDays className="h-5 w-5 text-[#c4d402]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1F1F1F]">Минимальный срок</h4>
                      <p className="text-xs text-gray-700">Минимальный срок хранения — 1 месяц</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-[#c4d402]/20 p-2 rounded-full">
                      <Info className="h-5 w-5 text-[#c4d402]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1F1F1F]">Состояние шин</h4>
                      <p className="text-xs text-gray-700">
                        Шины должны быть чистыми и сухими. Мы предлагаем услугу мойки шин перед хранением.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-[#c4d402]/20 p-2 rounded-full">
                      <Info className="h-5 w-5 text-[#c4d402]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1F1F1F]">Маркировка</h4>
                      <p className="text-xs text-gray-700">
                        Каждый комплект шин маркируется и заносится в базу данных для быстрого поиска.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-[#c4d402]/20 p-2 rounded-full">
                      <Info className="h-5 w-5 text-[#c4d402]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1F1F1F]">Доступ</h4>
                      <p className="text-xs text-gray-700">
                        Вы можете забрать свои шины в любое время в рабочие часы сервиса, предварительно уведомив нас за
                        24 часа.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="mt-4">
            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#1F1F1F]">Часто задаваемые вопросы</h3>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#1F1F1F]">
                      Можно ли хранить шины на дисках?
                    </h4>
                    <p className="text-xs text-gray-700">
                      Да, мы принимаем на хранение как шины без дисков, так и колеса в сборе. Стоимость хранения
                      одинакова.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#1F1F1F]">
                      Что если я захочу забрать шины раньше срока?
                    </h4>
                    <p className="text-xs text-gray-700">
                      Вы можете забрать шины в любое время, но оплата производится за полный месяц хранения.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#1F1F1F]">
                      Можно ли продлить срок хранения?
                    </h4>
                    <p className="text-xs text-gray-700">
                      Да, вы можете продлить срок хранения в любое время, связавшись с нами по телефону или через
                      приложение.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#1F1F1F]">Застрахованы ли мои шины?</h4>
                    <p className="text-xs text-gray-700">
                      Да, все шины, находящиеся на хранении, застрахованы от кражи, пожара и других непредвиденных
                      обстоятельств.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
