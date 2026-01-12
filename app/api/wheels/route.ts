import { type NextRequest, NextResponse } from "next/server"

// Remote wheels API configuration
const API_BASE_URL = "http://188.225.83.192:8000"

export async function GET(request: NextRequest) {
  try {
    // Get the query parameters
    const { searchParams } = new URL(request.url)

    // Create a new URLSearchParams object for the API request
    const apiParams = new URLSearchParams()

    // Diameter filter
    const diameter = searchParams.get("diameter") || searchParams.get("diam")
    if (diameter) {
      apiParams.append("diameter", diameter)
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
      apiParams.append("dia", hub)
    }

    // Brand filter
    const brand = searchParams.get("brand")
    if (brand) {
      apiParams.append("brand", brand)
    }

    // Type filter
    const type = searchParams.get("type")
    if (type) {
      apiParams.append("type", type)
    }

    // Construct the API URL
    const apiUrl = `${API_BASE_URL}/api/wheels${apiParams.toString() ? `?${apiParams.toString()}` : ''}`

    console.log(`Fetching wheels from API: ${apiUrl}`)

    // Set a timeout for the request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 seconds timeout

    try {
      // Make the request to the API
      const response = await fetch(apiUrl, {
        signal: controller.signal,
        cache: 'no-store', // Disable cache for development
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

      console.log(`API returned data:`, responseData)

      // Check if response has data property with array
      if (!responseData.data || !Array.isArray(responseData.data)) {
        console.log("API response is not in expected format")
        return NextResponse.json({
          data: [],
          error: "Invalid API response format",
        })
      }

      // Helper function to get delivery time based on provider
      const getDeliveryTime = (provider: string | null): string => {
        if (!provider) return "Забрать сегодня"

        const providerLower = provider.toLowerCase()

        if (providerLower.includes("exlusive") || providerLower.includes("эксклюзив")) {
          return "1-2 дня"
        } else if (providerLower.includes("4tochki") || providerLower.includes("форточки")) {
          return "2-4 дня"
        } else if (providerLower.includes("diskoptimo") || providerLower.includes("дископтимо")) {
          return "2-4 дня"
        } else if (providerLower.includes("shinservice") || providerLower.includes("шинсервис")) {
          return "1-2 дня"
        }

        return "Уточняйте"
      }

      // Transform the new API data to match our application's structure
      const transformedData = responseData.data
        .filter((wheel: any) => {
          // Фильтруем только диски в наличии
          return wheel.stock && wheel.stock > 0
        })
        .map((wheel: any) => {
          const deliveryTime = getDeliveryTime(wheel.provider)

          return {
            id: wheel.id || `wheel-${Math.random()}`,
            name: wheel.title || wheel.name || `${wheel.brand || "Unknown"} ${wheel.model || ""}`,
            title: wheel.title || wheel.name,
            price: wheel.rrc || wheel.price || 5000,
            rrc: wheel.rrc || wheel.price || 5000,
            stock: wheel.stock || 0,
            image: wheel.image || "/images/black-wheel.png",
            brand: wheel.brand || "Unknown",
            model: wheel.model || null,
            diameter: wheel.diameter || 17,
            width: wheel.width || 7,
            pcd: wheel.pcd || "5x114.3",
            et: wheel.et || 40,
            dia: wheel.dia || 66.1,
            type: wheel.type || "cast",
            color: wheel.color || null,
            isPromotional: wheel.is_promotional || false,
            provider: wheel.provider || null,
            storehouse: wheel.storehouse || {},
            deliveryTime: deliveryTime,
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
