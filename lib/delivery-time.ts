// Утилита для расчёта сроков доставки по провайдеру и складу

export type DeliveryType = "today" | "fast" | "medium" | "slow"

export interface DeliveryInfo {
  text: string
  type: DeliveryType
}

// Получить срок доставки по провайдеру (для страницы категории)
export function getDeliveryByProvider(provider: string | null | undefined): DeliveryInfo {
  if (!provider) return { text: "Доставка 7-10 дней", type: "medium" }

  const providerLower = provider.toLowerCase()

  // TireShop - Забрать сегодня
  if (providerLower === "tireshop") {
    return { text: "Забрать сегодня", type: "today" }
  }

  // Доставка 1-2 дня
  if (["brinex", "exclusive", "fourtochki", "shinservice", "yst"].includes(providerLower)) {
    return { text: "Доставка 1-2 дня", type: "fast" }
  }

  // Доставка 2-3 дня
  if (providerLower === "severauto") {
    return { text: "Доставка 2-3 дня", type: "fast" }
  }

  // Доставка 2-4 дня
  if (providerLower === "ikon") {
    return { text: "Доставка 2-4 дня", type: "medium" }
  }

  // Доставка 3-6 дней
  if (providerLower === "mosautoshina") {
    return { text: "Доставка 3-6 дней", type: "medium" }
  }

  // Доставка 5-7 дней
  if (["bagoria", "severautodist"].includes(providerLower)) {
    return { text: "Доставка 5-7 дней", type: "medium" }
  }

  // Доставка 5-9 дней
  if (providerLower === "vels") {
    return { text: "Доставка 5-9 дней", type: "medium" }
  }

  // Доставка 5-7 дней (sibzapaska всегда отдельно)
  if (providerLower === "sibzapaska") {
    return { text: "Доставка 5-7 дней", type: "medium" }
  }

  return { text: "Доставка 7-10 дней", type: "medium" }
}

// Получить срок доставки по складу и провайдеру (для страницы товара)
export function getDeliveryByWarehouse(
  location: string,
  provider: string | null | undefined
): DeliveryInfo {
  const providerLower = (provider || "").toLowerCase()

  // Локальные склады - всегда "Забрать сегодня"
  if (location === "Таллинское шоссе" || location === "Пискаревский проспект") {
    return { text: "Забрать сегодня", type: "today" }
  }

  // Склад "Санкт-Петербург"
  if (location === "Санкт-Петербург") {
    if (["brinex", "exclusive", "fourtochki", "shinservice", "yst"].includes(providerLower)) {
      return { text: "Доставка 1-2 дня", type: "fast" }
    }
    if (providerLower === "severauto") return { text: "Доставка 2-3 дня", type: "fast" }
    if (providerLower === "ikon") return { text: "Доставка 2-4 дня", type: "medium" }
    if (providerLower === "mosautoshina") return { text: "Доставка 3-6 дней", type: "medium" }
    if (["bagoria", "severautodist"].includes(providerLower)) {
      return { text: "Доставка 5-7 дней", type: "medium" }
    }
    if (providerLower === "vels") return { text: "Доставка 5-9 дней", type: "medium" }
    if (providerLower === "sibzapaska") return { text: "Доставка 5-7 дней", type: "medium" }
    return { text: "Доставка 7-10 дней", type: "medium" }
  }

  // Удаленный склад (sibzapaska) - всегда 5-7 дней
  if (location === "Удаленный склад") {
    return { text: "Доставка 5-7 дней", type: "medium" }
  }

  // Склад "Под заказ" - увеличенные сроки
  if (location === "Под заказ") {
    if (providerLower === "tireshop") return { text: "Доставка 5-7 дней", type: "medium" }
    if (providerLower === "yst") return { text: "Доставка 2-3 дня", type: "fast" }
    if (providerLower === "severauto") return { text: "Доставка 3-4 дня", type: "medium" }
    if (providerLower === "ikon") return { text: "Доставка 3-5 дней", type: "medium" }
    if (providerLower === "mosautoshina") return { text: "Доставка 4-7 дней", type: "medium" }
    if (["bagoria", "severautodist"].includes(providerLower)) {
      return { text: "Доставка 6-8 дней", type: "medium" }
    }
    if (providerLower === "vels") return { text: "Доставка 6-10 дней", type: "medium" }
    if (providerLower === "sibzapaska") return { text: "Доставка 5-7 дней", type: "medium" }
    return { text: "Доставка 10-14 дней", type: "medium" }
  }

  // Для остальных складов - стандартные сроки по провайдеру
  if (providerLower === "tireshop") return { text: "Доставка 1 день", type: "fast" }
  if (["brinex", "exclusive", "fourtochki", "shinservice", "yst"].includes(providerLower)) {
    return { text: "Доставка 1-2 дня", type: "fast" }
  }
  if (providerLower === "severauto") return { text: "Доставка 2-3 дня", type: "fast" }
  if (providerLower === "ikon") return { text: "Доставка 2-4 дня", type: "medium" }
  if (providerLower === "mosautoshina") return { text: "Доставка 3-6 дней", type: "medium" }
  if (["bagoria", "severautodist"].includes(providerLower)) {
    return { text: "Доставка 5-7 дней", type: "medium" }
  }
  if (providerLower === "vels") return { text: "Доставка 5-9 дней", type: "medium" }
  if (providerLower === "sibzapaska") return { text: "Доставка 5-7 дней", type: "medium" }

  return { text: "Доставка 7-10 дней", type: "medium" }
}

// Проверить, есть ли товар на локальных складах (не только "Под заказ")
export function hasLocalWarehouse(storehouse: Record<string, number> | null | undefined): boolean {
  if (!storehouse || Object.keys(storehouse).length === 0) return false

  const localKeywords = ["таллинское", "пискаревск", "санкт-петербург"]

  for (const location of Object.keys(storehouse)) {
    const locationLower = location.toLowerCase()
    // Проверяем, является ли склад локальным
    for (const keyword of localKeywords) {
      if (locationLower.includes(keyword) && !locationLower.includes("ох")) {
        return true
      }
    }
  }

  return false
}

// Получить срок доставки для страницы категории с учётом складов
export function getDeliveryForCategory(
  provider: string | null | undefined,
  storehouse: Record<string, number> | null | undefined
): DeliveryInfo {
  // Если нет поставщика - товар на собственном складе
  if (!provider) {
    return { text: "Забрать сегодня", type: "today" }
  }

  const providerLower = provider.toLowerCase()

  // Эксклюзив - 1-2 дня
  if (providerLower.includes("exlusive") || providerLower.includes("эксклюзив")) {
    return { text: "Доставка 1-2 дня", type: "fast" }
  }

  // 4tochki (Форточки) - 2-4 дня
  if (providerLower.includes("4tochki") || providerLower.includes("форточки")) {
    return { text: "Доставка 2-4 дня", type: "medium" }
  }

  // Дископтимо - 2-4 дня
  if (providerLower.includes("diskoptimo") || providerLower.includes("дископтимо")) {
    return { text: "Доставка 2-4 дня", type: "medium" }
  }

  // Шинсервис - 1-2 дня
  if (providerLower.includes("shinservice") || providerLower.includes("шинсервис")) {
    return { text: "Доставка 1-2 дня", type: "fast" }
  }

  // Старые поставщики (оставляем для совместимости)
  if (providerLower === "tireshop") return { text: "Доставка 5-7 дней", type: "medium" }
  if (providerLower === "yst") return { text: "Доставка 2-3 дня", type: "fast" }
  if (providerLower === "severauto") return { text: "Доставка 3-4 дня", type: "medium" }
  if (providerLower === "ikon") return { text: "Доставка 3-5 дней", type: "medium" }
  if (providerLower === "mosautoshina") return { text: "Доставка 4-7 дней", type: "medium" }
  if (["brinex", "exclusive", "fourtochki"].includes(providerLower)) {
    return { text: "Доставка 2-3 дня", type: "fast" }
  }
  if (["bagoria", "severautodist"].includes(providerLower)) {
    return { text: "Доставка 6-8 дней", type: "medium" }
  }
  if (providerLower === "vels") return { text: "Доставка 6-10 дней", type: "medium" }
  if (providerLower === "sibzapaska") return { text: "Доставка 5-7 дней", type: "medium" }

  return { text: "Уточняйте", type: "medium" }
}

// Получить CSS класс цвета по типу доставки
export function getDeliveryColorClass(type: DeliveryType): string {
  switch (type) {
    case "today":
      return "text-green-500"
    case "fast":
      return "text-blue-500"
    case "medium":
      return "text-orange-500"
    case "slow":
      return "text-white"
    default:
      return "text-white"
  }
}
