"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Settings, Heart, ShoppingBag, Clock, HelpCircle, LogOut, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/bottom-navigation"
import SafeAreaHeader from "@/components/safe-area-header"
import { getUser, updateUserAvatar, imageToBase64, type User } from "@/lib/user"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const [user, setUser] = useState<User>(getUser())
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const { toast } = useToast()

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

  useEffect(() => {
    // Загружаем данные пользователя
    const currentUser = getUser()
    setUser(currentUser)

    // Слушаем изменения данных пользователя
    const handleUserUpdate = (event: CustomEvent) => {
      setUser(event.detail)
    }
    window.addEventListener("userUpdated", handleUserUpdate as EventListener)

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate as EventListener)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#121212]">
      <SafeAreaHeader title="Профиль" />

      {/* Main content with top padding to account for fixed header */}
      <div className="pt-[calc(60px+env(safe-area-inset-top)+1rem)] px-4 pb-20">
        {/* User Info Card */}
        <Card className="mb-6 bg-white dark:bg-[#2A2A2A] border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={user.avatar && user.avatar.startsWith('data:') ? user.avatar : (user.avatar || "/placeholder.svg")}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-[#c4d402] text-[#1F1F1F] text-lg font-bold">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  id="avatar-upload-profile"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                />
                <label
                  htmlFor="avatar-upload-profile"
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#c4d402] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#b3c002] transition-colors shadow-md active:scale-95"
                >
                  {isUploadingAvatar ? (
                    <div className="w-3.5 h-3.5 border-2 border-[#1F1F1F] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-[#1F1F1F]" />
                  )}
                </label>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#1F1F1F] dark:text-white">{user.name}</h2>
                {user.email && <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>}
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.phone}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge variant="secondary" className="bg-[#c4d402] text-[#1F1F1F]">
                    {user.loyaltyLevel}
                  </Badge>
                  <span className="text-sm font-medium text-[#c4d402]">{user.loyaltyPoints} баллов</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-white dark:bg-[#2A2A2A] border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-[#c4d402]" />
              <p className="text-2xl font-bold text-[#1F1F1F] dark:text-white">12</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Заказов</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-[#2A2A2A] border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-bold text-[#1F1F1F] dark:text-white">8</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Избранное</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-[#2A2A2A] border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold text-[#1F1F1F] dark:text-white">3</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">В ожидании</p>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          <Link href="/account/cars">
            <Card className="bg-white dark:bg-[#2A2A2A] border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#c4d402]/20 rounded-lg">
                      <Image src="/images/crossover-suv.png" alt="Мои автомобили" width={24} height={24} />
                    </div>
                    <span className="font-medium text-[#1F1F1F] dark:text-white">Мои автомобили</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/account/orders">
            <Card className="bg-white dark:bg-[#2A2A2A] border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#c4d402]/20 rounded-lg">
                      <ShoppingBag className="h-6 w-6 text-[#c4d402]" />
                    </div>
                    <span className="font-medium text-[#1F1F1F] dark:text-white">История заказов</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/favorites">
            <Card className="bg-white dark:bg-[#2A2A2A] border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <Heart className="h-6 w-6 text-red-500" />
                    </div>
                    <span className="font-medium text-[#1F1F1F] dark:text-white">Избранное</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/loyalty">
            <Card className="bg-white dark:bg-[#2A2A2A] border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <Image src="/images/coin.png" alt="Программа лояльности" width={24} height={24} />
                    </div>
                    <span className="font-medium text-[#1F1F1F] dark:text-white">Программа лояльности</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/settings">
            <Card className="bg-white dark:bg-[#2A2A2A] border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-500/20 rounded-lg">
                      <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="font-medium text-[#1F1F1F] dark:text-white">Настройки</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profile/help">
            <Card className="bg-white dark:bg-[#2A2A2A] border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <HelpCircle className="h-6 w-6 text-blue-500" />
                    </div>
                    <span className="font-medium text-[#1F1F1F] dark:text-white">Помощь</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-white dark:bg-[#2A2A2A] border-0 shadow-sm">
            <CardContent className="p-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Выйти из аккаунта
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
