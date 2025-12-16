"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { Award, ChevronRight, Plus, ShoppingBag, Settings, Car, Heart, Clock, Star, LogOut, User, Phone, Camera, Pencil, X, Check } from "lucide-react"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { sendSmsCodeForAuth, verifySmsCodeAndLogin } from "@/app/auth-actions"
import SafeAreaHeader from "@/components/safe-area-header"
import BottomNavigation from "@/components/bottom-navigation"
import { getUser, saveUser, updateUserAvatar, imageToBase64, type User } from "@/lib/user"

// Helper component for submit button state
function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      className="w-full h-12 bg-[#c4d402] text-[#1F1F1F] hover:bg-[#c4d402]/90 font-semibold rounded-xl shadow-lg shadow-[#c4d402]/20 transition-all duration-200 active:scale-[0.98]"
      disabled={pending}
    >
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

  const [user, setUser] = useState<User>(getUser())


  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoaded, setOrdersLoaded] = useState(false)

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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  // Состояния для редактирования профиля
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите изображение",
        variant: "destructive",
      })
      return
    }

    // Проверка размера (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Ошибка",
        description: "Размер изображения не должен превышать 5MB",
        variant: "destructive",
      })
      return
    }

    setIsUploadingAvatar(true)

    try {
      const base64 = await imageToBase64(file)
      updateUserAvatar(base64)

      toast({
        title: "Успешно",
        description: "Аватар обновлен",
        variant: "default",
      })
    } catch (error) {
      console.error("Ошибка при загрузке аватара:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение",
        variant: "destructive",
      })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const toggleCarExpansion = (carId: string) => {
    setExpandedCars((prev) => ({
      ...prev,
      [carId]: !prev[carId],
    }))
  }

  const startEditingProfile = () => {
    setEditName(user.name)
    setEditPhone(user.phone)
    setIsEditingProfile(true)
  }

  const cancelEditingProfile = () => {
    setIsEditingProfile(false)
    setEditName("")
    setEditPhone("")
  }

  const saveProfile = () => {
    if (!editName.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите имя",
        variant: "destructive",
      })
      return
    }

    setIsSavingProfile(true)

    // Сохраняем обновленные данные
    const updatedUser = {
      ...user,
      name: editName.trim(),
      phone: editPhone.trim(),
    }

    saveUser(updatedUser)
    setUser(updatedUser)

    toast({
      title: "Успешно",
      description: "Данные профиля обновлены",
      variant: "default",
    })

    setIsSavingProfile(false)
    setIsEditingProfile(false)
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
    // Загружаем данные пользователя и автоматически логиним тестового пользователя
    const currentUser = getUser()
    setUser(currentUser)
    setIsLoggedIn(true) // Автоматически логиним тестового пользователя

    // Слушаем изменения данных пользователя
    const handleUserUpdate = (event: CustomEvent) => {
      setUser(event.detail)
    }
    window.addEventListener("userUpdated", handleUserUpdate as EventListener)

    const loadCars = () => {
      try {
        const storedCars = JSON.parse(localStorage.getItem("userCars") || "[]")
        setUserCars(storedCars)
      } catch (error) {
        console.error("Ошибка при загрузке автомобилей:", error)
      } finally {
        setCarsLoaded(true)
      }
    }

    const loadOrders = () => {
      try {
        const storedOrders = JSON.parse(localStorage.getItem("userOrders") || "[]")
        setOrders(storedOrders)
      } catch (error) {
        console.error("Ошибка при загрузке заказов:", error)
      } finally {
        setOrdersLoaded(true)
      }
    }

    // Загружаем данные пользователя
    loadCars()
    loadOrders()

    const handleFocus = () => {
      loadCars()
      loadOrders()
    }

    const handleOrdersUpdated = () => {
      loadOrders()
    }

    const handleCarsUpdated = () => {
      loadCars()
    }

    window.addEventListener("focus", handleFocus)
    window.addEventListener("userOrdersUpdated", handleOrdersUpdated)
    window.addEventListener("userCarsUpdated", handleCarsUpdated)

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate as EventListener)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("userOrdersUpdated", handleOrdersUpdated)
      window.removeEventListener("userCarsUpdated", handleCarsUpdated)
    }
  }, []) // Запускаем один раз при монтировании
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
      <main className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-[#1F1F1F] to-[#2A2A2A] p-4">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-[#c4d402] rounded-3xl flex items-center justify-center shadow-xl shadow-[#c4d402]/20">
            <User className="w-10 h-10 text-[#1F1F1F]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Горошина</h1>
          <p className="text-gray-400 text-sm mt-1">Личный кабинет</p>
        </div>

        <Card className="w-full max-w-md bg-[#2A2A2A] border-0 rounded-3xl shadow-2xl overflow-hidden">
          <CardHeader className="text-center pb-2 pt-6">
            <CardTitle className="text-xl font-bold text-white">
              {step === "enterPhone" ? "Войти в аккаунт" : "Подтверждение"}
            </CardTitle>
            <CardDescription className="text-gray-400 mt-2">
              {step === "enterPhone"
                ? "Введите номер телефона для входа"
                : `Код отправлен на ${phoneNumber}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {step === "enterPhone" && (
              <form action={handleSendCode} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-gray-300 text-sm">Номер телефона</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="+7 (900) 123-45-67"
                      required
                      className="h-12 pl-12 bg-[#1F1F1F] text-white border-0 rounded-xl focus:ring-2 focus:ring-[#c4d402] placeholder:text-gray-500"
                    />
                  </div>
                </div>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}
                <SubmitButton text="Получить код" />
              </form>
            )}

            {step === "enterCode" && (
              <form action={handleVerifyCodeAndLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-gray-300 text-sm">Код из SMS</Label>
                  <Input
                    id="code"
                    name="code"
                    type="text"
                    placeholder="• • • •"
                    maxLength={4}
                    required
                    className="h-14 text-center text-2xl tracking-[1em] bg-[#1F1F1F] text-white border-0 rounded-xl focus:ring-2 focus:ring-[#c4d402] placeholder:text-gray-600"
                  />
                </div>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}
                <SubmitButton text="Подтвердить" />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("enterPhone")}
                  className="w-full h-12 text-[#009CFF] hover:bg-[#009CFF]/10 rounded-xl"
                >
                  Изменить номер
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-gray-500 text-xs mt-6 text-center max-w-xs">
          Продолжая, вы соглашаетесь с условиями использования и политикой конфиденциальности
        </p>
      </main>
    )
  }

  // --- Render Account Details if Logged In ---
  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Custom Header */}
      <header className="sticky top-0 z-50 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-2 flex items-center justify-between">
          <div className="flex items-center">
            <BackButton />
            <h1 className="text-xl font-bold text-white">Профиль</h1>
          </div>
          <Link href="/settings">
            <button className="p-2 transition-colors" aria-label="Настройки">
              <Settings className="h-5 w-5 text-gray-400" />
            </button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div className="px-4 pt-5 pb-24 space-y-5">
        {/* User Profile Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#c4d402] via-[#B8C736] to-[#009CFF] p-[1px]">
          <div className="relative bg-[#2A2A2A] rounded-[23px] p-5">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c4d402] to-[#009CFF] flex items-center justify-center overflow-hidden">
                  {user.avatar && user.avatar.startsWith('data:') ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-2xl font-bold text-[#1F1F1F]">
                      {user.name.charAt(0)}
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#c4d402] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#C4CF2E] transition-colors active:scale-95"
                >
                  {isUploadingAvatar ? (
                    <div className="w-3 h-3 border-2 border-[#1F1F1F] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-3.5 h-3.5 text-[#1F1F1F]" />
                  )}
                </label>
              </div>
              {/* User Info */}
              <div className="flex-1">
                {isEditingProfile ? (
                  <div className="space-y-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Имя"
                      className="h-9 bg-[#1F1F1F] border-0 text-white rounded-xl text-sm"
                    />
                    <Input
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="Телефон"
                      className="h-9 bg-[#1F1F1F] border-0 text-white rounded-xl text-sm"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-bold text-white">{user.name}</h2>
                    <p className="text-gray-400 text-sm">{user.phone}</p>
                  </>
                )}
              </div>
              {/* Edit Button */}
              {isEditingProfile ? (
                <div className="flex gap-2">
                  <button
                    onClick={cancelEditingProfile}
                    className="w-8 h-8 rounded-lg bg-[#1F1F1F] flex items-center justify-center hover:bg-[#333] transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={saveProfile}
                    disabled={isSavingProfile}
                    className="w-8 h-8 rounded-lg bg-[#c4d402] flex items-center justify-center hover:bg-[#C4CF2E] transition-colors disabled:opacity-50"
                  >
                    {isSavingProfile ? (
                      <div className="w-4 h-4 border-2 border-[#1F1F1F] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 text-[#1F1F1F]" />
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={startEditingProfile}
                  className="w-8 h-8 rounded-lg bg-[#1F1F1F] flex items-center justify-center hover:bg-[#333] transition-colors"
                >
                  <Pencil className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Loyalty Stats */}
            <div className="mt-5 flex gap-3">
              <div className="flex-1 bg-[#1F1F1F] rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-[#c4d402]" />
                  <span className="text-xs text-gray-400">Статус</span>
                </div>
                <p className="text-white font-semibold">{user.loyaltyLevel}</p>
              </div>
              <div className="flex-1 bg-[#1F1F1F] rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-full bg-[#c4d402]" />
                  <span className="text-xs text-gray-400">Баллы</span>
                </div>
                <p className="text-white font-semibold">{user.loyaltyPoints.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-4 gap-3">
          <Link href="/account/cars/add" className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#2A2A2A] flex items-center justify-center mb-2 hover:bg-[#333] transition-colors">
              <Plus className="h-6 w-6 text-[#c4d402]" />
            </div>
            <span className="text-xs text-gray-400 text-center">Добавить</span>
          </Link>
          <Link href="/account/orders" className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#2A2A2A] flex items-center justify-center mb-2 hover:bg-[#333] transition-colors">
              <ShoppingBag className="h-6 w-6 text-[#009CFF]" />
            </div>
            <span className="text-xs text-gray-400 text-center">Заказы</span>
          </Link>
          <Link href="/favorites" className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#2A2A2A] flex items-center justify-center mb-2 hover:bg-[#333] transition-colors">
              <Heart className="h-6 w-6 text-red-400" />
            </div>
            <span className="text-xs text-gray-400 text-center">Избранное</span>
          </Link>
          <Link href="/account/history" className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#2A2A2A] flex items-center justify-center mb-2 hover:bg-[#333] transition-colors">
              <Clock className="h-6 w-6 text-orange-400" />
            </div>
            <span className="text-xs text-gray-400 text-center">История</span>
          </Link>
        </div>

        {/* My Cars Section */}
        <div className="bg-[#2A2A2A] rounded-3xl overflow-hidden">
          <div className="flex items-center justify-between p-4 pb-2">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-[#c4d402]" />
              <h3 className="font-bold text-white">Мои автомобили</h3>
            </div>
            <Link href="/account/cars">
              <Button variant="ghost" size="sm" className="text-[#009CFF] hover:bg-[#009CFF]/10 rounded-xl h-8 px-3">
                Все <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="px-4 pb-4 space-y-2">
            {!carsLoaded ? (
              <div className="text-center py-6 text-gray-500">
                <div className="w-8 h-8 border-2 border-[#c4d402] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Загрузка...
              </div>
            ) : userCars.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-3 bg-[#1F1F1F] rounded-2xl flex items-center justify-center">
                  <Car className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-400 mb-4">У вас пока нет автомобилей</p>
                <Link href="/account/cars/add">
                  <Button className="bg-[#c4d402] text-[#1F1F1F] hover:bg-[#c4d402]/90 rounded-xl h-10 px-6 font-semibold">
                    <Plus className="h-4 w-4 mr-2" /> Добавить авто
                  </Button>
                </Link>
              </div>
            ) : (
              userCars.slice(0, 3).map((car, index) => (
                <Link key={car.id} href={`/account/cars/${car.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1F1F1F] hover:bg-[#252525] transition-colors active:scale-[0.98]">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#009CFF]/20 to-[#c4d402]/20 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {car.brand?.charAt(0) || "A"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white truncate">
                          {car.brand} {car.model}
                        </p>
                        {car.isPrimary && (
                          <Badge className="bg-[#c4d402]/20 text-[#c4d402] text-[10px] px-2 py-0.5 rounded-md shrink-0">
                            Основной
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {car.year} • {car.plate || "Без номера"}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-600 shrink-0" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-[#2A2A2A] rounded-3xl overflow-hidden">
          <div className="flex items-center justify-between p-4 pb-2">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#009CFF]" />
              <h3 className="font-bold text-white">Последние заказы</h3>
            </div>
            <Link href="/account/orders">
              <Button variant="ghost" size="sm" className="text-[#009CFF] hover:bg-[#009CFF]/10 rounded-xl h-8 px-3">
                Все <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="px-4 pb-4 space-y-2">
            {!ordersLoaded ? (
              <div className="text-center py-6 text-gray-500">
                <div className="w-8 h-8 border-2 border-[#009CFF] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Загрузка...
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-3 bg-[#1F1F1F] rounded-2xl flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-400 mb-4">У вас пока нет заказов</p>
                <Link href="/category/tires">
                  <Button className="bg-[#009CFF] text-white hover:bg-[#009CFF]/90 rounded-xl h-10 px-6 font-semibold">
                    <ShoppingBag className="h-4 w-4 mr-2" /> Перейти в каталог
                  </Button>
                </Link>
              </div>
            ) : (
              orders.slice(0, 3).map((order) => (
                <Link key={order.id} href={`/account/orders/details?id=${order.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1F1F1F] hover:bg-[#252525] transition-colors active:scale-[0.98]">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        order.status === "delivered" || order.status === "Доставлен"
                          ? "bg-green-500/20"
                          : order.status === "processing" || order.status === "В обработке"
                          ? "bg-orange-500/20"
                          : "bg-[#009CFF]/20"
                      }`}>
                        <ShoppingBag className={`w-5 h-5 ${
                          order.status === "delivered" || order.status === "Доставлен"
                            ? "text-green-400"
                            : order.status === "processing" || order.status === "В обработке"
                            ? "text-orange-400"
                            : "text-[#009CFF]"
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          #{order.id?.slice(-6) || order.id}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.date ? new Date(order.date).toLocaleDateString("ru-RU") : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {(order.total || 0).toLocaleString()} ₽
                      </p>
                      <span className={`text-xs ${
                        order.status === "delivered" || order.status === "Доставлен"
                          ? "text-green-400"
                          : order.status === "cancelled" || order.status === "Отменён"
                          ? "text-red-400"
                          : order.status === "processing" || order.status === "В обработке"
                          ? "text-orange-400"
                          : "text-[#009CFF]"
                      }`}>
                        {order.status === "delivered" ? "Доставлен" :
                         order.status === "processing" ? "В обработке" :
                         order.status === "cancelled" ? "Отменён" :
                         order.status === "pending" ? "Ожидает" :
                         order.status || "Новый"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-[#2A2A2A] rounded-3xl overflow-hidden divide-y divide-white/5">
          <Link href="/settings" className="flex items-center justify-between p-4 hover:bg-[#333] transition-colors active:scale-[0.99]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1F1F1F] flex items-center justify-center">
                <Settings className="w-5 h-5 text-gray-400" />
              </div>
              <span className="font-medium text-white">Настройки</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </Link>
          <Link href="/help" className="flex items-center justify-between p-4 hover:bg-[#333] transition-colors active:scale-[0.99]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1F1F1F] flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-medium text-white">Помощь</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("userSession")
              setIsLoggedIn(false)
            }}
            className="w-full flex items-center justify-between p-4 hover:bg-[#333] transition-colors active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-400" />
              </div>
              <span className="font-medium text-red-400">Выйти</span>
            </div>
          </button>
        </div>

        {/* App Version */}
        <p className="text-center text-gray-600 text-xs pb-4">
          Горошина v1.0.0
        </p>
      </div>
    </div>
  )
}
