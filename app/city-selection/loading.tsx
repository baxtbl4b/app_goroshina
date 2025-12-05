import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CitySelectionLoading() {
  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
            </Button>
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Выбор города</span>
          </div>
          <Skeleton className="h-9 w-20" />
        </div>
      </header>

      <div className="flex-1 p-4 space-y-4 pb-20">
        {/* Current Location Skeleton */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4">
          <div className="flex items-center mb-3">
            <MapPin className="h-5 w-5 text-[#009CFF] mr-2" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>

        {/* Search Skeleton */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Cities List Skeleton */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#D9D9DD] dark:border-[#3A3A3A]">
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="divide-y divide-[#D9D9DD] dark:divide-[#3A3A3A]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-4">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
