"use client"

import type React from "react"

import { ArrowLeft, Car, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
// Removed import { Toaster } from "@/components/ui/toaster"

export default function AddExpensePage() {
  const searchParams = useSearchParams()
  const [expenseType, setExpenseType] = useState("")
  const [expenseName, setExpenseName] = useState("")
  const [mileage, setMileage] = useState([52300])
  const [cost, setCost] = useState("")
  const [costError, setCostError] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const type = searchParams.get("type")
    const name = searchParams.get("name")

    if (type) {
      setExpenseType(type)
    }
    if (name) {
      setExpenseName(name)
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate cost field
    if (!cost || cost.trim() === "") {
      setCostError(true)
      return
    }

    setCostError(false)

    // Show success toast
    toast({
      title: "Расход добавлен",
      description: "Информация о расходе успешно сохранена",
    })

    // Navigate back to previous page
    router.back()
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#121212]">
      <header className="sticky top-0 z-10 bg-[#1f1f1f] p-4 shadow-sm">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Добавление расхода</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-4">
        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Car className="h-6 w-6 text-[#009CFF]" />
            <h3 className="font-bold text-[#1F1F1F] dark:text-white">Toyota Camry • А123БВ777</h3>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="expense-type" className="text-[#1F1F1F] dark:text-white">
                Тип расхода
              </Label>
              <Select value={expenseType} onValueChange={setExpenseType}>
                <SelectTrigger id="expense-type" className="w-full">
                  <SelectValue placeholder="Выберите тип расхода" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tires">Шины и диски</SelectItem>
                  <SelectItem value="service">Техобслуживание</SelectItem>
                  <SelectItem value="repair">Ремонт</SelectItem>
                  <SelectItem value="fuel">Топливо</SelectItem>
                  <SelectItem value="wash">Мойка</SelectItem>
                  <SelectItem value="other">Прочее</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-name" className="text-[#1F1F1F] dark:text-white">
                Название
              </Label>
              <Input
                id="expense-name"
                placeholder="Например: Замена шин"
                className="w-full bg-[#3a3a3a] border-[#3a3a3a] text-white placeholder:text-gray-400"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-date" className="text-[#1F1F1F] dark:text-white">
                Дата
              </Label>
              <Input
                id="expense-date"
                type="date"
                className="w-full bg-[#3a3a3a] border-[#3a3a3a] text-white placeholder:text-gray-400"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-place" className="text-[#1F1F1F] dark:text-white">
                Место
              </Label>
              <Input
                id="expense-place"
                placeholder={
                  expenseType === "tires"
                    ? "Шинный центр (необязательно)"
                    : expenseType === "service"
                      ? "Автосервис (необязательно)"
                      : expenseType === "fuel"
                        ? "АЗС (необязательно)"
                        : "Место (необязательно)"
                }
                className="w-full bg-[#3a3a3a] border-[#3a3a3a] text-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-mileage" className="text-[#1F1F1F] dark:text-white">
                Пробег (км)
              </Label>
              <Input
                id="expense-mileage"
                type="number"
                placeholder="52300"
                className="w-full bg-[#3a3a3a] border-[#3a3a3a] text-white placeholder:text-gray-400"
                value={mileage[0]}
                onChange={(e) => setMileage([Number.parseInt(e.target.value) || 0])}
              />
              <div className="px-2">
                <Slider
                  value={mileage}
                  onValueChange={setMileage}
                  max={300000}
                  min={0}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 км</span>
                  <span>{mileage[0].toLocaleString()} км</span>
                  <span>300,000 км</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-cost" className="text-[#1F1F1F] dark:text-white">
                Стоимость (₽)
              </Label>
              <Input
                id="expense-cost"
                type="number"
                placeholder="Введите сумму"
                className={`w-full bg-[#3a3a3a] border-[#3a3a3a] text-white placeholder:text-gray-400 ${
                  costError ? "border-red-500 focus:border-red-500" : ""
                }`}
                value={cost}
                onChange={(e) => {
                  setCost(e.target.value)
                  if (costError && e.target.value.trim() !== "") {
                    setCostError(false)
                  }
                }}
                required
              />
              {costError && <p className="text-red-500 text-sm mt-1">Поле "Стоимость" обязательно для заполнения</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-comment" className="text-[#1F1F1F] dark:text-white">
                Комментарий
              </Label>
              <Textarea
                id="expense-comment"
                placeholder={
                  expenseType === "tires"
                    ? "Замена летних шин на зимние"
                    : expenseType === "service"
                      ? "Плановое техническое обслуживание"
                      : "Дополнительная информация"
                }
                className="w-full bg-[#3a3a3a] border-[#3a3a3a] text-white placeholder:text-gray-400"
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#d3df3d] hover:bg-[#d3df3d]/80 text-[#1F1F1F] font-semibold"
              >
                <Plus className="mr-2 h-5 w-5" />
                Добавить расход
              </Button>
            </div>
          </form>
        </div>
      </div>
      {/* Removed <Toaster /> from here */}
    </main>
  )
}
