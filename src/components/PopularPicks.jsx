import { useEffect, useState } from 'react'
import { fetchPopularPicks } from '../utils/navigation'
import IceCreamCard from './IceCreamCard'

export default function PopularPicks() {
  const [picks, setPicks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await fetchPopularPicks()
        if (!cancelled) setPicks(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="popular" className="popular">
      <header className="section-header">
        <p className="section-header__eyebrow">Customer favorites</p>
        <h2 className="section-header__title">Popular picks</h2>
        <p className="section-header__text">
          Rated by our community — each scoop comes with a story and a smile.
        </p>
      </header>

      {loading && <p className="popular__status">Loading flavors…</p>}
      {error && <p className="popular__status popular__status--error">{error}</p>}

      {!loading && !error && (
        <section className="popular__grid">
          {picks.slice(0, 6).map((item) => (
            <IceCreamCard key={item.id} item={item} />
          ))}
        </section>
      )}
    </section>
  )
}
