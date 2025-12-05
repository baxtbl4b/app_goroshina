"use client"

import { useState } from "react"
import { BrandSelector } from "@/components/brand-selector"

export default function BrandSelectorDemo() {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Выбор брендов</h1>

      <BrandSelector onBrandsChange={setSelectedBrands} />

      {selectedBrands.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Выбранные бренды:</h2>
          <ul className="list-disc pl-5">
            {selectedBrands.map((brand) => (
              <li key={brand}>{brand}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
