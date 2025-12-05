"use client"

import {
  Smartphone,
  Search,
  Car,
  Calendar,
  Heart,
  ShoppingCart,
  Award,
  Phone,
  Mail,
  Clock,
  FileText,
  Shield,
  Cookie,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SafeAreaHeader } from "@/components/safe-area-header"

export default function AboutAppPage() {
  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Поиск шин",
      description: "Быстрый поиск по размеру, бренду и характеристикам",
    },
    {
      icon: <Car className="h-6 w-6" />,
      title: "Мои автомобили",
      description: "Управление автопарком и подбор подходящих шин",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Запись на услуги",
      description: "Онлайн-запись на шиномонтаж и другие услуги",
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "Удобные покупки",
      description: "Простое оформление заказов и отслеживание доставки",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Избранное",
      description: "Сохранение понравившихся товаров для быстрого доступа",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Программа лояльности",
      description: "Накопление баллов и получение скидок",
    },
  ]

  const legalLinks = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Пользовательское соглашение",
      description: "Условия использования приложения",
      href: "/terms-of-service",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Договор оферты",
      description: "Условия покупки товаров и услуг",
      href: "/offer-agreement",
    },
    {
      icon: <Cookie className="h-5 w-5" />,
      title: "Информация об обработке cookies",
      description: "Политика использования файлов cookie",
      href: "/cookie-policy",
    },
  ]

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#1F1F1F]">
      <SafeAreaHeader title="О приложении" showBackButton={true} />

      <main className="pt-[82px]">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* App Description */}
          <Card className="bg-gradient-to-r from-[#009CFF] to-[#0080D6] text-white border-0">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-white/20 rounded-full w-fit">
                <Smartphone className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Горошина - шины для города</CardTitle>
              <CardDescription className="text-blue-100 text-base">
                Ваш надежный помощник в мире шин и автомобильных услуг. Мы предлагаем широкий ассортимент качественных
                шин, дисков и аксессуаров, а также профессиональные услуги по шиномонтажу, хранению и обслуживанию
                автомобилей.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Key Features */}
          <div>
            <h2 className="text-xl font-semibold text-[#1F1F1F] dark:text-white mb-4">Основные возможности</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white dark:bg-[#2A2A2A] hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-[#009CFF]/10 rounded-lg text-[#009CFF]">{feature.icon}</div>
                      <div>
                        <h3 className="font-semibold text-[#1F1F1F] dark:text-white mb-1">{feature.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* App Information */}
          <Card className="bg-white dark:bg-[#2A2A2A]">
            <CardHeader>
              <CardTitle className="text-[#1F1F1F] dark:text-white">Информация о приложении</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Версия</span>
                <span className="font-medium text-[#1F1F1F] dark:text-white">2.1.4</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Последнее обновление</span>
                <span className="font-medium text-[#1F1F1F] dark:text-white">15 декабря 2024</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Разработчик</span>
                <span className="font-medium text-[#1F1F1F] dark:text-white">ООО "Горошина"</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400">Размер</span>
                <span className="font-medium text-[#1F1F1F] dark:text-white">24.7 МБ</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white dark:bg-[#2A2A2A]">
            <CardHeader>
              <CardTitle className="text-[#1F1F1F] dark:text-white">Контактная информация</CardTitle>
              <CardDescription>Свяжитесь с нами любым удобным способом</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#009CFF]/10 rounded-lg">
                  <Phone className="h-4 w-4 text-[#009CFF]" />
                </div>
                <div>
                  <p className="font-medium text-[#1F1F1F] dark:text-white">+7 (800) 123-45-67</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Бесплатный звонок по России</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#009CFF]/10 rounded-lg">
                  <Mail className="h-4 w-4 text-[#009CFF]" />
                </div>
                <div>
                  <p className="font-medium text-[#1F1F1F] dark:text-white">info@goroshina.ru</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Электронная почта</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#009CFF]/10 rounded-lg">
                  <Clock className="h-4 w-4 text-[#009CFF]" />
                </div>
                <div>
                  <p className="font-medium text-[#1F1F1F] dark:text-white">Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Время работы службы поддержки</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Documents */}
          <Card className="bg-white dark:bg-[#2A2A2A]">
            <CardHeader>
              <CardTitle className="text-[#1F1F1F] dark:text-white">Правовая информация</CardTitle>
              <CardDescription>Документы, регулирующие использование приложения</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {legalLinks.map((link, index) => (
                <Link key={index} href={link.href}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#3A3A3A] transition-colors">
                    <div className="p-2 bg-[#009CFF]/10 rounded-lg text-[#009CFF]">{link.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#1F1F1F] dark:text-white">{link.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{link.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card className="bg-gray-50 dark:bg-[#2A2A2A] border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                © 2024 ООО "Горошина". Все права защищены.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Приложение разработано для удобства наших клиентов и предоставления качественных автомобильных услуг.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
