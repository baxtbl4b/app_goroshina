"use client"

import { useState, useEffect } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getTireDimensions, getTireBrands, type Season } from "@/lib/api"

interface TireFiltersProps {
  season: Season
  onFilterChange: (filters: Record<string, any>) => void
}

export default function TireFilters({ season, onFilterChange }: TireFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([5000, 25000])
  const [selectedWidths, setSelectedWidths] = useState<string[]>([])
  const [selectedHeights, setSelectedHeights] = useState<string[]>([])
  const [selectedDiameters, setSelectedDiameters] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [stockFilter, setStockFilter] = useState<string | null>(null)
  const [runflat, setRunflat] = useState<boolean | null>(null)
  const [spike, setSpike] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Популярные типоразмеры
  const commonSizes = [
    { label: "195/65 R15", width: "195", height: "65", diam: "15" },
    { label: "205/55 R16", width: "205", height: "55", diam: "16" },
    { label: "225/45 R17", width: "225", height: "45", diam: "17" },
    { label: "235/35 R19", width: "235", height: "35", diam: "19" },
    { label: "185/65 R15", width: "185", height: "65", diam: "15" },
    { label: "215/65 R16", width: "215", height: "65", diam: "16" },
  ]

  // Функция для применения быстрого фильтра по типоразмеру
  const applyQuickSizeFilter = (size: { width: string; height: string; diam: string }) => {
    setSelectedWidths([size.width])
    setSelectedHeights([size.height])
    setSelectedDiameters([size.diam])

    // Автоматически применяем фильтры
    setTimeout(() => {
      applyFilters()
    }, 100)
  }

  // Available options (will be fetched from API)
  const [availableWidths, setAvailableWidths] = useState<string[]>([])
  const [availableHeights, setAvailableHeights] = useState<string[]>([])
  const [availableDiameters, setAvailableDiameters] = useState<string[]>([])
  const [availableBrands, setAvailableBrands] = useState<string[]>([])

  // Fetch available dimensions and brands from API
  useEffect(() => {
    async function fetchDimensions() {
      try {
        const dimensions = await getTireDimensions()
        setAvailableWidths(dimensions.widths)
        setAvailableHeights(dimensions.heights)
        setAvailableDiameters(dimensions.diameters)
      } catch (error) {
        console.error("Error fetching dimensions:", error)
      }
    }

    async function fetchBrands() {
      try {
        const brands = await getTireBrands()
        setAvailableBrands(brands)
      } catch (error) {
        console.error("Error fetching brands:", error)
      }
    }

    fetchDimensions()
    fetchBrands()
  }, [])

  // Function to apply filters when Submit button is clicked
  const applyFilters = () => {
    setIsSubmitting(true)

    const filters: Record<string, any> = { season }

    // Add width filter if selected
    if (selectedWidths.length > 0) {
      filters.width = selectedWidths
    }

    // Add height filter if selected
    if (selectedHeights.length > 0) {
      filters.height = selectedHeights
    }

    // Add diameter filter if selected
    if (selectedDiameters.length > 0) {
      filters.diam = selectedDiameters
    }

    // Add brand filter if selected
    if (selectedBrands.length > 0) {
      filters.brand = selectedBrands
    }

    // Add price range filter
    filters.minPrice = priceRange[0]
    filters.maxPrice = priceRange[1]

    // Add stock filter if selected
    if (stockFilter) {
      filters.stock = stockFilter
    }

    // Add runflat filter if selected
    if (runflat !== null) {
      filters.runflat = runflat
    }

    // Add spike filter if selected
    if (spike !== null) {
      filters.spike = spike
    }

    // Call the onFilterChange callback with the new filters
    onFilterChange(filters)

    setTimeout(() => {
      setIsSubmitting(false)
    }, 500)
  }

  const resetFilters = () => {
    setPriceRange([5000, 25000])
    setSelectedWidths([])
    setSelectedHeights([])
    setSelectedDiameters([])
    setSelectedBrands([])
    setStockFilter(null)
    setRunflat(null)
    setSpike(null)

    // Apply the reset filters immediately
    onFilterChange({ season })
  }

  const toggleWidth = (width: string) => {
    if (selectedWidths.includes(width)) {
      setSelectedWidths(selectedWidths.filter((w) => w !== width))
    } else {
      setSelectedWidths([...selectedWidths, width])
    }
  }

  const toggleHeight = (height: string) => {
    if (selectedHeights.includes(height)) {
      setSelectedHeights(selectedHeights.filter((h) => h !== height))
    } else {
      setSelectedHeights([...selectedHeights, height])
    }
  }

  const toggleDiameter = (diameter: string) => {
    if (selectedDiameters.includes(diameter)) {
      setSelectedDiameters(selectedDiameters.filter((d) => d !== diameter))
    } else {
      setSelectedDiameters([...selectedDiameters, diameter])
    }
  }

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    } else {
      setSelectedBrands([...selectedBrands, brand])
    }
  }

  // Count active filters for the badge
  const activeFilterCount = [
    selectedWidths.length > 0,
    selectedHeights.length > 0,
    selectedDiameters.length > 0,
    selectedBrands.length > 0,
    stockFilter !== null,
    runflat !== null,
    spike !== null,
    // Don't count price range unless it's different from default
    priceRange[0] !== 5000 || priceRange[1] !== 25000,
  ].filter(Boolean).length

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 border-[#D9D9DD] dark:border-[#3A3A3A] text-[#1F1F1F] dark:text-white"
        >
          <Filter className="h-4 w-4" />
          Фильтры
          {activeFilterCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-[#009CFF] text-white rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {isOpen && (
          <Button variant="ghost" onClick={resetFilters} className="text-[#009CFF]">
            Сбросить
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="mb-4">
          <h3 className="font-medium mb-2 text-[#1F1F1F] dark:text-white">Популярные типоразмеры</h3>
          <div className="flex flex-wrap gap-2">
            {commonSizes.map((size) => (
              <Button
                key={size.label}
                variant="outline"
                size="sm"
                className={`text-xs ${
                  selectedWidths.includes(size.width) &&
                  selectedHeights.includes(size.height) &&
                  selectedDiameters.includes(size.diam)
                    ? "bg-[#c4d402] text-[#1F1F1F] border-[#c4d402]"
                    : "border-[#D9D9DD] dark:border-[#3A3A3A] text-[#1F1F1F] dark:text-white"
                }`}
                onClick={() => applyQuickSizeFilter(size)}
              >
                {size.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price Range */}
            <div>
              <h3 className="font-medium mb-2 text-[#1F1F1F] dark:text-white">Цена</h3>
              <div className="px-2">
                <Slider
                  defaultValue={[5000, 25000]}
                  min={5000}
                  max={30000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-[#1F1F1F] dark:text-white">
                  <span>{priceRange[0].toLocaleString()} ₽</span>
                  <span>{priceRange[1].toLocaleString()} ₽</span>
                </div>
              </div>
            </div>

            {/* Stock Filter */}
            <div>
              <h3 className="font-medium mb-2 text-[#1F1F1F] dark:text-white">Наличие</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="in-stock"
                    checked={stockFilter === "in-stock"}
                    onCheckedChange={() => setStockFilter(stockFilter === "in-stock" ? null : "in-stock")}
                  />
                  <label htmlFor="in-stock" className="ml-2 text-sm text-[#1F1F1F] dark:text-white cursor-pointer">
                    В наличии
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="low-stock"
                    checked={stockFilter === "low"}
                    onCheckedChange={() => setStockFilter(stockFilter === "low" ? null : "low")}
                  />
                  <label htmlFor="low-stock" className="ml-2 text-sm text-[#1F1F1F] dark:text-white cursor-pointer">
                    Заканчивается
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="out-of-stock"
                    checked={stockFilter === "out"}
                    onCheckedChange={() => setStockFilter(stockFilter === "out" ? null : "out")}
                  />
                  <label htmlFor="out-of-stock" className="ml-2 text-sm text-[#1F1F1F] dark:text-white cursor-pointer">
                    Под заказ
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Accordion type="multiple" className="w-full">
              {/* Width Filter */}
              <AccordionItem value="width">
                <AccordionTrigger className="text-[#1F1F1F] dark:text-white">
                  Ширина
                  {selectedWidths.length > 0 && (
                    <span className="ml-2 text-xs text-[#009CFF]">({selectedWidths.length})</span>
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {availableWidths.map((width) => (
                      <div key={width} className="flex items-center">
                        <Checkbox
                          id={`width-${width}`}
                          checked={selectedWidths.includes(width)}
                          onCheckedChange={() => toggleWidth(width)}
                        />
                        <label
                          htmlFor={`width-${width}`}
                          className="ml-2 text-sm text-[#1F1F1F] dark:text-white cursor-pointer"
                        >
                          {width}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Height Filter */}
              <AccordionItem value="height">
                <AccordionTrigger className="text-[#1F1F1F] dark:text-white">
                  Высота
                  {selectedHeights.length > 0 && (
                    <span className="ml-2 text-xs text-[#009CFF]">({selectedHeights.length})</span>
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {availableHeights.map((height) => (
                      <div key={height} className="flex items-center">
                        <Checkbox
                          id={`height-${height}`}
                          checked={selectedHeights.includes(height)}
                          onCheckedChange={() => toggleHeight(height)}
                        />
                        <label
                          htmlFor={`height-${height}`}
                          className="ml-2 text-sm text-[#1F1F1F] dark:text-white cursor-pointer"
                        >
                          {height}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Diameter Filter */}
              <AccordionItem value="diameter">
                <AccordionTrigger className="text-[#1F1F1F] dark:text-white">
                  Диаметр
                  {selectedDiameters.length > 0 && (
                    <span className="ml-2 text-xs text-[#009CFF]">({selectedDiameters.length})</span>
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {availableDiameters.map((diameter) => (
                      <div key={diameter} className="flex items-center">
                        <Checkbox
                          id={`diameter-${diameter}`}
                          checked={selectedDiameters.includes(diameter)}
                          onCheckedChange={() => toggleDiameter(diameter)}
                        />
                        <label
                          htmlFor={`diameter-${diameter}`}
                          className="ml-2 text-sm text-[#1F1F1F] dark:text-white cursor-pointer"
                        >
                          R{diameter}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Brand Filter */}
              <AccordionItem value="brand">
                <AccordionTrigger className="text-[#1F1F1F] dark:text-white">
                  Бренд
                  {selectedBrands.length > 0 && (
                    <span className="ml-2 text-xs text-[#009CFF]">({selectedBrands.length})</span>
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableBrands.map((brand) => (
                      <div key={brand} className="flex items-center">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                        />
                        <label
                          htmlFor={`brand-${brand}`}
                          className="ml-2 text-sm text-[#1F1F1F] dark:text-white cursor-pointer"
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Features Filter */}
              <AccordionItem value="features">
                <AccordionTrigger className="text-[#1F1F1F] dark:text-white">Особенности</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox
                        id="runflat"
                        checked={runflat === true}
                        onCheckedChange={(checked) => setRunflat(checked ? true : null)}
                      />
                      <label htmlFor="runflat" className="ml-2 text-sm text-[#1F1F1F] dark:text-white cursor-pointer">
                        RunFlat
                      </label>
                    </div>
                    {season === "w" && (
                      <div className="flex items-center">
                        <Checkbox
                          id="spike"
                          checked={spike === true}
                          onCheckedChange={(checked) => setSpike(checked ? true : null)}
                        />
                        <label htmlFor="spike" className="ml-2 text-sm text-[#1F1F1F] dark:text-white cursor-pointer">
                          Шипованные
                        </label>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={applyFilters}
              disabled={isSubmitting}
              className="bg-[#009CFF] hover:bg-[#0084d6] text-white"
            >
              {isSubmitting ? "Применение..." : "Применить фильтры"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
