import { useState } from 'react'
import Rating from './Rating'

const defaultReviews = [
  {
    id: 1,
    customer: 'Aarav Mehta',
    iceCream: 'Strawberry Velvet',
    rating: 4.9,
    quote: 'Fresh berry taste and the creamiest texture. A must-try scoop!',
  },
  {
    id: 2,
    customer: 'Priya Sharma',
    iceCream: 'Belgian Chocolate Bliss',
    rating: 5,
    quote: 'Rich chocolate without being too heavy. My favorite at Vivelle.',
  },
  {
    id: 3,
    customer: 'Neha Kapoor',
    iceCream: 'Mango Tango',
    rating: 4.8,
    quote: 'Tastes like summer in every bite. Bright, smooth, and refreshing.',
  },
  {
    id: 4,
    customer: 'Rohan Das',
    iceCream: 'Salted Caramel Swirl',
    rating: 4.7,
    quote: 'Perfect balance of sweet and salty. The caramel ribbons are amazing.',
  },
]

export default function CustomerFeedback({ showForm = true }) {
  const [reviews, setReviews] = useState(defaultReviews)

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setReviews((current) => [
      {
        id: Date.now(),
        customer: formData.get('customer'),
        iceCream: formData.get('iceCream'),
        rating: Number(formData.get('rating')),
        quote: formData.get('quote'),
      },
      ...current,
    ])

    event.currentTarget.reset()
  }

  return (
    <section
      className="customer-feedback"
      id="feedback"
      aria-labelledby="customer-feedback-title"
    >
      <h2 id="customer-feedback-title">Customer Feedback</h2>
      <p className="customer-feedback__intro">
        See what our guests are saying — name, favorite flavor, and rating.
      </p>

      {showForm && (
        <form className="customer-feedback__form" onSubmit={handleSubmit}>
          <label>
            Your name
            <input name="customer" type="text" placeholder="Enter your name" required />
          </label>
          <label>
            Ice cream name
            <input
              name="iceCream"
              type="text"
              placeholder="Which flavor did you try?"
              required
            />
          </label>
          <label>
            Rating
            <select name="rating" defaultValue="5" required>
              <option value="5">5.0 — Amazing</option>
              <option value="4.5">4.5 — Great</option>
              <option value="4">4.0 — Good</option>
              <option value="3.5">3.5 — Okay</option>
              <option value="3">3.0 — Fair</option>
            </select>
          </label>
          <label className="customer-feedback__message">
            Your feedback
            <textarea name="quote" placeholder="Tell us about your scoop…" required />
          </label>
          <button type="submit" className="primary-button">
            Submit feedback
          </button>
        </form>
      )}

      <section className="customer-feedback__grid">
        {reviews.map((review) => (
          <article className="customer-feedback__card" key={review.id}>
            <header className="customer-feedback__top">
              <section>
                <h3 className="customer-feedback__name">{review.customer}</h3>
                <p className="customer-feedback__flavor">{review.iceCream}</p>
              </section>
              <Rating value={review.rating} />
            </header>
            <p className="customer-feedback__quote">&ldquo;{review.quote}&rdquo;</p>
          </article>
        ))}
      </section>
    </section>
  )
}
