"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, User, Award, Send, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

// Добавим импорт компонента Slider
import { Slider } from "@/components/ui/slider"

// Имитация данных пользователей
const mockUsers = [
  {
    id: 1,
    name: "Иванов Иван",
    phone: "+7 (999) 123-45-67",
    points: 750,
    avatar: "/placeholder.svg?height=100&width=100&text=ИИ",
  },
  {
    id: 2,
    name: "Петрова Анна",
    phone: "+7 (999) 234-56-78",
    points: 420,
    avatar: "/placeholder.svg?height=100&width=100&text=ПА",
  },
  {
    id: 3,
    name: "Сидоров Алексей",
    phone: "+7 (999) 345-67-89",
    points: 1200,
    avatar: "/placeholder.svg?height=100&width=100&text=СА",
  },
]

export default function TransferPointsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<null | (typeof mockUsers)[0]>(null)
  const [transferAmount, setTransferAmount] = useState("")
  const [transferStep, setTransferStep] = useState(1)
  const [transferSuccess, setTransferSuccess] = useState(false)
  const [recentTransfers, setRecentTransfers] = useState([
    { id: 1, name: "Смирнова Ольга", date: "12.04.2025", amount: 100 },
    { id: 2, name: "Козлов Дмитрий", date: "05.04.2025", amount: 50 },
  ])

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.replace(/\D/g, "").includes(searchQuery.replace(/\D/g, "")),
  )

  const handleUserSelect = (user: (typeof mockUsers)[0]) => {
    setSelectedUser(user)
    setTransferStep(2)
  }

  const handleTransfer = () => {
    // Имитация отправки запроса на сервер
    setTimeout(() => {
      setTransferSuccess(true)
      setTransferStep(3)
      // Добавляем в историю переводов
      if (selectedUser) {
        setRecentTransfers([
          {
            id: Date.now(),
            name: selectedUser.name,
            date: new Date().toLocaleDateString("ru-RU"),
            amount: Number.parseInt(transferAmount),
          },
          ...recentTransfers,
        ])
      }
    }, 1000)
  }

  const resetTransfer = () => {
    setSelectedUser(null)
    setTransferAmount("")
    setTransferStep(1)
    setTransferSuccess(false)
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-4 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
          </Button>
          <h1 className="text-lg font-bold text-[#1F1F1F] dark:text-white">Перевод баллов</h1>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        <Card className="bg-white dark:bg-[#2A2A2A] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#1F1F1F] dark:text-white text-lg">Ваш баланс</CardTitle>
            <CardDescription className="text-[#1F1F1F]/70 dark:text-white/70">Доступно для перевода</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-[#c4d402]" />
              <span className="text-2xl font-bold text-[#c4d402]">350 баллов</span>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="transfer" className="w-full">
          <TabsList className="w-full bg-[#1F1F1F] rounded-xl p-1">
            <TabsTrigger
              value="transfer"
              className="rounded-lg text-white transition-all duration-300 ease-in-out data-[state=active]:bg-[#c4d402] data-[state=active]:text-[#1F1F1F]"
            >
              Перевод
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-lg text-white transition-all duration-300 ease-in-out data-[state=active]:bg-[#c4d402] data-[state=active]:text-[#1F1F1F]"
            >
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transfer" className="mt-4 space-y-4">
            {transferStep === 1 && (
              <Card className="bg-white dark:bg-[#2A2A2A] shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#1F1F1F] dark:text-white">Найти получателя</CardTitle>
                  <CardDescription className="text-[#1F1F1F]/70 dark:text-white/70">
                    Введите номер телефона или имя
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="+7 (___) ___-__-__"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-[#F5F5F5] dark:bg-[#333333] border-none"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#1F1F1F]/50 dark:text-white/50" />
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {searchQuery && filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center p-3 bg-[#F5F5F5] dark:bg-[#333333] rounded-lg cursor-pointer hover:bg-[#EAEAEA] dark:hover:bg-[#444444]"
                          onClick={() => handleUserSelect(user)}
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                            <Image
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#1F1F1F] dark:text-white">{user.name}</p>
                            <p className="text-xs text-[#1F1F1F]/70 dark:text-white/70">{user.phone}</p>
                          </div>
                        </div>
                      ))
                    ) : searchQuery ? (
                      <div className="text-center py-4 text-[#1F1F1F]/70 dark:text-white/70">
                        Пользователи не найдены
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            )}

            {transferStep === 2 && selectedUser && (
              <Card className="bg-white dark:bg-[#2A2A2A] shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#1F1F1F] dark:text-white">Перевод баллов</CardTitle>
                  <CardDescription className="text-[#1F1F1F]/70 dark:text-white/70">
                    Укажите количество баллов для перевода
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center p-3 bg-[#F5F5F5] dark:bg-[#333333] rounded-lg">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                      <Image
                        src={selectedUser.avatar || "/placeholder.svg"}
                        alt={selectedUser.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1F1F1F] dark:text-white">{selectedUser.name}</p>
                      <p className="text-xs text-[#1F1F1F]/70 dark:text-white/70">{selectedUser.phone}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm text-[#1F1F1F]/70 dark:text-white/70">Количество баллов</label>
                      <div className="bg-[#c4d402] text-[#1F1F1F] px-3 py-1 rounded-full text-sm font-medium">
                        {transferAmount || "0"}
                      </div>
                    </div>

                    <Slider
                      defaultValue={[0]}
                      max={350}
                      step={1}
                      value={[Number(transferAmount) || 0]}
                      onValueChange={(value) => setTransferAmount(value[0].toString())}
                      className="py-4"
                    />

                    <div className="flex justify-between text-xs text-[#1F1F1F]/70 dark:text-white/70">
                      <span>0</span>
                      <span>Доступно: 350 баллов</span>
                    </div>

                    <Input
                      type="number"
                      placeholder="Введите количество баллов"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="bg-[#F5F5F5] dark:bg-[#333333] border-none"
                      max={350}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={resetTransfer}
                    className="border-[#1F1F1F]/20 dark:border-white/20"
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleTransfer}
                    disabled={
                      !transferAmount || Number.parseInt(transferAmount) <= 0 || Number.parseInt(transferAmount) > 350
                    }
                    className="bg-[#c4d402] hover:bg-[#C4CF2E] text-[#1F1F1F]"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Перевести
                  </Button>
                </CardFooter>
              </Card>
            )}

            {transferStep === 3 && selectedUser && (
              <Card className="bg-white dark:bg-[#2A2A2A] shadow-sm">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-500" />
                  </div>
                  <CardTitle className="text-[#1F1F1F] dark:text-white">Перевод выполнен</CardTitle>
                  <CardDescription className="text-[#1F1F1F]/70 dark:text-white/70">
                    Баллы успешно переведены
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center p-3 bg-[#F5F5F5] dark:bg-[#333333] rounded-lg">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                      <Image
                        src={selectedUser.avatar || "/placeholder.svg"}
                        alt={selectedUser.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1F1F1F] dark:text-white">{selectedUser.name}</p>
                      <p className="text-xs text-[#1F1F1F]/70 dark:text-white/70">{selectedUser.phone}</p>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-[#c4d402] mr-1" />
                      <span className="text-sm font-bold text-[#c4d402]">+{transferAmount}</span>
                    </div>
                  </div>

                  <div className="bg-[#F5F5F5] dark:bg-[#333333] p-3 rounded-lg">
                    <p className="text-sm text-[#1F1F1F]/70 dark:text-white/70">Ваш текущий баланс</p>
                    <div className="flex items-center mt-1">
                      <Award className="h-5 w-5 text-[#c4d402] mr-2" />
                      <span className="text-lg font-bold text-[#c4d402]">
                        {350 - Number.parseInt(transferAmount)} баллов
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={resetTransfer} className="w-full bg-[#c4d402] hover:bg-[#C4CF2E] text-[#1F1F1F]">
                    Готово
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-4">
            <Card className="bg-white dark:bg-[#2A2A2A] shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#1F1F1F] dark:text-white">История переводов</CardTitle>
                <CardDescription className="text-[#1F1F1F]/70 dark:text-white/70">
                  Последние переводы баллов
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentTransfers.length > 0 ? (
                  <div className="space-y-3">
                    {recentTransfers.map((transfer) => (
                      <div
                        key={transfer.id}
                        className="flex items-center justify-between p-3 bg-[#F5F5F5] dark:bg-[#333333] rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-[#1F1F1F]/10 dark:bg-white/10 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-[#1F1F1F]/70 dark:text-white/70" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1F1F1F] dark:text-white">{transfer.name}</p>
                            <p className="text-xs text-[#1F1F1F]/70 dark:text-white/70">{transfer.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-[#c4d402] mr-1" />
                          <span className="text-sm font-bold text-[#c4d402]">-{transfer.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#1F1F1F]/70 dark:text-white/70">
                    У вас пока нет истории переводов
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
