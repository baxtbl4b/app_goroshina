"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SpecificTirePage() {
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const specificTireId = "0002735aeacaecf8b22d9dfbd46731f06a06230046b1c77058fb6f800a7eff2a"

  useEffect(() => {
    async function fetchSpecificTire() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/tire-by-article?article=${encodeURIComponent(specificTireId)}`)

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

    fetchSpecificTire()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Данные шины с ID: {specificTireId}</h1>

      {loading && <p className="text-gray-500">Загрузка данных...</p>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {apiResponse && (
        <Card>
          <CardHeader>
            <CardTitle>Результат API запроса</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded overflow-auto max-h-[600px]">
              <pre className="text-xs">{JSON.stringify(apiResponse, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
