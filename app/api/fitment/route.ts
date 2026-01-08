import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "https://api.tirebase.ru/api"
const API_TOKEN = "xN6JxoibNEbSFt952_O5kf-VxL61lOX4k5KAS-iGlBU"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brandSlug = searchParams.get("brand_slug")
    const modelSlug = searchParams.get("model_slug")
    const year = searchParams.get("year")

    if (!brandSlug || !modelSlug || !year) {
      return NextResponse.json(
        { error: "brand_slug, model_slug, and year parameters are required" },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${API_BASE_URL}/fitment?access_token=${API_TOKEN}&brand_slug=${brandSlug}&model_slug=${modelSlug}&year=${year}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    )

    if (!response.ok) {
      console.error(`Failed to fetch fitment data: ${response.status}`)
      return NextResponse.json(
        { error: "Failed to fetch fitment data" },
        { status: 500 }
      )
    }

    const data = await response.json()

    // Если это массив (ответ для fitment), извлекаем данные крепежа из первого элемента
    if (Array.isArray(data) && data.length > 0) {
      const firstFitment = data[0]

      // Парсим thread_size: "Lug bolts M14 x 1.5" -> { type: "bolt", thread: "14x1.5" }
      let fastenerType = null
      let threadSize = null

      if (firstFitment.thread_size) {
        const threadStr = firstFitment.thread_size.toLowerCase()

        // Определяем тип крепежа
        // "Lug bolts M14 x 1.5" -> bolt
        // "Lug nuts M12 x 1.5" -> nut
        // "M12 x 1.5" (без указания) -> nut (по умолчанию гайки)
        if (threadStr.includes("bolt")) {
          fastenerType = "bolt"
        } else {
          // Если не указано "bolt", значит гайки (nut)
          fastenerType = "nut"
        }

        // Извлекаем размер резьбы: M14 x 1.5 -> 14x1.5
        const threadMatch = firstFitment.thread_size.match(/M?(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/i)
        if (threadMatch) {
          threadSize = `${threadMatch[1]}x${threadMatch[2]}`
        }
      }

      return NextResponse.json({
        ...firstFitment,
        // Добавляем распарсенные данные для крепежа
        fastener: {
          type: fastenerType,
          thread: threadSize,
          raw: firstFitment.thread_size
        },
        // Возвращаем также полный массив для других целей
        allFitments: data
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching fitment data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
