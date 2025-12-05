"use client"

import SafeAreaHeader from "@/components/safe-area-header"
import BottomNavigation from "@/components/bottom-navigation"

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      <SafeAreaHeader title="Пользовательское соглашение" showBackButton backUrl="/settings" />

      <main className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-[#2A2A2A] rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Пользовательское соглашение</h1>

            <div className="space-y-6 text-gray-300">
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">1. Общие положения</h2>
                <p className="leading-relaxed">
                  Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между ООО «Шинный
                  Центр» (далее — «Компания») и пользователем мобильного приложения и веб-сайта (далее — «Пользователь»)
                  при использовании сервисов по предоставлению услуг шиномонтажа, продаже автомобильных шин, дисков и
                  аксессуаров.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">2. Предмет соглашения</h2>
                <p className="leading-relaxed mb-3">Компания предоставляет Пользователю следующие услуги:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Шиномонтажные работы</li>
                  <li>Балансировка колес</li>
                  <li>Ремонт шин и дисков</li>
                  <li>Хранение шин</li>
                  <li>Продажа автомобильных шин, дисков и аксессуаров</li>
                  <li>Консультационные услуги</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">3. Права и обязанности сторон</h2>

                <h3 className="text-base font-medium text-white mb-2 mt-4">3.1. Компания обязуется:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Предоставлять услуги в соответствии с заявленными стандартами качества</li>
                  <li>Соблюдать сроки выполнения работ</li>
                  <li>Обеспечивать сохранность имущества Пользователя</li>
                  <li>Предоставлять гарантию на выполненные работы</li>
                </ul>

                <h3 className="text-base font-medium text-white mb-2 mt-4">3.2. Пользователь обязуется:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Предоставлять достоверную информацию при оформлении заказа</li>
                  <li>Своевременно оплачивать предоставленные услуги</li>
                  <li>Соблюдать правила поведения в сервисном центре</li>
                  <li>Уведомлять о невозможности прибытия в назначенное время</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">4. Стоимость услуг и порядок оплаты</h2>
                <p className="leading-relaxed mb-3">
                  Стоимость услуг определяется действующим прайс-листом Компании. Оплата производится наличными
                  средствами или банковской картой после выполнения работ.
                </p>
                <p className="leading-relaxed">
                  Компания оставляет за собой право изменять цены на услуги с предварительным уведомлением Пользователя.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">5. Гарантийные обязательства</h2>
                <p className="leading-relaxed mb-3">На выполненные работы предоставляется гарантия:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Шиномонтаж — 30 дней</li>
                  <li>Балансировка — 30 дней</li>
                  <li>Ремонт шин — 90 дней</li>
                  <li>Ремонт дисков — 180 дней</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">6. Ответственность сторон</h2>
                <p className="leading-relaxed mb-3">
                  Компания несет ответственность за качество выполненных работ в рамках предоставленных гарантийных
                  обязательств.
                </p>
                <p className="leading-relaxed">
                  Пользователь несет ответственность за предоставление недостоверной информации и несвоевременную оплату
                  услуг.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">7. Конфиденциальность</h2>
                <p className="leading-relaxed">
                  Компания обязуется не разглашать персональные данные Пользователя третьим лицам, за исключением
                  случаев, предусмотренных действующим законодательством РФ.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">8. Разрешение споров</h2>
                <p className="leading-relaxed">
                  Все споры и разногласия разрешаются путем переговоров. В случае невозможности достижения соглашения,
                  споры подлежат рассмотрению в суде по месту нахождения Компании.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">9. Заключительные положения</h2>
                <p className="leading-relaxed mb-3">
                  Настоящее Соглашение вступает в силу с момента начала использования услуг Компании и действует до
                  полного исполнения обязательств сторонами.
                </p>
                <p className="leading-relaxed">
                  Компания оставляет за собой право вносить изменения в настоящее Соглашение с обязательным уведомлением
                  Пользователей.
                </p>
              </section>

              <section className="border-t border-gray-600 pt-6">
                <h2 className="text-lg font-semibold text-white mb-3">Контактная информация</h2>
                <div className="space-y-2">
                  <p>
                    <strong>ООО «Шинный Центр»</strong>
                  </p>
                  <p>Адрес: г. Москва, ул. Примерная, д. 123</p>
                  <p>Телефон: +7 (495) 123-45-67</p>
                  <p>Email: info@tire-center.ru</p>
                  <p>Режим работы: Пн-Пт 9:00-20:00, Сб-Вс 10:00-18:00</p>
                </div>
              </section>

              <div className="text-center text-sm text-gray-500 mt-8">
                <p>Последнее обновление: {new Date().toLocaleDateString("ru-RU")}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
