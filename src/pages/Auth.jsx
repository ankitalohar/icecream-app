import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import useAuth from '../context/useAuth'
import useToast from '../context/useToast'

const initial = { name: '', email: '', phone: '', address: '', code: '' }

export default function Auth() {
  const { user, loading, requestOtp, verifyOtp } = useAuth()
  const notify = useToast()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('user')
  const [channel, setChannel] = useState('email')
  const [step, setStep] = useState('request')
  const [form, setForm] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [devCode, setDevCode] = useState('')

  if (loading) return <p className="page-state">Restoring your session...</p>
  if (user) return <Navigate to={user.role === 'admin' ? '/dashboard' : '/order'} replace />

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function reset(nextMode = mode, nextRole = role) {
    setMode(nextMode)
    setRole(nextRole)
    setStep('request')
    setDevCode('')
    setForm((current) => ({ ...current, code: '' }))
  }

  async function submit(event) {
    event.preventDefault()
    const identifier = channel === 'email' ? form.email : form.phone
    setBusy(true)
    try {
      if (step === 'request') {
        const data = await requestOtp({ purpose: mode, role, channel, identifier })
        setDevCode(data.devCode || '')
        setStep('verify')
        notify(data.message)
        return
      }
      const user = await verifyOtp({
        purpose: mode,
        role,
        channel,
        identifier,
        code: form.code,
        ...(mode === 'signup' ? form : {}),
      })
      notify(`Welcome, ${user.name}`)
      navigate(user.role === 'admin' ? '/dashboard' : '/order', { replace: true })
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="auth-shell">
      <aside className="auth-promo">
        <p className="eyebrow">Vivelle access</p>
        <h1>Order artisan scoops in seconds.</h1>
        <p>OTP protected checkout, saved carts, and live delivery progress in one premium experience.</p>
        <div className="auth-promo__orb" />
      </aside>
      <form className="glass auth-form" onSubmit={submit}>
        <div className="segmented">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => reset('login', role)}>Login</button>
          {role === 'user' && <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => reset('signup', 'user')}>Sign Up</button>}
        </div>
        <div className="role-picker">
          <button type="button" className={role === 'user' ? 'active' : ''} onClick={() => reset(mode, 'user')}>User Login</button>
          <button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => reset('login', 'admin')}>Admin Login</button>
        </div>
        <h2>{step === 'verify' ? 'Verify your OTP' : mode === 'signup' ? 'Create account' : 'Welcome back'}</h2>
        <div className="channel-picker">
          <button type="button" className={channel === 'email' ? 'active' : ''} onClick={() => { setChannel('email'); reset() }}>Email OTP</button>
          <button type="button" className={channel === 'phone' ? 'active' : ''} onClick={() => { setChannel('phone'); reset() }}>Mobile OTP</button>
        </div>
        {mode === 'signup' && step === 'request' && (
          <>
            <input name="name" value={form.name} onChange={update} placeholder="Full name" required />
            <input name="address" value={form.address} onChange={update} placeholder="Delivery address" required />
          </>
        )}
        {step === 'request' && (mode === 'signup' || channel === 'email') && (
          <input type="email" name="email" value={form.email} onChange={update} placeholder="Email address" required />
        )}
        {step === 'request' && (mode === 'signup' || channel === 'phone') && (
          <input name="phone" value={form.phone} onChange={update} placeholder="+919876543210" required />
        )}
        {step === 'verify' && (
          <>
            <input name="code" value={form.code} onChange={update} placeholder="6-digit OTP" inputMode="numeric" maxLength="6" required />
            {devCode && <p className="dev-otp">Development OTP: <strong>{devCode}</strong></p>}
          </>
        )}
        <button className="btn btn--primary" disabled={busy}>{busy ? 'Please wait...' : step === 'verify' ? 'Verify and continue' : 'Send OTP'}</button>
        {step === 'verify' && <button type="button" className="text-button" onClick={() => reset()}>Request another code</button>}
        {role === 'user' && mode === 'login' && step === 'request' && (
          <button type="button" className="text-button" onClick={() => reset('forgot-password', 'user')}>Recover access with OTP</button>
        )}
      </form>
    </section>
  )
}
