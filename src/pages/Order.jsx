import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../services/api'
import useAuth from '../context/useAuth'
import useCart from '../context/useCart'
import useToast from '../context/useToast'
import formatCurrency from '../utils/currency'
import { orderCategories, orderProducts } from '../data/orderProducts'
import { popularPicks } from '../data/popularPicks'
import OrderProductCard from '../components/OrderProductCard'
import orderImage from '../assets/o13.jpg'

export default function Order() {
  const { user } = useAuth()
  const { items: cart, totals, add, updateQuantity, refresh, clear } = useCart()
  const notify = useToast()
  const [params] = useSearchParams()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [cartOpen, setCartOpen] = useState(() => params.get('cart') === 'open')
  const [placing, setPlacing] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)

  useEffect(() => {
    const openCart = () => setCartOpen(true)
    window.addEventListener('vivelle:open-cart', openCart)
    return () => window.removeEventListener('vivelle:open-cart', openCart)
  }, [])

  const filtered = useMemo(() => orderProducts.filter((product) => {
    const matchesTag = category === 'all' || product.category === category
    const matchesText = !query || [product.name, product.description].some((value) => value.toLowerCase().includes(query.toLowerCase()))
    return matchesTag && matchesText
  }), [category, query])

  const filteredPopularPicks = useMemo(() => popularPicks.filter((product) => {
    const matchesTag = category === 'all' || product.category === category
    const matchesText = !query || [product.name, product.description].some((value) => value.toLowerCase().includes(query.toLowerCase()))
    return matchesTag && matchesText
  }), [category, query])

  const productSections = useMemo(() => orderCategories
    .filter((item) => item.value !== 'all')
    .map((item) => ({
      ...item,
      products: filtered.filter((product) => product.category === item.value),
    }))
    .filter((item) => item.products.length), [filtered])

  async function placeOrder() {
    if (!cart.length) return notify('Your cart is empty.', 'error')
    const hasLocalCatalogItems = cart.some(({ product }) => product.localCatalog)
    setPlacing(true)
    try {
      const order = hasLocalCatalogItems
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
      setCartOpen(false)
      setPlacedOrder(order)
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setPlacing(false)
    }
  }

  function addToCart(product) {
    add(product)
    setCartOpen(true)
  }

  return (
    <section className="commerce-page">
      <header className="commerce-hero glass">
        <div>
          <p className="eyebrow">Delivered chilled</p>
          <h1>Build your perfect dessert drop.</h1>
          <p>Ice creams, thick shakes, and fresh rolls delivered chilled to {user.address}.</p>
          <Link className="btn btn--outline" to="/profile">Manage address</Link>
        </div>
        <img src={orderImage} alt="Premium ice cream assortment" />
      </header>

      <section className="catalog-toolbar glass">
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search flavors..." />
        <div className="chips">
          {orderCategories.map((item) => (
            <button className={category === item.value ? 'active' : ''} type="button" key={item.value} onClick={() => setCategory(item.value)}>{item.label}</button>
          ))}
        </div>
      </section>

      <section className="order-catalog">
        {!!filteredPopularPicks.length && (
          <section className="order-category-section">
            <header className="order-category-section__header">
              <p className="eyebrow">{filteredPopularPicks.length} favorites</p>
              <h2>Popular Picks</h2>
            </header>
            <section className="popular__grid order-product-grid">
              {filteredPopularPicks.map((product) => {
                console.log(product.name, product.image)
                return <OrderProductCard key={product._id} product={product} onAdd={addToCart} />
              })}
            </section>
          </section>
        )}

        {productSections.map((section) => (
          <section className="order-category-section" key={section.value}>
            <header className="order-category-section__header">
              <p className="eyebrow">{section.products.length} treats</p>
              <h2>{section.label}</h2>
            </header>
            <section className="popular__grid order-product-grid">
              {section.products.map((product) => (
                <OrderProductCard key={product._id} product={product} onAdd={addToCart} />
              ))}
            </section>
          </section>
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
            <div><strong>{product.name}</strong><span>{formatCurrency(product.price * quantity)}</span></div>
            <div className="quantity">
              <button type="button" onClick={() => updateQuantity(product._id, quantity - 1)}>-</button>
              {quantity}
              <button type="button" onClick={() => updateQuantity(product._id, quantity + 1)}>+</button>
            </div>
          </article>
        ))}
        <dl className="totals">
          <div><dt>Subtotal</dt><dd>{formatCurrency(totals.subtotal)}</dd></div>
          <div><dt>GST (5%)</dt><dd>{formatCurrency(totals.tax)}</dd></div>
          <div><dt>Delivery fee</dt><dd>{totals.deliveryCharge ? formatCurrency(totals.deliveryCharge) : 'Free'}</dd></div>
          <div className="total"><dt>Grand total</dt><dd>{formatCurrency(totals.total)}</dd></div>
        </dl>
        <button className="btn btn--primary checkout-button" disabled={placing || !cart.length} onClick={placeOrder}>
          {placing ? 'Placing order...' : 'Place Order'}
        </button>
      </aside>

      {placedOrder && (
        <section className="modal-backdrop">
          <div className="success-modal glass">
            <div className="success-check">OK</div>
            <h2>Order Successfully Placed</h2>
            <p>Order ID <strong>{placedOrder.orderId}</strong></p>
            <p>Estimated delivery time: {new Date(placedOrder.estimatedDeliveryAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <Link className="btn btn--primary" to={`/track/${placedOrder.orderId}`}>Track Order</Link>
            <button className="text-button" type="button" onClick={() => setPlacedOrder(null)}>Keep shopping</button>
          </div>
        </section>
      )}
    </section>
  )
}
