import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const diskId = params.id

    if (!diskId) {
      return NextResponse.json(
        { error: "Disk ID is required" },
        { status: 400 }
      )
    }

    // Fetch all disks from the wheels API
    const baseUrl = request.nextUrl.origin
    const wheelsResponse = await fetch(`${baseUrl}/api/wheels`, {
      cache: 'no-store',
    })

    if (!wheelsResponse.ok) {
      throw new Error("Failed to fetch wheels data")
    }

    const wheelsData = await wheelsResponse.json()

    // Find the disk by ID
    const disk = wheelsData.data?.find((item: any) => item.id === diskId)

    if (!disk) {
      return NextResponse.json(
        { error: "Disk not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ disk })
  } catch (error) {
    console.error("Error fetching disk:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
