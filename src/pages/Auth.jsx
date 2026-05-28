import { useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../context/useAuth'
import useToast from '../context/useToast'

const initial = {
  name: '',
  email: '',
  phone: '',
  address: '',
  identifier: '',
  password: '',
  confirmPassword: '',
}

function PhoneField({ name, value, onChange, disabled }) {
  return (
    <label className="phone-input">
      <span className="phone-input__code">+91</span>
      <input
        type="tel"
        inputMode="tel"
        name={name}
        value={value}
        onChange={onChange}
        placeholder="Phone number"
        autoComplete="tel"
        disabled={disabled}
        required
      />
    </label>
  )
}

export default function Auth() {
  const { user, loading, login, signup } = useAuth()
  const notify = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState(() => location.pathname === '/signup' ? 'signup' : 'login')
  const [role, setRole] = useState('user')
  const [form, setForm] = useState(initial)
  const [busy, setBusy] = useState(false)
  const submittingRef = useRef(false)

  if (loading) return <p className="page-state">Restoring your session...</p>
  if (user) return <Navigate to={user.role === 'admin' ? '/dashboard' : '/order'} replace />

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setForm(initial)
    navigate(nextMode === 'signup' ? '/signup' : '/login', { replace: true })
  }

  async function submit(event) {
    event.preventDefault()
    if (submittingRef.current) return
    submittingRef.current = true
    setBusy(true)
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
        : await login({
            identifier: form.identifier,
            password: form.password,
          })
      notify(`Welcome, ${authenticatedUser.name}`)
      navigate(authenticatedUser.role === 'admin' ? '/dashboard' : '/order', { replace: true })
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      submittingRef.current = false
      setBusy(false)
    }
  }

  return (
    <section className="auth-shell">
      <aside className="auth-promo">
        <p className="eyebrow">Vivelle access</p>
        <h1>{mode === 'signup' ? 'Create your dessert account.' : 'Welcome back.'}</h1>
        <p>Secure password login, saved carts, live orders, and role-based navigation in one polished flow.</p>
      </aside>
      <form className="glass auth-form" onSubmit={submit}>
        <div className="segmented">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')} disabled={busy}>Login</button>
          <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')} disabled={busy}>Sign Up</button>
        </div>

        <h2>{mode === 'signup' ? 'Create account' : 'Login'}</h2>
        <p className="auth-help">
          {mode === 'signup'
            ? 'Enter your details once. We will save your account in MongoDB and Firestore.'
            : 'Use your email address or Indian mobile number with your password.'}
        </p>

        {mode === 'signup' && (
          <>
            <div className="role-picker">
              <button type="button" className={role === 'user' ? 'active' : ''} onClick={() => setRole('user')} disabled={busy}>User</button>
              <button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')} disabled={busy}>Admin</button>
            </div>
            <input name="name" value={form.name} onChange={update} placeholder="Full name" autoComplete="name" disabled={busy} required />
            <input type="email" name="email" value={form.email} onChange={update} placeholder="Email address" autoComplete="email" disabled={busy} required />
            <PhoneField name="phone" value={form.phone} onChange={update} disabled={busy} />
            <input name="address" value={form.address} onChange={update} placeholder="Address" autoComplete="street-address" disabled={busy} required />
          </>
        )}

        {mode === 'login' && (
          <input name="identifier" value={form.identifier} onChange={update} placeholder="Email or phone" autoComplete="username" disabled={busy} required />
        )}

        <input type="password" name="password" value={form.password} onChange={update} placeholder="Password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} disabled={busy} required />
        {mode === 'signup' && (
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={update} placeholder="Confirm password" autoComplete="new-password" disabled={busy} required />
        )}

        <button className="btn btn--primary" disabled={busy} aria-busy={busy}>
          {busy && <span className="btn__spinner" aria-hidden="true" />}
          {busy ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Login'}
        </button>
      </form>
    </section>
  )
}
