import Rating from './Rating'

export default function IceCreamCard({ item }) {
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
        <section className="ice-card__meta">
          <h3 className="ice-card__name">{item.name}</h3>
          {item.price && <span className="ice-card__price">{item.price}</span>}
        </section>
        <Rating value={item.rating} />
        <p className="ice-card__desc">{item.description}</p>
      </section>
    </article>
  )
}
