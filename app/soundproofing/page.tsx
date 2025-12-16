"use client"

import { useState, useEffect, useRef } from "react"
import { Calculator, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SafeAreaHeader from "@/components/safe-area-header"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// Pricing data for soundproofing based on tire size
const soundproofingPrices = {
  "13": { price: 800, description: "Базовая шумоизоляция для малых размеров" },
  "14": { price: 900, description: "Стандартная шумоизоляция" },
  "15": { price: 1000, description: "Улучшенная шумоизоляция" },
  "16": { price: 1200, description: "Премиум шумоизоляция" },
  "17": { price: 1400, description: "Профессиональная шумоизоляция" },
  "18": { price: 1600, description: "Высококачественная шумоизоляция" },
  "19": { price: 1800, description: "Элитная шумоизоляция" },
  "20": { price: 2000, description: "Максимальная шумоизоляция" },
  "21": { price: 2200, description: "Эксклюзивная шумоизоляция" },
  "22": { price: 2400, description: "Премиальная шумоизоляция больших размеров" },
}

const tireSizes = ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22"]

const widthOptions = [
  "155",
  "165",
  "175",
  "185",
  "195",
  "205",
  "215",
  "225",
  "235",
  "245",
  "255",
  "265",
  "275",
  "285",
  "295",
  "305",
  "315",
  "325",
  "335",
  "345",
]

const profileOptions = ["30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85"]

export default function SoundproofingPage() {
  const [selectedWidth, setSelectedWidth] = useState("")
  const [selectedProfile, setSelectedProfile] = useState("")
  const [selectedDiameter, setSelectedDiameter] = useState("")
  const [quantity, setQuantity] = useState(4)
  const [showCalculation, setShowCalculation] = useState(false)
  const [userCars, setUserCars] = useState([
    {
      id: "1",
      brand: "Toyota",
      model: "Camry",
      year: "2019",
      plate: "А123БВ777",
      tireSize: "225/55 R17", // Размер шин для Toyota Camry
      tires: "Michelin Pilot Sport 4",
    },
    {
      id: "2",
      brand: "Volkswagen",
      model: "Tiguan",
      year: "2020",
      plate: "Е456ЖЗ777",
      tireSize: "235/55 R18", // Размер шин для Volkswagen Tiguan
      tires: "Continental PremiumContact 6",
    },
  ])
  const [tireMountingServices, setTireMountingServices] = useState(null)
  const calculationResultsRef = useRef<HTMLDivElement>(null)

  const calculatePrice = () => {
    if (!selectedDiameter) return 0
    const basePrice = soundproofingPrices[selectedDiameter as keyof typeof soundproofingPrices]?.price || 0
    return basePrice * quantity
  }

  const getDescription = () => {
    if (!selectedDiameter) return ""
    return soundproofingPrices[selectedDiameter as keyof typeof soundproofingPrices]?.description || ""
  }

  const handleCalculate = () => {
    if (selectedWidth && selectedProfile && selectedDiameter) {
      setShowCalculation(true)
    }
  }

  const isFormValid = selectedWidth && selectedProfile && selectedDiameter

  useEffect(() => {
    // В реальном приложении здесь будет API вызов для получения автомобилей пользователя
    // fetchUserCars().then(setUserCars)
  }, [])

  // Handle return from tire mounting page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const returnFrom = urlParams.get("returnFrom")

    if (returnFrom === "tire-mounting") {
      // Load tire mounting data if returning from tire mounting
      const tireMountingData = localStorage.getItem("tireMountingSelectedServices")
      if (tireMountingData) {
        const services = JSON.parse(tireMountingData)
        setTireMountingServices(services)

        // Clean up localStorage
        localStorage.removeItem("tireMountingSelectedServices")

        // Clean up URL
        window.history.replaceState({}, "", "/soundproofing")
      }

      // Restore soundproofing data
      const soundproofingData = localStorage.getItem("soundproofingData")
      if (soundproofingData) {
        const data = JSON.parse(soundproofingData)
        setSelectedWidth(data.selectedWidth || "")
        setSelectedProfile(data.selectedProfile || "")
        setSelectedDiameter(data.selectedDiameter || "")
        setQuantity(data.quantity || 4)
        setShowCalculation(data.showCalculation || false)

        // Clean up
        localStorage.removeItem("soundproofingData")
      }
    }
  }, [])

  // Auto-scroll to calculation results when they appear
  useEffect(() => {
    if (showCalculation && isFormValid && calculationResultsRef.current) {
      setTimeout(() => {
        calculationResultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }, 100) // Small delay to ensure the element is rendered
    }
  }, [showCalculation, isFormValid])

  return (
    <div className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <SafeAreaHeader title="Шумоизоляция шин" showBackButton backUrl="/" className="bg-white dark:bg-[#1F1F1F]" />

      <main className="flex-1 p-4 pb-4 space-y-6 pt-[calc(60px+env(safe-area-inset-top)+1rem)]">
        {/* Service Description */}
        <Card className="bg-white dark:bg-[#2A2A2A] border-none shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-[#1F1F1F] dark:text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-[#c4d402]" />О услуге шумоизоляции
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative h-48 rounded-lg overflow-hidden">
              <video
                src="/videos/soundproofing-demo.mp4"
                className="w-full h-full object-cover"
                controls
                muted
                playsInline
                preload="metadata"
                loop
                autoPlay
              >
                Ваш браузер не поддерживает воспроизведение видео.
              </video>
            </div>
            <div className="space-y-3 text-sm text-[#1F1F1F] dark:text-gray-200">
              <p>
                Профессиональная шумоизоляция шин значительно снижает уровень дорожного шума и повышает комфорт
                вождения.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-[#c4d402]">Преимущества:</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Снижение шума до 5 дБ</li>
                    <li>• Улучшение комфорта</li>
                    <li>• Качественные материалы</li>
                    <li>• Долговечность</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-[#c4d402]">Процесс:</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Демонтаж шин (не включено в стоимость)</li>
                    <li>• Подготовка поверхности</li>
                    <li>• Установка материала</li>
                    <li>• Монтаж обратно</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Size Calculator */}
        <Card className="bg-white dark:bg-[#2A2A2A] border-none shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-[#1F1F1F] dark:text-white flex items-center gap-2">
              <Calculator className="h-5 w-5 text-[#c4d402]" />
              Калькулятор стоимости
            </CardTitle>
          </CardHeader>

          {/* Price Note */}
          <div className="bg-yellow-600 bg-opacity-20 border border-yellow-500 rounded-lg p-3 mb-4 mx-6">
            <p className="text-sm text-yellow-200">
              <strong>Примечание:</strong> В стоимость не включены шиномонтажные работы. Цена актуальна только при
              предоставлении снятых шин.
            </p>
          </div>

          <CardContent className="space-y-4">
            <div className="space-y-4">
              {/* My Garage Section */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#1F1F1F] dark:text-white">Мой гараж</label>
                <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-2">
                  {userCars.map((car) => {
                    const [width, profile, diameter] = car.tireSize.split(/[/\s]/)
                    const cleanDiameter = diameter.replace("R", "")

                    return (
                      <div
                        key={car.id}
                        className="flex-shrink-0"
                        onClick={() => {
                          setSelectedWidth(width)
                          setSelectedProfile(profile)
                          setSelectedDiameter(cleanDiameter)
                        }}
                      >
                        <div className="px-3 py-2 bg-[#F5F5F5] dark:bg-[#333333] rounded-lg border border-transparent hover:border-[#c4d402] cursor-pointer transition-colors flex flex-col min-w-[140px]">
                          <p className="font-medium text-[#1F1F1F] dark:text-white text-sm whitespace-nowrap">
                            {car.brand} {car.model} {car.year}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{car.tireSize}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F1F1F] dark:text-white mb-2">Размер шины</label>
                <div className="grid grid-cols-3 gap-2">
                  <Select value={selectedWidth} onValueChange={setSelectedWidth}>
                    <SelectTrigger className="bg-[#F5F5F5] dark:bg-[#333333] border-none">
                      <SelectValue placeholder="Ширина" />
                    </SelectTrigger>
                    <SelectContent>
                      {widthOptions.map((width) => (
                        <SelectItem key={width} value={width}>
                          {width}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                    <SelectTrigger className="bg-[#F5F5F5] dark:bg-[#333333] border-none">
                      <SelectValue placeholder="Профиль" />
                    </SelectTrigger>
                    <SelectContent>
                      {profileOptions.map((profile) => (
                        <SelectItem key={profile} value={profile}>
                          {profile}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDiameter} onValueChange={setSelectedDiameter}>
                    <SelectTrigger className="bg-[#F5F5F5] dark:bg-[#333333] border-none">
                      <SelectValue placeholder="Диаметр" />
                    </SelectTrigger>
                    <SelectContent>
                      {tireSizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          R{size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedWidth && selectedProfile && selectedDiameter && (
                  <div className="mt-2 p-2 bg-[#F5F5F5] dark:bg-[#333333] rounded-lg">
                    <p className="text-sm font-medium text-[#1F1F1F] dark:text-white">
                      Выбранный размер: {selectedWidth}/{selectedProfile} R{selectedDiameter}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#1F1F1F] dark:text-white mb-2">
                    Количество шин
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 p-0"
                    >
                      -
                    </Button>
                    <span className="text-lg font-semibold text-[#1F1F1F] dark:text-white min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.min(8, quantity + 1))}
                      className="h-10 w-10 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleCalculate}
                  disabled={!isFormValid}
                  className="h-10 px-6 bg-[#c4d402] hover:bg-[#c4d402]/90 text-[#1F1F1F] font-semibold whitespace-nowrap"
                >
                  Рассчитать стоимость
                </Button>
              </div>
            </div>

            {/* Calculation Results */}
            {showCalculation && isFormValid && (
              <div ref={calculationResultsRef} className="mt-6 p-4 bg-[#F5F5F5] dark:bg-[#333333] rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#1F1F1F] dark:text-white">Размер шины:</span>
                  <Badge variant="secondary" className="bg-[#c4d402] text-[#1F1F1F]">
                    {selectedWidth}/{selectedProfile} R{selectedDiameter}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#1F1F1F] dark:text-white">Количество:</span>
                  <span className="font-semibold text-[#1F1F1F] dark:text-white">{quantity} шт.</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#1F1F1F] dark:text-white">Цена за шину:</span>
                  <span className="font-semibold text-[#1F1F1F] dark:text-white">
                    {soundproofingPrices[selectedDiameter as keyof typeof soundproofingPrices]?.price || 0} ₽
                  </span>
                </div>
                <hr className="border-gray-300 dark:border-gray-600" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#1F1F1F] dark:text-white">Шумоизоляция:</span>
                  <span className="text-xl font-bold text-[#c4d402]">{calculatePrice()} ₽</span>
                </div>

                {/* Tire Mounting Services Display */}
                {tireMountingServices && (
                  <>
                    <hr className="border-gray-300 dark:border-gray-600" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[#1F1F1F] dark:text-white">Услуги шиномонтажа:</h4>
                      {Object.entries(tireMountingServices.selectedServices || {}).map(([key, service]) => (
                        <div key={key} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 dark:text-gray-300">{service.name}</span>
                          <span className="text-[#1F1F1F] dark:text-white">
                            {service.quantity}x {service.price}₽ = {service.total}₽
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-2 border-t border-gray-300 dark:border-gray-600">
                        <span className="text-lg font-bold text-[#1F1F1F] dark:text-white">Шиномонтаж:</span>
                        <span className="text-xl font-bold text-[#009CFF]">
                          {tireMountingServices.totalPrice || 0} ₽
                        </span>
                      </div>
                    </div>
                    <hr className="border-gray-300 dark:border-gray-600" />
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">ОБЩАЯ СТОИМОСТЬ:</span>
                      <span className="text-2xl font-bold text-green-600">
                        {calculatePrice() + (tireMountingServices.totalPrice || 0)} ₽
                      </span>
                    </div>
                  </>
                )}

                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{getDescription()}</p>

                <div className="mt-4 space-y-2">
                  {!tireMountingServices ? (
                    <div className="grid grid-cols-2 gap-2 items-stretch">
                      <button
                        onClick={() => {
                          // Save current soundproofing data to localStorage
                          const soundproofingData = {
                            selectedWidth,
                            selectedProfile,
                            selectedDiameter,
                            quantity,
                            showCalculation,
                            calculatedPrice: calculatePrice(),
                            returnUrl: "/soundproofing",
                          }
                          localStorage.setItem("soundproofingData", JSON.stringify(soundproofingData))

                          // Navigate to tire mounting page
                          window.location.href = "/tire-mounting?returnTo=soundproofing"
                        }}
                        className="w-full h-full bg-[#009CFF]/80 hover:bg-[#009CFF]/80 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <span>🔧</span>
                        <span className="text-sm">Добавить шиномонтаж</span>
                      </button>
                      <Link href="/soundproofing/booking" className="flex-1">
                        <Button className="w-full h-full bg-[#c4d402] hover:bg-[#c4d402]/90 text-[#1F1F1F]">
                          <span className="sm:hidden">Записаться</span>
                          <span className="hidden sm:block">Записаться на шумоизоляцию</span>
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          setTireMountingServices(null)
                          localStorage.removeItem("tireMountingSelectedServices")
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        Убрать
                      </button>
                      <Link href="/soundproofing/booking" className="col-span-2">
                        <Button className="w-full bg-[#009CFF] hover:bg-[#009CFF]/90 text-white">
                          Записаться на комплекс услуг
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="bg-white dark:bg-[#2A2A2A] border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1F1F1F] dark:text-white">Дополнительная информация</h3>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="p-3 bg-[#F5F5F5] dark:bg-[#333333] rounded-lg">
                  <h4 className="font-medium text-[#c4d402] mb-1">Время выполнения</h4>
                  <p className="text-[#1F1F1F] dark:text-gray-200">30 мин - 1 час только по записи</p>
                </div>
                <div className="p-3 bg-[#F5F5F5] dark:bg-[#333333] rounded-lg">
                  <h4 className="font-medium text-[#c4d402] mb-1">Гарантия</h4>
                  <p className="text-[#1F1F1F] dark:text-gray-200">12 месяцев на материалы и работу</p>
                </div>
                <div className="p-3 bg-[#F5F5F5] dark:bg-[#333333] rounded-lg">
                  <h4 className="font-medium text-[#c4d402] mb-1">Материалы</h4>
                  <p className="text-[#1F1F1F] dark:text-gray-200">Высококачественная звукоизоляция премиум класса</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
