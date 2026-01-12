"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function SurveyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({
    satisfaction: "",
    frequency: "",
    factors: [] as string[],
    improvements: "",
    recommendation: "",
    comments: "",
  })

  const totalSteps = 6
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    } else {
      // Submit survey and navigate to completion page
      router.push("/survey/complete")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    } else {
      router.back()
    }
  }

  const handleRadioChange = (field: string, value: string) => {
    setAnswers({
      ...answers,
      [field]: value,
    })
  }

  const handleCheckboxChange = (value: string) => {
    const currentFactors = [...answers.factors]
    const index = currentFactors.indexOf(value)

    if (index === -1) {
      currentFactors.push(value)
    } else {
      currentFactors.splice(index, 1)
    }

    setAnswers({
      ...answers,
      factors: currentFactors,
    })
  }

  const handleTextChange = (field: string, value: string) => {
    setAnswers({
      ...answers,
      [field]: value,
    })
  }

  const isNextDisabled = () => {
    switch (currentStep) {
      case 0:
        return !answers.satisfaction
      case 1:
        return !answers.frequency
      case 2:
        return answers.factors.length === 0
      case 3:
        return !answers.improvements
      case 4:
        return !answers.recommendation
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-[#D9D9DD] dark:bg-[#121212] pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-[#262626] p-4 sticky top-0 z-10 shadow-sm">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={handlePrevious}>
              <ArrowLeft className="h-5 w-5 text-gray-900 dark:text-white" />
            </Button>
            <h1 className="text-lg font-medium text-gray-900 dark:text-white">Опрос</h1>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-[#262626] px-4 py-2">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-[#009CFF] h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
          {currentStep + 1} из {totalSteps}
        </div>
      </div>

      {/* Survey Content */}
      <div className="p-4">
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 mb-4">
          {currentStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-[#1F1F1F] dark:text-white">
                Насколько вы довольны нашим сервисом?
              </h2>
              <RadioGroup
                value={answers.satisfaction}
                onValueChange={(value) => handleRadioChange("satisfaction", value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id="satisfaction-5" />
                  <Label htmlFor="satisfaction-5">Очень доволен</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id="satisfaction-4" />
                  <Label htmlFor="satisfaction-4">Доволен</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="satisfaction-3" />
                  <Label htmlFor="satisfaction-3">Нейтрально</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="satisfaction-2" />
                  <Label htmlFor="satisfaction-2">Не доволен</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="satisfaction-1" />
                  <Label htmlFor="satisfaction-1">Очень не доволен</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-[#1F1F1F] dark:text-white">
                Как часто вы пользуетесь нашими услугами?
              </h2>
              <RadioGroup
                value={answers.frequency}
                onValueChange={(value) => handleRadioChange("frequency", value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="frequency-weekly" />
                  <Label htmlFor="frequency-weekly">Еженедельно</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="frequency-monthly" />
                  <Label htmlFor="frequency-monthly">Ежемесячно</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quarterly" id="frequency-quarterly" />
                  <Label htmlFor="frequency-quarterly">Раз в квартал</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="biannually" id="frequency-biannually" />
                  <Label htmlFor="frequency-biannually">Раз в полгода</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="annually" id="frequency-annually" />
                  <Label htmlFor="frequency-annually">Раз в год</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rarely" id="frequency-rarely" />
                  <Label htmlFor="frequency-rarely">Реже, чем раз в год</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-[#1F1F1F] dark:text-white">
                Что для вас наиболее важно при выборе шин? (выберите до 3-х вариантов)
              </h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="factors-price"
                    checked={answers.factors.includes("price")}
                    onCheckedChange={() => handleCheckboxChange("price")}
                  />
                  <Label htmlFor="factors-price">Цена</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="factors-quality"
                    checked={answers.factors.includes("quality")}
                    onCheckedChange={() => handleCheckboxChange("quality")}
                  />
                  <Label htmlFor="factors-quality">Качество</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="factors-brand"
                    checked={answers.factors.includes("brand")}
                    onCheckedChange={() => handleCheckboxChange("brand")}
                  />
                  <Label htmlFor="factors-brand">Бренд</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="factors-durability"
                    checked={answers.factors.includes("durability")}
                    onCheckedChange={() => handleCheckboxChange("durability")}
                  />
                  <Label htmlFor="factors-durability">Долговечность</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="factors-fuel"
                    checked={answers.factors.includes("fuel")}
                    onCheckedChange={() => handleCheckboxChange("fuel")}
                  />
                  <Label htmlFor="factors-fuel">Экономия топлива</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="factors-noise"
                    checked={answers.factors.includes("noise")}
                    onCheckedChange={() => handleCheckboxChange("noise")}
                  />
                  <Label htmlFor="factors-noise">Низкий уровень шума</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="factors-grip"
                    checked={answers.factors.includes("grip")}
                    onCheckedChange={() => handleCheckboxChange("grip")}
                  />
                  <Label htmlFor="factors-grip">Сцепление с дорогой</Label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-[#1F1F1F] dark:text-white">
                Что бы вы хотели улучшить в нашем сервисе?
              </h2>
              <Textarea
                placeholder="Поделитесь вашими идеями..."
                value={answers.improvements}
                onChange={(e) => handleTextChange("improvements", e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-[#1F1F1F] dark:text-white">
                Насколько вероятно, что вы порекомендуете наш сервис друзьям?
              </h2>
              <RadioGroup
                value={answers.recommendation}
                onValueChange={(value) => handleRadioChange("recommendation", value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10" id="recommendation-10" />
                  <Label htmlFor="recommendation-10">10 - Обязательно порекомендую</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="9" id="recommendation-9" />
                  <Label htmlFor="recommendation-9">9</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="8" id="recommendation-8" />
                  <Label htmlFor="recommendation-8">8</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="7" id="recommendation-7" />
                  <Label htmlFor="recommendation-7">7</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6" id="recommendation-6" />
                  <Label htmlFor="recommendation-6">6</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id="recommendation-5" />
                  <Label htmlFor="recommendation-5">5</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id="recommendation-4" />
                  <Label htmlFor="recommendation-4">4</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="recommendation-3" />
                  <Label htmlFor="recommendation-3">3</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="recommendation-2" />
                  <Label htmlFor="recommendation-2">2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="recommendation-1" />
                  <Label htmlFor="recommendation-1">1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="recommendation-0" />
                  <Label htmlFor="recommendation-0">0 - Точно не порекомендую</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-[#1F1F1F] dark:text-white">
                Дополнительные комментарии или пожелания
              </h2>
              <Textarea
                placeholder="Ваши комментарии..."
                value={answers.comments}
                onChange={(e) => handleTextChange("comments", e.target.value)}
                className="min-h-[120px]"
              />
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Спасибо за участие в опросе! После завершения вы получите +100 баллов на ваш счет.
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} className="border-[#009CFF] text-[#009CFF] bg-transparent">
            Назад
          </Button>
          <Button onClick={handleNext} disabled={isNextDisabled()} className="bg-[#009CFF] hover:bg-[#0084D8]">
            {currentStep === totalSteps - 1 ? "Завершить" : "Далее"}
            {currentStep !== totalSteps - 1 && <ChevronRight className="ml-1 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
