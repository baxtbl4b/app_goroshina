"use client"

import { SafeAreaHeader } from "@/components/safe-area-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#1F1F1F]">
      <SafeAreaHeader title="Политика использования cookies" showBackButton={true} />

      <main className="pt-[82px]">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          <Card className="bg-white dark:bg-[#2A2A2A]">
            <CardHeader>
              <CardTitle className="text-[#1F1F1F] dark:text-white">Политика использования файлов cookie</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <div className="space-y-6 text-[#1F1F1F] dark:text-gray-300">
                <section>
                  <h3 className="text-lg font-semibold mb-3">Что такое файлы cookie?</h3>
                  <p className="mb-3">
                    Файлы cookie - это небольшие текстовые файлы, которые сохраняются на вашем устройстве (компьютере,
                    планшете или мобильном телефоне) при посещении веб-сайтов или использовании мобильных приложений.
                  </p>
                  <p>
                    Эти файлы содержат информацию о ваших предпочтениях и действиях на сайте, что позволяет нам улучшить
                    ваш пользовательский опыт.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Какие типы cookie мы используем?</h3>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">1. Необходимые cookie</h4>
                    <p className="mb-2">
                      Эти файлы cookie необходимы для работы нашего сайта и приложения. Они обеспечивают базовые
                      функции, такие как:
                    </p>
                    <ul className="list-disc pl-6 mb-3">
                      <li>Аутентификация пользователей</li>
                      <li>Безопасность сеансов</li>
                      <li>Сохранение содержимого корзины</li>
                      <li>Запоминание языковых настроек</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">2. Функциональные cookie</h4>
                    <p className="mb-2">Эти файлы cookie позволяют нам запоминать ваши предпочтения и настройки:</p>
                    <ul className="list-disc pl-6 mb-3">
                      <li>Тема оформления (светлая/темная)</li>
                      <li>Размер шрифта</li>
                      <li>Региональные настройки</li>
                      <li>Избранные товары</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">3. Аналитические cookie</h4>
                    <p className="mb-2">Мы используем эти файлы cookie для анализа использования нашего сайта:</p>
                    <ul className="list-disc pl-6 mb-3">
                      <li>Количество посетителей</li>
                      <li>Популярные страницы и функции</li>
                      <li>Время, проведенное на сайте</li>
                      <li>Источники трафика</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">4. Маркетинговые cookie</h4>
                    <p className="mb-2">Эти файлы cookie помогают нам показывать вам релевантную рекламу:</p>
                    <ul className="list-disc pl-6 mb-3">
                      <li>Персонализированные рекомендации товаров</li>
                      <li>Ретаргетинговая реклама</li>
                      <li>Отслеживание эффективности рекламных кампаний</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Сторонние cookie</h3>
                  <p className="mb-3">
                    Мы также можем использовать сторонние сервисы, которые устанавливают свои собственные файлы cookie:
                  </p>
                  <ul className="list-disc pl-6 mb-3">
                    <li>
                      <strong>Google Analytics</strong> - для анализа трафика и поведения пользователей
                    </li>
                    <li>
                      <strong>Яндекс.Метрика</strong> - для веб-аналитики
                    </li>
                    <li>
                      <strong>Facebook Pixel</strong> - для отслеживания конверсий
                    </li>
                    <li>
                      <strong>Платежные системы</strong> - для обработки платежей
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Как управлять файлами cookie?</h3>
                  <p className="mb-3">Вы можете управлять использованием файлов cookie несколькими способами:</p>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Настройки браузера</h4>
                    <p className="mb-2">Большинство браузеров позволяют вам:</p>
                    <ul className="list-disc pl-6 mb-3">
                      <li>Просматривать сохраненные cookie</li>
                      <li>Удалять отдельные или все cookie</li>
                      <li>Блокировать cookie от определенных сайтов</li>
                      <li>Блокировать сторонние cookie</li>
                      <li>Получать уведомления при установке cookie</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Настройки в приложении</h4>
                    <p className="mb-2">В нашем мобильном приложении вы можете:</p>
                    <ul className="list-disc pl-6 mb-3">
                      <li>Отключить аналитические cookie</li>
                      <li>Отказаться от персонализированной рекламы</li>
                      <li>Очистить сохраненные данные</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Последствия отключения cookie</h3>
                  <p className="mb-3">
                    Отключение определенных типов cookie может повлиять на функциональность нашего сайта и приложения:
                  </p>
                  <ul className="list-disc pl-6 mb-3">
                    <li>Необходимость повторного входа в систему при каждом посещении</li>
                    <li>Потеря содержимого корзины</li>
                    <li>Сброс пользовательских настроек</li>
                    <li>Менее персонализированный опыт использования</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Срок хранения cookie</h3>
                  <p className="mb-3">Различные типы cookie хранятся в течение разных периодов времени:</p>
                  <ul className="list-disc pl-6 mb-3">
                    <li>
                      <strong>Сессионные cookie</strong> - удаляются при закрытии браузера
                    </li>
                    <li>
                      <strong>Постоянные cookie</strong> - хранятся от нескольких дней до нескольких лет
                    </li>
                    <li>
                      <strong>Аналитические cookie</strong> - обычно хранятся до 2 лет
                    </li>
                    <li>
                      <strong>Маркетинговые cookie</strong> - могут храниться до 1 года
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Безопасность и конфиденциальность</h3>
                  <p className="mb-3">Мы серьезно относимся к защите ваших данных:</p>
                  <ul className="list-disc pl-6 mb-3">
                    <li>Cookie не содержат личную информацию, такую как пароли или номера карт</li>
                    <li>Мы используем шифрование для защиты чувствительных данных</li>
                    <li>Доступ к данным cookie ограничен только авторизованным сотрудникам</li>
                    <li>Мы регулярно проверяем и обновляем наши меры безопасности</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Изменения в политике cookie</h3>
                  <p className="mb-3">
                    Мы можем периодически обновлять эту политику использования cookie. О существенных изменениях мы
                    будем уведомлять вас через:
                  </p>
                  <ul className="list-disc pl-6 mb-3">
                    <li>Уведомления в приложении</li>
                    <li>Email-рассылку</li>
                    <li>Баннеры на сайте</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Контактная информация</h3>
                  <p className="mb-3">
                    Если у вас есть вопросы о нашем использовании файлов cookie, вы можете связаться с нами:
                  </p>
                  <ul className="list-disc pl-6 mb-3">
                    <li>Email: privacy@goroshina.ru</li>
                    <li>Телефон: +7 (800) 123-45-67</li>
                    <li>Почтовый адрес: 123456, г. Москва, ул. Примерная, д. 1</li>
                  </ul>
                </section>

                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">
                    Согласие на использование cookie
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Продолжая использовать наш сайт и приложение, вы соглашаетесь с использованием файлов cookie в
                    соответствии с данной политикой. Вы можете изменить настройки cookie в любое время в настройках
                    вашего браузера или приложения.
                  </p>
                </div>

                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                  <p>Последнее обновление: 15 декабря 2024 года</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
