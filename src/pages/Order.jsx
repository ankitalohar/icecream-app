import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../services/api'
import useAuth from '../context/useAuth'
import useCart from '../context/useCart'
import useToast from '../context/useToast'
import orderImage from '../assets/p35.jpg'

export default function Order() {
  const { user, toggleWishlist } = useAuth()
  const { items: cart, totals, add, updateQuantity, refresh, clear } = useCart()
  const notify = useToast()
  const [params] = useSearchParams()
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('All')
  const [cartOpen, setCartOpen] = useState(() => params.get('cart') === 'open')
  const [placing, setPlacing] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)

  useEffect(() => {
    api('/products').then(setProducts).catch((error) => notify(error.message, 'error'))
  }, [notify])

  useEffect(() => {
    const openCart = () => setCartOpen(true)
    window.addEventListener('vivelle:open-cart', openCart)
    return () => window.removeEventListener('vivelle:open-cart', openCart)
  }, [])

  const tags = ['All', ...new Set(products.map((product) => product.tag).filter(Boolean))]
  const filtered = useMemo(() => products.filter((product) => {
    const matchesTag = tag === 'All' || product.tag === tag
    const matchesText = !query || [product.name, product.description].some((value) => value.toLowerCase().includes(query.toLowerCase()))
    return matchesTag && matchesText
  }), [products, query, tag])

  function favorite(product) {
    toggleWishlist(product._id)
      .then(() => notify('Favorites updated'))
      .catch((error) => notify(error.message, 'error'))
  }

  async function placeOrder() {
    if (!cart.length) return notify('Your cart is empty.', 'error')
    setPlacing(true)
    try {
      const order = await api('/orders', {
        method: 'POST',
        body: JSON.stringify({ deliveryAddress: user.address }),
      })
      clear()
      await refresh()
      setCartOpen(false)
      setPlacedOrder(order)
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setPlacing(false)
    }
  }

  const isFavorite = (id) => user.wishlist?.some((item) => String(item._id || item) === id)

  return (
    <section className="commerce-page">
      <header className="commerce-hero glass">
        <div>
          <p className="eyebrow">Delivered chilled</p>
          <h1>Build your perfect dessert drop.</h1>
          <p>Handmade flavors, live tracking, and contactless delivery to {user.address}.</p>
          <Link className="btn btn--outline" to="/profile">Manage address</Link>
        </div>
        <img src={orderImage} alt="Premium ice cream assortment" />
      </header>

      <section className="catalog-toolbar glass">
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search flavors..." />
        <div className="chips">
          {tags.slice(0, 7).map((item) => (
            <button className={tag === item ? 'active' : ''} type="button" key={item} onClick={() => setTag(item)}>{item}</button>
          ))}
        </div>
      </section>

      <section className="product-grid">
        {filtered.map((product) => (
          <article className="product-card glass" key={product._id}>
            <div className="product-card__visual">
              <img src={product.image} alt={product.name} />
              <button className={isFavorite(product._id) ? 'favorite active' : 'favorite'} type="button" onClick={() => favorite(product)}>
                {isFavorite(product._id) ? 'Saved' : 'Save'}
              </button>
            </div>
            <div className="product-card__body">
              <p className="product-card__rating">{product.rating} star | {product.tag}</p>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <footer><strong>Rs. {product.price}</strong><button className="btn btn--primary" type="button" onClick={() => { add(product); setCartOpen(true) }}>Add</button></footer>
            </div>
          </article>
        ))}
      </section>

      <button type="button" className="cart-trigger" onClick={() => setCartOpen(true)}>
        Cart <span>{cart.reduce((count, line) => count + line.quantity, 0)}</span>
      </button>
      <aside className={`checkout-drawer glass ${cartOpen ? 'open' : ''}`}>
        <header><h2>Your cart</h2><button type="button" onClick={() => setCartOpen(false)}>Close</button></header>
        {!cart.length && <p className="muted">Add a flavor to start your order.</p>}
        {cart.map(({ product, quantity }) => (
          <article className="checkout-item" key={product._id}>
            <img src={product.image} alt="" />
            <div><strong>{product.name}</strong><span>Rs. {product.price * quantity}</span></div>
            <div className="quantity">
              <button type="button" onClick={() => updateQuantity(product._id, quantity - 1)}>-</button>
              {quantity}
              <button type="button" onClick={() => updateQuantity(product._id, quantity + 1)}>+</button>
            </div>
          </article>
        ))}
        <dl className="totals">
          <div><dt>Subtotal</dt><dd>Rs. {totals.subtotal}</dd></div>
          <div><dt>GST (5%)</dt><dd>Rs. {totals.tax}</dd></div>
          <div><dt>Delivery</dt><dd>{totals.deliveryCharge ? `Rs. ${totals.deliveryCharge}` : 'Free'}</dd></div>
          <div className="total"><dt>Total</dt><dd>Rs. {totals.total}</dd></div>
        </dl>
        <button className="btn btn--primary checkout-button" disabled={placing || !cart.length} onClick={placeOrder}>
          {placing ? 'Placing order...' : 'Place Order'}
        </button>
      </aside>

      {placedOrder && (
        <section className="modal-backdrop">
          <div className="success-modal glass">
            <div className="success-check">OK</div>
            <h2>Your Order Has Been Successfully Placed</h2>
            <p>Order ID <strong>{placedOrder.orderId}</strong></p>
            <p>Estimated delivery: {new Date(placedOrder.estimatedDeliveryAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <Link className="btn btn--primary" to={`/track/${placedOrder.orderId}`}>Track Order</Link>
            <button className="text-button" type="button" onClick={() => setPlacedOrder(null)}>Keep shopping</button>
          </div>
        </section>
      )}
    </section>
  )
}
