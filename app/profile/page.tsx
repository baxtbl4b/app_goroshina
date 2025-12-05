"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Settings, Heart, ShoppingBag, Clock, HelpCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/bottom-navigation"
import SafeAreaHeader from "@/components/safe-area-header"

export default function ProfilePage() {
  const [user] = useState({
    name: "Александр Петров",
    email: "alex.petrov@example.com",
    phone: "+7 (999) 123-45-67",
    loyaltyPoints: 1250,
    loyaltyLevel: "Золотой",
    avatar: "/avatars/01.png",
  })

  return (
    <div className="min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <SafeAreaHeader title="Профиль" />

      {/* Main content with top padding to account for fixed header */}
      <div className="pt-[calc(60px+env(safe-area-inset-top)+1rem)] px-4 pb-20">
        {/* User Info Card */}
        <Card className="mb-6 bg-white dark:bg-[#2A2A2A] border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-[#D3DF3D] text-[#1F1F1F] text-lg font-bold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#1F1F1F] dark:text-white">{user.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.phone}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge variant="secondary" className="bg-[#D3DF3D] text-[#1F1F1F]">
                    {user.loyaltyLevel}
                  </Badge>
                  <span className="text-sm font-medium text-[#D3DF3D]">{user.loyaltyPoints} баллов</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-white dark:bg-[#2A2A2A] border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-[#D3DF3D]" />
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
                    <div className="p-2 bg-[#D3DF3D]/20 rounded-lg">
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
                    <div className="p-2 bg-[#D3DF3D]/20 rounded-lg">
                      <ShoppingBag className="h-6 w-6 text-[#D3DF3D]" />
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

      <BottomNavigation />
    </div>
  )
}
