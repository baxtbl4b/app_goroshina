import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "https://api.tirebase.ru/api"
const API_TOKEN = "xN6JxoibNEbSFt952_O5kf-VxL61lOX4k5KAS-iGlBU"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brandSlug = searchParams.get("brand_slug")

    if (!brandSlug) {
      return NextResponse.json(
        { error: "brand_slug parameter is required" },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${API_BASE_URL}/fitment/models?access_token=${API_TOKEN}&brand_slug=${brandSlug}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    )

    if (!response.ok) {
      console.error(`Failed to fetch car models: ${response.status}`)
      return NextResponse.json({ models: [] }, { status: 500 })
    }

    const data = await response.json()

    // The API returns [{ model: "3 Series", model_slug: "3-series" }, ...]
    // Transform to our format
    const models = (Array.isArray(data) ? data : []).map((item: any) => ({
      name: item.model,
      slug: item.model_slug,
      years: item.years || [], // Get years if available
    }))

    return NextResponse.json({ models })
  } catch (error) {
    console.error("Error fetching car models:", error)
    return NextResponse.json({ models: [] }, { status: 500 })
  }
}
