import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
import useToast from '../context/useToast'
import formatCurrency from '../utils/currency'
import { watchAdminOrders, watchContactMessages } from '../services/firebaseAuth'

const statuses = ['Order Placed', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled']

export default function AdminDashboard() {
  const notify = useToast()
  const [metrics, setMetrics] = useState(null)
  const [orders, setOrders] = useState([])
  const [contacts, setContacts] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [messageSearch, setMessageSearch] = useState('')
  const [messageStatus, setMessageStatus] = useState('')

  const unreadMessages = useMemo(
    () => contacts.filter((message) => !message.read).length,
    [contacts],
  )
  const filteredContacts = useMemo(() => {
    const term = messageSearch.trim().toLowerCase()
    return contacts.filter((message) => {
      const matchesStatus = !messageStatus
        || (messageStatus === 'read' && message.read)
        || (messageStatus === 'unread' && !message.read)
      const matchesSearch = !term
        || [message.name, message.email, message.subject, message.message]
          .some((value) => String(value || '').toLowerCase().includes(term))
      return matchesStatus && matchesSearch
    })
  }, [contacts, messageSearch, messageStatus])

  const load = useCallback(async () => {
    try {
      const query = new URLSearchParams()
      if (search) query.set('search', search)
      if (status) query.set('status', status)
      const [dashboard, allOrders, allContacts] = await Promise.all([
        api('/admin/dashboard'),
        api(`/admin/orders?${query}`),
        api('/admin/contacts'),
      ])
      setMetrics(dashboard)
      setOrders(allOrders)
      setContacts(allContacts)
    } catch (error) {
      notify(error.message, 'error')
    }
  }, [notify, search, status])

  useEffect(() => {
    const timer = window.setTimeout(load, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  useEffect(() => {
    let unsubscribe = () => {}
    let active = true
    watchAdminOrders(() => {
      if (active) load()
    }).then((stop) => {
      if (active) unsubscribe = stop
      else stop()
    })
    return () => {
      active = false
      unsubscribe()
    }
  }, [load])

  useEffect(() => {
    let unsubscribe = () => {}
    let active = true
    watchContactMessages(() => {
      if (active) load()
    }).then((stop) => {
      if (active) unsubscribe = stop
      else stop()
    })
    return () => {
      active = false
      unsubscribe()
    }
  }, [load])

  async function setOrderStatus(id, nextStatus) {
    try {
      await api(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: nextStatus }) })
      notify('Order status updated.')
      load()
    } catch (error) {
      notify(error.message, 'error')
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this order permanently?')) return
    try {
      await api(`/admin/orders/${id}`, { method: 'DELETE' })
      notify('Order deleted.')
      load()
    } catch (error) {
      notify(error.message, 'error')
    }
  }

  async function setMessageRead(id, read) {
    try {
      await api(`/admin/contacts/${id}/read`, { method: 'PATCH', body: JSON.stringify({ read }) })
      notify(read ? 'Message marked as read.' : 'Message marked as unread.')
      load()
    } catch (error) {
      notify(error.message, 'error')
    }
  }

  async function removeMessage(id) {
    if (!window.confirm('Delete this contact message permanently?')) return
    try {
      await api(`/admin/contacts/${id}`, { method: 'DELETE' })
      notify('Message deleted.')
      load()
    } catch (error) {
      notify(error.message, 'error')
    }
  }

  return (
    <section className="admin-page">
      <header className="admin-header">
        <p className="eyebrow">Operations center</p>
        <h1>
          Admin Dashboard
          <span className="admin-message-badge">Messages ({unreadMessages})</span>
        </h1>
      </header>
      {metrics && (
        <>
          <section className="metric-grid">
            <article className="glass"><span>Total Users</span><strong>{metrics.totalUsers}</strong></article>
            <article className="glass"><span>Total Orders</span><strong>{metrics.totalOrders}</strong></article>
            <article className="glass"><span>Revenue</span><strong>{formatCurrency(metrics.revenue)}</strong></article>
            <article className="glass"><span>Active Users</span><strong>{metrics.activeUsers}</strong></article>
            <article className="glass"><span>Pending Orders</span><strong>{metrics.pendingOrders}</strong></article>
            <article className="glass"><span>Items in Carts</span><strong>{metrics.cartItems}</strong></article>
            <article className="glass"><span>Cart Value</span><strong>{formatCurrency(metrics.cartTotal)}</strong></article>
          </section>
          <section className="recent-orders">
            <div className="admin-section-heading">
              <p className="eyebrow">User activity</p>
              <h2>Recent Logins</h2>
            </div>
            <div className="recent-orders__grid">
              {metrics.recentUsers.map((account) => (
                <article className="recent-order glass" key={account._id}>
                  <header>
                    <div>
                      <strong>{account.name}</strong>
                      <span>{account.email}</span>
                    </div>
                    <span className={`login-pill ${account.loginStatus ? 'online' : ''}`}>{account.loginStatus ? 'Active' : 'Offline'}</span>
                  </header>
                  <p>{account.lastLoginAt ? `Last login: ${new Date(account.lastLoginAt).toLocaleString()}` : 'No login recorded'}</p>
                </article>
              ))}
              {!metrics.recentUsers.length && <p className="muted">No customer activity has been recorded yet.</p>}
            </div>
          </section>
          <section className="recent-orders">
            <div className="admin-section-heading">
              <p className="eyebrow">Live fulfilment</p>
              <h2>Recent Orders</h2>
            </div>
            <div className="recent-orders__grid">
              {metrics.recentOrders.map((order) => (
                <article className="recent-order glass" key={order._id}>
                  <header>
                    <div>
                      <strong>{order.customerName}</strong>
                      <span>{order.orderId}</span>
                    </div>
                    <span className="status-pill">{order.status}</span>
                  </header>
                  <p>{order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}</p>
                  <p className="recent-order__address">{order.deliveryAddress}</p>
                  <footer>
                    <strong>{formatCurrency(order.total)}</strong>
                    <time>{new Date(order.createdAt).toLocaleString()}</time>
                  </footer>
                </article>
              ))}
              {!metrics.recentOrders.length && <p className="muted">No orders have been placed yet.</p>}
            </div>
          </section>
        </>
      )}
      <section className="contact-messages glass">
        <header className="contact-messages__header">
          <div>
            <p className="eyebrow">Realtime inbox</p>
            <h2>Contact Messages</h2>
          </div>
          <span className="contact-messages__count">{unreadMessages} unread</span>
        </header>
        <div className="contact-messages__tools">
          <input
            value={messageSearch}
            onChange={(event) => setMessageSearch(event.target.value)}
            placeholder="Search name, email, subject, or message"
          />
          <select value={messageStatus} onChange={(event) => setMessageStatus(event.target.value)}>
            <option value="">All messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
        <div className="contact-message-grid">
          {filteredContacts.map((message) => (
            <article className={`contact-message-card ${message.read ? '' : 'is-unread'}`} key={message._id}>
              <header>
                <div>
                  <strong>{message.name}</strong>
                  <a href={`mailto:${message.email}`}>{message.email}</a>
                </div>
                <span className={`message-status ${message.read ? 'is-read' : ''}`}>
                  {message.read ? 'Read' : 'Unread'}
                </span>
              </header>
              <h3>{message.subject}</h3>
              <p>{message.message}</p>
              <footer>
                <time>{new Date(message.timestamp || message.createdAt).toLocaleString()}</time>
                <div>
                  <button type="button" onClick={() => setMessageRead(message._id, !message.read)}>
                    {message.read ? 'Mark unread' : 'Mark read'}
                  </button>
                  <button type="button" className="danger-button" onClick={() => removeMessage(message._id)}>
                    Delete
                  </button>
                </div>
              </footer>
            </article>
          ))}
          {!filteredContacts.length && <p className="muted">No contact messages match the current filters.</p>}
        </div>
      </section>
      <section className="orders-table glass">
        <header>
          <h2>All Orders</h2>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order or customer" />
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </select>
        </header>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Order</th><th>Customer</th><th>Items / Address</th><th>Amount</th><th>Status</th><th>Login</th><th>Actions</th></tr></thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td><strong>{order.orderId}</strong><small>{new Date(order.createdAt).toLocaleString()}</small></td>
                  <td>{order.customerName}<small>{order.user?.email}</small></td>
                  <td>{order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}<small>{order.deliveryAddress}</small></td>
                  <td>{formatCurrency(order.total)}</td>
                  <td>
                    <select value={order.status} onChange={(event) => setOrderStatus(order._id, event.target.value)}>
                      {statuses.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </td>
                  <td><span className={`login-pill ${order.user?.loginStatus ? 'online' : ''}`}>{order.user?.loginStatus ? 'Active' : 'Offline'}</span><small>{order.user?.lastLoginAt ? new Date(order.user.lastLoginAt).toLocaleString() : 'No login record'}</small></td>
                  <td><button type="button" className="danger-button" onClick={() => remove(order._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}
