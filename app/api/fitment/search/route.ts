import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "https://api.tirebase.ru/api"
const API_TOKEN = "xN6JxoibNEbSFt952_O5kf-VxL61lOX4k5KAS-iGlBU"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json({ brands: [], models: [] })
    }

    const lowerQuery = query.toLowerCase()

    // Fetch all brands
    const brandsResponse = await fetch(
      `${API_BASE_URL}/fitment/brands?access_token=${API_TOKEN}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 86400 },
      }
    )

    if (!brandsResponse.ok) {
      return NextResponse.json({ brands: [], models: [] }, { status: 500 })
    }

    const brandsData = await brandsResponse.json()

    // Filter brands by query
    const matchingBrands = (Array.isArray(brandsData) ? brandsData : [])
      .filter((item: any) =>
        item.brand.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 5)
      .map((item: any) => ({
        type: "brand" as const,
        name: item.brand,
        slug: item.brand_slug,
      }))

    // Search models in popular brands
    const popularBrands = ["bmw", "mercedes", "audi", "toyota", "honda", "ford", "volkswagen", "nissan", "hyundai", "kia"]
    const modelSearchPromises = popularBrands.map(async (brandSlug) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/fitment/models?access_token=${API_TOKEN}&brand_slug=${brandSlug}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            next: { revalidate: 86400 },
          }
        )

        if (!response.ok) return []

        const data = await response.json()
        return (Array.isArray(data) ? data : [])
          .filter((item: any) =>
            item.model.toLowerCase().includes(lowerQuery)
          )
          .slice(0, 2)
          .map((item: any) => ({
            type: "model" as const,
            name: item.model,
            slug: item.model_slug,
            brandName: brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1),
            brandSlug: brandSlug,
          }))
      } catch {
        return []
      }
    })

    const modelResults = await Promise.all(modelSearchPromises)
    const matchingModels = modelResults.flat().slice(0, 5)

    return NextResponse.json({
      brands: matchingBrands,
      models: matchingModels,
    })
  } catch (error) {
    console.error("Error in search:", error)
    return NextResponse.json({ brands: [], models: [] }, { status: 500 })
  }
}
