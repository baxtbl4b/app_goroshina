import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "https://api.tirebase.ru/api"
const API_TOKEN = "xN6JxoibNEbSFt952_O5kf-VxL61lOX4k5KAS-iGlBU"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brandSlug = searchParams.get("brand_slug")
    const modelSlug = searchParams.get("model_slug")
    const year = searchParams.get("year")

    if (!brandSlug || !modelSlug || !year) {
      return NextResponse.json(
        { error: "brand_slug, model_slug, and year parameters are required" },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${API_BASE_URL}/fitment/specs?access_token=${API_TOKEN}&brand_slug=${brandSlug}&model_slug=${modelSlug}&year=${year}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    )

    if (!response.ok) {
      console.error(`Failed to fetch fitment data: ${response.status}`)
      return NextResponse.json(
        { error: "Failed to fetch fitment data" },
        { status: 500 }
      )
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching fitment data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
