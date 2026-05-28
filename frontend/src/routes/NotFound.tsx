import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="min-h-screen px-6 py-16">
      <p className="text-sm uppercase tracking-[0.32em] text-zinc-500">
        Route
      </p>
      <h1 className="mt-4 text-4xl font-semibold text-zinc-100">Not Found</h1>
      <p className="mt-3 max-w-xl text-base text-zinc-400">
        That page does not exist yet.
      </p>
      <Link
        className="mt-6 inline-flex text-sm font-medium text-[#00a5ef]"
        to="/"
      >
        Back to home
      </Link>
    </main>
  )
}
