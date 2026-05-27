import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <section className="footer__grid">
        <section className="footer__brand">
          <p className="footer__logo">🍦 Vivelle</p>
          <p className="footer__tagline">
            Handcrafted ice cream made with love, local ingredients, and endless
            flavors.
          </p>
        </section>

        <section className="footer__links">
          <h3>Explore</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/menu">Menu</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </section>

        <section className="footer__contact">
          <h3>Visit us</h3>
          <p>123 Sweet Street, Flavor Town</p>
          <p>Open daily · 11am – 10pm</p>
          <p>
            <a href="mailto:hello@vivelle.com">hello@vivelle.com</a>
          </p>
        </section>
      </section>

      <p className="footer__copy">
        &copy; {year} Vivelle. All rights reserved.
      </p>
    </footer>
  )
}
