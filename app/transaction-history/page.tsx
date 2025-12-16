"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Filter, Search, CalendarDays, ShoppingCart, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import BottomNavigation from "@/components/bottom-navigation" // Assuming you have this component

// Mock data for transactions
const transactionsData = [
  {
    id: "1",
    date: new Date().toISOString(),
    type: "expense",
    title: "Покупка шин Michelin Pilot Sport 4",
    amount: -25600,
    category: "Шины",
    icon: <ShoppingCart className="h-5 w-5 text-red-500" />,
    items: [{ name: "Шина Michelin Pilot Sport 4 (225/45 R17)", quantity: 4, price: 6400 }],
    subtotal: 25600,
    discount: 0,
    tax: 5120, // Assuming 20% VAT
    total: 25600,
    paymentMethod: "Карта **** 1234",
    shopAddress: "ул. Ленина, 1, Москва",
    qrCodeUrl: "/placeholder.svg?width=100&height=100",
  },
  {
    id: "2",
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    type: "income",
    title: "Бонус за опрос",
    amount: 100,
    category: "Баллы",
    icon: <Gift className="h-5 w-5 text-green-500" />,
    items: [{ name: "Начисление баллов за участие в опросе", quantity: 1, price: 100 }],
    subtotal: 100,
    discount: 0,
    tax: 0,
    total: 100,
    paymentMethod: "Бонусная программа",
    shopAddress: "Онлайн",
    qrCodeUrl: "/placeholder.svg?width=100&height=100",
  },
  {
    id: "3",
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    type: "expense",
    title: "Шиномонтаж",
    amount: -3200,
    category: "Услуги",
    icon: <ShoppingCart className="h-5 w-5 text-red-500" />,
    items: [{ name: "Комплексный шиномонтаж R17", quantity: 1, price: 3200 }],
    subtotal: 3200,
    discount: 0,
    tax: 640,
    total: 3200,
    paymentMethod: "Наличные",
    shopAddress: "ул. Ленина, 1, Москва",
    qrCodeUrl: "/placeholder.svg?width=100&height=100",
  },
  {
    id: "4",
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    type: "expense",
    title: "Покупка дисков Replica",
    amount: -18000,
    category: "Диски",
    icon: <ShoppingCart className="h-5 w-5 text-red-500" />,
    items: [{ name: "Диск Replica A2 (7.5x17 5/112 ET40)", quantity: 4, price: 4500 }],
    subtotal: 18000,
    discount: 1800, // 10% discount
    tax: 3240, // 20% VAT on discounted price
    total: 16200,
    paymentMethod: "Карта **** 5678",
    shopAddress: "ул. Мира, 10, Москва",
    qrCodeUrl: "/placeholder.svg?width=100&height=100",
  },
  {
    id: "5",
    date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    type: "income",
    title: "Кэшбэк за покупку",
    amount: 256,
    category: "Баллы",
    icon: <Gift className="h-5 w-5 text-green-500" />,
    items: [{ name: "Кэшбэк 1% за покупку шин", quantity: 1, price: 256 }],
    subtotal: 256,
    discount: 0,
    tax: 0,
    total: 256,
    paymentMethod: "Бонусная программа",
    shopAddress: "Онлайн",
    qrCodeUrl: "/placeholder.svg?width=100&height=100",
  },
]

const groupTransactionsByDate = (transactions: typeof transactionsData) => {
  const groups: Record<string, typeof transactionsData> = {}
  transactions.forEach((transaction) => {
    const date = new Date(transaction.date).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const today = new Date().toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" })
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    let displayDate = date
    if (date === today) {
      displayDate = "Сегодня"
    } else if (date === yesterday) {
      displayDate = "Вчера"
    }

    if (!groups[displayDate]) {
      groups[displayDate] = []
    }
    groups[displayDate].push(transaction)
  })
  return groups
}

export default function TransactionHistoryPage() {
  const router = useRouter()
  const groupedTransactions = groupTransactionsByDate(transactionsData)

  const renderTransactionItem = (transaction: (typeof transactionsData)[0]) => (
    <Link href={`/transaction-history/${transaction.id}`} key={transaction.id} className="block">
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full mr-3">{transaction.icon}</div>
          <div>
            <p className="font-medium text-sm text-gray-900 dark:text-white">{transaction.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(transaction.date).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
        <div className={`text-sm font-semibold ${transaction.type === "expense" ? "text-red-500" : "text-green-500"}`}>
          {transaction.amount > 0 ? "+" : ""}
          {transaction.amount.toLocaleString("ru-RU")} {transaction.type === "expense" ? "₽" : "баллов"}
        </div>
      </div>
    </Link>
  )

  return (
    <div className="min-h-screen bg-[#F0F0F5] dark:bg-[#121212] flex flex-col">
      <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => {
                router.back()
              }}
            >
              <ChevronLeft className="h-6 w-6 text-gray-900 dark:text-white" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">История операций</h1>
          </div>
          <Button variant="ghost" size="icon">
            <Filter className="h-5 w-5 text-gray-900 dark:text-white" />
          </Button>
        </div>
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск по операциям..."
              className="pl-10 w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:border-transparent focus:ring-0"
            />
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 pb-20">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm rounded-md"
            >
              Все
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm rounded-md"
            >
              Расходы
            </TabsTrigger>
            <TabsTrigger
              value="income"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm rounded-md"
            >
              Поступления
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            {Object.entries(groupedTransactions).map(([date, transactions]) => (
              <div key={date} className="mb-4">
                <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase my-2 px-1">{date}</h2>
                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm divide-y divide-gray-200 dark:divide-gray-700 px-4">
                  {transactions.map(renderTransactionItem)}
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="expenses" className="mt-4">
            {Object.entries(groupTransactionsByDate(transactionsData.filter((t) => t.type === "expense"))).map(
              ([date, transactions]) => (
                <div key={date} className="mb-4">
                  <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase my-2 px-1">{date}</h2>
                  <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm divide-y divide-gray-200 dark:divide-gray-700 px-4">
                    {transactions.map(renderTransactionItem)}
                  </div>
                </div>
              ),
            )}
          </TabsContent>
          <TabsContent value="income" className="mt-4">
            {Object.entries(groupTransactionsByDate(transactionsData.filter((t) => t.type === "income"))).map(
              ([date, transactions]) => (
                <div key={date} className="mb-4">
                  <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase my-2 px-1">{date}</h2>
                  <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm divide-y divide-gray-200 dark:divide-gray-700 px-4">
                    {transactions.map(renderTransactionItem)}
                  </div>
                </div>
              ),
            )}
          </TabsContent>
        </Tabs>
        {transactionsData.length === 0 && (
          <div className="text-center py-10">
            <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Нет операций</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              История ваших операций будет отображаться здесь.
            </p>
          </div>
        )}
      </main>
      <BottomNavigation />
    </div>
  )
}
