import { Link, Navigate, useParams } from 'react-router-dom'
import IceCreamCard from '../components/IceCreamCard'
import useCart from '../context/useCart'
import { getCategoryMenu, menuCategories } from '../data/menuCategories'

export default function MenuCategory() {
  const { category } = useParams()
  const { add } = useCart()
  const menu = getCategoryMenu(category)

  if (!menu) {
    return <Navigate to="/" replace />
  }

  return (
    <section className="page menu-category-page">
      <Link to="/" className="menu-category-page__back">
        ← Back to home
      </Link>

      <header className="section-header">
        <p className="section-header__eyebrow">{menu.eyebrow}</p>
        <h1 className="section-header__title">{menu.title}</h1>
        <p className="section-header__text">{menu.description}</p>
      </header>

      <section className="popular__grid">
        {menu.items.map((item) => (
          <IceCreamCard key={item._id} item={item} onAdd={add} />
        ))}
      </section>

      <section className="menu-category-page__switch">
        <p>Explore another category</p>
        <section className="menu-category-page__links">
          {menuCategories
            .filter((entry) => entry.slug !== category)
            .map((entry) => (
              <Link key={entry.slug} to={`/menu/${entry.slug}`} className="btn btn--outline">
                {entry.buttonLabel}
              </Link>
            ))}
        </section>
      </section>
    </section>
  )
}
