import { type NextRequest, NextResponse } from "next/server"

// Tirebase API configuration
const API_BASE_URL = "https://api.tirebase.ru"
const API_TOKEN = "xN6JxoibNEbSFt952_O5kf-VxL61lOX4k5KAS-iGlBU"

export async function GET(request: NextRequest) {
  try {
    // Get the query parameters
    const { searchParams } = new URL(request.url)

    // Create a new URLSearchParams object for the API request
    const apiParams = new URLSearchParams()

    // Diameter filter
    const diameter = searchParams.get("diameter") || searchParams.get("diam")
    if (diameter) {
      apiParams.append("diam", diameter)
    }

    // Width filter
    const width = searchParams.get("width")
    if (width) {
      apiParams.append("width", width)
    }

    // PCD filter (bolt pattern)
    const pcd = searchParams.get("pcd")
    if (pcd) {
      apiParams.append("pcd", pcd)
    }

    // ET filter (offset)
    const et = searchParams.get("et")
    if (et) {
      apiParams.append("et", et)
    }

    // CB/DIA filter (center bore)
    const hub = searchParams.get("hub") || searchParams.get("cb")
    if (hub) {
      apiParams.append("cb", hub)
    }

    // Type filter (stamped/cast/forged)
    const type = searchParams.get("type")
    if (type) {
      // Преобразуем тип на английский для API
      let apiType = type
      if (type === "stamped") apiType = "Штампованные"
      else if (type === "cast") apiType = "Литые"
      else if (type === "forged") apiType = "Кованые"
      apiParams.append("type", apiType)
    }

    // Brand filter
    const brand = searchParams.get("brand")
    if (brand) {
      apiParams.append("brand", brand)
    }

    // Add access token
    apiParams.append("access_token", API_TOKEN)

    // Construct the API URL
    const apiUrl = `${API_BASE_URL}/wheels?${apiParams.toString()}`

    console.log(`Fetching wheels from API: ${apiUrl}`)

    // Set a timeout for the request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 seconds timeout

    try {
      // Make the request to the API
      const response = await fetch(apiUrl, {
        signal: controller.signal,
        next: { revalidate: 60 }, // Cache for 60 seconds
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API error (${response.status}): ${errorText}`)
        return NextResponse.json({
          data: [],
          error: "Failed to fetch wheels from API",
        }, { status: response.status })
      }

      const responseData = await response.json()

      console.log(`API returned ${Array.isArray(responseData) ? responseData.length : 0} wheels`)

      // Check if response is valid array
      if (!Array.isArray(responseData)) {
        console.log("API response is not an array")
        return NextResponse.json({
          data: [],
          error: "Invalid API response format",
        })
      }

      // Transform the Tirebase API data to match our application's structure
      const transformedData = responseData.map((wheel: any) => {
        // Генерируем PCD в формате "5x100"
        const pcdFormatted = `${wheel.pn || 5}x${wheel.pcd || 100}`

        // Определяем тип диска на английском
        let wheelType: "stamped" | "cast" | "forged" = "cast"
        if (wheel.type) {
          const typeStr = wheel.type.toLowerCase()
          if (typeStr.includes("штамп") || typeStr.includes("stamp")) {
            wheelType = "stamped"
          } else if (typeStr.includes("кован") || typeStr.includes("forg")) {
            wheelType = "forged"
          }
        }

        return {
          id: wheel.id,
          name: wheel.title || `${wheel.brand || "Unknown"} ${wheel.model || "Model"}`,
          price: wheel.price || wheel.opt || wheel.rrc || 5000,
          rrc: wheel.rrc || Math.round((wheel.price || 5000) * 1.15),
          stock: wheel.quantity || 0,
          image: wheel.image || "/images/black-wheel.png",
          brand: wheel.brand || "Unknown Brand",
          diameter: wheel.diam || 17,
          width: wheel.width || 7,
          pcd: pcdFormatted,
          et: wheel.et || 40,
          dia: wheel.cb || 66.1,
          type: wheelType,
          color: wheel.color || null,
          isPromotional: false,
          provider: wheel.provider || null,
          storehouse: wheel.storehouse || {},
        }
      })

      console.log(`Transformed ${transformedData.length} wheels`)

      return NextResponse.json({ data: transformedData })
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error("Fetch error:", fetchError)
      return NextResponse.json({
        data: [],
        error: "Failed to fetch wheels from API",
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json({
      data: [],
      error: "Internal server error",
    }, { status: 500 })
  }
}
