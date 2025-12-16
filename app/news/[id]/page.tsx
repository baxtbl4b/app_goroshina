"use client"

import { ArrowLeft, Clock, Eye, Share2, Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import BottomNavigation from "@/components/bottom-navigation"

// Mock data - in real app this would come from API
const getArticleById = (id: string) => {
  const articles = {
    "1": {
      id: "1",
      title: "Зимняя распродажа шин - скидки до 40%",
      content: `
        <p>Дорогие автовладельцы! Мы рады сообщить о начале грандиозной зимней распродажи шин в сети магазинов "Горошина".</p>
        
        <h3>Что входит в акцию:</h3>
        <ul>
          <li>Зимние шины ведущих брендов со скидкой до 40%</li>
          <li>Бесплатный шиномонтаж при покупке комплекта</li>
          <li>Дополнительная скидка 5% при оплате картой</li>
          <li>Возможность рассрочки на 6 месяцев</li>
        </ul>
        
        <h3>Популярные модели в акции:</h3>
        <ul>
          <li>Michelin X-Ice North 4 - от 8,500 руб.</li>
          <li>Continental IceContact 3 - от 7,200 руб.</li>
          <li>Bridgestone Blizzak Spike-02 - от 6,800 руб.</li>
          <li>Nokian Hakkapeliitta R3 - от 9,100 руб.</li>
        </ul>
        
        <p>Акция действует во всех магазинах сети до 31 января 2024 года или до окончания товарных запасов.</p>
        
        <p><strong>Не упустите возможность подготовить свой автомобиль к зиме по выгодной цене!</strong></p>
      `,
      category: "promotions",
      date: "2024-01-15",
      readTime: "3 мин",
      image: "/images/winter-tire-new.png",
      views: 1250,
      author: "Редакция Горошина",
    },
  }

  return articles[id as keyof typeof articles] || null
}

export default function NewsArticlePage({ params }: { params: { id: string } }) {
  const article = getArticleById(params.id)

  if (!article) {
    return (
      <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#1F1F1F] dark:text-white mb-4">Статья не найдена</h1>
            <Link href="/news">
              <Button>Вернуться к новостям</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-4 flex items-center justify-between">
          <Link href="/news">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 pb-20">
        {/* Article Header */}
        <div className="bg-white dark:bg-[#2A2A2A] p-4">
          <div className="mb-4">
            <img
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#c4d402] text-[#1F1F1F] text-xs px-2 py-1 rounded-full">Акции</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(article.date).toLocaleDateString("ru-RU")}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[#1F1F1F] dark:text-white mb-4">{article.title}</h1>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span>Автор: {article.author}</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{article.views}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white dark:bg-[#2A2A2A] mt-2 p-4">
          <div
            className="prose prose-sm max-w-none text-[#1F1F1F] dark:text-white"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Related Articles */}
        <div className="bg-white dark:bg-[#2A2A2A] mt-2 p-4">
          <h3 className="font-bold text-[#1F1F1F] dark:text-white mb-4">Похожие статьи</h3>
          <div className="space-y-3">
            <Link href="/news/2" className="flex gap-3 p-3 rounded-lg bg-[#F5F5F5] dark:bg-[#1F1F1F]">
              <img
                src="/images/michelin-pilot-sport-4.png"
                alt="Новая линейка шин"
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-[#1F1F1F] dark:text-white text-sm mb-1">
                  Новая линейка шин Michelin Pilot Sport 5
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">15 января 2024</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}
