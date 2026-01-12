import { ArrowLeft, CreditCard, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import BottomNavigation from "@/components/bottom-navigation"

export default function PaymentMethodsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5 text-gray-900 dark:text-white" />
              </Button>
            </Link>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Способы оплаты</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        <div className="flex justify-end">
          <Button className="bg-[#c4d402] hover:bg-[#c4d402]/80 text-[#1F1F1F]">
            <Plus className="h-4 w-4 mr-2" /> Добавить карту
          </Button>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#1F1F1F] dark:bg-[#3A3A3A] rounded-lg flex items-center justify-center mr-3">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-[#1F1F1F] dark:text-white">•••• 4582</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Visa • 09/25</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-[#c4d402] text-xs font-bold px-2 py-1 rounded text-[#1F1F1F]">Основная</div>
                <Button variant="ghost" size="icon" className="text-red-500">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-[#3A3A3A] rounded-lg flex items-center justify-center mr-3">
                  <CreditCard className="h-6 w-6 text-[#1F1F1F] dark:text-white" />
                </div>
                <div>
                  <p className="font-medium text-[#1F1F1F] dark:text-white">•••• 7891</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">MasterCard • 11/24</p>
                </div>
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="text-red-500">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm mt-6">
          <h3 className="font-medium text-[#1F1F1F] dark:text-white mb-3">Другие способы оплаты</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-[#333333] rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white dark:bg-[#2A2A2A] rounded-lg flex items-center justify-center mr-3">
                  <img src="/placeholder.svg?height=24&width=24" alt="Apple Pay" className="h-6 w-6" />
                </div>
                <span className="text-[#1F1F1F] dark:text-white">Apple Pay</span>
              </div>
              <Button variant="ghost" size="sm" className="text-[#009CFF]">
                Подключить
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-[#333333] rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white dark:bg-[#2A2A2A] rounded-lg flex items-center justify-center mr-3">
                  <img src="/placeholder.svg?height=24&width=24" alt="Google Pay" className="h-6 w-6" />
                </div>
                <span className="text-[#1F1F1F] dark:text-white">Google Pay</span>
              </div>
              <Button variant="ghost" size="sm" className="text-[#009CFF]">
                Подключить
              </Button>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}
