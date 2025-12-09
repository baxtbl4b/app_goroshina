import Image from "next/image"

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <Image
        src="/icons/logo full.svg"
        alt="Горошина"
        width={199}
        height={40}
        priority
      />
    </div>
  )
}
