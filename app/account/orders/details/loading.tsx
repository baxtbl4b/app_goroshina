import { Skeleton } from "@/components/ui/skeleton"

export default function OrderDetailsLoading() {
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
        <div className="space-y-6">
          {/* Скелетон для информации о заказе */}
          <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-5 w-28" />
            </div>

            <div className="my-4 h-px bg-gray-200 dark:bg-gray-700" />

            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>

            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          {/* Скелетон для товаров в заказе */}
          <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-5 shadow-sm">
            <Skeleton className="h-6 w-40 mb-4" />

            <div className="space-y-4">
              {Array(2)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="flex gap-4 py-2 border-b last:border-0 dark:border-gray-700">
                    <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <div className="flex justify-between items-center mt-1">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-gray-700">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>

          {/* Скелетон для информации о доставке */}
          <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-5 shadow-sm">
            <Skeleton className="h-6 w-48 mb-4" />

            <div className="space-y-3">
              <div>
                <Skeleton className="h-4 w-28 mb-1" />
                <Skeleton className="h-4 w-full" />
              </div>

              <div>
                <Skeleton className="h-4 w-28 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>

          {/* Скелетон для кнопок */}
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </main>
    </div>
  )
}
