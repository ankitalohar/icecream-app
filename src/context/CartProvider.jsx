import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
import useAuth from './useAuth'
import useToast from './useToast'
import CartContext from './cart-context'

export default function CartProvider({ children }) {
  const { user } = useAuth()
  const notify = useToast()
  const [items, setItems] = useState([])

  const refresh = useCallback(async () => {
    if (!user || user.role !== 'user') return
    try {
      const data = await api('/cart')
      setItems(data.items)
    } catch (error) {
      notify(error.message, 'error')
    }
  }, [notify, user])

  useEffect(() => {
    if (user?.role === 'user') {
      let active = true
      api('/cart')
        .then((data) => { if (active) setItems(data.items) })
        .catch((error) => notify(error.message, 'error'))
      return () => { active = false }
    }
    const timer = window.setTimeout(() => setItems([]), 0)
    return () => window.clearTimeout(timer)
  }, [notify, user])

  async function persist(nextItems) {
    setItems(nextItems)
    if (nextItems.some((item) => item.product.localCatalog)) return
    try {
      const data = await api('/cart', {
        method: 'PUT',
        body: JSON.stringify({ items: nextItems.map((item) => ({ product: item.product._id, quantity: item.quantity })) }),
      })
      setItems(data.items)
    } catch (error) {
      notify(error.message, 'error')
      refresh()
    }
  }

  function add(product) {
    const existing = items.find((item) => item.product._id === product._id)
    const next = existing
      ? items.map((item) => item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...items, { product, quantity: 1 }]
    persist(next)
    notify(`${product.name} added to cart`)
  }

  function updateQuantity(productId, quantity) {
    const next = quantity < 1
      ? items.filter((item) => item.product._id !== productId)
      : items.map((item) => item.product._id === productId ? { ...item, quantity } : item)
    persist(next)
  }

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const tax = Math.round(subtotal * 0.05)
    const deliveryCharge = subtotal && subtotal < 499 ? 49 : 0
    return { subtotal, tax, deliveryCharge, total: subtotal + tax + deliveryCharge }
  }, [items])

  return (
    <CartContext.Provider value={{ items, totals, add, updateQuantity, refresh, clear: () => setItems([]) }}>
      {children}
    </CartContext.Provider>
  )
}
