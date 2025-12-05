"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { completeProfile } from "@/app/auth-actions"
import { useFormStatus } from "react-dom"
import { toast } from "@/components/ui/use-toast"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full bg-[#D3DF3D] text-[#1F1F1F] hover:bg-[#D3DF3D]/80" disabled={pending}>
      {pending ? "Сохранение..." : "Сохранить данные"}
    </Button>
  )
}

export default function ProfileCompletionPage() {
  const searchParams = useSearchParams()
  const initialPhoneNumber = searchParams.get("phone") || ""
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!initialPhoneNumber) {
      // If no phone number is provided, redirect to login
      router.replace("/account")
      toast({
        title: "Ошибка",
        description: "Номер телефона не найден. Пожалуйста, войдите снова.",
        variant: "destructive",
      })
    }
  }, [initialPhoneNumber, router])

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    // Add phone number to formData before sending to server action
    formData.append("phoneNumber", phoneNumber)
    const result = await completeProfile(formData)
    if (!result.success) {
      setError(result.message)
    }
    // Redirection is handled by the server action on success
  }

  if (!phoneNumber) {
    return null // Or a loading spinner, while redirecting
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#D9D9DD] dark:bg-[#121212] p-4">
      <Card className="w-full max-w-md bg-white dark:bg-[#2A2A2A] text-[#1F1F1F] dark:text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Завершение профиля</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Пожалуйста, введите ваши личные данные.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="phoneNumberDisplay">Номер телефона</Label>
              <Input
                id="phoneNumberDisplay"
                type="tel"
                value={phoneNumber}
                readOnly
                disabled
                className="bg-[#E0E0E0] dark:bg-[#444444] text-[#1F1F1F] dark:text-gray-300 border-none"
              />
            </div>
            <div>
              <Label htmlFor="name">Ваше имя</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Иван Иванов"
                required
                className="bg-[#F5F5F5] dark:bg-[#333333] text-[#1F1F1F] dark:text-white border-none focus:ring-[#009CFF]"
              />
            </div>
            <div>
              <Label htmlFor="email">Email (необязательно)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ваша@почта.com"
                className="bg-[#F5F5F5] dark:bg-[#333333] text-[#1F1F1F] dark:text-white border-none focus:ring-[#009CFF]"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
