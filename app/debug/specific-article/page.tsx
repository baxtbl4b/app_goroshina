"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SpecificArticlePage() {
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Конкретный артикул, который мы хотим найти
  const specificArticle = "0002735aeacaecf8b22d9dfbd46731f06a06230046b1c77058fb6f800a7eff2a"

  useEffect(() => {
    async function fetchSpecificTire() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/tire-by-article?article=${encodeURIComponent(specificArticle)}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `API вернул ошибку: ${response.status}`)
        }

        const data = await response.json()
        setApiResponse(data)
        console.log("API Response:", data)
      } catch (err) {
        console.error("Ошибка при получении данных:", err)
        setError(err.message || "Произошла ошибка при получении данных")
      } finally {
        setLoading(false)
      }
    }

    fetchSpecificTire()
  }, [])

  // Функция для безопасного отображения значений
  const safeRender = (value: any): string => {
    if (value === null || value === undefined) return "—"
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return String(value)
    }
    if (typeof value === "object") {
      // Если это объект, возвращаем строковое представление
      return JSON.stringify(value)
    }
    return "—"
  }

  // Функция для отображения основной информации о шине
  const renderTireInfo = () => {
    if (!apiResponse || !apiResponse.data || apiResponse.data.length === 0) return null

    const tire = Array.isArray(apiResponse.data) ? apiResponse.data[0] : apiResponse.data

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-lg">
                  {typeof tire.model === "object" && tire.model?.name
                    ? safeRender(tire.model.name)
                    : "Название модели не указано"}
                </h3>
                <p>
                  <strong>Артикул (ID):</strong> {safeRender(tire.id)}
                </p>
                <p>
                  <strong>Бренд:</strong>{" "}
                  {typeof tire.model === "object" && typeof tire.model.brand === "object" && tire.model.brand?.name
                    ? safeRender(tire.model.brand.name)
                    : "Не указан"}
                </p>
                <p>
                  <strong>Страна:</strong>{" "}
                  {typeof tire.model === "object" &&
                  typeof tire.model.brand === "object" &&
                  typeof tire.model.brand.country === "object" &&
                  tire.model.brand.country?.name
                    ? safeRender(tire.model.brand.country.name)
                    : "Не указана"}
                </p>
                <p>
                  <strong>Размер:</strong> {safeRender(tire.width)}/{safeRender(tire.height)} R{safeRender(tire.diam)}
                </p>
                <p>
                  <strong>Индекс нагрузки:</strong> {safeRender(tire.load_index)}
                </p>
                <p>
                  <strong>Индекс скорости:</strong> {safeRender(tire.speed_index)}
                </p>
              </div>
              <div>
                <p>
                  <strong>Сезон:</strong>{" "}
                  {tire.season === "w"
                    ? "Зима"
                    : tire.season === "s"
                      ? "Лето"
                      : tire.season === "a"
                        ? "Всесезонные"
                        : safeRender(tire.season)}
                </p>
                <p>
                  <strong>Шипованная:</strong> {tire.spike ? "Да" : "Нет"}
                </p>
                <p>
                  <strong>RunFlat:</strong> {tire.runflat ? "Да" : "Нет"}
                </p>
                <p>
                  <strong>Грузовая:</strong> {tire.cargo ? "Да" : "Нет"}
                </p>
                {typeof tire.model === "object" && tire.model?.image && (
                  <p>
                    <strong>Изображение:</strong> Доступно
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Функция для отображения JSON-данных
  const renderJsonData = () => {
    if (!apiResponse) return null

    return (
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Полный ответ API</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded overflow-auto max-h-[600px]">
              <pre className="text-xs">{JSON.stringify(apiResponse, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Данные API для артикула: <span className="text-blue-600">{specificArticle}</span>
      </h1>

      {loading && (
        <div className="text-center p-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">Загрузка данных...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && apiResponse && (
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="info">Информация о шине</TabsTrigger>
            <TabsTrigger value="json">JSON данные</TabsTrigger>
          </TabsList>
          <TabsContent value="info">{renderTireInfo()}</TabsContent>
          <TabsContent value="json">{renderJsonData()}</TabsContent>
        </Tabs>
      )}

      {!loading && !error && (!apiResponse || !apiResponse.data || apiResponse.data.length === 0) && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>Шина с указанным артикулом не найдена.</p>
        </div>
      )}
    </div>
  )
}
