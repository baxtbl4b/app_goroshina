import { NextResponse } from "next/server"

// Store the API token securely on the server
const API_TOKEN = process.env.API_TOKEN || "KYf-JMMTweMWASr-zktunkLwnPKfzeIO"
const API_BASE_URL = "https://api.fxcode.ru"

export async function GET() {
  try {
    // Return mock data directly instead of making the failing API call
    // This is a temporary solution until the API access issue is resolved
    return NextResponse.json({
      brands: [
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
        "Westlake",
        "Kumho",
        "Nexen",
        "Gislaved",
        "Maxxis",
        "Vredestein",
        "Firestone",
        "BFGoodrich",
        "Cooper",
        "Falken",
        "Sailun",
        "Triangle",
        "Ikon Tyres",
        "Cordiant",
        "Nordman",
        "Viatti",
        "Matador",
        "Kama",
        "Amtel",
        "Roadstone",
        "Marshal",
        "Nitto",
        "General Tire",
        "Uniroyal",
        "Barum",
        "Sava",
        "Kleber",
        "Tigar",
        "Laufenn",
        "GT Radial",
        "Achilles",
        "Roadcruza",
        "Landsail",
        "Tracmax",
        "Imperial",
        "Minerva",
        "Premiorri",
        "Tunga",
        "Belshina",
        "Voltyre",
        "Rosava",
        "Aurora",
        "Goodride",
        "Hifly",
        "Infinity",
        "Atturo",
        "Sumitomo",
        "Radar",
      ],
    })

    /* 
    // Original API call code - commented out until API access is fixed
    // Create a new URLSearchParams object for the API request
    const apiParams = new URLSearchParams()

    // Add the access token
    apiParams.append("access_token", API_TOKEN)

    // Construct the API URL
    const brandsUrl = `${API_BASE_URL}/items/brand?${apiParams.toString()}`

    // Make the request to the API
    const response = await fetch(brandsUrl, { next: { revalidate: 3600 } }) // Cache for 1 hour

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    // Parse the response
    const data = await response.json()

    // Extract the brand names
    const brands = data.data?.map((item: any) => item.name) || []

    // Return the brands
    return NextResponse.json({
      brands,
    })
    */
  } catch (error) {
    console.error("Error fetching brands from API:", error)

    // Return mock data as a fallback
    return NextResponse.json({
      brands: [
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
        "Westlake",
        "Kumho",
        "Nexen",
        "Gislaved",
        "Maxxis",
        "Vredestein",
        "Firestone",
        "BFGoodrich",
        "Cooper",
        "Falken",
        "Sailun",
        "Triangle",
        "Ikon Tyres",
        "Cordiant",
        "Nordman",
        "Viatti",
        "Matador",
        "Kama",
        "Amtel",
        "Roadstone",
        "Marshal",
        "Nitto",
        "General Tire",
        "Uniroyal",
        "Barum",
        "Sava",
        "Kleber",
        "Tigar",
        "Laufenn",
        "GT Radial",
        "Achilles",
        "Roadcruza",
        "Landsail",
        "Tracmax",
        "Imperial",
        "Minerva",
        "Premiorri",
        "Tunga",
        "Belshina",
        "Voltyre",
        "Rosava",
        "Aurora",
        "Goodride",
        "Hifly",
        "Infinity",
        "Atturo",
        "Sumitomo",
        "Radar",
      ],
    })
  }
}
