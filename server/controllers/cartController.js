import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { syncCart } from '../services/firestore.js'

export async function getCart(req, res) {
  const cart = await Cart.findOne({ user: req.account._id }).populate('items.product')
  res.json({ items: cart?.items || [] })
}

export async function saveCart(req, res) {
  const input = Array.isArray(req.body.items) ? req.body.items : []
  if (input.length > 50) return res.status(400).json({ error: 'Cart is too large.' })
  const items = input
    .map((item) => ({ product: String(item.product || item.productId || ''), quantity: Number(item.quantity) }))
    .filter((item) => item.product && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 20)
  if (items.length !== input.length || new Set(items.map((item) => item.product)).size !== items.length) {
    return res.status(400).json({ error: 'Cart items and quantities are invalid.' })
  }
  const validProducts = await Product.find({ _id: { $in: items.map((item) => item.product) }, active: true })
  if (validProducts.length !== items.length) return res.status(400).json({ error: 'A cart product is invalid or unavailable.' })
  const cart = await Cart.findOneAndUpdate(
    { user: req.account._id },
    { items },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).populate('items.product')
  await syncCart(cart)
  res.json({ items: cart.items })
}
