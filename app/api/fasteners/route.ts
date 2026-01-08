import { type NextRequest, NextResponse } from "next/server"
import { getCRMToken } from "../crm/login/route"

// CRM API configuration
const CRM_API_BASE_URL = "https://crm.tireshop.ru/api"

export async function GET(request: NextRequest) {
  try {
    // Get authentication token
    const token = await getCRMToken()

    if (!token) {
      return NextResponse.json(
        {
          data: [],
          error: "Failed to authenticate with CRM",
        },
        { status: 401 }
      )
    }

    // Get the query parameters
    const { searchParams } = new URL(request.url)

    // Category filter (optional)
    const category = searchParams.get("category") // "bolts", "nuts", "valves"

    // Construct the API URL (feed ID 2 is for fasteners)
    const apiUrl = `${CRM_API_BASE_URL}/feed/get/2`

    console.log(`Fetching fasteners from CRM API: ${apiUrl}`)

    // Set a timeout for the request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 seconds timeout

    try {
      // Make the request to the API
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        next: { revalidate: 300 }, // Cache for 5 minutes
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`CRM API error (${response.status}): ${errorText}`)
        return NextResponse.json(
          {
            data: [],
            error: "Failed to fetch fasteners from CRM API",
          },
          { status: response.status }
        )
      }

      const responseData = await response.json()

      console.log(`CRM API returned ${responseData.totalItems || 0} fasteners`)

      // Check if response has member array
      if (!responseData.member || !Array.isArray(responseData.member)) {
        console.log("CRM API response does not have member array")
        return NextResponse.json({
          data: [],
          error: "Invalid CRM API response format",
        })
      }

      // Transform the CRM API data to match our application's structure
      let transformedData = responseData.member
        .filter((item: any) => {
          // Filter only items in stock
          return item.quantity && item.quantity > 0
        })
        .map((item: any) => {
          // Get the first storage location
          const storageKeys = Object.keys(item.storages || {})
          const firstStorageKey = storageKeys[0]
          const storage = firstStorageKey ? item.storages[firstStorageKey] : null

          return {
            id: item.id,
            title: item.title,
            hash: item.hash,
            price: item.price,
            wholesalePrice: item.wholesalePrice,
            avgBuyout: item.avgBuyout,
            stock: item.quantity,
            image: item.params?.image || null,
            params: {
              diameter: item.params?.diam || null,
              step: item.params?.step || null,
              form: item.params?.form || null,
              color: item.params?.color || null,
            },
            category: {
              id: item.category?.id,
              name: item.category?.name,
            },
            storage: storage ? {
              quantity: storage.quantity,
              code: storage.code,
              name: storage.name,
              store: storage.store,
            } : null,
          }
        })

      // Apply category filter if specified
      if (category) {
        const categoryMap: Record<string, string> = {
          bolts: "Болты",
          nuts: "Гайки",
          valves: "Вентиля",
        }

        const categoryName = categoryMap[category.toLowerCase()]
        if (categoryName) {
          transformedData = transformedData.filter(
            (item: any) => item.category.name === categoryName
          )
        }
      }

      console.log(`Transformed ${transformedData.length} fasteners`)

      return NextResponse.json({
        data: transformedData,
        totalItems: responseData.totalItems,
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error("Fetch error:", fetchError)
      return NextResponse.json(
        {
          data: [],
          error: "Failed to fetch fasteners from CRM API",
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error in fasteners API route:", error)
    return NextResponse.json(
      {
        data: [],
        error: "Internal server error",
      },
      { status: 500 }
    )
  }
}
