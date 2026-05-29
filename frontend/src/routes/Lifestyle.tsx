
import ActivitySlideshow from "../components/ActivitySlideshow.js"
const basketballImages = Object.values(
  import.meta.glob("../assets/basketball/*.{jpg,jpeg,png,webp}", {
    eager: true,
    as: "url",
  })
)

const trekkingImages = Object.values(
  import.meta.glob("../assets/trekking/*.{jpg,jpeg,png,webp}", {
    eager: true,
    as: "url",
  })
)

const munImages = Object.values(
  import.meta.glob("../assets/MUN/*.{jpg,jpeg,png,webp}", {
    eager: true,
    as: "url",
  })
)

const myImages = Object.values(
  import.meta.glob("../assets/about_me/*.{jpg,jpeg,png,webp}", {
    eager: true,
    as: "url",
  })
)

export default function Lifestyle() {
  const activities = [
    {
      title: "About me",
      kicker: "",
      copy:
        "Consistency over speed. I train for distance and the mental grit that follows.",
      images: myImages,
      reverse: true,
    },
    {
      title: "Basketball",
      kicker: "ON COURT",
      copy:
        "Fast reads, sharp cuts, and team rhythm. I play pick-up and inter-hostel games whenever I can.",
      images: basketballImages,
      reverse: false,
    },
    {
      title: "Trekking",
      kicker: "OUTDOORS",
      copy:
        "Long trails reset my head. Early starts, slow climbs, and the quiet that comes with distance.",
      images: trekkingImages,
      reverse: true,
    },
    {
      title: "MUN",
      kicker: "DIPLOMACY",
      copy:
        "Research, debate, and clarity under pressure. It is where I sharpen how I think and speak.",
      images: munImages,
      reverse: false,
    },
    
  ]

  return (
    <main className="min-h-screen px-6 py-16 md:px-12 lg:px-16">
      <div className="relative mx-auto max-w-5xl text-center">
        <div className="pointer-events-none absolute -top-28 right-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Lifestyle
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-zinc-100 md:text-5xl">
          Extracurriculars
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-400">
          Outside the lab, I chase rhythm, distance, and debate. These are the
          spaces that keep me sharp.
        </p>
      </div>

      <section className="mt-12 flex flex-col gap-12">
        {activities.map((item) => (
          <article
            key={item.title}
            className="mx-auto w-full max-w-5xl rounded-[28px] p-6 md:p-8"
          >
            <div
              className={`flex flex-col gap-6 md:items-center md:gap-10 ${
                item.reverse ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div className="w-full md:w-1/2">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900">
                  <ActivitySlideshow
                    images={item.images}
                    alt={`${item.title} activity`}
                  />
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
                  {item.kicker}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-zinc-100">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {item.copy}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}