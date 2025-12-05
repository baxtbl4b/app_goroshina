"use client"

import { ArrowLeft, Save, PenToolIcon as Tool } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation" // Import useRouter

export default function EditTiresPage() {
  const router = useRouter() // Initialize useRouter

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] p-4 shadow-sm">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Редактирование шин и дисков</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Tool className="h-6 w-6 text-[#009CFF]" />
            <h3 className="font-bold text-[#1F1F1F] dark:text-white">Информация о шинах</h3>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tire-brand" className="text-[#1F1F1F] dark:text-white">
                Марка шин
              </Label>
              <Select defaultValue="michelin">
                <SelectTrigger
                  id="tire-brand"
                  className="w-full bg-white dark:bg-[#1F1F1F] text-[#1F1F1F] dark:text-white border-[#D9D9DD] dark:border-[#3a3a3a]"
                >
                  <SelectValue placeholder="Выберите марку" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1F1F1F] text-[#1F1F1F] dark:text-white border-[#D9D9DD] dark:border-[#3a3a3a]">
                  <SelectItem value="michelin">Michelin</SelectItem>
                  <SelectItem value="continental">Continental</SelectItem>
                  <SelectItem value="pirelli">Pirelli</SelectItem>
                  <SelectItem value="bridgestone">Bridgestone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tire-model" className="text-[#1F1F1F] dark:text-white">
                Модель шин
              </Label>
              <Select defaultValue="pilot-sport-4">
                <SelectTrigger
                  id="tire-model"
                  className="w-full bg-white dark:bg-[#1F1F1F] text-[#1F1F1F] dark:text-white border-[#D9D9DD] dark:border-[#3a3a3a]"
                >
                  <SelectValue placeholder="Выберите модель" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1F1F1F] text-[#1F1F1F] dark:text-white border-[#D9D9DD] dark:border-[#3a3a3a]">
                  <SelectItem value="pilot-sport-4">Pilot Sport 4</SelectItem>
                  <SelectItem value="primacy-4">Primacy 4</SelectItem>
                  <SelectItem value="x-ice">X-Ice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="tire-width" className="text-[#1F1F1F] dark:text-white">
                  Ширина
                </Label>
                <Select defaultValue="225">
                  <SelectTrigger
                    id="tire-width"
                    className="w-full bg-white dark:bg-[#1F1F1F] text-[#1F1F1F] dark:text-white border-[#D9D9DD] dark:border-[#3a3a3a]"
                  >
                    <SelectValue placeholder="Ширина" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#1F1F1F] text-[#1F1F1F] dark:text-white border-[#D9D9DD] dark:border-[#3a3a3a]">
                    {[195, 205, 215, 225, 235, 245, 255].map((width) => (
                      <SelectItem key={width} value={width.toString()}>
                        {width}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tire-profile" className="text-[#1F1F1F] dark:text-white">
                  Профиль
                </Label>
                <Select defaultValue="45">
                  <SelectTrigger
                    id="tire-profile"
                    className="w-full bg-white dark:bg-[#1F1F1F] text-[#1F1F1F] dark:text-white border-[#D9D9DD] dark:border-[#3a3a3a]"
                  >
                    <SelectValue placeholder="Профиль" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#1F1F1F] text-[#1F1F1F] dark:text-white border-[#D9D9DD] dark:border-[#3a3a3a]">
                    {[40, 45, 50, 55, 60, 65, 70].map((profile) => (
                      <SelectItem key={profile} value={profile.toString()}>
                        {profile}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tire-diameter" className="text-[#1F1F1F] dark:text-white">
                  Диаметр
                </Label>
                <Select defaultValue="17">
                  <SelectTrigger
                    id="tire-diameter"
                    className="w-full bg-white dark:bg-[#1F1F1F] text-[#1F1F1F] dark:text-white border-[#D9D9DD] dark:border-[#3a3a3a]"
                  >
                    <SelectValue placeholder="R" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#1F1F1F] text-[#1F1F1F] dark:text-white border-[#D9D9DD] dark:border-[#3a3a3a]">
                    {[15, 16, 17, 18, 19, 20, 21].map((diameter) => (
                      <SelectItem key={diameter} value={diameter.toString()}>
                        R{diameter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="installation-date" className="text-[#1F1F1F] dark:text-white">
                Дата установки
              </Label>
              <Input
                id="installation-date"
                type="date"
                defaultValue="2023-04-15"
                className="w-full bg-white dark:bg-[#1F1F1F] text-[#1F1F1F] dark:text-white border-[#D9D9DD] dark:border-[#3a3a3a]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#1F1F1F] dark:text-white">Состояние шин (по 5-бальной шкале)</Label>
              <RadioGroup defaultValue="4" className="flex justify-between pt-2">
                <div className="flex flex-col items-center">
                  <RadioGroupItem value="1" id="r1" className="peer sr-only" />
                  <Label
                    htmlFor="r1"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#D9D9DD] dark:border-[#3a3a3a] bg-white dark:bg-[#1F1F1F] text-center peer-data-[state=checked]:bg-red-500 peer-data-[state=checked]:text-white peer-data-[state=checked]:border-red-500 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  >
                    1
                  </Label>
                  <span className="text-xs mt-1 text-[#1F1F1F] dark:text-white">Плохое</span>
                </div>
                <div className="flex flex-col items-center">
                  <RadioGroupItem value="2" id="r2" className="peer sr-only" />
                  <Label
                    htmlFor="r2"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#D9D9DD] dark:border-[#3a3a3a] bg-white dark:bg-[#1F1F1F] text-center peer-data-[state=checked]:bg-orange-500 peer-data-[state=checked]:text-white peer-data-[state=checked]:border-orange-500 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  >
                    2
                  </Label>
                  <span className="text-xs mt-1 text-[#1F1F1F] dark:text-white">Ниже среднего</span>
                </div>
                <div className="flex flex-col items-center">
                  <RadioGroupItem value="3" id="r3" className="peer sr-only" />
                  <Label
                    htmlFor="r3"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#D9D9DD] dark:border-[#3a3a3a] bg-white dark:bg-[#1F1F1F] text-center peer-data-[state=checked]:bg-yellow-500 peer-data-[state=checked]:text-white peer-data-[state=checked]:border-yellow-500 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  >
                    3
                  </Label>
                  <span className="text-xs mt-1 text-[#1F1F1F] dark:text-white">Среднее</span>
                </div>
                <div className="flex flex-col items-center">
                  <RadioGroupItem value="4" id="r4" className="peer sr-only" />
                  <Label
                    htmlFor="r4"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#D9D9DD] dark:border-[#3a3a3a] bg-white dark:bg-[#1F1F1F] text-center peer-data-[state=checked]:bg-[#009CFF] peer-data-[state=checked]:text-white peer-data-[state=checked]:border-[#009CFF] hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  >
                    4
                  </Label>
                  <span className="text-xs mt-1 text-[#1F1F1F] dark:text-white">Хорошее</span>
                </div>
                <div className="flex flex-col items-center">
                  <RadioGroupItem value="5" id="r5" className="peer sr-only" />
                  <Label
                    htmlFor="r5"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#D9D9DD] dark:border-[#3a3a3a] bg-white dark:bg-[#1F1F1F] text-center peer-data-[state=checked]:bg-[#D3DF3D] peer-data-[state=checked]:text-[#1F1F1F] peer-data-[state=checked]:border-[#D3DF3D] hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  >
                    5
                  </Label>
                  <span className="text-xs mt-1 text-[#1F1F1F] dark:text-white">Отличное</span>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2 pt-4">
              <Label htmlFor="rim-type" className="text-[#1F1F1F] dark:text-white">
                Тип дисков
              </Label>
              <Select defaultValue="alloy">
                <SelectTrigger
                  id="rim-type"
                  className="w-full bg-white dark:bg-[#1F1F1F] text-[#1F1F1F] dark:text-white border-[#D9D9DD] dark:border-[#3a3a3a]"
                >
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1F1F1F] text-[#1F1F1F] dark:text-white border-[#D9D9DD] dark:border-[#3a3a3a]">
                  <SelectItem value="alloy">Литые</SelectItem>
                  <SelectItem value="steel">Штампованные</SelectItem>
                  <SelectItem value="forged">Кованые</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button className="w-full py-3 rounded-xl bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F] font-semibold">
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
