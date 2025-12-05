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

    // Add fields to retrieve
    apiParams.append("fields[]", "season")
    apiParams.append("groupBy[]", "season")

    // Construct the API URL
    const url = `${API_BASE_URL}/items/tires?${apiParams.toString()}`

    // Make the request to the API
    const response = await fetch(url, { next: { revalidate: 3600 } }) // Cache for 1 hour

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    // Parse the response
    const data = await response.json()

    // Extract the unique season values
    const seasonValues = data.data?.map((item: any) => item.season) || []

    // Return the season values
    return NextResponse.json({
      seasonValues,
    })
  } catch (error) {
    console.error("Error fetching season values from API:", error)

    // Return default values as a fallback
    return NextResponse.json({
      seasonValues: ["w", "s", "a"],
    })
  }
}
