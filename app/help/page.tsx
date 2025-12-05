"use client"

import { Search, ShoppingCart, Car, Calendar, MessageCircle, Phone, Mail, HelpCircle, Settings } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SafeAreaHeader } from "@/components/safe-area-header"

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
  ]

  const faqItems = [
    {
      question: "Как узнать размер шин моего автомобиля?",
      answer:
        "Размер шин указан на боковине покрышки в формате 205/55 R16. Также эту информацию можно найти в техпаспорте автомобиля или на наклейке в дверном проеме водителя.",
    },
    {
      question: "Можно ли установить шины другого размера?",
      answer:
        "Рекомендуется использовать размеры, указанные производителем автомобиля. Установка шин другого размера может повлиять на безопасность и характеристики автомобиля.",
    },
    {
      question: "Как часто нужно менять шины?",
      answer:
        "Летние шины рекомендуется менять при остаточной глубине протектора менее 1.6 мм, зимние - менее 4 мм. Также учитывайте возраст шин (не более 6-8 лет).",
    },
    {
      question: "Что включает услуга шиномонтажа?",
      answer:
        "Стандартный шиномонтаж включает: снятие старых шин, установку новых, балансировку колес, проверку давления. Дополнительно можно заказать мойку дисков и другие услуги.",
    },
    {
      question: "Как работает программа лояльности?",
      answer:
        "За каждую покупку вы получаете баллы, которые можно потратить на скидки при следующих заказах. 1 балл = 1 рубль скидки. Баллы начисляются в размере 3-5% от суммы покупки.",
    },
    {
      question: "Можно ли вернуть товар?",
      answer:
        "Да, товар можно вернуть в течение 14 дней с момента покупки при условии сохранения товарного вида и наличия чека. Шины, бывшие в эксплуатации, возврату не подлежат.",
    },
  ]

  const quickActions = [
    {
      title: "Найти шины по размеру",
      description: "Введите размер в формате 205/55 R16",
      icon: <Search className="h-4 w-4" />,
      href: "/category/tires",
    },
    {
      title: "Записаться на шиномонтаж",
      description: "Выберите удобное время онлайн",
      icon: <Calendar className="h-4 w-4" />,
      href: "/tire-mounting",
    },
    {
      title: "Добавить автомобиль",
      description: "Для подбора подходящих шин",
      icon: <Car className="h-4 w-4" />,
      href: "/account/cars/add",
    },
  ]

  return (
    <div className="min-h-screen bg-[#121212]">
      <SafeAreaHeader title="Помощь" showBackButton={true} />

      <main className="pt-[82px]">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Welcome Section */}
          <Card className="bg-gradient-to-r from-[#009CFF] to-[#0080D6] text-white border-0">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <HelpCircle className="h-6 w-6" />
                Добро пожаловать в справку Горошина!
              </CardTitle>
              <CardDescription className="text-blue-100">
                Здесь вы найдете ответы на часто задаваемые вопросы и подробные инструкции по использованию приложения.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-[#1F1F1F] dark:text-white mb-3">Быстрые действия</h2>
            <div className="grid gap-3">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="bg-white dark:bg-[#2A2A2A] hover:shadow-md transition-shadow">
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
                </Link>
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

          {/* FAQ Section */}
          <div>
            <h2 className="text-lg font-semibold text-[#1F1F1F] dark:text-white mb-3">Часто задаваемые вопросы</h2>
            <Card className="bg-white dark:bg-[#2A2A2A]">
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="px-6">
                      <AccordionTrigger className="text-left text-[#1F1F1F] dark:text-white">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-gray-400">{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
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
              <CardTitle className="text-amber-800 dark:text-amber-200 flex items-center gap-2">
                <Settings className="h-5 w-5" />💡 Полезные советы
              </CardTitle>
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
              <p className="text-sm text-amber-700 dark:text-amber-300">
                • Используйте программу лояльности для получения скидок
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
