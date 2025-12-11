import { type NextRequest, NextResponse } from "next/server"

// Tirebase API configuration
const API_BASE_URL = "https://api.tirebase.ru"
const API_VERSION = "v3"
const API_TOKEN = "xN6JxoibNEbSFt952_O5kf-VxL61lOX4k5KAS-iGlBU"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Tire ID is required" }, { status: 400 })
    }

    console.log(`Fetching tire by ID: ${id}`)

    // Try to fetch using ID filter from Tirebase API
    const apiUrl = `${API_BASE_URL}/${API_VERSION}/tires?access_token=${API_TOKEN}&id=${id}&fields=image,flag,country,provider,storehouse`

    console.log(`API URL: ${apiUrl}`)

    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      console.error(`API error: ${response.status}`)
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 })
    }

    const responseData = await response.json()
    console.log("API response:", JSON.stringify(responseData).substring(0, 500))

    // Extract tires array
    const tiresData = responseData.tires || responseData

    if (!Array.isArray(tiresData) || tiresData.length === 0) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 })
    }

    // Find the tire with matching ID
    const tire = tiresData.find((t: any) => t.id === id) || tiresData[0]

    // Generate name if not present
    const tireName = tire.title || tire.name || `${tire.brand || ""} ${tire.model || ""} ${tire.width || ""}/${tire.height || ""} R${tire.diam || ""}`

    const transformedTire = {
      ...tire,
      name: tireName,
    }

    console.log(`Tire found:`, transformedTire.id, transformedTire.name)

    return NextResponse.json({ tire: transformedTire })
  } catch (error) {
    console.error("Error fetching tire from API:", error)
    return NextResponse.json({ error: "Ошибка при загрузке товара" }, { status: 500 })
  }
}
