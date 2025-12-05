import type { Metadata } from "next"
import KrepezhPageClient from "./KrepezhPageClient"

export const metadata: Metadata = {
  title: "Крепеж для колес | Купить крепежные элементы для дисков",
  description:
    "Широкий выбор крепежных элементов для колесных дисков: гайки, болты, секретки. Подбор по типу, резьбе, форме и ��вет.",
}

export default function KrepezhPage() {
  return <KrepezhPageClient />
}
