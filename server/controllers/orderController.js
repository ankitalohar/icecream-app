import { randomBytes } from 'node:crypto'
import Cart from '../models/Cart.js'
import Order from '../models/Order.js'

function orderNumber() {
  return `VIV-${Date.now().toString().slice(-8)}-${randomBytes(2).toString('hex').toUpperCase()}`
}

export async function placeOrder(req, res) {
  const cart = await Cart.findOne({ user: req.account._id }).populate('items.product')
  if (!cart?.items.length) return res.status(400).json({ error: 'Your cart is empty.' })
  const items = cart.items.filter((line) => line.product?.active).map((line) => ({
    product: line.product._id,
    name: line.product.name,
    image: line.product.image,
    price: line.product.price,
    quantity: line.quantity,
  }))
  if (!items.length) return res.status(400).json({ error: 'No products in your cart are currently available.' })
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Number((subtotal * 0.05).toFixed(2))
  const deliveryCharge = subtotal >= 499 ? 0 : 49
  const estimatedDeliveryAt = new Date(Date.now() + 40 * 60 * 1000)
  const deliveryAddress = String(req.body.deliveryAddress || req.account.address || '').trim()
  if (!deliveryAddress) return res.status(400).json({ error: 'A delivery address is required.' })
  const order = await Order.create({
    orderId: orderNumber(),
    user: req.account._id,
    customerName: req.account.name,
    deliveryAddress,
    items,
    subtotal,
    tax,
    deliveryCharge,
    total: subtotal + tax + deliveryCharge,
    timeline: [{ status: 'Order Placed' }],
    estimatedDeliveryAt,
  })
  cart.items = []
  await cart.save()
  res.status(201).json(order)
}

export async function myOrders(req, res) {
  res.json(await Order.find({ user: req.account._id }).sort({ createdAt: -1 }))
}

export async function trackOrder(req, res) {
  const order = await Order.findOne({ orderId: req.params.orderId, user: req.account._id })
  if (!order) return res.status(404).json({ error: 'Order not found.' })
  res.json(order)
}
