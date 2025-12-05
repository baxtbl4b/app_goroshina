import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Отладочные инструменты</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API-ответ</CardTitle>
            <CardDescription>Просмотр полного API-ответа для товара по ID</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/debug/api-response"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Открыть
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Поиск по артикулу</CardTitle>
            <CardDescription>Поиск товара по артикулу (ID)</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/debug/article"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Открыть
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Проверка шипов</CardTitle>
            <CardDescription>Отладка отображения шипованных шин</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/debug/spike"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Открыть
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
