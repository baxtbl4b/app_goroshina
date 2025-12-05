"use client"

import { useRouter } from "next/navigation"
import { CheckCircle2, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SurveyCompletePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#D9D9DD] dark:bg-[#121212] pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-[#2A2A2A] p-4 sticky top-0 z-10 shadow-sm">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/settings")}>
              <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
            </Button>
            <h1 className="text-lg font-medium text-[#1F1F1F] dark:text-white">Опрос завершен</h1>
          </div>
        </div>
      </div>

      {/* Completion Content */}
      <div className="p-4">
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#D3DF3D] flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-[#1F1F1F]" />
          </div>

          <h2 className="text-xl font-bold text-[#1F1F1F] dark:text-white mb-2">Спасибо за участие в опросе!</h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Ваше мнение очень важно для нас и поможет улучшить наш сервис.
          </p>

          <div className="bg-[#F5F5F5] dark:bg-[#3A3A3A] p-4 rounded-lg mb-6 w-full">
            <p className="text-[#1F1F1F] dark:text-white font-medium mb-2">Вам начислено:</p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl font-bold text-[#009CFF]">+100</span>
              <span className="text-[#1F1F1F] dark:text-white">баллов</span>
            </div>
          </div>

          <div className="space-y-3 w-full">
            <Button onClick={() => router.push("/settings")} className="w-full bg-[#009CFF] hover:bg-[#0084D8]">
              Вернуться в настройки
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full border-[#009CFF] text-[#009CFF]"
            >
              <Home className="mr-2 h-4 w-4" />
              На главную
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
