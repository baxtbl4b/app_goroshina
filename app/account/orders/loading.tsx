import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersLoading() {
  return (
    <div className="min-h-screen bg-[#D9D9DD] dark:bg-[#121212] pb-20">
      {/* Заголовок */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#1F1F1F] py-4 shadow-sm">
        <div className="container max-w-md mx-auto flex items-center justify-center relative">
          <div className="absolute left-4 p-2">
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          <Skeleton className="h-7 w-32" />
        </div>
      </header>

      <main className="container max-w-md mx-auto px-4 py-6">
        {/* Скелетон для вкладок */}
        <div className="mb-6">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Скелетоны для заказов */}
        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  )
}
