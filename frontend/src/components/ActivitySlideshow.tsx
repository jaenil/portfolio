import { useEffect, useState } from "react"

export default function ActivitySlideshow({
  images,
  alt,
  intervalMs = 4500,
}: {
  images: string[]
  alt: string
  intervalMs?: number
}) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [images.length, intervalMs])

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-zinc-900" />
    )
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          loading="lazy"
          className={`absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-[1400ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  )
}