"use client"

import { ArrowLeft, Search, ShoppingCart, User, Heart, Car, Calendar, MessageCircle, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HelpPage() {
  const helpSections = [
    {
      title: "Поиск и покупка шин",
      icon: <Search className="h-5 w-5" />,
      steps: [
        "Выберите размер шин в разделе 'Шины' или воспользуйтесь поиском",
        "Используйте фильтры для выбора бренда, сезона и других параметров",
        "Нажмите на понравившуюся шину для просмотра подробной информации",
        "Добавьте товар в корзину и оформите заказ",
      ],
    },
    {
      title: "Управление автомобилями",
      icon: <Car className="h-5 w-5" />,
      steps: [
        "Перейдите в раздел 'Аккаунт' → 'Мои автомобили'",
        "Добавьте свой автомобиль, указав марку, модель и год выпуска",
        "Система автоматически подберет подходящие размеры шин",
        "Ведите учет расходов и истории обслуживания",
      ],
    },
    {
      title: "Запись на услуги",
      icon: <Calendar className="h-5 w-5" />,
      steps: [
        "Выберите нужную услугу: шиномонтаж, хранение, покраска дисков",
        "Укажите удобное время и дату",
        "Подтвердите запись и получите уведомление",
        "Приезжайте в назначенное время с документами",
      ],
    },
    {
      title: "Корзина и заказы",
      icon: <ShoppingCart className="h-5 w-5" />,
      steps: [
        "Добавляйте товары в корзину из каталога",
        "Просматривайте содержимое корзины в правом верхнем углу",
        "Оформите заказ, выбрав способ доставки и оплаты",
        "Отслеживайте статус заказа в разделе 'Мои заказы'",
      ],
    },
    {
      title: "Избранное",
      icon: <Heart className="h-5 w-5" />,
      steps: [
        "Нажмите на иконку сердца у понравившегося товара",
        "Все избранные товары сохраняются в разделе 'Избранное'",
        "Быстро добавляйте товары из избранного в корзину",
        "Следите за изменением цен на избранные товары",
      ],
    },
    {
      title: "Профиль и настройки",
      icon: <User className="h-5 w-5" />,
      steps: [
        "Заполните профиль для быстрого оформления заказов",
        "Измените фото профиля и контактные данные",
        "Настройте уведомления и тему приложения",
        "Просматривайте историю заказов и транзакций",
      ],
    },
  ]

  const quickActions = [
    {
      title: "Найти шины по размеру",
      description: "Введите размер в формате 205/55 R16",
      icon: <Search className="h-4 w-4" />,
    },
    {
      title: "Записаться на шиномонтаж",
      description: "Выберите удобное время онлайн",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Добавить автомобиль",
      description: "Для подбора подходящих шин",
      icon: <Car className="h-4 w-4" />,
    },
  ]

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#1F1F1F]">
      {/* Header */}
      <div className="bg-white dark:bg-[#2A2A2A] border-b border-[#D9D9DD] dark:border-[#3A3A3A]">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-[#1F1F1F] dark:text-white">Помощь</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-[#009CFF] to-[#0080D6] text-white border-0">
          <CardHeader>
            <CardTitle className="text-xl">Добро пожаловать в Горошина!</CardTitle>
            <CardDescription className="text-blue-100">
              Здесь вы найдете все необходимое для вашего автомобиля. Следуйте инструкциям ниже для эффективного
              использования приложения.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-[#1F1F1F] dark:text-white mb-3">Быстрые действия</h2>
          <div className="grid gap-3">
            {quickActions.map((action, index) => (
              <Card key={index} className="bg-white dark:bg-[#2A2A2A]">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#009CFF]/10 rounded-lg">{action.icon}</div>
                    <div>
                      <h3 className="font-medium text-[#1F1F1F] dark:text-white">{action.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Help Sections */}
        <div>
          <h2 className="text-lg font-semibold text-[#1F1F1F] dark:text-white mb-3">Подробные инструкции</h2>
          <div className="space-y-4">
            {helpSections.map((section, index) => (
              <Card key={index} className="bg-white dark:bg-[#2A2A2A]">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-[#1F1F1F] dark:text-white">
                    <div className="p-2 bg-[#009CFF]/10 rounded-lg">{section.icon}</div>
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {section.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-[#009CFF] text-white text-xs rounded-full flex items-center justify-center font-medium">
                          {stepIndex + 1}
                        </span>
                        <span className="text-sm text-[#1F1F1F] dark:text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <Card className="bg-white dark:bg-[#2A2A2A]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#1F1F1F] dark:text-white">
              <MessageCircle className="h-5 w-5" />
              <span>Нужна дополнительная помощь?</span>
            </CardTitle>
            <CardDescription>Свяжитесь с нашей службой поддержки любым удобным способом</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-[#3A3A3A] rounded-lg">
              <Phone className="h-4 w-4 text-[#009CFF]" />
              <div>
                <p className="font-medium text-[#1F1F1F] dark:text-white">Телефон</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">+7 (800) 123-45-67</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-[#3A3A3A] rounded-lg">
              <Mail className="h-4 w-4 text-[#009CFF]" />
              <div>
                <p className="font-medium text-[#1F1F1F] dark:text-white">Email</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">support@goroshina.ru</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-[#3A3A3A] rounded-lg">
              <MessageCircle className="h-4 w-4 text-[#009CFF]" />
              <div>
                <p className="font-medium text-[#1F1F1F] dark:text-white">Онлайн-чат</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Доступен 24/7 в приложении</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="text-amber-800 dark:text-amber-200">💡 Полезные советы</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              • Добавьте свой автомобиль для персонализированных рекомендаций
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              • Используйте фильтры для быстрого поиска нужных товаров
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300">• Следите за акциями в разделе "Промокоды"</p>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              • Записывайтесь на услуги заранее для гарантированного времени
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
