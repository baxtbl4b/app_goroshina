import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import BottomNavigation from "@/components/bottom-navigation"

export default function AllBrandsPage() {
  // Sample brand data with logos and tire counts
  const brands = [
    { name: "Michelin", count: 42, logo: "/placeholder.svg?text=Michelin&height=60&width=120" },
    { name: "Pirelli", count: 38, logo: "/placeholder.svg?text=Pirelli&height=60&width=120" },
    { name: "Bridgestone", count: 35, logo: "/placeholder.svg?text=Bridgestone&height=60&width=120" },
    { name: "Continental", count: 31, logo: "/placeholder.svg?text=Continental&height=60&width=120" },
    { name: "Goodyear", count: 29, logo: "/placeholder.svg?text=Goodyear&height=60&width=120" },
    { name: "Nokian", count: 27, logo: "/placeholder.svg?text=Nokian&height=60&width=120" },
    { name: "Yokohama", count: 24, logo: "/placeholder.svg?text=Yokohama&height=60&width=120" },
    { name: "Dunlop", count: 22, logo: "/placeholder.svg?text=Dunlop&height=60&width=120" },
    { name: "Hankook", count: 20, logo: "/placeholder.svg?text=Hankook&height=60&width=120" },
    { name: "Toyo", count: 18, logo: "/placeholder.svg?text=Toyo&height=60&width=120" },
    { name: "Kumho", count: 16, logo: "/placeholder.svg?text=Kumho&height=60&width=120" },
    { name: "Falken", count: 15, logo: "/placeholder.svg?text=Falken&height=60&width=120" },
    { name: "Triangle", count: 14, logo: "/images/triangle-logo.png" },
    { name: "Ikon Tyres", count: 12, logo: "/images/ikon-tyres-logo.jpeg" },
  ]

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] p-4 shadow-sm">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Все бренды</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        {/* Search input */}
        <div className="relative">
          <Input
            placeholder="Поиск брендов"
            className="pl-10 pr-4 py-6 rounded-xl border-[#D9D9DD] bg-white dark:bg-[#2A2A2A] dark:border-[#3A3A3A] text-[#1F1F1F] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#D3DF3D]" />
        </div>

        {/* Brands grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/brands/${brand.name.toLowerCase()}`}
              className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-12 relative mb-3">
                <Image src={brand.logo || "/placeholder.svg"} alt={brand.name} fill className="object-contain" />
              </div>
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-[#1F1F1F] dark:text-white">{brand.name}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{brand.count} шин</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}
