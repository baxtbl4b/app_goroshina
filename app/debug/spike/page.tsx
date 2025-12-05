"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Snowflake } from "lucide-react"

export default function DebugSpikePage() {
  const [tires, setTires] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [limit, setLimit] = useState(20)

  async function fetchTires() {
    setLoading(true)
    setError(null)
    try {
      // Используем существующий API endpoint для получения шин
      // Добавляем параметр limit для ограничения количества результатов
      const response = await fetch(`/api/tires?limit=${limit}&season=winter`)

      if (!response.ok) {
        throw new Error(`API вернул ошибку: ${response.status}`)
      }

      const data = await response.json()

      if (data.data && Array.isArray(data.data)) {
        setTires(data.data)
      } else {
        setTires([])
      }
    } catch (err) {
      console.error("Ошибка при получении данных:", err)
      setError(err.message || "Произошла ошибка при получении данных")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTires()
  }, [limit])

  // Фильтрация шин по параметру spike и поисковому запросу
  const filteredTires = tires.filter((tire) => {
    const matchesSearch =
      searchTerm === "" ||
      (tire.brand && tire.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tire.model && tire.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tire.article && tire.article.toLowerCase().includes(searchTerm.toLowerCase()))

    // Возвращаем все шины, если не указан поисковый запрос, иначе фильтруем
    return matchesSearch
  })

  // Группировка шин по значению spike
  const studdedTires = filteredTires.filter((tire) => tire.spike === true)
  const frictionTires = filteredTires.filter((tire) => tire.spike === false)
  const undefinedSpikeTires = filteredTires.filter((tire) => tire.spike === undefined)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Отладка параметра spike в шинах</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Поиск по бренду, модели или артикулу..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setLimit(20)}>20 шин</Button>
          <Button onClick={() => setLimit(50)}>50 шин</Button>
          <Button onClick={() => setLimit(100)}>100 шин</Button>
          <Button onClick={fetchTires} disabled={loading}>
            {loading ? "Загрузка..." : "Обновить"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center">
              <Snowflake className="mr-2 h-5 w-5" />
              Шипованные шины (spike: true)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">Найдено: {studdedTires.length}</p>
            {studdedTires.length > 0 ? (
              <ul className="divide-y">
                {studdedTires.map((tire, index) => (
                  <li key={index} className="py-2">
                    <div className="font-semibold">
                      {tire.brand} {tire.model}
                    </div>
                    <div className="text-sm text-gray-600">Артикул: {tire.article}</div>
                    <div className="text-xs text-gray-500">
                      spike: <span className="font-mono bg-green-100 px-1 rounded">{String(tire.spike)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">Шины с spike: true не найдены</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle>Нешипованные шины (spike: false)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">Найдено: {frictionTires.length}</p>
            {frictionTires.length > 0 ? (
              <ul className="divide-y">
                {frictionTires.slice(0, 10).map((tire, index) => (
                  <li key={index} className="py-2">
                    <div className="font-semibold">
                      {tire.brand} {tire.model}
                    </div>
                    <div className="text-sm text-gray-600">Артикул: {tire.article}</div>
                    <div className="text-xs text-gray-500">
                      spike: <span className="font-mono bg-blue-100 px-1 rounded">{String(tire.spike)}</span>
                    </div>
                  </li>
                ))}
                {frictionTires.length > 10 && (
                  <li className="py-2 text-gray-500 italic">...и еще {frictionTires.length - 10} шин</li>
                )}
              </ul>
            ) : (
              <p className="text-gray-500 italic">Шины с spike: false не найдены</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle>Шины ����ез параметра spike</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">Найдено: {undefinedSpikeTires.length}</p>
            {undefinedSpikeTires.length > 0 ? (
              <ul className="divide-y">
                {undefinedSpikeTires.slice(0, 10).map((tire, index) => (
                  <li key={index} className="py-2">
                    <div className="font-semibold">
                      {tire.brand} {tire.model}
                    </div>
                    <div className="text-sm text-gray-600">Артикул: {tire.article}</div>
                    <div className="text-xs text-gray-500">
                      spike: <span className="font-mono bg-gray-100 px-1 rounded">undefined</span>
                    </div>
                  </li>
                ))}
                {undefinedSpikeTires.length > 10 && (
                  <li className="py-2 text-gray-500 italic">...и еще {undefinedSpikeTires.length - 10} шин</li>
                )}
              </ul>
            ) : (
              <p className="text-gray-500 italic">Шины без параметра spike не найдены</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Статистика:</h2>
        <ul>
          <li>Всего шин загружено: {tires.length}</li>
          <li>
            Шипованные шины (spike: true): {studdedTires.length} (
            {((studdedTires.length / tires.length) * 100 || 0).toFixed(1)}%)
          </li>
          <li>
            Нешипованные шины (spike: false): {frictionTires.length} (
            {((frictionTires.length / tires.length) * 100 || 0).toFixed(1)}%)
          </li>
          <li>
            Шины без параметра spike: {undefinedSpikeTires.length} (
            {((undefinedSpikeTires.length / tires.length) * 100 || 0).toFixed(1)}%)
          </li>
        </ul>
      </div>
    </div>
  )
}
