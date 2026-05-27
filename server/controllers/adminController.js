import Order from '../models/Order.js'
import User from '../models/User.js'

const allowedStatuses = ['Preparing', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled']

export async function dashboard(req, res) {
  const [totalUsers, totals, statusTotals, recentOrders] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Order.aggregate([{ $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$total' } } }]),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Order.find().populate('user', 'name email lastLoginAt').sort({ createdAt: -1 }).limit(8),
  ])
  const counts = Object.fromEntries(statusTotals.map((row) => [row._id, row.count]))
  res.json({
    totalUsers,
    totalOrders: totals[0]?.count || 0,
    revenue: totals[0]?.revenue || 0,
    pendingOrders: (counts['Order Placed'] || 0) + (counts.Preparing || 0) + (counts.Packed || 0) + (counts['Out for Delivery'] || 0),
    deliveredOrders: counts.Delivered || 0,
    cancelledOrders: counts.Cancelled || 0,
    recentOrders,
  })
}

export async function listOrders(req, res) {
  const query = {}
  if (req.query.status) query.status = req.query.status
  if (req.query.search) {
    const pattern = { $regex: String(req.query.search), $options: 'i' }
    query.$or = [{ orderId: pattern }, { customerName: pattern }, { deliveryAddress: pattern }]
  }
  res.json(await Order.find(query).populate('user', 'name email phone lastLoginAt').sort({ createdAt: -1 }))
}

export async function updateStatus(req, res) {
  const status = String(req.body.status || '')
  if (!allowedStatuses.includes(status)) return res.status(400).json({ error: 'Invalid order status.' })
  const order = await Order.findById(req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found.' })
  order.status = status
  order.timeline.push({ status })
  await order.save()
  res.json(order)
}

export async function deleteOrder(req, res) {
  const order = await Order.findByIdAndDelete(req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found.' })
  res.status(204).send()
}
