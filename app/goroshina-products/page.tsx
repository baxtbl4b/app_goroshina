"use client"

import { ArrowLeft, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const goroshinaProducts = [
  {
    id: 1,
    name: "Кепка Горошина",
    price: 1500,
    image: "/placeholder.svg?height=200&width=200&text=Кепка+Горошина",
    description: "Стильная кепка с логотипом Горошина. Высокое качество материалов.",
    inStock: true,
  },
  {
    id: 2,
    name: "Футболка Горошина",
    price: 2500,
    image: "/placeholder.svg?height=200&width=200&text=Футболка+Горошина",
    description: "Комфортная футболка из 100% хлопка с фирменным дизайном.",
    inStock: true,
  },
  {
    id: 3,
    name: "Значок Горошина",
    price: 500,
    image: "/placeholder.svg?height=200&width=200&text=Значок+Горошина",
    description: "Металлический значок с эмалевым покрытием и логотипом компании.",
    inStock: false,
  },
]

export default function GoroshinaProductsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-[#1F1F1F] shadow-sm h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
              </Button>
            </Link>
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Продукция Горошина</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 pb-20">
        {/* Company Info */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-6 mb-6">
          <div className="flex flex-col mb-4">
            <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=400&width=800&text=Продукция+Горошина"
                alt="Продукция Горошина"
                width={800}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1F1F1F] dark:text-white">Горошина</h2>
              <p className="text-gray-600 dark:text-gray-400">Официальная продукция</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Эксклюзивная продукция от компании Горошина. Высокое качество и стильный дизайн.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goroshinaProducts.map((product) => (
            <Card key={product.id} className="bg-white dark:bg-[#2A2A2A] overflow-hidden">
              <div className="relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold">Нет в наличии</span>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <h3 className="font-bold text-[#1F1F1F] dark:text-white mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{product.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#009CFF]">{product.price} ₽</span>
                  <Button
                    size="sm"
                    disabled={!product.inStock}
                    className="bg-[#009CFF] hover:bg-[#007ACC] text-white disabled:bg-gray-400"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    {product.inStock ? "В корзину" : "Недоступно"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-6 mt-6">
          <h3 className="font-bold text-[#1F1F1F] dark:text-white mb-3">Информация о доставке</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>• Бесплатная доставка при заказе от 3000 ₽</p>
            <p>• Доставка по Москве: 1-2 рабочих дня</p>
            <p>• Доставка по России: 3-7 рабочих дня</p>
            <p>• Возможен самовывоз из наших центров</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-6 mt-6">
          <h3 className="font-bold text-[#1F1F1F] dark:text-white mb-3">Вопросы по продукции?</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Свяжитесь с нами для получения дополнительной информации о продукции Горошина.
          </p>
          <Button variant="outline" className="w-full">
            Связаться с менеджером
          </Button>
        </div>
      </div>
    </main>
  )
}
