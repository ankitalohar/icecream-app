import { useState } from 'react'
import contactImage from '../assets/o30.jpg'
import useToast from '../context/useToast'
import { api } from '../services/api'

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState(initialForm)
  const notify = useToast()

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    try {
      await api('/contacts', { method: 'POST', body: JSON.stringify(form) })
      setForm(initialForm)
      setSubmitted(true)
      notify('Message sent. We will get back to you soon.')
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setSending(false)
    }
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
          <article className="contact__success" role="status">
            <span className="contact__success-icon">✓</span>
            <h2>Message sent</h2>
            <p>Thanks for reaching out. We will get back to you soon.</p>
            <button type="button" className="btn btn--outline" onClick={() => setSubmitted(false)}>
              Send another message
            </button>
          </article>
        ) : (
          <form className="contact-form contact-form--realistic" onSubmit={handleSubmit}>
            <label>
              Name
              <input type="text" name="name" required placeholder="Your name" value={form.name} onChange={updateField} />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={updateField}
              />
            </label>
            <label className="contact-form__wide">
              Subject
              <input
                type="text"
                name="subject"
                required
                placeholder="What can we help with?"
                value={form.subject}
                onChange={updateField}
              />
            </label>
            <label className="contact-form__wide">
              Message
              <textarea
                name="message"
                rows={5}
                required
                placeholder="Tell us what is on your mind..."
                value={form.message}
                onChange={updateField}
              />
            </label>
            <button type="submit" className="btn btn--primary" disabled={sending}>
              {sending ? 'Sending...' : 'Send message'}
            </button>
          </form>
        )}
      </section>
    </section>
  )
}
