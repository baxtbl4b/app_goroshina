export type Season = "s" | "w" | "a"

export interface Tire {
  id: string
  name: string
  article?: string
  price?: number
  image?: string
  width: number | string
  height: number | string
  diameter?: string
  diam: number | string
  season: Season
  runflat?: boolean
  spike?: boolean
  stock?: number
  brand: string
  model?: string
  item_day?: boolean
  country?: string
  country_code?: string
  load_index?: number | string
  speed_index?: number | string
  rrc?: number
  status?: string
  suv?: boolean
  year?: number
  truck?: boolean
  cargo?: boolean
  storehouse?: Record<string, number>
  providers?: Record<string, { id?: string; quantity?: number; price?: number; rrc?: number; opt?: number; purchase?: number }>
  provider?: string
}

export interface TireDimensions {
  widths: string[]
  heights: string[]
  diameters: string[]
}

// Function to transform API data to application format
// Add default values for fields that might be missing in the API response
function transformApiData(apiTires: any[]): Tire[] {
  return apiTires.map((tire) => {
    // Generate a price based on size if it's missing
    const width = Number(tire.width || 205)
    const height = Number(tire.height || 55)
    const diam = Number(tire.diam || 16)
    const generatedPrice = 7000 + width * 10 + height * 5 + diam * 300

    // Determine the image based on season
    const seasonImage = getSeasonImage(normalizeSeason(tire.season))

    // Generate an article number if it's missing
    // const article = tire.article || `T${Date.now().toString().slice(-5)}`

    // Handle the model field - it could be an object or just a string
    const modelField = tire.model
    let imageField = tire.image

    // If the API returns model as an object with an image property
    if (tire.model && typeof tire.model === "object" && tire.model.image) {
      imageField = tire.model.image
    }

    return {
      id: tire.id || `api-${Date.now()}`,
      name:
        tire.name ||
        `${tire.brand || "Бренд"} ${tire.model || "Модель"} ${tire.width || ""}/${tire.height || ""} R${tire.diam || ""}`,
      // Удаляем генерацию article, так как мы будем использовать id
      // article,
      price: tire.price || generatedPrice,
      image: imageField || seasonImage,
      width: tire.width || "205",
      height: tire.height || "55",
      diameter: tire.diam?.toString() || "16",
      diam: tire.diam || "16",
      season: normalizeSeason(tire.season),
      runflat: tire.runflat || false,
      spike: tire.spike || false,
      stock: tire.stock || 10,
      brand: tire.brand || "Неизвестный бренд",
      model: modelField || "Стандартная модель",
      country: tire.country || getBrandCountry(tire.brand),
      country_code: tire.country_code || getBrandCountryCode(tire.brand),
      load_index: tire.load_index || "91",
      speed_index: tire.speed_index || "T",
      rrc: tire.rrc || Math.round(generatedPrice * 1.15),
      item_day: tire.item_day || false,
      status: tire.status || "published",
      suv: tire.suv || false,
      year: tire.year || new Date().getFullYear(),
      truck: tire.truck || false,
      cargo: tire.cargo || false,
    }
  })
}

// Function to normalize the season value
function normalizeSeason(season: string): Season {
  if (!season) return "w" // Default to winter

  const lowerSeason = season?.toLowerCase()

  if (lowerSeason === "w" || lowerSeason === "winter" || lowerSeason === "зима") {
    return "w"
  } else if (lowerSeason === "s" || lowerSeason === "summer" || lowerSeason === "лето") {
    return "s"
  } else if (lowerSeason === "a" || lowerSeason === "all-season" || lowerSeason === "всесезонные") {
    return "a"
  }

  // If we couldn't determine the season, return the original value or default to winter
  return (lowerSeason as Season) || "w"
}

function getSeasonImage(season: Season): string {
  switch (season) {
    case "w":
      return "/images/winter-tire-new.png"
    case "a":
      return "/images/all-season-new.png"
    default:
      return "/images/summer-tire-new.png"
  }
}

// Улучшим функцию getTires для более надежной обработки ошибок
export async function getTires(filters: Record<string, any>): Promise<Tire[]> {
  try {
    // Create query parameters
    const queryParams = new URLSearchParams()

    // Add all filters to the query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          // Handle array values (e.g., multiple widths)
          value.forEach((v) => {
            queryParams.append(`${key}[]`, v.toString())
          })
        } else {
          queryParams.append(key, value.toString())
        }
      }
    })

    // Make the request to our proxy API
    const endpoint = `/api/tires?${queryParams.toString()}`
    console.log(`Fetching tires from proxy API: ${endpoint}`)

    try {
      // Add a timeout to the fetch request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

      const response = await fetch(endpoint, {
        signal: controller.signal,
        cache: "no-store", // Disable caching to avoid stale data
      })

      clearTimeout(timeoutId)

      // Проверяем, что ответ получен успешно
      if (!response.ok) {
        const errorText = await response.text()
        console.warn(`API request failed with status ${response.status}: ${errorText}`)
        console.log("Falling back to mock data due to API error")
        return getMockTires(filters)
      }

      const apiResponse = await response.json()

      // Проверяем, есть ли флаг для использования тестовых данных
      if (apiResponse.usedMockData) {
        console.log("API returned usedMockData flag")
        return apiResponse.data || getMockTires(filters)
      }

      // Get the data from the response (handle different response formats)
      const tiresData = apiResponse.data || apiResponse.items || apiResponse

      if (!Array.isArray(tiresData)) {
        console.warn("API response is not an array:", tiresData)
        console.log("Falling back to mock data due to invalid response format")
        return getMockTires(filters)
      }

      // If the array is empty, use mock data
      if (tiresData.length === 0) {
        console.log("API returned empty array, using mock data")
        return getMockTires(filters)
      }

      console.log(`Received ${tiresData.length} tires from API`)
      return tiresData
    } catch (fetchError) {
      console.warn("Fetch error, using mock data instead:", fetchError)
      return getMockTires(filters)
    }
  } catch (error) {
    console.warn("Failed to fetch tires from API, using mock data instead:", error)
    // Use mock data as a fallback
    return getMockTires(filters)
  }
}

// Function to get mock data (keep as a fallback)
function getMockTires(filters: Record<string, any>): Tire[] {
  // Your existing mock data logic
  console.log("Using mock data for filters:", filters)

  // Base set of tires
  const mockTires: Tire[] = [
    // Winter tires 205/55R16
    {
      id: "test-205-55-16-winter-1",
      name: "Continental WinterContact TS 870 205/55 R16",
      article: "T00203",
      price: 10500,
      image: "/images/winter-tire-new.png",
      width: "205",
      height: "55",
      diameter: "16",
      diam: "16",
      season: "w",
      runflat: false,
      spike: false,
      stock: 12,
      brand: "Continental",
      model: "WinterContact TS 870",
      country: "Germany",
      country_code: "DE",
      load_index: "91",
      speed_index: "H",
      rrc: 12075,
    },
    // Add other mock data as needed
  ]

  // Filter tires by season
  let result = mockTires.filter((tire) => tire.season === filters.season)

  // Check if a specific size is requested
  const requestedWidth = filters.width
  const requestedHeight = filters.height || filters.profile
  const requestedDiameter = filters.diam || filters.diameter

  // If a specific size is requested, check if we have tires of that size
  if (requestedWidth && requestedHeight && requestedDiameter) {
    // Normalize the diameter (remove 'R' if it's at the beginning)
    const normalizedDiameter = requestedDiameter.toString().replace(/^R/i, "")

    // Check if we have tires of the requested size
    const hasRequestedSize = result.some((tire) => {
      // Normalize the tire diameter
      const tireDiameter = (tire.diam || tire.diameter).toString().replace(/^R/i, "")

      return (
        tire.width.toString() === requestedWidth &&
        tire.height.toString() === requestedHeight &&
        tireDiameter === normalizedDiameter
      )
    })

    // If we don't have tires of the requested size, generate them
    if (!hasRequestedSize) {
      console.log(`Generating mock tires for size ${requestedWidth}/${requestedHeight}R${normalizedDiameter}`)
      const generatedTires = generateMockTires(requestedWidth, requestedHeight, normalizedDiameter, filters.season)

      // Add the generated tires to the result
      result = [...result, ...generatedTires]
    }
  }

  console.log(`Using mock data: ${result.length} tires for season ${filters.season}`)
  return result
}

// Function to generate tires of a specific size (fallback)
function generateMockTires(width: string, height: string, diameter: string, season: Season): Tire[] {
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
  }

  // Generate 4-6 tires of the specified size
  const count = 4 + Math.floor(Math.random() * 3) // 4-6 tires
  const result: Tire[] = []

  for (let i = 0; i < count; i++) {
    const brandIndex = i % brands.length
    const brand = brands[brandIndex]
    const model = models[brandIndex]

    // Generate a price based on the size (larger sizes are more expensive)
    const basePrice = 7000 + Number.parseInt(width) * 10 + Number.parseInt(height) * 5 + Number.parseInt(diameter) * 300
    const price = Math.round((basePrice + Math.random() * 3000) / 100) * 100

    // Generate a random stock level
    const stock = Math.floor(Math.random() * 15) + 1

    // Determine if the tire is studded (only for winter tires)
    const spike = season === "w" ? Math.random() > 0.5 : false

    // Determine if the tire is RunFlat
    const runflat = Math.random() > 0.8

    // Generate a unique ID
    const id = `dynamic-${season}-${width}-${height}-${diameter}-${i}`

    // Generate an article number
    const article = `T${10000 + Number.parseInt(width) + Number.parseInt(height) + Number.parseInt(diameter) + i}`

    // Create the tire
    result.push({
      id,
      name: `${brand} ${model} ${width}/${height} R${diameter}`,
      article,
      price,
      image: imagePath,
      width,
      height,
      diameter,
      diam: diameter, // For compatibility
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
      rrc: Math.round((price * 1.15) / 100) * 100,
      item_day: i === 0, // The first tire will be the item of the day
    })
  }

  return result
}

// Helper functions
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

// Function to get unique season values
export async function getSeasonValues(): Promise<string[]> {
  try {
    const response = await fetch("/api/season-values")

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data.seasonValues || []
  } catch (error) {
    console.warn("Failed to fetch season values from API:", error)
    return ["w", "s", "a"] // Return default values
  }
}

export async function getTireDimensions(): Promise<TireDimensions> {
  try {
    // Make a request to the API through our proxy
    console.log("Fetching tire dimensions from API")
    const response = await fetch("/api/dimensions")

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const apiResponse = await response.json()

    return {
      widths: apiResponse.widths || [],
      heights: apiResponse.heights || [],
      diameters: apiResponse.diameters || [],
    }
  } catch (error) {
    console.warn("Failed to fetch tire dimensions from API, using mock data instead:", error)

    // Mock implementation - replace with actual API call
    return {
      widths: ["175", "185", "195", "205", "215", "225", "235", "245", "255", "265", "275"],
      heights: ["40", "45", "50", "55", "60", "65", "70", "75"],
      diameters: ["15", "16", "17", "18", "19", "20", "21"],
    }
  }
}

export async function getTireBrands(): Promise<string[]> {
  try {
    // Make a request to the API through our proxy
    console.log("Fetching tire brands from API")
    const response = await fetch("/api/brands")

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const apiResponse = await response.json()

    return apiResponse.brands || []
  } catch (error) {
    console.warn("Failed to fetch tire brands from API, using mock data instead:", error)

    // Mock implementation - replace with actual API call
    return [
      "Michelin",
      "Continental",
      "Bridgestone",
      "Pirelli",
      "Goodyear",
      "Nokian",
      "Yokohama",
      "Dunlop",
      "Hankook",
      "Toyo",
    ]
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(price)
}
