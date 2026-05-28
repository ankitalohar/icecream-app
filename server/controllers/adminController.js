import { randomUUID } from 'node:crypto'
import Cart from '../models/Cart.js'
import Contact from '../models/Contact.js'
import Order from '../models/Order.js'
import User from '../models/User.js'
import { deleteFirestoreDocument, syncAdminActivity, syncContact, syncOrder } from '../services/firestore.js'

const allowedStatuses = ['Preparing', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled']

export async function dashboard(req, res) {
  const [totalUsers, activeUsers, totals, statusTotals, recentOrders, recentUsers, carts] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'user', loginStatus: true }),
    Order.aggregate([{ $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$total' } } }]),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Order.find().populate('user', 'name email lastLoginAt').sort({ createdAt: -1 }).limit(8),
    User.find({ role: 'user' }).select('name email loginStatus lastLoginAt').sort({ lastLoginAt: -1 }).limit(8),
    Cart.find().populate('items.product', 'price'),
  ])
  const counts = Object.fromEntries(statusTotals.map((row) => [row._id, row.count]))
  const cartSummary = carts.reduce((summary, cart) => {
    cart.items.forEach((item) => {
      if (!item.product) return
      summary.items += item.quantity
      summary.total += item.product.price * item.quantity
    })
    return summary
  }, { items: 0, total: 0 })
  res.json({
    totalUsers,
    activeUsers,
    totalOrders: totals[0]?.count || 0,
    revenue: totals[0]?.revenue || 0,
    pendingOrders: (counts['Order Placed'] || 0) + (counts.Preparing || 0) + (counts.Packed || 0) + (counts['Out for Delivery'] || 0),
    deliveredOrders: counts.Delivered || 0,
    cancelledOrders: counts.Cancelled || 0,
    recentOrders,
    recentUsers,
    cartItems: cartSummary.items,
    cartTotal: cartSummary.total,
  })
}

export async function listOrders(req, res) {
  const query = {}
  if (req.query.status) query.status = req.query.status
  if (req.query.search) {
    const pattern = { $regex: String(req.query.search), $options: 'i' }
    query.$or = [{ orderId: pattern }, { customerName: pattern }, { deliveryAddress: pattern }]
  }
  res.json(await Order.find(query).populate('user', 'name email phone lastLoginAt loginStatus').sort({ createdAt: -1 }))
}

export async function listContacts(req, res) {
  const query = {}
  if (req.query.status === 'read') query.read = true
  if (req.query.status === 'unread') query.read = false
  if (req.query.search) {
    const pattern = { $regex: String(req.query.search), $options: 'i' }
    query.$or = [{ name: pattern }, { email: pattern }, { subject: pattern }, { message: pattern }]
  }
  res.json(await Contact.find(query).sort({ timestamp: -1, createdAt: -1 }))
}

export async function updateContactReadStatus(req, res) {
  const contact = await Contact.findById(req.params.id)
  if (!contact) return res.status(404).json({ error: 'Contact message not found.' })
  contact.read = Boolean(req.body.read)
  await contact.save()
  await Promise.all([
    syncContact(contact),
    syncAdminActivity(randomUUID(), {
      adminId: String(req.account._id),
      action: contact.read ? 'contact-mark-read' : 'contact-mark-unread',
      contactId: String(contact._id),
      createdAt: new Date(),
    }),
  ])
  res.json(contact)
}

export async function updateStatus(req, res) {
  const status = String(req.body.status || '')
  if (!allowedStatuses.includes(status)) return res.status(400).json({ error: 'Invalid order status.' })
  const order = await Order.findById(req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found.' })
  order.status = status
  order.timeline.push({ status })
  await order.save()
  await Promise.all([
    syncOrder(order),
    syncAdminActivity(randomUUID(), {
      adminId: String(req.account._id),
      action: 'order-status-update',
      orderId: order.orderId,
      status,
      createdAt: new Date(),
    }),
  ])
  res.json(order)
}

export async function deleteOrder(req, res) {
  const order = await Order.findByIdAndDelete(req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found.' })
  await Promise.all([
    deleteFirestoreDocument('orders', order.orderId),
    syncAdminActivity(randomUUID(), {
      adminId: String(req.account._id),
      action: 'order-delete',
      orderId: order.orderId,
      createdAt: new Date(),
    }),
  ])
  res.status(204).send()
}

export async function deleteContact(req, res) {
  const contact = await Contact.findByIdAndDelete(req.params.id)
  if (!contact) return res.status(404).json({ error: 'Contact message not found.' })
  await Promise.all([
    deleteFirestoreDocument('contacts', contact._id),
    syncAdminActivity(randomUUID(), {
      adminId: String(req.account._id),
      action: 'contact-delete',
      contactId: String(contact._id),
      createdAt: new Date(),
    }),
  ])
  res.status(204).send()
}
