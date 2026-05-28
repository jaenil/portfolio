import { useParams } from 'react-router-dom'

export default function WorkDetail() {
  const { slug } = useParams()

  return (
    <main className="min-h-screen px-6 py-16">
      <p className="text-sm uppercase tracking-[0.32em] text-zinc-500">
        Route
      </p>
      <h1 className="mt-4 text-4xl font-semibold text-zinc-100">
        Work: {slug ?? 'unknown'}
      </h1>
      <p className="mt-3 max-w-xl text-base text-zinc-400">
        Work detail stub. This will become the project deep-dive layout.
      </p>
    </main>
  )
}
