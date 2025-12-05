"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DebugArticlePage() {
  const [article, setArticle] = useState("")
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("search")

  async function fetchTireByArticle() {
    if (!article.trim()) {
      setError("Пожалуйста, введите артикул шины")
      return
    }

    setLoading(true)
    setError(null)
    setApiResponse(null)

    try {
      const response = await fetch(`/api/tire-by-article?article=${encodeURIComponent(article.trim())}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `API вернул ошибку: ${response.status}`)
      }

      const data = await response.json()
      setApiResponse(data)
    } catch (err) {
      console.error("Ошибка при получении данных:", err)
      setError(err.message || "Произошла ошибка при получении данных")
    } finally {
      setLoading(false)
    }
  }

  // Функция для отображения найденных шин
  const renderTireResults = () => {
    if (!apiResponse || !apiResponse.data) return null

    const tires = Array.isArray(apiResponse.data) ? apiResponse.data : [apiResponse.data]

    return (
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Найдено шин: {tires.length}</h2>
        <div className="space-y-4">
          {tires.map((tire: any, index: number) => (
            <Card key={tire.id || index}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">
                      {tire.model && typeof tire.model === "object"
                        ? tire.model.name || "Название модели не указано"
                        : tire.model || "Модель не у��азана"}
                    </h3>
                    <p className="text-sm text-gray-600">Артикул (ID): {tire.id}</p>
                    <p className="text-sm">
                      Размер: {tire.width}/{tire.height} R{tire.diam}
                    </p>
                    <p className="text-sm">
                      Сезон: {tire.season === "w" ? "Зима" : tire.season === "s" ? "Лето" : "Всесезо��ные"}
                    </p>
                    {tire.spike && <p className="text-sm text-red-600">Шипованные</p>}
                    {tire.runflat && <p className="text-sm text-blue-600">RunFlat</p>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActiveTab("json")
                      // Прокрутить к детальной информации
                      document.getElementById(`tire-details-${index}`)?.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Функция для отображения JSON-данных
  const renderJsonData = () => {
    if (!apiResponse) return null

    const tires = Array.isArray(apiResponse.data) ? apiResponse.data : [apiResponse.data]

    return (
      <div className="mt-4">
        {tires.map((tire: any, index: number) => (
          <Card key={tire.id || index} className="mb-4" id={`tire-details-${index}`}>
            <CardHeader>
              <CardTitle>
                {tire.model && typeof tire.model === "object"
                  ? tire.model.name || "Название модели не указано"
                  : tire.model || "Модель не указана"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-4 rounded overflow-auto max-h-[400px]">
                <pre className="text-xs">{JSON.stringify(tire, null, 2)}</pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Поиск шин по артикулу</h1>

      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Введите артикул шины..."
          value={article}
          onChange={(e) => setArticle(e.target.value)}
          className="max-w-md"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchTireByArticle()
            }
          }}
        />
        <Button onClick={fetchTireByArticle} disabled={loading}>
          {loading ? "Загрузка..." : "Найти"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {apiResponse && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="search">Результаты поиска</TabsTrigger>
            <TabsTrigger value="json">JSON данные</TabsTrigger>
          </TabsList>
          <TabsContent value="search">{renderTireResults()}</TabsContent>
          <TabsContent value="json">{renderJsonData()}</TabsContent>
        </Tabs>
      )}
    </div>
  )
}
