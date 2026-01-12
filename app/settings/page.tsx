"use client"

import {
  ArrowLeft,
  MapPin,
  Newspaper,
  Tag,
  Award,
  Ticket,
  Hash,
  BarChart3,
  Gift,
  History,
  Package,
  SettingsIcon,
  Lock,
  CreditCard,
  Bell,
  Palette,
  HelpCircle,
  Info,
  Smartphone,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5 text-gray-900 dark:text-white" />
              </Button>
            </Link>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Настройки</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        {/* Main Menu Items */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="divide-y divide-[#D9D9DD] dark:divide-[#3A3A3A]">
            <Link href="/city-selection" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-[#009CFF] mr-3" />
                <span className="text-[#1F1F1F] dark:text-white">Геопозиция</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Москва</span>
            </Link>

            <Link href="/news" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Newspaper className="h-5 w-5 text-[#009CFF] mr-3" />
                <span className="text-[#1F1F1F] dark:text-white">Новости</span>
              </div>
            </Link>

            <Link href="/promotions" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Tag className="h-5 w-5 text-[#009CFF] mr-3" />
                <span className="text-[#1F1F1F] dark:text-white">Акции</span>
              </div>
            </Link>

            <Link href="/more-points" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-[#009CFF] mr-3" />
                <span className="text-[#1F1F1F] dark:text-white">Больше баллов</span>
              </div>
            </Link>

            <Link href="/coupons" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Ticket className="h-5 w-5 text-[#009CFF] mr-3" />
                <span className="text-[#1F1F1F] dark:text-white">Купоны</span>
              </div>
              <span className="bg-[#c4d402] text-[#1F1F1F] text-xs font-bold px-2 py-1 rounded-full">2</span>
            </Link>

            <Link href="/promo-codes" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Hash className="h-5 w-5 text-[#009CFF] mr-3" />
                <span className="text-[#1F1F1F] dark:text-white">Промокоды</span>
              </div>
            </Link>

            <Link href="/survey" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-[#009CFF] mr-3" />
                <span className="text-[#1F1F1F] dark:text-white">Опрос</span>
              </div>
              <span className="bg-[#c4d402] text-[#1F1F1F] text-xs font-bold px-2 py-1 rounded-full">Новый</span>
            </Link>

            <Link href="/donate-points" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Gift className="h-5 w-5 text-[#009CFF] mr-3" />
                <span className="text-[#1F1F1F] dark:text-white">Пожертвовать баллы</span>
              </div>
            </Link>

            <Link href="/transaction-history" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <History className="h-5 w-5 text-[#009CFF] mr-3" />
                <span className="text-[#1F1F1F] dark:text-white">История операций</span>
              </div>
            </Link>

            <Link href="/goroshina-products" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-[#009CFF] mr-3" />
                <span className="text-[#1F1F1F] dark:text-white">Продукция Горошина</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="p-4">
            <h3 className="font-bold text-[#1F1F1F] dark:text-white flex items-center">
              <SettingsIcon className="h-5 w-5 text-[#009CFF] mr-2" />
              Настройки
            </h3>
          </div>
          <div className="divide-y divide-[#D9D9DD] dark:divide-[#3A3A3A]">
            <Link href="/settings/change-password" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-[#009CFF] mr-3" />
                <span className="text-[#1F1F1F] dark:text-white">Изменение пароля</span>
              </div>
            </Link>

            <Link href="/settings/payment-methods" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-[#009CFF] mr-3" />
                <span className="text-[#1F1F1F] dark:text-white">Способы оплаты</span>
              </div>
            </Link>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-[#009CFF] mr-3" />
                <span className="text-[#1F1F1F] dark:text-white">Уведомления</span>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Palette className="h-5 w-5 text-[#009CFF] mr-3" />
                  <span className="text-[#1F1F1F] dark:text-white">Изменить цвет темы</span>
                </div>
                <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Переключение между светлой и темной темой</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8">
          <Separator className="my-4 bg-[#D9D9DD] dark:bg-[#3A3A3A]" />
          <div className="flex justify-center gap-6 text-sm text-[#1F1F1F] dark:text-gray-400">
            <Link href="/about" className="flex items-center">
              <Info className="h-4 w-4 mr-1" />
              <span>О компании</span>
            </Link>
            <Link href="/about-app" className="flex items-center">
              <Smartphone className="h-4 w-4 mr-1" />
              <span>О приложении</span>
            </Link>
            <Link href="/help" className="flex items-center">
              <HelpCircle className="h-4 w-4 mr-1" />
              <span>Помощь</span>
            </Link>
          </div>
          <div className="text-center mt-4 text-xs text-gray-500 dark:text-gray-500">
            © 2023 Горошина. Все права защищены.
          </div>
        </div>
      </div>
    </main>
  )
}
