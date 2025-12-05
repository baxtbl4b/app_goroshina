"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

interface FastenerFilters {
  types: string[]
  threads: string[]
  shapes: string[]
  colors: string[]
}

interface FastenerProps {
  filters: FastenerFilters
}

interface Fastener {
  id: string
  name: string
  type: string
  thread: string
  shape: string
  color: string
  price: number
  image: string
}

// Mock data for fasteners
const mockFasteners: Fastener[] = [
  {
    id: "1",
    name: "Гайка колесная M12x1.5 конус",
    type: "nut",
    thread: "M12x1.5",
    shape: "cone",
    color: "silver",
    price: 120,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-M3bygLp1Pk3gtK3mjtQlVLwX4nsxco.png",
  },
  {
    id: "2",
    name: "Болт колесный M14x1.5 сфера",
    type: "bolt",
    thread: "M14x1.5",
    shape: "sphere",
    color: "silver",
    price: 150,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EHCgdNXeCUnS29e8FP2pvTZd1VeHAj.png",
  },
  {
    id: "3",
    name: "Гайка секретка M12x1.25 конус",
    type: "lock-nut",
    thread: "M12x1.25",
    shape: "cone",
    color: "black",
    price: 450,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sbgcZnynEkUJ5bjlfd3qmARKlbPIfm.png",
  },
  {
    id: "4",
    name: "Болт секретка M14x1.25 сфера",
    type: "lock-bolt",
    thread: "M14x1.25",
    shape: "sphere",
    color: "black",
    price: 480,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2wGMSLx8KSJNV2fQE43bkVEjiXPtA9.png",
  },
  {
    id: "5",
    name: "Гайка колесная M15x1.25 шайба",
    type: "nut",
    thread: "M15x1.25",
    shape: "washer",
    color: "silver",
    price: 130,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GoLdlJLff3k6zlMeyVGwbriFuKtfOc.png",
  },
]

export function FastenerResults({ filters }: FastenerProps) {
  const [filteredFasteners, setFilteredFasteners] = useState<Fastener[]>(mockFasteners)

  useEffect(() => {
    let results = mockFasteners

    // Apply type filter
    if (filters.types.length > 0) {
      results = results.filter((item) => filters.types.includes(item.type))
    }

    // Apply thread filter
    if (filters.threads.length > 0) {
      results = results.filter((item) => filters.threads.includes(item.thread))
    }

    // Apply shape filter
    if (filters.shapes.length > 0) {
      results = results.filter((item) => filters.shapes.includes(item.shape))
    }

    // Apply color filter
    if (filters.colors.length > 0) {
      results = results.filter((item) => filters.colors.includes(item.color))
    }

    setFilteredFasteners(results)
  }, [filters])

  if (filteredFasteners.length === 0) {
    return (
      <div className="mt-6 text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Товары не найдены. Попробуйте изменить параметры фильтра.</p>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <h3 className="font-medium mb-4">На��дено: {filteredFasteners.length}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredFasteners.map((fastener) => (
          <Card key={fastener.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                <div className="relative h-32 sm:w-32 bg-gray-100">
                  <Image
                    src={fastener.image || "/placeholder.svg"}
                    alt={fastener.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="font-medium text-sm">{fastener.name}</h4>
                    <div className="mt-1 text-xs text-gray-500">
                      <p>Резьба: {fastener.thread}</p>
                      <p>Цвет: {fastener.color === "silver" ? "Серебро" : "Черный"}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold">{fastener.price} ₽</span>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <PlusCircle className="h-5 w-5" />
                      <span className="sr-only">Добавить в корзину</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
