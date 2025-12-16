"use client"

import { useState, useEffect } from "react"
import { Calculator, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SafeAreaHeader from "@/components/safe-area-header"
import Link from "next/link"

// Price per stud
const STUD_PRICES = {
  new: 10,
  repair: 20,
}

// Recommended studs by tire size
const recommendedStuds = {
  "13": { min: 60, max: 80, recommended: 70 },
  "14": { min: 70, max: 90, recommended: 80 },
  "15": { min: 80, max: 100, recommended: 90 },
  "16": { min: 90, max: 110, recommended: 100 },
  "17": { min: 100, max: 120, recommended: 110 },
  "18": { min: 110, max: 130, recommended: 120 },
  "19": { min: 120, max: 140, recommended: 130 },
  "20": { min: 130, max: 150, recommended: 140 },
  "21": { min: 140, max: 160, recommended: 150 },
  "22": { min: 150, max: 170, recommended: 160 },
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

export default function StuddingPage() {
  const [selectedWidth, setSelectedWidth] = useState("")
  const [selectedProfile, setSelectedProfile] = useState("")
  const [selectedDiameter, setSelectedDiameter] = useState("")
  const [quantity, setQuantity] = useState(4) // Number of tires
  const [studsPerTire, setStudsPerTire] = useState(1) // Number of studs per tire
  const [showCalculation, setShowCalculation] = useState(false)
  const [studType, setStudType] = useState<"new" | "repair">("new")
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

  const STUD_PRICE = STUD_PRICES[studType] // Declare STUD_PRICE variable

  useEffect(() => {
    // В реальном приложении здесь будет API вызов для получения автомобилей пользователя
    // fetchUserCars().then(setUserCars)
  }, [])

  // Update recommended studs when diameter changes
  // useEffect(() => {
  //   if (selectedDiameter && recommendedStuds[selectedDiameter as keyof typeof recommendedStuds]) {
  //     setStudsPerTire(recommendedStuds[selectedDiameter as keyof typeof recommendedStuds].recommended)
  //   } else {
  //     setStudsPerTire(0)
  //   }
  // }, [selectedDiameter])

  const calculatePrice = () => {
    return studsPerTire * STUD_PRICE
  }

  const getRecommendedRange = () => {
    if (!selectedDiameter) return { min: 0, max: 0 }
    return {
      min: recommendedStuds[selectedDiameter as keyof typeof recommendedStuds]?.min || 0,
      max: recommendedStuds[selectedDiameter as keyof typeof recommendedStuds]?.max || 0,
    }
  }

  const isFormValid = studsPerTire >= 1

  useEffect(() => {
    setShowCalculation(isFormValid)
  }, [isFormValid])

  return (
    <div className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <SafeAreaHeader title="Дошиповка шин" showBackButton backUrl="/" className="bg-white dark:bg-[#1F1F1F]" />

      <main className="flex-1 p-4 pb-20 space-y-6 pt-[calc(60px+env(safe-area-inset-top)+1rem)]">
        {/* Service Description */}
        <Card className="bg-white dark:bg-[#2A2A2A] border-none shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-[#1F1F1F] dark:text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-[#c4d402]" />О услуге дошиповки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
              <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                poster="/placeholder.svg?height=200&width=400&text=Дошиповка%20шин"
              >
                <source src="/videos/shipovka.mp4" type="video/mp4" />
                Ваш браузер не поддерживает воспроизведение видео.
              </video>
            </div>
            <div className="space-y-3 text-sm text-[#1F1F1F] dark:text-gray-200">
              <p>
                Профессиональная дошиповка шин увеличивает сцепление с дорогой в зимних условиях и повышает безопасность
                вождения на скользких поверхностях.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-[#c4d402]">Преимущества:</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Улучшенное сцепление на льду</li>
                    <li>• Повышенная безопасность</li>
                    <li>• Качественные шипы</li>
                    <li>• Профессиональная установка</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-[#c4d402]">Процесс:</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Осмотр шин</li>
                    <li>• Разметка мест установки</li>
                    <li>• Сверление отверстий (только для шин М/Т)</li>
                    <li>• Установка шипов</li>
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
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Посчитайте и введите необходимое количество шипов
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1F1F1F] dark:text-white mb-3">Тип шипов</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setStudType("new")}
                    className={`flex flex-col items-center p-3 rounded-lg border text-sm font-medium transition-colors ${
                      studType === "new"
                        ? "bg-[#c4d402] text-[#1F1F1F] border-[#c4d402]"
                        : "bg-white dark:bg-[#333333] text-[#1F1F1F] dark:text-white border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/studl23.jpg-xBsMJXQAcPuKHbMVh4HriMh2flB9AR.png"
                      alt="Шипы для новых шин"
                      className="w-12 h-12 mx-auto mb-2 object-contain"
                    />
                    Шипы для новых шин
                  </button>
                  <button
                    onClick={() => setStudType("repair")}
                    className={`flex flex-col items-center p-3 rounded-lg border text-sm font-medium transition-colors ${
                      studType === "repair"
                        ? "bg-[#c4d402] text-[#1F1F1F] border-[#c4d402]"
                        : "bg-white dark:bg-[#333333] text-[#1F1F1F] dark:text-white border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/studl22.jpg-xSPZQSIBbj31AO6kPIo0EzGTbLioaR.png"
                      alt="Ремонтные шипы"
                      className="w-12 h-12 mx-auto mb-2 object-contain"
                    />
                    Ремонтные шипы
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setStudsPerTire(studsPerTire - 1)}
                  disabled={studsPerTire <= 1}
                  className="h-10 w-10 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-[#c4d402] hover:bg-[#c4d402] hover:text-[#1F1F1F]"
                >
                  <span className="text-lg font-bold">−</span>
                </Button>

                <div className="flex-1">
                  <input
                    type="number"
                    value={studsPerTire}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value) || 1
                      setStudsPerTire(value)
                    }}
                    className="w-full px-4 py-3 text-center text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#333333] text-[#1F1F1F] dark:text-white focus:border-[#c4d402] focus:outline-none"
                    placeholder="Количество шипов"
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setStudsPerTire(studsPerTire + 1)}
                  disabled={false}
                  className="h-10 w-10 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-[#c4d402] hover:bg-[#c4d402] hover:text-[#1F1F1F]"
                >
                  <span className="text-lg font-bold">+</span>
                </Button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#F5F5F5] dark:bg-[#333333] rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#1F1F1F] dark:text-white">Количество шипов:</span>
                <span className="font-semibold text-[#1F1F1F] dark:text-white">{studsPerTire} шт.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#1F1F1F] dark:text-white">Цена за шип:</span>
                <span className="font-semibold text-[#1F1F1F] dark:text-white">{STUD_PRICES[studType]} ₽</span>
              </div>
              <hr className="border-gray-300 dark:border-gray-600" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#1F1F1F] dark:text-white">Итого:</span>
                <span className="text-xl font-bold text-[#c4d402]">{calculatePrice()} ₽</span>
              </div>

              <div className="mt-4 space-y-2">
                <Link href="/studding/booking">
                  <Button className="w-full bg-[#009CFF] hover:bg-[#009CFF]/90 text-white">
                    Записаться на дошиповку
                  </Button>
                </Link>
              </div>
            </div>
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
                  <p className="text-[#1F1F1F] dark:text-gray-200">1-3 часа в зависимости от количества шипов</p>
                </div>
                <div className="p-3 bg-[#F5F5F5] dark:bg-[#333333] rounded-lg">
                  <h4 className="font-medium text-[#c4d402] mb-1">Гарантия</h4>
                  <p className="text-[#1F1F1F] dark:text-gray-200">6 месяцев на установленные шипы</p>
                </div>
                <div className="p-3 bg-[#F5F5F5] dark:bg-[#333333] rounded-lg">
                  <h4 className="font-medium text-[#c4d402] mb-1">Материалы</h4>
                  <p className="text-[#1F1F1F] dark:text-gray-200">
                    Высококачественные шипы с твердосплавным сердечником
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
