"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircleIcon } from "lucide-react"

export default function RegistrationSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 2000) // 2 секунды задержки

    return () => clearTimeout(timer) // Очистка таймера при размонтировании компонента
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#D9D9DD] dark:bg-[#121212] p-4 pb-8">
      <Card className="w-full max-w-sm p-6 text-center shadow-lg">
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <CheckCircleIcon className="h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Регистрация прошла успешно!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Вы будете перенаправлены на главную страницу через несколько секунд.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
