import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'
import useToast from '../context/useToast'

const statuses = ['Order Placed', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled']

export default function AdminDashboard() {
  const notify = useToast()
  const [metrics, setMetrics] = useState(null)
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const load = useCallback(async () => {
    try {
      const query = new URLSearchParams()
      if (search) query.set('search', search)
      if (status) query.set('status', status)
      const [dashboard, allOrders] = await Promise.all([
        api('/admin/dashboard'),
        api(`/admin/orders?${query}`),
      ])
      setMetrics(dashboard)
      setOrders(allOrders)
    } catch (error) {
      notify(error.message, 'error')
    }
  }, [notify, search, status])

  useEffect(() => {
    let active = true
    const query = new URLSearchParams()
    if (search) query.set('search', search)
    if (status) query.set('status', status)
    Promise.all([api('/admin/dashboard'), api(`/admin/orders?${query}`)])
      .then(([dashboard, allOrders]) => {
        if (!active) return
        setMetrics(dashboard)
        setOrders(allOrders)
      })
      .catch((error) => notify(error.message, 'error'))
    return () => { active = false }
  }, [notify, search, status])

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

  return (
    <section className="admin-page">
      <header className="admin-header">
        <p className="eyebrow">Operations center</p>
        <h1>Admin Dashboard</h1>
      </header>
      {metrics && (
        <>
          <section className="metric-grid">
            <article className="glass"><span>Total Users</span><strong>{metrics.totalUsers}</strong></article>
            <article className="glass"><span>Total Orders</span><strong>{metrics.totalOrders}</strong></article>
            <article className="glass"><span>Revenue</span><strong>Rs. {metrics.revenue.toFixed(2)}</strong></article>
            <article className="glass"><span>Pending Orders</span><strong>{metrics.pendingOrders}</strong></article>
            <article className="glass"><span>Delivered Orders</span><strong>{metrics.deliveredOrders}</strong></article>
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
                    <strong>Rs. {order.total.toFixed(2)}</strong>
                    <time>{new Date(order.createdAt).toLocaleString()}</time>
                  </footer>
                </article>
              ))}
              {!metrics.recentOrders.length && <p className="muted">No orders have been placed yet.</p>}
            </div>
          </section>
        </>
      )}
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
                  <td>Rs. {order.total}</td>
                  <td>
                    <select value={order.status} onChange={(event) => setOrderStatus(order._id, event.target.value)}>
                      {statuses.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </td>
                  <td>{order.user?.lastLoginAt ? new Date(order.user.lastLoginAt).toLocaleString() : 'No record'}</td>
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
