import { useRef, useState } from 'react'
import useAuth from '../context/useAuth'

function PhoneField({ value, onChange, disabled }) {
  return (
    <label className="phone-input">
      <span className="phone-input__code">+91</span>
      <input
        type="tel"
        name="phone"
        placeholder="Phone number"
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete="tel"
        inputMode="tel"
        required
      />
    </label>
  )
}

export default function AuthGate({ children, onAuthenticated, variant = 'page' }) {
  const { user, loading, login, signup } = useAuth()
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('user')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    identifier: '',
    password: '',
    confirmPassword: '',
  })
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const submittingRef = useRef(false)

  if (loading) return <p className="popular__status">Checking your account...</p>
  if (user) return children

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submittingRef.current) return
    submittingRef.current = true
    setMessage('')
    setSubmitting(true)

    try {
      const authenticatedUser = mode === 'signup'
        ? await signup({
            role,
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            password: form.password,
            confirmPassword: form.confirmPassword,
          })
        : await login({ identifier: form.identifier, password: form.password })
      onAuthenticated?.(authenticatedUser)
    } catch (error) {
      setMessage(error.message)
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setMessage('')
    setForm((current) => ({ ...current, password: '', confirmPassword: '' }))
  }

  const isSignup = mode === 'signup'

  return (
    <section className={`auth-page auth-page--${variant}`}>
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="section-header__eyebrow">Vivelle account</p>
        <h1>{mode === 'login' ? 'Login to order' : 'Create your account'}</h1>
        <p className="auth-card__text">
          {mode === 'login' ? 'Use your email or mobile number and password.' : 'Save your profile for ordering and checkout.'}
        </p>

        <section className="auth-tabs" aria-label="Choose login or sign up">
          <button type="button" className={mode === 'login' ? 'auth-tabs__button active' : 'auth-tabs__button'} onClick={() => switchMode('login')} disabled={submitting}>Login</button>
          <button type="button" className={mode === 'signup' ? 'auth-tabs__button active' : 'auth-tabs__button'} onClick={() => switchMode('signup')} disabled={submitting}>Sign up</button>
        </section>

        {isSignup && (
          <>
            <section className="auth-channel" aria-label="Choose role">
              <button type="button" className={role === 'user' ? 'auth-channel__button active' : 'auth-channel__button'} onClick={() => setRole('user')} disabled={submitting}>User</button>
              <button type="button" className={role === 'admin' ? 'auth-channel__button active' : 'auth-channel__button'} onClick={() => setRole('admin')} disabled={submitting}>Admin</button>
            </section>
            <input type="text" name="name" placeholder="Full name" value={form.name} onChange={updateField} disabled={submitting} autoComplete="name" required />
            <input type="email" name="email" placeholder="Email address" value={form.email} onChange={updateField} disabled={submitting} autoComplete="email" required />
            <PhoneField value={form.phone} onChange={updateField} disabled={submitting} />
            <input type="text" name="address" placeholder="Address" value={form.address} onChange={updateField} disabled={submitting} autoComplete="street-address" required />
          </>
        )}

        {!isSignup && (
          <input type="text" name="identifier" placeholder="Email or phone" value={form.identifier} onChange={updateField} disabled={submitting} autoComplete="username" required />
        )}
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={updateField} disabled={submitting} autoComplete={isSignup ? 'new-password' : 'current-password'} required />
        {isSignup && <input type="password" name="confirmPassword" placeholder="Confirm password" value={form.confirmPassword} onChange={updateField} disabled={submitting} autoComplete="new-password" required />}

        {message && <p className="auth-card__message">{message}</p>}

        <button type="submit" className="btn btn--primary" disabled={submitting} aria-busy={submitting}>
          {submitting && <span className="btn__spinner" aria-hidden="true" />}
          {submitting ? 'Please wait...' : isSignup ? 'Create account' : 'Login'}
        </button>
      </form>
    </section>
  )
}
