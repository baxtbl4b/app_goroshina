import Image from "next/image"

interface CategoryCardProps {
  title: string
  image: string
  count: number
}

export default function CategoryCard({ title, image, count }: CategoryCardProps) {
  let imgSrc = image || "/placeholder.svg"

  // Use direct URLs for specific categories
  if (title === "Вентиля") {
    imgSrc = "/images/ventili2_matte.png"
  } else if (title === "Крепеж") {
    // Direct URL to the bolt image
    imgSrc = "/images/wheel-bolts-new.png"
  }

  return (
    <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-2 flex flex-col items-center shadow-sm border border-gray-200 dark:border-transparent">
      <h3 className="text-gray-900 dark:text-white text-sm font-medium text-center mb-2">{title}</h3>
      <div className={`flex items-center justify-center ${count > 0 ? "h-[85px] mb-1" : "flex-1 h-[102px] pt-3"}`}>
        {/* Use a regular img tag for direct URLs */}
        {title === "Крепеж" ? (
          <Image
            src="/images/wheel-bolts-new.png"
            alt={title}
            width={120}
            height={85}
            className={`object-contain w-full h-full ${count === 0 ? "mt-auto" : ""}`}
            onError={(e) => {
              console.error("Failed to load bolt image in CategoryCard")
              // Используем Next.js Image для fallback
              e.currentTarget.src = "/placeholder.svg?height=120&width=120&text=Крепеж"
            }}
          />
        ) : (
          <Image
            src={imgSrc || "/placeholder.svg"}
            alt={title}
            width={count > 0 ? 120 : 140}
            height={count > 0 ? 120 : 140}
            className={`object-contain w-full h-full ${count === 0 ? "mt-auto" : ""}`}
            style={{
              maxHeight: count > 0 ? "85px" : "102px",
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
        )}
      </div>
      {count > 0 && <p className="text-gray-600 dark:text-[#D9D9DD] text-xs">{count} товаров</p>}
    </div>
  )
}
