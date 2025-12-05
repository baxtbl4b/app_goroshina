"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

function SubmitButton({ step, pending }: { step: "phone" | "code"; pending: boolean }) {
  let buttonText = ""
  if (step === "phone") {
    buttonText = pending ? "Получение кода..." : "Получить код"
  } else {
    buttonText = pending ? "Подтверждение..." : "Подтвердить код"
  }

  return (
    <Button type="submit" className="w-full bg-[#D3DF3D] text-[#1F1F1F] hover:bg-[#D3DF3D]/80" disabled={pending}>
      {buttonText}
    </Button>
  )
}

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [smsCode, setSmsCode] = useState<string>("")
  const [codeSent, setCodeSent] = useState<boolean>(false)
  const [isPending, setIsPending] = useState<boolean>(false)
  const router = useRouter()

  const smsInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const MOCK_PHONE_NUMBER = "+7 999 123 45 67"
  const MOCK_SMS_CODE = "156156"

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    let digits = input.replace(/\D/g, "")

    if (digits.startsWith("8")) {
      digits = "7" + digits.substring(1)
    }

    if (digits.length > 0 && !digits.startsWith("7")) {
      digits = "7" + digits
    }

    digits = digits.substring(0, 11)

    let formattedNumber = ""
    if (digits.length > 0) {
      formattedNumber += "+"
      if (digits.length > 0) {
        formattedNumber += digits.substring(0, 1)
        if (digits.length > 1) {
          formattedNumber += " " + digits.substring(1, 4)
          if (digits.length > 4) {
            formattedNumber += " " + digits.substring(4, 7)
            if (digits.length > 7) {
              formattedNumber += " " + digits.substring(7, 9)
              if (digits.length > 9) {
                formattedNumber += " " + digits.substring(9, 11)
              }
            }
          }
        }
      }
    }
    setPhoneNumber(formattedNumber)
  }

  const handleSmsCodeInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    const newSmsCodeArray = smsCode.split("")
    newSmsCodeArray[index] = value.slice(-1)
    const newSmsCode = newSmsCodeArray.join("")
    setSmsCode(newSmsCode)

    if (value && index < 5) {
      smsInputRefs.current[index + 1]?.focus()
    }
  }

  const handleSmsCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !smsCode[index] && index > 0) {
      smsInputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setIsPending(true)

    try {
      if (!codeSent) {
        const submittedPhoneNumber = phoneNumber.replace(/\s/g, "")
        if (submittedPhoneNumber === MOCK_PHONE_NUMBER.replace(/\s/g, "")) {
          setCodeSent(true)
          setError(null)
        } else {
          setError(`Для демонстрации используйте номер: ${MOCK_PHONE_NUMBER}`)
        }
      } else {
        if (smsCode === MOCK_SMS_CODE) {
          router.push("/register/success")
        } else {
          setError("Неверный код. Попробуйте еще раз.")
        }
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#D9D9DD] dark:bg-[#121212] p-4">
      <Card className="relative w-full max-w-md bg-white dark:bg-[#2A2A2A] text-[#1F1F1F] dark:text-white overflow-hidden">
        <Image
          src="/images/logoanim.svg"
          alt="Logo Animation"
          width={400} // Увеличил размер
          height={400} // Увеличил размер
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 opacity-10 animate-pulse-slow" // Переместил вверх и скорректировал translateY
          priority
        />
        <CardHeader className="text-center z-10 relative">
          <CardTitle className="text-2xl font-bold">Вход</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {codeSent
              ? `Введите код из SMS, отправленный на ${phoneNumber}`
              : "Введите номер телефона, чтобы войти или зарегистрироваться."}
          </CardDescription>
        </CardHeader>
        <CardContent className="z-10 relative">
          <form action={handleSubmit} className="space-y-4">
            {!codeSent ? (
              <div>
                <Label htmlFor="phoneNumber">Номер телефона</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+7"
                  required
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className="bg-[#F5F5F5] dark:bg-[#333333] text-[#1F1F1F] dark:text-white border-none focus:ring-[#009CFF]"
                />
              </div>
            ) : (
              <div>
                <div className="flex space-x-2 justify-center">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Input
                      key={index}
                      id={`smsCode-${index}`}
                      name={`smsCode-${index}`}
                      type="text"
                      maxLength={1}
                      value={smsCode[index] || ""}
                      onChange={(e) => handleSmsCodeInputChange(e, index)}
                      onKeyDown={(e) => handleSmsCodeKeyDown(e, index)}
                      className="w-12 h-12 text-center text-2xl bg-[#F5F5F5] dark:bg-[#333333] text-[#1F1F1F] dark:text-white border-none focus:ring-[#009CFF]"
                      ref={(el) => (smsInputRefs.current[index] = el)}
                    />
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <SubmitButton step={codeSent ? "code" : "phone"} pending={isPending} />
          </form>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Нажимая "Получить код", вы соглашаетесь с{" "}
            <a href="/terms-of-service" className="text-[#009CFF] hover:underline">
              правилами пользовательского соглашения
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
