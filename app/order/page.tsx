"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, ChevronLeft, MapPin, Plus, Truck, Trash2, User, Phone, Mail, Globe, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatPrice } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import CartQuantityButtons from "@/components/cart-quantity-buttons"

// Интерфейс для товара в корзине
interface CartItem {
  id: string
  name: string
  brand?: string
  model?: string
  width?: string | number
  height?: string | number
  diam?: string | number
  diameter?: string
  quantity: number
  price?: number
  rrc?: number
  image?: string
  load_index?: string | number
  speed_index?: string
  season?: string
  stock?: number
  provider?: string
}

// Данные покупателя по умолчанию
const defaultCustomer = {
  name: "",
  phone: "",
  email: "",
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

  // Состояние для товаров корзины (загружается из localStorage)
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Данные покупателя
  const [customer, setCustomer] = useState(defaultCustomer)

  // Загрузка корзины из localStorage при монтировании
  useEffect(() => {
    const loadCart = () => {
      try {
        const cartData = localStorage.getItem("cart")
        if (cartData) {
          const parsedCart = JSON.parse(cartData) as CartItem[]
          setItems(parsedCart)
        }
      } catch (error) {
        console.error("Ошибка загрузки корзины:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()

    // Слушаем изменения корзины
    const handleCartUpdate = () => loadCart()
    window.addEventListener("cartUpdated", handleCartUpdate)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

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
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
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

  // Функция для обновления количества товара
  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return // Не позволяем установить количество меньше 1

    // Обновляем количество товара
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity }
      }
      return item
    })

    // Сохраняем в localStorage
    localStorage.setItem("cart", JSON.stringify(updatedItems))

    // Обновляем состояние
    setItems(updatedItems)

    // Отправляем событие для обновления других компонентов
    window.dispatchEvent(new Event("cartUpdated"))
  }

  // Функция для удаления товара
  const removeItem = (itemId: string) => {
    // Удаляем товар из списка
    const updatedItems = items.filter((item) => item.id !== itemId)

    // Сохраняем в localStorage
    localStorage.setItem("cart", JSON.stringify(updatedItems))

    // Обновляем состояние
    setItems(updatedItems)

    // Отправляем событие для обновления других компонентов
    window.dispatchEvent(new Event("cartUpdated"))
  }

  // Вычисляемые значения для итогов
  const getItemPrice = (item: CartItem) => item.price || item.rrc || 0
  const subtotal = items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0)
  const cashbackAmount = Math.round(subtotal * 0.05)
  const totalDiscount = cashbackAmount + appliedPromoDiscount
  const total = subtotal - appliedPromoDiscount

  // Проверяем, есть ли товары в заказе
  const hasItems = items.length > 0
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalWeight = totalQuantity * 10 // Примерный вес шины ~10 кг

  // Хелпер для получения размера шины
  const getTireSize = (item: CartItem) => {
    if (item.width && item.height && (item.diam || item.diameter)) {
      return `${item.width}/${item.height} R${item.diam || item.diameter}`
    }
    return ""
  }

  // Хелпер для получения названия сезона
  const getSeasonName = (season?: string) => {
    switch (season) {
      case "w": return "Зима"
      case "s": return "Лето"
      case "a": return "Всесезонные"
      default: return ""
    }
  }

  // Хелпер для получения изображения по умолчанию
  const getDefaultImage = (season?: string) => {
    switch (season) {
      case "w": return "/images/winter-tire-new.png"
      case "a": return "/images/all-season-new.png"
      default: return "/images/summer-tire-new.png"
    }
  }

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
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
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
    // Обновляем данные покупателя
    setCustomer(editedCustomer)
    setIsEditingCustomer(false)
  }

  // Add a new state variable for tracking the collapsed state
  const [isCustomerCardCollapsed, setIsCustomerCardCollapsed] = useState(false)

  const handleAddNewAddressFormClick = () => {
    setSelectedAddress(null)
    setShowNewAddressForm(true)
  }

  // Calculate total before promo discount
  const totalBeforePromo = subtotal

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#1F1F1F] pr-4 shadow-sm h-[60px] flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <button
              onClick={() => router.push("/")}
              className="p-2 transition-colors"
              aria-label="Назад"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <span className="text-xl font-bold text-white">Оформление заказа</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-3 sm:px-4 pt-4 pb-6">
        <div className="flex flex-col gap-4">
          {/* Корзина */}
          <Card className="border-0 shadow-lg bg-[#2A2A2A] rounded-2xl overflow-hidden">
            <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
              <h3 className="font-semibold text-lg">Ваша корзина</h3>
              {hasItems && (
                <span className="text-sm text-muted-foreground bg-[#3A3A3A] px-3 py-1 rounded-full">
                  {totalQuantity} шт / {totalWeight} кг
                </span>
              )}
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              {hasItems ? (
                <>
                  {items.map((item) => {
                    const itemPrice = getItemPrice(item)
                    const tireSize = getTireSize(item)
                    const seasonName = getSeasonName(item.season)
                    const imageUrl = item.image || getDefaultImage(item.season)
                    const loadSpeedIndex = item.load_index && item.speed_index
                      ? `${item.load_index}${item.speed_index}`
                      : ""

                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 p-4 bg-[#1F1F1F] rounded-2xl relative"
                      >
                        {/* Левая колонка: Изображение и кнопки количества */}
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex-shrink-0 bg-[#2A2A2A] rounded-xl overflow-hidden">
                            <Image
                              src={imageUrl}
                              alt={item.name || "Товар"}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <CartQuantityButtons
                            count={item.quantity}
                            maxStock={item.stock}
                            onAdd={(e) => { e.preventDefault(); updateItemQuantity(item.id, item.quantity + 1) }}
                            onRemove={(e) => { e.preventDefault(); updateItemQuantity(item.id, item.quantity - 1) }}
                            variant="inline"
                            showUnit
                          />
                        </div>

                        {/* Правая колонка: Детали товара */}
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-bold text-lg text-[#D3DF3D]">
                                {formatPrice(itemPrice)}
                              </span>
                              {tireSize && (
                                <p className="text-sm text-gray-400 mt-0.5">
                                  {tireSize}
                                  {loadSpeedIndex && (
                                    <span className="ml-1 text-gray-500">{loadSpeedIndex}</span>
                                  )}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {seasonName && (
                                <span className="text-xs text-gray-400 bg-[#2A2A2A] px-2 py-1 rounded-lg">
                                  {seasonName}
                                </span>
                              )}
                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                aria-label="Удалить товар"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <h3 className="font-medium text-sm text-white leading-tight">
                            {item.name || `${item.brand || ""} ${item.model || ""}`}
                          </h3>

                          {item.stock !== undefined && item.stock <= 4 && (
                            <p className="text-xs text-orange-400 mt-2 bg-orange-400/10 px-2 py-1 rounded-lg inline-block w-fit">
                              {item.stock === 1 ? "Последний!" : `Осталось ${item.stock} шт`}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {/* Итоги */}
                  <div className="bg-[#1F1F1F] rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Сумма заказа:</span>
                      <span className="font-medium text-lg">
                        {appliedPromoDiscount > 0 && (
                          <span className="text-gray-500 line-through mr-2 text-base">
                            {formatPrice(subtotal)}
                          </span>
                        )}
                        <span className={appliedPromoDiscount > 0 ? "text-green-400" : "text-white"}>
                          {formatPrice(total)}
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#3A3A3A]">
                      <span className="text-[#D3DF3D]">Баллы за покупку:</span>
                      <span className="font-medium text-[#D3DF3D]">
                        +{formatPrice(cashbackAmount)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      5% от суммы заказа будет начислено на ваш бонусный счет
                    </p>
                  </div>

                  {/* Промокод блок */}
                  <div className="bg-[#1F1F1F] rounded-2xl p-4">
                    <h2 className="text-sm font-medium mb-3 text-gray-300">Промокод</h2>
                    {showPromoCodeInput ? (
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Введите промокод"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 px-4 py-2.5 text-sm rounded-xl border-0 bg-[#2A2A2A] text-white focus:outline-none focus:ring-2 focus:ring-[#D3DF3D]/50"
                        />
                        <Button
                          className="bg-[#D3DF3D] hover:bg-[#C4CF2E] text-black text-sm font-medium py-2.5 px-5 rounded-xl"
                          onClick={() => {
                            if (promoCode === "2025") {
                              setAppliedPromoDiscount(1000)
                              setShowPromoCodeInput(false)
                              toast({
                                title: "Промокод применен!",
                                description: "Скидка 1000 ₽ успешно активирована.",
                                variant: "promoSuccess",
                              })
                            } else {
                              setAppliedPromoDiscount(0)
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
                      <div className="flex justify-between items-center bg-[#D3DF3D]/10 p-3 rounded-xl border border-[#D3DF3D]/30">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#D3DF3D]" />
                          <span className="text-sm text-[#D3DF3D]">Промокод 2025 применен</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs px-3 text-gray-400 hover:text-white hover:bg-[#3A3A3A] rounded-lg"
                          onClick={() => {
                            setShowPromoCodeInput(true)
                            setPromoCode("")
                            setAppliedPromoDiscount(0)
                          }}
                        >
                          Изменить
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-12 text-center">
                  <div className="mx-auto w-20 h-20 mb-4 bg-[#1F1F1F] rounded-2xl flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500"
                    >
                      <circle cx="8" cy="21" r="1" />
                      <circle cx="19" cy="21" r="1" />
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-white">Корзина пуста</h3>
                  <p className="text-sm text-gray-400 mb-6">Добавьте товары в корзину, чтобы оформить заказ</p>
                  <Link href="/category/tires">
                    <Button className="bg-[#D3DF3D] hover:bg-[#C4CF2E] text-black font-medium px-6 py-2.5 rounded-xl">
                      Перейти к каталогу
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          {hasItems && (
            <>
              {/* Способ получения */}
              <Card className="border-0 shadow-lg bg-[#2A2A2A] rounded-2xl overflow-hidden">
                <CardHeader className="pb-3 pt-4 px-4">
                  <h2 className="font-semibold text-lg">Способ получения</h2>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("pickup")}
                      className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all ${
                        deliveryMethod === "pickup"
                          ? "bg-[#D3DF3D] text-black"
                          : "bg-[#1F1F1F] text-white hover:bg-[#3A3A3A]"
                      }`}
                    >
                      <MapPin className="h-5 w-5" />
                      <span className="font-medium text-xs">Самовывоз</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("delivery")}
                      className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all ${
                        deliveryMethod === "delivery"
                          ? "bg-[#D3DF3D] text-black"
                          : "bg-[#1F1F1F] text-white hover:bg-[#3A3A3A]"
                      }`}
                    >
                      <Truck className="h-5 w-5" />
                      <span className="font-medium text-xs">Доставка</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("russia")}
                      className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all ${
                        deliveryMethod === "russia"
                          ? "bg-[#D3DF3D] text-black"
                          : "bg-[#1F1F1F] text-white hover:bg-[#3A3A3A]"
                      }`}
                    >
                      <Globe className="h-5 w-5" />
                      <span className="font-medium text-xs text-center">По России</span>
                    </button>
                  </div>

                  {deliveryMethod === "pickup" && (
                    <div className="mt-4 bg-[#1F1F1F] rounded-xl p-4">
                      <h3 className="text-base font-medium mb-3">Выберите магазин</h3>
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
                                {formatPrice(total + 500)}
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
                                    {formatPrice(total + selectedCompany.price)}
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

              {/* Кнопка оформления */}
              <Button
                className="w-full py-4 text-base bg-[#D3DF3D] hover:bg-[#C4CF2E] text-black font-semibold rounded-2xl shadow-lg"
                onClick={handleProceedToCheckout}
                disabled={!hasItems}
              >
                Оформить заказ · {formatPrice(total + deliveryCost)}
              </Button>
            </>
          )}
        </div>

        {/* Данные покупателя */}
        <Card className="border-0 shadow-lg bg-[#2A2A2A] rounded-2xl overflow-hidden mt-4">
          <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-lg">Данные покупателя</h2>
              <button
                onClick={() => setIsCustomerCardCollapsed(!isCustomerCardCollapsed)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#3A3A3A] rounded-lg transition-all"
                aria-label={isCustomerCardCollapsed ? "Развернуть" : "Свернуть"}
              >
                {isCustomerCardCollapsed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                )}
              </button>
            </div>
            {!isCustomerCardCollapsed && !isEditingCustomer ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs px-3 text-gray-400 hover:text-white hover:bg-[#3A3A3A] rounded-lg"
                onClick={() => setIsEditingCustomer(true)}
              >
                Изменить
              </Button>
            ) : !isCustomerCardCollapsed && isEditingCustomer ? (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs px-3 text-gray-400 hover:text-white hover:bg-[#3A3A3A] rounded-lg"
                  onClick={() => {
                    setIsEditingCustomer(false)
                    setEditedCustomer({
                      name: customer.name,
                      phone: customer.phone,
                      email: customer.email,
                    })
                  }}
                >
                  Отмена
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs px-3 bg-[#D3DF3D] hover:bg-[#C4CF2E] text-black rounded-lg"
                  onClick={saveCustomerChanges}
                >
                  Сохранить
                </Button>
              </div>
            ) : null}
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            {isCustomerCardCollapsed ? (
              <div className="flex items-center gap-3 bg-[#1F1F1F] rounded-xl p-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#2A2A2A]">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium">{customer.name || "Не указано"}</p>
              </div>
            ) : !isEditingCustomer ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 bg-[#1F1F1F] rounded-xl p-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#2A2A2A]">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ФИО</p>
                    <p className="text-sm font-medium text-white">{customer.name || "Не указано"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#1F1F1F] rounded-xl p-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#2A2A2A]">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Телефон</p>
                    <p className="text-sm font-medium text-white">{customer.phone || "Не указан"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#1F1F1F] rounded-xl p-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#2A2A2A]">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-white">{customer.email || "Не указан"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label htmlFor="customer-name" className="text-xs text-gray-400 mb-1.5 block">ФИО</label>
                  <input
                    id="customer-name"
                    type="text"
                    value={editedCustomer.name}
                    onChange={(e) => handleCustomerChange("name", e.target.value)}
                    placeholder="Введите ФИО"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border-0 bg-[#1F1F1F] text-white focus:outline-none focus:ring-2 focus:ring-[#D3DF3D]/50"
                  />
                </div>
                <div>
                  <label htmlFor="customer-phone" className="text-xs text-gray-400 mb-1.5 block">Телефон</label>
                  <input
                    id="customer-phone"
                    type="tel"
                    value={editedCustomer.phone}
                    onChange={(e) => handleCustomerChange("phone", e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border-0 bg-[#1F1F1F] text-white focus:outline-none focus:ring-2 focus:ring-[#D3DF3D]/50"
                  />
                </div>
                <div>
                  <label htmlFor="customer-email" className="text-xs text-gray-400 mb-1.5 block">Email</label>
                  <input
                    id="customer-email"
                    type="email"
                    value={editedCustomer.email}
                    onChange={(e) => handleCustomerChange("email", e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border-0 bg-[#1F1F1F] text-white focus:outline-none focus:ring-2 focus:ring-[#D3DF3D]/50"
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
