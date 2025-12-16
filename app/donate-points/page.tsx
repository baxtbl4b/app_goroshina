"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Award, Heart, Check, Gift, Users, PawPrint, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"

const mockCharities = [
  {
    id: "charity1",
    name: "Фонд 'Доброе Сердце'",
    description: "Помощь детям с редкими заболеваниями.",
    logo: Gift,
    image: "/placeholder.svg?height=150&width=300",
  },
  {
    id: "charity2",
    name: "Приют 'Лапа Помощи'",
    description: "Поддержка бездомных животных.",
    logo: PawPrint,
    image: "/placeholder.svg?height=150&width=300",
  },
  {
    id: "charity3",
    name: "ЭкоФонд 'Зеленая Планета'",
    description: "Защита окружающей среды и экологии.",
    logo: Heart,
    image: "/placeholder.svg?height=150&width=300",
  },
  {
    id: "charity4",
    name: "Вместе Мы Сила",
    description: "Поддержка пожилых людей и ветеранов.",
    logo: Users,
    image: "/placeholder.svg?height=150&width=300",
  },
  {
    // New block for the new store
    id: "newStoreFund",
    name: "На открытие нового магазина",
    description: "Помогите нам стать ближе к вам! Ваши баллы ускорят открытие нового шинного центра.",
    logo: Store, // Using the Store icon
    image: "/placeholder.svg?height=150&width=300",
  },
]

const USER_BALANCE = 1250 // Mock user balance

export default function DonatePointsPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCharity, setSelectedCharity] = useState<(typeof mockCharities)[0] | null>(null)
  const [donationAmount, setDonationAmount] = useState(50)
  const [donationSuccess, setDonationSuccess] = useState(false)

  const handleCharitySelect = (charity: (typeof mockCharities)[0]) => {
    setSelectedCharity(charity)
    setCurrentStep(2)
  }

  const handleConfirmDonation = () => {
    // Simulate API call
    setTimeout(() => {
      setDonationSuccess(true)
      setCurrentStep(3)
    }, 1000)
  }

  const resetDonation = () => {
    setCurrentStep(1)
    setSelectedCharity(null)
    setDonationAmount(50)
    setDonationSuccess(false)
  }

  const availableBalance = USER_BALANCE - (donationSuccess ? donationAmount : 0)

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (currentStep === 1 ? router.back() : resetDonation())}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
          </Button>
          <h1 className="text-lg font-bold text-[#1F1F1F] dark:text-white">Пожертвовать баллы</h1>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        <Card className="bg-white dark:bg-[#2A2A2A] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#1F1F1F] dark:text-white text-lg">Ваш баланс</CardTitle>
            <CardDescription className="text-[#1F1F1F]/70 dark:text-white/70">
              Доступно для пожертвования
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-[#c4d402]" />
              <span className="text-2xl font-bold text-[#c4d402]">{availableBalance} баллов</span>
            </div>
          </CardContent>
        </Card>

        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#1F1F1F] dark:text-white">Выберите организацию</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockCharities.map((charity) => (
                <Card
                  key={charity.id}
                  className="bg-white dark:bg-[#2A2A2A] shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleCharitySelect(charity)}
                >
                  <CardHeader className="p-0">
                    <Image
                      src={charity.image || "/placeholder.svg"}
                      alt={charity.name}
                      width={300}
                      height={150}
                      className="rounded-t-lg object-cover w-full h-32"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <charity.logo className="h-6 w-6 text-[#009CFF] mr-2" />
                      <CardTitle className="text-md text-[#1F1F1F] dark:text-white">{charity.name}</CardTitle>
                    </div>
                    <CardDescription className="text-sm text-[#1F1F1F]/70 dark:text-white/70">
                      {charity.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && selectedCharity && (
          <Card className="bg-white dark:bg-[#2A2A2A] shadow-sm">
            <CardHeader>
              <div className="flex items-center mb-2">
                <selectedCharity.logo className="h-8 w-8 text-[#009CFF] mr-3" />
                <CardTitle className="text-xl text-[#1F1F1F] dark:text-white">
                  Пожертвование в "{selectedCharity.name}"
                </CardTitle>
              </div>
              <CardDescription className="text-[#1F1F1F]/70 dark:text-white/70">
                {selectedCharity.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="donationAmount" className="text-sm font-medium text-[#1F1F1F] dark:text-white">
                    Сумма пожертвования
                  </label>
                  <div className="bg-[#c4d402] text-[#1F1F1F] px-3 py-1 rounded-full text-sm font-medium">
                    {donationAmount} баллов
                  </div>
                </div>
                <Slider
                  id="donationAmount"
                  min={10}
                  max={USER_BALANCE}
                  step={10}
                  value={[donationAmount]}
                  onValueChange={(value) => setDonationAmount(value[0])}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-[#1F1F1F]/70 dark:text-white/70">
                  <span>10</span>
                  <span>{USER_BALANCE}</span>
                </div>
              </div>
              <Input
                type="number"
                placeholder="Или введите сумму"
                value={donationAmount}
                onChange={(e) => {
                  const val = Number.parseInt(e.target.value)
                  if (val >= 10 && val <= USER_BALANCE) setDonationAmount(val)
                  else if (e.target.value === "") setDonationAmount(10)
                }}
                min={10}
                max={USER_BALANCE}
                className="bg-[#F5F5F5] dark:bg-[#333333] border-none"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetDonation} className="border-[#1F1F1F]/20 dark:border-white/20">
                Отмена
              </Button>
              <Button
                onClick={handleConfirmDonation}
                disabled={donationAmount <= 0 || donationAmount > USER_BALANCE}
                className="bg-[#c4d402] hover:bg-[#C4CF2E] text-[#1F1F1F]"
              >
                <Heart className="h-4 w-4 mr-2" />
                Пожертвовать
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 3 && donationSuccess && selectedCharity && (
          <Card className="bg-white dark:bg-[#2A2A2A] shadow-sm">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-xl text-[#1F1F1F] dark:text-white">Спасибо за вашу доброту!</CardTitle>
              <CardDescription className="text-[#1F1F1F]/70 dark:text-white/70">
                Вы успешно пожертвовали {donationAmount} баллов в "{selectedCharity.name}".
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-3 bg-[#F5F5F5] dark:bg-[#333333] rounded-lg">
                <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0 bg-muted flex items-center justify-center">
                  <selectedCharity.logo className="h-7 w-7 text-[#009CFF]" />
                </div>
                <div className="flex-1">
                  <p className="text-md font-medium text-[#1F1F1F] dark:text-white">{selectedCharity.name}</p>
                  <p className="text-xs text-[#1F1F1F]/70 dark:text-white/70">Пожертвовано: {donationAmount} баллов</p>
                </div>
              </div>
              <Separator />
              <div className="text-center">
                <p className="text-sm text-[#1F1F1F]/70 dark:text-white/70">Ваш новый баланс:</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Award className="h-6 w-6 text-[#c4d402]" />
                  <span className="text-2xl font-bold text-[#c4d402]">{availableBalance} баллов</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => router.push("/settings")}
                className="w-full bg-[#c4d402] hover:bg-[#C4CF2E] text-[#1F1F1F]"
              >
                Готово
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
  )
}
