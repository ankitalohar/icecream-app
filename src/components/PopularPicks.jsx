import IceCreamCard from './IceCreamCard'
import useCart from '../context/useCart'
import { popularPicks } from '../data/popularPicks'

export default function PopularPicks() {
  const { add } = useCart()

  return (
    <section id="popular" className="popular">
      <header className="section-header">
        <p className="section-header__eyebrow">Customer favorites</p>
        <h2 className="section-header__title">Popular picks</h2>
        <p className="section-header__text">
          Rated by our community — each scoop comes with a story and a smile.
        </p>
      </header>

      <section className="popular__grid">
        {popularPicks.slice(0, 6).map((item) => {
          console.log(item.name, item.image)
          return <IceCreamCard key={item._id} item={item} onAdd={add} />
        })}
      </section>
    </section>
  )
}
