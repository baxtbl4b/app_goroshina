"use client"
import { ChevronLeft, Download, Mail, Printer, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import BottomNavigation from "@/components/bottom-navigation"
import { useParams, useRouter } from "next/navigation"

// Mock data - in a real app, you'd fetch this based on params.id
const transactionsData = [
  {
    id: "1",
    date: new Date().toISOString(),
    type: "expense",
    title: "Покупка шин Michelin Pilot Sport 4",
    amount: -25600,
    category: "Шины",
    items: [{ name: "Шина Michelin Pilot Sport 4 (225/45 R17)", quantity: 4, price: 6400, total: 25600 }],
    subtotal: 25600,
    discount: 0,
    taxRate: 0.2, // 20%
    taxAmount: 5120,
    total: 25600,
    paymentMethod: "Карта Visa **** 1234",
    shopAddress: 'ул. Ленина, 1, Москва, ООО "Шинный Мир", ИНН 1234567890',
    cashier: "Иванова А.П.",
    receiptNumber: "00123",
    shiftNumber: "045",
    fiscalDriveNumber: "9960440300123456",
    fiscalDocumentNumber: "56789",
    fiscalSign: "1234567890",
    qrCodeUrl: "/placeholder.svg?width=150&height=150",
  },
  {
    id: "2",
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    type: "income",
    title: "Бонус за опрос",
    amount: 100,
    category: "Баллы",
    items: [{ name: "Начисление баллов за участие в опросе", quantity: 1, price: 100, total: 100 }],
    subtotal: 100,
    discount: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 100,
    paymentMethod: 'Бонусная программа "Горошина"',
    shopAddress: "Онлайн-операция",
    cashier: "Система",
    receiptNumber: "B0056",
    shiftNumber: "N/A",
    fiscalDriveNumber: "N/A",
    fiscalDocumentNumber: "N/A",
    fiscalSign: "N/A",
    qrCodeUrl: "/placeholder.svg?width=150&height=150",
  },
  {
    id: "3",
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    type: "expense",
    title: "Шиномонтаж",
    amount: -3200,
    category: "Услуги",
    items: [{ name: "Комплексный шиномонтаж R17", quantity: 1, price: 3200, total: 3200 }],
    subtotal: 3200,
    discount: 0,
    taxRate: 0.2,
    taxAmount: 640,
    total: 3200,
    paymentMethod: "Наличные",
    shopAddress: 'ул. Ленина, 1, Москва, ООО "Шинный Мир", ИНН 1234567890',
    cashier: "Петров В.С.",
    receiptNumber: "00124",
    shiftNumber: "045",
    fiscalDriveNumber: "9960440300123457",
    fiscalDocumentNumber: "56790",
    fiscalSign: "0987654321",
    qrCodeUrl: "/placeholder.svg?width=150&height=150",
  },
]

export default function TransactionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const transactionId = params.id as string

  // Find the transaction by ID. In a real app, you'd fetch this.
  const transaction = transactionsData.find((t) => t.id === transactionId)

  if (!transaction) {
    return (
      <div className="min-h-screen bg-[#F0F0F5] dark:bg-[#121212] flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-semibold mb-4">Операция не найдена</h1>
        <Button onClick={() => router.back()}>Назад к истории</Button>
      </div>
    )
  }

  const isExpense = transaction.type === "expense"

  return (
    <div className="min-h-screen bg-[#F0F0F5] dark:bg-[#121212] flex flex-col">
      <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-4 flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
            <ChevronLeft className="h-6 w-6 text-gray-900 dark:text-white" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isExpense ? "Кассовый чек" : "��етали операции"}
          </h1>
        </div>
      </header>

      <main className="flex-grow p-4 pb-20">
        <Card className="w-full max-w-md mx-auto bg-white dark:bg-[#1E1E1E] shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {isExpense ? "Кассовый чек" : transaction.title}
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(transaction.date).toLocaleString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </CardHeader>
          <CardContent className="px-6 py-4">
            {isExpense && (
              <div className="text-center mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">{transaction.shopAddress}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Кассир: {transaction.cashier}</p>
              </div>
            )}

            <Separator className="my-4 dark:bg-gray-600" />

            <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
              {isExpense ? "Товары/Услуги:" : "Описание:"}
            </h3>
            <ul className="space-y-2 mb-4">
              {transaction.items.map((item, index) => (
                <li key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700 dark:text-gray-300 flex-1 pr-2">
                    {item.name} (x{item.quantity})
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {(item.price * item.quantity).toLocaleString("ru-RU", { style: "currency", currency: "RUB" })}
                  </span>
                </li>
              ))}
            </ul>

            <Separator className="my-4 dark:bg-gray-600" />

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Подытог:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {transaction.subtotal.toLocaleString("ru-RU", { style: "currency", currency: "RUB" })}
                </span>
              </div>
              {isExpense && transaction.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Скидка:</span>
                  <span className="text-red-500 font-medium">
                    -{transaction.discount.toLocaleString("ru-RU", { style: "currency", currency: "RUB" })}
                  </span>
                </div>
              )}
              {isExpense && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">НДС ({transaction.taxRate * 100}%):</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {transaction.taxAmount.toLocaleString("ru-RU", { style: "currency", currency: "RUB" })}
                  </span>
                </div>
              )}
              <Separator className="my-2 dark:bg-gray-600" />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900 dark:text-white">Итого:</span>
                <span className="text-gray-900 dark:text-white">
                  {transaction.total.toLocaleString("ru-RU", { style: "currency", currency: "RUB" })}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600 dark:text-gray-400">Способ оплаты:</span>
                <span className="text-gray-700 dark:text-gray-300">{transaction.paymentMethod}</span>
              </div>
            </div>

            {isExpense && (
              <>
                <Separator className="my-4 dark:bg-gray-600" />
                <div className="text-center my-4">
                  <Image
                    src={transaction.qrCodeUrl || "/placeholder.svg"}
                    alt="QR-код чека"
                    width={120}
                    height={120}
                    className="mx-auto rounded-md"
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                  <p>
                    Чек №: {transaction.receiptNumber} Смена №: {transaction.shiftNumber}
                  </p>
                  <p>ФН №: {transaction.fiscalDriveNumber}</p>
                  <p>ФД №: {transaction.fiscalDocumentNumber}</p>
                  <p>ФП: {transaction.fiscalSign}</p>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-2 p-4 border-t dark:border-gray-600">
            <Button
              variant="outline"
              className="w-full sm:w-auto dark:text-white dark:border-gray-500 dark:hover:bg-gray-700"
            >
              <Printer className="mr-2 h-4 w-4" /> Печать
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto dark:text-white dark:border-gray-500 dark:hover:bg-gray-700"
            >
              <Download className="mr-2 h-4 w-4" /> Скачать PDF
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto dark:text-white dark:border-gray-500 dark:hover:bg-gray-700"
            >
              <Mail className="mr-2 h-4 w-4" /> На почту
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto dark:text-white dark:border-gray-500 dark:hover:bg-gray-700"
            >
              <Share2 className="mr-2 h-4 w-4" /> Поделиться
            </Button>
          </CardFooter>
        </Card>
      </main>
      <BottomNavigation />
    </div>
  )
}
