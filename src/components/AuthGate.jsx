import { useState } from 'react'
import useAuth from '../context/useAuth'

export default function AuthGate({ children, onAuthenticated, variant = 'page' }) {
  const { user, loading, requestOtp, verifyOtp } = useAuth()
  const [mode, setMode] = useState('login')
  const [channel, setChannel] = useState('email')
  const [step, setStep] = useState('request')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    code: '',
  })
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return <p className="popular__status">Checking your account...</p>
  }

  if (user) {
    return children
  }

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setSubmitting(true)

    try {
      const identifier = channel === 'email' ? form.email : form.phone
      if (step === 'request') {
        const data = await requestOtp({ mode, channel, identifier })
        setStep('verify')
        setMessage(data.message)
      } else {
        const authenticatedUser = await verifyOtp({
          mode,
          channel,
          identifier,
          code: form.code,
          ...(mode === 'signup'
            ? {
                name: form.name,
                email: form.email,
                phone: form.phone,
                address: form.address,
              }
            : {}),
        })
        onAuthenticated?.(authenticatedUser)
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setStep('request')
    setForm((current) => ({ ...current, code: '' }))
    setMessage('')
  }

  function switchChannel(nextChannel) {
    setChannel(nextChannel)
    setStep('request')
    setForm((current) => ({ ...current, code: '' }))
    setMessage('')
  }

  const isSignup = mode === 'signup'
  const isVerifying = step === 'verify'

  return (
    <section className={`auth-page auth-page--${variant}`}>
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="section-header__eyebrow">Vivelle account</p>
        <h1>{mode === 'login' ? 'Login to order' : 'Create your account'}</h1>
        <p className="auth-card__text">
          {isVerifying
            ? `Enter the code sent to your ${channel === 'email' ? 'email address' : 'mobile number'}.`
            : mode === 'login'
              ? 'Sign in securely with a one-time code sent to your email or mobile.'
              : 'Verify your email or mobile number and we will save your profile for ordering.'}
        </p>

        <section className="auth-tabs" aria-label="Choose login or sign up">
          <button
            type="button"
            className={mode === 'login' ? 'auth-tabs__button active' : 'auth-tabs__button'}
            onClick={() => switchMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'auth-tabs__button active' : 'auth-tabs__button'}
            onClick={() => switchMode('signup')}
          >
            Sign up
          </button>
        </section>

        <section className="auth-channel" aria-label="Choose verification method">
          <button
            type="button"
            className={channel === 'email' ? 'auth-channel__button active' : 'auth-channel__button'}
            onClick={() => switchChannel('email')}
          >
            Email OTP
          </button>
          <button
            type="button"
            className={channel === 'phone' ? 'auth-channel__button active' : 'auth-channel__button'}
            onClick={() => switchChannel('phone')}
          >
            Mobile OTP
          </button>
        </section>

        {isSignup && !isVerifying && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={updateField}
              autoComplete="name"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Mobile number, e.g. +919876543210"
              value={form.phone}
              onChange={updateField}
              autoComplete="tel"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Delivery address"
              value={form.address}
              onChange={updateField}
              autoComplete="street-address"
              required
            />
          </>
        )}

        {!isVerifying && (isSignup || channel === 'email') && (
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={updateField}
            autoComplete="email"
            required
          />
        )}

        {!isVerifying && !isSignup && channel === 'phone' && (
          <input
            type="tel"
            name="phone"
            placeholder="Mobile number, e.g. +919876543210"
            value={form.phone}
            onChange={updateField}
            autoComplete="tel"
            required
          />
        )}

        {isVerifying && (
          <input
            type="text"
            name="code"
            placeholder="6-digit verification code"
            value={form.code}
            onChange={updateField}
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength="6"
            required
          />
        )}

        {message && <p className="auth-card__message">{message}</p>}

        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting
            ? 'Please wait...'
            : isVerifying
              ? 'Verify and continue'
              : 'Send verification code'}
        </button>

        {isVerifying && (
          <button type="button" className="auth-card__link" onClick={() => setStep('request')}>
            Use a different contact or request a new code
          </button>
        )}
      </form>
    </section>
  )
}
