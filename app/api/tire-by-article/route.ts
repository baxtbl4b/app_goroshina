import { NextResponse } from "next/server"

// Константа для токена доступа
const ACCESS_TOKEN = process.env.API_TOKEN || "KYf-JMMTweMWASr-zktunkLwnPKfzeIO"

export async function GET(request: Request) {
  // Получаем параметр article из URL
  const { searchParams } = new URL(request.url)
  const article = searchParams.get("article")

  // Проверяем, что параметр article указан
  if (!article) {
    return NextResponse.json({ error: "Не указан параметр article" }, { status: 400 })
  }

  try {
    console.log(`Поиск шины по артикулу: ${article}`)

    // Формируем запрос к API
    // Используем GraphQL для получения данных о шине по ID
    const apiUrl = "https://api.fxcode.ru/graphql"

    // Определяем поля, которые нам нужны
    // Исправляем запрос, добавляя подполя для image и flag
    const query = `
      query {
        tires(filter: { id: { _eq: "${article}" } }) {
          id
          season
          spike
          runflat
          cargo
          model {
            id
            name
            image {
              id
              filename_download
            }
            brand {
              id
              name
              country {
                id
                name
                flag {
                  id
                  filename_download
                }
              }
            }
          }
          width {
            id
            name
          }
          height {
            id
            name
          }
          diam {
            id
            name
          }
          load_index {
            id
            name
            description
          }
          speed_index {
            id
            name
            description
          }
        }
      }
    `

    // Выполняем запрос к API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    })

    // Проверяем статус ответа
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API error (${response.status}): ${errorText}`)
      return NextResponse.json({ error: `API error (${response.status}): ${errorText}` }, { status: response.status })
    }

    // Получаем данные из ответа
    const data = await response.json()

    // Проверяем наличие ошибок в ответе GraphQL
    if (data.errors) {
      console.error("GraphQL errors:", data.errors)
      return NextResponse.json({ errors: data.errors }, { status: 400 })
    }

    // ��озвращаем данные
    return NextResponse.json(data)
  } catch (error) {
    // Обрабатываем ошибки
    console.error("Error fetching tire data:", error)
    return NextResponse.json(
      { error: `Ошибка при получении данных: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
