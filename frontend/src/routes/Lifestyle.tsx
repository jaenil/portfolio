import ActivitySlideshow from "../components/ActivitySlideshow.js"

const myImages = Object.values(
  import.meta.glob("../assets/about_me/*.{jpg,jpeg,png,webp}", {
    eager: true,
    query: "?format=webp&quality=80&w=1200",
    import: "default",
  })
) as string[]

const basketballImages = Object.values(
  import.meta.glob("../assets/basketball/*.{jpg,jpeg,png,webp}", {
    eager: true,
    query: "?format=webp&quality=80&w=1200",
    import: "default",
  })
) as string[]

const trekkingImages = Object.values(
  import.meta.glob("../assets/trekking/*.{jpg,jpeg,png,webp}", {
    eager: true,
    query: "?format=webp&quality=80&w=1200",
    import: "default",
  })
) as string[]

const munImages = Object.values(
  import.meta.glob("../assets/MUN/*.{jpg,jpeg,png,webp}", {
    eager: true,
    query: "?format=webp&quality=80&w=1200",
    import: "default",
  })
) as string[]

export default function Lifestyle() {
  const activities = [
    {
      title: "About me",
      kicker: "",
      copy:
        "Constantly looking for exciting things to do and exploring new things in life.Trying to build an all round personality and develop new skills. ",
      images: myImages,
      reverse: true,
    },
    {
      title: "Basketball",
      kicker: "ON COURT",
      copy:
        " I play for IIT Jodhpur's college basketball team and have represented my institute at Inter IIT 2025, Varchas 2025, Inter IIT 2026, Varchas 2026 and MST 2026.",
      images: basketballImages,
      reverse: false,
    },
    {
      title: "Trekking",
      kicker: "OUTDOORS",
      copy:
        "I am an avid trekker and love exploring the mountains.",
      images: trekkingImages,
      reverse: true,
    },
    {
      title: "MUN",
      kicker: "DIPLOMACY",
      copy:
        "I have won best delegate awards in multiple MUN conferences. Love a healthy debate.",
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

      </div>

      <section className="mt-12 flex flex-col gap-12">
        {activities.map((item) => (
          <article
            key={item.title}
            className="mx-auto w-full max-w-5xl rounded-[28px] p-6 md:p-8"
          >
            <div
              className={`flex flex-col gap-6 md:items-center md:gap-10 ${item.reverse ? "md:flex-row-reverse" : "md:flex-row"
                }`}
            >
              <div className="w-full md:w-1/2">
                <div className="aspect-4/3 overflow-hidden rounded-2xl bg-zinc-900">
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