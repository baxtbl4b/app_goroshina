import { type NextRequest, NextResponse } from "next/server"

// Храним токен на сервере, а не на клиенте
const API_TOKEN = "KYf-JMMTweMWASr-zktunkLwnPKfzeIO"
const API_BASE_URL = "https://api.fxcode.ru"

export async function GET(request: NextRequest) {
  try {
    // Формируем запрос для получения одной шины (для тестирования API)
    const directusParams = new URLSearchParams()

    // Запрашиваем все поля
    directusParams.append("fields[]", "*")

    // Ограничиваем результат одной записью
    directusParams.append("limit", "1")

    // Добавляем токен доступа
    directusParams.append("access_token", API_TOKEN)

    // Формируем URL для запроса к Directus
    const apiUrl = `${API_BASE_URL}/items/tires?${directusParams.toString()}`

    console.log(`Fetching test tire from Directus API: ${apiUrl}`)

    // Выполняем запрос к API
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Кэширование на 60 секунд
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API error (${response.status}): ${errorText}`)
      throw new Error(`API request failed with status ${response.status}: ${errorText}`)
    }

    const data = await response.json()

    // Добавляем логирование для проверки структуры ответа
    console.log("API response structure:", JSON.stringify(data, null, 2))

    // Возвращаем данные клиенту
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching test tire from Directus API:", error)

    // Возвращаем ошибку клиенту
    return NextResponse.json({ error: "Failed to fetch test tire from API", details: error.message }, { status: 500 })
  }
}
