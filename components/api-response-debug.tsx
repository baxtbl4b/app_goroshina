"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function ApiResponseDebug() {
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTireData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch a single tire from the API
      const response = await fetch("/api/debug-tire")

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      setApiResponse(data)
    } catch (err) {
      setError(err.message || "Failed to fetch tire data")
      console.error("Error fetching tire data:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">API Response Debug</h2>

      <Button onClick={fetchTireData} disabled={loading} className="mb-4">
        {loading ? "Loading..." : "Fetch Tire Data"}
      </Button>

      {error && <div className="p-3 bg-red-100 text-red-800 rounded mb-4">Error: {error}</div>}

      {apiResponse && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Raw API Response:</h3>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto max-h-[500px] text-xs">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
