import { type NextRequest, NextResponse } from "next/server"

// Store the API token securely on the server
const API_TOKEN = process.env.API_TOKEN || "KYf-JMMTweMWASr-zktunkLwnPKfzeIO"
const API_BASE_URL = "https://api.fxcode.ru"

export async function GET(request: NextRequest) {
  try {
    // Get the image ID from the query parameters
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get("id")

    if (!imageId) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    // Clean the image ID (remove any curly braces if they exist)
    const cleanImageId = imageId.replace(/{|}/g, "")

    // Construct the URL to the image with the API token
    const imageUrl = `${API_BASE_URL}/assets/${cleanImageId}?access_token=${API_TOKEN}`

    // Redirect to the actual image URL
    return NextResponse.redirect(imageUrl)
  } catch (error) {
    console.error("Error processing image request:", error)
    return NextResponse.json({ error: "Failed to process image request" }, { status: 500 })
  }
}
