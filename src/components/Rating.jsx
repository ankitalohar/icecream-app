export default function Rating({ value }) {
  const fullStars = Math.floor(value)
  const hasHalf = value - fullStars >= 0.5

  return (
    <div className="rating" aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= fullStars
              ? 'star star--full'
              : star === fullStars + 1 && hasHalf
                ? 'star star--half'
                : 'star'
          }
          aria-hidden="true"
        >
          ★
        </span>
      ))}
      <span className="rating__value">{value.toFixed(1)}</span>
    </div>
  )
}
