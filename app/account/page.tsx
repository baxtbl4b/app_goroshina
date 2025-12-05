"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { Award, ChevronRight, Plus, ShoppingBag, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { sendSmsCodeForAuth, verifySmsCodeAndLogin } from "@/app/auth-actions"
import SafeAreaHeader from "@/components/safe-area-header"
import BottomNavigation from "@/components/bottom-navigation"

// Helper component for submit button state
function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full bg-[#D3DF3D] text-[#1F1F1F] hover:bg-[#D3DF3D]/80" disabled={pending}>
      {pending ? "Загрузка..." : text}
    </Button>
  )
}

export default function AccountPage() {
  // Simulate login state. In a real app, this would come from a session/context.
  // For this example, we'll assume if the URL is /account and no redirect happened,
  // the user is "logged in" for demonstration purposes.
  // In a real app, you'd check for a session token or user context.
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This will be set to true after successful verification
  const [step, setStep] = useState("enterPhone") // 'enterPhone' or 'enterCode'
  const [phoneNumber, setPhoneNumber] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [user] = useState({
    name: "Александр Петров",
    loyaltyPoints: 1250,
    loyaltyLevel: "Золотой",
  })

  const [cars] = useState([
    {
      id: 1,
      brand: "BMW",
      model: "X5",
      year: 2020,
      image: "/images/crossover-suv.png",
      tireSize: "275/40 R20",
    },
    {
      id: 2,
      brand: "Mercedes",
      model: "C-Class",
      year: 2019,
      image: "/images/crossover-suv.png",
      tireSize: "225/45 R17",
    },
  ])

  const [recentOrders] = useState([
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "Доставлен",
      total: 25000,
      items: 4,
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "В обработке",
      total: 15000,
      items: 2,
    },
  ])

  // --- Existing Account Page State & Handlers ---
  const [selectedTireService, setSelectedTireService] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const [expandedCars, setExpandedCars] = useState<{ [key: string]: boolean }>({
    "1": true, // Toyota Camry expanded by default
    "2": false, // Volkswagen Tiguan collapsed by default
  })

  const [userCars, setUserCars] = useState<any[]>([])
  const [carsLoaded, setCarsLoaded] = useState(false)

  const toggleCarExpansion = (carId: string) => {
    setExpandedCars((prev) => ({
      ...prev,
      [carId]: !prev[carId],
    }))
  }

  const handleSave = async () => {
    if (!selectedTireService) {
      toast({
        title: "Выберите шиномонтаж",
        description: "Пожалуйста, выберите предпочитаемый шиномонтаж перед сохранением",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    setTimeout(() => {
      setIsSaving(false)
      setIsSaved(true)

      toast({
        title: "Настройки сохранены",
        description: "Ваш предпочитаемый шиномонтаж успешно сохранен",
        variant: "default",
      })

      setTimeout(() => {
        setIsSaved(false)
      }, 3000)
    }, 1000)
  }

  useEffect(() => {
    // Simulate checking if user is logged in.
    // In a real app, this would involve checking a session cookie or auth context.
    // For this demo, we'll assume if we're on /account and haven't been redirected,
    // the user is "logged in".
    const checkLoginStatus = () => {
      // This is a very basic simulation. A real app would check for a valid session.
      // For now, if we are on /account and haven't started the login flow, assume logged in.
      // This is a hack for the demo. In real app, check actual auth state.
      if (typeof window !== "undefined" && window.location.pathname === "/account" && step === "enterPhone") {
        // If we are on /account and haven't started the login flow, assume logged in.
        // This is a hack for the demo. In real app, check actual auth state.
        setIsLoggedIn(true)
      }
    }
    checkLoginStatus()

    const loadCars = () => {
      try {
        const storedCars = JSON.parse(localStorage.getItem("userCars") || "[]")

        if (storedCars.length === 0) {
          const defaultCars = [
            {
              id: "1",
              brand: "Toyota",
              model: "Camry",
              year: "2019",
              plate: "А123БВ777",
              mileage: "45 320 км",
              tires: "Michelin Pilot Sport 4",
              isPrimary: true,
              hasStorage: true,
            },
            {
              id: "2",
              brand: "Volkswagen",
              model: "Tiguan",
              year: "2020",
              plate: "Е456ЖЗ777",
              mileage: "32 150 км",
              tires: "Continental PremiumContact 6",
              isPrimary: false,
              hasStorage: false,
            },
          ]
          localStorage.setItem("userCars", JSON.stringify(defaultCars))
          setUserCars(defaultCars)
        } else {
          setUserCars(storedCars)
        }
      } catch (error) {
        console.error("Ошибка при загрузке автомобилей:", error)
      } finally {
        setCarsLoaded(true)
      }
    }

    if (isLoggedIn) {
      // Only load cars if user is "logged in"
      loadCars()
      const handleFocus = () => {
        loadCars()
      }
      window.addEventListener("focus", handleFocus)
      return () => {
        window.removeEventListener("focus", handleFocus)
      }
    }
  }, [isLoggedIn, step]) // Re-run if isLoggedIn or step changes
  // --- End Existing Account Page State & Handlers ---

  // --- New Login/Registration Logic ---
  const handleSendCode = async (formData: FormData) => {
    setError(null)
    const phone = formData.get("phoneNumber") as string
    setPhoneNumber(phone) // Store phone number for the next step
    const result = await sendSmsCodeForAuth(phone)
    if (result.success) {
      setStep("enterCode")
      toast({
        title: "Код отправлен",
        description: result.message,
        variant: "default",
      })
    } else {
      setError(result.message)
    }
  }

  const handleVerifyCodeAndLogin = async (formData: FormData) => {
    setError(null)
    const code = formData.get("code") as string
    const result = await verifySmsCodeAndLogin(phoneNumber, code)
    if (!result.success) {
      setError(result.message)
    }
    // Redirection is handled by the server action on success
  }

  // Render login form if not logged in
  if (!isLoggedIn) {
    return (
      <main className="flex flex-col min-h-screen items-center justify-center bg-[#D9D9DD] dark:bg-[#121212] p-4">
        <Card className="w-full max-w-md bg-white dark:bg-[#2A2A2A] text-[#1F1F1F] dark:text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Вход</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {step === "enterPhone"
                ? "Введите номер телефона, чтобы войти или зарегистрироваться."
                : `Введите код из SMS на номер ${phoneNumber}.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "enterPhone" && (
              <form action={handleSendCode} className="space-y-4">
                <div>
                  <Label htmlFor="phoneNumber">Номер телефона</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="+7 (XXX) XXX-XX-XX"
                    required
                    className="bg-[#F5F5F5] dark:bg-[#333333] text-[#1F1F1F] dark:text-white border-none focus:ring-[#009CFF]"
                  />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <SubmitButton text="Получить код" />
              </form>
            )}

            {step === "enterCode" && (
              <form action={handleVerifyCodeAndLogin} className="space-y-4">
                <div>
                  <Label htmlFor="code">Код из SMS</Label>
                  <Input
                    id="code"
                    name="code"
                    type="text"
                    placeholder="Введите 4-значный код"
                    maxLength={4}
                    required
                    className="bg-[#F5F5F5] dark:bg-[#333333] text-[#1F1F1F] dark:text-white border-none focus:ring-[#009CFF]"
                  />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <SubmitButton text="Войти" />
                <Button
                  variant="outline"
                  onClick={() => setStep("enterPhone")}
                  className="w-full mt-2 bg-transparent text-[#009CFF] border-[#009CFF] hover:bg-[#009CFF]/10"
                >
                  Изменить номер
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    )
  }

  // --- Render Account Details if Logged In ---
  return (
    <div className="min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <SafeAreaHeader title="Личный кабинет" />

      {/* Main content with top padding to account for fixed header */}
      <div className="pt-[calc(60px+env(safe-area-inset-top)+1rem)] px-4 pb-20 space-y-6">
        {/* User Welcome Card */}
        <Card className="bg-gradient-to-r from-[#D3DF3D] to-[#009CFF] text-white border-0">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">Добро пожаловать, {user.name}!</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Статус: {user.loyaltyLevel}</p>
                <p className="text-lg font-semibold">{user.loyaltyPoints} баллов</p>
              </div>
              <Award className="h-12 w-12 opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/account/cars/add">
            <Card className="bg-white dark:bg-[#2A2A2A] border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Plus className="h-8 w-8 mx-auto mb-2 text-[#D3DF3D]" />
                <p className="font-medium text-[#1F1F1F] dark:text-white">Добавить авто</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/account/orders">
            <Card className="bg-white dark:bg-[#2A2A2A] border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-[#009CFF]" />
                <p className="font-medium text-[#1F1F1F] dark:text-white">Мои заказы</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* My Cars Section */}
        <Card className="bg-white dark:bg-[#2A2A2A] border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-[#1F1F1F] dark:text-white">Мои автомобили</CardTitle>
              <Link href="/account/cars">
                <Button variant="ghost" size="sm" className="text-[#009CFF]">
                  Все <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {cars.map((car) => (
              <Link key={car.id} href={`/account/cars/${car.id}`}>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#333333] transition-colors">
                  <Image
                    src={car.image || "/placeholder.svg"}
                    alt={`${car.brand} ${car.model}`}
                    width={40}
                    height={40}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-[#1F1F1F] dark:text-white">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {car.year} • {car.tireSize}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Orders Section */}
        <Card className="bg-white dark:bg-[#2A2A2A] border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-[#1F1F1F] dark:text-white">Последние заказы</CardTitle>
              <Link href="/account/orders">
                <Button variant="ghost" size="sm" className="text-[#009CFF]">
                  Все <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/account/orders/details?id=${order.id}`}>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#333333] transition-colors">
                  <div>
                    <p className="font-medium text-[#1F1F1F] dark:text-white">Заказ {order.id}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.date).toLocaleDateString("ru-RU")} • {order.items} товара
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#1F1F1F] dark:text-white">{order.total.toLocaleString()} ₽</p>
                    <Badge
                      variant={order.status === "Доставлен" ? "default" : "secondary"}
                      className={order.status === "Доставлен" ? "bg-green-500" : "bg-orange-500"}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Settings Link */}
        <Link href="/settings">
          <Card className="bg-white dark:bg-[#2A2A2A] border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-[#1F1F1F] dark:text-white">Настройки аккаунта</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <BottomNavigation />
    </div>
  )
}
