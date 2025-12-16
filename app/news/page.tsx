"use client"

import { useState } from "react"
import { ArrowLeft, Search, Clock, Eye, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BottomNavigation from "@/components/bottom-navigation"

const categories = [
  { id: "all", name: "Все", color: "bg-[#009CFF]" },
  { id: "promotions", name: "Акции", color: "bg-[#c4d402] text-[#1F1F1F]" },
  { id: "products", name: "Новинки", color: "bg-[#FF6B35]" },
  { id: "tips", name: "Советы", color: "bg-[#4ECDC4]" },
  { id: "company", name: "Компания", color: "bg-[#45B7D1]" },
]

const newsArticles = [
  {
    id: "1",
    title: "Зимняя распродажа шин - скидки до 40%",
    excerpt: "Успейте приобрести зимние шины по выгодным ценам. Акция действует до конца месяца.",
    category: "promotions",
    date: "2024-01-15",
    readTime: "3 мин",
    image: "/images/winter-tire-new.png",
    views: 1250,
  },
  {
    id: "2",
    title: "Новая линейка шин Michelin Pilot Sport 5",
    excerpt: "Представляем новые высокопроизводительные шины для спортивных автомобилей.",
    category: "products",
    date: "2024-01-12",
    readTime: "5 мин",
    image: "/images/michelin-pilot-sport-4.png",
    views: 890,
  },
  {
    id: "3",
    title: "Как правильно хранить шины в межсезонье",
    excerpt: "Полезные советы по хранению шин, которые помогут продлить их срок службы.",
    category: "tips",
    date: "2024-01-10",
    readTime: "4 мин",
    image: "/images/tire-storage-bags.png",
    views: 2100,
  },
  {
    id: "4",
    title: "Открытие нового сервисного центра в Санкт-Петербурге",
    excerpt: "Мы расширяем географию наших услуг и открываем новый центр в северной столице.",
    category: "company",
    date: "2024-01-08",
    readTime: "2 мин",
    image: "/images/goroshina-logo-new.png",
    views: 650,
  },
  {
    id: "5",
    title: "Весенняя проверка автомобиля: чек-лист",
    excerpt: "Что нужно проверить в автомобиле после зимы. Подробный список для автовладельцев.",
    category: "tips",
    date: "2024-01-05",
    readTime: "6 мин",
    image: "/images/summer-tire-new.png",
    views: 1800,
  },
]

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredArticles = newsArticles.filter((article) => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category?.color || "bg-gray-500"
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category?.name || "Другое"
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm pt-[env(safe-area-inset-top)]">
        <div className="h-[60px] px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
              </Button>
            </Link>
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Новости</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Поиск новостей..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#F5F5F5] dark:bg-[#2A2A2A] border-none"
          />
        </div>
      </header>

      <div className="flex-1 pb-20">
        {/* Category Filters */}
        <div className="p-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap ${
                  selectedCategory === category.id
                    ? `${category.color} text-white hover:opacity-90`
                    : "bg-white dark:bg-[#2A2A2A] text-[#1F1F1F] dark:text-white border-gray-200 dark:border-[#3A3A3A]"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* News Articles */}
        <div className="px-4 space-y-8">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Новости не найдены</p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div key={article.id}>
                {" "}
                {/* Добавлен новый div-обертка */}
                <Link href={`/news/${article.id}`}>
                  <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={article.image || "/placeholder.svg"}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full text-white ${getCategoryColor(article.category)}`}
                          >
                            {getCategoryName(article.category)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(article.date).toLocaleDateString("ru-RU")}
                          </span>
                        </div>
                        <h3 className="font-semibold text-[#1F1F1F] dark:text-white text-sm mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">{article.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{article.readTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{article.views}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}
