import studioImage from '../assets/pB.jpg'
import scoopImage from '../assets/p16.jpg'
import counterImage from '../assets/p25.jpg'

export default function About() {
  return (
    <section className="page realistic-page about-page">
      <header className="realistic-hero about-hero">
        <section className="realistic-hero__copy">
          <p className="section-header__eyebrow">Our story</p>
          <h1>About Vivelle</h1>
          <p>
            A neighborhood ice cream kitchen built around real dairy, ripe fruit,
            warm waffle cones, and batches that are churned fresh before service.
          </p>
        </section>
        <img src={studioImage} alt="Vivelle ice cream counter" />
      </header>

      <section className="story-grid">
        <article className="story-panel">
          <p>
            Vivelle started in a small kitchen with a big dream: make ice cream
            the way it should be, creamy, honest, and bursting with real flavor.
          </p>
          <p>
            We source dairy from local farms, pick fruit at peak season, and churn
            every batch in small quantities so nothing sits in a freezer for weeks.
          </p>
          <p>
            Whether you are team chocolate or team sorbet, there is a scoop here
            with your name on it.
          </p>
        </article>
        <article className="process-card">
          <img src={scoopImage} alt="Fresh ice cream scoop" />
          <div>
            <span>01</span>
            <h2>Churned Daily</h2>
            <p>Each tub is made in limited runs for a smoother texture and cleaner flavor.</p>
          </div>
        </article>
        <article className="process-card">
          <img src={counterImage} alt="Ice cream toppings and cones" />
          <div>
            <span>02</span>
            <h2>Finished by Hand</h2>
            <p>Sauces, crumbles, nuts, and fruit are folded in by hand for real texture.</p>
          </div>
        </article>
      </section>
    </section>
  )
}
