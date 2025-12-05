"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, Search, Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BottomNavigation from "@/components/bottom-navigation"

const cities = [
  { id: 1, name: "Москва", region: "Московская область" },
  { id: 2, name: "Санкт-Петербург", region: "Ленинградская область" },
  { id: 3, name: "Новосибирск", region: "Новосибирская область" },
  { id: 4, name: "Екатеринбург", region: "Свердловская область" },
  { id: 5, name: "Казань", region: "Республика Татарстан" },
  { id: 6, name: "Нижний Новгород", region: "Нижегородская область" },
  { id: 7, name: "Челябинск", region: "Челябинская область" },
  { id: 8, name: "Самара", region: "Самарская область" },
  { id: 9, name: "Омск", region: "Омская область" },
  { id: 10, name: "Ростов-на-Дону", region: "Ростовская область" },
  { id: 11, name: "Уфа", region: "Республика Башкортостан" },
  { id: 12, name: "Красноярск", region: "Красноярский край" },
  { id: 13, name: "Воронеж", region: "Воронежская область" },
  { id: 14, name: "Пермь", region: "Пермский край" },
  { id: 15, name: "Волгоград", region: "Волгоградская область" },
]

export default function CitySelectionPage() {
  const [selectedCity, setSelectedCity] = useState("Москва")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.region.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName)
    // Here you would typically save to localStorage or send to API
    localStorage.setItem("selectedCity", cityName)
  }

  const handleSave = () => {
    // Navigate back to settings with success message
    window.history.back()
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
              </Button>
            </Link>
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Выбор города</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-4 pb-20">
        {/* Current Location */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4">
          <div className="flex items-center mb-3">
            <MapPin className="h-5 w-5 text-[#009CFF] mr-2" />
            <span className="font-semibold text-[#1F1F1F] dark:text-white">Текущий город</span>
          </div>
          <div className="text-lg font-bold text-[#009CFF]">{selectedCity}</div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск города..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#F5F5F5] dark:bg-[#3A3A3A] border-none"
            />
          </div>
        </div>

        {/* Popular Cities */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#D9D9DD] dark:border-[#3A3A3A]">
            <h3 className="font-semibold text-[#1F1F1F] dark:text-white">
              {searchQuery ? "Результаты поиска" : "Популярные города"}
            </h3>
          </div>
          <div className="divide-y divide-[#D9D9DD] dark:divide-[#3A3A3A] max-h-96 overflow-y-auto">
            {filteredCities.map((city) => (
              <button
                key={city.id}
                onClick={() => handleCitySelect(city.name)}
                className="w-full flex items-center justify-between p-4 hover:bg-[#F5F5F5] dark:hover:bg-[#3A3A3A] transition-colors"
              >
                <div className="text-left">
                  <div className="font-medium text-[#1F1F1F] dark:text-white">{city.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{city.region}</div>
                </div>
                {selectedCity === city.name && <Check className="h-5 w-5 text-[#009CFF]" />}
              </button>
            ))}
          </div>
        </div>

        {filteredCities.length === 0 && searchQuery && (
          <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-8 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-[#1F1F1F] dark:text-white mb-2">Город не найден</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Попробуйте изменить запрос или выберите из списка популярных городов
            </p>
          </div>
        )}

        {/* Auto-detect Location */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center border-[#009CFF] text-[#009CFF] hover:bg-[#009CFF] hover:text-white bg-transparent"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Определить автоматически
          </Button>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Мы определим ваше местоположение с помощью GPS
          </p>
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}
