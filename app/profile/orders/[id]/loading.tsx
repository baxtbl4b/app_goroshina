import { ChevronLeft } from "lucide-react"

export default function OrderDetailsLoading() {
  return (
    <div className="min-h-screen bg-[#D9D9DD] dark:bg-[#121212] pb-20">
      {/* Заголовок */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#1F1F1F] py-4 shadow-sm">
        <div className="container max-w-md mx-auto flex items-center justify-center relative">
          <button
            className="absolute left-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Вернуться назад"
            disabled
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-center text-[#1F1F1F] dark:text-white">Детали заказа</h1>
        </div>
      </header>

      <main className="container max-w-md mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>

          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>

          <div className="space-y-4 mb-6">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          </div>

          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6"></div>

          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </main>
    </div>
  )
}
