import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import BottomNavigation from "@/components/bottom-navigation"
import TireSearchFilter from "@/components/tire-search-filter"
import TireList from "@/components/tire-list"

export default function SearchPage() {
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
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Поиск шин</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        <TireSearchFilter />
        <TireList season="s" title="Результаты поиска" />
      </div>

      <BottomNavigation />
    </main>
  )
}
