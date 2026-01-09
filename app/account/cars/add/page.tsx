"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Car, Plus, Search, Loader2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

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

interface TireSize {
  width: string
  height: string
  diameter: string
  is_optional?: boolean
  position?: "front" | "rear" | "both"
}

interface StaggeredTireSize {
  front: {
    width: string
    height: string
    diameter: string
  }
  rear: {
    width: string
    height: string
    diameter: string
  }
  is_optional?: boolean
}

interface WheelSpec {
  diameter: string
  width: string
  et: string
}

export default function AddCarPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    brand: "",
    brandSlug: "",
    model: "",
    modelSlug: "",
    year: "",
    plate: "",
    mileage: "",
    tireSeason: "summer", // summer или winter
    // Летние шины
    summerTireWidth: "",
    summerTireProfile: "",
    summerTireDiameter: "",
    summerRearTireWidth: "",
    summerRearTireProfile: "",
    summerRearTireDiameter: "",
    summerIsStaggered: false,
    // Зимние шины
    winterTireWidth: "",
    winterTireProfile: "",
    winterTireDiameter: "",
    winterRearTireWidth: "",
    winterRearTireProfile: "",
    winterRearTireDiameter: "",
    winterIsStaggered: false,
    isPrimary: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // API data states
  const [brands, setBrands] = useState<Brand[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [years, setYears] = useState<number[]>([])
  const [tireSizes, setTireSizes] = useState<TireSize[]>([])
  const [staggeredTireSizes, setStaggeredTireSizes] = useState<StaggeredTireSize[]>([])
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [loadingModels, setLoadingModels] = useState(false)
  const [loadingYears, setLoadingYears] = useState(false)
  const [loadingTireSizes, setLoadingTireSizes] = useState(false)

  // Wheel specifications from API
  const [wheelSpecs, setWheelSpecs] = useState<WheelSpec[]>([])
  const [boltPattern, setBoltPattern] = useState<string>("")
  const [centerBore, setCenterBore] = useState<string>("")
  const [selectedWheelSpec, setSelectedWheelSpec] = useState<number>(0) // Index of selected wheel spec
  const [missingWheelData, setMissingWheelData] = useState(false) // Warning flag for missing wheel width/ET data

  // Search states
  const [carSearchInput, setCarSearchInput] = useState("")
  const [showCarSelector, setShowCarSelector] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<{ brands: any[]; models: any[] }>({ brands: [], models: [] })
  const [carSelectorStep, setCarSelectorStep] = useState<"brand" | "model" | "year">("brand")

  // Auto-select wheel diameter based on selected tire size
  useEffect(() => {
    if (wheelSpecs.length === 0) return

    // Get the diameter from the selected tire size
    const currentSeason = formData.tireSeason
    let tireDiameter = ""

    if (currentSeason === "summer") {
      tireDiameter = formData.summerTireDiameter
    } else {
      tireDiameter = formData.winterTireDiameter
    }

    // If tire diameter is selected, find matching wheel spec
    if (tireDiameter) {
      const matchingIndex = wheelSpecs.findIndex(spec => spec.diameter === tireDiameter)
      if (matchingIndex !== -1 && matchingIndex !== selectedWheelSpec) {
        setSelectedWheelSpec(matchingIndex)
        console.log(`🔄 Auto-selected wheel diameter R${tireDiameter} to match tire size`)
      }
    }
  }, [formData.summerTireDiameter, formData.winterTireDiameter, formData.tireSeason, wheelSpecs])

  // Search for cars with debounce
  useEffect(() => {
    if (carSelectorStep !== "brand") return
    if (!carSearchInput || carSearchInput.length < 2) {
      setSearchResults({ brands: [], models: [] })
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/fitment/search?q=${encodeURIComponent(carSearchInput)}`)
        if (response.ok) {
          const data = await response.json()
          setSearchResults(data)
        }
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [carSearchInput, carSelectorStep])

  // Handle brand selection
  const handleCarBrandSelect = async (brand: any) => {
    setFormData(prev => ({
      ...prev,
      brand: brand.name,
      brandSlug: brand.slug,
      model: "",
      modelSlug: "",
      year: ""
    }))
    setCarSearchInput(brand.name)
    setCarSelectorStep("model")
    setLoadingModels(true)

    try {
      const response = await fetch(`/api/fitment/models?brand_slug=${brand.slug}`)
      if (response.ok) {
        const data = await response.json()
        setModels(data.models || [])
      }
    } catch (error) {
      console.error("Failed to load car models:", error)
    } finally {
      setLoadingModels(false)
    }
  }

  // Handle model selection from search results
  const handleModelSelect = async (model: any) => {
    setFormData(prev => ({
      ...prev,
      brand: model.brand || model.brandName,
      brandSlug: model.brandSlug,
      model: model.name,
      modelSlug: model.slug,
      year: ""
    }))
    setCarSearchInput(`${model.brand || model.brandName} ${model.name}`)
    setCarSelectorStep("year")
    setLoadingYears(true)

    try {
      const response = await fetch(`https://api.tirebase.ru/api/fitment?access_token=${API_TOKEN}&brand_slug=${model.brandSlug}&model_slug=${model.slug}`)
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          const yearsSet = new Set<number>()
          data.forEach((item: any) => {
            if (item.year) yearsSet.add(item.year)
          })
          const yearsList = Array.from(yearsSet).sort((a, b) => b - a)
          console.log(`📅 Loaded ${yearsList.length} years for ${model.brand || model.brandName} ${model.name}:`, yearsList)
          setYears(yearsList)
        } else {
          console.warn("No fitment data found for this model")
          setYears([])
        }
      }
    } catch (error) {
      console.error("Failed to load years:", error)
      setYears([])
    } finally {
      setLoadingYears(false)
    }
  }

  // Handle model selection from models list (after brand selected)
  const handleModelFromListSelect = async (model: any) => {
    setFormData(prev => ({
      ...prev,
      model: model.name,
      modelSlug: model.slug,
      year: ""
    }))
    setCarSearchInput(`${formData.brand} ${model.name}`)
    setCarSelectorStep("year")
    setLoadingYears(true)

    try {
      const response = await fetch(`https://api.tirebase.ru/api/fitment?access_token=${API_TOKEN}&brand_slug=${formData.brandSlug}&model_slug=${model.slug}`)
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          const yearsSet = new Set<number>()
          data.forEach((item: any) => {
            if (item.year) yearsSet.add(item.year)
          })
          const yearsList = Array.from(yearsSet).sort((a, b) => b - a)
          console.log(`📅 Loaded ${yearsList.length} years for ${formData.brand} ${model.name}:`, yearsList)
          setYears(yearsList)
        } else {
          console.warn("No fitment data found for this model")
          setYears([])
        }
      }
    } catch (error) {
      console.error("Failed to load years:", error)
      setYears([])
    } finally {
      setLoadingYears(false)
    }
  }

  // Handle year selection
  const handleYearSelect = (year: number) => {
    setFormData(prev => ({
      ...prev,
      year: String(year)
    }))
    setCarSearchInput(`${formData.brand} ${formData.model} ${year}`)
    setShowCarSelector(false)
  }

  // Clear car selection
  const clearCarSelection = () => {
    setFormData(prev => ({
      ...prev,
      brand: "",
      brandSlug: "",
      model: "",
      modelSlug: "",
      year: ""
    }))
    setCarSearchInput("")
    setCarSelectorStep("brand")
    setShowCarSelector(false)
    setSearchResults({ brands: [], models: [] })
    setYears([])
    setTireSizes([])
    setStaggeredTireSizes([])
    setWheelSpecs([])
    setBoltPattern("")
    setCenterBore("")
    setMissingWheelData(false)
  }

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

  // Note: Models and years are now loaded in handleCarBrandSelect, handleModelSelect, and handleModelFromListSelect
  // Old useEffect hooks removed to prevent conflicts with unified search

  // Load tire sizes when brand, model, and year are selected (ignore trim)
  useEffect(() => {
    console.log("🔍 Tire sizes effect triggered:", {
      brandSlug: formData.brandSlug,
      modelSlug: formData.modelSlug,
      year: formData.year
    })

    if (!formData.brandSlug || !formData.modelSlug || !formData.year) {
      console.log("⚠️ Missing required data for tire sizes")
      setTireSizes([])
      setWheelSpecs([])
      setBoltPattern("")
      setCenterBore("")
      return
    }

    console.log("✅ All data present, starting fetch...")

    const fetchTireSizes = async () => {
      setLoadingTireSizes(true)
      try {
        // Игнорируем модификацию, загружаем размеры для всех модификаций модели
        let url = `${API_BASE_URL}/fitment?access_token=${API_TOKEN}&brand_slug=${formData.brandSlug}&model_slug=${formData.modelSlug}&year=${formData.year}`

        console.log("📡 Fetching tire sizes from:", url)
        const response = await fetch(url)
        console.log("📥 Response status:", response.status)

        if (response.ok) {
          const data = await response.json()
          console.log("✅ Tire sizes data:", data)
          console.log("✅ Data length:", data.length)
          console.log("✅ Is array:", Array.isArray(data))

          // ПОЛНЫЙ ОТВЕТ API ДЛЯ АНАЛИЗА
          console.log("=" .repeat(80))
          console.log("📋 ПОЛНЫЙ ОТВЕТ API (первые 3 элемента):")
          console.log("=" .repeat(80))
          data.slice(0, 3).forEach((item: any, idx: number) => {
            console.log(`\n🚗 Fitment #${idx + 1}:`)
            console.log(JSON.stringify(item, null, 2))
          })
          console.log("=" .repeat(80))

          let sizes: TireSize[] = []

          // Parse wheel specifications from first fitment item
          if (Array.isArray(data) && data.length > 0) {
            const firstFitment = data[0]
            console.log("🚗 First fitment data:", firstFitment)

            // Extract PCD (bolt pattern) and center bore (hub)
            if (firstFitment.bolt_pattern) {
              setBoltPattern(firstFitment.bolt_pattern)
              console.log("✅ Bolt pattern (PCD):", firstFitment.bolt_pattern)
            }
            if (firstFitment.center_bore) {
              setCenterBore(String(firstFitment.center_bore))
              console.log("✅ Center bore (DIA):", firstFitment.center_bore)
            }

            // Extract wheel specifications from oem_rims AND all tire diameters
            // First, collect all tire diameters from ALL fitments
            const allTireDiameters = new Set<string>()
            data.forEach((fitment: any) => {
              if (fitment.oem_tires && Array.isArray(fitment.oem_tires)) {
                fitment.oem_tires.forEach((tire: any) => {
                  if (tire.diam) allTireDiameters.add(String(tire.diam))
                })
              }
              if (fitment.plus_sizes_tires && Array.isArray(fitment.plus_sizes_tires)) {
                fitment.plus_sizes_tires.forEach((plusSize: any) => {
                  if (plusSize.front && plusSize.front.diam) allTireDiameters.add(String(plusSize.front.diam))
                  if (plusSize.back && plusSize.back.diam) allTireDiameters.add(String(plusSize.back.diam))
                })
              }
            })
            console.log("🔍 All tire diameters found:", Array.from(allTireDiameters).sort())

            // Create a map of rim specs from oem_rims
            const rimSpecsMap = new Map<string, WheelSpec>()
            if (firstFitment.oem_rims && Array.isArray(firstFitment.oem_rims)) {
              firstFitment.oem_rims.forEach((rim: any) => {
                if (rim.diam) {
                  rimSpecsMap.set(String(rim.diam), {
                    diameter: String(rim.diam),
                    width: String(rim.width || ""),
                    et: String(rim.et || "")
                  })
                }
              })
            }

            // Create wheel specs for ALL tire diameters
            const rims: WheelSpec[] = Array.from(allTireDiameters)
              .sort((a, b) => Number(a) - Number(b))
              .map(diam => {
                // Use rim specs from API if available, otherwise just diameter
                if (rimSpecsMap.has(diam)) {
                  return rimSpecsMap.get(diam)!
                } else {
                  return {
                    diameter: diam,
                    width: "",
                    et: ""
                  }
                }
              })

            setWheelSpecs(rims)
            setSelectedWheelSpec(0)
            console.log("✅ Final wheel specs (matched with tire diameters):", rims)

            // Check if any wheel specs are missing width or ET data
            const hasMissingData = rims.some(rim => !rim.width || !rim.et)
            if (hasMissingData) {
              console.warn("⚠️ Some wheel specifications are incomplete (missing width or ET)")
              setMissingWheelData(true)
            } else {
              setMissingWheelData(false)
            }
          }

          // API возвращает массив объектов fitment
          if (Array.isArray(data)) {
            console.log(`✅ Processing ${data.length} fitment items`)
            if (data.length === 0) {
              console.warn("⚠️ API returned empty array - no tire data for this vehicle")
            }
            // Собираем базовые размеры и пары разноширокий
            const bothTires = new Set<string>()
            const staggeredPairs = new Map<string, StaggeredTireSize>()

            data.forEach((fitment: any, idx: number) => {
              console.log(`📦 Fitment #${idx + 1}:`, fitment)
              console.log(`  - Trim: ${fitment.trim_original || 'N/A'}`)
              console.log(`  - Has oem_tires:`, fitment.oem_tires)
              console.log(`  - Has plus_sizes_tires:`, fitment.plus_sizes_tires)

              // Обрабатываем базовые размеры (одинаковые на все колеса)
              if (fitment.oem_tires && Array.isArray(fitment.oem_tires)) {
                fitment.oem_tires.forEach((tire: any) => {
                  if (tire.width && tire.height && tire.diam) {
                    const key = `${tire.width}/${tire.height}/${tire.diam}`
                    bothTires.add(key)
                  }
                })
              }

              // Обрабатываем разноширокие размеры из plus_sizes_tires как пары
              if (fitment.plus_sizes_tires && Array.isArray(fitment.plus_sizes_tires)) {
                fitment.plus_sizes_tires.forEach((plusSize: any) => {
                  if (plusSize.front && plusSize.front.width && plusSize.front.height && plusSize.front.diam &&
                      plusSize.back && plusSize.back.width && plusSize.back.height && plusSize.back.diam) {
                    // Создаем уникальный ключ для пары
                    const pairKey = `${plusSize.front.width}/${plusSize.front.height}/${plusSize.front.diam}|${plusSize.back.width}/${plusSize.back.height}/${plusSize.back.diam}`

                    if (!staggeredPairs.has(pairKey)) {
                      staggeredPairs.set(pairKey, {
                        front: {
                          width: String(plusSize.front.width),
                          height: String(plusSize.front.height),
                          diameter: String(plusSize.front.diam)
                        },
                        rear: {
                          width: String(plusSize.back.width),
                          height: String(plusSize.back.height),
                          diameter: String(plusSize.back.diam)
                        },
                        is_optional: true
                      })
                    }
                  }
                })
              }
            })

            // Преобразуем базовые размеры в массив
            const bothSizes = Array.from(bothTires).map(key => {
              const [width, height, diameter] = key.split('/')
              return { width, height, diameter, is_optional: false, position: "both" as const }
            })

            // Получаем массив пар разноширокий
            const staggeredSizes = Array.from(staggeredPairs.values())

            sizes = bothSizes

            console.log("🎯 Base tire sizes (both):", bothSizes)
            console.log("🎯 Staggered tire pairs:", staggeredSizes)

            setTireSizes(sizes)
            setStaggeredTireSizes(staggeredSizes)
          } else {
            console.log("🎯 All extracted tire sizes:", sizes)
            setTireSizes(sizes)
            setStaggeredTireSizes([])
          }
        } else {
          console.error("❌ Response not OK:", response.status, response.statusText)
        }
      } catch (error) {
        console.error("❌ Error fetching tire sizes:", error)
        setTireSizes([])
      } finally {
        setLoadingTireSizes(false)
        console.log("✔️ Loading finished")
      }
    }

    fetchTireSizes()
  }, [formData.brandSlug, formData.modelSlug, formData.year])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.brand || !formData.model || !formData.year) {
      alert("Пожалуйста, заполните все обязательные поля")
      return
    }

    setIsSubmitting(true)

    try {
      // Получаем существующие автомобили из localStorage
      const existingCars = JSON.parse(localStorage.getItem("userCars") || "[]")

      // Формируем строки с размерами шин для обоих сезонов
      let summerTiresString = "Не указано"
      let winterTiresString = "Не указано"

      const hasSummerFrontTires = formData.summerTireWidth && formData.summerTireProfile && formData.summerTireDiameter
      const hasSummerRearTires = formData.summerRearTireWidth && formData.summerRearTireProfile && formData.summerRearTireDiameter

      const hasWinterFrontTires = formData.winterTireWidth && formData.winterTireProfile && formData.winterTireDiameter
      const hasWinterRearTires = formData.winterRearTireWidth && formData.winterRearTireProfile && formData.winterRearTireDiameter

      // Летние шины
      if (hasSummerFrontTires && hasSummerRearTires) {
        summerTiresString = `П: ${formData.summerTireWidth}/${formData.summerTireProfile} R${formData.summerTireDiameter} / З: ${formData.summerRearTireWidth}/${formData.summerRearTireProfile} R${formData.summerRearTireDiameter}`
      } else if (hasSummerFrontTires) {
        summerTiresString = `${formData.summerTireWidth}/${formData.summerTireProfile} R${formData.summerTireDiameter}`
      }

      // Зимние шины
      if (hasWinterFrontTires && hasWinterRearTires) {
        winterTiresString = `П: ${formData.winterTireWidth}/${formData.winterTireProfile} R${formData.winterTireDiameter} / З: ${formData.winterRearTireWidth}/${formData.winterRearTireProfile} R${formData.winterRearTireDiameter}`
      } else if (hasWinterFrontTires) {
        winterTiresString = `${formData.winterTireWidth}/${formData.winterTireProfile} R${formData.winterTireDiameter}`
      }

      // Создаем новый автомобиль
      // Используем параметры дисков из API (выбранный пользователем вариант)
      const wheelDiameter = wheelSpecs.length > 0 ? wheelSpecs[selectedWheelSpec].diameter : ""
      const wheelWidth = wheelSpecs.length > 0 ? wheelSpecs[selectedWheelSpec].width : ""
      const wheelEt = wheelSpecs.length > 0 ? wheelSpecs[selectedWheelSpec].et : ""

      console.log("💾 Сохраняемые параметры дисков:", {
        wheelDiameter,
        wheelWidth,
        wheelPcd: boltPattern,
        wheelEt,
        wheelHub: centerBore,
        selectedWheelSpec,
        totalSpecs: wheelSpecs.length
      })

      const newCar = {
        id: Date.now().toString(),
        name: `${formData.brand} ${formData.model}`,
        brand: formData.brand,
        brandSlug: formData.brandSlug,
        model: formData.model,
        modelSlug: formData.modelSlug,
        year: formData.year,
        plate: formData.plate,
        mileage: formData.mileage ? `${formData.mileage} км` : "0 км",
        // Летние шины
        summerTires: summerTiresString,
        summerTireWidth: formData.summerTireWidth,
        summerTireProfile: formData.summerTireProfile,
        summerTireDiameter: formData.summerTireDiameter,
        summerRearTireWidth: formData.summerRearTireWidth || "",
        summerRearTireProfile: formData.summerRearTireProfile || "",
        summerRearTireDiameter: formData.summerRearTireDiameter || "",
        summerHasStaggered: hasSummerRearTires,
        // Зимние шины
        winterTires: winterTiresString,
        winterTireWidth: formData.winterTireWidth,
        winterTireProfile: formData.winterTireProfile,
        winterTireDiameter: formData.winterTireDiameter,
        winterRearTireWidth: formData.winterRearTireWidth || "",
        winterRearTireProfile: formData.winterRearTireProfile || "",
        winterRearTireDiameter: formData.winterRearTireDiameter || "",
        winterHasStaggered: hasWinterRearTires,
        // Размеры колес (дисков) - автоматически из API
        wheelDiameter: wheelDiameter,
        wheelWidth: wheelWidth,
        wheelPcd: boltPattern || "",
        wheelEt: wheelEt,
        wheelHub: centerBore || "",
        // Общие поля
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

      // Отправляем событие об обновлении списка машин
      window.dispatchEvent(new CustomEvent("userCarsUpdated"))

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
    <main className="flex flex-col min-h-screen bg-[#121212]">
      <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-2 flex items-center">
          <BackButton />
          <span className="text-xl font-bold text-white">Добавление автомобиля</span>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Car className="h-6 w-6 text-[#009CFF]" />
            <h3 className="font-bold text-[#1F1F1F] dark:text-white">Информация об автомобиле</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Unified car search input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#1F1F1F] dark:text-white">Автомобиль *</Label>
              <div className="relative">
                <input
                  type="text"
                  value={carSearchInput}
                  onChange={(e) => {
                    const value = e.target.value
                    setCarSearchInput(value)

                    // If user starts typing after selecting brand/model, reset
                    if (carSelectorStep !== "brand" && value !== formData.brand && value !== `${formData.brand} ${formData.model}` && value !== `${formData.brand} ${formData.model} ${formData.year}`) {
                      clearCarSelection()
                      setCarSearchInput(value)
                    }

                    if (value.trim() && value.length >= 2) {
                      setShowCarSelector(true)
                    } else {
                      setShowCarSelector(false)
                    }
                  }}
                  onFocus={() => {
                    if (carSearchInput.length >= 2 || carSelectorStep !== "brand") {
                      setShowCarSelector(true)
                    }
                  }}
                  placeholder="Введите марку или модель"
                  className="w-full h-12 px-4 pr-10 text-sm border-0 rounded-xl text-white dark:text-white focus:ring-2 focus:ring-[#c4d402] focus:outline-none"
                  style={{ fontSize: '16px', backgroundColor: '#1F1F1F' }}
                />
                {carSearchInput && (
                  <button
                    type="button"
                    onClick={clearCarSelection}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Search results dropdown */}
              {showCarSelector && (carSearchInput.length >= 2 || carSelectorStep !== "brand") && (
                <div className="absolute z-50 left-4 right-4 mt-1 bg-white dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-80 overflow-y-auto">
                  <div className="p-2">
                    {/* Step 1: Brand search */}
                    {carSelectorStep === "brand" && (
                      <>
                        {isSearching && (
                          <div className="p-4 text-center text-gray-500 text-sm">
                            Поиск...
                          </div>
                        )}
                        {!isSearching && carSearchInput.length >= 2 && (
                          <>
                            {searchResults.brands?.length > 0 && (
                              <div className="mb-2">
                                <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 font-semibold">
                                  МАРКИ
                                </div>
                                {searchResults.brands.map((brand: any) => (
                                  <div
                                    key={`brand-${brand.slug}`}
                                    className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                                    onClick={() => handleCarBrandSelect(brand)}
                                  >
                                    <span className="text-sm text-[#1F1F1F] dark:text-white font-medium">{brand.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {searchResults.models?.length > 0 && (
                              <div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 font-semibold">
                                  МОДЕЛИ
                                </div>
                                {searchResults.models.map((model: any) => (
                                  <div
                                    key={`model-${model.slug}`}
                                    className="flex flex-col p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                                    onClick={() => handleModelSelect(model)}
                                  >
                                    <span className="text-sm text-[#1F1F1F] dark:text-white font-medium">{model.name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{model.brand || model.brandName}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {searchResults.brands?.length === 0 && searchResults.models?.length === 0 && (
                              <div className="p-4 text-center text-gray-500 text-sm">
                                Ничего не найдено
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {/* Step 2: Model selection */}
                    {carSelectorStep === "model" && (
                      <>
                        {loadingModels ? (
                          <div className="p-4 text-center text-gray-500 text-sm">
                            Загрузка моделей...
                          </div>
                        ) : (
                          <>
                            {models.length > 0 && (
                              <>
                                <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 font-semibold">
                                  МОДЕЛИ {formData.brand.toUpperCase()}
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                  {models.map((model: any) => (
                                    <div
                                      key={model.model_slug}
                                      className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                                      onClick={() => handleModelFromListSelect(model)}
                                    >
                                      <span className="text-sm text-[#1F1F1F] dark:text-white">{model.model}</span>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {/* Step 3: Year selection */}
                    {carSelectorStep === "year" && (
                      <>
                        {loadingYears ? (
                          <div className="p-4 text-center text-gray-500 text-sm">
                            Загрузка годов...
                          </div>
                        ) : (
                          <>
                            {years.length > 0 && (
                              <>
                                <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 font-semibold">
                                  ГОДЫ ВЫПУСКА
                                </div>
                                <div className="grid grid-cols-4 gap-2 p-2">
                                  {years.map((year) => (
                                    <div
                                      key={year}
                                      className="flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all bg-gray-100 dark:bg-[#1F1F1F] hover:bg-[#c4d402] hover:text-[#1F1F1F] text-[#1F1F1F] dark:text-white font-medium"
                                      onClick={() => handleYearSelect(year)}
                                    >
                                      <span className="text-sm">{year}</span>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="plate">Гос. номер</Label>
              <Input
                id="plate"
                placeholder="А123БВ777"
                className="w-full placeholder:opacity-50"
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
                className="w-full placeholder:opacity-50"
                value={formData.mileage}
                onChange={(e) => setFormData((prev) => ({ ...prev, mileage: e.target.value }))}
              />
            </div>

            <div className="pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="primary"
                  checked={formData.isPrimary}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPrimary: checked === true }))}
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
            <h3 className="font-bold text-[#1F1F1F] dark:text-white">Информация о шинах</h3>
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
                      ? 'border-[#c4d402] bg-[#c4d402]/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-[#c4d402]/50'
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
            {(loadingTireSizes || tireSizes.length > 0 || staggeredTireSizes.length > 0) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-[#1F1F1F] dark:text-white">
                    Информация о шинах
                  </Label>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    formData.tireSeason === "summer"
                      ? "bg-[#c4d402]/20 text-[#1F1F1F] dark:text-white"
                      : "bg-[#009CFF]/20 text-[#009CFF]"
                  }`}>
                    {formData.tireSeason === "summer" ? "Летние" : "Зимние"}
                  </span>
                </div>
                {loadingTireSizes ? (
                  <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-[#1F1F1F] rounded-lg">
                    <Loader2 className="h-5 w-5 animate-spin text-[#009CFF] mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Загрузка подходящих размеров...</span>
                  </div>
                ) : (tireSizes.length > 0 || staggeredTireSizes.length > 0) ? (
                  <>
                    {/* Базовые размеры (одинаковые на все колеса) */}
                    {tireSizes.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase mb-2">Базовые размеры</div>
                        <div className="grid grid-cols-2 gap-2">
                          {tireSizes.map((size, index) => (
                            <button
                              key={`both-${index}`}
                              type="button"
                              onClick={() => {
                                const isSummer = formData.tireSeason === "summer"
                                setFormData(prev => ({
                                  ...prev,
                                  ...(isSummer ? {
                                    summerTireWidth: size.width,
                                    summerTireProfile: size.height,
                                    summerTireDiameter: size.diameter,
                                    summerRearTireWidth: "",
                                    summerRearTireProfile: "",
                                    summerRearTireDiameter: "",
                                    summerIsStaggered: false,
                                  } : {
                                    winterTireWidth: size.width,
                                    winterTireProfile: size.height,
                                    winterTireDiameter: size.diameter,
                                    winterRearTireWidth: "",
                                    winterRearTireProfile: "",
                                    winterRearTireDiameter: "",
                                    winterIsStaggered: false,
                                  })
                                }))
                              }}
                              className={`p-3 rounded-lg border-2 transition-all text-center ${
                                (formData.tireSeason === "summer"
                                  ? (formData.summerTireWidth === size.width &&
                                     formData.summerTireProfile === size.height &&
                                     formData.summerTireDiameter === size.diameter &&
                                     !formData.summerIsStaggered)
                                  : (formData.winterTireWidth === size.width &&
                                     formData.winterTireProfile === size.height &&
                                     formData.winterTireDiameter === size.diameter &&
                                     !formData.winterIsStaggered))
                                  ? 'border-[#c4d402] bg-[#c4d402]/10'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-[#009CFF] hover:bg-[#009CFF]/5'
                              }`}
                            >
                              <span className="font-semibold text-[#1F1F1F] dark:text-white">
                                {size.width}/{size.height} R{size.diameter}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Разноширокие размеры (пары) */}
                    {staggeredTireSizes.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase mb-2">Разноширокие варианты</div>
                        <div className="space-y-2">
                          {staggeredTireSizes.map((pair, index) => (
                            <button
                              key={`staggered-${index}`}
                              type="button"
                              onClick={() => {
                                const isSummer = formData.tireSeason === "summer"
                                setFormData(prev => ({
                                  ...prev,
                                  ...(isSummer ? {
                                    summerTireWidth: pair.front.width,
                                    summerTireProfile: pair.front.height,
                                    summerTireDiameter: pair.front.diameter,
                                    summerRearTireWidth: pair.rear.width,
                                    summerRearTireProfile: pair.rear.height,
                                    summerRearTireDiameter: pair.rear.diameter,
                                    summerIsStaggered: true,
                                  } : {
                                    winterTireWidth: pair.front.width,
                                    winterTireProfile: pair.front.height,
                                    winterTireDiameter: pair.front.diameter,
                                    winterRearTireWidth: pair.rear.width,
                                    winterRearTireProfile: pair.rear.height,
                                    winterRearTireDiameter: pair.rear.diameter,
                                    winterIsStaggered: true,
                                  })
                                }))
                              }}
                              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                                (formData.tireSeason === "summer"
                                  ? (formData.summerTireWidth === pair.front.width &&
                                     formData.summerTireProfile === pair.front.height &&
                                     formData.summerTireDiameter === pair.front.diameter &&
                                     formData.summerRearTireWidth === pair.rear.width &&
                                     formData.summerRearTireProfile === pair.rear.height &&
                                     formData.summerRearTireDiameter === pair.rear.diameter &&
                                     formData.summerIsStaggered)
                                  : (formData.winterTireWidth === pair.front.width &&
                                     formData.winterTireProfile === pair.front.height &&
                                     formData.winterTireDiameter === pair.front.diameter &&
                                     formData.winterRearTireWidth === pair.rear.width &&
                                     formData.winterRearTireProfile === pair.rear.height &&
                                     formData.winterRearTireDiameter === pair.rear.diameter &&
                                     formData.winterIsStaggered))
                                  ? 'border-[#009CFF] bg-[#009CFF]/10'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-[#009CFF] hover:bg-[#009CFF]/5'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex-1 text-center">
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Передняя ось</div>
                                  <div className="font-semibold text-[#1F1F1F] dark:text-white">
                                    {pair.front.width}/{pair.front.height} R{pair.front.diameter}
                                  </div>
                                </div>
                                <div className="flex-1 text-center">
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Задняя ось</div>
                                  <div className="font-semibold text-[#1F1F1F] dark:text-white">
                                    {pair.rear.width}/{pair.rear.height} R{pair.rear.diameter}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {tireSizes.length > 0 ? 'Нажмите на размер для быстрого выбора' : 'Заполните данные об автомобиле для получения рекомендаций'}
                </p>
              </div>
            )}

            {(tireSizes.length > 0 || staggeredTireSizes.length > 0) && (
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

            {/* Передняя ось - показываем заголовок только если есть разноширокие */}
            {staggeredTireSizes.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Передняя ось</span>
                <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="tire-width" className="text-center block">Ширина</Label>
                <Input
                  id="tire-width"
                  type="number"
                  placeholder="185"
                  className="w-full text-center"
                  value={formData.tireSeason === "summer" ? formData.summerTireWidth : formData.winterTireWidth}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    ...(prev.tireSeason === "summer"
                      ? { summerTireWidth: e.target.value }
                      : { winterTireWidth: e.target.value })
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tire-profile" className="text-center block">Профиль</Label>
                <Input
                  id="tire-profile"
                  type="number"
                  placeholder="65"
                  className="w-full text-center"
                  value={formData.tireSeason === "summer" ? formData.summerTireProfile : formData.winterTireProfile}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    ...(prev.tireSeason === "summer"
                      ? { summerTireProfile: e.target.value }
                      : { winterTireProfile: e.target.value })
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tire-diameter" className="text-center block">Диаметр</Label>
                <Input
                  id="tire-diameter"
                  type="number"
                  placeholder="15"
                  className="w-full text-center"
                  value={formData.tireSeason === "summer" ? formData.summerTireDiameter : formData.winterTireDiameter}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    ...(prev.tireSeason === "summer"
                      ? { summerTireDiameter: e.target.value }
                      : { winterTireDiameter: e.target.value })
                  }))}
                />
              </div>
            </div>

            {/* Задняя ось - показываем только если есть разноширокие варианты */}
            {staggeredTireSizes.length > 0 && (
              <>
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Задняя ось</span>
                  <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="rear-tire-width" className="text-center block">Ширина</Label>
                    <Input
                      id="rear-tire-width"
                      type="number"
                      placeholder="185"
                      className="w-full text-center"
                      value={formData.tireSeason === "summer" ? formData.summerRearTireWidth : formData.winterRearTireWidth}
                      onChange={(e) => setFormData((prev) => ({
                        ...prev,
                        ...(prev.tireSeason === "summer"
                          ? { summerRearTireWidth: e.target.value, summerIsStaggered: true }
                          : { winterRearTireWidth: e.target.value, winterIsStaggered: true })
                      }))}
                      disabled={formData.tireSeason === "summer" ? !formData.summerIsStaggered : !formData.winterIsStaggered}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rear-tire-profile" className="text-center block">Профиль</Label>
                    <Input
                      id="rear-tire-profile"
                      type="number"
                      placeholder="65"
                      className="w-full text-center"
                      value={formData.tireSeason === "summer" ? formData.summerRearTireProfile : formData.winterRearTireProfile}
                      onChange={(e) => setFormData((prev) => ({
                        ...prev,
                        ...(prev.tireSeason === "summer"
                          ? { summerRearTireProfile: e.target.value, summerIsStaggered: true }
                          : { winterRearTireProfile: e.target.value, winterIsStaggered: true })
                      }))}
                      disabled={formData.tireSeason === "summer" ? !formData.summerIsStaggered : !formData.winterIsStaggered}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rear-tire-diameter" className="text-center block">Диаметр</Label>
                    <Input
                      id="rear-tire-diameter"
                      type="number"
                      placeholder="15"
                      className="w-full text-center"
                      value={formData.tireSeason === "summer" ? formData.summerRearTireDiameter : formData.winterRearTireDiameter}
                      onChange={(e) => setFormData((prev) => ({
                        ...prev,
                        ...(prev.tireSeason === "summer"
                          ? { summerRearTireDiameter: e.target.value, summerIsStaggered: true }
                          : { winterRearTireDiameter: e.target.value, winterIsStaggered: true })
                      }))}
                      disabled={formData.tireSeason === "summer" ? !formData.summerIsStaggered : !formData.winterIsStaggered}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Параметры дисков - автоматически из API */}
            {wheelSpecs.length > 0 && (
              <>
                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-[#2A2A2A] px-2 text-gray-500 dark:text-gray-400">
                      Параметры дисков из базы
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-[#c4d402]/10 border border-[#c4d402] rounded-xl">
                  <h4 className="text-sm font-semibold text-[#1F1F1F] dark:text-white mb-3">
                    Рекомендуемые параметры дисков
                  </h4>

                  {/* Warning for missing wheel data */}
                  {missingWheelData && (
                    <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-600 dark:text-yellow-500 mt-0.5">⚠️</span>
                        <div className="text-xs text-yellow-800 dark:text-yellow-200">
                          <p className="font-semibold mb-1">Неполные данные о дисках</p>
                          <p>Для вашего автомобиля в базе данных отсутствует информация о ширине диска (J) и/или вылете (ET). Указаны только доступные диаметры.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">PCD:</span>
                      <span className="font-semibold text-[#1F1F1F] dark:text-white">{boltPattern || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">DIA:</span>
                      <span className="font-semibold text-[#1F1F1F] dark:text-white">{centerBore ? `${centerBore} мм` : "—"}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {wheelSpecs.length > 0 && wheelSpecs[0].width && wheelSpecs[0].et
                          ? "Выберите размер дисков:"
                          : "Доступные диаметры дисков:"}
                      </div>
                      {(() => {
                        const currentTireDiam = formData.tireSeason === "summer"
                          ? formData.summerTireDiameter
                          : formData.winterTireDiameter
                        if (currentTireDiam) {
                          return (
                            <div className="text-xs text-[#009CFF] font-medium">
                              Шины: R{currentTireDiam}
                            </div>
                          )
                        }
                        return null
                      })()}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {wheelSpecs.map((spec, idx) => {
                        const currentTireDiam = formData.tireSeason === "summer"
                          ? formData.summerTireDiameter
                          : formData.winterTireDiameter
                        const isMatchingTire = currentTireDiam === spec.diameter

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedWheelSpec(idx)}
                            className={`flex flex-col items-center justify-center gap-1 text-xs p-3 rounded-lg border-2 transition-all ${
                              selectedWheelSpec === idx
                                ? 'bg-[#c4d402] border-[#c4d402] text-[#1F1F1F] font-semibold'
                                : isMatchingTire
                                  ? 'bg-[#009CFF]/10 border-[#009CFF] text-[#1F1F1F] dark:text-white hover:border-[#c4d402]/50'
                                  : 'bg-white dark:bg-[#1F1F1F] border-gray-200 dark:border-gray-700 text-[#1F1F1F] dark:text-white hover:border-[#c4d402]/50'
                            }`}
                          >
                            <span>
                              {spec.width && spec.et
                                ? `R${spec.diameter} × ${spec.width}J ET${spec.et}`
                                : `R${spec.diameter}`}
                            </span>
                            {isMatchingTire && selectedWheelSpec !== idx && (
                              <span className="text-[10px] text-[#009CFF]">↑ Соответствует шинам</span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                    {wheelSpecs.length > 0 && wheelSpecs[0].width && wheelSpecs[0].et
                      ? "💡 Диаметр диска автоматически выбирается под размер шин. Выбранные параметры будут использоваться в \"Мой гараж\""
                      : "⚠️ Полные данные о дисках недоступны в базе. Будет использован только диаметр из размера шин и параметры PCD/DIA"}
                  </p>
                </div>
              </>
            )}

          </form>
        </div>

        {/* Кнопка добавления - с эффектом размытия */}
        <div className="sticky bottom-0 px-3 sm:px-4 pt-8 py-4 pb-[calc(16px+env(safe-area-inset-bottom))]" style={{ background: 'linear-gradient(to top, rgba(18, 18, 18, 0.9) 0%, rgba(18, 18, 18, 0.6) 60%, rgba(18, 18, 18, 0) 100%)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', maskImage: 'linear-gradient(to top, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 70%, transparent 100%)' }}>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-8 text-lg bg-[#c4d402] hover:bg-[#C4CF2E] text-black font-bold rounded-t-[32px] rounded-b-[32px] shadow-lg disabled:opacity-50"
          >
            <Plus className="mr-2 h-5 w-5" />
            {isSubmitting ? "Добавление..." : "Добавить автомобиль"}
          </Button>
        </div>
      </div>
    </main>
  )
}
