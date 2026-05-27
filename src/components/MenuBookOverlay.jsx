import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { menuCategories } from '../data/menuCategories'

export default function MenuBookOverlay({ onClose }) {
  const navigate = useNavigate()

  useEffect(() => {
    const originalHtmlOverflow = document.documentElement.style.overflow
    const originalBodyOverflow = document.body.style.overflow

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow
      document.body.style.overflow = originalBodyOverflow
    }
  }, [])

  function handleCategoryClick(slug) {
    onClose()
    navigate(`/menu/${slug}`)
  }

  return (
    <section
      className="menu-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Choose a menu category"
      onClick={onClose}
    >
      <section className="menu-overlay__book" onClick={(e) => e.stopPropagation()}>
        <button className="menu-overlay__close" type="button" onClick={onClose}>
          Close
        </button>
        <h2>Vivelle Menu Book</h2>
        <p className="menu-overlay__intro">Pick a category to explore our treats</p>

        <section className="menu-overlay__categories">
          {menuCategories.map((category) => (
            <button
              key={category.slug}
              type="button"
              className="menu-overlay__category"
              onClick={() => handleCategoryClick(category.slug)}
            >
              <span className="menu-overlay__category-icon" aria-hidden="true">
                {category.icon}
              </span>
              <span className="menu-overlay__category-copy">
                <strong>{category.title}</strong>
                <span>{category.subtitle}</span>
              </span>
              <span className="menu-overlay__category-arrow" aria-hidden="true">
                →
              </span>
            </button>
          ))}
        </section>
      </section>
    </section>
  )
}
