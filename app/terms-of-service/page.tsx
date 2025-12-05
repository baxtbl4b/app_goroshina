"use client"

import SafeAreaHeader from "@/components/safe-area-header"

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      <SafeAreaHeader title="Правила пользовательского соглашения" showBackButton backUrl="/register" />

      <main className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-[#2A2A2A] rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Правила пользовательского соглашения</h1>

            <div className="space-y-6 text-gray-300">
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">1. Общие положения</h2>
                <p className="leading-relaxed">
                  Настоящие Правила пользовательского соглашения (далее — «Правила») регулируют порядок использования
                  мобильного приложения и веб-сайта, предоставляемых ООО «Шинный Центр» (далее — «Компания»).
                  Использование сервисов Компании означает полное и безоговорочное согласие Пользователя с настоящими
                  Правилами.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">2. Права и обязанности Пользователя</h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Пользователь обязуется предоставлять точную и актуальную информацию при регистрации и использовании
                    сервисов.
                  </li>
                  <li>
                    Пользователь несет ответственность за сохранность своих учетных данных и за все действия,
                    совершенные под его учетной записью.
                  </li>
                  <li>Пользователь обязуется использовать сервисы Компании исключительно в законных целях.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">3. Права и обязанности Компании</h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Компания обязуется обеспечивать бесперебойную работу сервисов в пределах своих возможностей.</li>
                  <li>
                    Компания имеет право вносить изменения в настоящие Правила в одностороннем порядке с уведомлением
                    Пользователей.
                  </li>
                  <li>
                    Компания вправе временно или полностью ограничить доступ Пользователя к сервисам в случае нарушения
                    настоящих Правил.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">4. Конфиденциальность и защита данных</h2>
                <p className="leading-relaxed">
                  Компания обязуется соблюдать конфиденциальность персональных данных Пользователя в соответствии с
                  действующим законодательством РФ и Политикой конфиденциальности Компании.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">5. Ответственность сторон</h2>
                <p className="leading-relaxed">
                  Компания не несет ответственности за любые убытки, возникшие в результате использования или
                  невозможности использования сервисов, за исключением случаев, прямо предусмотренных законодательством.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">6. Разрешение споров</h2>
                <p className="leading-relaxed">
                  Все споры и разногласия, возникающие между Пользователем и Компанией, разрешаются путем переговоров. В
                  случае недостижения согласия, споры подлежат рассмотрению в суде по месту нахождения Компании.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">7. Заключительные положения</h2>
                <p className="leading-relaxed">
                  Настоящие Правила вступают в силу с момента их публикации и действуют до момента их отмены или
                  изменения Компанией.
                </p>
              </section>

              <div className="text-center text-sm text-gray-500 mt-8">
                <p>Последнее обновление: {new Date().toLocaleDateString("ru-RU")}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
