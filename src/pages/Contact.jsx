import { useState } from 'react'
import contactImage from '../assets/p30.jpg'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="page realistic-page contact-page">
      <header className="realistic-hero contact-hero">
        <section className="realistic-hero__copy">
          <p className="section-header__eyebrow">Say hello</p>
          <h1>Contact us</h1>
          <p>
            Questions, party orders, custom tubs, or a special celebration menu?
            Send the details and we will help you plan the right scoops.
          </p>
        </section>
        <img src={contactImage} alt="Ice cream served at Vivelle" />
      </header>

      <section className="contact-layout">
        <aside className="contact-details">
          <h2>Visit Vivelle</h2>
          <p>Open daily: 11:00 AM - 11:00 PM</p>
          <p>Custom orders: 24 hours notice</p>
          <p>Pickup and local delivery available</p>
        </aside>

        {submitted ? (
          <p className="contact__success">
            Thanks for reaching out! We will get back to you soon.
          </p>
        ) : (
          <form className="contact-form contact-form--realistic" onSubmit={handleSubmit}>
            <label>
              Name
              <input type="text" name="name" required placeholder="Your name" />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
              />
            </label>
            <label className="contact-form__wide">
              Message
              <textarea
                name="message"
                rows={5}
                required
                placeholder="Tell us what is on your mind..."
              />
            </label>
            <button type="submit" className="btn btn--primary">
              Send message
            </button>
          </form>
        )}
      </section>
    </section>
  )
}
