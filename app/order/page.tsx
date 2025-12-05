"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, ChevronLeft, MapPin, Plus, Minus, Truck, Trash2, User, Phone, Mail, Globe, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatPrice } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

// Mock data
const orderData = {
  orderNumber: "Р0038655",
  status: "на сборке", // Варианты: "на сборке", "оплачено", "выдано"
  items: [
    {
      id: 1,
      name: "Michelin Pilot Sport 4",
      size: "225/60 R17",
      quantity: 4,
      price: 12500,
      salePrice: 10000, // Added salePrice
      image: "/images/michelin-pilot-sport-4-wheel.png",
      loadSpeedIndex: "96Y", // Added loadSpeedIndex
      stockStatus: "Последний комплект", // Added stockStatus
      deliveryTime: "Срок поставки 5 дней", // Added deliveryTime
      weight: 10, // Added weight
      season: "Лето", // Added season
    },
    {
      id: 2,
      name: "Continental PremiumContact 6",
      size: "205/55 R16",
      quantity: 2,
      price: 9800,
      image: "/images/continental-premiumcontact-wheel.png",
      loadSpeedIndex: "91V", // Added loadSpeedIndex
      stockStatus: "Осталось мало", // Added stockStatus
      deliveryTime: "Срок поставки 3 дня", // Added stockStatus
      weight: 9, // Added weight
      season: "Лето", // Added season
    },
  ],
  subtotal: 69600,
  discount: 3480,
  total: 66120,
  customer: {
    name: "Иванов Иван Иванович",
    phone: "+7 (999) 123-45-67",
    email: "ivanov@example.com",
  },
}

// Mock saved cards data
const savedCards = [
  {
    id: 1,
    type: "visa",
    lastFour: "4242",
    expiry: "04/25",
    isDefault: true,
  },
  {
    id: 2,
    type: "mastercard",
    lastFour: "5678",
    expiry: "09/26",
    isDefault: false,
  },
]

// Mock stores data
const stores = [
  {
    id: "store1",
    name: "Магазин на Автомобильной",
    address: "ул. Автомобильная, 15",
    phone: "+7 (495) 123-45-67",
    coordinates: "37.618423,55.751244", // Longitude, Latitude
  },
  {
    id: "store2",
    name: "Шинный центр на Ленина",
    address: "пр. Ленина, 78",
    phone: "+7 (495) 987-65-43",
    coordinates: "37.617635,55.755814", // Longitude, Latitude
  },
  {
    id: "store3",
    name: "Склад на Профсоюзной",
    address: "ул. Профсоюзная, 100",
    phone: "+7 (495) 555-11-22",
    coordinates: "37.527393,55.665298", // Longitude, Latitude
  },
]

// Mock saved delivery addresses
const savedAddresses = [
  {
    id: 1,
    name: "Дом",
    street: "ул. Пушкина, 10, кв. 42",
    city: "Москва",
    zipCode: "123456",
    isDefault: true,
  },
  {
    id: 2,
    name: "Работа",
    street: "ул. Ленина, 25, офис 301",
    city: "Москва",
    zipCode: "654321",
    isDefault: false,
  },
]

// Mock delivery companies for Russia-wide delivery
const deliveryCompanies = [
  { id: 1, name: "СДЭК", price: 800, days: "3-7" },
  { id: 2, name: "Почта России", price: 600, days: "5-10" },
  { id: 3, name: "DPD", price: 900, days: "2-5" },
  { id: 4, name: "Boxberry", price: 750, days: "3-6" },
]

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

// Изменить компонент OrderPage, оставив только первый этап
export default function OrderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedPayment, setSelectedPayment] = useState("sbp")
  const [selectedCard, setSelectedCard] = useState<number | null>(savedCards.find((card) => card.isDefault)?.id || null)
  const [deliveryMethod, setDeliveryMethod] = useState("pickup") // pickup, delivery, or russia
  const [selectedStore, setSelectedStore] = useState<string>(stores[0].id) // Changed from selectedLocation
  const [selectedAddress, setSelectedAddress] = useState<number | null>(
    savedAddresses.find((address) => address.isDefault)?.id || null,
  )
  const [showNewAddressForm, setShowNewAddressForm] = useState(savedAddresses.length === 0)
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    region: "",
    zipCode: "",
    isDefault: savedAddresses.length === 0, // Make default if it's the first address
  })
  const statusBadge = getStatusBadge(orderData.status)
  const [paymentType, setPaymentType] = useState("online")
  const [selectedDeliveryCompany, setSelectedDeliveryCompany] = useState<number>(1) // Default to first company
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromoDiscount, setAppliedPromoDiscount] = useState(0) // Новое состояние для скидки по промокоду
  const [showPromoCodeInput, setShowPromoCodeInput] = useState(true) // Новое состояние для отображения поля промокода

  const [recipientInfo, setRecipientInfo] = useState({
    name: "",
    phone: "",
    email: "",
  })
  const [useCustomerAsRecipient, setUseCustomerAsRecipient] = useState(false)

  // Get the coordinates of the selected location
  const selectedLocationCoordinates =
    stores.find((location) => location.id === selectedStore)?.coordinates || "37.618423,55.751244" // Default to Moscow coordinates

  // Get the selected address details
  const selectedAddressDetails = savedAddresses.find((address) => address.id === selectedAddress)

  // Handle address selection
  const handleAddressSelect = (addressId: number) => {
    setSelectedAddress(addressId)
    setShowNewAddressForm(false)
  }

  // Handle new address form change
  const handleAddressChange = (field: string, value: string) => {
    setNewAddress((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle "Add new address" button click
  const handleAddNewAddressClick = () => {
    setSelectedAddress(null)
    setShowNewAddressForm(true)
  }

  // Set address as default
  const setAddressAsDefault = (addressId: number) => {
    // In a real app, this would update the database
    console.log(`Setting address ${addressId} as default`)
  }

  // Handle recipient information change
  const handleRecipientChange = (field: string, value: string) => {
    setRecipientInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle auto-fill checkbox change
  const handleUseCustomerAsRecipient = (checked: boolean) => {
    setUseCustomerAsRecipient(checked)
    if (checked) {
      setRecipientInfo({
        name: orderData.customer.name,
        phone: orderData.customer.phone,
        email: orderData.customer.email,
      })
    }
  }

  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    // In a real app, we would save the delivery method and address to the session/localStorage
    const orderDetails = {
      deliveryMethod,
      selectedLocation: deliveryMethod === "pickup" ? selectedStore : null,
      selectedAddress: deliveryMethod === "delivery" ? selectedAddress : null,
      newAddress: deliveryMethod === "delivery" && showNewAddressForm ? newAddress : null,
      selectedDeliveryCompany: deliveryMethod === "russia" ? selectedDeliveryCompany : null,
      recipientInfo: deliveryMethod === "russia" ? recipientInfo : null,
      paymentType,
      selectedPayment,
      selectedCard: selectedPayment === "card" ? selectedCard : null,
    }

    // Save to localStorage for the next page
    localStorage.setItem("orderDetails", JSON.stringify(orderDetails))

    // Navigate to the next step
    router.push("/order/complete")
  }

  const [items, setItems] = useState(orderData.items)
  const [forceUpdate, setForceUpdate] = useState(false)

  // Функция для обновления количества товара
  const updateItemQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return // Не позволяем установить количество меньше 1

    // Обновляем количество товара
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity }
      }
      return item
    })

    // В реальном приложении здесь был бы API-запрос для обновления заказа
    console.log(`Обновлено количество товара ID:${itemId} на ${newQuantity}`)

    // Обновляем данные заказа
    setItems(updatedItems)
    updateOrderTotals(updatedItems, appliedPromoDiscount) // Передаем текущую скидку промокода
  }

  // Функция для удаления товара
  const removeItem = (itemId: number) => {
    // Удаляем товар из списка
    const updatedItems = items.filter((item) => item.id !== itemId)

    // В реальном приложении здесь был бы API-запрос для удаления товара
    console.log(`Удален товар ID:${itemId}`)

    // Обновляем данные заказа
    setItems(updatedItems)
    updateOrderTotals(updatedItems, appliedPromoDiscount) // Передаем текущую скидку промокода
  }

  // Функция для пересчета итоговых сумм заказа
  const updateOrderTotals = (updatedItems: typeof items, promoDiscountAmount: number) => {
    const currentSubtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const cashbackDiscount = Math.round(currentSubtotal * 0.05)
    const totalDiscount = cashbackDiscount + promoDiscountAmount // Суммируем все скидки
    const finalTotal = currentSubtotal - totalDiscount

    orderData.items = updatedItems
    orderData.subtotal = currentSubtotal // Это базовая сумма до всех скидок
    orderData.discount = totalDiscount // Это общая сумма скидок (кэшбэк + промокод)
    orderData.total = finalTotal // Это итоговая сумма после всех скидок

    setForceUpdate((prev) => !prev)
  }

  // Проверяем, есть ли товары в заказе
  const hasItems = items.length > 0
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalWeight = items.reduce((sum, item) => sum + item.quantity * (item.weight || 0), 0) // Use 0 if weight is undefined

  // Calculate delivery cost based on selected method
  const getDeliveryCost = () => {
    if (deliveryMethod === "delivery") {
      return 500 // Local delivery cost
    } else if (deliveryMethod === "russia") {
      const company = deliveryCompanies.find((c) => c.id === selectedDeliveryCompany)
      return company ? company.price : 0
    }
    return 0 // Pickup is free
  }

  const deliveryCost = getDeliveryCost()

  const [isEditingCustomer, setIsEditingCustomer] = useState(false)
  const [editedCustomer, setEditedCustomer] = useState({
    name: orderData.customer.name,
    phone: orderData.customer.phone,
    email: orderData.customer.email,
  })

  // Обработчик изменений в полях данных покупателя
  const handleCustomerChange = (field: string, value: string) => {
    setEditedCustomer((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Функция для сохранения изменений данных покупателя
  const saveCustomerChanges = () => {
    // В реальном приложении здесь был бы API-запрос для обновления данных
    orderData.customer = editedCustomer
    setIsEditingCustomer(false)
  }

  // Add a new state variable for tracking the collapsed state
  const [isCustomerCardCollapsed, setIsCustomerCardCollapsed] = useState(false)

  const handleAddNewAddressFormClick = () => {
    setSelectedAddress(null)
    setShowNewAddressForm(true)
  }

  // Calculate total before promo discount (but after cashback)
  const totalBeforePromo = orderData.subtotal - Math.round(orderData.subtotal * 0.05)

  return (
    <div className="flex flex-col min-h-screen bg-[#222222] dark:bg-[#1A1A1A]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background dark:bg-[#1A1A1A] border-b border-border/0 dark:border-border/0">
        <div className="container px-4 py-5 flex items-center justify-between -mt-1 bg-[#1f1f1f]">
          <div className="flex items-center">
            <Link href="/" className="mr-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Оформление заказа</h1>
          </div>
          <div className="flex items-center">{/* Элементы с номером заказа и статусом удалены */}</div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-2 sm:px-4 overflow-y-auto pb-[25px] flex flex-col bg-[#222222] bg-[rgba(18,18,18,1)] pt-[10px]">
        <div className="grid grid-cols-1 gap-[8px] auto-rows-min">
          <Card className="border border-border/40 dark:border-border/20 shadow-sm bg-card dark:bg-[#2A2A2A] md:row-span-2 h-auto">
            <CardHeader className="pb-1 sm:pb-2 pt-2 sm:pt-3 flex items-center justify-between">
              <div className="flex items-center">
                <h3 className="font-semibold text-lg">Ваша корзина</h3>
              </div>
              {hasItems && (
                <span className="text-sm text-muted-foreground">
                  {totalQuantity} товаров / {totalWeight} кг
                </span>
              )}
            </CardHeader>
            <CardContent className="space-y-1 pt-0 overflow-auto max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-150px)]">
              {hasItems ? (
                <>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-3 border border-gray-500/30 rounded-md mb-2 group relative"
                    >
                      {/* Левая колонка: Изображение, Корзина и Элементы управления количеством */}
                      <div className="flex flex-col items-center justify-between h-full">
                        <div className="w-24 h-24 relative flex-shrink-0 bg-background dark:bg-[#1F1F1F] rounded-md overflow-hidden mx-auto sm:mx-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex items-center mt-3">
                          <div className="flex items-center bg-muted dark:bg-[#3A3A3A] rounded ml-[10px]">
                            <button
                              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                              className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Уменьшить количество"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm px-2">{item.quantity} шт.</span>
                            <button
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Увеличить количество"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Правая колонка: Детали товара (Цена, Размер, Название) */}
                      <div className="flex-1 min-w-0 flex flex-col relative">
                        <div className="absolute top-0 right-0 flex flex-col items-end space-y-4">
                          {item.season && <span className="text-xs text-gray-400">{item.season}</span>}
                          <button
                            className="text-muted-foreground hover:text-red-500 transition-colors"
                            aria-label="Добавить в избранное"
                          >
                            <Heart className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-red-500 transition-colors"
                            aria-label="Удалить товар"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="pr-12">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-base">
                              {item.salePrice ? (
                                <span className="text-muted-foreground line-through mr-2">
                                  {formatPrice(item.price)}
                                </span>
                              ) : null}
                              <span className={item.salePrice ? "text-green-500" : ""}>
                                {formatPrice(item.salePrice || item.price)}
                              </span>
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.size} <span className="ml-1 font-medium text-gray-500">{item.loadSpeedIndex}</span>
                          </p>
                          <h3 className="font-medium text-sm mt-1">{item.name}</h3>
                          {item.stockStatus && <p className="text-xs text-red-400 mt-0.5">{item.stockStatus}</p>}
                          {item.deliveryTime && <p className="text-xs text-green-500 mt-0.5">Забрать сегодня</p>}
                        </div>
                      </div>
                      {item.salePrice && (
                        <Badge variant="sale" className="absolute bottom-2 right-3 text-black">
                          Распродажа
                        </Badge>
                      )}
                    </div>
                  ))}

                  {/* Добавляем разделитель и информацию о сумме и кешбеке */}
                  <div className="pt-1 mt-1 border-t border-border/30 dark:border-border/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Общая сумма:</span>
                      {/* Обновленное отображение общей суммы */}
                      <span className="font-medium text-base">
                        {appliedPromoDiscount > 0 && (
                          <span className="text-muted-foreground line-through mr-2">
                            {formatPrice(totalBeforePromo)}
                          </span>
                        )}
                        <span className={appliedPromoDiscount > 0 ? "text-green-500" : ""}>
                          {formatPrice(orderData.total)}
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center text-white">
                        <span className="text-sm text-[#D3DF3D] text-foreground">Баллы за покупку:</span>
                      </div>
                      <span className="font-medium text-sm text-green-500">
                        +{formatPrice(Math.round(orderData.subtotal * 0.05))}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      5% от суммы заказа будет начислено на ваш бонусный счет
                    </p>
                  </div>

                  {/* Промокод блок */}
                  <div className="pt-4 mt-4 border-t border-border/30 dark:border-border/20">
                    <h2 className="text-sm sm:text-base md:text-lg font-medium mb-3">Промокод</h2>
                    {showPromoCodeInput ? (
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Введите промокод"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-600 bg-[#1F1F1F] text-white focus:outline-none focus:ring-1 focus:ring-[#D3DF3D] focus:border-[#D3DF3D]"
                        />
                        <Button
                          className="bg-[#D3DF3D] hover:bg-[#C4CF2E] text-black text-xs py-1 px-4"
                          onClick={() => {
                            if (promoCode === "2025") {
                              setAppliedPromoDiscount(1000) // Устанавливаем скидку промокода
                              updateOrderTotals(items, 1000) // Пересчитываем итоги с новой скидкой
                              setShowPromoCodeInput(false) // Скрываем поле ввода
                              toast({
                                title: "Промокод применен!",
                                description: "Скидка 1000 ₽ успешно активирована.",
                                variant: "promoSuccess", // Изменено на новый вариант
                              })
                            } else {
                              setAppliedPromoDiscount(0) // Сбрасываем скидку промокода
                              updateOrderTotals(items, 0) // Пересчитываем итоги без скидки промокода
                              toast({
                                title: "Неверный промокод",
                                description: "Пожалуйста, проверьте введенный промокод.",
                                variant: "destructive",
                              })
                            }
                          }}
                        >
                          Применить
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center bg-[#D3DF3D]/20 p-3 rounded-md">
                        <span className="text-sm text-[#D3DF3D]">Промокод применен: 2025</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setShowPromoCodeInput(true) // Показываем поле ввода
                            setPromoCode("") // Очищаем промокод
                            setAppliedPromoDiscount(0) // Сбрасываем скидку
                            updateOrderTotals(items, 0) // Пересчитываем итоги без скидки промокода
                          }}
                        >
                          Изменить
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-4 text-center">
                  <div className="mx-auto w-12 h-12 mb-2 text-muted-foreground flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="8" cy="21" r="1" />
                      <circle cx="19" cy="21" r="1" />
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium mb-1">Ваша корзина пуста</h3>
                  <p className="text-xs text-muted-foreground mb-2">Добавьте товары в корзину, чтобы оформить заказ</p>
                  <Link href="/category/tires">
                    <Button className="bg-[#D3DF3D] hover:bg-[#C4CF2E] text-black text-xs py-1">
                      Перейти к каталогу
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          {hasItems && (
            <>
              <Card className="border border-border/40 dark:border-border/20 shadow-sm bg-card dark:bg-[#2A2A2A] h-auto">
                <CardHeader className="pb-1 sm:pb-2 pt-2 sm:pt-3">
                  <h2 className="text-sm sm:text-base md:text-lg font-medium">Способ получения</h2>
                </CardHeader>
                <CardContent className="pt-0 pb-2 overflow-auto max-h-[calc(100vh-200px)]">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("pickup")}
                      className={`flex-1 flex items-center justify-center space-x-1 border rounded-lg p-2 cursor-pointer bg-[#1F1F1F] ${
                        deliveryMethod === "pickup"
                          ? "bg-[#D3DF3D] text-black"
                          : "border-border/30 dark:border-border/20 text-white"
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <MapPin
                          className={`h-3 w-3 mr-1 ${deliveryMethod === "pickup" ? "text-black" : "text-white"}`}
                        />
                        <span className="font-medium text-xs text-center">Самовывоз</span>
                      </div>
                      {deliveryMethod === "pickup" && <Check className="h-3 w-3 text-black ml-1" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("delivery")}
                      className={`flex-1 flex items-center justify-center space-x-1 border rounded-lg p-2 cursor-pointer bg-[#1F1F1F] ${
                        deliveryMethod === "delivery"
                          ? "bg-[#D3DF3D] text-black"
                          : "border-border/30 dark:border-border/20 text-white"
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <Truck
                          className={`h-3 w-3 mr-1 ${deliveryMethod === "delivery" ? "text-black" : "text-white"}`}
                        />
                        <span className="font-medium text-xs text-center">Доставка</span>
                      </div>
                      {deliveryMethod === "delivery" && <Check className="h-3 w-3 text-black ml-1" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("russia")}
                      className={`flex-1 flex items-center justify-center space-x-1 border rounded-lg p-2 cursor-pointer bg-[#1F1F1F] ${
                        deliveryMethod === "russia"
                          ? "bg-[#D3DF3D] text-black"
                          : "border-border/30 dark:border-border/20 text-white"
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <Globe
                          className={`h-3 w-3 mr-1 ${deliveryMethod === "russia" ? "text-black" : "text-white"}`}
                        />
                        <span className="font-medium text-xs text-center">Доставка по России</span>
                      </div>
                      {deliveryMethod === "russia" && <Check className="h-3 w-3 text-black ml-1" />}
                    </button>
                  </div>

                  {deliveryMethod === "pickup" && (
                    <div className="bg-[#2A2A2A] rounded-lg p-4">
                      <h2 className="text-lg font-bold mb-4">Выберите магазин</h2>
                      <div className="space-y-4">
                        {selectedStore ? (
                          <>
                            {stores
                              .filter((store) => store.id === selectedStore)
                              .map((store) => (
                                <div key={store.id} className="border border-gray-600 rounded-lg p-4">
                                  <div className="flex items-start gap-3">
                                    <input
                                      type="radio"
                                      name="store"
                                      value={store.id}
                                      checked={true}
                                      className="mt-1"
                                      readOnly
                                    />
                                    <div className="flex-1">
                                      <div className="font-medium">{store.name}</div>
                                      <div className="text-sm text-gray-400">{store.address}</div>
                                      <div className="text-sm text-gray-400">{store.phone}</div>

                                      {/* Яндекс карта */}
                                      <div className="mt-3">
                                        <iframe
                                          src={`https://yandex.ru/map-widget/v1/?ll=${store.coordinates}&z=16&pt=${store.coordinates},pm2rdm`}
                                          width="100%"
                                          height="200"
                                          frameBorder="0"
                                          className="rounded-lg"
                                          title={`Карта ${store.name}`}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedStore("")}
                                    className="mt-4 text-sm text-blue-400 hover:text-blue-300"
                                  >
                                    Выбрать другой магазин
                                  </button>
                                </div>
                              ))}
                          </>
                        ) : (
                          <>
                            {stores.map((store) => (
                              <div key={store.id} className="border border-gray-600 rounded-lg p-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="store"
                                    value={store.id}
                                    checked={selectedStore === store.id}
                                    onChange={(e) => setSelectedStore(e.target.value)}
                                    className="mt-1"
                                  />
                                  <div className="flex-1">
                                    <div className="font-medium">{store.name}</div>
                                    <div className="text-sm text-gray-400">{store.address}</div>
                                    <div className="text-sm text-gray-400">{store.phone}</div>

                                    {/* Яндекс карта */}
                                    <div className="mt-3">
                                      <iframe
                                        src={`https://yandex.ru/map-widget/v1/?ll=${store.coordinates}&z=16&pt=${store.coordinates},pm2rdm`}
                                        width="100%"
                                        height="200"
                                        frameBorder="0"
                                        className="rounded-lg"
                                        title={`Карта ${store.name}`}
                                      />
                                    </div>
                                  </div>
                                </label>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {deliveryMethod === "delivery" && (
                    <div className="bg-[#2A2A2A] rounded-lg p-4 mt-4">
                      <h2 className="text-lg font-bold mb-4">Доставка по городу</h2>

                      {/* Список сохраненных адресов */}
                      {!showNewAddressForm && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-3">Выберите адрес доставки</h3>
                          <div className="space-y-2">
                            {savedAddresses.map((address) => (
                              <label
                                key={address.id}
                                className="flex items-start justify-between p-3 border border-gray-600 rounded-lg cursor-pointer hover:bg-[#3A3A3A]"
                              >
                                <div className="flex items-start">
                                  <input
                                    type="radio"
                                    name="deliveryAddress"
                                    value={address.id}
                                    checked={selectedAddress === address.id}
                                    onChange={() => handleAddressSelect(address.id)}
                                    className="mr-3 mt-1"
                                  />
                                  <div>
                                    <div className="font-medium text-white">{address.name}</div>
                                    <div className="text-sm text-gray-400">{address.street}</div>
                                    <div className="text-sm text-gray-400">{address.city}</div>
                                    {address.isDefault && (
                                      <div className="text-xs text-[#D3DF3D] mt-1">По умолчанию</div>
                                    )}
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>

                          {/* Кнопка добавления нового адреса */}
                          <button
                            type="button"
                            onClick={handleAddNewAddressFormClick}
                            className="w-full mt-3 p-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Добавить новый адрес
                          </button>
                        </div>
                      )}

                      {/* Форма нового адреса */}
                      {showNewAddressForm && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-3">Новый адрес доставки</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Город</label>
                              <input
                                type="text"
                                value={newAddress.city}
                                onChange={(e) => handleAddressChange("city", e.target.value)}
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-[#1F1F1F] text-white focus:outline-none focus:ring-1 focus:ring-[#D3DF3D] focus:border-[#D3DF3D]"
                                placeholder="Москва"
                              />
                            </div>

                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Улица, дом, квартира</label>
                              <input
                                type="text"
                                value={newAddress.street}
                                onChange={(e) => handleAddressChange("street", e.target.value)}
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-[#1F1F1F] text-white focus:outline-none focus:ring-1 focus:ring-[#D3DF3D] focus:border-[#D3DF3D]"
                                placeholder="ул. Пушкина, д. 10, кв. 42"
                              />
                            </div>

                            <div>
                              <label className="flex items-center text-sm text-gray-300">
                                <input
                                  type="checkbox"
                                  checked={newAddress.isDefault}
                                  onChange={(e) => handleAddressChange("isDefault", e.target.checked.toString())}
                                  className="mr-2"
                                />
                                Сделать адресом по умолчанию
                              </label>
                            </div>

                            {/* Кнопки управления */}
                            <div className="flex space-x-2 pt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowNewAddressForm(false)
                                  setNewAddress({
                                    street: "",
                                    city: "",
                                    region: "",
                                    zipCode: "",
                                    isDefault: savedAddresses.length === 0,
                                  })
                                }}
                                className="flex-1 px-4 py-2 text-sm border border-gray-600 rounded-md text-gray-400 hover:text-gray-300 hover:border-gray-500 transition-colors"
                              >
                                Отмена
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  // В реальном приложении здесь был бы API-запрос для сохранения адреса
                                  console.log("Сохранение нового адреса:", newAddress)
                                  setShowNewAddressForm(false)
                                  // Здесь можно добавить логику для добавления адреса в список savedAddresses
                                }}
                                className="flex-1 px-4 py-2 text-sm bg-[#D3DF3D] text-black rounded-md hover:bg-[#C4CF2E] transition-colors font-medium"
                              >
                                Сохранить
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Информация о доставке */}
                      <div className="bg-[#1F1F1F] rounded-lg p-4">
                        <h3 className="text-sm font-medium mb-3">Информация о доставке</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Стоимость доставки:</span>
                            <span className="text-sm font-medium text-white">{formatPrice(500)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Срок доставки:</span>
                            <span className="text-sm font-medium text-white">1-2 дня</span>
                          </div>
                          <div className="border-t border-gray-600 pt-2 mt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-white">Итого к оплате:</span>
                              <span className="text-lg font-bold text-[#D3DF3D]">
                                {formatPrice(orderData.total + 500)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {deliveryMethod === "russia" && (
                    <div className="bg-[#2A2A2A] rounded-lg p-4 mt-4">
                      <h2 className="text-lg font-bold mb-4">Доставка по России</h2>

                      {/* Выбор транспортной компании */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium mb-3">Выберите транспортную компанию</h3>
                        <div className="space-y-2">
                          {deliveryCompanies.map((company) => (
                            <label
                              key={company.id}
                              className="flex items-center justify-between p-3 border border-gray-600 rounded-lg cursor-pointer hover:bg-[#3A3A3A]"
                            >
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  name="deliveryCompany"
                                  value={company.id}
                                  checked={selectedDeliveryCompany === company.id}
                                  onChange={(e) => setSelectedDeliveryCompany(Number(e.target.value))}
                                  className="mr-3"
                                />
                                <div>
                                  <div className="font-medium text-white">{company.name}</div>
                                  <div className="text-sm text-gray-400">{company.days} дней</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-white">{formatPrice(company.price)}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Данные получателя */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium mb-3">Данные получателя</h3>

                        <div className="mb-3">
                          <label className="flex items-center text-sm text-gray-300">
                            <input
                              type="checkbox"
                              checked={useCustomerAsRecipient}
                              onChange={(e) => handleUseCustomerAsRecipient(e.target.checked)}
                              className="mr-2"
                            />
                            Получатель совпадает с покупателем
                          </label>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">ФИО получателя</label>
                            <input
                              type="text"
                              value={recipientInfo.name}
                              onChange={(e) => handleRecipientChange("name", e.target.value)}
                              className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-[#1F1F1F] text-white focus:outline-none focus:ring-1 focus:ring-[#D3DF3D] focus:border-[#D3DF3D]"
                              placeholder="Введите ФИО получателя"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Телефон получателя</label>
                            <input
                              type="tel"
                              value={recipientInfo.phone}
                              onChange={(e) => handleRecipientChange("phone", e.target.value)}
                              className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-[#1F1F1F] text-white focus:outline-none focus:ring-1 focus:ring-[#D3DF3D] focus:border-[#D3DF3D]"
                              placeholder="+7 (999) 123-45-67"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Email получателя</label>
                            <input
                              type="email"
                              value={recipientInfo.email}
                              onChange={(e) => handleRecipientChange("email", e.target.value)}
                              className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-[#1F1F1F] text-white focus:outline-none focus:ring-1 focus:ring-[#D3DF3D] focus:border-[#D3DF3D]"
                              placeholder="example@mail.com"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Адрес доставки */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium mb-3">Адрес доставки</h3>
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Регион</label>
                            <input
                              type="text"
                              value={newAddress.region || ""}
                              onChange={(e) => handleAddressChange("region", e.target.value)}
                              className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-[#1F1F1F] text-white focus:outline-none focus:ring-1 focus:ring-[#D3DF3D] focus:border-[#D3DF3D]"
                              placeholder="Московская область"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Город</label>
                            <input
                              type="text"
                              value={newAddress.city}
                              onChange={(e) => handleAddressChange("city", e.target.value)}
                              className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-[#1F1F1F] text-white focus:outline-none focus:ring-1 focus:ring-[#D3DF3D] focus:border-[#D3DF3D]"
                              placeholder="Москва"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Улица, дом, квартира</label>
                            <input
                              type="text"
                              value={newAddress.street}
                              onChange={(e) => handleAddressChange("street", e.target.value)}
                              className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-[#1F1F1F] text-white focus:outline-none focus:ring-1 focus:ring-[#D3DF3D] focus:border-[#D3DF3D]"
                              placeholder="ул. Пушкина, д. 10, кв. 42"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Итоговая информация */}
                      <div className="bg-[#1F1F1F] rounded-lg p-4">
                        <h3 className="text-sm font-medium mb-3">Информация о доставке</h3>
                        {(() => {
                          const selectedCompany = deliveryCompanies.find((c) => c.id === selectedDeliveryCompany)
                          return selectedCompany ? (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Транспортная компания:</span>
                                <span className="text-sm font-medium text-white">{selectedCompany.name}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Стоимость доставки:</span>
                                <span className="text-sm font-medium text-white">
                                  {formatPrice(selectedCompany.price)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Срок доставки:</span>
                                <span className="text-sm font-medium text-white">{selectedCompany.days} дней</span>
                              </div>
                              <div className="border-t border-gray-600 pt-2 mt-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-white">Итого к оплате:</span>
                                  <span className="text-lg font-bold text-[#D3DF3D]">
                                    {formatPrice(orderData.total + selectedCompany.price)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : null
                        })()}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="border border-border/40 dark:border-border/20 shadow-sm bg-card dark:bg-[#2A2A2A]">
                <CardFooter className="pt-2">
                  <Button
                    className="w-full py-1.5 sm:py-2 text-xs sm:text-sm bg-[#D3DF3D] hover:bg-[#C4CF2E] text-black font-medium"
                    onClick={handleProceedToCheckout}
                    disabled={!hasItems}
                  >
                    Завершить оформление
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}
        </div>
        <Card className="border border-border/40 dark:border-border/20 shadow-sm bg-card dark:bg-[#2A2A2A] h-auto overflow-visible z-10 mt-[25px]">
          <CardHeader className="pb-1 sm:pb-2 pt-2 sm:pt-3 flex flex-row items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-sm sm:text-base md:text-lg font-medium">Данные покупателя</h2>
              <button
                onClick={() => setIsCustomerCardCollapsed(!isCustomerCardCollapsed)}
                className="ml-2 text-muted-foreground hover:text-foreground"
                aria-label={isCustomerCardCollapsed ? "Развернуть" : "Свернуть"}
              >
                {isCustomerCardCollapsed ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-down"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-up"
                  >
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                )}
              </button>
            </div>
            {!isCustomerCardCollapsed && !isEditingCustomer ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                onClick={() => setIsEditingCustomer(true)}
              >
                Изменить
              </Button>
            ) : !isCustomerCardCollapsed && isEditingCustomer ? (
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setIsEditingCustomer(false)
                    setEditedCustomer({
                      name: orderData.customer.name,
                      phone: orderData.customer.phone,
                      email: orderData.customer.email,
                    })
                  }}
                >
                  Отмена
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs px-2 text-[#D3DF3D] hover:text-[#C4CF2E]"
                  onClick={saveCustomerChanges}
                >
                  Сохранить
                </Button>
              </div>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-1 pt-0 pb-2">
            {isCustomerCardCollapsed ? (
              <div className="flex items-center">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-transparent mr-2">
                  <User className="h-3 w-3 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{orderData.customer.name}</p>
                </div>
              </div>
            ) : !isEditingCustomer ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                <div className="flex items-center">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-transparent mr-2">
                    <User className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">ФИО</p>
                    <p className="text-sm font-medium">{orderData.customer.name}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-transparent mr-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Телефон</p>
                    <p className="text-sm font-medium">{orderData.customer.phone}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-transparent mr-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{orderData.customer.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="space-y-1">
                  <label htmlFor="customer-name" className="text-xs text-muted-foreground flex items-center">
                    <User className="h-3 w-3 mr-1" /> ФИО
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    value={editedCustomer.name}
                    onChange={(e) => handleCustomerChange("name", e.target.value)}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md border border-border/30 dark:border-border/20 bg-background dark:bg-[#1F1F1F] focus:outline-none focus:ring-1 focus:ring-[#D3DF3D] focus:border-[#D3DF3D]"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="customer-phone" className="text-xs text-muted-foreground flex items-center">
                    <Phone className="h-3 w-3 mr-1" /> Телефон
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    value={editedCustomer.phone}
                    onChange={(e) => handleCustomerChange("phone", e.target.value)}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md border border-border/30 dark:border-border/20 bg-background dark:bg-[#1F1F1F] focus:outline-none focus:ring-1 focus:ring-[#D3DF3D] focus:border-[#D3DF3D]"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="customer-email" className="text-xs text-muted-foreground flex items-center">
                    <Mail className="h-3 w-3 mr-1" /> Email
                  </label>
                  <input
                    id="customer-email"
                    type="email"
                    value={editedCustomer.email}
                    onChange={(e) => handleCustomerChange("email", e.target.value)}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md border border-border/30 dark:border-border/20 bg-background dark:bg-[#1F1F1F] focus:outline-none focus:ring-1 focus:ring-[#D3DF3D] focus:border-[#D3DF3D]"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
