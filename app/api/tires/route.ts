import { type NextRequest, NextResponse } from "next/server"

// Tirebase API configuration
const API_BASE_URL = "https://api.tirebase.ru"
const API_VERSION = "v3"
const API_TOKEN = "xN6JxoibNEbSFt952_O5kf-VxL61lOX4k5KAS-iGlBU"

type Season = "w" | "s" | "a"

// Improve error handling in the GET function
export async function GET(request: NextRequest) {
  try {
    // Get the query parameters
    const { searchParams } = new URL(request.url)

    // Create a new URLSearchParams object for the API request
    const apiParams = new URLSearchParams()

    // Season filter
    const season = searchParams.get("season")
    if (season) {
      apiParams.append("season", season)
    }

    // Width filter
    const width = searchParams.get("width")
    if (width) {
      apiParams.append("width", width)
    }

    // Height/profile filter
    const height = searchParams.get("height") || searchParams.get("profile")
    if (height) {
      apiParams.append("height", height)
    }

    // Diameter filter
    const diameter = searchParams.get("diameter") || searchParams.get("diam")
    if (diameter) {
      apiParams.append("diam", diameter)
    }

    // Brand filter
    const brand = searchParams.get("brand")
    if (brand) {
      apiParams.append("brand", brand)
    }

    // Model filter
    const model = searchParams.get("model")
    if (model) {
      apiParams.append("model", model)
    }

    // Spike filter
    const spikeParam = searchParams.get("spike")
    if (spikeParam !== null) {
      // Tirebase API expects boolean value
      apiParams.append("spike", spikeParam === "true" ? "true" : "false")
      console.log(`Applying spike filter: ${spikeParam}`)
    }

    // Runflat filter
    const runflat = searchParams.get("runflat")
    if (runflat !== null) {
      apiParams.append("runflat", runflat === "true" ? "true" : "false")
      console.log(`Applying runflat filter: ${runflat}`)
    }

    // Cargo filter
    const cargo = searchParams.get("cargo")
    if (cargo !== null) {
      apiParams.append("cargo", cargo === "true" ? "true" : "false")
      console.log(`Applying cargo filter: ${cargo}`)
    }

    // SUV filter (if needed)
    const suv = searchParams.get("suv")
    if (suv !== null) {
      apiParams.append("suv", suv === "true" ? "true" : "false")
    }

    // Load index filter
    const loadIndex = searchParams.get("load_index")
    if (loadIndex) {
      apiParams.append("load_index", loadIndex)
    }

    // Speed index filter
    const speedIndex = searchParams.get("speed_index")
    if (speedIndex) {
      apiParams.append("speed_index", speedIndex)
    }

    // Add access token
    apiParams.append("access_token", API_TOKEN)

    // Add fields parameter to get additional data including images, flags, country and provider
    apiParams.append("fields", "image,flag,country,provider")

    // Construct the API URL
    const apiUrl = `${API_BASE_URL}/${API_VERSION}/tires?${apiParams.toString()}`

    console.log(`Fetching from API: ${apiUrl}`)

    // Set a timeout for the request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 seconds timeout

    try {
      // Make the request to the API
      const response = await fetch(apiUrl, {
        signal: controller.signal,
        next: { revalidate: 60 }, // Cache for 60 seconds
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API error (${response.status}): ${errorText}`)
        // Return mock data instead of throwing an error
        console.log("Returning mock data due to API error")
        return NextResponse.json({
          data: getMockTiresForApi(season as Season, width, height, diameter),
          usedMockData: true,
        })
      }

      const responseData = await response.json()

      // Log the response structure for debugging
      console.log("API response structure:", JSON.stringify(responseData, null, 2).substring(0, 500) + "...")

      // Extract tires array from response
      const tiresData = responseData.tires || responseData

      console.log("Tires count:", Array.isArray(tiresData) ? tiresData.length : 0)

      // Check if response is valid array
      if (!Array.isArray(tiresData)) {
        console.log("API response is not an array, using mock data")
        return NextResponse.json({
          data: getMockTiresForApi(season as Season, width, height, diameter),
          usedMockData: true,
        })
      }

      // If the API returned an empty array, return mock data
      if (tiresData.length === 0) {
        console.log("API returned empty data, using mock data")
        return NextResponse.json({
          data: getMockTiresForApi(season as Season, width, height, diameter),
          usedMockData: true,
        })
      }

      // Transform the Tirebase API data to match our application's structure
      const transformedData = tiresData.map((tire: any) => {
        console.log(`Processing tire ID: ${tire.id}`)

        // Generate tire name from fields
        const tireName = tire.title || `${tire.brand || "Unknown"} ${tire.model || "Model"} ${tire.width || ""}/${tire.height || ""} R${tire.diam || ""}`

        // Use image from API if available, otherwise use season-based image
        // Check if image is already a full URL or just an ID
        let imageUrl = getSeasonImage(tire.season) // default fallback
        if (tire.image) {
          if (tire.image.startsWith("http")) {
            // Image is already a full URL
            imageUrl = tire.image
          } else if (tire.image.length > 0) {
            // Image is an ID, construct the URL
            imageUrl = `${API_BASE_URL}/assets/${tire.image}?access_token=${API_TOKEN}`
          }
        }

        // Process flag URL the same way as image
        let flagUrl = null
        if (tire.flag) {
          if (tire.flag.startsWith("http")) {
            // Flag is already a full URL
            flagUrl = tire.flag
          } else if (tire.flag.length > 0) {
            // Flag is an ID, construct the URL
            flagUrl = `${API_BASE_URL}/assets/${tire.flag}?access_token=${API_TOKEN}`
          }
        }

        const basePrice = tire.price || calculatePriceFromDimensions(tire.width, tire.height, tire.diam)

        return {
          id: tire.id,
          name: tireName,
          price: basePrice,
          image: imageUrl,
          flag: flagUrl,
          width: tire.width?.toString() || "",
          height: tire.height?.toString() || "",
          diameter: tire.diam?.toString() || "",
          diam: tire.diam?.toString() || "",
          season: tire.season,
          runflat: tire.runflat || false,
          spike: tire.spike || false,
          cargo: tire.cargo || false,
          suv: tire.suv || false,
          stock: tire.quantity || 10,
          brand: tire.brand || "Unknown Brand",
          model: tire.model || "Standard Model",
          country: tire.country || "Unknown",
          country_code: tire.country_code || "UN",
          load_index: tire.load_index || "91",
          speed_index: tire.speed_index || "T",
          rrc: Math.round(basePrice * 1.15),
          item_day: tire.item_day || false,
          year: tire.year,
          now: tire.now,
          provider: tire.provider || null,
        }
      })

      console.log(`Transformed ${transformedData.length} tires`)

      return NextResponse.json({ data: transformedData })
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error("Fetch error:", fetchError)
      // Return mock data instead of throwing an error
      console.log("Returning mock data due to fetch error")
      return NextResponse.json({
        data: getMockTiresForApi(season as Season, width, height, diameter),
        usedMockData: true,
      })
    }
  } catch (error) {
    console.error("Error in API route:", error)

    // Return mock data instead of an error
    console.log("Returning mock data due to general error")
    return NextResponse.json({
      data: getMockTiresForApi("w", null, null, null), // Default to winter tires
      usedMockData: true,
    })
  }
}

// Add a helper function to generate mock tires directly in the API route
function getMockTiresForApi(
  season: Season,
  width: string | null,
  height: string | null,
  diameter: string | null,
): any[] {
  console.log(`Generating mock tires for season: ${season}, size: ${width}/${height}R${diameter}`)

  // Define brands and models based on the season
  const brands = ["Michelin", "Continental", "Bridgestone", "Pirelli", "Goodyear", "Nokian", "Yokohama", "Dunlop"]

  let models: string[]
  let imagePath: string

  if (season === "w") {
    models = [
      "X-Ice Snow",
      "WinterContact TS 870",
      "Blizzak LM005",
      "Ice Zero FR",
      "UltraGrip Ice 2",
      "Hakkapeliitta 10",
      "iceGuard iG70",
      "Winter Sport 5",
    ]
    imagePath = "/images/winter-tire-new.png"
  } else if (season === "a") {
    models = [
      "CrossClimate 2",
      "AllSeasonContact",
      "Weather Control A005",
      "Cinturato All Season",
      "Vector 4Seasons Gen-3",
      "Weatherproof 2",
      "BluEarth-4S AW21",
      "Sport All Season",
    ]
    imagePath = "/images/all-season-new.png"
  } else {
    models = [
      "Pilot Sport 4",
      "PremiumContact 6",
      "Turanza T005",
      "P Zero",
      "Eagle F1 Asymmetric 5",
      "Hakka Green 3",
      "Advan Sport V105",
      "Sport Maxx RT 2",
    ]
    imagePath = "/images/summer-tire-new.png"
    season = "s" // Default to summer if season is invalid
  }

  // Use provided dimensions or defaults
  const tireWidth = width || "205"
  const tireHeight = height || "55"
  const tireDiameter = diameter || "16"

  // Generate 8-12 tires
  const count = 8 + Math.floor(Math.random() * 5)
  const result = []

  for (let i = 0; i < count; i++) {
    const brandIndex = i % brands.length
    const brand = brands[brandIndex]
    const model = models[brandIndex]

    // Generate a price based on the size
    const basePrice =
      7000 + Number.parseInt(tireWidth) * 10 + Number.parseInt(tireHeight) * 5 + Number.parseInt(tireDiameter) * 300
    const price = Math.round((basePrice + Math.random() * 3000) / 100) * 100

    // Generate a random stock level
    const stock = Math.floor(Math.random() * 15) + 1

    // Determine if the tire is studded (only for winter tires)
    const spike = season === "w" ? Math.random() > 0.5 : false

    // Determine if the tire is RunFlat
    const runflat = Math.random() > 0.8

    // Generate a unique ID
    const id = `mock-${season}-${tireWidth}-${tireHeight}-${tireDiameter}-${i}-${Date.now()}`

    // Create the tire
    result.push({
      id,
      name: `${brand} ${model} ${tireWidth}/${tireHeight} R${tireDiameter}`,
      price,
      image: imagePath,
      flag: null,
      width: tireWidth,
      height: tireHeight,
      diameter: tireDiameter,
      diam: tireDiameter,
      season,
      runflat,
      spike,
      stock,
      brand,
      model,
      country: getBrandCountry(brand),
      country_code: getBrandCountryCode(brand),
      load_index: getRandomLoadIndex(),
      speed_index: getRandomSpeedIndex(season),
      rrc: Math.round(price * 1.15),
      item_day: i === 0, // The first tire will be the item of the day
      provider: "tireshop", // Default provider for mock data
    })
  }

  return result
}

// Helper functions for mock data
function getBrandCountry(brand: string): string {
  const countries: Record<string, string> = {
    Michelin: "France",
    Continental: "Germany",
    Bridgestone: "Japan",
    Pirelli: "Italy",
    Goodyear: "USA",
    Nokian: "Finland",
    Yokohama: "Japan",
    Dunlop: "UK",
    Hankook: "South Korea",
    Toyo: "Japan",
  }
  return countries[brand] || "Unknown"
}

function getBrandCountryCode(brand: string): string {
  const codes: Record<string, string> = {
    Michelin: "FR",
    Continental: "DE",
    Bridgestone: "JP",
    Pirelli: "IT",
    Goodyear: "US",
    Nokian: "FI",
    Yokohama: "JP",
    Dunlop: "GB",
    Hankook: "KR",
    Toyo: "JP",
  }
  return codes[brand] || "UN"
}

function getRandomLoadIndex(): string {
  const loadIndices = ["91", "92", "93", "94", "95", "96", "97", "98", "99", "100"]
  return loadIndices[Math.floor(Math.random() * loadIndices.length)]
}

function getRandomSpeedIndex(season: Season): string {
  if (season === "w") {
    const winterIndices = ["Q", "R", "T", "H"]
    return winterIndices[Math.floor(Math.random() * winterIndices.length)]
  } else {
    const summerIndices = ["H", "V", "W", "Y", "ZR"]
    return summerIndices[Math.floor(Math.random() * summerIndices.length)]
  }
}

// Helper function to calculate a price based on tire dimensions
function calculatePriceFromDimensions(width: number, height: number, diam: number): number {
  return 7000 + width * 10 + height * 5 + diam * 300
}

// Helper function to get season image path
function getSeasonImage(season: string): string {
  switch (season) {
    case "w":
      return "/images/winter-tire-new.png"
    case "s":
      return "/images/summer-tire-new.png"
    case "a":
      return "/images/all-season-new.png"
    default:
      return "/images/winter-tire-new.png"
  }
}
