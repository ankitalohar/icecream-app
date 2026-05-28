import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import useAuth from '../context/useAuth'
import useCart from '../context/useCart'
import useToast from '../context/useToast'
import formatCurrency from '../utils/currency'

export default function Cart() {
  const { user } = useAuth()
  const { items, totals, updateQuantity, clear, refresh } = useCart()
  const notify = useToast()
  const [placing, setPlacing] = useState(false)
  const [order, setOrder] = useState(null)

  async function placeOrder() {
    if (!items.length) return
    const hasLocalCatalogItems = items.some(({ product }) => product.localCatalog)
    setPlacing(true)
    try {
      const placed = hasLocalCatalogItems
        ? {
            orderId: `VIV-${Date.now().toString().slice(-6)}`,
            estimatedDeliveryAt: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
          }
        : await api('/orders', {
            method: 'POST',
            body: JSON.stringify({ deliveryAddress: user.address }),
          })
      clear()
      if (!hasLocalCatalogItems) await refresh()
      setOrder(placed)
      notify('Order Successfully Placed')
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <section className="cart-page">
      <header className="cart-heading">
        <div>
          <p className="eyebrow">Secure checkout</p>
          <h1>Your Cart</h1>
        </div>
        <Link to="/order" className="btn btn--outline">Continue shopping</Link>
      </header>
      <div className="cart-layout">
        <section className="cart-lines glass">
          {!items.length && <div className="empty-cart"><h2>Your cart is empty</h2><p>Choose a handcrafted scoop to start your order.</p><Link className="btn btn--primary" to="/order">Browse flavours</Link></div>}
          {items.map(({ product, quantity }) => (
            <article className="cart-line" key={product._id}>
              <img src={product.image} alt={product.name} />
              <div className="cart-line__copy">
                <h2>{product.name}</h2>
                <p>{formatCurrency(product.price)} each</p>
              </div>
              <div className="quantity" aria-label={`Quantity for ${product.name}`}>
                <button type="button" onClick={() => updateQuantity(product._id, quantity - 1)} aria-label="Decrease quantity">-</button>
                <strong>{quantity}</strong>
                <button type="button" onClick={() => updateQuantity(product._id, quantity + 1)} aria-label="Increase quantity">+</button>
              </div>
              <strong className="cart-line__total">{formatCurrency(product.price * quantity)}</strong>
            </article>
          ))}
        </section>
        <aside className="cart-summary glass">
          <h2>Order Summary</h2>
          <p className="delivery-address"><span>Deliver to</span>{user.address}</p>
          <dl className="totals">
            <div><dt>Subtotal</dt><dd>{formatCurrency(totals.subtotal)}</dd></div>
            <div><dt>Taxes (GST 5%)</dt><dd>{formatCurrency(totals.tax)}</dd></div>
            <div><dt>Delivery fee</dt><dd>{totals.deliveryCharge ? formatCurrency(totals.deliveryCharge) : 'Free'}</dd></div>
            <div className="total"><dt>Grand total</dt><dd>{formatCurrency(totals.total)}</dd></div>
          </dl>
          <button className="btn btn--primary checkout-button" type="button" onClick={placeOrder} disabled={!items.length || placing}>
            {placing ? 'Placing order...' : 'Place Order'}
          </button>
        </aside>
      </div>
      {order && (
        <section className="modal-backdrop">
          <div className="success-modal glass" role="dialog" aria-modal="true">
            <div className="success-check">OK</div>
            <h2>Order Successfully Placed</h2>
            <p>Order ID <strong>{order.orderId}</strong></p>
            <p>Estimated delivery time: {new Date(order.estimatedDeliveryAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <Link className="btn btn--primary" to={`/track/${order.orderId}`}>Track Order</Link>
            <button className="text-button" type="button" onClick={() => setOrder(null)}>Close</button>
          </div>
        </section>
      )}
    </section>
  )
}
