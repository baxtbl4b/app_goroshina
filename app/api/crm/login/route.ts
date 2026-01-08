import { type NextRequest, NextResponse } from "next/server"

// CRM API configuration
const CRM_API_BASE_URL = "https://crm.tireshop.ru/api"
const CRM_USERNAME = "kuk@goroshina.ru"
const CRM_PASSWORD = "satin2016"

// Token cache to avoid repeated login requests
let tokenCache: {
  token: string
  refreshToken: string
  expiresAt: number
} | null = null

export async function POST(request: NextRequest) {
  try {
    // Make the login request to CRM
    const response = await fetch(`${CRM_API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: CRM_USERNAME,
        password: CRM_PASSWORD,
      }),
    })

    if (!response.ok) {
      console.error(`CRM login failed: ${response.status}`)
      return NextResponse.json(
        {
          error: "Failed to authenticate with CRM",
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Cache the token (expires in ~7 days based on JWT)
    tokenCache = {
      token: data.token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + 6 * 24 * 60 * 60 * 1000, // 6 days
    }

    return NextResponse.json({
      token: data.token,
      refreshToken: data.refresh_token,
    })
  } catch (error) {
    console.error("Error in CRM login route:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    )
  }
}

// Helper function to get a valid token (used by other API routes)
export async function getCRMToken(): Promise<string | null> {
  // Check if we have a valid cached token
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token
  }

  // Token expired or doesn't exist, get a new one
  try {
    const response = await fetch(`${CRM_API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: CRM_USERNAME,
        password: CRM_PASSWORD,
      }),
    })

    if (!response.ok) {
      console.error(`CRM login failed: ${response.status}`)
      return null
    }

    const data = await response.json()

    // Update cache
    tokenCache = {
      token: data.token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + 6 * 24 * 60 * 60 * 1000,
    }

    return data.token
  } catch (error) {
    console.error("Error getting CRM token:", error)
    return null
  }
}
