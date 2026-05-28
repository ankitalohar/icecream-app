import Rating from './Rating'
import formatCurrency from '../utils/currency'

export default function OrderProductCard({ product, onAdd }) {
  return (
    <article className="ice-card order-product-card">
      <section className="ice-card__image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="ice-card__image"
          loading="lazy"
        />
        <span className="ice-card__tag">{product.tag}</span>
      </section>
      <section className="ice-card__body">
        <p className="order-product-card__category">{product.categoryTitle}</p>
        <section className="ice-card__meta">
          <h3 className="ice-card__name">{product.name}</h3>
          <span className="ice-card__price">{formatCurrency(product.price)}</span>
        </section>
        <Rating value={product.rating} />
        <p className="ice-card__desc">{product.description}</p>
        <button className="btn btn--primary order-product-card__add" type="button" onClick={() => onAdd(product)}>
          Add to Cart
        </button>
      </section>
    </article>
  )
}
