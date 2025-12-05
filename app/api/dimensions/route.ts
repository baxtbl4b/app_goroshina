import { NextResponse } from "next/server"

// Store the API token securely on the server
const API_TOKEN = process.env.API_TOKEN || "KYf-JMMTweMWASr-zktunkLwnPKfzeIO"
const API_BASE_URL = "https://api.fxcode.ru"

export async function GET() {
  try {
    // Create a new URLSearchParams object for the API request
    const apiParams = new URLSearchParams()

    // Add the access token
    apiParams.append("access_token", API_TOKEN)

    // Construct the API URLs for each dimension
    const widthsUrl = `${API_BASE_URL}/items/width?${apiParams.toString()}`
    const heightsUrl = `${API_BASE_URL}/items/height?${apiParams.toString()}`
    const diametersUrl = `${API_BASE_URL}/items/diam?${apiParams.toString()}`

    // Make parallel requests to the API
    const [widthsResponse, heightsResponse, diametersResponse] = await Promise.all([
      fetch(widthsUrl, { next: { revalidate: 3600 } }), // Cache for 1 hour
      fetch(heightsUrl, { next: { revalidate: 3600 } }),
      fetch(diametersUrl, { next: { revalidate: 3600 } }),
    ])

    // Check if all responses are OK
    if (!widthsResponse.ok || !heightsResponse.ok || !diametersResponse.ok) {
      throw new Error("One or more API requests failed")
    }

    // Parse the responses
    const widthsData = await widthsResponse.json()
    const heightsData = await heightsResponse.json()
    const diametersData = await diametersResponse.json()

    // Extract the dimension values
    const widths = widthsData.data?.map((item: any) => item.name) || []
    const heights = heightsData.data?.map((item: any) => item.name) || []
    const diameters = diametersData.data?.map((item: any) => item.name) || []

    // Return the dimensions
    return NextResponse.json({
      widths,
      heights,
      diameters,
    })
  } catch (error) {
    console.error("Error fetching dimensions from API:", error)

    // Return mock data as a fallback
    return NextResponse.json({
      widths: ["175", "185", "195", "205", "215", "225", "235", "245", "255", "265", "275"],
      heights: ["40", "45", "50", "55", "60", "65", "70", "75"],
      diameters: ["15", "16", "17", "18", "19", "20", "21"],
    })
  }
}
