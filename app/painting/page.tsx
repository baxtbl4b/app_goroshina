"use client"
import Image from "next/image"
import SafeAreaHeader from "@/components/safe-area-header"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Pricing data for painting services with different painting types
const pricingData = {
  "disk-painting": {
    powder: {
      r13: 2000,
      r14: 2200,
      r15: 2400,
      r16: 2600,
      r17: 2800,
      r18: 3000,
      r19: 3200,
      r20: 3400,
      r21: 3600,
      r22: 3800,
    },
    acrylic: {
      r13: 2200,
      r14: 2400,
      r15: 2600,
      r16: 2800,
      r17: 3000,
      r18: 3200,
      r19: 3400,
      r20: 3600,
      r21: 3800,
      r22: 4000,
    },
    "powder-machining": {
      r13: 2500,
      r14: 2700,
      r15: 2900,
      r16: 3100,
      r17: 3300,
      r18: 3500,
      r19: 3700,
      r20: 3900,
      r21: 4100,
      r22: 4300,
    },
    "acrylic-machining": {
      r13: 2700,
      r14: 2900,
      r15: 3100,
      r16: 3300,
      r17: 3500,
      r18: 3700,
      r19: 3900,
      r20: 4100,
      r21: 4300,
      r22: 4500,
    },
  },
  "center-caps": {
    powder: {
      r13: 800,
      r14: 800,
      r15: 800,
      r16: 800,
      r17: 800,
      r18: 800,
      r19: 800,
      r20: 800,
      r21: 800,
      r22: 800,
    },
    acrylic: {
      r13: 900,
      r14: 900,
      r15: 900,
      r16: 900,
      r17: 900,
      r18: 900,
      r19: 900,
      r20: 900,
      r21: 900,
      r22: 900,
    },
    "powder-machining": {
      r13: 1000,
      r14: 1000,
      r15: 1000,
      r16: 1000,
      r17: 1000,
      r18: 1000,
      r19: 1000,
      r20: 1000,
      r21: 1000,
      r22: 1000,
    },
    "acrylic-machining": {
      r13: 1100,
      r14: 1100,
      r15: 1100,
      r16: 1100,
      r17: 1100,
      r18: 1100,
      r19: 1100,
      r20: 1100,
      r21: 1100,
      r22: 1100,
    },
  },
  "scratch-dent-removal": {
    powder: {
      r13: 1200,
      r14: 1300,
      r15: 1400,
      r16: 1500,
      r17: 1600,
      r18: 1700,
      r19: 1800,
      r20: 1900,
      r21: 2000,
      r22: 2100,
    },
    acrylic: {
      r13: 1300,
      r14: 1400,
      r15: 1500,
      r16: 1600,
      r17: 1700,
      r18: 1800,
      r19: 1900,
      r20: 2000,
      r21: 2100,
      r22: 2200,
    },
    "powder-machining": {
      r13: 1400,
      r14: 1500,
      r15: 1600,
      r16: 1700,
      r17: 1800,
      r18: 1900,
      r19: 2000,
      r20: 2100,
      r21: 2200,
      r22: 2300,
    },
    "acrylic-machining": {
      r13: 1500,
      r14: 1600,
      r15: 1700,
      r16: 1800,
      r17: 1900,
      r18: 2000,
      r19: 2100,
      r20: 2200,
      r21: 2300,
      r22: 2400,
    },
  },
}

const serviceNames = {
  "disk-painting": "Покраска диска",
  "center-caps": "Покраска центральных колпачков",
  "scratch-dent-removal": "Удаление задиров и вмятин",
}

export default function PaintingPage() {
  const [selectedColor, setSelectedColor] = useState("#000000")
  const [diameter, setDiameter] = useState("")
  const [totalPrice, setTotalPrice] = useState(0)
  const [userCars, setUserCars] = useState([])
  const [isLoadingCars, setIsLoadingCars] = useState(true)
  const [selectedCar, setSelectedCar] = useState("")
  const [serviceQuantities, setServiceQuantities] = useState<{ [key: string]: number }>({})
  const [selectedServices, setSelectedServices] = useState<{
    [key: string]: { name: string; quantity: number; price: number; total: number }
  }>({})
  const [paintingType, setPaintingType] = useState("powder")
  const [ralInput, setRalInput] = useState("")
  const [selectedFinish, setSelectedFinish] = useState("")
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const [tireMountingServices, setTireMountingServices] = useState<{
    [key: string]: { name: string; quantity: number; price: number; total: number }
  }>({})
  const [tireMountingTotalPrice, setTireMountingTotalPrice] = useState(0)

  const router = useRouter()

  // Calculate total price based on selected services
  useEffect(() => {
    if (diameter) {
      let total = 0
      Object.entries(serviceQuantities).forEach(([serviceKey, quantity]) => {
        const q = quantity as number
        if (q > 0) {
          const price = pricingData[serviceKey]?.[paintingType]?.[diameter] || 0
          total += price * q
        }
      })
      setTotalPrice(total)

      // Update selected services for display
      const services: { [key: string]: { name: string; quantity: number; price: number; total: number } } = {}
      Object.entries(serviceQuantities).forEach(([serviceKey, quantity]) => {
        const q = quantity as number
        if (q > 0) {
          services[serviceKey] = {
            name: serviceNames[serviceKey],
            quantity: q,
            price: pricingData[serviceKey]?.[paintingType]?.[diameter] || 0,
            total: (pricingData[serviceKey]?.[paintingType]?.[diameter] || 0) * q,
          }
        }
      })
      setSelectedServices(services)
    } else {
      setTotalPrice(0)
      setSelectedServices({})
    }
  }, [serviceQuantities, diameter, paintingType])

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

  // Load saved data
  useEffect(() => {
    // Check for tire mounting data
    const savedTireMountingData = localStorage.getItem("tireMountingSelectedServices")
    if (savedTireMountingData) {
      try {
        const data = JSON.parse(savedTireMountingData)
        if (data.selectedServices) {
          setTireMountingServices(data.selectedServices)
          setTireMountingTotalPrice(data.totalPrice || 0)
          if (data.diameter && !diameter) {
            setDiameter(data.diameter)
          }
        }
      } catch (error) {
        console.error("Error parsing tire mounting data:", error)
      }
    }

    // Check for saved painting data
    const savedPaintingData = localStorage.getItem("paintingBookingData")
    if (savedPaintingData) {
      try {
        const data = JSON.parse(savedPaintingData)
        if (data.selectedServices) {
          const quantities = {}
          Object.entries(data.selectedServices).forEach(([key, service]) => {
            quantities[key] = service.quantity
          })
          setServiceQuantities(quantities)
        }
        if (data.diameter) setDiameter(data.diameter)
        if (data.paintingType) setPaintingType(data.paintingType)
        if (data.selectedColor) setSelectedColor(data.selectedColor)
        if (data.selectedFinish) setSelectedFinish(data.selectedFinish)
      } catch (error) {
        console.error("Error parsing saved painting data:", error)
      }
    }
  }, [])

  const incrementService = (serviceKey: string) => {
    setServiceQuantities((prev) => ({
      ...prev,
      [serviceKey]: (prev[serviceKey] || 0) + 1,
    }))
  }

  const decrementService = (serviceKey: string) => {
    setServiceQuantities((prev) => ({
      ...prev,
      [serviceKey]: Math.max((prev[serviceKey] || 0) - 1, 0),
    }))
  }

  // Function to get available colors based on painting type
  const getAvailableColors = () => {
    if (paintingType === "powder") {
      // For powder coating, only show dark, gray and white colors
      return [
        "#000000", // Black
        "#FFFFFF", // White
        "#333333", // Dark Gray
        "#555555", // Medium Dark Gray
        "#777777", // Medium Gray
        "#999999", // Gray
        "#AAAAAA", // Light Gray
        "#CCCCCC", // Very Light Gray
        "#1A1A1A", // Almost Black
        "#2C2C2C", // Very Dark Gray
        "#404040", // Dark Gray 2
        "#606060", // Medium Gray 2
      ]
    }

    // Default colors for other painting types - expanded palette
    return [
      "#000000", // Black
      "#FFFFFF", // White
      "#FF0000", // Red
      "#0000FF", // Blue
      "#FFFF00", // Yellow
      "#00FF00", // Green
      "#FFA500", // Orange
      "#800080", // Purple
      "#A52A2A", // Brown
      "#808080", // Gray
      "#C0C0C0", // Silver
      "#FFD700", // Golden yellow
      "#00FFFF", // Light blue
      "#FF00FF", // Telemagenta
      "#008080", // Opal green
      "#800000", // Oxide red
    ]
  }

  // Function to convert hex color to approximate RAL code
  const getRalCode = (hexColor: string) => {
    const ralColors = {
      "#000000": "9005", // Jet black
      "#FFFFFF": "9010", // Pure white
      "#FF0000": "3020", // Traffic red
      "#0000FF": "5017", // Traffic blue
      "#FFFF00": "1021", // Rape yellow
      "#00FF00": "6018", // Yellow green
      "#FFA500": "2003", // Pastel orange
      "#800080": "4008", // Signal violet
      "#A52A2A": "8012", // Red brown
      "#808080": "7037", // Dusty grey
      "#C0C0C0": "9006", // White aluminium
      "#FFD700": "1004", // Golden yellow
      "#00FFFF": "5012", // Light blue
      "#FF00FF": "4010", // Telemagenta
      "#008080": "6026", // Opal green
      "#800000": "3009", // Oxide red
      "#333333": "7021", // Black grey
      "#555555": "7024", // Graphite grey
      "#777777": "7037", // Dusty grey
      "#999999": "7038", // Agate grey
      "#AAAAAA": "7040", // Window grey
      "#CCCCCC": "7047", // Telegrey 4
      "#1A1A1A": "9017", // Traffic black
      "#2C2C2C": "7021", // Black grey
    }

    return ralColors[hexColor.toUpperCase()] || "----"
  }

  // Function to convert RAL code to hex color
  const getHexFromRal = (ralCode: string) => {
    const ralToHex = {
      "9005": "#000000", // Jet black
      "9010": "#FFFFFF", // Pure white
      "3020": "#FF0000", // Traffic red
      "5017": "#0000FF", // Traffic blue
      "1021": "#FFFF00", // Rape yellow
      "6018": "#00FF00", // Yellow green
      "2003": "#FFA500", // Pastel orange
      "4008": "#800080", // Signal violet
      "8012": "#A52A2A", // Red brown
      "7037": "#808080", // Dusty grey
      "9006": "#C0C0C0", // White aluminium
      "1004": "#FFD700", // Golden yellow
      "5012": "#00FFFF", // Light blue
      "4010": "#FF00FF", // Telemagenta
      "6026": "#008080", // Opal green
      "3009": "#800000", // Oxide red
      "7021": "#333333", // Black grey
      "7024": "#555555", // Graphite grey
      "7038": "#999999", // Agate grey
      "7040": "#AAAAAA", // Window grey
      "7047": "#CCCCCC", // Telegrey 4
      "9017": "#1A1A1A", // Traffic black
    }

    return ralToHex[ralCode] || null
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      <SafeAreaHeader title="Покраска дисков" showBackButton backUrl="/" />

      <main className="flex-1 pt-[calc(60px+env(safe-area-inset-top)+1rem)]">
        <div className="px-4 py-6 bg-[#2A2A2A] text-white">
          <div className="bg-[#121212] rounded-lg p-4 space-y-4 relative">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/car_base-zdUvBezNiqgwBsRzXwU0JLWsSHKeYq.png"
              alt="Luxury car with bronze wheels"
              width={188}
              height={141}
              className="object-contain opacity-50 absolute top-[90px] right-0"
            />

            <div className="bg-yellow-600 bg-opacity-20 border border-yellow-500 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-200">
                <strong>Примечание:</strong> В стоимость не включены шиномонтажные работы. Цена актуальна только при
                предоставлении голых дисков.
              </p>
            </div>

            <div className="mb-4">
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {isLoadingCars ? (
                  <div className="text-xs px-2 py-0.5 text-gray-400">Загрузка автомобилей...</div>
                ) : (
                  <>
                    {userCars.map((car: any) => {
                      const tireDiameterMatch = car.tireDiameter?.match(/r\d+/i)
                      const carDiameter = tireDiameterMatch ? tireDiameterMatch[0].substring(1) : ""

                      return (
                        <button
                          key={car.id}
                          onClick={() => {
                            setSelectedCar(car.id)
                            setDiameter(`r${carDiameter}`)
                            setSelectedColor("#000000")
                          }}
                          className={`text-xs px-2 py-0.5 rounded-md border whitespace-nowrap flex-shrink-0 transition-colors ${
                            selectedCar === car.id
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "bg-white dark:bg-[#3A3A3A] border-[#D9D9DD] dark:border-[#3A3A3A] text-[#1F1F1F] dark:text-white"
                          }`}
                        >
                          {car.displayName}
                        </button>
                      )
                    })}
                  </>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Выберите тип покраски</label>
              <select
                value={paintingType}
                onChange={(e) => setPaintingType(e.target.value)}
                className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 bg-[#2A2A2A] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm border-2 border-[#c4d402]"
              >
                <option value="powder">Порошковая покраска</option>
                <option value="acrylic">Акриловая покраска</option>
                <option value="powder-machining">Порошковая покраска с проточкой</option>
                <option value="acrylic-machining">Акриловая покраска с проточкой</option>
              </select>
            </div>

            <div className="space-y-4">
              {/* Выбор цвета */}
              <div>
                <label className="block text-sm font-medium mb-2">Выберите цвет</label>
                <div className="flex gap-4 justify-start items-center w-full">
                  {/* Цветовое колесо или ограниченное поле */}
                  <div className="h-40 w-40 rounded-lg overflow-hidden relative">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {paintingType !== "powder" ? (
                      <svg width="100%" height="100%" viewBox="0 0 1000 1000">
                        <defs>
                          <radialGradient id="colorWheel" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="#000000" />
                          </radialGradient>
                        </defs>
                        {Array.from({ length: 24 }, (_, i) => {
                          const angle = (i * 15 * Math.PI) / 180
                          const nextAngle = ((i + 1) * 15 * Math.PI) / 180
                          const outerRadius = 400
                          const innerRadius = 100
                          const x1 = 500 + Math.cos(angle) * innerRadius
                          const y1 = 500 + Math.sin(angle) * innerRadius
                          const x2 = 500 + Math.cos(angle) * outerRadius
                          const y2 = 500 + Math.sin(angle) * outerRadius
                          const x3 = 500 + Math.cos(nextAngle) * outerRadius
                          const y3 = 500 + Math.sin(nextAngle) * outerRadius
                          const x4 = 500 + Math.cos(nextAngle) * innerRadius
                          const y4 = 500 + Math.sin(nextAngle) * innerRadius
                          const hue = i * 15
                          const color = `hsl(${hue}, 100%, 50%)`

                          return (
                            <path
                              key={i}
                              d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`}
                              fill={color}
                              onClick={() => {
                                const h = hue / 360
                                const s = 1
                                const l = 0.5
                                const hue2rgb = (p, q, t) => {
                                  if (t < 0) t += 1
                                  if (t > 1) t -= 1
                                  if (t < 1 / 6) return p + (q - p) * 6 * t
                                  if (t < 1 / 2) return q
                                  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
                                  return p
                                }
                                const q = l < 0.5 ? l * (1 + s) : l + s - l * s
                                const p = 2 * l - q
                                const r = hue2rgb(p, q, h + 1 / 3)
                                const g = hue2rgb(p, q, h)
                                const b = hue2rgb(p, q, h - 1 / 3)
                                const toHex = (c) => {
                                  const hex = Math.round(c * 255).toString(16)
                                  return hex.length === 1 ? "0" + hex : hex
                                }
                                setSelectedColor(`#${toHex(r)}${toHex(g)}${toHex(b)}`)
                              }}
                              className="hover:opacity-80 transition-opacity cursor-pointer"
                            />
                          )
                        })}
                      </svg>
                    ) : (
                      <>
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 1000 1000"
                          className="opacity-40 cursor-pointer hover:opacity-60 transition-opacity"
                          onClick={() => setPaintingType("acrylic")}
                        >
                          <defs>
                            <radialGradient id="colorWheelDisabled" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#ffffff" />
                              <stop offset="100%" stopColor="#000000" />
                            </radialGradient>
                          </defs>
                          {Array.from({ length: 24 }, (_, i) => {
                            const angle = (i * 15 * Math.PI) / 180
                            const nextAngle = ((i + 1) * 15 * Math.PI) / 180
                            const outerRadius = 400
                            const innerRadius = 100
                            const x1 = 500 + Math.cos(angle) * innerRadius
                            const y1 = 500 + Math.sin(angle) * innerRadius
                            const x2 = 500 + Math.cos(angle) * outerRadius
                            const y2 = 500 + Math.sin(angle) * outerRadius
                            const x3 = 500 + Math.cos(nextAngle) * outerRadius
                            const y3 = 500 + Math.sin(nextAngle) * outerRadius
                            const x4 = 500 + Math.cos(nextAngle) * innerRadius
                            const y4 = 500 + Math.sin(nextAngle) * innerRadius
                            const hue = i * 15
                            const color = `hsl(${hue}, 100%, 50%)`

                            return (
                              <path
                                key={i}
                                d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`}
                                fill={color}
                                className="hover:opacity-80 transition-opacity"
                              />
                            )
                          })}
                        </svg>
                        <div
                          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer hover:bg-opacity-40 transition-all"
                          onClick={() => setPaintingType("acrylic")}
                        >
                          <span className="text-xs text-white text-center px-2 bg-black bg-opacity-70 py-1 rounded pointer-events-none">
                            Ограниченная палитра для порошковой покраски
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Палитра предустановленных цветов */}
                  <div className="grid grid-cols-4 gap-3 max-w-60">
                    {getAvailableColors()
                      .slice(0, 12)
                      .map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-12 h-10 rounded border ${
                            selectedColor === color ? "border-white border-2" : "border-gray-600"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                  </div>
                </div>

                {/* Отображение выбранного цвета и RAL-кода */}
                <div className="mt-4 flex justify-end items-center text-sm">
                  <span className="mr-4">Выбранный цвет:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: selectedColor }}></div>
                    <span>RAL {getRalCode(selectedColor)}</span>
                  </div>
                </div>

                {/* Ввод RAL вручную */}
                <div className="mt-2 flex gap-2 items-center justify-end">
                  <span className="text-sm">Ввести RAL:</span>
                  <input
                    type="text"
                    value={ralInput}
                    onChange={(e) => setRalInput(e.target.value)}
                    className="bg-[#2A2A2A] text-white rounded px-2 py-1 text-sm w-20 border border-gray-600"
                    placeholder="9005"
                  />
                  <button
                    onClick={() => {
                      const hex = getHexFromRal(ralInput)
                      if (hex) {
                        setSelectedColor(hex)
                        setRalInput("")
                      } else {
                        alert("RAL код не найден")
                      }
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Применить
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Выберите лак:</span>
                  <div className={`flex gap-2 ${!selectedFinish ? "border-2 border-red-500 rounded-md p-1" : ""}`}>
                    <div
                      onClick={() => setSelectedFinish("matte")}
                      className={`flex items-center gap-2 px-3 py-2 rounded text-sm border transition-all duration-300 cursor-pointer ${
                        selectedFinish === "matte"
                          ? "border-blue-500 border-2 bg-blue-500 bg-opacity-20"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                          selectedFinish === "matte" ? "border-blue-500 bg-blue-500" : "border-gray-400"
                        }`}
                      >
                        {selectedFinish === "matte" && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-white">Матовый</span>
                    </div>

                    <div
                      onClick={() => setSelectedFinish("glossy")}
                      className={`flex items-center gap-2 px-3 py-2 rounded text-sm border transition-all duration-300 cursor-pointer ${
                        selectedFinish === "glossy"
                          ? "border-blue-500 border-2 bg-blue-500 bg-opacity-20"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                          selectedFinish === "glossy" ? "border-blue-500 bg-blue-500" : "border-gray-400"
                        }`}
                      >
                        {selectedFinish === "glossy" && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-white">Глянцевый</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Диаметр диска (R)</span>
                  <select
                    value={diameter}
                    onChange={(e) => setDiameter(e.target.value)}
                    className={`w-1/2 bg-[#2A2A2A] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                      !diameter ? "border-2 border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Услуга</label>
                <div className="space-y-3">
                  {Object.entries(serviceNames).map(([key, name]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div
                        className={`flex-1 rounded-lg px-3 py-2 relative transition-all duration-200 ease-in-out active:scale-95 hover:shadow-md ${
                          key === "disk-painting"
                            ? serviceQuantities[key] > 0
                              ? "bg-[#1e293b] border-l-4 border-[#c4d402] shadow-lg text-center"
                              : !diameter
                                ? "bg-gray-800 text-gray-400 text-center"
                                : "bg-gray-700 text-white cursor-pointer hover:bg-[#1a1a1a] hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out text-center"
                            : !diameter
                              ? "bg-gray-800 text-gray-400"
                              : "bg-gray-600 text-white cursor-pointer hover:bg-gray-700 active:bg-gray-800"
                        }`}
                        onClick={() => {
                          if (diameter) {
                            incrementService(key)
                          }
                        }}
                      >
                        {key === "disk-painting" ? (
                          <div className="flex flex-col items-center justify-center min-h-[60px]">
                            <div className="font-medium text-center">{name}</div>
                            {diameter && (
                              <div className="mt-2">
                                <span className="text-lg font-semibold text-white">
                                  {pricingData[key]?.[paintingType]?.[diameter] || 0} ₽
                                </span>
                              </div>
                            )}
                            {!diameter && <div className="text-xs text-gray-500 mt-1">Выберите диаметр диска</div>}
                          </div>
                        ) : (
                          <>
                            {name}
                            {diameter && (
                              <span className="text-sm text-gray-400 ml-2">
                                {pricingData[key]?.[paintingType]?.[diameter] || 0} ₽
                              </span>
                            )}
                            {!diameter && <span className="text-xs text-gray-500 ml-2">Выберите диаметр диска</span>}
                          </>
                        )}

                        {key === "scratch-dent-removal" && (
                          <div className="absolute bottom-1 right-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowTooltip(showTooltip === key ? null : key)
                              }}
                              className="w-4 h-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                              title="Информация об услуге"
                            >
                              !
                            </button>
                            {showTooltip === key && (
                              <div className="absolute bottom-6 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 w-48 z-10 shadow-lg">
                                Цена за ремонт глубоких царапин до 3см
                                <div className="absolute bottom-[-6px] right-1 w-3 h-3 bg-gray-800 transform rotate-45"></div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {key === "disk-painting" ? (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              incrementService(key)
                            }}
                            disabled={!diameter}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold transition-all duration-200 active:scale-90 ${
                              !diameter
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-[#c4d402] text-black hover:bg-[#c5d135] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            }`}
                          >
                            +
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              decrementService(key)
                            }}
                            disabled={!diameter}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold transition-all duration-200 active:scale-90 ${
                              !diameter
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-[#484b51] text-white hover:bg-[#5A5D63] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            }`}
                          >
                            -
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => decrementService(key)}
                            disabled={!diameter}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center focus:outline-none transition-all duration-200 active:scale-90 ${
                              !diameter
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-[#484b51] text-white hover:bg-[#5A5D63] focus:ring-2 focus:ring-blue-500"
                            }`}
                          >
                            -
                          </button>
                          <div
                            className={`w-10 h-10 text-white rounded-lg flex items-center justify-center text-sm font-medium ${
                              !diameter ? "bg-gray-800 text-gray-500" : "bg-[#1A1A1A]"
                            }`}
                          >
                            {serviceQuantities[key] || 0}
                          </div>
                          <button
                            onClick={() => incrementService(key)}
                            disabled={!diameter}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center focus:outline-none transition-all duration-200 active:scale-90 ${
                              !diameter
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-[#c4d402] text-black hover:bg-[#c5d135] focus:ring-2 focus:ring-blue-500"
                            }`}
                          >
                            +
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex gap-4 items-stretch">
                  <div className="w-1/2 bg-[#2A2A2A] rounded-lg p-3">
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-300">Выбранные услуги:</span>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {Object.keys(selectedServices).length === 0 && Object.keys(tireMountingServices).length === 0 ? (
                        <div className="text-xs text-gray-400">Услуги не выбраны</div>
                      ) : (
                        <>
                          {Object.entries(selectedServices).map(([key, service]) => {
                            const s = service as { name: string; quantity: number; price: number; total: number }
                            return (
                              <div key={key} className="flex justify-between items-center text-xs">
                                <span className="text-gray-300">{s.name}</span>
                                <span className="text-white">
                                  {s.quantity}x {s.price}₽ = {s.total}₽
                                </span>
                              </div>
                            )
                          })}

                          {Object.keys(tireMountingServices).length > 0 && (
                            <>
                              <div className="border-t border-gray-600 pt-2 mt-2">
                                <div className="flex justify-between items-center">
                                  <div className="text-xs text-blue-400 font-medium">Шиномонтаж:</div>
                                  <button
                                    onClick={() => {
                                      setTireMountingServices({})
                                      setTireMountingTotalPrice(0)
                                      localStorage.removeItem("tireMountingSelectedServices")
                                    }}
                                    className="text-xs text-red-400 hover:text-red-300"
                                  >
                                    Удалить
                                  </button>
                                </div>
                              </div>
                              {Object.entries(tireMountingServices).map(([key, service]) => {
                                const s = service as { name: string; quantity: number; price: number; total: number }
                                return (
                                  <div key={`tire-${key}`} className="flex justify-between items-center text-xs">
                                    <span className="text-blue-300">{s.name}</span>
                                    <span className="text-blue-200">
                                      {s.quantity}x {s.price}₽ = {s.total}₽
                                    </span>
                                  </div>
                                )
                              })}
                            </>
                          )}
                        </>
                      )}
                    </div>
                    <div className="border-t border-gray-600 mt-3 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">Итого:</span>
                        <span className="text-xl font-bold text-blue-400">{totalPrice + tireMountingTotalPrice} ₽</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-1/2 flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="Введите промокод"
                      className="w-full bg-[#2A2A2A] text-white rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 text-center"
                    />
                    <button
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                      onClick={() => {
                        alert("Показать полный прайс-лист")
                      }}
                    >
                      Посмотреть полный прайс
                    </button>
                    <button
                      className="w-full bg-[#c4d402] hover:bg-[#c5d135] text-black py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        (Object.keys(selectedServices).length === 0 &&
                          Object.keys(tireMountingServices).length === 0) ||
                        !diameter ||
                        !selectedFinish
                      }
                      onClick={() => {
                        const bookingData = {
                          selectedServices,
                          totalPrice,
                          diameter,
                          paintingType,
                          selectedColor,
                          selectedFinish,
                          tireMountingServices,
                          tireMountingTotalPrice,
                          combinedTotalPrice: totalPrice + tireMountingTotalPrice,
                          serviceQuantities,
                        }
                        localStorage.setItem("paintingBookingData", JSON.stringify(bookingData))
                        router.push("/painting/booking")
                      }}
                    >
                      {Object.keys(selectedServices).length === 0 && Object.keys(tireMountingServices).length === 0
                        ? "Выберите услуги"
                        : !diameter
                          ? "Выберите диаметр диска"
                          : !selectedFinish
                            ? "Выберите тип лака"
                            : "Записаться на услугу"}
                    </button>
                    <button
                      className="w-full bg-blue-600/10 hover:bg-blue-700/10 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                      onClick={() => {
                        const paintingData = {
                          selectedServices,
                          totalPrice,
                          diameter,
                          paintingType,
                          selectedColor,
                          selectedFinish,
                        }
                        localStorage.setItem("paintingBookingData", JSON.stringify(paintingData))
                        window.location.href = "/tire-mounting?returnTo=painting"
                      }}
                    >
                      Добавить шиномонтаж
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 bg-[#1A1A1A] text-white">
          <h2 className="text-xl font-bold mb-4">НАШИ РАБОТЫ</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#2A2A2A] rounded-lg overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/F855ZUoDphU.jpg-ygI2SD9I1F0ouVZIEazZioYNNgkjjm.jpeg"
                alt="Спортивный диск в сером цвете"
                width={200}
                height={150}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <h3 className="font-medium text-sm mb-1">Спортивный Y-дизайн</h3>
                <p className="text-xs text-gray-400">Порошковая покраска R19</p>
              </div>
            </div>

            <div className="bg-[#2A2A2A] rounded-lg overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/j0wuq85R9nI.jpg-qlz3iJTQoP02X35AqLwzNzCi67qyOz.jpeg"
                alt="Комплект черных дисков"
                width={200}
                height={150}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <h3 className="font-medium text-sm mb-1">Матовый черный комплект</h3>
                <p className="text-xs text-gray-400">Порошковая покраска R18</p>
              </div>
            </div>

            <div className="bg-[#2A2A2A] rounded-lg overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1U0Ef1hADPo.jpg-MCsDBnm66Cu7us63OcANm4cfncYQ4i.jpeg"
                alt="Диски с полированной кромкой"
                width={200}
                height={150}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <h3 className="font-medium text-sm mb-1">Черный глянец с полировкой</h3>
                <p className="text-xs text-gray-400">Комбинированная обработка R19</p>
              </div>
            </div>

            <div className="bg-[#2A2A2A] rounded-lg overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fnpdlVcg1g4.jpg-G0F4aNAx1eQsHQk59EViuSj0poBtrQ.jpeg"
                alt="Диск BRABUS в матовом сером цвете"
                width={200}
                height={150}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <h3 className="font-medium text-sm mb-1">BRABUS матовый серый</h3>
                <p className="text-xs text-gray-400">Премиум покраска R20</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 bg-[#121212] text-white">
          <h2 className="text-xl font-bold mb-4">НАШИ ПРЕИМУЩЕСТВА</h2>
          <div className="flex flex-col space-y-4">
            <div className="bg-[#2A2A2A] rounded-lg overflow-hidden text-white">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1/4 p-4 flex justify-center">
                  <div className="w-full h-48 rounded-lg overflow-hidden flex items-center justify-center">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-T6RhOnNV0wOTLSEgbDTSt5En0lGeUK.png"
                      alt="Идеальный результат покраски дисков"
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="sm:w-3/4 p-4">
                  <h3 className="font-bold mb-2 text-center sm:text-left">ИДЕАЛЬНЫЙ РЕЗУЛЬТАТ</h3>
                  <p className="text-sm text-center sm:text-left">
                    Мы восстанавливаем и красим диски так, будто они только с завода. Идеальное покрытие, стойкий цвет и
                    защита от внешних воздействий.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
