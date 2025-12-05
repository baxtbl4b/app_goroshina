"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function ApiResponseDebugPage() {
  const [articleId, setArticleId] = useState("")
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Функция для получения данных о шине по артикулу
  const fetchTireData = async () => {
    if (!articleId.trim()) {
      setError("Пожалуйста, введите ID товара")
      return
    }

    setLoading(true)
    setError(null)
    setApiResponse(null)

    try {
      const response = await fetch(`/api/tire-by-article?article=${encodeURIComponent(articleId)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Ошибка ${response.status}: ${JSON.stringify(data)}`)
      }

      setApiResponse(data)
    } catch (err) {
      setError(`Ошибка при получении данных: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  // Функция для форматирования JSON
  const formatJson = (json: any) => {
    // Создаем копию объекта для безопасного изменения
    const processedJson = JSON.parse(JSON.stringify(json))

    // Обрабатываем данные шин, если они есть
    if (processedJson?.data?.tires && Array.isArray(processedJson.data.tires)) {
      processedJson.data.tires = processedJson.data.tires.map((tire: any) => {
        // Добавляем информацию о преобразовании runflat
        if (tire.hasOwnProperty("runflat")) {
          tire._runflatInfo = {
            originalValue: tire.runflat,
            originalType: typeof tire.runflat,
            convertedValue: Boolean(tire.runflat),
            explanation: `Значение ${JSON.stringify(tire.runflat)} (${typeof tire.runflat}) преобразуется в ${Boolean(tire.runflat)}`,
          }
        }
        return tire
      })
    }

    return JSON.stringify(processedJson, null, 2)
  }

  // Функция для получения URL изображения
  const getImageUrl = (tire: any) => {
    if (!tire?.model?.image?.id) return null

    const imageId = tire.model.image.id
    return `https://api.fxcode.ru/assets/${imageId}?access_token=KYf-JMMTweMWASr-zktunkLwnPKfzeIO`
  }

  // Функция для получения URL флага
  const getFlagUrl = (tire: any) => {
    if (!tire?.model?.brand?.country?.flag?.id) return null

    const flagId = tire.model.brand.country.flag.id
    return `https://api.fxcode.ru/assets/${flagId}?access_token=KYf-JMMTweMWASr-zktunkLwnPKfzeIO`
  }

  // Получаем первую шину из ответа API (если есть)
  const tire = apiResponse?.data?.tires?.[0]

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Отладка API-ответа</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Получить данные о товаре по ID</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Введите ID товара"
              value={articleId}
              onChange={(e) => setArticleId(e.target.value)}
              className="flex-1"
            />
            <Button onClick={fetchTireData} disabled={loading}>
              {loading ? "Загрузка..." : "Получить данные"}
            </Button>
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          {tire && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList>
                <TabsTrigger value="info">Основная информация</TabsTrigger>
                <TabsTrigger value="images">Изображения</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Информация о товаре</h3>
                    <ul className="space-y-2">
                      <li>
                        <strong>ID:</strong> {tire.id}
                      </li>
                      <li>
                        <strong>Модель:</strong> {tire.model?.name}
                      </li>
                      <li>
                        <strong>Бренд:</strong> {tire.model?.brand?.name}
                      </li>
                      <li>
                        <strong>Страна:</strong> {tire.model?.brand?.country?.name}
                      </li>
                      <li>
                        <strong>Сезон:</strong> {tire.season}
                      </li>
                      <li>
                        <strong>Шипы:</strong> {tire.spike ? "Да" : "Нет"}
                      </li>
                      <li>
                        <strong>Runflat:</strong> {Boolean(tire.runflat) ? "Да" : "Нет"}
                        {typeof tire.runflat !== "boolean" && (
                          <span className="text-xs text-orange-500 ml-1">
                            (исходное значение: {JSON.stringify(tire.runflat)})
                          </span>
                        )}
                      </li>
                      <li>
                        <strong>Грузовая:</strong> {tire.cargo ? "Да" : "Нет"}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Размеры</h3>
                    <ul className="space-y-2">
                      <li>
                        <strong>��ирина:</strong> {tire.width?.name}
                      </li>
                      <li>
                        <strong>Высота:</strong> {tire.height?.name}
                      </li>
                      <li>
                        <strong>Диаметр:</strong> {tire.diam?.name}
                      </li>
                      <li>
                        <strong>Индекс нагрузки:</strong> {tire.load_index?.name} ({tire.load_index?.description})
                      </li>
                      <li>
                        <strong>Индекс скорости:</strong> {tire.speed_index?.name} ({tire.speed_index?.description})
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Отладочная информация</h3>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                    <p className="text-sm mb-2">
                      <strong>Runflat:</strong>
                    </p>
                    <ul className="list-disc pl-5 text-xs space-y-1">
                      <li>
                        Исходное значение: <code>{JSON.stringify(tire.runflat)}</code>
                      </li>
                      <li>
                        Тип данных: <code>{typeof tire.runflat}</code>
                      </li>
                      <li>
                        После преобразования: <code>{String(Boolean(tire.runflat))}</code>
                      </li>
                      <li>
                        Строгое сравнение (=== true): <code>{String(tire.runflat === true)}</code>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="images" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Изображение модели */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Изображение модели</h3>
                    {getImageUrl(tire) ? (
                      <div className="space-y-4">
                        <div className="border rounded-lg overflow-hidden p-2 bg-gray-50 dark:bg-gray-800">
                          <Image
                            src={getImageUrl(tire) || "/placeholder.svg"}
                            alt={`${tire.model?.brand?.name} ${tire.model?.name}`}
                            width={300}
                            height={300}
                            className="mx-auto"
                          />
                        </div>
                        <div className="text-sm break-all">
                          <p>
                            <strong>ID изображения:</strong> {tire.model?.image?.id}
                          </p>
                          <p>
                            <strong>Имя файла:</strong> {tire.model?.image?.filename_download}
                          </p>
                          <p>
                            <strong>URL:</strong> {getImageUrl(tire)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p>Изображение отсутствует</p>
                    )}
                  </div>

                  {/* Флаг страны */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Флаг страны производителя</h3>
                    {getFlagUrl(tire) ? (
                      <div className="space-y-4">
                        <div className="border rounded-lg overflow-hidden p-2 bg-gray-50 dark:bg-gray-800">
                          <Image
                            src={getFlagUrl(tire) || "/placeholder.svg"}
                            alt={`Флаг ${tire.model?.brand?.country?.name}`}
                            width={300}
                            height={200}
                            className="mx-auto"
                          />
                        </div>
                        <div className="text-sm break-all">
                          <p>
                            <strong>ID флага:</strong> {tire.model?.brand?.country?.flag?.id}
                          </p>
                          <p>
                            <strong>Имя файла:</strong> {tire.model?.brand?.country?.flag?.filename_download}
                          </p>
                          <p>
                            <strong>URL:</strong> {getFlagUrl(tire)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p>Флаг отсутствует</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="json" className="mt-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-[500px]">
                  <pre className="text-xs">{formatJson(apiResponse)}</pre>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-gray-500">
        <p>Используйте эту страницу для отладки API-ответов и проверки структуры данных.</p>
        <p className="mt-2">
          <strong>Пример ID товара:</strong> 0026deb60ec86748155a1ff69db0ce2e13b4415ceda261ac0efbf3ab32631536
        </p>
      </div>
    </div>
  )
}
