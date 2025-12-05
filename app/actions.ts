"use server"

import type { Tire } from "@/lib/api-types"

// Храним токен на сервере
const API_TOKEN = "KYf-JMMTweMWASr-zktunkLwnPKfzeIO"
const API_BASE_URL = "https://api.fxcode.ru"

export async function fetchTires(filters: Record<string, any>): Promise<Tire[]> {
  try {
    // Преобразуем параметры в формат Directus
    const directusParams = new URLSearchParams()

    // Обрабатываем сезон
    if (filters.season) {
      directusParams.append("filter[season][_eq]", filters.season)
    }

    // Обрабатываем ширину
    if (filters.width) {
      directusParams.append("filter[width][_eq]", filters.width)
    }

    // Обрабатываем высоту/профиль
    if (filters.height) {
      directusParams.append("filter[height][_eq]", filters.height)
    }

    // Обрабатываем диаметр
    if (filters.diam || filters.diameter) {
      directusParams.append("filter[diameter][_eq]", filters.diam || filters.diameter)
    }

    // Добавляем токен доступа
    directusParams.append("access_token", API_TOKEN)

    // Формируем URL для запроса к Directus
    const apiUrl = `${API_BASE_URL}/items/tires?${directusParams.toString()}`

    console.log(`Fetching from Directus API: ${apiUrl}`)

    // Выполняем запрос к API
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Кэширование на 60 секунд
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Получаем данные из ответа
    const tiresData = data.data || data.items || data

    if (!Array.isArray(tiresData)) {
      throw new Error("Invalid API response format")
    }

    // Преобразуем данные API в формат приложения
    return transformApiData(tiresData)
  } catch (error) {
    console.error("Error fetching from Directus API:", error)
    // Возвращаем пустой массив или мок-данные
    return []
  }
}

// Функция для преобразования данных API в формат приложения
function transformApiData(apiTires: any[]): Tire[] {
  return apiTires.map((tire) => ({
    id: tire.id || `api-${tire.article}`,
    name: tire.name || `${tire.brand} ${tire.model} ${tire.width}/${tire.height} R${tire.diameter}`,
    article: tire.article,
    price: tire.price,
    // ... остальные поля
  }))
}

export async function getImageUrl(imageId: string | undefined): Promise<string> {
  if (!imageId) return "/images/tire-closeup.jpg"

  // Check if the imageId is already a full URL
  if (imageId.startsWith("http")) return imageId

  // Remove any curly braces if they exist in the imageId
  const cleanImageId = imageId.replace(/{|}/g, "")

  // Log the image ID for debugging
  console.log(`Getting image URL for ID: ${cleanImageId}`)

  // Use the server-side API token
  return `${API_BASE_URL}/assets/${cleanImageId}?access_token=${API_TOKEN}`
}
