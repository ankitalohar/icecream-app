import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import useAuth from '../context/useAuth'
import useCart from '../context/useCart'
import useToast from '../context/useToast'

export default function Profile() {
  const { user, logout, updateProfile } = useAuth()
  const { items: savedCart } = useCart()
  const notify = useToast()
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ ...user })
  const [saving, setSaving] = useState(false)
  const [newAddress, setNewAddress] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api('/orders').then(setOrders).catch((error) => notify(error.message, 'error'))
  }, [notify])

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function uploadPhoto(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 1024 * 1024) return notify('Profile images must be under 1 MB.', 'error')
    const reader = new FileReader()
    reader.onload = () => setForm((current) => ({ ...current, profilePhoto: reader.result }))
    reader.readAsDataURL(file)
  }

  async function save(event) {
    event.preventDefault()
    setSaving(true)
    try {
      await updateProfile(form)
      notify('Profile updated.')
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  function addAddress() {
    const address = newAddress.trim()
    if (!address) return
    setForm((current) => ({
      ...current,
      addresses: [...(current.addresses || []), { label: 'Alternate', address }].slice(0, 5),
    }))
    setNewAddress('')
  }

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <section className="profile-page">
      <form id="profile" className="profile-card glass" onSubmit={save}>
        <h1>My Profile</h1>
        <label className="avatar-upload">
          {form.profilePhoto ? <img src={form.profilePhoto} alt="Profile" /> : <span>{user.name.charAt(0)}</span>}
          <input type="file" accept="image/*" onChange={uploadPhoto} />
          Change photo
        </label>
        <input name="name" value={form.name} onChange={change} placeholder="Full name" required />
        <input name="email" type="email" value={form.email} onChange={change} placeholder="Email" required />
        <input name="phone" value={form.phone} onChange={change} placeholder="Mobile number" required />
        <textarea name="address" value={form.address} onChange={change} placeholder="Delivery address" required />
        <div id="addresses" className="address-manager">
          <strong>Saved delivery addresses</strong>
          {(form.addresses || []).map((entry) => (
            <button type="button" key={entry._id || entry.address} onClick={() => setForm((current) => ({ ...current, address: entry.address }))}>
              {entry.label}: {entry.address}
            </button>
          ))}
          <div>
            <input value={newAddress} onChange={(event) => setNewAddress(event.target.value)} placeholder="Add another address" />
            <button type="button" onClick={addAddress}>Add</button>
          </div>
        </div>
        <button className="btn btn--primary" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
        <button type="button" className="profile-logout" onClick={handleLogout}>Logout</button>
      </form>
      <section id="history" className="history-card glass">
        <h2>Saved Cart</h2>
        {!savedCart.length && <p className="muted">Your cart is empty.</p>}
        {savedCart.map((line) => (
          <p className="saved-cart-line" key={line.product._id}>{line.product.name} x{line.quantity} <strong>Rs. {line.product.price * line.quantity}</strong></p>
        ))}
        <h2>Order History</h2>
        {!orders.length && <p className="muted">No orders placed yet. Your saved cart remains available on the order page.</p>}
        {orders.map((order) => (
          <article className="history-order" key={order.orderId}>
            <div><strong>{order.orderId}</strong><span>{new Date(order.createdAt).toLocaleString()}</span></div>
            <p>{order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}</p>
            <div><strong>Rs. {order.total}</strong><span className="status-pill">{order.status}</span></div>
            <Link to={`/track/${order.orderId}`}>Track order</Link>
          </article>
        ))}
      </section>
    </section>
  )
}
