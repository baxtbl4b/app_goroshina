"use client"

import { ArrowLeft, Hash, Copy, Check, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils" // Убедимся, что cn импортирован

export default function PromoCodesPage() {
  const router = useRouter()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [newPromoCode, setNewPromoCode] = useState("")
  const [promoCodeError, setPromoCodeError] = useState<string | null>(null)
  const [promoCodeSuccess, setPromoCodeSuccess] = useState<string | null>(null) // Новое состояние для успешного сообщения

  // Отладочное сообщение: проверяем текущее состояние promoCodeError и promoCodeSuccess
  console.log("Current promoCodeError state:", promoCodeError)
  console.log("Current promoCodeSuccess state:", promoCodeSuccess)

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleAddPromoCode = () => {
    setPromoCodeError(null) // Clear previous errors
    setPromoCodeSuccess(null) // Clear previous success messages

    if (!newPromoCode.trim()) {
      setPromoCodeError("Пожалуйста, введите промокод.")
      console.log("Setting promoCodeError to: Пожалуйста, введите промокод.")
      return
    }

    // Simulate promo code validation: "INVALID" is the only invalid code now
    if (newPromoCode.trim().toUpperCase() === "INVALID") {
      setPromoCodeError("Введенный промокод недействителен. Пожалуйста, проверьте его и попробуйте снова.")
      console.log("Setting promoCodeError to: Введенный промокод недействителен.")
      return
    }

    // If not "INVALID" and not empty, it's considered successful for this demo
    setPromoCodeSuccess(`Промокод "${newPromoCode}" успешно добавлен!`)
    console.log("Setting promoCodeSuccess to:", `Промокод "${newPromoCode}" успешно добавлен!`)

    // Here you would typically validate and add the promo code with a backend call
    console.log("Adding promo code:", newPromoCode)
    // For demonstration, clear input on successful "add"
    setNewPromoCode("")
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
            </Button>
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Промокоды</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        {/* Add Promo Code Section */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4">
          <h3 className="font-bold text-lg text-[#1F1F1F] dark:text-white mb-3">Добавить промокод</h3>
          {promoCodeError && (
            <div className="bg-red-900 text-white p-3 rounded-md mb-4 text-lg font-extrabold border-2 border-red-950">
              {promoCodeError}
            </div>
          )}
          {promoCodeSuccess && ( // Отображаем сообщение об успехе
            <div className="bg-green-600 text-white p-3 rounded-md mb-4 text-lg font-extrabold border-2 border-green-700">
              {promoCodeSuccess}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Введите промокод"
              value={newPromoCode}
              onChange={(e) => setNewPromoCode(e.target.value)}
              className={cn("flex-1", promoCodeError && "border-red-500 focus:border-red-500 focus:ring-red-500")}
            />
            <Button
              onClick={handleAddPromoCode}
              className="bg-[#c4d402] hover:bg-[#c4d402]/80 text-[#1F1F1F]"
              disabled={!newPromoCode.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Введите промокод, полученный от партнеров или в рекламных акциях
          </p>
        </div>

        {/* Active Promo Codes */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#D9D9DD] dark:border-[rgb(38,38,38)]">
            <h3 className="font-bold text-lg text-[#1F1F1F] dark:text-white">Активные промокоды</h3>
          </div>

          <div className="divide-y divide-[#D9D9DD] dark:divide-[#3A3A3A]">
            {/* Promo Code 1 */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Hash className="h-5 w-5 text-[#009CFF] mr-2" />
                  <span className="font-bold text-[#1F1F1F] dark:text-white">WINTER2024</span>
                </div>
                <span className="bg-[#c4d402] text-[#1F1F1F] text-xs font-bold px-2 py-1 rounded-full">Активен</span>
              </div>
              <p className="text-sm text-[#1F1F1F] dark:text-gray-300 mb-2">Скидка 20% на зимние шины</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Действует до 31.12.2024</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard("WINTER2024")}
                  className="text-[#009CFF] border-[#009CFF]"
                >
                  {copiedCode === "WINTER2024" ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Скопировано
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Копировать
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Promo Code 2 */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Hash className="h-5 w-5 text-[#009CFF] mr-2" />
                  <span className="font-bold text-[#1F1F1F] dark:text-white">NEWCLIENT</span>
                </div>
                <span className="bg-[#c4d402] text-[#1F1F1F] text-xs font-bold px-2 py-1 rounded-full">Активен</span>
              </div>
              <p className="text-sm text-[#1F1F1F] dark:text-gray-300 mb-2">Скидка 15% для новых клиентов</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Действует до 15.01.2025</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard("NEWCLIENT")}
                  className="text-[#009CFF] border-[#009CFF]"
                >
                  {copiedCode === "NEWCLIENT" ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Скопировано
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Копировать
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Promo Code 3 */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Hash className="h-5 w-5 text-[#009CFF] mr-2" />
                  <span className="font-bold text-[#1F1F1F] dark:text-white">MOUNTING50</span>
                </div>
                <span className="bg-[#c4d402] text-[#1F1F1F] text-xs font-bold px-2 py-1 rounded-full">Активен</span>
              </div>
              <p className="text-sm text-[#1F1F1F] dark:text-gray-300 mb-2">Скидка 50% на шиномонтаж</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Действует до 28.02.2025</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard("MOUNTING50")}
                  className="text-[#009CFF] border-[#009CFF]"
                >
                  {copiedCode === "MOUNTING50" ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Скопировано
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Копировать
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Used Promo Codes */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#D9D9DD] dark:border-[rgb(38,38,38)]">
            <h3 className="font-bold text-lg text-[#1F1F1F] dark:text-white">Использованные промокоды</h3>
          </div>

          <div className="divide-y divide-[#D9D9DD] dark:divide-[#3A3A3A]">
            {/* Used Promo Code */}
            <div className="p-4 opacity-60">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Hash className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="font-bold text-[#1F1F1F] dark:text-white">SUMMER2023</span>
                </div>
                <span className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-1 rounded-full">
                  Использован
                </span>
              </div>
              <p className="text-sm text-[#1F1F1F] dark:text-gray-300 mb-2">Скидка 25% на летние шины</p>
              <span className="text-xs text-gray-500 dark:text-gray-400">Использован 15.08.2023</span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-[#009CFF]/10 dark:bg-[#009CFF]/20 rounded-xl p-4">
          <h3 className="font-bold text-[#1F1F1F] dark:text-white mb-2">Как использовать промокоды?</h3>
          <ul className="text-sm text-[#1F1F1F] dark:text-gray-300 space-y-1">
            <li>• Скопируйте промокод нажав на кнопку "Копировать"</li>
            <li>• Добавьте товары в корзину</li>
            <li>• При оформлении заказа введите промокод в специальное поле</li>
            <li>• Скидка будет применена автоматически</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
