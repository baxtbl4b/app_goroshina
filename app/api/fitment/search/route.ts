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

    // Split query into words to handle "Brand Model" searches
    const queryWords = lowerQuery.trim().split(/\s+/)
    const firstWord = queryWords[0] || ""
    const remainingWords = queryWords.slice(1).join(" ")

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

    // Filter brands by the first word or full query
    const matchingBrands = (Array.isArray(brandsData) ? brandsData : [])
      .filter((item: any) => {
        const brandLower = item.brand.toLowerCase()
        // Match if brand contains first word OR full query
        return brandLower.includes(firstWord) || brandLower.includes(lowerQuery)
      })
      .slice(0, 5)
      .map((item: any) => ({
        type: "brand" as const,
        name: item.brand,
        slug: item.brand_slug,
      }))

    // Search models in two ways:
    // 1. In brands that match the query (e.g., "Changan" when searching "Changun Uni")
    // 2. In popular brands (including Chinese brands popular in Russia)
    const popularBrands = [
      // Европейские
      "bmw", "mercedes", "audi", "volkswagen", "skoda", "opel", "peugeot", "renault", "citroen", "volvo",
      // Японские
      "toyota", "honda", "nissan", "mazda", "mitsubishi", "subaru", "suzuki", "lexus", "infiniti",
      // Корейские
      "hyundai", "kia", "genesis",
      // Американские
      "ford", "chevrolet", "jeep", "cadillac",
      // Китайские
      "changan", "geely", "haval", "chery", "exeed", "omoda", "tank", "jetour", "jaecoo", "byd", "gac", "faw", "dongfeng", "great-wall", "lifan", "zotye",
      // Российские
      "lada", "uaz", "gaz"
    ]

    // Get brand slugs from matching brands
    const matchingBrandSlugs = matchingBrands.map(b => b.slug)

    // Combine matching brands and popular brands, avoiding duplicates
    const brandsToSearch = [...new Set([...matchingBrandSlugs, ...popularBrands])]

    const modelSearchPromises = brandsToSearch.map(async (brandSlug) => {
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

        // Find the brand name from our data
        const brandInfo = matchingBrands.find(b => b.slug === brandSlug)
        const brandName = brandInfo ? brandInfo.name :
          (Array.isArray(brandsData) ? brandsData : []).find((b: any) => b.brand_slug === brandSlug)?.brand ||
          brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1)

        const models = (Array.isArray(data) ? data : [])
          .filter((item: any) => {
            const modelLower = item.model.toLowerCase()
            // If there are multiple words, search model by remaining words
            // Otherwise search by full query
            if (remainingWords) {
              return modelLower.includes(remainingWords)
            }
            return modelLower.includes(lowerQuery)
          })
          .map((item: any) => ({
            type: "model" as const,
            name: item.model,
            slug: item.model_slug,
            brandName: brandName,
            brandSlug: brandSlug,
            modelLower: item.model.toLowerCase(),
          }))

        // Sort models: prioritize exact matches and those that start with query
        const searchTerm = remainingWords || lowerQuery
        models.sort((a, b) => {
          const aLower = a.modelLower
          const bLower = b.modelLower

          // Exact match (highest priority)
          if (aLower === searchTerm && bLower !== searchTerm) return -1
          if (bLower === searchTerm && aLower !== searchTerm) return 1

          // Starts with search term (second priority)
          const aStarts = aLower.startsWith(searchTerm)
          const bStarts = bLower.startsWith(searchTerm)
          if (aStarts && !bStarts) return -1
          if (bStarts && !aStarts) return 1

          // Word boundary match (third priority) - e.g., "E-Class" for "e-class"
          const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const aWordBoundary = new RegExp(`(^|\\s|-)${escapedTerm}($|\\s|-)`, 'i').test(aLower)
          const bWordBoundary = new RegExp(`(^|\\s|-)${escapedTerm}($|\\s|-)`, 'i').test(bLower)
          if (aWordBoundary && !bWordBoundary) return -1
          if (bWordBoundary && !aWordBoundary) return 1

          return 0
        })

        return models
          .slice(0, 2)
          .map(({ modelLower, ...item }) => item)
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
