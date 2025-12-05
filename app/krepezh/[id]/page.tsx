import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/api"
import { type Fastener, getFasteners } from "@/lib/fastener-api"

interface FastenerDetailPageProps {
  params: {
    id: string
  }
}

export default async function FastenerDetailPage({ params }: FastenerDetailPageProps) {
  // In a real app, you would fetch the specific fastener by ID
  // For now, we'll get all fasteners and find the one with matching ID
  const fasteners = await getFasteners({})
  const fastener = fasteners.find((f) => f.id === params.id)

  if (!fastener) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
        <p className="mb-4">Запрашиваемый крепежный элемент не найден.</p>
        <Link href="/krepezh">
          <Button>Вернуться к списку крепежа</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-6 pb-20">
      <div className="mb-4">
        <Link href="/krepezh" className="text-sm text-gray-500 hover:text-gray-700">
          ← Назад к списку крепежа
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-80 md:h-96">
            <Image src={fastener.image || "/placeholder.svg"} alt={fastener.name} fill className="object-contain" />
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">{fastener.name}</h1>
            <p className="text-sm text-gray-500 mb-4">Артикул: {fastener.article}</p>

            <div className="text-2xl font-bold mb-4">{formatPrice(fastener.price)}</div>

            <div className="mb-6">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="text-gray-600">Тип:</div>
                <div>{getTypeName(fastener.type)}</div>

                <div className="text-gray-600">Резьба:</div>
                <div>{fastener.thread}</div>

                <div className="text-gray-600">Форма:</div>
                <div>{getShapeName(fastener.shape)}</div>

                <div className="text-gray-600">Цвет:</div>
                <div>{getColorName(fastener.color)}</div>

                <div className="text-gray-600">Наличие:</div>
                <div>{fastener.stock > 0 ? `В наличии (${fastener.stock} шт.)` : "Нет в наличии"}</div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1">
                Добавить в корзину
              </Button>
              <Button size="lg" variant="outline">
                Купить в 1 клик
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div>
          <h2 className="text-xl font-semibold mb-4">Описание</h2>
          <p className="text-gray-700 mb-4">{getDescription(fastener)}</p>

          <h3 className="text-lg font-semibold mb-2">Применение</h3>
          <p className="text-gray-700 mb-4">
            Данный крепежный элемент используется для надежной фиксации колесных дисков на ступице автомобиля.
            Прав��льный подбор крепежа обеспечивает безопасность и долговечность эксплуатации колес.
          </p>
        </div>
      </div>
    </div>
  )
}

function getTypeName(type: string): string {
  const types: Record<string, string> = {
    nut: "Гайка",
    bolt: "Болт",
    "lock-nut": "Гайка секретка",
    "lock-bolt": "Болт секретка",
  }
  return types[type] || type
}

function getShapeName(shape: string): string {
  const shapes: Record<string, string> = {
    cone: "Конус",
    sphere: "Сфера",
    washer: "Шайба",
  }
  return shapes[shape] || shape
}

function getColorName(color: string): string {
  const colors: Record<string, string> = {
    silver: "Серебро",
    black: "Черный",
  }
  return colors[color] || color
}

function getDescription(fastener: Fastener): string {
  const typeText = getTypeName(fastener.type).toLowerCase()
  const shapeText = getShapeName(fastener.shape).toLowerCase()
  const colorText = getColorName(fastener.color).toLowerCase()

  if (fastener.type === "nut" || fastener.type === "lock-nut") {
    return `Колесная ${typeText} с резьбой ${fastener.thread} и ${shapeText}ной посадочной поверхностью. Цвет: ${colorText}. Изготовлена из высококачественной стали, обеспечивает надежную фиксацию колесного диска на ступице автомобиля.`
  } else {
    return `Колесный ${typeText} с резьбой ${fastener.thread} и ${shapeText}ной посадочной поверхностью. Цвет: ${colorText}. Изготовлен из высококачественной стали, обеспечивает надежную фиксацию колесного диска на ступице автомобиля.`
  }
}
