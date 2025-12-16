import { ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import BottomNavigation from "@/components/bottom-navigation"

export default function ChangePasswordPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
              </Button>
            </Link>
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Изменение пароля</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Текущий пароль</Label>
              <div className="relative">
                <Input id="current-password" type="password" placeholder="Введите текущий пароль" className="pr-10" />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                  <Eye className="h-5 w-5 text-gray-400" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Новый пароль</Label>
              <div className="relative">
                <Input id="new-password" type="password" placeholder="Введите новый пароль" className="pr-10" />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                  <Eye className="h-5 w-5 text-gray-400" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Пароль должен содержать не менее 8 символов, включая буквы и цифры
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Подтвердите новый пароль</Label>
              <div className="relative">
                <Input id="confirm-password" type="password" placeholder="Подтвердите новый пароль" className="pr-10" />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                  <Eye className="h-5 w-5 text-gray-400" />
                </Button>
              </div>
            </div>

            <Button className="w-full bg-[#c4d402] hover:bg-[#c4d402]/80 text-[#1F1F1F] mt-4">
              Сохранить изменения
            </Button>
          </form>
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}
