export type Season = "s" | "w" | "a" | "all"

export interface Tire {
  id: string
  name: string
  article?: string
  price?: number
  image?: string
  flag?: string | null
  width: number | string
  height: number | string
  diameter?: string
  diam: number | string
  season: Season
  runflat?: boolean
  spike?: boolean
  stock?: number
  brand: string
  model?: string
  item_day?: boolean
  country?: string
  country_code?: string
  load_index?: number | string
  speed_index?: number | string
  rrc?: number
  status?: string
  suv?: boolean
  year?: number
  truck?: boolean
  cargo?: boolean
  provider?: string | null
  now?: boolean
}

export interface FilterParams {
  thread?: string
  shape?: string
  color?: string
  type?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  secretka?: string
}
