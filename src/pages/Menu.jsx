import { useEffect, useState } from 'react'
import { fetchPopularPicks } from '../utils/navigation'
import IceCreamCard from '../components/IceCreamCard'
import CustomerFeedback from '../components/CustomerFeedback'
import menuImage from '../assets/p36.jpg'

export default function Menu() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPopularPicks()
      .then(setItems)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="page menu-page realistic-page">
      <header className="realistic-hero menu-hero">
        <section className="realistic-hero__copy">
          <p className="section-header__eyebrow">Our flavors</p>
          <h1>Full menu</h1>
          <p>
            Every flavor below is available in cups, cones, and pints, finished
            with real sauces, fruit, nuts, and crunchy toppings.
          </p>
        </section>
        <img src={menuImage} alt="Vivelle ice cream menu display" />
      </header>

      {loading ? (
        <p className="popular__status">Loading menu…</p>
      ) : (
        <section className="popular__grid">
          {items.map((item) => (
            <IceCreamCard key={item.id} item={item} />
          ))}
        </section>
      )}

      <CustomerFeedback />
    </section>
  )
}
