import { ArrowLeft, Download, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function TireStoragePage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] p-4 shadow-sm">
        <div className="flex items-center">
          <Link href="/account/cars/1">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Хранение шин</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1F1F1F] dark:text-white">Toyota Camry • А123БВ777</h3>
            <span className="text-sm font-medium px-3 py-1 bg-[#D3DF3D] text-[#1F1F1F] rounded-full">Активно</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Номер договора:</span>
              <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">ХШ-2023/0458</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Дата начала хранения:</span>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-[#009CFF]" />
                <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">15.10.2023</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Дата окончания хранения:</span>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-[#009CFF]" />
                <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">15.04.2024</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Предмет хранения:</span>
              <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">
                Комплект зимних шин с дисками (4 шт.)
              </span>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-[#1F1F1F] dark:text-white mb-3">Фотография предмета хранения:</h4>
            <div className="bg-[#F5F5F5] dark:bg-[#333333] rounded-lg p-2">
              <Image
                src="/placeholder.svg?height=200&width=400"
                alt="Шины на хранении"
                width={400}
                height={200}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#D9D9DD] dark:border-[#3A3A3A]">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-[#1F1F1F] dark:text-white">Стоимость услуги:</h4>
                <p className="text-lg font-bold text-[#1F1F1F] dark:text-white">6 000 ₽</p>
              </div>
              <Button className="bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F]">
                <Download className="h-4 w-4 mr-2" />
                Скачать договор
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
          <h3 className="font-bold text-[#1F1F1F] dark:text-white mb-4">Информация о шинах</h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Марка шин:</span>
              <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">Nokian Hakkapeliitta R3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Размер:</span>
              <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">225/45 R17</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Тип дисков:</span>
              <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">Литые</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Состояние:</span>
              <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">Хорошее (4/5)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#1F1F1F] dark:text-gray-300">Особые отметки:</span>
              <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">
                Небольшие потертости на 2 дисках
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
          <h3 className="font-bold text-[#1F1F1F] dark:text-white mb-4">Условия хранения</h3>

          <div className="space-y-4 text-sm text-[#1F1F1F] dark:text-gray-300">
            <p>• Шины хранятся в специализированном помещении с контролируемой температурой и влажностью.</p>
            <p>• Каждый комплект шин проходит осмотр, очистку и упаковку перед размещением на хранение.</p>
            <p>• Доступ к шинам возможен в рабочие часы шинного центра с предварительным уведомлением за 24 часа.</p>
            <p>
              • По окончании срока хранения вы получите уведомление о необходимости забрать шины или продлить договор.
            </p>
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full border-[#009CFF] text-[#009CFF]">
              Продлить срок хранения
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
