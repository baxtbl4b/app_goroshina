// Mock API for fasteners (крепеж)
import type { FilterParams } from "./api-types"

export interface Fastener {
  id: string
  name: string
  price: number
  rrc: number // Рекомендованная розничная цена
  stock: number
  image: string
  article: string
  brand: string
  country: string
  type: "nut" | "bolt" | "lock-nut" | "lock-bolt"
  thread: string
  shape: "cone" | "sphere" | "washer"
  color: "silver" | "black"
}

// Mock data for fasteners
const fasteners: Fastener[] = [
  {
    id: "f1",
    name: "Гайка колесная M12x1.5 конус",
    price: 120,
    rrc: 150,
    stock: 25,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%285%29%20%281%29-Va7GVB4VjSj5iTTS1HizLscLi4vgZB.webp",
    article: "KN-1215-C-S",
    brand: "FastenTech",
    country: "Китай",
    type: "nut",
    thread: "M12x1.5",
    shape: "cone",
    color: "silver",
  },
  {
    id: "f2",
    name: "Гайка колесная M12x1.25 конус",
    price: 125,
    rrc: 155,
    stock: 18,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%282%29%20%281%29-e2q21ByUIWsgwqYezEZLdkZ2Qnn2jJ.webp",
    article: "KN-1212-C-S",
    brand: "FastenTech",
    country: "Китай",
    type: "nut",
    thread: "M12x1.25",
    shape: "cone",
    color: "silver",
  },
  {
    id: "f3",
    name: "Гайка колесная M14x1.5 конус",
    price: 130,
    rrc: 160,
    stock: 22,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1600%20%281%29.jpg-9k8huwtwCjtUnm4WnbNTXo8kssZjfS.jpeg",
    article: "KN-1415-C-S",
    brand: "FastenTech",
    country: "Китай",
    type: "nut",
    thread: "M14x1.5",
    shape: "cone",
    color: "silver",
  },
  {
    id: "f4",
    name: "Гайка колесная M14x1.5 сфера",
    price: 135,
    rrc: 165,
    stock: 15,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1600%20%282%29.jpg-pqOwuWzvhZM5gRA1dDLq9SEk1fowZ0.jpeg",
    article: "KN-1415-S-S",
    brand: "FastenTech",
    country: "Китай",
    type: "nut",
    thread: "M14x1.5",
    shape: "sphere",
    color: "silver",
  },
  {
    id: "f5",
    name: "Гайка колесная M12x1.5 конус черная",
    price: 140,
    rrc: 170,
    stock: 12,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6847505941%20%281%29.jpg-6BNQE1R1Z4HVjFFx3jC9qaHz1vPZw3.jpeg",
    article: "KN-1215-C-B",
    brand: "FastenTech",
    country: "Китай",
    type: "nut",
    thread: "M12x1.5",
    shape: "cone",
    color: "black",
  },
  {
    id: "f6",
    name: "Болт колесный M12x1.5 конус",
    price: 150,
    rrc: 180,
    stock: 20,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%285%29%20%281%29-Va7GVB4VjSj5iTTS1HizLscLi4vgZB.webp",
    article: "KB-1215-C-S",
    brand: "BoltMaster",
    country: "Россия",
    type: "bolt",
    thread: "M12x1.5",
    shape: "cone",
    color: "silver",
  },
  {
    id: "f7",
    name: "Болт колесный M14x1.5 конус",
    price: 160,
    rrc: 190,
    stock: 16,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%282%29%20%281%29-e2q21ByUIWsgwqYezEZLdkZ2Qnn2jJ.webp",
    article: "KB-1415-C-S",
    brand: "BoltMaster",
    country: "Россия",
    type: "bolt",
    thread: "M14x1.5",
    shape: "cone",
    color: "silver",
  },
  {
    id: "f8",
    name: "Болт колесный M12x1.25 конус черный",
    price: 170,
    rrc: 200,
    stock: 10,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6847505941%20%281%29.jpg-6BNQE1R1Z4HVjFFx3jC9qaHz1vPZw3.jpeg",
    article: "KB-1212-C-B",
    brand: "BoltMaster",
    country: "Россия",
    type: "bolt",
    thread: "M12x1.25",
    shape: "cone",
    color: "black",
  },
  {
    id: "f9",
    name: "Гайка секретка M12x1.5 конус",
    price: 450,
    rrc: 550,
    stock: 8,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%284%29%20%281%29-HAYeUW2fnEJoE4f752RP92jtGsXQAO.webp",
    article: "KL-1215-C-S",
    brand: "SecureLock",
    country: "Германия",
    type: "lock-nut",
    thread: "M12x1.5",
    shape: "cone",
    color: "silver",
  },
  {
    id: "f10",
    name: "Гайка секретка M14x1.5 конус",
    price: 480,
    rrc: 580,
    stock: 6,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%284%29%20%281%29-HAYeUW2fnEJoE4f752RP92jtGsXQAO.webp",
    article: "KL-1415-C-S",
    brand: "SecureLock",
    country: "Германия",
    type: "lock-nut",
    thread: "M14x1.5",
    shape: "cone",
    color: "silver",
  },
  {
    id: "f11",
    name: "Болт секретка M12x1.5 конус",
    price: 500,
    rrc: 600,
    stock: 5,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%285%29%20%281%29-Va7GVB4VjSj5iTTS1HizLscLi4vgZB.webp",
    article: "BL-1215-C-S",
    brand: "SecureLock",
    country: "Германия",
    type: "lock-bolt",
    thread: "M12x1.5",
    shape: "cone",
    color: "silver",
  },
  {
    id: "f12",
    name: "Болт секретка M14x1.5 конус черный",
    price: 550,
    rrc: 650,
    stock: 4,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6847505941%20%281%29.jpg-6BNQE1R1Z4HVjFFx3jC9qaHz1vPZw3.jpeg",
    article: "BL-1415-C-B",
    brand: "SecureLock",
    country: "Германия",
    type: "lock-bolt",
    thread: "M14x1.5",
    shape: "cone",
    color: "black",
  },
  {
    id: "f13",
    name: "Гайка колесная M12x1.5 шайба",
    price: 130,
    rrc: 160,
    stock: 14,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%284%29%20%281%29-HAYeUW2fnEJoE4f752RP92jtGsXQAO.webp",
    article: "KN-1215-W-S",
    brand: "FastenTech",
    country: "Китай",
    type: "nut",
    thread: "M12x1.5",
    shape: "washer",
    color: "silver",
  },
  {
    id: "f14",
    name: "Болт колесный M12x1.5 шайба",
    price: 155,
    rrc: 185,
    stock: 11,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%284%29%20%281%29-HAYeUW2fnEJoE4f752RP92jtGsXQAO.webp",
    article: "KB-1215-W-S",
    brand: "BoltMaster",
    country: "Россия",
    type: "bolt",
    thread: "M12x1.5",
    shape: "washer",
    color: "silver",
  },
  {
    id: "f15",
    name: "Гайка колесная M14x1.5 конус Япония",
    price: 180,
    rrc: 220,
    stock: 9,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1600%20%281%29.jpg-9k8huwtwCjtUnm4WnbNTXo8kssZjfS.jpeg",
    article: "KN-1415-C-S-JP",
    brand: "NipponFast",
    country: "Япония",
    type: "nut",
    thread: "M14x1.5",
    shape: "cone",
    color: "silver",
  },
  {
    id: "f16",
    name: "Болт колесный M14x1.5 конус Япония",
    price: 200,
    rrc: 240,
    stock: 7,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1600%20%281%29.jpg-9k8huwtwCjtUnm4WnbNTXo8kssZjfS.jpeg",
    article: "KB-1415-C-S-JP",
    brand: "NipponFast",
    country: "Япония",
    type: "bolt",
    thread: "M14x1.5",
    shape: "cone",
    color: "silver",
  },
  {
    id: "f17",
    name: "Гайка секретка M12x1.25 конус Италия",
    price: 520,
    rrc: 620,
    stock: 3,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%284%29%20%281%29-HAYeUW2fnEJoE4f752RP92jtGsXQAO.webp",
    article: "KL-1212-C-S-IT",
    brand: "ItaliaLock",
    country: "Италия",
    type: "lock-nut",
    thread: "M12x1.25",
    shape: "cone",
    color: "silver",
  },
  {
    id: "f18",
    name: "Болт секретка M12x1.25 конус Италия",
    price: 540,
    rrc: 640,
    stock: 2,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%282%29%20%281%29-e2q21ByUIWsgwqYezEZLdkZ2Qnn2jJ.webp",
    article: "BL-1212-C-S-IT",
    brand: "ItaliaLock",
    country: "Италия",
    type: "lock-bolt",
    thread: "M12x1.25",
    shape: "cone",
    color: "silver",
  },
  {
    id: "f19",
    name: "Гайка колесная M12x1.5 конус Франция",
    price: 160,
    rrc: 190,
    stock: 13,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%285%29%20%281%29-Va7GVB4VjSj5iTTS1HizLscLi4vgZB.webp",
    article: "KN-1215-C-S-FR",
    brand: "FranceFix",
    country: "Франция",
    type: "nut",
    thread: "M12x1.5",
    shape: "cone",
    color: "silver",
  },
  {
    id: "f20",
    name: "Болт колесный M12x1.5 конус Франция",
    price: 180,
    rrc: 210,
    stock: 9,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1600%20%282%29.jpg-pqOwuWzvhZM5gRA1dDLq9SEk1fowZ0.jpeg",
    article: "KB-1215-C-S-FR",
    brand: "FranceFix",
    country: "Франция",
    type: "bolt",
    thread: "M12x1.5",
    shape: "cone",
    color: "silver",
  },
]

// Function to filter fasteners based on parameters
export async function getFasteners(params: FilterParams): Promise<Fastener[]> {
  let filteredFasteners = [...fasteners]

  // Filter by thread
  if (params.thread) {
    filteredFasteners = filteredFasteners.filter((f) => f.thread === params.thread)
  }

  // Filter by shape
  if (params.shape) {
    filteredFasteners = filteredFasteners.filter((f) => f.shape === params.shape)
  }

  // Filter by color
  if (params.color) {
    filteredFasteners = filteredFasteners.filter((f) => f.color === params.color)
  }

  // Filter by type
  if (params.type) {
    filteredFasteners = filteredFasteners.filter((f) => f.type === params.type)
  }

  // Filter by secretka (security/lock nuts and bolts)
  if (params.secretka === "true") {
    filteredFasteners = filteredFasteners.filter((f) => f.type === "lock-nut" || f.type === "lock-bolt")
  }

  // Filter by brand
  if (params.brand) {
    filteredFasteners = filteredFasteners.filter((f) => f.brand.toLowerCase().includes(params.brand!.toLowerCase()))
  }

  // Filter by price range
  if (params.minPrice !== undefined) {
    filteredFasteners = filteredFasteners.filter((f) => f.price >= params.minPrice!)
  }
  if (params.maxPrice !== undefined) {
    filteredFasteners = filteredFasteners.filter((f) => f.price <= params.maxPrice!)
  }

  // Filter by stock
  if (params.inStock) {
    filteredFasteners = filteredFasteners.filter((f) => f.stock > 0)
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return filteredFasteners
}

// Function to get a single fastener by ID
export async function getFastenerById(id: string): Promise<Fastener | null> {
  const fastener = fasteners.find((f) => f.id === id)

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return fastener || null
}
