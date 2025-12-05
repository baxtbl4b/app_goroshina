import Image from "next/image"
import Link from "next/link"

interface PromotionBannerProps {
  title: string
  description: string
  image: string
}

export default function PromotionBanner({ title, description, image }: PromotionBannerProps) {
  return (
    <Link href="/promotion" className="block min-w-[280px]">
      <div className="bg-[#009CFF] rounded-xl overflow-hidden">
        <div className="p-4 text-white">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
        </div>
        <div className="relative h-32">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        </div>
      </div>
    </Link>
  )
}
