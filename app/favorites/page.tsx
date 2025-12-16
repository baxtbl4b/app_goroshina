"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/bottom-navigation"
import TireCard from "@/components/tire-card"
import type { Tire } from "@/lib/api"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Tire[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Загружаем избранное из localStorage
    const loadFavorites = () => {
      const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]")
      setFavorites(storedFavorites)
      setLoading(false)
    }

    // Загружаем при монтировании
    loadFavorites()

    // Обновляем при изменении избранного
    const handleFavoritesUpdated = () => {
      loadFavorites()
    }

    // Подписываемся на событие обновления избранного
    window.addEventListener("favoritesUpdated", handleFavoritesUpdated)

    // Отписываемся при размонтировании
    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdated)
    }
  }, [])

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
        <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
          <div className="h-full px-4 flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="mr-3">
                <ChevronLeft className="h-6 w-6 text-white" />
              </Link>
              <h1 className="text-xl font-bold text-white">Избранное</h1>
            </div>
            <Heart className="h-6 w-6 text-[#c4d402]" />
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-8">
            <p className="text-[#1F1F1F] dark:text-white">Загрузка...</p>
          </div>
        </div>
        <BottomNavigation />
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-3">
              <ChevronLeft className="h-6 w-6 text-white" />
            </Link>
            <h1 className="text-xl font-bold text-white">Избранное</h1>
          </div>
          <Heart className="h-6 w-6 text-[#c4d402]" />
        </div>
      </header>

      <div className="flex-1 px-4 py-6 pb-20">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-8 max-w-md w-full">
              <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-[#1F1F1F] dark:text-white mb-2">Пока нет избранных товаров</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Добавляйте товары в избранное, нажимая на иконку сердечка
              </p>
              <Link href="/category/summer">
                <Button className="bg-[#c4d402] hover:bg-[#c4d402]/80 text-[#1F1F1F] w-full">Перейти в каталог</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Найдено {favorites.length}{" "}
                {favorites.length === 1 ? "товар" : favorites.length < 5 ? "товара" : "товаров"}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("favorites")
                  setFavorites([])
                  // Уведомляем другие компоненты об обновлении
                  window.dispatchEvent(new Event("favoritesUpdated"))
                }}
                className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-950"
              >
                Очистить все
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((tire) => (
                <TireCard key={tire.id} tire={tire} />
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </main>
  )
}
