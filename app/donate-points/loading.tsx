import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] shadow-sm">
        <div className="p-4 flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" disabled>
            <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
          </Button>
          <Skeleton className="h-6 w-40 bg-gray-300 dark:bg-gray-700" />
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        <Card className="bg-white dark:bg-[#2A2A2A] shadow-sm">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-32 mb-1 bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-4 w-48 bg-gray-200 dark:bg-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-gray-400 dark:text-gray-600" />
              <Skeleton className="h-8 w-36 bg-gray-300 dark:bg-gray-700" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Skeleton className="h-7 w-52 bg-gray-300 dark:bg-gray-700" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <Card key={i} className="bg-white dark:bg-[#2A2A2A] shadow-sm">
                <CardHeader className="p-0">
                  <Skeleton className="rounded-t-lg object-cover w-full h-32 bg-gray-300 dark:bg-gray-700" />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <Skeleton className="h-6 w-6 rounded-full mr-2 bg-gray-300 dark:bg-gray-700" />
                    <Skeleton className="h-5 w-40 bg-gray-300 dark:bg-gray-700" />
                  </div>
                  <Skeleton className="h-4 w-full mb-1 bg-gray-200 dark:bg-gray-600" />
                  <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
