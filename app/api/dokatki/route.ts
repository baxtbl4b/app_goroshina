import { type NextRequest, NextResponse } from "next/server"
import { getCRMToken } from "../crm/login/route"

// CRM API configuration
const CRM_API_BASE_URL = "https://crm.tireshop.ru/api"

export async function GET(request: NextRequest) {
  try {
    // Get authentication token
    const token = await getCRMToken()

    if (!token) {
      return NextResponse.json(
        {
          error: "Failed to authenticate with CRM",
        },
        { status: 401 }
      )
    }

    // Fetch dokatki data from CRM
    const response = await fetch(`${CRM_API_BASE_URL}/feed/get/4`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      console.error(`CRM API failed: ${response.status}`)
      return NextResponse.json(
        {
          error: "Failed to fetch dokatki data from CRM",
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Filter only items with "докатка" in title
    const dokatki = data.member.filter((item: any) =>
      item.title && item.title.toLowerCase().includes("докатка")
    )

    return NextResponse.json({
      totalItems: dokatki.length,
      items: dokatki,
    })
  } catch (error) {
    console.error("Error in dokatki route:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    )
  }
}
