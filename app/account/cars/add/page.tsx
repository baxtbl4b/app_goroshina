"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Car, Plus, Search, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const API_BASE_URL = "https://api.tirebase.ru/api"
const API_TOKEN = "xN6JxoibNEbSFt952_O5kf-VxL61lOX4k5KAS-iGlBU"

interface Brand {
  brand: string
  brand_slug: string
}

interface Model {
  model: string
  model_slug: string
}

interface Trim {
  trim: string
  trim_slug: string
}

interface TireSize {
  width: string
  height: string
  diameter: string
  is_optional?: boolean
}

export default function AddCarPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    carName: "",
    brand: "",
    brandSlug: "",
    model: "",
    modelSlug: "",
    trim: "",
    trimSlug: "",
    year: "",
    plate: "",
    mileage: "",
    tireSeason: "summer", // summer или winter
    tireWidth: "",
    tireProfile: "",
    tireDiameter: "",
    isPrimary: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isProcessingWithAI, setIsProcessingWithAI] = useState(false)
  const [isAIProcessed, setIsAIProcessed] = useState(false)

  // API data states
  const [brands, setBrands] = useState<Brand[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [trims, setTrims] = useState<Trim[]>([])
  const [tireSizes, setTireSizes] = useState<TireSize[]>([])
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [loadingModels, setLoadingModels] = useState(false)
  const [loadingTrims, setLoadingTrims] = useState(false)
  const [loadingTireSizes, setLoadingTireSizes] = useState(false)

  // Search states
  const [brandSearch, setBrandSearch] = useState("")
  const [modelSearch, setModelSearch] = useState("")
  const [trimSearch, setTrimSearch] = useState("")
  const [showBrandDropdown, setShowBrandDropdown] = useState(false)
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [showTrimDropdown, setShowTrimDropdown] = useState(false)

  const brandRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<HTMLDivElement>(null)
  const trimRef = useRef<HTMLDivElement>(null)

  // Load brands on mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/fitment/brands?access_token=${API_TOKEN}`)
        if (response.ok) {
          const data = await response.json()
          setBrands(data)
        }
      } catch (error) {
        console.error("Error fetching brands:", error)
      } finally {
        setLoadingBrands(false)
      }
    }
    fetchBrands()
  }, [])

  // Load models when brand changes
  useEffect(() => {
    if (!formData.brandSlug) {
      setModels([])
      setTrims([])
      return
    }

    const fetchModels = async () => {
      setLoadingModels(true)
      try {
        const response = await fetch(`${API_BASE_URL}/fitment/models?access_token=${API_TOKEN}&brand_slug=${formData.brandSlug}`)
        if (response.ok) {
          const data = await response.json()
          setModels(data)
        }
      } catch (error) {
        console.error("Error fetching models:", error)
      } finally {
        setLoadingModels(false)
      }
    }
    fetchModels()
  }, [formData.brandSlug])

  // Load trims when model changes
  useEffect(() => {
    if (!formData.brandSlug || !formData.modelSlug) {
      setTrims([])
      return
    }

    const fetchTrims = async () => {
      setLoadingTrims(true)
      try {
        const response = await fetch(`${API_BASE_URL}/fitment/trims?access_token=${API_TOKEN}&brand_slug=${formData.brandSlug}&model_slug=${formData.modelSlug}`)
        if (response.ok) {
          const data = await response.json()
          // Фильтруем "All trims" варианты
          const filtered = data.filter((t: Trim) => !t.trim.toLowerCase().startsWith("all trims"))
          setTrims(filtered)
        }
      } catch (error) {
        console.error("Error fetching trims:", error)
      } finally {
        setLoadingTrims(false)
      }
    }
    fetchTrims()
  }, [formData.brandSlug, formData.modelSlug])

  // Load tire sizes when brand, model, trim, and year are selected
  useEffect(() => {
    if (!formData.brandSlug || !formData.modelSlug || !formData.year) {
      setTireSizes([])
      return
    }

    const fetchTireSizes = async () => {
      setLoadingTireSizes(true)
      try {
        let url = `${API_BASE_URL}/fitment?access_token=${API_TOKEN}&brand_slug=${formData.brandSlug}&model_slug=${formData.modelSlug}&year=${formData.year}`

        // Добавляем trim_slug если выбрана модификация
        if (formData.trimSlug) {
          url += `&trim_slug=${formData.trimSlug}`
        }

        const response = await fetch(url)

        if (response.ok) {
          const data = await response.json()
          console.log("Tire sizes data:", data)

          let sizes: TireSize[] = []

          // API возвращает массив объектов fitment
          if (Array.isArray(data)) {
            // Собираем все уникальные размеры из всех модификаций
            const allTires = new Set<string>()

            data.forEach((fitment: any) => {
              if (fitment.oem_tires && Array.isArray(fitment.oem_tires)) {
                fitment.oem_tires.forEach((tire: any) => {
                  if (tire.width && tire.height && tire.diam) {
                    // Создаем уникальный ключ для размера
                    const key = `${tire.width}/${tire.height}/${tire.diam}`
                    allTires.add(key)
                  }
                })
              }
            })

            // Преобразуем Set обратно в массив объектов
            sizes = Array.from(allTires).map(key => {
              const [width, height, diameter] = key.split('/')
              return {
                width,
                height,
                diameter,
                is_optional: false
              }
            })
          }

          setTireSizes(sizes)
        }
      } catch (error) {
        console.error("Error fetching tire sizes:", error)
        setTireSizes([])
      } finally {
        setLoadingTireSizes(false)
      }
    }

    fetchTireSizes()
  }, [formData.brandSlug, formData.modelSlug, formData.trimSlug, formData.year])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (brandRef.current && !brandRef.current.contains(event.target as Node)) {
        setShowBrandDropdown(false)
      }
      if (modelRef.current && !modelRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false)
      }
      if (trimRef.current && !trimRef.current.contains(event.target as Node)) {
        setShowTrimDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filter brands by search
  const filteredBrands = brands.filter(b =>
    b.brand.toLowerCase().includes(brandSearch.toLowerCase())
  )

  // Filter models by search
  const filteredModels = models.filter(m =>
    m.model.toLowerCase().includes(modelSearch.toLowerCase())
  )

  // Filter trims by search
  const filteredTrims = trims.filter(t =>
    t.trim.toLowerCase().includes(trimSearch.toLowerCase())
  )

  const processWithGoroshinaAI = async () => {
    if (!formData.carName.trim()) {
      alert("Пожалуйста, введите наименование автомобиля")
      return
    }

    setIsProcessingWithAI(true)

    try {
      // Симуляция обработки ИИ
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Улучшенная логика парсинга наименования
      const carName = formData.carName.toLowerCase()
      console.log("Обрабатываем:", carName)

      let brand = ""
      let model = ""
      let year = ""

      // Более точное определение марки
      if (carName.includes("toyota") || carName.includes("тойота")) {
        brand = "toyota"
        if (carName.includes("camry") || carName.includes("камри")) model = "camry"
        else if (carName.includes("corolla") || carName.includes("корола")) model = "corolla"
        else if (carName.includes("rav4") || carName.includes("рав4")) model = "rav4"
        else if (carName.includes("highlander") || carName.includes("хайлендер")) model = "highlander"
      } else if (carName.includes("bmw") || carName.includes("бмв")) {
        brand = "bmw"
      } else if (carName.includes("mercedes") || carName.includes("мерседес")) {
        brand = "mercedes"
      } else if (carName.includes("audi") || carName.includes("ауди")) {
        brand = "audi"
      } else if (carName.includes("volkswagen") || carName.includes("фольксваген")) {
        brand = "volkswagen"
      }

      // Поиск года в строке (более широкий диапазон)
      const yearMatch = carName.match(/(19|20)\d{2}/)
      if (yearMatch) {
        const foundYear = yearMatch[0]
        // Проверяем, что год в допустимом диапазоне
        const yearNum = Number.parseInt(foundYear)
        if (yearNum >= 2014 && yearNum <= 2023) {
          year = foundYear
        }
      }

      console.log("Найдено:", { brand, model, year })

      // Обновляем данные
      setFormData((prev) => ({
        ...prev,
        brand: brand || prev.brand,
        model: model || prev.model,
        year: year || prev.year,
      }))

      setIsAIProcessed(true)

      // Показываем результат пользователю
      const results = []
      if (brand) results.push(`Марка: ${brand}`)
      if (model) results.push(`Модель: ${model}`)
      if (year) results.push(`Год: ${year}`)

      if (results.length > 0) {
        alert(`Умная помощница Горошина обработала информацию!\n\nНайдено:\n${results.join("\n")}`)
      } else {
        alert("Умная помощница Горошина не смогла распознать данные. Попробуйте ввести более подробную информацию.")
        setIsAIProcessed(false)
      }
    } catch (error) {
      console.error("Ошибка при обработке с ИИ:", error)
      alert("Произошла ошибка при обработке")
    } finally {
      setIsProcessingWithAI(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.brand || !formData.model || !formData.year || !formData.plate) {
      alert("Пожалуйста, заполните все обязательные поля")
      return
    }

    setIsSubmitting(true)

    try {
      // Получаем существующие автомобили из localStorage
      const existingCars = JSON.parse(localStorage.getItem("userCars") || "[]")

      // Создаем новый автомобиль
      const newCar = {
        id: Date.now().toString(),
        name: formData.carName || `${formData.brand} ${formData.model}${formData.trim ? ` ${formData.trim}` : ""}`,
        brand: formData.brand,
        brandSlug: formData.brandSlug,
        model: formData.model,
        modelSlug: formData.modelSlug,
        trim: formData.trim,
        trimSlug: formData.trimSlug,
        year: formData.year,
        plate: formData.plate,
        mileage: formData.mileage ? `${formData.mileage} км` : "0 км",
        tires: formData.tireWidth && formData.tireProfile && formData.tireDiameter
          ? `${formData.tireWidth}/${formData.tireProfile} R${formData.tireDiameter}`
          : "Не указано",
        tireSeason: formData.tireSeason === "winter" ? "Зима" : "Лето",
        tireWidth: formData.tireWidth,
        tireProfile: formData.tireProfile,
        tireDiameter: formData.tireDiameter,
        isPrimary: formData.isPrimary,
        hasStorage: false,
        createdAt: new Date().toISOString(),
      }

      // Если это основной автомобиль, убираем флаг у других
      if (formData.isPrimary) {
        existingCars.forEach((car: any) => {
          car.isPrimary = false
        })
      }

      // Добавляем новый автомобиль
      const updatedCars = [...existingCars, newCar]
      localStorage.setItem("userCars", JSON.stringify(updatedCars))

      // Возвращаемся на предыдущую страницу
      router.back()
    } catch (error) {
      console.error("Ошибка при добавлении автомобиля:", error)
      alert("Произошла ошибка при добавлении автомобиля")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#1F1F1F]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#2A2A2A] p-4 shadow-sm">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Добавление автомобиля</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Car className="h-6 w-6 text-[#009CFF]" />
            <h3 className="font-bold text-[#1F1F1F] dark:text-white">Информация об автомобиле</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="carName">Наименование автомобиля</Label>
              <div className="flex gap-2">
                <Input
                  id="carName"
                  placeholder="Например: Toyota Camry 2020"
                  className="flex-1"
                  value={formData.carName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, carName: e.target.value }))}
                />
                <Button
                  type="button"
                  onClick={processWithGoroshinaAI}
                  disabled={isProcessingWithAI || !formData.carName.trim() || isAIProcessed}
                  className={`px-3 ${isAIProcessed ? "bg-green-500 hover:bg-green-600" : "bg-[#009CFF] hover:bg-[#009CFF]/80"} text-white`}
                >
                  {isProcessingWithAI ? "🤖" : isAIProcessed ? "✅" : "🧠"}
                </Button>
              </div>
              <p className="text-xs text-gray-500">Умная помощница Горошина поможет заполнить поля автоматически</p>
            </div>

            <div className="space-y-2" ref={brandRef}>
              <Label htmlFor="brand">Марка *</Label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="brand"
                    placeholder={loadingBrands ? "Загрузка марок..." : "Поиск марки..."}
                    className="pl-9 w-full"
                    value={formData.brand || brandSearch}
                    onChange={(e) => {
                      setBrandSearch(e.target.value)
                      setFormData(prev => ({ ...prev, brand: "", brandSlug: "", model: "", modelSlug: "" }))
                      setShowBrandDropdown(true)
                    }}
                    onFocus={() => setShowBrandDropdown(true)}
                    disabled={isAIProcessed || loadingBrands}
                  />
                  {loadingBrands && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />}
                </div>
                {showBrandDropdown && filteredBrands.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-white dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    {filteredBrands.slice(0, 50).map((b) => (
                      <button
                        key={b.brand_slug}
                        type="button"
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-[#1F1F1F] dark:text-white"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, brand: b.brand, brandSlug: b.brand_slug, model: "", modelSlug: "" }))
                          setBrandSearch("")
                          setModelSearch("")
                          setShowBrandDropdown(false)
                        }}
                      >
                        {b.brand}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2" ref={modelRef}>
              <Label htmlFor="model">Модель *</Label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="model"
                    placeholder={!formData.brandSlug ? "Сначала выберите марку" : loadingModels ? "Загрузка моделей..." : "Поиск модели..."}
                    className="pl-9 w-full"
                    value={formData.model || modelSearch}
                    onChange={(e) => {
                      setModelSearch(e.target.value)
                      setFormData(prev => ({ ...prev, model: "", modelSlug: "" }))
                      setShowModelDropdown(true)
                    }}
                    onFocus={() => formData.brandSlug && setShowModelDropdown(true)}
                    disabled={isAIProcessed || !formData.brandSlug || loadingModels}
                  />
                  {loadingModels && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />}
                </div>
                {showModelDropdown && filteredModels.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-white dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    {filteredModels.slice(0, 50).map((m) => (
                      <button
                        key={m.model_slug}
                        type="button"
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-[#1F1F1F] dark:text-white"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, model: m.model, modelSlug: m.model_slug, trim: "", trimSlug: "" }))
                          setModelSearch("")
                          setTrimSearch("")
                          setShowModelDropdown(false)
                        }}
                      >
                        {m.model}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2" ref={trimRef}>
              <Label htmlFor="trim">Модификация</Label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="trim"
                    placeholder={!formData.modelSlug ? "Сначала выберите модель" : loadingTrims ? "Загрузка модификаций..." : "Поиск модификации..."}
                    className="pl-9 w-full"
                    value={formData.trim || trimSearch}
                    onChange={(e) => {
                      setTrimSearch(e.target.value)
                      setFormData(prev => ({ ...prev, trim: "", trimSlug: "" }))
                      setShowTrimDropdown(true)
                    }}
                    onFocus={() => formData.modelSlug && setShowTrimDropdown(true)}
                    disabled={isAIProcessed || !formData.modelSlug || loadingTrims}
                  />
                  {loadingTrims && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />}
                </div>
                {showTrimDropdown && filteredTrims.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-white dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    {filteredTrims.slice(0, 50).map((t) => (
                      <button
                        key={t.trim_slug}
                        type="button"
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-[#1F1F1F] dark:text-white"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, trim: t.trim, trimSlug: t.trim_slug }))
                          setTrimSearch("")
                          setShowTrimDropdown(false)
                        }}
                      >
                        {t.trim}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Год выпуска</Label>
              <Select
                value={formData.year}
                onValueChange={(value) => {
                  console.log("Выбран год:", value)
                  setFormData((prev) => ({ ...prev, year: value }))
                }}
                disabled={isAIProcessed}
              >
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

            {isAIProcessed && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAIProcessed(false)
                  setFormData((prev) => ({ ...prev, brand: "", model: "", year: "" }))
                }}
                className="mt-2"
              >
                Изменить данные
              </Button>
            )}

            <div className="space-y-2">
              <Label htmlFor="plate">Гос. номер</Label>
              <Input
                id="plate"
                placeholder="А123БВ777"
                className="w-full"
                value={formData.plate}
                onChange={(e) => setFormData((prev) => ({ ...prev, plate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Пробег (км)</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="45000"
                className="w-full"
                value={formData.mileage}
                onChange={(e) => setFormData((prev) => ({ ...prev, mileage: e.target.value }))}
              />
            </div>

            <div className="pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="primary"
                  checked={formData.isPrimary}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPrimary: checked }))}
                />
                <Label htmlFor="primary" className="text-sm font-normal">
                  Сделать основным автомобилем
                </Label>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Car className="h-6 w-6 text-[#009CFF]" />
            <h3 className="font-bold text-[#1F1F1F] dark:text-white">Информация о шинах и дисках</h3>
          </div>

          <form className="space-y-4">
            {/* Выбор сезона шин */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#1F1F1F] dark:text-white">Сезон шин</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tireSeason: "summer" }))}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.tireSeason === "summer"
                      ? 'border-[#D3DF3D] bg-[#D3DF3D]/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-[#D3DF3D]/50'
                  }`}
                >
                  <span className="font-semibold text-[#1F1F1F] dark:text-white">Лето</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tireSeason: "winter" }))}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.tireSeason === "winter"
                      ? 'border-[#009CFF] bg-[#009CFF]/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-[#009CFF]/50'
                  }`}
                >
                  <span className="font-semibold text-[#1F1F1F] dark:text-white">Зима</span>
                </button>
              </div>
            </div>

            {/* Рекомендуемые размеры шин */}
            {(loadingTireSizes || tireSizes.length > 0) && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#1F1F1F] dark:text-white">
                  Рекомендуемые размеры шин
                </Label>
                {loadingTireSizes ? (
                  <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-[#1F1F1F] rounded-lg">
                    <Loader2 className="h-5 w-5 animate-spin text-[#009CFF] mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Загрузка подходящих размеров...</span>
                  </div>
                ) : tireSizes.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {tireSizes.map((size, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            tireWidth: size.width,
                            tireProfile: size.height,
                            tireDiameter: size.diameter,
                          }))
                        }}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          formData.tireWidth === size.width &&
                          formData.tireProfile === size.height &&
                          formData.tireDiameter === size.diameter
                            ? 'border-[#D3DF3D] bg-[#D3DF3D]/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-[#009CFF] hover:bg-[#009CFF]/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#1F1F1F] dark:text-white">
                            {size.width}/{size.height} R{size.diameter}
                          </span>
                          {size.is_optional && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">опц.</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {size.is_optional ? 'Опциональный' : 'Базовый'}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {tireSizes.length > 0 ? 'Нажмите на размер для быстрого выбора' : 'Заполните данные об автомобиле для получения рекомендаций'}
                </p>
              </div>
            )}

            {tireSizes.length > 0 && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-[#2A2A2A] px-2 text-gray-500 dark:text-gray-400">
                    или выберите вручную
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="tire-width">Ширина</Label>
                <Input
                  id="tire-width"
                  type="number"
                  placeholder="185"
                  className="w-full"
                  value={formData.tireWidth}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tireWidth: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tire-profile">Профиль</Label>
                <Input
                  id="tire-profile"
                  type="number"
                  placeholder="65"
                  className="w-full"
                  value={formData.tireProfile}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tireProfile: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tire-diameter">Диаметр</Label>
                <Input
                  id="tire-diameter"
                  type="number"
                  placeholder="15"
                  className="w-full"
                  value={formData.tireDiameter}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tireDiameter: e.target.value }))}
                />
              </div>
            </div>

          </form>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-6 rounded-xl bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F] dark:text-[#1F1F1F] font-semibold text-base disabled:opacity-50"
        >
          <Plus className="mr-2 h-5 w-5" />
          {isSubmitting ? "Добавление..." : "Добавить автомобиль"}
        </Button>
      </div>
    </main>
  )
}
