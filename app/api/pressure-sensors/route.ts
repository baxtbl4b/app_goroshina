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

    // Construct the API URL (feed ID 3 is for pressure sensors)
    const apiUrl = `${CRM_API_BASE_URL}/feed/get/3`

    console.log(`Fetching pressure sensors from CRM API: ${apiUrl}`)

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
            error: "Failed to fetch pressure sensors from CRM API",
          },
          { status: response.status }
        )
      }

      const responseData = await response.json()

      console.log(`CRM API returned ${responseData.totalItems || 0} pressure sensors`)

      // Check if response has member array
      if (!responseData.member || !Array.isArray(responseData.member)) {
        console.log("CRM API response does not have member array")
        return NextResponse.json({
          data: [],
          error: "Invalid CRM API response format",
        })
      }

      // Transform the CRM API data to match our application's structure
      const transformedData = responseData.member
        .filter((item: any) => {
          // Filter only items in stock
          return item.quantity && item.quantity > 0
        })
        .map((item: any) => {
          // Calculate total stock across all storages
          const storages = item.storages || {}
          const storageList = Object.values(storages) as any[]
          const totalStock = storageList.reduce((sum: number, s: any) => sum + (s.quantity || 0), 0)

          // Get brand from title
          let brand = "Universal"
          if (item.title?.toLowerCase().includes("sulit")) {
            brand = "Sulit"
          } else if (item.title?.toLowerCase().includes("bhsens")) {
            brand = "BHsens"
          } else if (item.title?.toLowerCase().includes("huf")) {
            brand = "HUF"
          }

          return {
            id: `sensor-${item.id}`,
            crmId: item.id,
            name: item.title,
            brand: brand,
            hash: item.hash,
            price: item.price,
            wholesalePrice: item.wholesalePrice,
            avgBuyout: item.avgBuyout,
            stock: totalStock,
            image: item.params?.image || "/images/sensor-placeholder.png",
            description: `Универсальный датчик давления ${brand}. Подходит для большинства автомобилей.`,
            compatibility: ["Универсальный"],
            category: {
              id: item.category?.id,
              name: item.category?.name,
            },
            storages: storageList.map((s: any) => ({
              quantity: s.quantity,
              code: s.code,
              name: s.name,
              store: s.store,
            })),
          }
        })

      console.log(`Transformed ${transformedData.length} pressure sensors`)

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
          error: "Failed to fetch pressure sensors from CRM API",
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error in pressure sensors API route:", error)
    return NextResponse.json(
      {
        data: [],
        error: "Internal server error",
      },
      { status: 500 }
    )
  }
}
