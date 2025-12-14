"use client"

import { ChevronLeft, Car, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function EditCarPage() {
  const router = useRouter()

  return (
    <main className="flex flex-col min-h-screen bg-[#121212]">
      <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-2 flex items-center">
          <button
            onClick={() => router.back()}
            className="p-2 transition-colors"
            aria-label="Назад"
          >
            <ChevronLeft className="h-6 w-6 text-gray-300" />
          </button>
          <span className="text-xl font-bold text-white">Редактирование автомобиля</span>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Car className="h-6 w-6 text-[#009CFF]" />
            <h3 className="font-bold text-[#1F1F1F] dark:text-white">Информация об автомобиле</h3>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand" className="dark:text-white">
                Марка
              </Label>
              <Select defaultValue="toyota">
                <SelectTrigger id="brand" className="w-full">
                  <SelectValue placeholder="Выберите марку" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toyota">Toyota</SelectItem>
                  <SelectItem value="volkswagen">Volkswagen</SelectItem>
                  <SelectItem value="bmw">BMW</SelectItem>
                  <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                  <SelectItem value="audi">Audi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="dark:text-white">
                Модель
              </Label>
              <Select defaultValue="camry">
                <SelectTrigger id="model" className="w-full">
                  <SelectValue placeholder="Выберите модель" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="camry">Camry</SelectItem>
                  <SelectItem value="corolla">Corolla</SelectItem>
                  <SelectItem value="rav4">RAV4</SelectItem>
                  <SelectItem value="highlander">Highlander</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="dark:text-white">
                Год выпуска
              </Label>
              <Select defaultValue="2019">
                <SelectTrigger id="year" className="w-full">
                  <SelectValue placeholder="Выберите год" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => 2023 - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plate" className="dark:text-white">
                Гос. номер
              </Label>
              <Input id="plate" defaultValue="А123БВ777" className="w-full" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vin" className="dark:text-white">
                VIN-номер
              </Label>
              <Input id="vin" defaultValue="JTNBV58E50J012345" className="w-full" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage" className="dark:text-white">
                Пробег (км)
              </Label>
              <Input id="mileage" type="number" defaultValue="45320" className="w-full" />
            </div>

            <div className="pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="primary" defaultChecked />
                <Label htmlFor="primary" className="text-sm font-normal dark:text-white">
                  Сделать основным автомобилем
                </Label>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full py-3 rounded-xl bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F] font-semibold dark:text-[#1F1F1F]">
                <Save className="mr-2 h-5 w-5" />
                Сохранить изменения
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
