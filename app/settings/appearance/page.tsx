import { ArrowLeft, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import BottomNavigation from "@/components/bottom-navigation"

export default function AppearancePage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
              </Button>
            </Link>
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Оформление</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
          <h3 className="font-medium text-[#1F1F1F] dark:text-white mb-4">Тема</h3>

          <RadioGroup defaultValue="system" className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-[#333333] rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white dark:bg-[#2A2A2A] rounded-lg flex items-center justify-center mr-3">
                  <Sun className="h-5 w-5 text-[#D3DF3D]" />
                </div>
                <Label htmlFor="theme-light" className="text-[#1F1F1F] dark:text-white cursor-pointer">
                  Светлая
                </Label>
              </div>
              <RadioGroupItem value="light" id="theme-light" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-[#333333] rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#1F1F1F] rounded-lg flex items-center justify-center mr-3">
                  <Moon className="h-5 w-5 text-[#009CFF]" />
                </div>
                <Label htmlFor="theme-dark" className="text-[#1F1F1F] dark:text-white cursor-pointer">
                  Темная
                </Label>
              </div>
              <RadioGroupItem value="dark" id="theme-dark" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-[#333333] rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-white to-[#1F1F1F] rounded-lg flex items-center justify-center mr-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#D3DF3D] to-[#009CFF]"></div>
                </div>
                <Label htmlFor="theme-system" className="text-[#1F1F1F] dark:text-white cursor-pointer">
                  Системная
                </Label>
              </div>
              <RadioGroupItem value="system" id="theme-system" />
            </div>
          </RadioGroup>
        </div>

        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
          <h3 className="font-medium text-[#1F1F1F] dark:text-white mb-4">Акцентный цвет</h3>

          <div className="grid grid-cols-5 gap-3">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#D3DF3D] cursor-pointer ring-2 ring-offset-2 ring-[#D3DF3D]"></div>
              <span className="text-xs mt-1 text-[#1F1F1F] dark:text-white">Лайм</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#009CFF] cursor-pointer"></div>
              <span className="text-xs mt-1 text-[#1F1F1F] dark:text-white">Синий</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#FF5733] cursor-pointer"></div>
              <span className="text-xs mt-1 text-[#1F1F1F] dark:text-white">Красный</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#33FF57] cursor-pointer"></div>
              <span className="text-xs mt-1 text-[#1F1F1F] dark:text-white">Зеленый</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#8A33FF] cursor-pointer"></div>
              <span className="text-xs mt-1 text-[#1F1F1F] dark:text-white">Фиолет</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
          <h3 className="font-medium text-[#1F1F1F] dark:text-white mb-4">Дополнительно</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="animations" className="text-[#1F1F1F] dark:text-white">
                Анимации
              </Label>
              <Switch id="animations" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="rounded-corners" className="text-[#1F1F1F] dark:text-white">
                Скругленные углы
              </Label>
              <Switch id="rounded-corners" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="transparent-elements" className="text-[#1F1F1F] dark:text-white">
                Прозрачные элементы
              </Label>
              <Switch id="transparent-elements" />
            </div>
          </div>
        </div>

        <Button className="w-full bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F]">Сохранить изменения</Button>
      </div>

      <BottomNavigation />
    </main>
  )
}
