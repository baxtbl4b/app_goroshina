import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import BottomNavigation from "@/components/bottom-navigation"
import TireSearchFilter from "@/components/tire-search-filter"
import TireResults from "@/components/tire-results"

interface BrandPageProps {
  params: {
    brand: string
  }
}

export default function BrandPage({ params }: BrandPageProps) {
  // Capitalize the first letter of the brand name for display
  const brandName = params.brand.charAt(0).toUpperCase() + params.brand.slice(1)

  // Brand logos could be added here in a real application
  const brandLogos: Record<string, string> = {
    michelin: "/placeholder.svg?text=Michelin&height=60&width=120",
    pirelli: "/placeholder.svg?text=Pirelli&height=60&width=120",
    bridgestone: "/placeholder.svg?text=Bridgestone&height=60&width=120",
    continental: "/placeholder.svg?text=Continental&height=60&width=120",
  }

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
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Шины {brandName}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        {/* Brand header with logo */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm flex items-center">
          <div className="w-24 h-12 relative mr-4">
            <Image
              src={brandLogos[params.brand] || "/placeholder.svg?text=Brand&height=60&width=120"}
              alt={brandName}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1F1F1F] dark:text-white">{brandName}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Официальный дилер</p>
          </div>
        </div>

        <TireSearchFilter />
        <TireResults season="s" filters={{ brand: brandName }} />
      </div>

      <BottomNavigation />
    </main>
  )
}
