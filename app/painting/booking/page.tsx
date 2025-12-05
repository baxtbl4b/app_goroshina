"use client"
import type React from "react"

import SafeAreaHeader from "@/components/safe-area-header"
import BottomNavigation from "@/components/bottom-navigation"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { User, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"

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

export default function PaintingPage() {
  // Добавьте эту строку для определения глобальной CSS-анимации
  const glossyAnimationStyle = `
    @keyframes glossyShine {
      0% { background-position: -100% 0; }
      100% { background-position: 200% 0; }
    }
  `
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
    image: "",
  })

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
  const [showBlinkingLacquer, setShowBlinkingLacquer] = useState(false)

  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  const [isCustomerInfoExpanded, setIsCustomerInfoExpanded] = useState(false)
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const dateTimeRef = useRef<HTMLDivElement>(null)
  const contactInfoRef = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState("")
  const [bookingData, setBookingData] = useState<any>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerComment, setCustomerComment] = useState("")
  const [selectedStore, setSelectedStore] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    setSelectedDate(`${year}-${month}-${day}`)
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
              ? "bg-[#d3df3d] text-[#1F1F1F]"
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
    "Июл��",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ]

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]

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

  // Fetch user cars from personal account API
  useEffect(() => {
    const fetchUserCars = async () => {
      try {
        setIsLoadingCars(true)
        // In production, this would be fetched from /api/user/cars
        // For now, using the actual cars from user's personal account
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
        // Fallback to empty array if API fails
        setUserCars([])
      } finally {
        setIsLoadingCars(false)
      }
    }

    fetchUserCars()
  }, [])

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoadingProfile(true)
        // In production, this would be fetched from an API
        // For now, using mock data
        const mockUserProfile = {
          id: "user123",
          name: "Александр Иванов",
          phone: "+7 (999) 123-45-67",
          email: "alex@example.com",
        }

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        setUserProfile(mockUserProfile)

        // Auto-fill the form fields with user data
        setCustomerName(mockUserProfile.name)
        setCustomerPhone(mockUserProfile.phone)
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchUserProfile()
  }, [])

  // Auto-select today's date by default
  useEffect(() => {
    if (!selectedDate) {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const day = String(today.getDate()).padStart(2, "0")
      setSelectedDate(`${year}-${month}-${day}`)
    }
  }, [selectedDate])

  const incrementService = (serviceKey: string) => {
    setServiceQuantities((prev: { [x: string]: any }) => {
      const newQuantities = { ...prev }
      newQuantities[serviceKey] = (prev[serviceKey] || 0) + 1
      return newQuantities
    })
  }

  const decrementService = (serviceKey: string) => {
    setServiceQuantities((prev: { [x: string]: any }) => {
      const newQuantities = { ...prev }
      newQuantities[serviceKey] = Math.max((prev[serviceKey] || 0) - 1, 0)
      return newQuantities
    })
  }

  // Helper function to estimate position of color in gradient
  const getColorPosition = (hexColor: string) => {
    // Convert hex to RGB
    const r = Number.parseInt(hexColor.slice(1, 3), 16) / 255
    const g = Number.parseInt(hexColor.slice(3, 5), 16) / 255
    const b = Number.parseInt(hexColor.slice(5, 7), 16) / 255

    // Simple heuristic to map color to position
    // This is a simplified approach - a more accurate one would use HSL
    const hue = getHue(r, g, b)

    // Map hue (0-360) to position (0-100%)
    return `${(hue / 360) * 100}%`
  }

  // Helper function to estimate hue from RGB
  const getHue = (r: number, g: number, b: number) => {
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    if (max === min) return 0 // grayscale

    let hue = 0

    if (max === r) {
      hue = (g - b) / (max - min)
    } else if (max === g) {
      hue = 2 + (b - r) / (max - min)
    } else if (max === b) {
      hue = 4 + (r - g) / (max - min)
    }

    hue = hue * 60
    if (hue < 0) hue += 360
    if (hue >= 360) hue -= 360

    return hue
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
        "#808080", // Gray 2
        "#A0A0A0", // Light Gray 2
        "#C0C0C0", // Very Light Gray 2
        "#E0E0E0", // Almost White
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

  // Add this useEffect after the other useEffect hooks
  useEffect(() => {
    // Reset selected color when painting type changes
    if (paintingType === "powder") {
      // Default to black for powder coating
      setSelectedColor("#000000")
    }
  }, [paintingType])

  // Обновляем функцию getRalCode для более точного определения RAL кодов
  // Заменяем существующую функцию getRalCode на более полную версию:

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
      // Добавляем больше соответствий RAL
      "#B22222": "3000", // Flame red
      "#8B0000": "3003", // Ruby red
      "#CD5C5C": "3014", // Antique pink
      "#FF6347": "2008", // Bright red orange
      "#FF4500": "2004", // Pure orange
      "#FF8C00": "2000", // Yellow orange
      "#9ACD32": "6018", // Yellow green
      "#32CD32": "6017", // May green
      "#008000": "6005", // Moss green
      "#006400": "6009", // Fir green
      "#008080": "5021", // Water blue
      "#4682B4": "5015", // Sky blue
      "#000080": "5002", // Ultramarine blue
      "#483D8B": "5000", // Violet blue
      "#4B0082": "4005", // Blue lilac
      "#8B4513": "8001", // Ochre brown
      "#A0522D": "8023", // Orange brown
      "#D2691E": "8004", // Copper brown
      "#CD853F": "8003", // Clay brown
      "#F5F5F5": "9003", // Signal white
      "#DCDCDC": "9002", // Grey white
      "#D3D3D3": "7035", // Light grey
      "#A9A9A9": "7042", // Traffic grey A
      "#696969": "7043", // Traffic grey B
      "#2F4F4F": "7012", // Basalt grey
    }

    // Если есть точное совпадение, возвращаем его
    if (ralColors[hexColor.toUpperCase()]) {
      return ralColors[hexColor.toUpperCase()]
    }

    // Если нет точного совпадения, находим ближайший цвет
    // Преобразуем hex в RGB
    const r = Number.parseInt(hexColor.slice(1, 3), 16)
    const g = Number.parseInt(hexColor.slice(3, 5), 16)
    const b = Number.parseInt(hexColor.slice(5, 7), 16)

    // Функция для вычисления "расстояния" между цветами
    const colorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
      return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2))
    }

    let closestRAL = "----"
    let minDistance = Number.MAX_VALUE

    // Находим ближайший цвет
    Object.entries(ralColors).forEach(([hex, ral]) => {
      const r2 = Number.parseInt(hex.slice(1, 3), 16)
      const g2 = Number.parseInt(hex.slice(3, 5), 16)
      const b2 = Number.parseInt(hex.slice(5, 7), 16)

      const distance = colorDistance(r, g, b, r2, g2, b2)
      if (distance < minDistance) {
        minDistance = distance
        closestRAL = ral
      }
    })

    return closestRAL
  }

  // Function to convert RAL code to hex color
  const getHexFromRal = (ralCode: string | number) => {
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

  useEffect(() => {
    // Load booking data from localStorage
    const savedData = localStorage.getItem("paintingBookingData")
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        setBookingData(data)
      } catch (error) {
        console.error("Error parsing booking data:", error)
        router.push("/painting")
      }
    } else {
      router.push("/painting")
    }

    // Load preferred store from account settings
    try {
      const preferredStore = localStorage.getItem("preferredTireService")
      if (preferredStore) {
        setSelectedStore(preferredStore)
      }
    } catch (error) {
      console.error("Error loading preferred store:", error)
    }
  }, [router])

  // Scroll to date/time section when store is selected
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !selectedTime || !customerName || !customerPhone || !selectedStore) {
      alert("Пожалуйста, запо��ните все обязательные поля")
      return
    }

    setIsSubmitting(true)

    try {
      // Generate order number
      const orderNumber = `PNT-${Date.now().toString().slice(-6)}`

      // Prepare order data
      const orderData = {
        orderNumber,
        date: selectedDate,
        time: selectedTime,
        store: stores.find((s) => s.id === selectedStore),
        customer: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          comment: customerComment,
        },
        services: bookingData.selectedServices,
        totalPrice: bookingData.combinedTotalPrice || bookingData.totalPrice,
        paintingType: bookingData.paintingType,
        selectedColor: bookingData.selectedColor,
        selectedFinish: bookingData.selectedFinish,
        diameter: bookingData.diameter,
        tireMountingServices: bookingData.tireMountingServices || {},
        tireMountingTotalPrice: bookingData.tireMountingTotalPrice || 0,
      }

      // Save order data to localStorage for confirmation page
      localStorage.setItem("paintingOrderData", JSON.stringify(orderData))

      // Clear booking data
      localStorage.removeItem("paintingBookingData")

      // Redirect to confirmation page
      router.push("/painting/booking/confirmation")
    } catch (error) {
      console.error("Error submitting order:", error)
      alert("Произошла ошибка при оформлении заказа. Попробуйте еще раз.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!bookingData) {
    return (
      <div className="flex flex-col min-h-screen bg-[#121212] text-white">
        <SafeAreaHeader title="Оформление заказа" showBackButton backUrl="/painting" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d3df3d]"></div>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      <SafeAreaHeader title="Оформление заказа" showBackButton backUrl="/painting" />

      <main className="flex-1 p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-[#2A2A2A] rounded-lg p-4">
            <h2 className="text-lg font-bold mb-4">Ваш заказ</h2>

            {/* Painting Services */}
            <div className="space-y-2 mb-4">
              <h3 className="font-medium text-[#d3df3d]">Покраска дисков:</h3>
              {Object.entries(bookingData.selectedServices).map(([key, service]: [string, any]) => (
                <div key={key} className="flex justify-between items-center text-sm">
                  <span>{service.name}</span>
                  <span>
                    {service.quantity}x {service.price}₽ = {service.total}₽
                  </span>
                </div>
              ))}
            </div>

            {/* Tire Mounting Services if any */}
            {bookingData.tireMountingServices && Object.keys(bookingData.tireMountingServices).length > 0 && (
              <div className="space-y-2 mb-4 border-t border-gray-600 pt-4">
                <h3 className="font-medium text-blue-400">Шиномонтаж:</h3>
                {Object.entries(bookingData.tireMountingServices).map(([key, service]: [string, any]) => (
                  <div key={key} className="flex justify-between items-center text-sm">
                    <span>{service.name}</span>
                    <span>
                      {service.quantity}x {service.price}₽ = {service.total}₽
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Service Details */}
            <div className="space-y-2 mb-4 border-t border-gray-600 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span>Диаметр диска:</span>
                <span className="uppercase">{bookingData.diameter}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Тип покраски:</span>
                <span>
                  {bookingData.paintingType === "powder" && "Порошковая"}
                  {bookingData.paintingType === "acrylic" && "Акриловая"}
                  {bookingData.paintingType === "powder-machining" && "Порошковая с проточкой"}
                  {bookingData.paintingType === "acrylic-machining" && "Акриловая с проточкой"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Цвет:</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border border-gray-600"
                    style={{ backgroundColor: bookingData.selectedColor }}
                  ></div>
                  <span>{bookingData.selectedColor}</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Цвет RAL:</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border border-gray-600"
                    style={{ backgroundColor: bookingData.selectedColor }}
                  ></div>
                  <span>RAL {getRalCode(bookingData.selectedColor)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Тип лака:</span>
                <span>
                  {bookingData.selectedFinish === "matte" && "Матовый"}
                  {bookingData.selectedFinish === "glossy" && "Глянцевый"}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-600 pt-4">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Итого:</span>
                <span className="text-[#d3df3d]">{bookingData.combinedTotalPrice || bookingData.totalPrice}₽</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <Card ref={contactInfoRef} className="bg-white dark:bg-[#2A2A2A] border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-[#1F1F1F] dark:text-white flex items-center gap-2">
                <User className="h-5 w-5 text-[#d3df3d]" />
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
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
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
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
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
                      onClick={() => setSelectedCar("1")}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCar === "1"
                          ? "border-[#d3df3d] bg-[#d3df3d]/10"
                          : "border-gray-300 dark:border-gray-600 bg-[#F5F5F5] dark:bg-[#333333]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-[#1F1F1F] dark:text-white">Toyota Camry</div>
                          <div className="text-sm text-gray-500">2019 • А123БВ777</div>
                        </div>
                        <span className="text-xs bg-[#d3df3d] text-[#1F1F1F] px-2 py-1 rounded">Основной</span>
                      </div>
                    </div>
                    <div
                      onClick={() => setSelectedCar("2")}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCar === "2"
                          ? "border-[#d3df3d] bg-[#d3df3d]/10"
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
                      <div className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-[#F5F5F5] dark:bg-[#333333] cursor-pointer hover:border-[#d3df3d] transition-colors">
                        <div className="text-center text-[#009CFF] font-medium">+ Добавить автомобиль</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store Selection */}
          <div className="bg-[#2A2A2A] rounded-lg p-4">
            <h2 className="text-lg font-bold mb-4">Выберите магазин</h2>
            <div className="space-y-4">
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
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedStore("")}
                          className="mt-4 text-sm text-blue-400 hover:text-blue-300"
                        >
                          Выбрать другой магазин
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
                          onChange={(e) => setSelectedStore(e.target.value)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{store.name}</div>
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
                </>
              )}
            </div>
          </div>

          {/* Date and Time Selection */}
          <Card ref={dateTimeRef} className="bg-white dark:bg-[#2A2A2A] border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-[#1F1F1F] dark:text-white flex items-center gap-2">
                <svg className="h-5 w-5 text-[#d3df3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
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
                          const year = today.getFullYear()
                          const month = String(today.getMonth() + 1).padStart(2, "0")
                          const day = String(today.getDate()).padStart(2, "0")
                          setSelectedDate(`${year}-${month}-${day}`)
                        }}
                        className={`flex-1 px-3 py-2 text-sm rounded-md border transition-all duration-300 transform hover:scale-105 ${
                          selectedDate === new Date().toISOString().split("T")[0]
                            ? "bg-[#d3df3d] border-[#d3df3d] text-[#1F1F1F]"
                            : "bg-[#F5F5F5] dark:bg-[#333333] border-gray-300 dark:border-gray-600 text-[#1F1F1F] dark:text-white hover:border-[#d3df3d] hover:shadow-md"
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
                        }}
                        className="flex-1 px-3 py-2 text-sm rounded-md border transition-all duration-300 transform hover:scale-105 bg-[#F5F5F5] dark:bg-[#333333] border-gray-300 dark:border-gray-600 text-[#1F1F1F] dark:text-white hover:border-[#d3df3d] hover:shadow-md"
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
                            setTimeout(() => {
                              window.scrollTo({
                                top: document.body.scrollHeight,
                                behavior: "smooth",
                              })
                            }, 100)
                          }}
                          className={`p-2 text-sm rounded-md border transition-all ${
                            selectedTime === time
                              ? "bg-[#d3df3d] border-[#d3df3d] text-[#1F1F1F]"
                              : "bg-[#F5F5F5] dark:bg-[#333333] border-gray-300 dark:border-gray-600 text-[#1F1F1F] dark:text-white hover:border-[#d3df3d]"
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

          {/* Additional Comments */}
          <div className="bg-[#2A2A2A] rounded-lg p-4">
            <h2 className="text-lg font-bold mb-4">Дополнительные пожелания</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Комментарий</label>
              <textarea
                value={customerComment}
                onChange={(e) => setCustomerComment(e.target.value)}
                className="w-full bg-[#121212] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d3df3d] h-24 resize-none"
                placeholder="Дополнительные пожелания или комментарии к заказу"
              />
            </div>
          </div>

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
              disabled={
                isSubmitting || !selectedDate || !selectedTime || !customerName || !customerPhone || !selectedStore
              }
              className="flex-1 bg-[#d3df3d] hover:bg-[#c5d135] disabled:bg-gray-600 disabled:cursor-not-allowed text-black py-3 px-4 rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? "Оформление заказа..." : "Записаться"}
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-3">
            Нажимая "Оформить заказ", вы соглашаетесь с{" "}
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
