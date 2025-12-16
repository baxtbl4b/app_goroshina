import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { OrderStatusBadge } from "@/components/status-badge"

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
  products = [],
}: OrderHistoryItemProps) {
  return (
    <Link href={`/profile/orders/${id}`}>
      <div className="bg-[#1F1F1F] rounded-2xl p-4 hover:bg-[#252525] transition-all duration-200">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-white">Заказ #{orderNumber}</span>
          <OrderStatusBadge status={status} />
        </div>

        {/* Product information section */}
        {products.length > 0 && (
          <div className="my-3 bg-[#2A2A2A] rounded-xl p-3 space-y-2">
            {products.slice(0, 2).map((product, index) => (
              <div key={index} className="flex items-center gap-3">
                {product.image && (
                  <div className="w-12 h-12 rounded-xl bg-white overflow-hidden flex-shrink-0">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.quantity} шт.</p>
                </div>
              </div>
            ))}

            {products.length > 2 && (
              <p className="text-xs text-gray-500 pt-1">+ ещё {products.length - 2} товара</p>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-[#2A2A2A]">
          <div>
            <p className="text-xs text-gray-500 mb-1">{date}</p>
            <p className="font-bold text-[#c4d402] text-lg">{total}</p>
          </div>
          <div className="w-10 h-10 bg-[#2A2A2A] rounded-xl flex items-center justify-center">
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </Link>
  )
}
