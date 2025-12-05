"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/api"

// Mock data - в реальном приложении эти данные должны быть получены из API или контекста
const orderData = {
  orderNumber: "Р0038655",
  status: "на сборке", // Варианты: "на сборке", "бронь", "оплачено", "выдано"
  items: [
    {
      id: 1,
      name: "Michelin Pilot Sport 4",
      size: "225/60 R17",
      quantity: 4,
      price: 12500,
      image: "/images/michelin-tire-transparent.png",
    },
    {
      id: 2,
      name: "Continental PremiumContact 6",
      size: "205/55 R16",
      quantity: 2,
      price: 9800,
      image: "/images/continental-tire-transparent.png",
    },
  ],
  subtotal: 69600,
  discount: 3480,
  total: 66120,
}

// Helper function to get status badge variant and color
function getStatusBadge(status: string) {
  switch (status) {
    case "на сборке":
      return { variant: "outline" as const, className: "bg-blue-500/10 text-blue-500 border-blue-500/20" }
    case "бронь":
      return { variant: "outline" as const, className: "bg-orange-500/10 text-orange-500 border-orange-500/20" }
    case "оплачено":
      return { variant: "outline" as const, className: "bg-[#D3DF3D]/10 text-[#D3DF3D] border-[#D3DF3D]/20" }
    case "выдано":
      return { variant: "outline" as const, className: "bg-green-500/10 text-green-500 border-green-500/20" }
    default:
      return { variant: "outline" as const, className: "bg-gray-500/10 text-gray-500 border-gray-500/20" }
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<any>(null)

  // Load order details from localStorage on component mount
  useEffect(() => {
    try {
      const savedOrderDetails = localStorage.getItem("orderDetails")
      if (savedOrderDetails) {
        setOrderDetails(JSON.parse(savedOrderDetails))
      } else {
        // If no order details, redirect back to first step
        router.push("/order")
      }
    } catch (error) {
      console.error("Error loading order details:", error)
      router.push("/order")
    }
  }, [router])

  // Handle place order
  const handlePlaceOrder = () => {
    // In a real app, this would submit the order to the backend
    console.log("Placing order with details:", {
      orderDetails,
    })

    // Navigate to order complete page
    router.push("/order/complete")
  }

  // Calculate delivery cost
  const deliveryCost = orderDetails?.deliveryMethod === "delivery" ? 500 : 0

  // Calculate total
  const totalCost = orderData.total + deliveryCost

  return (
    <div className="flex flex-col min-h-screen bg-[#222222] dark:bg-[#1A1A1A]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background dark:bg-[#1A1A1A] border-b border-border/40 dark:border-border/20">
        <div className="container px-4 py-3 flex items-center justify-between -mt-1">
          <div className="flex items-center">
            <Link href="/order" className="mr-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Оплата</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 pb-6 space-y-6 pt-[46px]">
        {/* Order Summary */}
        <Card className="border border-border/40 dark:border-border/20 shadow-sm bg-card dark:bg-[#2A2A2A]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Итого</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Сумма заказа</span>
              <span>{formatPrice(orderData.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#D3DF3D]">
              <span>Скидка при оплате сейчас</span>
              <span>-{formatPrice(orderData.discount)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#D3DF3D]">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" />
                  <circle cx="12" cy="12" r="8" fill="currentColor" />
                  <circle cx="12" cy="12" r="4" fill="#222222" />
                </svg>
                Кешбек за заказ
              </span>
              <span>+{formatPrice(Math.round(totalCost * 0.05))}</span>
            </div>
            {orderDetails?.deliveryMethod === "delivery" && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Доставка</span>
                <span>{formatPrice(deliveryCost)}</span>
              </div>
            )}
            <Separator className="my-2 bg-border/30" />
            <div className="flex justify-between font-medium">
              <span>Итого к оплате</span>
              <span>{formatPrice(totalCost)}</span>
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-3 pt-4">
            <Button
              className="w-full bg-[#D3DF3D] hover:bg-[#C4CF2E] text-black font-medium"
              onClick={handlePlaceOrder}
            >
              Подтвердить заказ
            </Button>
            <Button
              variant="outline"
              className="w-full border-border/30 dark:border-border/20 hover:bg-muted/50 dark:hover:bg-[#3A3A3A]/50"
              onClick={() => router.push("/order")}
            >
              Вернуться к доставке
            </Button>
          </CardFooter>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-background dark:bg-[#1A1A1A] border-t border-border/40 dark:border-border/20 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">© 2023 TireShop</p>
            <div className="flex space-x-4">
              <Link href="/support" className="text-xs text-muted-foreground hover:text-foreground">
                Поддержка
              </Link>
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">
                Условия
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
