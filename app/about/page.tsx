import Image from "next/image"
import { SafeAreaHeader } from "@/components/safe-area-header"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SafeAreaHeader title="О компании" showBackButton />

      <div className="pb-20">
        {/* Hero Image */}
        <div className="relative w-full h-64 md:h-80 lg:h-96">
          <Image
            src="/images/storefront.jpg"
            alt="Магазин Горошина - шины, диски, монтаж"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content */}
        <div className="px-4 py-6 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">Добро пожаловать в Горошина</h1>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Мы — ведущий специализированный центр по продаже шин, дисков и оказанию услуг шиномонтажа. Наша компания
                работает на рынке автомобильных услуг уже много лет, предоставляя качественные товары и профессиональные
                услуги для автовладельцев.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-3">Наши услуги</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-50">Продажа шин</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Широкий ассортимент летних, зимних и всесезонных шин
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-50">Продажа дисков</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Литые и штампованные диски различных размеров
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-50">Шиномонтаж</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Профессиональный монтаж и балансировка колес
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-50">Хранение шин</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Сезонное хранение в специально оборудованном помещении
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-3">Почему выбирают нас</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">Опытные мастера с многолетним стажем</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">
                    Современное оборудование для качественного сервиса
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">
                    Широкий выбор товаров от ведущих производителей
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">Конкурентные цены и гибкая система скидок</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">
                    Удобное расположение и комфортная зона ожидания
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-3">Наша миссия</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Обеспечить безопасность и комфорт каждого автовладельца через предоставление качественных товаров и
                профессиональных услуг. Мы стремимся быть надежным партнером для наших клиентов, предлагая
                индивидуальный подход и высокий уровень сервиса.
              </p>
            </div>

            <div className="text-center pt-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Доверьте свой автомобиль профессионалам — выберите Горошина!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
