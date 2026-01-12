"use client"

import Image from "next/image"
import SafeAreaHeader from "@/components/safe-area-header"
import BottomNavigation from "@/components/bottom-navigation"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSafeWindow } from "@/hooks/use-safe-window"

// Pricing data based on goroshina.ru/fitting/
const pricingData = {
  "wheel-removal": {
    r13: 200,
    r14: 200,
    r15: 250,
    r16: 250,
    r17: 300,
    r18: 300,
    r19: 350,
    r20: 350,
    r21: 400,
    r22: 400,
  },
  "tire-removal": {
    r13: 400,
    r14: 450,
    r15: 500,
    r16: 550,
    r17: 600,
    r18: 650,
    r19: 700,
    r20: 750,
    r21: 800,
    r22: 850,
  },
  "tire-installation": {
    r13: 400,
    r14: 450,
    r15: 500,
    r16: 550,
    r17: 600,
    r18: 650,
    r19: 700,
    r20: 750,
    r21: 800,
    r22: 850,
  },
  balancing: {
    r13: 350,
    r14: 400,
    r15: 450,
    r16: 500,
    r17: 550,
    r18: 600,
    r19: 650,
    r20: 700,
    r21: 750,
    r22: 800,
  },
  "wheel-installation": {
    r13: 200,
    r14: 200,
    r15: 250,
    r16: 250,
    r17: 300,
    r18: 300,
    r19: 350,
    r20: 350,
    r21: 400,
    r22: 400,
  },
  "tire-complex-1": {
    r13: 1200,
    r14: 1400,
    r15: 1600,
    r16: 1800,
    r17: 2000,
    r18: 2200,
    r19: 2400,
    r20: 2600,
    r21: 2800,
    r22: 3000,
  },
  "tire-complex-4": {
    r13: 4800,
    r14: 5600,
    r15: 6400,
    r16: 7200,
    r17: 8000,
    r18: 8800,
    r19: 9600,
    r20: 10400,
    r21: 11200,
    r22: 12000,
  },
}

const serviceNames = {
  "wheel-removal": "Снятие колеса с машины",
  "tire-removal": "Снятие резины с диска",
  "tire-installation": "Установка резины на диск",
  balancing: "Балансировка",
  "wheel-installation": "Установка колеса на машину",
  "tire-complex-1": "Шиномонтажный комплекс 1шт",
  "tire-complex-4": "Шиномонтажный комплекс 4шт",
}

export default function TireMountingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isClient, localStorage } = useSafeWindow()

  const [carType, setCarType] = useState("")
  const [diameter, setDiameter] = useState("")
  const [totalPrice, setTotalPrice] = useState(0)
  const [userCars, setUserCars] = useState([])
  const [isLoadingCars, setIsLoadingCars] = useState(true)
  const [selectedCar, setSelectedCar] = useState("")
  const [serviceQuantities, setServiceQuantities] = useState({})
  const [selectedServices, setSelectedServices] = useState({})
  const [highlightCarType, setHighlightCarType] = useState(false)
  const [showCarTypeInfoModal, setShowCarTypeInfoModal] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [promoApplied, setPromoApplied] = useState(false)

  // Calculate total price based on selected services
  useEffect(() => {
    if (diameter) {
      let total = 0
      Object.entries(serviceQuantities).forEach(([serviceKey, quantity]) => {
        if (quantity > 0) {
          const price = pricingData[serviceKey]?.[diameter] || 0
          total += price * quantity
        }
      })

      const discountedTotal = total * (1 - discount)
      setTotalPrice(discountedTotal)

      const services = {}
      Object.entries(serviceQuantities).forEach(([serviceKey, quantity]) => {
        if (quantity > 0) {
          services[serviceKey] = {
            name: serviceNames[serviceKey],
            quantity,
            price: pricingData[serviceKey]?.[diameter] || 0,
            total: (pricingData[serviceKey]?.[diameter] || 0) * quantity,
          }
        }
      })
      setSelectedServices(services)
    } else {
      setTotalPrice(0)
      setSelectedServices({})
    }
  }, [serviceQuantities, diameter, discount])

  // Fetch user cars
  useEffect(() => {
    const fetchUserCars = async () => {
      try {
        setIsLoadingCars(true)
        const userCarsFromAccount = [
          {
            id: "1",
            name: "Toyota Camry 2019",
            year: 2019,
            make: "Toyota",
            model: "Camry",
            licensePlate: "А123БВ777",
            displayName: "Toyota Camry 2019",
            tireDiameter: "r17",
            carType: "passenger",
          },
          {
            id: "2",
            name: "Volkswagen Tiguan 2020",
            year: 2020,
            make: "Volkswagen",
            model: "Tiguan",
            licensePlate: "Е456ЖЗ777",
            displayName: "Volkswagen Tiguan 2020",
            tireDiameter: "r18",
            carType: "suv",
          },
        ]
        setUserCars(userCarsFromAccount)
      } catch (error) {
        console.error("Failed to fetch user cars:", error)
        setUserCars([])
      } finally {
        setIsLoadingCars(false)
      }
    }

    fetchUserCars()
  }, [])

  // Load data from localStorage
  useEffect(() => {
    if (!isClient) return

    const returnTo = searchParams.get("returnTo")

    try {
      const paintingData = localStorage?.getItem("paintingBookingData")
      if (paintingData) {
        const data = JSON.parse(paintingData)
        if (data.diameter) {
          setDiameter(data.diameter)
        }
        if (data.carType) {
          setCarType(data.carType)
        }
      }
    } catch (error) {
      console.error("Error parsing painting data:", error)
    }

    if (returnTo === "soundproofing") {
      try {
        const soundproofingData = localStorage?.getItem("soundproofingData")
        if (soundproofingData) {
          const data = JSON.parse(soundproofingData)
          if (data.selectedDiameter) {
            setDiameter(`r${data.selectedDiameter}`)
          }
          if (data.carType) {
            setCarType(data.carType)
          }
        }
      } catch (error) {
        console.error("Error parsing soundproofing data:", error)
      }
    }
  }, [isClient, searchParams, localStorage])

  useEffect(() => {
    if (carType) {
      setHighlightCarType(false)
    }
  }, [carType])

  const incrementService = (serviceKey) => {
    setServiceQuantities((prev) => ({
      ...prev,
      [serviceKey]: (prev[serviceKey] || 0) + 1,
    }))
  }

  const decrementService = (serviceKey) => {
    setServiceQuantities((prev) => ({
      ...prev,
      [serviceKey]: Math.max((prev[serviceKey] || 0) - 1, 0),
    }))
  }

  const safeNavigate = (url) => {
    if (isClient) {
      router.push(url)
    }
  }

  const safeSetStorage = (key, value) => {
    if (isClient && localStorage) {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    }
  }

  const downloadPriceList = () => {
    if (!isClient) return
    const fileUrl = "/price-list.txt"
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = "price-list.txt"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#d9d9dd] dark:bg-[#1F1F1F] text-gray-900 dark:text-white">
      <SafeAreaHeader title="Шиномонтаж" showBackButton backUrl="/" />

      <main className="flex-1 pt-[calc(60px+env(safe-area-inset-top)+1rem)] relative">
        <Image
          src="/images/bacho-jack-top-right.png"
          alt="Гидравлический домкрат"
          width={160} // Adjusted width for better visibility
          height={160} // Adjusted height for better visibility
          className="absolute top-0 right-0 z-50 object-contain" // Positioning and layering
        />
        <div className="px-4 py-6 text-gray-900 dark:text-white">
          <div className="bg-white dark:bg-[#2A2A2A] rounded-lg p-4 space-y-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Мой гараж</label>
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {isLoadingCars ? (
                  <div className="text-xs px-2 py-0.5 text-gray-400">Загрузка автомобилей...</div>
                ) : (
                  <>
                    {userCars.map((car) => (
                      <button
                        key={car.id}
                        onClick={() => {
                          setSelectedCar(car.id)
                          setDiameter(car.tireDiameter)
                          setCarType(car.carType)
                        }}
                        className={`text-xs px-2 py-0.5 rounded-md border whitespace-nowrap flex-shrink-0 transition-colors ${
                          selectedCar === car.id
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "bg-white dark:bg-[#333333] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#3A3A3A]"
                        }`}
                      >
                        {car.displayName}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">Тип авто</label>
                  <button
                    onClick={() => setShowCarTypeInfoModal(true)}
                    className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600 transition-colors"
                    title="Информация о типах автомобилей"
                  >
                    !
                  </button>
                </div>
                <select
                  value={carType}
                  onChange={(e) => setCarType(e.target.value)}
                  className={`w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    highlightCarType
                      ? "bg-red-100 dark:bg-red-900/30 border-2 border-red-500 text-red-900 dark:text-red-300 animate-pulse shadow-lg shadow-red-500/50"
                      : carType === ""
                        ? "bg-white dark:bg-[#333333] text-gray-900 dark:text-white border-2 border-red-500 focus:ring-red-500"
                        : "bg-white dark:bg-[#333333] border-2 border-[#c4d402] text-gray-900 dark:text-white focus:ring-blue-500"
                  }`}
                >
                  <option value="">Выберите тип автомобиля</option>
                  <option value="passenger">Легковой авто</option>
                  <option value="crossover">Кроссовер</option>
                  <option value="jeep">Джип</option>
                  <option value="commercial">Коммерческий транспорт</option>
                  <option value="gazel">Газель</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Диаметр шины (R)</label>
                <select
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
                  className={`w-full text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                    diameter === ""
                      ? "bg-white dark:bg-[#333333] border-2 border-red-500 focus:ring-red-500"
                      : "bg-white dark:bg-[#333333] border-2 border-[#c4d402] focus:ring-blue-500"
                  }`}
                >
                  <option value="">Выберите диаметр</option>
                  <option value="r13">R13</option>
                  <option value="r14">R14</option>
                  <option value="r15">R15</option>
                  <option value="r16">R16</option>
                  <option value="r17">R17</option>
                  <option value="r18">R18</option>
                  <option value="r19">R19</option>
                  <option value="r20">R20</option>
                  <option value="r21">R21</option>
                  <option value="r22">R22</option>
                </select>
              </div>

              <div className="bg-gray-50 dark:bg-[#333333] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Комплекс шиномонтажных работ</h3>
                {(() => {
                  const isServiceSelectionDisabled = !carType || !diameter
                  return (
                    <div className={isServiceSelectionDisabled ? "opacity-50 pointer-events-none" : ""}>
                      {isServiceSelectionDisabled && (
                        <p className="text-xs text-gray-400 mb-3">(выберите тип автомобиля и диаметр шины)</p>
                      )}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex-1 rounded-lg px-3 py-2 text-center flex flex-col items-center justify-center bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-[#333333] transition-all duration-200 border border-gray-200 dark:border-gray-700"
                            onClick={() => {
                              setServiceQuantities((prev) => ({
                                ...prev,
                                "wheel-removal": (prev["wheel-removal"] || 0) + 1,
                                "tire-removal": (prev["tire-removal"] || 0) + 1,
                                "tire-installation": (prev["tire-installation"] || 0) + 1,
                                balancing: (prev["balancing"] || 0) + 1,
                                "wheel-installation": (prev["wheel-installation"] || 0) + 1,
                              }))
                            }}
                          >
                            <div className="font-medium">Шиномонтажный комплекс 1шт</div>
                            <div className="text-xs text-gray-400">Снятие, монтаж, балансировка, установка</div>
                            {diameter && (
                              <div className="flex justify-end mt-2">
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {pricingData["tire-complex-1"]?.[diameter] || 0} ₽
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setServiceQuantities((prev) => ({
                                  ...prev,
                                  "wheel-removal": (prev["wheel-removal"] || 0) + 1,
                                  "tire-removal": (prev["tire-removal"] || 0) + 1,
                                  "tire-installation": (prev["tire-installation"] || 0) + 1,
                                  balancing: (prev["balancing"] || 0) + 1,
                                  "wheel-installation": (prev["wheel-installation"] || 0) + 1,
                                }))
                              }}
                              disabled={isServiceSelectionDisabled}
                              className="w-12 h-12 bg-[#c4d402] text-black rounded-lg flex items-center justify-center hover:bg-[#c5d135] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold"
                            >
                              +
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setServiceQuantities((prev) => ({
                                  ...prev,
                                  "wheel-removal": Math.max((prev["wheel-removal"] || 0) - 1, 0),
                                  "tire-removal": Math.max((prev["tire-removal"] || 0) - 1, 0),
                                  "tire-installation": Math.max((prev["tire-installation"] || 0) - 1, 0),
                                  balancing: Math.max((prev["balancing"] || 0) - 1, 0),
                                  "wheel-installation": Math.max((prev["wheel-installation"] || 0) - 1, 0),
                                }))
                              }}
                              disabled={isServiceSelectionDisabled}
                              className="w-12 h-12 bg-gray-200 dark:bg-[#333333] text-gray-900 dark:text-white rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold"
                            >
                              -
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div
                            className="flex-1 rounded-lg px-3 py-2 text-center flex flex-col items-center justify-center bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-[#333333] transition-all duration-200 border border-gray-200 dark:border-gray-700"
                            onClick={() => {
                              setServiceQuantities((prev) => ({
                                ...prev,
                                "wheel-removal": (prev["wheel-removal"] || 0) + 4,
                                "tire-removal": (prev["tire-removal"] || 0) + 4,
                                "tire-installation": (prev["tire-installation"] || 0) + 4,
                                balancing: (prev["balancing"] || 0) + 4,
                                "wheel-installation": (prev["wheel-installation"] || 0) + 4,
                              }))
                            }}
                          >
                            <div className="font-medium">Шиномонтажный комплекс 4шт</div>
                            <div className="text-xs text-gray-400">
                              Снятие, монтаж, балансировка, установка (4 колеса)
                            </div>
                            {diameter && (
                              <div className="flex justify-end mt-2">
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {pricingData["tire-complex-4"]?.[diameter] || 0} ₽
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setServiceQuantities((prev) => ({
                                  ...prev,
                                  "wheel-removal": (prev["wheel-removal"] || 0) + 4,
                                  "tire-removal": (prev["tire-removal"] || 0) + 4,
                                  "tire-installation": (prev["tire-installation"] || 0) + 4,
                                  balancing: (prev["balancing"] || 0) + 4,
                                  "wheel-installation": (prev["wheel-installation"] || 0) + 4,
                                }))
                              }}
                              disabled={isServiceSelectionDisabled}
                              className="w-12 h-12 bg-[#c4d402] text-black rounded-lg flex items-center justify-center hover:bg-[#c5d135] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold"
                            >
                              +
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setServiceQuantities((prev) => ({
                                  ...prev,
                                  "wheel-removal": Math.max((prev["wheel-removal"] || 0) - 4, 0),
                                  "tire-removal": Math.max((prev["tire-removal"] || 0) - 4, 0),
                                  "tire-installation": Math.max((prev["tire-installation"] || 0) - 4, 0),
                                  balancing: Math.max((prev["balancing"] || 0) - 4, 0),
                                  "wheel-installation": Math.max((prev["wheel-installation"] || 0) - 4, 0),
                                }))
                              }}
                              disabled={isServiceSelectionDisabled}
                              className="w-12 h-12 bg-gray-200 dark:bg-[#333333] text-gray-900 dark:text-white rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold"
                            >
                              -
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>

              <div className="bg-gray-50 dark:bg-[#333333] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Общие услуги</h3>
                  <button
                    onClick={() => {
                      setServiceQuantities({})
                    }}
                    className="bg-gray-200 dark:bg-[#333333] hover:bg-gray-300 dark:hover:bg-[#3A3A3A] text-gray-900 dark:text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                  >
                    Сброс
                  </button>
                </div>
                {(() => {
                  const isServiceSelectionDisabled = !carType || !diameter
                  const additionalServices = {
                    "wheel-removal": "Снятие колеса с машины",
                    "tire-removal": "Снятие резины с диска",
                    "tire-installation": "Установка резины на диск",
                    balancing: "Балансировка",
                    "wheel-installation": "Установка колеса на машину",
                  }
                  return (
                    <div className={isServiceSelectionDisabled ? "opacity-50 pointer-events-none" : ""}>
                      {isServiceSelectionDisabled && (
                        <p className="text-xs text-gray-400 mb-3">(выберите тип автомобиля и диаметр шины)</p>
                      )}
                      <div className="space-y-2">
                        {Object.entries(additionalServices).map(([key, name]) => (
                          <div key={key} className="flex items-center gap-2">
                            <div className="flex-1 rounded-lg px-3 py-2 bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                              {name}
                              {diameter && (
                                <span className="text-sm text-gray-400 ml-2">
                                  {pricingData[key]?.[diameter] || 0} ₽
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => decrementService(key)}
                              disabled={isServiceSelectionDisabled}
                              className="w-10 h-10 bg-gray-200 dark:bg-[#333333] text-gray-900 dark:text-white rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              -
                            </button>
                            <div className="w-10 h-10 bg-gray-100 dark:bg-[#333333] text-gray-900 dark:text-white rounded-lg flex items-center justify-center text-sm font-medium border border-gray-200 dark:border-gray-700">
                              {serviceQuantities[key] || 0}
                            </div>
                            <button
                              onClick={() => incrementService(key)}
                              disabled={isServiceSelectionDisabled}
                              className="w-10 h-10 bg-[#c4d402] text-black rounded-lg flex items-center justify-center hover:bg-[#c5d135] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>

              <div className="pt-4 flex gap-4 items-stretch">
                <div className="w-3/5 bg-white dark:bg-[#2A2A2A] rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Выбранные услуги:</span>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {Object.keys(selectedServices).length === 0 ? (
                      <div className="text-xs text-gray-400">Услуги не выбраны</div>
                    ) : (
                      Object.entries(selectedServices).map(([key, service]) => (
                        <div key={key} className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">{service.name}</span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {service.quantity}x {service.price}₽ = {service.total}₽
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="border-t border-gray-300 mt-3 pt-2">
                    {discount > 0 && (
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
                        <span>Без скидки:</span>
                        <span className="line-through">{Math.round(totalPrice / (1 - discount))} ₽</span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between items-center text-sm text-green-600 mb-1">
                        <span>Скидка ({Math.round(discount * 100)}%):</span>
                        <span>-{Math.round((totalPrice / (1 - discount)) * discount)} ₽</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Итого:</span>
                      <span className="text-xl font-bold text-blue-600">{Math.round(totalPrice)} ₽</span>
                    </div>
                  </div>
                </div>
                <div className="w-2/5 flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Промокод"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value)
                      if (e.target.value.toLowerCase() === "жизнь") {
                        setDiscount(0.15)
                        setPromoApplied(true)
                      } else {
                        setDiscount(0)
                        setPromoApplied(false)
                      }
                    }}
                    className={`w-full bg-white dark:bg-[#333333] text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border dark:border-gray-700 text-center ${
                      promoApplied ? "border-green-500 bg-green-50" : "border-gray-300"
                    }`}
                  />
                  {promoApplied && (
                    <div className="text-green-600 text-xs text-center font-medium">Промокод "ЖИЗНЬ" применен! Скидка 15%</div>
                  )}
                  <button
                    className="w-full bg-gray-200 dark:bg-[#333333] hover:bg-gray-300 dark:hover:bg-[#3A3A3A] text-gray-900 dark:text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    onClick={downloadPriceList}
                  >
                    Скачать полный прайс
                  </button>
                  <div className="mt-4 space-y-2">
                    {(() => {
                      const returnTo = searchParams.get("returnTo")

                      if (returnTo === "soundproofing") {
                        return (
                          <>
                            <button
                              className="w-full bg-[#009CFF] hover:bg-[#009CFF]/90 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={Object.keys(selectedServices).length === 0 || !diameter}
                              onClick={() => {
                                const tireMountingServices = {
                                  selectedServices,
                                  totalPrice,
                                  diameter,
                                  carType,
                                }
                                safeSetStorage("tireMountingSelectedServices", tireMountingServices)
                                safeNavigate("/soundproofing?returnFrom=tire-mounting")
                              }}
                            >
                              {Object.keys(selectedServices).length === 0
                                ? "Выберите услуги"
                                : !diameter
                                  ? "Выберите диаметр шины"
                                  : `Добавить к заказу шумоизоляции (${totalPrice} ₽)`}
                            </button>
                            <button
                              className="w-full bg-gray-200 dark:bg-[#333333] hover:bg-gray-300 dark:hover:bg-[#3A3A3A] text-gray-900 dark:text-white py-2 px-4 rounded-lg font-medium transition-colors"
                              onClick={() => safeNavigate("/soundproofing")}
                            >
                              Вернуться без добавления
                            </button>
                          </>
                        )
                      } else if (returnTo === "painting") {
                        return (
                          <button
                            className="w-full bg-[#c4d402] hover:bg-[#c5d135] text-black py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={Object.keys(selectedServices).length === 0 || !diameter}
                            onClick={() => {
                              const tireMountingServices = {
                                selectedServices,
                                totalPrice,
                                diameter,
                                carType,
                              }
                              safeSetStorage("tireMountingSelectedServices", tireMountingServices)
                              safeNavigate("/painting?returnFrom=tire-mounting")
                            }}
                          >
                            {Object.keys(selectedServices).length === 0
                              ? "Выберите услуги"
                              : !diameter
                                ? "Выберите диаметр шины"
                                : "Добавить к заказу покраски"}
                          </button>
                        )
                      } else {
                        return (
                          <button
                            className="w-full bg-[#c4d402] hover:bg-[#c5d135] text-black py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={Object.keys(selectedServices).length === 0 || !diameter}
                            onClick={() => {
                              const tireMountingBookingData = {
                                selectedServices,
                                totalPrice,
                                diameter,
                                carType,
                              }
                              safeSetStorage("tireMountingBookingData", tireMountingBookingData)
                              safeNavigate("/tire-mounting/booking")
                            }}
                          >
                            {Object.keys(selectedServices).length === 0
                              ? "Выберите услуги"
                              : !diameter
                                ? "Выберите диаметр шины"
                                : "Записаться на услугу"}
                          </button>
                        )
                      }
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 text-gray-900 dark:text-white">
          <h2 className="text-xl font-bold mb-4">НАШИ РАБОТЫ</h2>
          <div className="mb-6">
            <div className="w-full aspect-video bg-gray-200 dark:bg-[#333333] rounded-lg overflow-hidden flex items-center justify-center">
              <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                <source
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3030-VijVlfs9vTIIpWTRscyB5lM1JL9vQr.MP4"
                  type="video/mp4"
                />
                Ваш браузер не поддерживает воспроизведение видео.
              </video>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 text-gray-900 dark:text-white">
          <h2 className="text-xl font-bold mb-4">НАШИ ПРЕИМУЩЕСТВА</h2>
          <div className="flex flex-col space-y-4">
            <div className="bg-gray-50 dark:bg-[#2A2A2A] rounded-lg overflow-hidden text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
              <div className="flex flex-row bg-gray-50 dark:bg-[#2A2A2A]">
                <div className="w-1/3 p-4 flex justify-center">
                  <div className="w-32 h-32 bg-white dark:bg-[#333333] rounded-lg overflow-hidden flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
                    <Image
                      src="/images/sivik-tire-machine-updated.png"
                      alt="Монтаж и демонтаж"
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="w-2/3 p-4 bg-white dark:bg-[#2A2A2A] rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold mb-2 text-left text-gray-900 dark:text-white">МОНТАЖ И ДЕМОНТАЖ ЛЕГКОВЫХ ШИН</h3>
                  <p className="text-sm text-left text-gray-900 dark:text-white">(выполняется на специализированном профессиональном стенде)</p>
                </div>
              </div>
            </div>

            {/* Добавленные элементы */}
            <div className="bg-gray-50 dark:bg-[#2A2A2A] rounded-lg overflow-hidden text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
              <div className="flex flex-row bg-gray-50 dark:bg-[#2A2A2A]">
                <div className="w-1/3 p-4 flex justify-center">
                  <div className="w-32 h-32 bg-white dark:bg-[#333333] rounded-lg overflow-hidden flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
                    <Image
                      src="/images/sivik-balancing-machine-galaxy.png"
                      alt="Лазерная балансировка"
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="w-2/3 p-4 bg-white dark:bg-[#2A2A2A] rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold mb-2 text-left text-gray-900 dark:text-white">ЛАЗЕРНАЯ БАЛАНСИРОВКА</h3>
                  <p className="text-sm text-left text-gray-900 dark:text-white">(высокоточная балансировка для идеальной езды)</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-[#2A2A2A] rounded-lg overflow-hidden text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
              <div className="flex flex-row bg-gray-50 dark:bg-[#2A2A2A]">
                <div className="w-1/3 p-4 flex justify-center">
                  <div className="w-32 h-32 bg-white dark:bg-[#333333] rounded-lg overflow-hidden flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
                    <Image
                      src="/images/sibek-wheel-repair-machine.png"
                      alt="Ремонт дисков"
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="w-2/3 p-4 bg-white dark:bg-[#2A2A2A] rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold mb-2 text-left text-gray-900 dark:text-white">РЕМОНТ ДИСКОВ ЛЮБОЙ СЛОЖНОСТИ</h3>
                  <p className="text-sm text-left text-gray-900 dark:text-white">(восстановление геометрии и внешнего вида дисков)</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-[#2A2A2A] rounded-lg overflow-hidden text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
              <div className="flex flex-row bg-gray-50 dark:bg-[#2A2A2A]">
                <div className="w-1/3 p-4 flex justify-center">
                  <div className="w-32 h-32 bg-white dark:bg-[#333333] rounded-lg overflow-hidden flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
                    <Image
                      src="/images/hot-vulcanization-machine.png"
                      alt="Горячая вулканизация"
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="w-2/3 p-4 bg-white dark:bg-[#2A2A2A] rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold mb-2 text-left text-gray-900 dark:text-white">ГОРЯЧАЯ ВУЛКАНИЗАЦИЯ</h3>
                  <p className="text-sm text-left text-gray-900 dark:text-white">(надежный ремонт проколов и порезов шин)</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-[#2A2A2A] rounded-lg overflow-hidden text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
              <div className="flex flex-row bg-gray-50 dark:bg-[#2A2A2A]">
                <div className="w-1/3 p-4 flex justify-center">
                  <div className="w-32 h-32 bg-white dark:bg-[#333333] rounded-lg overflow-hidden flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
                    <Image
                      src="/images/tig-welding-machine.png"
                      alt="Сварка в аргоне"
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="w-2/3 p-4 bg-white dark:bg-[#2A2A2A] rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold mb-2 text-left text-gray-900 dark:text-white">СВАРКА В АРГОНЕ</h3>
                  <p className="text-sm text-left text-gray-900 dark:text-white">(профессиональная сварка дисков и других металлических деталей)</p>
                </div>
              </div>
            </div>
            {/* Конец добавленных элементов */}
          </div>
        </div>
      </main>

      <BottomNavigation />

      {showCarTypeInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-auto shadow-xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
              <h3 className="font-bold text-lg text-gray-900">Типы автомобилей</h3>
              <button onClick={() => setShowCarTypeInfoModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="p-4 bg-white text-gray-900 space-y-4">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="mb-2">
                  <div className="w-full h-32 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                    <Image
                      src="/images/passenger-car.png"
                      alt="Легковой авто"
                      width={200}
                      height={100}
                      className="object-cover w-full"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Легковой авто</h4>
                      <span className="text-xs text-blue-600 cursor-pointer hover:text-blue-700">все авто</span>
                    </div>
                    <p className="text-xs text-gray-500">Mercedes E-Class, BMW 3 Series, Toyota Camry, Audi A4...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
