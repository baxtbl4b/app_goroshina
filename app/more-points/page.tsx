"use client"

import {
  ArrowLeft,
  ShoppingCart,
  Users,
  Star,
  Gift,
  Calendar,
  Share2,
  MessageCircle,
  Award,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MorePointsPage() {
  const pointsWays = [
    {
      icon: ShoppingCart,
      title: "Покупки в магазине",
      description: "Получайте 1 балл за каждые 100₽ покупки",
      points: "+1 балл/100₽",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: Users,
      title: "Приведи друга",
      description: "Пригласите друга и получите бонус при его первой покупке",
      points: "+500 баллов",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: Star,
      title: "Отзывы о товарах",
      description: "Оставляйте честные отзывы о купленных товарах",
      points: "+50 баллов",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      icon: Calendar,
      title: "День рождения",
      description: "Специальный подарок в ваш день рождения",
      points: "+1000 баллов",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: Share2,
      title: "Поделиться в соцсетях",
      description: "Расскажите о нас в социальных сетях",
      points: "+25 баллов",
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
    {
      icon: MessageCircle,
      title: "Участие в опросах",
      description: "Помогите нам стать лучше, участвуя в опросах",
      points: "+100 баллов",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
  ]

  const bonusActivities = [
    {
      icon: Target,
      title: "Достижения",
      description: "Выполняйте специальные задания и получайте аграды",
      badge: "Новое",
    },
    {
      icon: TrendingUp,
      title: "Программа лояльности",
      description: "Повышайте свой статус для получения больших бонусов",
      badge: "VIP",
    },
    {
      icon: Zap,
      title: "Акции и промокоды",
      description: "Следите за специальными предложениями",
      badge: "Горячее",
    },
  ]

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-4 flex items-center">
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5 text-gray-900 dark:text-white" />
            </Button>
          </Link>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Больше баллов</span>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        {/* Header Card */}
        <Card className="bg-gradient-to-r from-[#009CFF] to-[#0080D6] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Зарабатывайте больше!</h2>
                <p className="text-blue-100">Узнайте все способы получения баллов</p>
              </div>
              <Award className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        {/* Main Ways to Earn Points */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#1F1F1F] dark:text-white">Основные способы заработка</h3>

          {pointsWays.map((way, index) => {
            const IconComponent = way.icon
            return (
              <Card key={index} className="bg-white dark:bg-[#2A2A2A]">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full ${way.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${way.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-[#1F1F1F] dark:text-white">{way.title}</h4>
                        <Badge variant="secondary" className="bg-[#c4d402] text-[#1F1F1F] font-bold">
                          {way.points}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{way.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bonus Activities */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#1F1F1F] dark:text-white">Дополнительные возможности</h3>

          {bonusActivities.map((activity, index) => {
            const IconComponent = activity.icon
            return (
              <Card key={index} className="bg-white dark:bg-[#2A2A2A]">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-gray-50 dark:bg-gray-800">
                      <IconComponent className="h-6 w-6 text-[#009CFF]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-[#1F1F1F] dark:text-white">{activity.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {activity.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tips Section */}
        <Card className="bg-white dark:bg-[#2A2A2A]">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[#1F1F1F] dark:text-white mb-4">💡 Полезные советы</h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start space-x-2">
                <span className="text-[#009CFF] font-bold">•</span>
                <span>Баллы начисляются в течение 24 часов после покупки</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-[#009CFF] font-bold">•</span>
                <span>Срок действия баллов — 12 месяцев с момента начисления</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-[#009CFF] font-bold">•</span>
                <span>1 балл = 1 рубль при оплате следующих покупок</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-[#009CFF] font-bold">•</span>
                <span>Баллами можно оплатить до 50% стоимости заказа</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Card className="bg-white dark:bg-[#2A2A2A]">
          <CardContent className="p-4">
            <Button className="w-full bg-[#009CFF] hover:bg-[#0080D6] text-white">
              <Gift className="h-4 w-4 mr-2" />
              Начать зарабатывать баллы
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
