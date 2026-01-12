import type { Metadata } from "next"
import { notFound } from "next/navigation"
// Update the import to point to the correct file
import CategoryPageClient from "./CategoryPageClient"

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: {
    width?: string
    profile?: string
    diameter?: string
    spike?: string
    [key: string]: string | string[] | undefined
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params

  let title = "Шины"
  let description = "Широкий выбор шин для вашего автомобиля"

  switch (slug) {
    case "all":
      title = "Все шины"
      description = "Широкий выбор шин всех сезонов для вашего автомобиля"
      break
    case "summer":
      title = "Летние шины"
      description = "Широкий выбор летних шин для вашего автомобиля"
      break
    case "winter":
      title = "Зимние шины"
      description = "Широкий выбор зимних шин для вашего автомобиля"
      break
    case "all-season":
      title = "Всесезонные шины"
      description = "Широкий выбор всесезонных шин для вашего автомобиля"
      break
    default:
      return notFound()
  }

  return {
    title,
    description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const normalizedSeason = slug === "all" ? "all" : slug === "summer" ? "s" : slug === "winter" ? "w" : "a"

  return <CategoryPageClient season={normalizedSeason} />
}
