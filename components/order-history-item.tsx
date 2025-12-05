import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface OrderHistoryItemProps {
  id: string
  orderNumber: string
  date: string
  status: string
  items: number
  total: string
  products?: Array<{
    name: string
    quantity: number
    image?: string
  }>
}

export default function OrderHistoryItem({
  id,
  orderNumber,
  date,
  status,
  items,
  total,
  products = [], // Default to empty array if not provided
}: OrderHistoryItemProps) {
  // Функция для определения цвета статуса
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "в обработке":
        return "text-blue-500"
      case "подтвержден":
        return "text-orange-500"
      case "выполнен":
        return "text-green-500"
      case "отменен":
        return "text-red-500"
      default:
        return "text-[#D3DF3D]"
    }
  }

  return (
    <Link href={`/profile/orders/${id}`}>
      <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-[#1F1F1F] dark:text-white">Заказ {orderNumber}</span>
          <span className="text-sm text-[#1F1F1F] dark:text-gray-300">{date}</span>
        </div>

        {/* Product information section */}
        {products.length > 0 && (
          <div className="my-3 border-t border-b border-gray-100 dark:border-gray-700 py-2">
            {products.map((product, index) => (
              <div key={index} className="flex items-center gap-3 py-1">
                {product.image && (
                  <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1F1F1F] dark:text-white truncate">{product.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Количество: {product.quantity}</p>
                </div>
              </div>
            ))}

            {products.length > 2 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">И еще {products.length - 2} товара...</p>
            )}
          </div>
        )}

        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-medium ${getStatusColor(status)}`}>{status}</span>
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">• {items} товара</span>
            </div>
            <p className="font-bold text-[#1F1F1F] dark:text-white">{total}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-[#D9D9DD] dark:text-gray-500" />
        </div>
      </div>
    </Link>
  )
}
