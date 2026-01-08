import { NextResponse } from "next/server"

const API_BASE_URL = "https://api.tirebase.ru/api"
const API_TOKEN = "xN6JxoibNEbSFt952_O5kf-VxL61lOX4k5KAS-iGlBU"

export async function GET() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/fitment/brands?access_token=${API_TOKEN}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    )

    if (!response.ok) {
      console.error(`Failed to fetch car brands: ${response.status}`)
      return NextResponse.json({ brands: [] }, { status: 500 })
    }

    const data = await response.json()

    // The API already returns the correct format
    // [{ brand: "BMW", brand_slug: "bmw" }, ...]
    // Transform to our format with name and slug
    const brands = (Array.isArray(data) ? data : []).map((item: any) => ({
      name: item.brand,
      slug: item.brand_slug,
    }))

    return NextResponse.json({ brands })
  } catch (error) {
    console.error("Error fetching car brands:", error)
    return NextResponse.json({ brands: [] }, { status: 500 })
  }
}
