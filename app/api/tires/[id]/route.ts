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

    // Construct the API URL
    const apiUrl = `${API_BASE_URL}/${API_VERSION}/tires/${id}?access_token=${API_TOKEN}&fields=image,flag,country,provider`

    console.log(`Fetching tire from API: ${apiUrl}`)

    // Make the request to the API
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    // Check if the response is OK
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`)
      return NextResponse.json({ error: `API request failed with status ${response.status}` }, { status: response.status })
    }

    // Parse the response
    const data = await response.json()

    console.log(`Tire data received:`, data)

    // Return the tire data
    return NextResponse.json({
      tire: data,
    })
  } catch (error) {
    console.error("Error fetching tire from API:", error)
    return NextResponse.json({ error: "Failed to fetch tire data" }, { status: 500 })
  }
}
