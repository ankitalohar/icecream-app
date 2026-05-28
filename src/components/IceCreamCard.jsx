import Rating from './Rating'
import formatCurrency from '../utils/currency'

export default function IceCreamCard({ item, onAdd }) {
  const displayedPrice = typeof item.price === 'number'
    ? formatCurrency(item.price)
    : item.price?.replace(/^Rs\.\s*/, 'Rs. ')

  return (
    <article className="ice-card">
      <section className="ice-card__image-wrap">
        <img
          src={item.image}
          alt={item.name}
          className="ice-card__image"
          loading="lazy"
        />
        {item.tag && <span className="ice-card__tag">{item.tag}</span>}
      </section>
      <section className="ice-card__body">
        {item.categoryTitle && <p className="order-product-card__category">{item.categoryTitle}</p>}
        <section className="ice-card__meta">
          <h3 className="ice-card__name">{item.name}</h3>
          {displayedPrice && <span className="ice-card__price">{displayedPrice}</span>}
        </section>
        <Rating value={item.rating} />
        <p className="ice-card__desc">{item.description}</p>
        {onAdd && (
          <button className="btn btn--primary order-product-card__add" type="button" onClick={() => onAdd(item)}>
            Add to Cart
          </button>
        )}
      </section>
    </article>
  )
}
