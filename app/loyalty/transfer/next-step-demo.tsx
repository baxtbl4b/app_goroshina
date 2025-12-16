"use client"

import { Award, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"

export default function NextStepDemo() {
  // Это демонстрационный компонент, показывающий второй шаг процесса перевода
  return (
    <div className="p-4 bg-[#D9D9DD] dark:bg-[#121212] min-h-screen">
      <Card className="bg-white dark:bg-[#2A2A2A] shadow-sm mb-4">
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

      <Card className="bg-white dark:bg-[#2A2A2A] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#1F1F1F] dark:text-white">Перевод баллов</CardTitle>
          <CardDescription className="text-[#1F1F1F]/70 dark:text-white/70">
            Укажите количество баллов для перевода
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Информация о получателе */}
          <div className="flex items-center p-3 bg-[#F5F5F5] dark:bg-[#333333] rounded-lg">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
              <Image
                src="/placeholder.svg?height=100&width=100&text=ИИ"
                alt="Иванов Иван"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#1F1F1F] dark:text-white">Иванов Иван</p>
              <p className="text-xs text-[#1F1F1F]/70 dark:text-white/70">+7 (999) 123-45-67</p>
            </div>
          </div>

          {/* Выбор количества баллов */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm text-[#1F1F1F]/70 dark:text-white/70">Количество баллов</label>
              <div className="bg-[#c4d402] text-[#1F1F1F] px-3 py-1 rounded-full text-sm font-medium">150</div>
            </div>

            {/* Ползунок */}
            <div className="relative pt-1">
              <Slider defaultValue={[150]} max={350} step={1} className="py-4" />

              {/* Анимация перетаскивания ползунка */}
              <div className="absolute -top-6 left-[42%] animate-bounce opacity-70">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7 10L12 15L17 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="flex justify-between text-xs text-[#1F1F1F]/70 dark:text-white/70">
              <span>0</span>
              <span>Доступно: 350 баллов</span>
            </div>

            <Input type="number" value="150" className="bg-[#F5F5F5] dark:bg-[#333333] border-none" max={350} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="border-[#1F1F1F]/20 dark:border-white/20">
            Отмена
          </Button>
          <Button className="bg-[#c4d402] hover:bg-[#C4CF2E] text-[#1F1F1F]">
            <Send className="h-4 w-4 mr-2" />
            Перевести
          </Button>
        </CardFooter>
      </Card>

      {/* Подсказка */}
      <div className="mt-6 bg-white dark:bg-[#2A2A2A] p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-[#1F1F1F] dark:text-white mb-2">Как это работает:</h3>
        <ol className="text-xs text-[#1F1F1F]/70 dark:text-white/70 space-y-2 list-decimal pl-4">
          <li>Перетащите ползунок, чтобы выбрать количество баллов для перевод��</li>
          <li>Или введите точное значение в поле ввода</li>
          <li>Нажмите кнопку "Перевести", чтобы отправить баллы получателю</li>
          <li>Получатель мгновенно получит баллы на свой счет</li>
        </ol>
      </div>
    </div>
  )
}
