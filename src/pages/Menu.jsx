import { useEffect, useMemo, useState } from 'react'
import { fetchPopularPicks } from '../utils/navigation'
import IceCreamCard from '../components/IceCreamCard'
import CustomerFeedback from '../components/CustomerFeedback'
import useCart from '../context/useCart'
import { orderCategories } from '../data/orderProducts'
import { popularPicks } from '../data/popularPicks'
import menuImage from '../assets/o14.jpg'

export default function Menu() {
  const { add } = useCart()
  const [items, setItems] = useState([])
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPopularPicks()
      .then(setItems)
      .finally(() => setLoading(false))
  }, [])

  const filteredItems = useMemo(() => (
    category === 'all'
      ? items
      : items.filter((item) => item.category === category)
  ), [category, items])

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

      <section className="order-category-section">
        <header className="order-category-section__header">
          <p className="eyebrow">{popularPicks.length} favorites</p>
          <h2>Popular Picks</h2>
        </header>
        <section className="popular__grid order-product-grid">
          {popularPicks.map((item) => {
            console.log(item.name, item.image)
            return <IceCreamCard key={item._id} item={item} onAdd={add} />
          })}
        </section>
      </section>

      <section className="catalog-toolbar glass">
        <div className="chips" aria-label="Menu categories">
          {orderCategories.map((item) => (
            <button
              className={category === item.value ? 'active' : ''}
              type="button"
              key={item.value}
              onClick={() => setCategory(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <p className="popular__status">Loading menu…</p>
      ) : (
        <section className="popular__grid">
          {filteredItems.map((item) => (
            <IceCreamCard key={item._id} item={item} onAdd={add} />
          ))}
        </section>
      )}

      <CustomerFeedback />
    </section>
  )
}
