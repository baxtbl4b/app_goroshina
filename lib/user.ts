// Интерфейс данных пользователя
export interface User {
  name: string
  phone: string
  email?: string
  loyaltyPoints: number
  loyaltyLevel: string
  avatar?: string
}

// Тестовый пользователь по умолчанию
const DEFAULT_USER: User = {
  name: "Александр Кук",
  phone: "+79673588200",
  email: "alex.cook@example.com",
  loyaltyPoints: 2500,
  loyaltyLevel: "Золотой",
  avatar: "/avatars/01.png",
}

// Получить данные пользователя из localStorage
export function getUser(): User {
  if (typeof window === "undefined") return DEFAULT_USER

  try {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      return JSON.parse(userData)
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных пользователя:", error)
  }

  // Если пользователя нет, создаем тестового
  saveUser(DEFAULT_USER)
  return DEFAULT_USER
}

// Сохранить данные пользователя в localStorage
export function saveUser(user: User): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("currentUser", JSON.stringify(user))
    // Генерируем событие для обновления UI
    window.dispatchEvent(new CustomEvent("userUpdated", { detail: user }))
  } catch (error) {
    console.error("Ошибка при сохранении данных пользователя:", error)
  }
}

// Обновить баллы пользователя
export function updateUserPoints(points: number): void {
  const user = getUser()
  user.loyaltyPoints = Math.max(0, points) // Не даем баллам быть отрицательными
  saveUser(user)
}

// Списать баллы
export function deductUserPoints(points: number): boolean {
  const user = getUser()
  if (user.loyaltyPoints >= points) {
    user.loyaltyPoints -= points
    saveUser(user)
    return true
  }
  return false
}

// Начислить баллы
export function addUserPoints(points: number): void {
  const user = getUser()
  user.loyaltyPoints += points
  saveUser(user)
}

// Обновить уровень лояльности
export function updateLoyaltyLevel(): void {
  const user = getUser()
  const points = user.loyaltyPoints

  if (points >= 5000) {
    user.loyaltyLevel = "Платиновый"
  } else if (points >= 2000) {
    user.loyaltyLevel = "Золотой"
  } else if (points >= 500) {
    user.loyaltyLevel = "Серебряный"
  } else {
    user.loyaltyLevel = "Бронзовый"
  }

  saveUser(user)
}

// Обновить аватар пользователя
export function updateUserAvatar(avatar: string): void {
  const user = getUser()
  user.avatar = avatar
  saveUser(user)
}

// Конвертировать изображение в base64
export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
