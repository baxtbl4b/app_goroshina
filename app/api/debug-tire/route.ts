import { type NextRequest, NextResponse } from "next/server"

// Store the API token securely on the server
const API_TOKEN = process.env.API_TOKEN || "KYf-JMMTweMWASr-zktunkLwnPKfzeIO"
const API_BASE_URL = "https://api.fxcode.ru"

export async function GET(request: NextRequest) {
  try {
    // Get the query parameters
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID parameter is required" }, { status: 400 })
    }

    // Create a new URLSearchParams object for the API request
    const apiParams = new URLSearchParams()

    // Add the ID filter
    apiParams.append("filter[id][_eq]", id)

    // Add the access token
    apiParams.append("access_token", API_TOKEN)

    // Construct the API URL
    const apiUrl = `${API_BASE_URL}/items/tires?${apiParams.toString()}`

    console.log(`Fetching tire with ID ${id} from API: ${apiUrl}`)

    // Make the request to the API
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 }, // Don't cache this request
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API error (${response.status}): ${errorText}`)
      throw new Error(`API request failed with status ${response.status}: ${errorText}`)
    }

    const data = await response.json()

    // Return the raw API response for debugging
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching tire from API:", error)

    // Return an error
    return NextResponse.json({ error: "Failed to fetch tire data from API", details: error.message }, { status: 500 })
  }
}
