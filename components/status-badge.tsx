import { cn } from "@/lib/utils"

// Типы статусов
export type OrderStatus = "На сборке" | "Забронирован" | "Готов к выдаче" | "В пути" | "Выполнен"
export type PaymentStatus = "Оплачено" | "Не оплачено"

// Функция для определения стиля статуса заказа
const getOrderStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "на сборке":
      return "bg-blue-500"
    case "забронирован":
    case "зарезервировано":
      return "bg-orange-500"
    case "готов к выдаче":
      return "bg-green-700"
    case "в пути":
      return "bg-purple-500"
    case "выполнен":
      return "bg-green-900"
    default:
      return "bg-gray-500"
  }
}

// Функция для нормализации названия статуса
const getStatusName = (status: string) => {
  switch (status.toLowerCase()) {
    case "зарезервировано":
      return "Забронирован"
    case "на сборке":
      return "На сборке"
    case "забронирован":
      return "Забронирован"
    case "готов к выдаче":
      return "Готов к выдаче"
    case "в пути":
      return "В пути"
    case "выполнен":
      return "Выполнен"
    default:
      return status
  }
}

interface StatusBadgeProps {
  status: string
  className?: string
}

// Плашка статуса заказа
export function OrderStatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "text-xs font-medium text-white px-3 py-1 rounded-xl min-w-[120px] text-center inline-block",
        getOrderStatusStyle(status),
        className
      )}
    >
      {getStatusName(status)}
    </span>
  )
}

// Плашка статуса оплаты
export function PaymentStatusBadge({ isPaid, className }: { isPaid: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "text-xs font-medium text-white px-3 py-1 rounded-xl min-w-[120px] text-center inline-block",
        isPaid ? "bg-green-700" : "bg-red-500",
        className
      )}
    >
      {isPaid ? "Оплачено" : "Не оплачено"}
    </span>
  )
}

// Плашка с датой
export function DateBadge({ date, className }: { date: string; className?: string }) {
  return (
    <span
      className={cn(
        "text-xs font-medium text-black px-3 py-1 rounded-xl bg-white min-w-[120px] text-center inline-block",
        className
      )}
    >
      {date}
    </span>
  )
}
